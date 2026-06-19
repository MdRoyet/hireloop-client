"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Form,
  Input,
  TextArea,
  Select,
  ListBox,
  Label,
  Button,
} from "@heroui/react";

export default function CompanyPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);

  // Core visual theme properties matching image_48adc3.png preset
  const inputStyles = {
    label: "text-sm font-medium text-gray-300 pb-1.5",
    input: "text-white placeholder:text-gray-600 text-sm",
    inputWrapper:
      "bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-white/30 focus-within:!bg-black/60 shadow-none transition-all rounded-xl h-11",
    innerWrapper: "pb-0",
  };

  const selectTriggerStyles =
    "bg-black/40 border border-white/10 hover:border-white/20 data-[focus=true]:border-white/30 data-[focus=true]:bg-black/60 shadow-none transition-all rounded-xl py-2.5 px-4 text-white w-full h-11 flex items-center justify-between text-sm";

  // Handles reading the local file binary string for instant preview rendering
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerError("Logo image size file must be under 5MB.");
        return;
      }
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

    // Attach current user session contexts
    data.userId = session?.user?.id;
    data.logoFile = logoName;

    try {
      console.log("Pushing raw company payload to database pipeline:", data);

      // Raw pipeline connection endpoint string
      const response = await fetch("http://localhost:5000/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process transaction rules.");
      }

      // Route cleanly to dashboard root upon complete data write synchronization
      router.push("/dashboard/recruiter");
    } catch (error) {
      setServerError(
        error.message || "Could not register details. Check server connection.",
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
        <div className="p-6 sm:p-8 border-b border-white/5">
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
            Register New Company
          </h1>
          <p className="text-sm text-gray-400">
            Enter your business details to start hiring on HireLoop.
          </p>
        </div>

        {/* Core Multi-Column Form Body Block Area */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {/* Field 1: Company Name */}
            <Input
              name="companyName"
              label="Company Name"
              labelPlacement="outside"
              placeholder="e.g. Acme Corp"
              isRequired
              classNames={inputStyles}
            />

            {/* Field 2: Industry Selector */}
            <Select name="industry" isRequired className="w-full">
              <Label className="text-sm font-medium text-gray-300 pb-1.5 block">
                Industry / Category
              </Label>
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

            {/* Field 3: Website URL with Static Domain Prefix Block */}
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-gray-300 pb-1.5">
                Website URL
              </label>
              <Input
                name="website"
                placeholder="www.company.com"
                isRequired
                classNames={{
                  ...inputStyles,
                  label: "hidden",
                }}
                startContent={
                  <div className="flex items-center justify-center bg-white/5 text-gray-400 text-xs px-3 h-11 -ml-3 mr-2 border-r border-white/10 rounded-l-xl select-none font-medium">
                    https://
                  </div>
                }
              />
            </div>

            {/* Field 4: Location Map Node Input */}
            <Input
              name="location"
              label="Location"
              labelPlacement="outside"
              placeholder="City, Country"
              isRequired
              classNames={inputStyles}
              startContent={
                <svg
                  className="h-4 w-4 text-gray-500 mr-1.5 shrink-0"
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
              }
            />

            {/* Field 5: Employee Counter Component */}
            <Select name="employeeCount" isRequired className="w-full">
              <Label className="text-sm font-medium text-gray-300 pb-1.5 block">
                Employee Count Range
              </Label>
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

            {/* Field 6: Interactive Logo Multi-State Upload Container Box */}
            <div className="flex flex-col w-full text-left">
              <span className="text-sm font-medium text-gray-300 pb-1.5">
                Company Logo
              </span>
              <label className="h-11 border border-dashed border-white/10 hover:border-white/20 bg-black/40 hover:bg-black/50 transition-all rounded-xl flex items-center px-4 gap-3 cursor-pointer group overflow-hidden">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <div className="h-6 w-6 rounded bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded"
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

          {/* Field 7: Full Width Brief Description Box */}
          <TextArea
            name="description"
            label="Brief Description"
            labelPlacement="outside"
            placeholder="Tell us about your company's mission and culture..."
            isRequired
            minRows={4}
            classNames={{
              ...inputStyles,
              inputWrapper:
                "h-auto py-3 bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-white/30 focus-within:!bg-black/60 shadow-none transition-all rounded-xl",
            }}
          />

          {serverError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
              ⚠️ {serverError}
            </div>
          )}
        </div>

        {/* Bottom Shaded Actions Toolbar Panel Section */}
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
            Register Company
          </Button>
        </div>
      </Form>
    </div>
  );
}
