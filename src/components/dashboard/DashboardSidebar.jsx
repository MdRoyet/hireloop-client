"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // 🚀 Imports path checker to track current page
import { useSession } from "@/lib/auth-client";

export function DashboardSidebar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname(); // 🚀 Reads the current browser URL

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className="w-[260px] h-screen sticky top-0 shrink-0 border-r border-white/10 bg-[#0a0a0a] flex flex-col text-left">
      {/* Logo */}
      <div className="h-[70px] flex items-center px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Hire<span className="font-semibold text-gray-300">Loop</span>
        </Link>
      </div>

      {/* Dynamic Profile Snippet */}
      <div className="px-6 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-white/10">
            <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-slate-800 flex items-center justify-center text-sm font-bold uppercase text-white">
              {isPending ? "..." : getInitials(session?.user?.name)}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white leading-tight">
              {isPending ? "Loading..." : session?.user?.name || "Guest"}
            </span>
            <span className="text-xs text-gray-500 font-normal capitalize">
              {session?.user?.role?.replace("_", " ") || "Recruiter"}
            </span>
          </div>
        </div>
        <div className="inline-flex items-center justify-center px-2 py-1 rounded border border-white/20 bg-white/5 w-max">
          <span className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
            Premium Account
          </span>
        </div>
      </div>

      {/* Navigation Links Grid Pipeline */}
      <nav className="flex-1 mt-6 flex flex-col gap-1 px-3">
        <NavItem
          href="/dashboard/recruiter"
          active={pathname === "/dashboard/recruiter"}
          icon={<DashboardIcon />}
          label="Home"
        />
        <NavItem
          href="/dashboard/recruiter/jobs"
          active={pathname === "/dashboard/recruiter/jobs"}
          icon={<CompanyIcon />}
          label="Jobs"
        />
        <NavItem
          href="/dashboard/recruiter/jobs/new"
          active={pathname === "/dashboard/recruiter/jobs/new"}
          icon={<ManageJobsIcon />}
          label="Post Job"
        />
        <NavItem
          href="/dashboard/recruiter/company"
          active={pathname === "/dashboard/recruiter/company"}
          icon={<CompanyIcon />}
          label="Company"
        />
        <NavItem
          href="/dashboard/recruiter/settings"
          active={pathname === "/dashboard/recruiter/settings"}
          icon={<SettingsIcon />}
          label="Settings"
        />
      </nav>
    </aside>
  );
}

// 🚀 NavItem converted from a standard button directly into a Next.js Link component
function NavItem({ href, active, icon, label }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative w-full text-left cursor-pointer ${
        active
          ? "bg-[#1c1c1e] text-white"
          : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
      }`}
    >
      <div
        className={`${active ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}
      >
        {icon}
      </div>
      {label}
      {active && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-1 rounded-l-full bg-white"></div>
      )}
    </Link>
  );
}

// ----------------- SVG ICON MODULES -----------------

function DashboardIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

function ManageJobsIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function ApplicationsIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
