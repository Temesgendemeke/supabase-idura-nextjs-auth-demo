import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl">
          <h1 className="text-xl font-semibold text-gray-900 leading-tight">
            Profile not found
          </h1>
          <p className="text-gray-600 mt-2">
            Could not find your profile in the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans antialiased">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-linear-to-r from-[#00A9E0] to-[#0077A3] h-40 flex items-end px-10 pb-6">
            <div>
              <p className="text-[#E0F2F7] text-sm font-bold uppercase tracking-widest mb-1 opacity-80">
                Dashboard
              </p>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Welcome, {profile.given_name || profile.full_name.split(" ")[0]}
                !
              </h1>
            </div>
          </div>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Item */}
              <div className="group transition-all duration-200">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-hover:text-[#00A9E0]">
                  Full Name
                </span>
                <p className="text-xl font-semibold text-gray-800">
                  {profile.full_name}
                </p>
              </div>

              {/* Verification Status */}
              <div className="group">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  BankID Status
                </span>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold">Verified</span>
                </div>
              </div>

              <div className="group">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Birth Date
                </span>
                <p className="text-xl font-semibold text-gray-800">
                  {profile.birth_date}
                </p>
              </div>

              <div className="group">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Phone
                </span>
                <p className="text-xl font-semibold text-gray-800">
                  {profile.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">
                  Last activity
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {new Date(profile.last_login).toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="flex gap-4 w-full sm:w-auto">
                <a
                  href="/api/auth/logout"
                  className="flex-1 sm:flex-none text-center px-8 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 active:scale-95"
                >
                  Log out
                </a>
                <button className="flex-1 sm:flex-none px-8 py-3 bg-[#00A9E0] text-white font-bold rounded-xl shadow-lg shadow-sky-100 hover:bg-[#0088B3] hover:shadow-sky-200 transition-all duration-200 active:scale-95">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center mt-8 text-sm text-gray-400 font-medium">
          This is a secure session verified with BankID.
        </p>
      </div>
    </div>
  );
}
