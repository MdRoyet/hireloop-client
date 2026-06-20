"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Form, Select, ListBox, Label, Button, Switch } from "@heroui/react";
import { Briefcase, Globe, ArrowRight } from "@gravity-ui/icons";
import { createJobAction } from "@/lib/actions/jobs";

export default function PostJobPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [isRemote, setIsRemote] = useState(false);
  const [serverError, setServerError] = useState("");
  const [planStatus, setPlanStatus] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    async function fetchPlanStatus() {
      const email = session?.user?.email;
      if (!email) return;

      try {
        const res = await fetch("/api/user/plan-status", {
          headers: {
            "user-email": email,
            "user-role": session.user.role || "recruiter",
            "user-id": session.user.id || "",
          },
        });
        if (res.ok) {
          setPlanStatus(await res.json());
        }
      } catch (error) {
        console.error("Failed to load recruiter plan status:", error);
      } finally {
        setLoadingPlan(false);
      }
    }

    if (session?.user) {
      fetchPlanStatus();
    }
  }, [session]);

  // Simplified semantic inputs to match our updated approach
  const labelStyle = "text-sm font-medium text-gray-300 pb-1.5 block text-left";
  const baseInputStyle =
    "w-full h-11 bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-black/60 text-white placeholder:text-gray-600 text-sm rounded-xl px-4 outline-none transition-all duration-200 shadow-none";
  const selectTriggerStyles =
    "bg-black/40 border border-white/10 hover:border-white/20 data-[focus=true]:border-white/30 data-[focus=true]:bg-black/60 shadow-none transition-all rounded-xl py-2.5 px-4 text-white w-full h-11 flex items-center justify-between text-sm cursor-pointer";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (planStatus && !planStatus.canPost) {
      setServerError(
        "You have reached your active job post limit. Upgrade your plan to post more jobs.",
      );
      return;
    }

    setLoading(true);
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    data.isRemote = isRemote;
    data.status = "active";
    data.companyId = session?.user?.companyId || "auto-linked-id";

    // 🚀 Binds the post directly to the recruiter!
    data.recruiterId = session?.user?.id;
    data.recruiterEmail = session?.user?.email;

    try {
      const result = await createJobAction(data);

      if (!result.success) {
        setServerError(
          result.error || "Failed to post the job. Please try again.",
        );
        setLoading(false);
        return;
      }

      router.push("/dashboard/recruiter/jobs");
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 text-left">
        <h1 className="text-3xl font-medium text-white tracking-tight mb-2">
          Post a New Job
        </h1>
        <p className="text-sm text-gray-400">
          Find the best talent by providing clear and detailed information about
          the role.
        </p>
      </header>

      {!loadingPlan && planStatus && (
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Posting Plan
            </p>
            <p className="text-white font-semibold capitalize">
              {planStatus.plan?.replace("recruiter_", "") || "Free"} plan
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {planStatus.remaining === "unlimited"
                ? "Unlimited active job posts"
                : `${planStatus.remaining} active job post${planStatus.remaining === 1 ? "" : "s"} remaining`}
            </p>
          </div>
          {!planStatus.canPost && (
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold"
            >
              Upgrade Plan
            </Link>
          )}
        </div>
      )}

      <Form
        validationBehavior="native"
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 w-full"
      >
        {/* SECTION 1: Job Info */}
        <section className="bg-[#161618] border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm w-full text-left">
          <h2 className="text-lg font-medium text-white border-b border-white/5 pb-4">
            1. Basic Information
          </h2>

          <div className="flex flex-col w-full">
            <label className={labelStyle}>Job Title</label>
            <input
              required
              name="title"
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              className={baseInputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <Select name="category" isRequired className="w-full">
              <Label className={labelStyle}>Job Category</Label>
              <Select.Trigger className={selectTriggerStyles}>
                <Select.Value
                  placeholder="Select a category"
                  className="text-sm text-white"
                />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl">
                <ListBox>
                  <ListBox.Item
                    id="engineering"
                    textValue="Software Engineering"
                  >
                    Software Engineering
                  </ListBox.Item>
                  <ListBox.Item id="design" textValue="Product Design">
                    Product Design
                  </ListBox.Item>
                  <ListBox.Item id="marketing" textValue="Marketing & Sales">
                    Marketing & Sales
                  </ListBox.Item>
                  <ListBox.Item id="hr" textValue="Human Resources">
                    Human Resources
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <Select name="type" isRequired className="w-full">
              <Label className={labelStyle}>Job Type</Label>
              <Select.Trigger className={selectTriggerStyles}>
                <Select.Value
                  placeholder="Select job type"
                  className="text-sm text-white"
                />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl">
                <ListBox>
                  <ListBox.Item id="full-time" textValue="Full-time">
                    Full-time
                  </ListBox.Item>
                  <ListBox.Item id="part-time" textValue="Part-time">
                    Part-time
                  </ListBox.Item>
                  <ListBox.Item id="contract" textValue="Contract">
                    Contract
                  </ListBox.Item>
                  <ListBox.Item id="internship" textValue="Internship">
                    Internship
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </section>

        {/* SECTION 2: Compensation & Location */}
        <section className="bg-[#161618] border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm w-full text-left">
          <h2 className="text-lg font-medium text-white border-b border-white/5 pb-4">
            2. Compensation & Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Select
              name="currency"
              defaultSelectedKeys={["usd"]}
              className="w-full"
            >
              <Label className={labelStyle}>Currency</Label>
              <Select.Trigger className={selectTriggerStyles}>
                <Select.Value
                  placeholder="Currency"
                  className="text-sm text-white"
                />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl">
                <ListBox>
                  <ListBox.Item id="usd" textValue="USD ($)">
                    USD ($)
                  </ListBox.Item>
                  <ListBox.Item id="eur" textValue="EUR (€)">
                    EUR (€)
                  </ListBox.Item>
                  <ListBox.Item id="gbp" textValue="GBP (£)">
                    GBP (£)
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <div className="flex flex-col w-full">
              <label className={labelStyle}>Minimum Salary</label>
              <input
                name="minSalary"
                type="number"
                placeholder="e.g. 80000"
                className={baseInputStyle}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className={labelStyle}>Maximum Salary</label>
              <input
                name="maxSalary"
                type="number"
                placeholder="e.g. 120000"
                className={baseInputStyle}
              />
            </div>
          </div>

          <div className="py-2 mt-2 w-full animate-in fade-in zoom-in-95 duration-500">
            <Switch
              isSelected={isRemote}
              onChange={setIsRemote}
              className="w-full group"
            >
              <Switch.Content className="flex flex-row-reverse w-full items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#161618] hover:bg-[#1c1c1e] transition-all duration-300 cursor-pointer shadow-sm active:scale-[0.99]">
                <Switch.Control className="bg-black/60 border border-white/10 data-[selected=true]:bg-blue-500 transition-colors shadow-inner shrink-0">
                  <Switch.Thumb className="shadow-md" />
                </Switch.Control>

                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0 transition-all duration-300 group-data-[selected=true]:bg-blue-500/20 group-data-[selected=true]:scale-105">
                    <Globe className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium text-white tracking-tight">
                      Fully remote position
                    </span>
                    <span className="text-xs text-gray-500">
                      Candidates can work from anywhere around the globe.
                    </span>
                  </div>
                </div>
              </Switch.Content>
            </Switch>
          </div>

          {!isRemote && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col w-full">
                <label className={labelStyle}>City</label>
                <input
                  required={!isRemote}
                  name="city"
                  type="text"
                  placeholder="e.g. San Francisco"
                  className={baseInputStyle}
                />
              </div>
              <div className="flex flex-col w-full">
                <label className={labelStyle}>Country</label>
                <input
                  required={!isRemote}
                  name="country"
                  type="text"
                  placeholder="e.g. United States"
                  className={baseInputStyle}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col w-full sm:w-1/2 mt-2">
            <label className={labelStyle}>Application Deadline</label>
            <input
              required
              name="deadline"
              type="date"
              className={`${baseInputStyle} appearance-none`}
            />
          </div>
        </section>

        {/* SECTION 3: Job Description */}
        <section className="bg-[#161618] border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm w-full text-left">
          <h2 className="text-lg font-medium text-white border-b border-white/5 pb-4">
            3. Job Description
          </h2>

          <div className="flex flex-col w-full">
            <label className={labelStyle}>Responsibilities</label>
            <textarea
              required
              name="responsibilities"
              rows={4}
              placeholder="What will the day-to-day work look like?"
              className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-black/60 text-white placeholder:text-gray-600 text-sm rounded-xl p-4 outline-none transition-all duration-200 resize-none shadow-none"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className={labelStyle}>Requirements</label>
            <textarea
              required
              name="requirements"
              rows={4}
              placeholder="What skills, tools, and experiences are required?"
              className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-black/60 text-white placeholder:text-gray-600 text-sm rounded-xl p-4 outline-none transition-all duration-200 resize-none shadow-none"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className={labelStyle}>Benefits (Optional)</label>
            <textarea
              name="benefits"
              rows={3}
              placeholder="List perks, health insurance, PTO, etc."
              className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-black/60 text-white placeholder:text-gray-600 text-sm rounded-xl p-4 outline-none transition-all duration-200 resize-none shadow-none"
            />
          </div>
        </section>

        {/* SECTION 4: Auto-filled Company Info Display */}
        <section className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Briefcase className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-white">
                Posting on behalf of
              </span>
              <span className="text-xs text-blue-300/80">
                HireLoop Inc. (Auto-linked to your Recruiter Profile)
              </span>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-medium text-green-400">
            Approved
          </div>
        </section>

        {serverError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-end gap-4 mt-4 border-t border-white/10 pt-8 w-full">
          <Button
            type="button"
            variant="flat"
            onClick={() => router.back()}
            className="bg-white/5 text-white hover:bg-white/10 font-medium px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            endContent={!loading && <ArrowRight className="h-4 w-4" />}
            className="bg-white text-black font-semibold shadow-xl hover:bg-gray-200 px-8 cursor-pointer"
          >
            {loading ? "Posting Job..." : "Publish Job"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
