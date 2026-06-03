import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] pt-20 pb-8 relative z-10">
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
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <Link
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] transition-colors hover:bg-neutral-800"
            >
              <svg className="h-5 w-5 fill-neutral-400" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </Link>

            {/* Pinterest (Styled Purple as per image) */}
            <Link
              href="#"
              aria-label="Pinterest"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4f46e5] transition-colors hover:opacity-90"
            >
              <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.163 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z" />
              </svg>
            </Link>

            {/* LinkedIn */}
            <Link
              href="#"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] transition-colors hover:bg-neutral-800"
            >
              <svg className="h-5 w-5 fill-neutral-400" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex flex-col flex-wrap gap-x-8 gap-y-2 text-[14px] text-[#555555] md:flex-row md:items-center">
            <p>Copyright 2024 —Programming Hero</p>
            <div className="flex gap-1">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms & Policy
              </Link>
              <span>-</span>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
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
