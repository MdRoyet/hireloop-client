import { normalizeRole } from "./roles";

export const DEFAULT_PLANS = {
  seeker: "seeker_free",
  recruiter: "recruiter_free",
};

export const STRIPE_PRICE_IDS = {
  seeker_pro: "price_1TkT8LC7LOPgRS5KEc24zF4S",
  seeker_premium: "price_1TkTnuC7LOPgRS5KC4YOK2Ex",
  recruiter_growth: "price_1TkTorC7LOPgRS5KdZhPGHw7",
  recruiter_enterprise: "price_1TkToWC7LOPgRS5K1grg2anQ",
};

export const PRICE_ID_TO_PLAN = Object.fromEntries(
  Object.entries(STRIPE_PRICE_IDS).map(([planId, priceId]) => [
    priceId,
    planId,
  ]),
);

export const PLAN_LIMITS = {
  seeker_free: 3,
  seeker_pro: 30,
  seeker_premium: "unlimited",
  recruiter_free: 3,
  recruiter_growth: 10,
  recruiter_enterprise: "unlimited",
};

export const PAID_PLANS = Object.keys(STRIPE_PRICE_IDS);

export function defaultPlanForRole(role) {
  return normalizeRole(role) === "recruiter"
    ? DEFAULT_PLANS.recruiter
    : DEFAULT_PLANS.seeker;
}

export function planCategory(planId) {
  if (!planId) return null;
  if (planId.startsWith("seeker_")) return "seeker";
  if (planId.startsWith("recruiter_")) return "recruiter";
  return null;
}

export function isPlanAllowedForRole(planId, role) {
  const normalizedRole = normalizeRole(role);
  const category = planCategory(planId);

  if (normalizedRole === "admin") return true;
  if (!category) return planId.endsWith("_free");
  if (category === "seeker") return normalizedRole === "seeker";
  if (category === "recruiter") return normalizedRole === "recruiter";
  return false;
}

export function planFromStripePriceId(priceId) {
  return PRICE_ID_TO_PLAN[priceId] || null;
}

export function formatPlanLabel(planId) {
  if (!planId) return "Free";
  return planId.replace(/^(seeker|recruiter)_/, "").replace(/_/g, " ");
}
