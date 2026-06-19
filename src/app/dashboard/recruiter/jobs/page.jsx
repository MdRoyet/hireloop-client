"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import { Briefcase, Globe, Plus, MapPin } from "@gravity-ui/icons";
import { getJobsAction } from "@/lib/actions/jobs";

export default function RecruiterJobsDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await getJobsAction();
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
  }, []);

  return (
    <div className="max-w-5xl w-full mx-auto pb-12 pt-4 animate-in fade-in duration-500">
      {/* Dashboard Top Navigation Control Panel Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight mb-2">
            Manage Open Roles
          </h1>
          <p className="text-sm text-gray-400">
            Monitor incoming applicants, update open visibility parameters, and
            manage active records.
          </p>
        </div>
        <Button
          as={Link}
          href="/dashboard/recruiter/jobs/new"
          endContent={<Plus className="h-4 w-4" />}
          className="bg-white text-black font-semibold shadow-xl hover:bg-gray-200 shrink-0"
        >
          Post New Job
        </Button>
      </header>

      {/* CORE CONTENT RENDER ENGINE CONTAINER LOOP */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 w-full">
          <Spinner size="lg" color="white" />
          <p className="text-sm text-gray-500 animate-pulse">
            Syncing data from pipeline...
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
            className="bg-white/5 text-white hover:bg-white/10 font-medium text-xs px-6"
          >
            Create First Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 w-full">
          {jobs.map((job) => (
            <article
              key={job._id}
              className="group p-5 bg-[#161618] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-white/10 hover:bg-[#1a1a1c]"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <h2 className="text-base font-medium text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                    <span className="capitalize text-gray-400">
                      {job.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/10" />
                    <span className="capitalize">{job.type}</span>
                    <span className="h-1 w-1 rounded-full bg-white/10" />

                    {/* COMPENSATION FALLBACK CHECK */}
                    <span>
                      {job.minSalary && job.maxSalary
                        ? `${job.currency?.toUpperCase() || "USD"} ${Number(job.minSalary).toLocaleString()} - ${Number(job.maxSalary).toLocaleString()}`
                        : "Salary Undisclosed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT ATTACHED METADATA LABELS */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-white/5 pt-3 sm:pt-0 sm:border-0">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  {job.isRemote === "true" || job.isRemote === true ? (
                    <>
                      <Globe className="h-3.5 w-3.5 text-green-400" />
                      <span className="text-green-400/90 bg-green-400/5 px-2 py-0.5 rounded-md border border-green-400/10">
                        Remote
                      </span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />
                      <span>
                        {job.city || "N/A"}, {job.country || "N/A"}
                      </span>
                    </>
                  )}
                </div>

                <div className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400 rounded-full capitalize">
                  {job.status || "Active"}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
