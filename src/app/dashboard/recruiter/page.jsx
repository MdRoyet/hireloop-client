"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { getRecruiterDashboardStats } from "@/lib/actions/jobs";

export default function RecruiterDashboard() {
  const { data: session, isPending: sessionPending } = useSession();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for the session to verify
    if (sessionPending) return;

    // Strict guard: Do not fetch private stats if we don't have an ID
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    async function loadDashboardMetrics() {
      // 🚀 Pass the ID to strictly filter the backend calculations
      const recruiterId = session.user.id;
      const result = await getRecruiterDashboardStats(recruiterId);

      if (result.success) {
        setDashboardData(result.data);
      }
      setLoading(false);
    }

    loadDashboardMetrics();
  }, [session, sessionPending]);

  if (loading || sessionPending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Spinner size="lg" color="white" />
        <p className="text-xs text-gray-500 animate-pulse">
          Assembling workspace records...
        </p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0,
    closedJobs: 0,
  };
  const applications = dashboardData?.recentApplications || [];
  const companies = dashboardData?.topCompanies || [];

  return (
    <main className="flex-1 p-8 overflow-y-auto w-full animate-in fade-in duration-500 text-left">
      <h1 className="text-3xl font-medium text-white mb-8 tracking-tight">
        Welcome back, {session?.user?.name || "Recruiter"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={
            <svg
              className="h-5 w-5 text-gray-300"
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
          }
          label="Total Job Posts"
          value={stats.totalJobs}
        />
        <StatCard
          icon={
            <svg
              className="h-5 w-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          label="Total Applicants"
          value={stats.totalApplicants.toLocaleString()}
        />
        <StatCard
          icon={
            <svg
              className="h-5 w-5 text-gray-300"
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
          }
          label="Active Jobs"
          value={stats.activeJobs}
        />
        <StatCard
          icon={
            <svg
              className="h-5 w-5 text-gray-300"
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
          }
          label="Jobs Closed"
          value={stats.closedJobs}
        />
      </div>

      {/* The rest of your tables and UI from the earlier step stay exactly the same below! */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <section className="lg:col-span-2 bg-[#161618] border border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white tracking-tight">
              Recent Applications
            </h2>
            <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">
              View all
            </button>
          </div>
          <div className="flex items-center justify-center py-10 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-sm text-gray-500">
              No applications received yet.
            </p>
          </div>
        </section>

        <section className="bg-[#161618] border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white tracking-tight">
              My Top Companies
            </h2>
            <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">
              View all
            </button>
          </div>
          <div className="flex items-center justify-center py-10 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-sm text-gray-500">Register a company first.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#161618] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-[150px] shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-gray-400">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 mt-4 text-left">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-3xl font-semibold text-white tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
}
