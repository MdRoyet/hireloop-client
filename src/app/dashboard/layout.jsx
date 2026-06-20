import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
      <DashboardSidebar></DashboardSidebar>

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f11]">
        <RoleGuard>{children}</RoleGuard>
      </div>
    </div>
  );
}
