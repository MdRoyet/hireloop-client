"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import {
  Briefcase,
  Globe,
  Plus,
  MapPin,
  Calendar,
  Persons,
} from "@gravity-ui/icons";
import { getJobsAction } from "@/lib/actions/jobs";
import { useSession } from "@/lib/auth-client";

export default function RecruiterJobsDashboard() {
  const { data: session, isPending } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Wait until the authentication check is completely finished
    if (isPending) return;

    // 🚀 2. STRICT GUARD: If there is no user ID, DO NOT fetch jobs yet!
    // This prevents the dashboard from accidentally asking for the "global" list.
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    async function loadJobs() {
      try {
        // Now we are 100% guaranteed to have the recruiter's exact ID
        const recruiterId = session.user.id;
        const response = await getJobsAction(recruiterId);

        if (response.success) {
          setJobs(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError("An unexpected frontend rendering crash occurred.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [session, isPending]); // Re-runs safely when session finally populates

  const formatDate = (dateInput) => {
    if (!dateInput) return "No deadline";
    const date = new Date(dateInput);
    return isNaN(date.getTime())
      ? "Flexible"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  return (
    <div className="max-w-7xl w-full mx-auto pb-12 pt-4 animate-in fade-in duration-500 text-left">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight mb-2">
            Manage Open Roles
          </h1>
          <p className="text-sm text-gray-400">
            Monitor incoming applicants, update visibility parameters, and
            handle active vacancy listings.
          </p>
        </div>
        <Button
          as={Link}
          href="/dashboard/recruiter/jobs/new"
          endContent={<Plus className="h-4 w-4" />}
          className="bg-white text-black font-semibold shadow-xl hover:bg-gray-200 shrink-0 cursor-pointer"
        >
          Post New Job
        </Button>
      </header>

      {/* CORE CONTENT RENDER ENGINE GRID CONTAINER */}
      {loading || isPending ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 w-full">
          <Spinner size="lg" color="white" />
          <p className="text-sm text-gray-500 animate-pulse">
            Syncing your private data...
          </p>
        </div>
      ) : error ? (
        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-sm text-red-400 font-medium">
          ⚠️ {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-2xl bg-[#161618]/30">
          <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
            <Briefcase className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-white mb-1">
            No active postings found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mb-6">
            You haven&apos;t published any career opportunities yet. Sync a
            position to get started.
          </p>
          <Button
            as={Link}
            href="/dashboard/recruiter/jobs/new"
            variant="flat"
            className="bg-white/5 text-white hover:bg-white/10 font-medium text-xs px-6 cursor-pointer"
          >
            Create First Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {jobs.map((job) => {
            const remoteFlag = job.isRemote === "true" || job.isRemote === true;

            return (
              <article
                key={job._id}
                className="group p-6 bg-[#161618] border border-white/5 rounded-2xl flex flex-col justify-between min-h-[290px] transition-all duration-300 hover:border-white/10 hover:bg-[#1c1c1e] shadow-xl relative"
              >
                <div className="w-full">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Briefcase className="h-5 w-5 text-blue-400" />
                    </div>

                    <div className="flex items-center gap-2">
                      {remoteFlag ? (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-green-500/10 border border-green-500/20 text-green-400">
                          Remote
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-400">
                          Onsite
                        </span>
                      )}

                      <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-gray-400 rounded-md">
                        {job.status || "Active"}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-lg font-medium text-white tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors mb-1">
                    {job.title}
                  </h2>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 capitalize">
                    <span className="text-gray-400 truncate max-w-[120px]">
                      {job.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/10 shrink-0" />
                    <span className="text-gray-500 font-medium">
                      {job.type?.replace("-", " ")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-3 border-t border-white/5 w-full text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      {remoteFlag ? (
                        <>
                          <Globe className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          <span className="text-gray-400">
                            Global / Anywhere
                          </span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          <span className="truncate">
                            {job.city || "N/A"}, {job.country || "N/A"}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-300 font-medium">
                      <span className="text-gray-500 font-normal">
                        Compensation:
                      </span>
                      <span>
                        {job.minSalary && job.maxSalary
                          ? `${job.currency?.toUpperCase() || "USD"} ${Number(job.minSalary).toLocaleString()} - ${Number(job.maxSalary).toLocaleString()}`
                          : "Salary Undisclosed"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-4 mt-5 border-t border-white/5 w-full">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <Persons className="h-4 w-4 text-blue-400" />
                    <span>0 applicants</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{formatDate(job.deadline)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
