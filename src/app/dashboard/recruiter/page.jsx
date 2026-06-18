"use client";

import { useSession } from "@/lib/auth-client";

export default function RecruiterDashboard() {
  const { data: session, isPending } = useSession();

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* Dynamic Welcome Heading */}
      <h1 className="text-3xl font-medium text-white mb-8 tracking-tight mt-2">
        Welcome back,{" "}
        {isPending ? "..." : session?.user?.name?.split(" ")[0] || "there"}
      </h1>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={<DocumentIcon />} label="Total Job Posts" value="48" />
        <StatCard icon={<UsersIcon />} label="Total Applicants" value="1,284" />
        <StatCard icon={<LightningIcon />} label="Active Jobs" value="18" />
        <StatCard icon={<CheckCircleIcon />} label="Jobs Closed" value="32" />
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-white tracking-tight">
              Recent Applications
            </h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              View all
            </button>
          </div>
          <div className="h-[200px] border border-white/5 bg-[#161618] rounded-xl flex items-center justify-center text-gray-500 text-sm">
            No recent applications found.
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-white tracking-tight">
              My Top Companies
            </h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              View all
            </button>
          </div>
          <div className="h-[200px] border border-white/5 bg-[#161618] rounded-xl flex items-center justify-center text-gray-500 text-sm">
            No active companies listed.
          </div>
        </div>
      </div>
    </main>
  );
}

// Icons specific to the content area
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#161618] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-[150px] shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-gray-300">
        {icon}
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <span className="text-xs font-medium text-gray-400">{label}</span>
        <span className="text-3xl font-semibold text-white tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
}

function DocumentIcon() {
  return (
    <svg
      className="h-5 w-5"
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
function UsersIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}
function LightningIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
