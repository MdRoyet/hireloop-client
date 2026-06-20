"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { normalizeRole } from "@/lib/roles";

export function RoleGuard({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/auth/signin");
      return;
    }

    const role = normalizeRole(session.user.role);
    const isRecruiterRoute = pathname.startsWith("/dashboard/recruiter");
    const isSeekerRoute = pathname.startsWith("/dashboard/job-seeker");

    if (isRecruiterRoute && role !== "recruiter" && role !== "admin") {
      router.replace("/dashboard/job-seeker");
      return;
    }

    if (isSeekerRoute && role === "recruiter") {
      router.replace("/dashboard/recruiter");
    }
  }, [session, isPending, pathname, router]);

  useEffect(() => {
    async function syncBillingProfile() {
      if (!session?.user?.email) return;

      try {
        await fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            authUserId: session.user.id,
            createdAt: session.user.createdAt,
          }),
        });
      } catch (error) {
        console.error("Failed to sync billing profile:", error);
      }
    }

    if (session?.user) {
      syncBillingProfile();
    }
  }, [session]);

  if (isPending || !session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" color="white" />
        <p className="text-sm text-gray-500">Checking account access...</p>
      </div>
    );
  }

  return children;
}
