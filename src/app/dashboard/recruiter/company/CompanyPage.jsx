"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
// 🚀 Removed Modal and ModalContent from here to fix the build error
import { Form, Select, ListBox, Label, Button, Spinner } from "@heroui/react";
import { MapPin, Persons, Globe, Plus } from "@gravity-ui/icons";
import { getCompaniesAction } from "@/lib/actions/companies";

export default function CompanyPage() {
  const { data: session, isPending } = useSession();

  // Dashboard State
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);

  // Form Styles
  const labelStyle = "text-sm font-medium text-gray-300 pb-1.5 block text-left";
  const baseInputStyle =
    "w-full h-11 bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-black/60 text-white placeholder:text-gray-600 text-sm rounded-xl px-4 outline-none transition-all duration-200 shadow-none";
  const selectTriggerStyles =
    "bg-black/40 border border-white/10 hover:border-white/20 data-[focus=true]:border-white/30 data-[focus=true]:bg-black/60 shadow-none transition-all rounded-xl py-2.5 px-4 text-white w-full h-11 flex items-center justify-between text-sm cursor-pointer";

  // Fetch Companies Logic
  const fetchCompanies = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await getCompaniesAction(session.user.id);
      if (response.success) {
        setCompanies(response.data);
      } else {
        setFetchError(response.error);
      }
    } catch (err) {
      setFetchError("Failed to fetch companies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }
    fetchCompanies();
  }, [session, isPending]);

  // Handle Logo Upload Preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerError("Logo image size file must be under 5MB.");
        return;
      }
      setLogoFile(file);
      setLogoName(file.name);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Reset modal state when closed
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setServerError("");
    setLogoFile(null);
    setLogoName("");
    setLogoPreview(null);
  };

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    data.recruiterId = session?.user?.id || "fallback-recruiter-id";
    data.createdAt = new Date().toISOString();
    data.status = "pending";

    try {
      let uploadedUrl = "";

      if (logoFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", logoFile);

        const targetEndpoint = process.env.NEXT_PUBLIC_API_IMAGES_URL;
        if (!targetEndpoint) throw new Error("Missing API config.");

        const imgResponse = await fetch(targetEndpoint, {
          method: "POST",
          body: imageFormData,
        });
        const imgResult = await imgResponse.json();

        if (!imgResponse.ok) throw new Error("Failed to upload company logo.");
        uploadedUrl =
          imgResult.data?.url || imgResult.url || imgResult.secure_url || "";
      }

      data.logoUrl = uploadedUrl;
      data.logoFile = logoName;

      const response = await fetch("http://localhost:5000/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to save registration.");

      // Success! Close modal and refresh the grid
      handleCloseModal();
      fetchCompanies();
    } catch (error) {
      setServerError(
        error.message || "An error occurred. Check your server connection.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto pb-12 pt-4 animate-in fade-in duration-500 text-left relative">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight mb-2">
            My Companies
          </h1>
          <p className="text-sm text-gray-400">
            Manage your registered companies and their verification states.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          endContent={<Plus className="h-4 w-4" />}
          className="bg-white text-black font-semibold shadow-xl hover:bg-gray-200 shrink-0 cursor-pointer"
        >
          Register a company
        </Button>
      </header>

      {/* Grid Content Section */}
      {isLoading || isPending ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 w-full">
          <Spinner size="lg" color="white" />
          <p className="text-sm text-gray-500 animate-pulse">
            Fetching your companies...
          </p>
        </div>
      ) : fetchError ? (
        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-sm text-red-400 font-medium">
          ⚠️ {fetchError}
        </div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-2xl bg-[#161618]/30">
          <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
            <Globe className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-white mb-1">
            No companies registered
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mb-6">
            You haven&apos;t added any businesses to your portfolio yet.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="flat"
            className="bg-white/5 text-white hover:bg-white/10 font-medium text-xs px-6 cursor-pointer"
          >
            Register First Company
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {companies.map((company) => (
            <article
              key={company._id}
              className="p-6 bg-[#161618] border border-white/5 rounded-2xl flex flex-col justify-between min-h-[300px] hover:border-white/10 hover:bg-[#1a1a1c] transition-all shadow-xl"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.companyName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-black uppercase">
                        {company.companyName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-white tracking-tight">
                      {company.companyName}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {company.industry}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border ${
                    company.status === "approved"
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                      : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                  }`}
                >
                  {company.status || "PENDING"}
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed line-clamp-4 flex-1 mb-6">
                {company.description}
              </p>

              <div className="flex flex-col gap-3 pt-4 border-t border-white/5 w-full text-xs text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate max-w-[120px]">
                      {company.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Persons className="h-4 w-4" />
                    <span>{company.employeeCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Globe className="h-4 w-4" />
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white hover:underline transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 🚀 CUSTOM TAILWIND OVERLAY MODAL (Replaces HeroUI Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Modal Container */}
          <div className="bg-[#161618] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <Form
              validationBehavior="native"
              onSubmit={handleSubmit}
              className="flex flex-col w-full text-left h-full"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 w-full shrink-0">
                <h2 className="text-xl font-semibold text-white tracking-tight mb-1">
                  Register New Company
                </h2>
                <p className="text-sm text-gray-400">
                  Enter your business details to start hiring on HireLoop.
                </p>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 flex flex-col gap-6 w-full overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div className="flex flex-col w-full">
                    <label className={labelStyle}>Company Name</label>
                    <input
                      required
                      name="companyName"
                      type="text"
                      placeholder="e.g. Acme Corp"
                      className={baseInputStyle}
                    />
                  </div>

                  <Select name="industry" isRequired className="w-full">
                    <Label className={labelStyle}>Industry / Category</Label>
                    <Select.Trigger className={selectTriggerStyles}>
                      <Select.Value
                        placeholder="Technology"
                        className="text-sm text-white"
                      />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl z-[150]">
                      <ListBox>
                        <ListBox.Item id="technology" textValue="Technology">
                          Technology
                        </ListBox.Item>
                        <ListBox.Item
                          id="finance"
                          textValue="Finance & Banking"
                        >
                          Finance & Banking
                        </ListBox.Item>
                        <ListBox.Item id="healthcare" textValue="Healthcare">
                          Healthcare
                        </ListBox.Item>
                        <ListBox.Item
                          id="blockchain"
                          textValue="Web3 / Blockchain"
                        >
                          Web3 / Blockchain
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <div className="flex flex-col w-full">
                    <label className={labelStyle}>Website URL</label>
                    <div className="flex items-center w-full h-11 bg-black/40 border border-white/10 focus-within:border-white/30 rounded-xl overflow-hidden">
                      <div className="bg-white/5 text-gray-400 text-xs px-4 h-full flex items-center border-r border-white/10 shrink-0">
                        https://
                      </div>
                      <input
                        required
                        name="website"
                        type="text"
                        placeholder="www.company.com"
                        className="w-full h-full bg-transparent px-4 text-white placeholder:text-gray-600 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className={labelStyle}>Location</label>
                    <div className="flex items-center w-full h-11 bg-black/40 border border-white/10 focus-within:border-white/30 rounded-xl px-4">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                      <input
                        required
                        name="location"
                        type="text"
                        placeholder="City, Country"
                        className="w-full h-full bg-transparent text-white placeholder:text-gray-600 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <Select name="employeeCount" isRequired className="w-full">
                    <Label className={labelStyle}>Employee Count</Label>
                    <Select.Trigger className={selectTriggerStyles}>
                      <Select.Value
                        placeholder="1-10 employees"
                        className="text-sm text-white"
                      />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl z-[150]">
                      <ListBox>
                        <ListBox.Item id="1-10" textValue="1-10 range">
                          1-10 range
                        </ListBox.Item>
                        <ListBox.Item id="11-50" textValue="11-50 range">
                          11-50 range
                        </ListBox.Item>
                        <ListBox.Item id="51-200" textValue="51-200 range">
                          51-200 range
                        </ListBox.Item>
                        <ListBox.Item id="201-500" textValue="201-500 range">
                          201-500 range
                        </ListBox.Item>
                        <ListBox.Item id="501-1000" textValue="501-1000 range">
                          501-1000 range
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <div className="flex flex-col w-full">
                    <span className={labelStyle}>Company Logo</span>
                    <label className="h-11 border border-dashed border-white/10 bg-black/40 hover:bg-black/50 transition-all rounded-xl flex items-center px-4 gap-3 cursor-pointer overflow-hidden">
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                      <div className="h-6 w-6 rounded bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Plus className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col items-start truncate">
                        <span className="text-xs text-white truncate">
                          {logoName || "Upload image"}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <label className={labelStyle}>Brief Description</label>
                  <textarea
                    required
                    name="description"
                    rows={4}
                    placeholder="Company mission and culture..."
                    className="w-full bg-black/40 border border-white/10 focus:border-white/30 text-white placeholder:text-gray-600 text-sm rounded-xl p-4 outline-none resize-none"
                  />
                </div>

                {serverError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    {serverError}
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="bg-black/20 border-t border-white/5 p-4 flex items-center justify-end gap-3 w-full shrink-0">
                <Button
                  type="button"
                  variant="flat"
                  onClick={handleCloseModal}
                  className="bg-transparent text-gray-400 hover:text-white hover:bg-white/5 font-medium px-5 rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-white text-black hover:bg-gray-200 font-medium px-6 rounded-xl text-sm shadow-xl shrink-0 cursor-pointer"
                >
                  {isSubmitting ? "Registering..." : "Register Company"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
