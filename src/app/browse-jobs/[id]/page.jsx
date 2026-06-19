"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import {
  Briefcase,
  MapPin,
  Calendar,
  ArrowLeft,
  CircleCheck,
  ArrowRight,
} from "@gravity-ui/icons";
import { getJobByIdAction } from "@/lib/actions/jobs";

// Authentication & Global Toast Notifications
import { useSession } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Fetch active session credentials
  const { data: session, isPending: sessionLoading } = useSession();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    async function loadJobDetails() {
      if (!params?.id) return;

      try {
        const response = await getJobByIdAction(params.id);
        if (response.success) {
          setJob(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    }
    loadJobDetails();
  }, [params.id]);

  const formatDate = (dateInput) => {
    if (!dateInput) return "No deadline";
    const date = new Date(dateInput);
    return isNaN(date.getTime())
      ? "Flexible"
      : date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
  };

  // Secure Application Redirection Pipeline
  const handleApplyClick = async () => {
    // Case 1: Anonymous User -> Toastify first, then hard redirect to /auth/signin
    if (!session?.user) {
      toast.warning(
        "🔒 Authentication required. Redirecting to sign-in portal...",
      );
      setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 1500);
      return;
    }

    // Case 2: Verification processing buffer
    if (sessionLoading) {
      toast.info("Verifying your profile session... please hold.");
      return;
    }

    // Standardize text capitalization for safety checking
    const userRole = session.user.role?.toLowerCase();

    // 🚀 FIXED: Added "job_seeker" (with underscore) to the valid verification array
    const validSeekerRoles = [
      "job-seeker",
      "job_seeker",
      "seeker",
      "candidate",
    ];
    const isValidSeeker = validSeekerRoles.includes(userRole);

    // Case 3: Logged in as Recruiter/Admin -> Hard Block with high-visibility Toast
    if (!isValidSeeker) {
      toast.error(
        `⛔ Prohibited: Accounts with the role "${session.user.role}" are not permitted to apply for positions.`,
      );
      return;
    }

    // Case 4: Valid Job Seeker -> Packaging parameters and pushing to dashboard workspace form
    setIsApplying(true);
    toast.success("Preparing your application workspace... 🚀");
    setTimeout(() => {
      router.push(
        `/dashboard/job-seeker?jobId=${job._id}&jobTitle=${encodeURIComponent(job.title)}&recruiterId=${job.recruiterId}`,
      );
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 w-full">
        <Spinner size="lg" color="white" />
        <p className="text-sm text-gray-500 animate-pulse">
          Loading job details...
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto pt-20 text-center">
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 font-medium mb-6">
          ⚠️ {error || "Job not found. It may have been closed or removed."}
        </div>
        <Button
          variant="flat"
          onClick={() => router.back()}
          className="bg-white/5 text-white hover:bg-white/10"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const isRemote = job.isRemote === "true" || job.isRemote === true;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 animate-in fade-in duration-500 text-left">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors mb-8 group cursor-pointer w-fit"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to search
      </button>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full flex flex-col gap-8">
          <div className="bg-[#161618] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Briefcase className="h-48 w-48" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${isRemote ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-purple-400 bg-purple-500/10 border-purple-500/20"}`}
                >
                  {isRemote ? "Remote" : "Onsite"}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border text-blue-400 bg-blue-500/10 border-blue-500/20">
                  {job.status || "Active"}
                </span>
                <span className="text-sm text-gray-500 font-medium ml-2">
                  Posted {formatDate(job.createdAt)}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">
                    HireLoop Verified Partner
                  </span>
                </div>
                <div className="flex items-center gap-2 capitalize">
                  <Briefcase className="h-4 w-4" />
                  <span>
                    {job.category} • {job.type?.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161618] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col gap-10">
            {job.responsibilities && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  What you&apos;ll do
                </h2>
                <div className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">
                  {job.responsibilities}
                </div>
              </section>
            )}
            {job.requirements && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  Requirements
                </h2>
                <div className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </section>
            )}
            {job.benefits && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  Benefits & Perks
                </h2>
                <div className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">
                  {job.benefits}
                </div>
              </section>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6 sticky top-24">
          <div className="bg-[#161618] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
            <Button
              onClick={handleApplyClick}
              isLoading={isApplying}
              className="w-full bg-white text-black font-semibold shadow-xl hover:bg-gray-200 h-12 text-base cursor-pointer"
              endContent={!isApplying && <ArrowRight className="h-4 w-4" />}
            >
              {isApplying ? "Redirecting..." : "Apply for this position"}
            </Button>

            <p className="text-xs text-center text-gray-500 font-medium px-4">
              Application closes on{" "}
              <span className="text-gray-300">{formatDate(job.deadline)}</span>
            </p>

            <div className="border-t border-white/5 pt-6 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </span>
                  <span className="text-sm font-medium text-white">
                    {isRemote
                      ? "Global / Anywhere"
                      : `${job.city || "N/A"}, ${job.country || "N/A"}`}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary Structure
                  </span>
                  <span className="text-sm font-medium text-white">
                    {job.minSalary && job.maxSalary
                      ? `${job.currency?.toUpperCase() || "USD"} ${Number(job.minSalary).toLocaleString()} - ${Number(job.maxSalary).toLocaleString()}`
                      : "Competitive Market Rate"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employment Type
                  </span>
                  <span className="text-sm font-medium text-white capitalize">
                    {job.type?.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6 flex items-start gap-4">
            <CircleCheck className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200/70 leading-relaxed font-medium">
              HireLoop ensures all applications are securely transmitted
              directly to the verified recruiter managing this pipeline.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
