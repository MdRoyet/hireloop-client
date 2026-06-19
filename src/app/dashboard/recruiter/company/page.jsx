"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Form, Select, ListBox, Label, Button } from "@heroui/react";

export default function CompanyPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [logoFile, setLogoFile] = useState(null); // 🚀 Stores the actual file binary object
  const [logoName, setLogoName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);

  // Consolidated semantic wrapper styling variables matching image_48adc3.png
  const labelStyle = "text-sm font-medium text-gray-300 pb-1.5 block text-left";
  const baseInputStyle =
    "w-full h-11 bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-black/60 text-white placeholder:text-gray-600 text-sm rounded-xl px-4 outline-none transition-all duration-200 shadow-none";
  const selectTriggerStyles =
    "bg-black/40 border border-white/10 hover:border-white/20 data-[focus=true]:border-white/30 data-[focus=true]:bg-black/60 shadow-none transition-all rounded-xl py-2.5 px-4 text-white w-full h-11 flex items-center justify-between text-sm cursor-pointer";

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerError("Logo image size file must be under 5MB.");
        return;
      }
      setLogoFile(file); // Saves the binary for the network payload step
      setLogoName(file.name);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    data.userId = session?.user?.id;

    try {
      let uploadedUrl = "";

      // 🚀 STEP 1: Process Image Upload to External API Service if file is present
      if (logoFile) {
        console.log("Initiating image uploading sequence to service...");
        const imageFormData = new FormData();
        imageFormData.append("image", logoFile); // Appends the file binary natively

        const targetEndpoint = process.env.NEXT_PUBLIC_API_IMAGES_URL;

        if (!targetEndpoint) {
          throw new Error("Missing NEXT_PUBLIC_API_IMAGES_URL configuration.");
        }

        const imgResponse = await fetch(targetEndpoint, {
          method: "POST",
          body: imageFormData, // Sends the multipart data directly
        });

        const imgResult = await imgResponse.json();

        if (!imgResponse.ok) {
          throw new Error("Failed to upload company logo image to service.");
        }

        // Resolves standard image hosting response mappings dynamically (ImgBB, Cloudinary, etc.)
        uploadedUrl =
          imgResult.data?.url || imgResult.url || imgResult.secure_url || "";
        console.log("Image upload successful! Live hosted URL:", uploadedUrl);
      }

      // 🚀 STEP 2: Bind the live image URL straight into our database collection metadata payload
      data.logoUrl = uploadedUrl;
      data.logoFile = logoName;

      console.log(
        "Pushing final company schema object down to MongoDB pipeline:",
        data,
      );

      const response = await fetch("http://localhost:5000/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Failed to save registration metadata.",
        );

      router.push("/dashboard/recruiter");
    } catch (error) {
      setServerError(
        error.message ||
          "An error occurred. Check your server connection pipelines.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto pb-12 pt-6 flex justify-center items-center min-h-[85vh] animate-in fade-in zoom-in-95 duration-400">
      <Form
        validationBehavior="native"
        onSubmit={handleSubmit}
        className="bg-[#161618] border border-white/5 rounded-2xl w-full shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Header Block Section */}
        <div className="p-6 sm:p-8 border-b border-white/5 w-full">
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
            Register New Company
          </h1>
          <p className="text-sm text-gray-400">
            Enter your business details to start hiring on HireLoop.
          </p>
        </div>

        {/* Form Body Block */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {/* Field 1: Company Name */}
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

            {/* Field 2: Industry Selector */}
            <Select name="industry" isRequired className="w-full">
              <Label className={labelStyle}>Industry / Category</Label>
              <Select.Trigger className={selectTriggerStyles}>
                <Select.Value
                  placeholder="Technology"
                  className="text-sm text-white"
                />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl">
                <ListBox>
                  <ListBox.Item id="technology" textValue="Technology">
                    Technology
                  </ListBox.Item>
                  <ListBox.Item id="finance" textValue="Finance & Banking">
                    Finance & Banking
                  </ListBox.Item>
                  <ListBox.Item id="healthcare" textValue="Healthcare">
                    Healthcare
                  </ListBox.Item>
                  <ListBox.Item id="blockchain" textValue="Web3 / Blockchain">
                    Web3 / Blockchain
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Field 3: Website URL with Integrated Prefix Container */}
            <div className="flex flex-col w-full">
              <label className={labelStyle}>Website URL</label>
              <div className="flex items-center w-full h-11 bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-white/30 focus-within:bg-black/60 rounded-xl transition-all overflow-hidden">
                <div className="bg-white/5 text-gray-400 text-xs px-4 h-full flex items-center border-r border-white/10 select-none font-medium shrink-0">
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

            {/* Field 4: Location Map Node Input */}
            <div className="flex flex-col w-full">
              <label className={labelStyle}>Location</label>
              <div className="flex items-center w-full h-11 bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-white/30 focus-within:bg-black/60 rounded-xl transition-all overflow-hidden px-4">
                <svg
                  className="h-4 w-4 text-gray-500 mr-2 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  required
                  name="location"
                  type="text"
                  placeholder="City, Country"
                  className="w-full h-full bg-transparent text-white placeholder:text-gray-600 text-sm outline-none"
                />
              </div>
            </div>

            {/* Field 5: Employee Counter */}
            <Select name="employeeCount" isRequired className="w-full">
              <Label className={labelStyle}>Employee Count Range</Label>
              <Select.Trigger className={selectTriggerStyles}>
                <Select.Value
                  placeholder="1-10 employees"
                  className="text-sm text-white"
                />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl">
                <ListBox>
                  <ListBox.Item id="1-10" textValue="1-10 employees">
                    1-10 employees
                  </ListBox.Item>
                  <ListBox.Item id="11-50" textValue="11-50 employees">
                    11-50 employees
                  </ListBox.Item>
                  <ListBox.Item id="51-200" textValue="51-200 employees">
                    51-200 employees
                  </ListBox.Item>
                  <ListBox.Item id="201+" textValue="201+ employees">
                    201+ employees
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Field 6: Live Image Upload File Picker Box Container */}
            <div className="flex flex-col w-full text-left">
              <span className={labelStyle}>Company Logo</span>
              <label className="h-11 border border-dashed border-white/10 hover:border-white/20 bg-black/40 hover:bg-black/50 transition-all rounded-xl flex items-center px-4 gap-3 cursor-pointer group overflow-hidden">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <div className="h-6 w-6 rounded bg-white/5 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-3.5 w-3.5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col items-start truncate text-left">
                  <span className="text-xs font-medium text-white group-hover:text-gray-300 transition-colors truncate max-w-[180px]">
                    {logoName || "Upload image"}
                  </span>
                  {!logoName && (
                    <span className="text-[10px] text-gray-500 font-normal">
                      PNG, JPG up to 5MB
                    </span>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Field 7: Description Text Box */}
          <div className="flex flex-col w-full">
            <label className={labelStyle}>Brief Description</label>
            <textarea
              required
              name="description"
              rows={4}
              placeholder="Tell us about your company's mission and culture..."
              className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-black/60 text-white placeholder:text-gray-600 text-sm rounded-xl p-4 outline-none transition-all duration-200 resize-none shadow-none"
            />
          </div>

          {serverError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
              ⚠️ {serverError}
            </div>
          )}
        </div>

        {/* Bottom Actions Shaded Control Panel Toolbar */}
        <div className="bg-black/20 border-t border-white/5 p-4 flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="flat"
            onClick={() => router.back()}
            className="bg-transparent text-gray-400 hover:text-white hover:bg-white/5 font-medium px-5 rounded-xl text-sm transition-all h-10 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={loading}
            className="bg-white text-black hover:bg-gray-200 font-medium px-6 rounded-xl text-sm shadow-xl transition-all h-10 cursor-pointer shrink-0"
          >
            {loading ? "Registering..." : "Register Company"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
