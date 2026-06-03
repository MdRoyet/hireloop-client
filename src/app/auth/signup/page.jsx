"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Sending schema setup to Better-Auth + MongoDB:", formData);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-y-auto">
      {/* Background Decorative Radial Light (Uses native styling to prevent utility breaks) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{ backgroundColor: "#2563eb" }}
      />

      {/* Grid wrapper forces true viewport dead-centering */}
      <div className="grid min-h-screen w-full place-items-center p-4">
        <main className="w-full max-w-md bg-[#0f0f11] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <header className="text-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight mb-1">
              Create your account
            </h2>
            <p className="text-sm text-gray-400">
              Join HireLoop to discover your next big opportunity
            </p>
          </header>

          {/* Social Provider Grid Links */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => console.log("Google Auth")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.99 0-.743-.079-1.32-.174-1.885H12.24z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => console.log("GitHub Auth")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Line Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-white/5" />
            <span className="absolute bg-[#0f0f11] px-3 text-[10px] uppercase tracking-wider font-semibold text-gray-500">
              Or sign up with email
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400 mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Field: Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 rounded-xl outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Input Field: Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 rounded-xl outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Input Field: Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full border border-white/10 bg-black/40 py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-600 rounded-xl outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 fill-none stroke-current stroke-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Action Trigger Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black text-sm font-semibold py-3 px-4 rounded-xl shadow-xl hover:bg-gray-200 active:scale-[0.99] disabled:opacity-50 transition-all transform duration-150 cursor-pointer mt-2"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Footer Routing */}
          <footer className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-white hover:underline"
            >
              Sign in
            </Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
