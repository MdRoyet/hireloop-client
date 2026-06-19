"use client";

import { useEffect, useState } from "react";
// 🚀 1. Import useRouter instead of Link
import { useRouter } from "next/navigation";
import { Button, Spinner, Select, ListBox, Switch } from "@heroui/react";
import {
  Magnifier,
  Briefcase,
  Globe,
  MapPin,
  Calendar,
  Funnel,
} from "@gravity-ui/icons";
import { getGlobalJobsAction } from "@/lib/actions/jobs";

export default function BrowseJobsPage() {
  const router = useRouter(); // 🚀 2. Initialize the router
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
    isRemote: false,
  });

  const selectTriggerStyles =
    "bg-black/40 border border-white/10 hover:border-white/20 data-[focus=true]:border-blue-500 data-[focus=true]:bg-black/60 shadow-none transition-all rounded-xl py-2.5 px-4 text-white w-full flex items-center justify-between text-sm";

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await getGlobalJobsAction(filters);
        if (response.success) {
          setJobs(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 animate-in fade-in duration-500">
      <header className="mb-10 border-b border-white/5 pb-8 text-center md:text-left">
        <h1 className="text-4xl font-semibold text-white tracking-tight mb-3">
          Find your next opportunity
        </h1>
        <p className="text-base text-gray-400 max-w-2xl">
          Browse thousands of open positions from top companies. Use the filters
          to find the perfect role that matches your skills and work style.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-[300px] shrink-0 bg-[#161618] border border-white/5 rounded-2xl p-6 sticky top-24 shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-white font-medium">
            <Funnel className="h-5 w-5 text-blue-400" />
            <h3>Search Filters</h3>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Keywords
              </label>
              <div className="relative flex items-center">
                <Magnifier className="absolute left-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Job title or keyword..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full h-11 bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Category
              </label>
              <Select
                selectedKeys={[filters.category]}
                onSelectionChange={(keys) =>
                  handleFilterChange("category", Array.from(keys)[0])
                }
                className="w-full"
              >
                <Select.Trigger className={selectTriggerStyles}>
                  <Select.Value className="text-sm text-white capitalize" />
                </Select.Trigger>
                <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl">
                  <ListBox>
                    <ListBox.Item id="all" textValue="All Categories">
                      All Categories
                    </ListBox.Item>
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
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Job Type
              </label>
              <Select
                selectedKeys={[filters.type]}
                onSelectionChange={(keys) =>
                  handleFilterChange("type", Array.from(keys)[0])
                }
                className="w-full"
              >
                <Select.Trigger className={selectTriggerStyles}>
                  <Select.Value className="text-sm text-white capitalize" />
                </Select.Trigger>
                <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl">
                  <ListBox>
                    <ListBox.Item id="all" textValue="All Types">
                      All Types
                    </ListBox.Item>
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

            <div className="pt-2 border-t border-white/5">
              <Switch
                isSelected={filters.isRemote}
                onChange={(isSelected) =>
                  handleFilterChange("isRemote", isSelected)
                }
                className="w-full"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-white ml-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  Remote only
                </div>
              </Switch>
            </div>

            <Button
              variant="flat"
              onClick={() =>
                setFilters({
                  search: "",
                  category: "all",
                  type: "all",
                  isRemote: false,
                })
              }
              className="mt-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium text-sm"
            >
              Clear All Filters
            </Button>
          </div>
        </aside>

        <div className="flex-1 w-full min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 w-full h-full border border-white/5 rounded-2xl bg-[#161618]/50">
              <Spinner size="lg" color="white" />
              <p className="text-sm text-gray-500 animate-pulse">
                Searching positions...
              </p>
            </div>
          ) : error ? (
            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-sm text-red-400 font-medium">
              ⚠️ {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-white/10 rounded-2xl bg-[#161618]/30 h-full">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                <Magnifier className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No matches found
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                We couldn&apos;t find any roles matching your exact filters. Try
                adjusting your search criteria or clearing filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full animate-in fade-in zoom-in-95 duration-300">
              <div className="col-span-full mb-2 text-sm font-medium text-gray-400">
                Showing <span className="text-white">{jobs.length}</span> open
                positions
              </div>

              {jobs.map((job) => {
                const remoteFlag =
                  job.isRemote === "true" || job.isRemote === true;

                return (
                  <article
                    key={job._id}
                    className="group p-6 bg-[#161618] border border-white/5 rounded-2xl flex flex-col justify-between min-h-[290px] transition-all duration-300 hover:border-white/10 hover:bg-[#1c1c1e] shadow-lg cursor-pointer"
                    onClick={() => router.push(`/browse-jobs/${job._id}`)} // 🚀 Added to make whole card clickable!
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-900/40 to-slate-800/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Briefcase className="h-5 w-5 text-gray-300" />
                        </div>

                        <div className="flex items-center gap-2">
                          {remoteFlag ? (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-500/10 border border-green-500/20 text-green-400">
                              Remote
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-400">
                              Onsite
                            </span>
                          )}
                        </div>
                      </div>

                      <h2 className="text-xl font-semibold text-white tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors mb-1.5">
                        {job.title}
                      </h2>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-5 capitalize">
                        <span className="text-gray-400">{job.category}</span>
                        <span className="h-1 w-1 rounded-full bg-white/10 shrink-0" />
                        <span className="text-gray-500 font-medium">
                          {job.type?.replace("-", " ")}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 pt-4 border-t border-white/5 w-full text-xs">
                        <div className="flex items-center gap-2 text-gray-400">
                          {remoteFlag ? (
                            <>
                              <Globe className="h-4 w-4 text-gray-500 shrink-0" />
                              <span>Global / Anywhere</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                              <span className="truncate">
                                {job.city || "N/A"}, {job.country || "N/A"}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-gray-300 font-medium">
                          <span className="text-gray-500 font-normal">
                            Pay:
                          </span>
                          <span>
                            {job.minSalary && job.maxSalary
                              ? `${job.currency?.toUpperCase() || "USD"} ${Number(job.minSalary).toLocaleString()} - ${Number(job.maxSalary).toLocaleString()}`
                              : "Competitive Salary"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-4 mt-6 border-t border-white/5 w-full">
                      {/* 🚀 3. Fixed Button Routing using onClick */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents double firing since the whole card is clickable
                          router.push(`/browse-jobs/${job._id}`);
                        }}
                        className="bg-white/5 text-white hover:bg-white/10 font-medium text-xs h-9 px-4 cursor-pointer"
                      >
                        View Details
                      </Button>
                      <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
