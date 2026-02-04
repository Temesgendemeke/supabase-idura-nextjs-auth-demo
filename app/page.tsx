import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#00A9E0] selection:text-white antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00A9E0] rounded-lg"></div>
            <span className="text-xl font-extrabold text-[#00A9E0] tracking-tight">
              BankID Demo
            </span>
          </div>
          <Link
            href="/login"
            className="px-6 py-2.5 bg-[#00A9E0] text-white font-bold rounded-xl hover:bg-[#0088B3] transition-all duration-200 active:scale-95 shadow-lg shadow-sky-100"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-sky-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tighter mb-8">
              Secure Authentication <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00A9E0] to-[#0077A3]">
                with BankID
              </span>
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl font-medium">
              A modern Next.js App Router implementation of Norwegian BankID via
              Idura. Seamless integration with Supabase for lightning-fast
              onboarding.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="px-10 py-5 bg-[#00A9E0] text-white text-lg font-bold rounded-2xl hover:bg-[#0088B3] transition-all duration-200 shadow-xl shadow-sky-100 active:scale-95 flex items-center gap-2"
              >
                Get Started
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <Link
                href="https://github.com/Temesgendemeke/supabase-idura-nextjs-auth-demo"
                target="_blank"
                className="px-10 py-5 bg-white text-gray-900 text-lg font-bold rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 active:scale-95"
              >
                View Source
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
            {[
              {
                title: "App Router",
                desc: "Full utilization of Server Components and Route Handlers for optimal performance.",
                icon: "⚡",
              },
              {
                title: "Supabase SSR",
                desc: "Secure handling of authentication cookies across client and server.",
                icon: "🛡️",
              },
              {
                title: "BankID / Idura",
                desc: "Ready-made setup for Criipto/Idura OIDC flow with BankID values.",
                icon: "🏦",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 font-medium">
            © 2026 BankID Demo. Built with Next.js and Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
}
