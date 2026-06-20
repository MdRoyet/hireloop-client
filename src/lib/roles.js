export function normalizeRole(role) {
  if (!role) return "seeker";
  const value = String(role).toLowerCase().replace(/-/g, "_");
  if (value === "recruiter") return "recruiter";
  if (value === "admin") return "admin";
  return "seeker";
}

export function isRecruiterRole(role) {
  return normalizeRole(role) === "recruiter";
}

export function isSeekerRole(role) {
  return normalizeRole(role) === "seeker";
}

export function dashboardPathForRole(role) {
  const normalized = normalizeRole(role);
  if (normalized === "recruiter") return "/dashboard/recruiter";
  if (normalized === "admin") return "/dashboard/admin";
  return "/dashboard/job-seeker";
}
