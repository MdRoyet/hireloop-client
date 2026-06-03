import Image from "next/image";
import Link from "next/link";
import { LogoFacebook, LogoLinkedin, LogoGithub } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-[#0a0a0a] pb-8 pt-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-24">
          {/* Left Section: Brand & Description */}
          <div className="flex max-w-sm flex-col">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/images/logo.png"
                alt="Hireloop Logo"
                width={140}
                height={36}
                className="object-contain"
              />
            </Link>
            <p className="text-[15px] leading-relaxed text-neutral-500">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>

          {/* Right Section: Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16">
            {/* Column 1: Product */}
            <div>
              <h3 className="mb-6 text-[15px] font-medium text-[#5151ff]">
                Product
              </h3>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/job-discovery"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Job discovery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/worker-ai"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Worker AI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/companies"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/salary-data"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Salary data
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Navigations */}
            <div>
              <h3 className="mb-6 text-[15px] font-medium text-[#5151ff]">
                Navigations
              </h3>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/help-center"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Help center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/career-library"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Career library
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h3 className="mb-6 text-[15px] font-medium text-[#5151ff]">
                Resources
              </h3>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/brand-guideline"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Brand Guideline
                  </Link>
                </li>
                <li>
                  <Link
                    href="/newsroom"
                    className="text-[15px] text-neutral-500 transition-colors hover:text-white"
                  >
                    Newsroom
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Social Icons & Copyright */}
        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 md:flex-row md:items-center">
          {/* Social Icons using @gravity-ui/icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <Link
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <LogoFacebook width={20} height={20} />
            </Link>

            {/* Github (Styled Purple as per image) */}
            <Link
              href="#"
              aria-label="Pinterest"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4f46e5] text-white transition-opacity hover:opacity-90"
            >
              <LogoGithub width={20} height={20} />
            </Link>

            {/* LinkedIn */}
            <Link
              href="#"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <LogoLinkedin width={20} height={20} />
            </Link>
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex flex-col flex-wrap gap-x-8 gap-y-2 text-[14px] text-[#555555] md:flex-row md:items-center">
            <p>Copyright 2024 —HireLoop</p>
            <div className="flex gap-1">
              <Link
                href="/terms"
                className="transition-colors hover:text-white"
              >
                Terms & Policy
              </Link>
              <span>-</span>
              <Link
                href="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy Guideline
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
