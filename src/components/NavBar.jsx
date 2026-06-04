"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client"; // Using your Better-Auth configuration

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Destructure the live session state straight from your MongoDB adapter layer
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Force an immediate router navigation to the sign-in portal
          window.location.href = "/auth/signin";
          // Alternatively, if you imported `useRouter` from 'next/navigation':
          // router.push("/auth/signin");
        },
      },
    });
  };

  return (
    <nav className="w-full bg-[#121212] p-4 relative z-50">
      {/* Inner pill-shaped header wrapper */}
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-2xl border border-neutral-800/60 bg-[#1c1c1e] px-4 md:px-6 shadow-sm shadow-black/50">
        {/* Left Side: Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Hireloop Logo"
              width={140}
              height={36}
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* Center Desktop Navigation Routes */}
        <ul className="hidden md:flex items-center gap-8 ml-auto mr-6">
          <li>
            <Link
              href="/browse-jobs"
              className="text-sm font-normal text-neutral-300 hover:text-white transition-colors"
            >
              Browse Jobs
            </Link>
          </li>
          <li>
            <Link
              href="/company"
              className="text-sm font-normal text-neutral-300 hover:text-white transition-colors"
            >
              Company
            </Link>
          </li>
          <li>
            <Link
              href="/pricing"
              className="text-sm font-normal text-neutral-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </li>
        </ul>

        {/* Far Right Desktop Actions (Conditionals driven by Better-Auth) */}
        <div className="hidden md:flex items-center gap-5">
          <div className="h-5 w-[1px] bg-neutral-700/80"></div>

          {isPending ? (
            // Skeleton Loader State to prevent UI layout shift flashes
            <div className="h-8 w-24 rounded-lg bg-neutral-800 animate-pulse" />
          ) : session ? (
            // Authenticated Session State UI
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center uppercase">
                  {session.user?.name ? session.user.name[0] : "U"}
                </div>
                <span className="text-sm font-medium text-neutral-200">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            // Guest State UI (No Session Found in MongoDB)
            <>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-[#818cf8] hover:text-[#6366f1] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] px-5 py-2.5 rounded-xl text-sm font-medium text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden ml-auto text-neutral-300 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Dropdown Menu Container */}
      {isMenuOpen && (
        <div className="absolute left-4 right-4 top-24 z-40 rounded-2xl border border-neutral-800/60 bg-[#1c1c1e] p-4 shadow-xl md:hidden">
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/browse-jobs"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-neutral-300 hover:text-white"
              >
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/company"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-neutral-300 hover:text-white"
              >
                Company
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-neutral-300 hover:text-white"
              >
                Pricing
              </Link>
            </li>

            <li className="my-2 border-t border-neutral-800/80"></li>

            {!isPending &&
              (session ? (
                // Mobile logged in state
                <li className="flex flex-col gap-3 pt-2">
                  <div className="text-sm font-medium text-neutral-400 px-2">
                    Logged in as:{" "}
                    <span className="text-white font-semibold">
                      {session.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-2 text-sm font-medium text-red-400 hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </li>
              ) : (
                // Mobile guest state
                <>
                  <li>
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 font-medium text-[#818cf8]"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li className="pt-2">
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white rounded-xl py-2.5 text-center text-sm font-medium"
                    >
                      Get Started
                    </Link>
                  </li>
                </>
              ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
