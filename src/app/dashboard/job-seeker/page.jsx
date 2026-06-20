"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card, Spinner } from "@heroui/react";
import {
  Briefcase,
  Link as LinkIcon,
  FileText,
  Phone,
  User,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { applyForJobAction } from "@/lib/actions/applications";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function JobApplicationFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const jobId = searchParams.get("jobId");
  const jobTitle = searchParams.get("jobTitle");
  const recruiterId = searchParams.get("recruiterId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    resumeUrl: "",
    portfolioUrl: "",
    coverLetter: "",
  });

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      toast.error("Please login to view this workspace.");
      router.push("/auth/signin");
    }
  }, [session, sessionLoading, router]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobId || !recruiterId) {
      toast.error(
        "Missing critical job context parameters. Please choose a job from the browser portal.",
      );
      return;
    }

    if (!formData.phone.trim()) {
      toast.warning("Please provide a valid contact phone number.");
      return;
    }

    if (!formData.resumeUrl.trim()) {
      toast.warning(
        "Please provide a secure link to your Resume (Google Drive, Dropbox, etc).",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const applicantEmail = session?.user?.email || "No Email Provided";

      const payload = {
        jobId,
        jobTitle,
        recruiterId,
        email: applicantEmail,
        applicantId: applicantEmail,
        applicantName: session?.user?.name || "Anonymous Applicant",
        applicantEmail,
        applicantCreatedAt: session?.user?.createdAt,
        phone: formData.phone,
        resumeUrl: formData.resumeUrl,
        portfolioUrl: formData.portfolioUrl || "",
        coverLetter: formData.coverLetter || "",
        status: "pending",
        appliedAt: new Date().toISOString(),
      };

      const response = await applyForJobAction(payload);

      if (response.success) {
        // Safe readout extraction matching applications.js payload formatting wrapper (.data)
        const tokensRemaining = response.data?.remaining;

        if (tokensRemaining === "unlimited") {
          toast.success("Application submitted successfully!");
        } else if (tokensRemaining > 0) {
          toast.success(
            `Application submitted! You have ${tokensRemaining} application credit${tokensRemaining === 1 ? "" : "s"} remaining this month.`,
          );
        } else {
          toast.warning(
            "Application submitted! You have used all credits on your current plan.",
          );
        }

        setTimeout(() => {
          router.push("/browse-jobs");
        }, 3000);
      } else {
        // Enforces UI visibility if the server action responds with standard quota errors
        if (
          response.error?.includes("expired") ||
          response.error?.includes("free plan")
        ) {
          toast.error(
            "🚫 Your free plan has expired! Please upgrade your account to make unlimited applications.",
          );
        } else {
          toast.error(response.error || "Failed to submit application data.");
        }
      }
    } catch (err) {
      toast.error("A networking compilation error occurred. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" color="white" />
        <p className="text-sm text-gray-500">
          Syncing user profile credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-left animate-in fade-in duration-500 relative">
      <ToastContainer theme="dark" position="top-right" autoClose={4000} />

      <div className="absolute top-20 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-10 relative z-10">
        {jobId ? (
          <div>
            <span className="text-blue-400 text-sm font-bold tracking-widest uppercase bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
              Active Application Workspace
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4">
              Apply for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {jobTitle}
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Complete the structured profile fields below to transmit your
              documents to the hiring department manager.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white">
              Job Seeker Command Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Select an active job opening from the navigation portal to launch
              your career workspace.
            </p>
          </div>
        )}
      </div>

      {jobId && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* LEFT SIDE PANEL */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="bg-[#161618] border border-white/5 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col gap-6">
                <h3 className="text-md font-semibold text-white tracking-wide uppercase border-b border-white/5 pb-3">
                  Applicant Profile
                </h3>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-white font-semibold truncate">
                      {session?.user?.name || "Verified Seeker"}
                    </h4>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                      {session?.user?.role?.replace("_", " ") || "Job Seeker"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-sm text-gray-400 font-medium px-1">
                  <div className="flex items-center gap-3">
                    <User className="text-blue-400 h-4 w-4 shrink-0" />
                    <span className="truncate text-gray-300">
                      {session?.user?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-blue-400 h-4 w-4 shrink-0" />
                    <span className="truncate text-gray-300">
                      {session?.user?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="text-blue-400 h-4 w-4 shrink-0" />
                    <span className="text-gray-300">
                      Target ID Ref: {jobId.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-200/60 leading-relaxed font-medium">
              💡 <span className="text-blue-300 font-semibold">Pro-tip:</span>{" "}
              Free Plan profiles allocation yields 3 entries per calendar month
              window. Keep track of metrics here.
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="lg:col-span-8">
            <Card className="bg-[#161618] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <FileText className="h-40 w-40" />
              </div>

              <div className="relative z-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-blue-400" /> Contact
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-blue-500/50 outline-none rounded-xl h-11 px-4 text-white text-sm transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <LinkIcon className="h-3.5 w-3.5 text-blue-400" />{" "}
                        Portfolio / LinkedIn URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolioUrl}
                        onChange={(e) =>
                          handleInputChange("portfolioUrl", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-blue-500/50 outline-none rounded-xl h-11 px-4 text-white text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-blue-400" /> Cloud
                      Resume Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/your-resume-id/view"
                      value={formData.resumeUrl}
                      onChange={(e) =>
                        handleInputChange("resumeUrl", e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-blue-500/50 outline-none rounded-xl h-11 px-4 text-white text-sm transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-blue-400" /> Cover
                        Letter / Professional Pitch
                      </label>
                      <span className="text-[11px] text-gray-500 font-bold">
                        {formData.coverLetter.length} characters
                      </span>
                    </div>
                    <textarea
                      placeholder="Introduce yourself to the recruiter, detail why your skills align perfectly with this role, and make a compelling pitch..."
                      value={formData.coverLetter}
                      onChange={(e) =>
                        handleInputChange("coverLetter", e.target.value)
                      }
                      rows={6}
                      className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-blue-500/50 outline-none rounded-xl p-4 text-white text-sm leading-relaxed transition-colors resize-none"
                    />
                  </div>

                  <div className="border-t border-white/5 pt-6 mt-2 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="bg-white text-black font-semibold px-8 h-12 text-sm rounded-xl shadow-xl hover:bg-gray-200 cursor-pointer transition-transform duration-200 active:scale-95"
                      endContent={
                        !isSubmitting && <ArrowRight className="h-4 w-4" />
                      }
                    >
                      {isSubmitting
                        ? "Submitting Application..."
                        : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobSeekerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
          <Spinner size="lg" color="white" />
          <p className="text-sm text-gray-500 animate-pulse">
            Initializing application form core engine...
          </p>
        </div>
      }
    >
      <JobApplicationFormContent />
    </Suspense>
  );
}
