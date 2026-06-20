import { redirect } from "next/navigation";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { upgradeUserPlan } from "@/lib/plan-upgrade";
import { dashboardPathForRole, normalizeRole } from "@/lib/roles";
import { formatPlanLabel, planFromStripePriceId } from "@/lib/plan";

async function resolvePlanFromCheckoutSession(session) {
  if (session.metadata?.planId) {
    return session.metadata.planId;
  }

  const priceId = session.line_items?.data?.[0]?.price?.id;
  return planFromStripePriceId(priceId);
}

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/pricing");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items"],
  });

  const status = session.status;
  const customerEmail =
    session.customer_details?.email ||
    session.metadata?.userEmail ||
    session.customer_email;
  const userRole = session.metadata?.userRole;

  if (status === "open") {
    redirect("/pricing");
  }

  if (status === "complete") {
    let upgradedPlan = session.metadata?.planId;

    try {
      const planId = await resolvePlanFromCheckoutSession(session);
      if (planId && customerEmail) {
        const result = await upgradeUserPlan({
          email: customerEmail,
          plan: planId,
          role: userRole,
          authUserId: session.metadata?.authUserId,
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : undefined,
          stripeSubscriptionId:
            typeof session.subscription === "string"
              ? session.subscription
              : undefined,
        });
        upgradedPlan = result.plan || planId;
      }
    } catch (error) {
      console.error("Success page plan upgrade error:", error);
    }

    const dashboardPath = dashboardPathForRole(userRole);
    const planLabel = formatPlanLabel(upgradedPlan);

    return (
      <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans antialiased px-4">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#bef264] blur-[150px] opacity-15 animate-pulse" />
        </div>

        <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-3xl p-10 text-center shadow-2xl shadow-[#bef264]/5 backdrop-blur-md relative animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#bef264]/50 to-transparent" />

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#bef264] blur-xl opacity-20 rounded-full animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-[#bef264]/10 border border-[#bef264]/20 flex items-center justify-center relative z-10">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#bef264]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">
              Payment Successful!
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              Your account is now on the{" "}
              <span className="text-[#bef264] font-semibold capitalize">
                {planLabel}
              </span>{" "}
              plan.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A confirmation receipt has been sent to{" "}
              <span className="text-white font-medium">{customerEmail}</span>.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={dashboardPath}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#bef264] text-black hover:bg-[#d9f99d] hover:shadow-lg hover:shadow-[#bef264]/20 transition-all duration-200 block text-center"
              >
                Go to Dashboard
              </Link>
              <Link
                href={
                  normalizeRole(userRole) === "recruiter"
                    ? "/dashboard/recruiter/jobs/new"
                    : "/browse-jobs"
                }
                className="w-full py-3.5 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 block text-center"
              >
                {normalizeRole(userRole) === "recruiter"
                  ? "Post a Job"
                  : "Browse Jobs"}
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-600 font-medium tracking-wide flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          SECURELY PROCESSED VIA STRIPE
        </p>
      </div>
    );
  }

  return null;
}
