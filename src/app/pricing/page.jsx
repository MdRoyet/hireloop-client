"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { isRecruiterRole, isSeekerRole, normalizeRole } from "@/lib/roles";
import { isPlanAllowedForRole } from "@/lib/plan";

// --- Data ---
const plansData = {
  seekers: [
    {
      name: "Free",
      id: "seeker_free",
      description: "Everything you need to start exploring opportunities.",
      monthly: 0,
      yearly: 0,
      period: "forever",
      cta: "Get started",
      popular: false,
      features: [
        "Browse & save up to 10 jobs",
        "Basic profile creation",
        "Community forum access",
        "Weekly curated email alerts",
        "Standard application tracking",
      ],
    },
    {
      name: "Pro",
      id: "seeker_pro",
      description: "For active job seekers who want to move faster.",
      monthly: 19,
      yearly: 15,
      period: "month",
      cta: "Start 14-day trial",
      popular: true,
      features: [
        "Everything in Free, plus:",
        "Apply to up to 30 jobs / month",
        "Advanced profile insights & analytics",
        "Priority review by recruiters",
        "AI resume optimization tool",
        "Cover letter generator",
        "Salary benchmarking data",
      ],
    },
    {
      name: "Premium",
      id: "seeker_premium",
      description: "Full toolkit for serious career advancement.",
      monthly: 39,
      yearly: 31,
      period: "month",
      cta: "Start 14-day trial",
      popular: false,
      features: [
        "Everything in Pro, plus:",
        "Unlimited job applications",
        "1-on-1 monthly career coaching",
        "AI mock interview practice",
        "Early access to new listings",
        "Verified Premium profile badge",
        "Direct messaging with recruiters",
      ],
    },
  ],
  recruiters: [
    {
      name: "Free",
      id: "recruiter_free",
      description: "Test the waters with basic hiring tools.",
      monthly: 0,
      yearly: 0,
      period: "forever",
      cta: "Get started",
      popular: false,
      features: [
        "Up to 3 active job posts",
        "Basic applicant tracking",
        "Standard candidate search",
        "Email support",
        "Company profile page",
      ],
    },
    {
      name: "Growth",
      id: "recruiter_growth",
      description: "For growing teams scaling their hiring pipeline.",
      monthly: 49,
      yearly: 39,
      period: "month",
      cta: "Start 14-day trial",
      popular: true,
      features: [
        "Everything in Free, plus:",
        "Up to 10 active job posts",
        "Advanced ATS with automations",
        "Team collaboration (3 seats)",
        "Candidate insights & scoring",
        "Priority customer support",
        "Custom hiring workflows",
      ],
    },
    {
      name: "Enterprise",
      id: "recruiter_enterprise",
      description: "Powerful tools for high-volume hiring teams.",
      monthly: 149,
      yearly: 119,
      period: "month",
      cta: "Contact sales",
      popular: false,
      features: [
        "Everything in Growth, plus:",
        "Up to 50 active job posts",
        "Custom ATS integrations & API",
        "Unlimited team seats",
        "AI-powered candidate matching",
        "Dedicated account manager",
        "SAML SSO & advanced security",
      ],
    },
  ],
};

const faqs = [
  {
    q: "Can I switch between Job Seeker and Recruiter plans?",
    a: "Absolutely. You can switch between seeker and recruiter plans at any time from your account settings. Your data, saved jobs, and posted positions remain intact during the transition.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes — both Pro and Premium for job seekers, and Growth for recruiters, come with a 14-day free trial. No credit card required to start. You'll only be charged once the trial ends.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. Enterprise customers can also pay via invoice with annual billing.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. Cancel anytime with one click in your dashboard. You'll keep access to paid features until the end of your billing period, and we don't charge cancellation fees.",
  },
  {
    q: "Do you offer discounts for students or non-profits?",
    a: "We offer 50% off all Pro and Premium plans for verified students, and special pricing for registered non-profits. Reach out to our support team with your credentials.",
  },
];

// Icons
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function PricingPlan() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  // 🚀 Initialize Auth and Router hooks
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role;
  const isRecruiter = isRecruiterRole(userRole);
  const isSeeker = !userRole || isSeekerRole(userRole) || normalizeRole(userRole) === "admin";

  return (
    <div className="min-h-screen bg-[#08080a] text-white relative overflow-hidden font-sans antialiased">
      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 bg-grid opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#bef264] opacity-20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-[#84cc16] opacity-10 blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-[#bef264]/10 border border-[#bef264]/20 text-[#bef264] rounded-full text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] animate-pulse" />
            PRICING UPDATED FOR 2025
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Pricing that grows
            <br />
            with your ambition
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Whether you're hunting for your dream role or scaling your team —
            pick a plan that fits today, upgrade when you're ready.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4">
            <span
              className={`text-sm font-medium transition-colors ${
                !isYearly ? "text-white" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${
                isYearly ? "bg-[#bef264]" : "bg-white/10"
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-lg"
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                isYearly ? "text-white" : "text-gray-500"
              }`}
            >
              Yearly
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#bef264]/20 text-[#bef264] font-semibold">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Job Seekers Section */}
        {(isSeeker || !session?.user) && (
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-400 tracking-wide">
              For Job Seekers
            </h2>
            {session?.user && isRecruiter && (
              <p className="text-sm text-gray-500 mt-2">
                Sign in with a job seeker account to purchase these plans.
              </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`seekers-${isYearly}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid md:grid-cols-3 gap-6"
            >
              {plansData.seekers.map((plan) => (
                <motion.div key={plan.name} variants={cardVariants}>
                  <PricingCard
                    plan={plan}
                    isYearly={isYearly}
                    session={session}
                    router={router}
                    disabled={session?.user && isRecruiter}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>
        )}

        {/* Recruiters Section */}
        {(isRecruiter || !session?.user) && (
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-400 tracking-wide">
              For Recruiters
            </h2>
            {session?.user && isSeeker && normalizeRole(userRole) !== "admin" && (
              <p className="text-sm text-gray-500 mt-2">
                Sign in with a recruiter account to purchase these plans.
              </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`recruiters-${isYearly}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid md:grid-cols-3 gap-6"
            >
              {plansData.recruiters.map((plan) => (
                <motion.div key={plan.name} variants={cardVariants}>
                  <PricingCard
                    plan={plan}
                    isYearly={isYearly}
                    session={session}
                    router={router}
                    disabled={session?.user && isSeeker && normalizeRole(userRole) !== "admin"}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>
        )}

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Questions? We've got answers.
            </h2>
            <p className="text-gray-400">
              Can't find what you're looking for? Our team is here to help.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-colors ${
                  activeFaq === i
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-transparent border-white/5"
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activeFaq === i
                        ? "bg-[#bef264] text-black"
                        : "bg-white/5 text-white"
                    }`}
                  >
                    <PlusIcon />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Pricing Card Component ---
function PricingCard({ plan, isYearly, session, router, disabled = false }) {
  const price = isYearly ? plan.yearly : plan.monthly;

  const userEmail =
    session?.user?.email || session?.email || session?.user?.emailAddress || "";

  const handleCheckoutClick = (e) => {
    if (!session || (!session.user && !session.email)) {
      e.preventDefault();
      router.push("/auth/signin");
      return;
    }

    if (disabled) {
      e.preventDefault();
      return;
    }

    if (!isPlanAllowedForRole(plan.id, session.user.role)) {
      e.preventDefault();
      router.push("/pricing?error=invalid_plan");
    }
  };

  return (
    <div
      className={`relative h-full p-8 rounded-3xl flex flex-col transition-all duration-300 
      ${
        plan.popular
          ? "bg-gradient-to-b from-[#bef264]/10 to-transparent border border-[#bef264]/30 shadow-[0_20px_60px_-20px_rgba(190,242,100,0.3)]"
          : "bg-white/[0.02] border border-white/10 hover:border-white/20"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#bef264] text-black text-xs font-bold px-4 py-1 rounded-full tracking-wide">
          MOST POPULAR
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        <p className="text-sm text-gray-400 min-h-[40px]">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-gray-400 text-2xl font-medium">$</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={price}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-5xl font-bold tracking-tighter"
            >
              {price}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm text-gray-500 font-medium ml-1">
            {plan.period === "forever" ? "forever" : "/mo"}
          </span>
        </div>
        {isYearly && plan.monthly > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Billed annually at ${plan.yearly * 12}/yr
          </p>
        )}
        {plan.period !== "forever" && !isYearly && (
          <p className="text-xs text-gray-500 mt-2">Billed monthly</p>
        )}
        {plan.period === "forever" && (
          <p className="text-xs text-gray-500 mt-2">No credit card required</p>
        )}
      </div>

      {/* 🚀 Stripe Checkout Form Integration */}
      <form
        action="/api/checkout_sessions"
        method="POST"
        className="w-full mb-8"
        onSubmit={handleCheckoutClick}
      >
        <input type="hidden" name="id" value={plan.id} />

        {/* 🚀 FIXED: Now using the safe email catcher */}
        <input type="hidden" name="email" value={userEmail} />

        <button
          type="submit"
          role="link"
          disabled={disabled}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 
          ${
            disabled
              ? "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
              : plan.popular
              ? "bg-[#bef264] text-black hover:bg-[#d9f99d] hover:shadow-lg hover:shadow-[#bef264]/20"
              : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          {disabled ? "Wrong account type" : plan.cta}
        </button>
      </form>

      <div className="border-t border-white/5 pt-6 mt-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          What's included
        </p>
        <ul className="space-y-3">
          {plan.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-gray-300"
            >
              <span
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center 
                ${
                  plan.popular
                    ? "bg-[#bef264]/20 text-[#bef264]"
                    : "bg-white/5 text-gray-400"
                }`}
              >
                <CheckIcon />
              </span>
              <span
                className={
                  i === 0 && feature.includes("Everything in")
                    ? "font-semibold text-white"
                    : ""
                }
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
