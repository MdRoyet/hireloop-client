"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client"; // Fixed configuration import

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await signIn.email({
      email: formData.email,
      password: formData.password,
      callbackURL: "/", // Sends user to home page after verification
    });

    if (authError) {
      setError(authError.message || "Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
        display: "grid",
        placeItems: "center",
        padding: "16px",
        zIndex: 9999,
        overflowY: "auto",
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none -z-10"
        style={{ backgroundColor: "#7c3aed" }}
      />

      <main className="w-full max-w-md bg-[#0f0f11] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
        <header className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-gray-400">
            Enter your credentials below to access your account
          </p>
        </header>

        {error && (
          <div className="p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-white/10 bg-black/40 py-2.5 px-4 text-sm text-white placeholder-gray-600 rounded-xl outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-purple-400 hover:text-purple-300"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border border-white/10 bg-black/40 py-2.5 pl-4 pr-10 text-sm text-white placeholder-gray-600 rounded-xl outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-500 hover:text-gray-300 outline-none flex items-center justify-center cursor-pointer"
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
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-sm font-semibold py-3 px-4 rounded-xl shadow-xl hover:bg-gray-200 transition-colors active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <footer className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-white hover:underline"
          >
            Create an account
          </Link>
        </footer>
      </main>
    </div>
  );
}
