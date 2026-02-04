import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const authError = searchParams.get("error");

    // Handle errors
    if (authError) {
      console.error("[BankID] Auth error:", authError);
      return NextResponse.redirect(
        new URL(`/login?error=${authError}`, request.url),
      );
    }

    if (!code || !state) {
      throw new Error("Missing code or state");
    }

    const cookieStore = await cookies();
    const storedState = cookieStore.get("bankid_state")?.value;
    const storedNonce = cookieStore.get("bankid_nonce")?.value;

    // Verify state (CSRF protection)
    if (state !== storedState) {
      throw new Error("Invalid state - possible CSRF attack");
    }

    // Exchange code for BankID tokens
    const subdomain = process.env.IDURA_SUBDOMAIN!;
    const baseUrl = subdomain.includes(".")
      ? subdomain
      : `${subdomain}.idura.broker`;

    const tokenResponse = await fetch(`https://${baseUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.IDURA_CLIENT_ID}:${process.env.IDURA_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: process.env.IDURA_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[BankID] Token exchange failed:", errorText);
      throw new Error("Failed to exchange token");
    }

    const tokens = await tokenResponse.json();

    // Decode ID token
    const idTokenPayload = JSON.parse(
      Buffer.from(tokens.id_token.split(".")[1], "base64").toString(),
    );

    // Verify nonce
    if (idTokenPayload.nonce !== storedNonce) {
      throw new Error("Invalid nonce - possible replay attack");
    }

    // Extract BankID user data
    const bankidData = {
      bankid_sub: idTokenPayload.sub,
      national_id: idTokenPayload.uniqueuserid,
      full_name: idTokenPayload.name,
      given_name: idTokenPayload.given_name,
      family_name: idTokenPayload.family_name,
      birth_date: idTokenPayload.birthdate,
      email: idTokenPayload.email || idTokenPayload.emailaddress,
      phone: idTokenPayload.phone_number || idTokenPayload.mobilephone,
      ssn: idTokenPayload.socialno,
    };

    // Create Supabase client with @supabase/ssr
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      },
    );

    // Initial check using the standard client
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("bankid_sub", bankidData.bankid_sub)
      .single();

    let userId: string;

    const { createClient: createAdminClient } =
      await import("@supabase/supabase-js");
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    if (existingProfile) {
      userId = existingProfile.user_id;

      await supabaseAdmin
        .from("profiles")
        .update({
          full_name: bankidData.full_name,
          given_name: bankidData.given_name,
          family_name: bankidData.family_name,
          birth_date: bankidData.birth_date,
          phone: bankidData.phone,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      const email =
        bankidData.email ||
        `${bankidData.bankid_sub.replace(/[{}]/g, "")}@bankid.local`;

      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: email,
          email_confirm: true,
          user_metadata: {
            bankid_sub: bankidData.bankid_sub,
            full_name: bankidData.full_name,
            provider: "bankid",
          },
        });

      if (createError) throw createError;
      userId = newUser.user.id;

      await supabaseAdmin.from("profiles").insert({
        user_id: userId,
        bankid_sub: bankidData.bankid_sub,
        national_id: bankidData.national_id,
        full_name: bankidData.full_name,
        given_name: bankidData.given_name,
        family_name: bankidData.family_name,
        birth_date: bankidData.birth_date,
        phone: bankidData.phone,
        ssn: bankidData.ssn,
        bankid_verified: true,
        verified_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      });
    }

    // Generate magic link
    const { data: sessionData, error: sessionError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email:
          bankidData.email ||
          `${bankidData.bankid_sub.replace(/[{}]/g, "")}@bankid.local`,
      });

    if (sessionError) throw sessionError;

    const linkUrl = new URL(sessionData.properties.action_link);
    const token = linkUrl.searchParams.get("token");

    if (!token) throw new Error("No token in magic link");

    // Verify OTP and set session cookies
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "magiclink",
    });

    if (verifyError) throw verifyError;

    // Clear temp cookies
    cookieStore.delete("bankid_state");
    cookieStore.delete("bankid_nonce");

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("[BankID] Callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=authentication_failed", request.url),
    );
  }
}
