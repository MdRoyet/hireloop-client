"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // Outer nav container handling the full-width dark background
    <nav className="w-full bg-[#121212] p-4 relative z-50">
      {/* The inner pill-shaped header matching the image */}
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

        {/* Center/Right Desktop Navigation */}
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

        {/* Far Right Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          {/* Vertical Divider */}
          <div className="h-5 w-[1px] bg-neutral-700/80"></div>

          <Link
            href="/sign-in"
            className="text-sm font-medium text-[#818cf8] hover:text-[#6366f1] transition-colors"
          >
            Sign In
          </Link>

          <Button
            as={Link}
            href="/get-started"
            radius="lg"
            className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] px-6 text-sm font-medium text-white shadow-md shadow-indigo-500/20 hover:opacity-90"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden ml-auto text-neutral-300 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
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

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute left-4 right-4 top-24 z-40 rounded-2xl border border-neutral-800/60 bg-[#1c1c1e] p-4 shadow-xl md:hidden">
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/browse-jobs"
                className="block py-2 text-neutral-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/company"
                className="block py-2 text-neutral-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Company
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="block py-2 text-neutral-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
            </li>

            <li className="my-2 border-t border-neutral-800/80"></li>

            <li>
              <Link
                href="/sign-in"
                className="block py-2 font-medium text-[#818cf8]"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            </li>
            <li className="pt-2">
              <Button
                as={Link}
                href="/get-started"
                radius="lg"
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
