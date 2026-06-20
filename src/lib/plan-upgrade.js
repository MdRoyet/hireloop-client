import "server-only";

const EXPRESS_BACKEND_URL =
  process.env.EXPRESS_BACKEND_URL || "http://localhost:5000";

export async function upgradeUserPlan({
  email,
  plan,
  role,
  authUserId,
  stripeCustomerId,
  stripeSubscriptionId,
}) {
  const response = await fetch(`${EXPRESS_BACKEND_URL}/api/user/upgrade-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      plan,
      role,
      authUserId,
      stripeCustomerId,
      stripeSubscriptionId,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Failed to upgrade user plan.");
  }

  return result;
}

export async function syncUserProfile({
  email,
  name,
  role,
  authUserId,
  createdAt,
}) {
  const response = await fetch(`${EXPRESS_BACKEND_URL}/api/user/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      name,
      role,
      authUserId,
      createdAt,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Failed to sync user profile.");
  }

  return result;
}
