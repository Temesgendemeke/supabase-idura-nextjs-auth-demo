// components/BankIDLogin.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function BankIDLogin() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = () => {
    setLoading(true);
    window.location.href = "/api/auth/login";
  };

  const errorMessages: Record<string, string> = {
    authentication_failed: "Authentication failed. Please try again.",
    user_cancelled: "Login was cancelled.",
    invalid_request: "Invalid request.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign In with BankID
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure login via your bank
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 font-sans">
            <div className="text-sm text-red-800">
              {errorMessages[error] || "An error occurred"}
            </div>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00A9E0] hover:bg-[#0088B3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A9E0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Redirecting...
            </span>
          ) : (
            "Sign In with BankID"
          )}
        </button>
      </div>
    </div>
  );
}
