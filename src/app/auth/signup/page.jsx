"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Added role configuration to our unified form object
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "job_seeker", // Default state selection matching backend rules
  });

  const roles = [
    {
      id: "job_seeker",
      label: "Job Seeker",
      desc: "Find your next career leap",
    },
    {
      id: "recruiter",
      label: "Recruiter",
      desc: "Post jobs & hire top talent",
    },
    { id: "admin", label: "Admin", desc: "Platform manager portal access" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    // Call Better-Auth with the user fields + metadata role bundle
    const { data, error: authError } = await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role, // 🚀 Pass it directly here, NOT inside metadata!
      callbackURL: "/auth/signin",
    });

    if (authError) {
      setError(authError.message || "Failed to register account.");
      setLoading(false);
      return;
    }

    try {
      await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          role: formData.role,
          createdAt: new Date().toISOString(),
        }),
      });
    } catch (syncError) {
      console.error("Failed to sync billing profile:", syncError);
    }

    setShowToast(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/auth/signin");
    }, 2000);
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
      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-[10000] flex items-center gap-3 bg-[#0f0f11] border border-green-500/30 px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in-down">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-white">Account Created!</p>
            <p className="text-xs text-gray-400">
              Redirecting to sign-in portal...
            </p>
          </div>
        </div>
      )}

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] pointer-events-none -z-10"
        style={{ backgroundColor: "#2563eb" }}
      />

      <main className="w-full max-w-md bg-[#0f0f11] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 my-8">
        <header className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">
            Create your account
          </h2>
          <p className="text-sm text-gray-400">
            Join HireLoop to discover your next big opportunity
          </p>
        </header>

        {error && (
          <div className="p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Custom Pill Role Selection Grid Component */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              I am joining as a...
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    formData.role === r.id
                      ? "border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/5"
                      : "border-white/5 bg-black/20 text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <span className="text-sm font-semibold tracking-tight">
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-white/10 bg-black/40 py-2.5 px-4 text-sm text-white placeholder-gray-600 rounded-xl outline-none focus:border-blue-500"
            />
          </div>

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
              className="w-full border border-white/10 bg-black/40 py-2.5 px-4 text-sm text-white placeholder-gray-600 rounded-xl outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border border-white/10 bg-black/40 py-2.5 pl-4 pr-10 text-sm text-white placeholder-gray-600 rounded-xl outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-500 hover:text-gray-300 outline-none cursor-pointer flex items-center justify-center"
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
            className="w-full bg-white text-black text-sm font-semibold py-3 px-4 rounded-xl shadow-xl hover:bg-gray-200 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <footer className="text-center text-sm text-gray-400">
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
  );
}
