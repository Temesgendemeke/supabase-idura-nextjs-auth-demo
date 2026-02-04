import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    // Generate security tokens
    const state = crypto.randomBytes(32).toString("hex");
    const nonce = crypto.randomBytes(32).toString("hex");

    const cookieStore = await cookies();

    // Store state and nonce in cookies
    cookieStore.set("bankid_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    cookieStore.set("bankid_nonce", nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    // Build Idura/Criipto authorization URL
    const subdomain = process.env.IDURA_SUBDOMAIN!;
    const baseUrl = subdomain.includes(".")
      ? subdomain
      : `${subdomain}.idura.broker`;

    const params = new URLSearchParams({
      client_id: process.env.IDURA_CLIENT_ID!,
      redirect_uri: process.env.IDURA_REDIRECT_URI!,
      response_type: "code",
      scope: "openid profile",
      state: state,
      nonce: nonce,
      acr_values:
        process.env.IDURA_ACR_VALUES || "urn:grn:authn:no:bankid:substantial",
      ui_locales: "en",
    });

    const authUrl = `https://${baseUrl}/oauth2/authorize?${params.toString()}`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("[BankID] Login error:", error);
    return NextResponse.json(
      { error: "Failed to initiate login" },
      { status: 500 },
    );
  }
}
