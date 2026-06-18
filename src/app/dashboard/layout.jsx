// Ensure this path matches where you saved the component

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
      {/* Persistent Sidebar for ALL dashboard routes */}
      <DashboardSidebar></DashboardSidebar>

      {/* The dynamically changing page content (Recruiter page, Admin page, etc.) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f11]">
        {children}
      </div>
    </div>
  );
}
