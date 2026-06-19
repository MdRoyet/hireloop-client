const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function createJobAction(jobData) {
  try {
    const response = await fetch(`${API_URL}/api/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });
    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error };
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Server connection failed." };
  }
}

export async function getJobsAction(recruiterId = null) {
  try {
    const url = recruiterId
      ? `${API_URL}/api/jobs?recruiterId=${recruiterId}&t=${Date.now()}`
      : `${API_URL}/api/jobs?t=${Date.now()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error };
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: "Server sync failed." };
  }
}

export async function getRecruiterDashboardStats(recruiterId = null) {
  try {
    const url = recruiterId
      ? `${API_URL}/api/dashboard/recruiter-stats?recruiterId=${recruiterId}&t=${Date.now()}`
      : `${API_URL}/api/dashboard/recruiter-stats?t=${Date.now()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error };
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Stats processing network crash:", error);
    return {
      success: false,
      error: "Could not fetch active summary calculations.",
    };
  }
}

export async function getGlobalJobsAction(filters = {}) {
  try {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.type) queryParams.append("type", filters.type);
    if (filters.isRemote) queryParams.append("isRemote", "true");

    queryParams.append("t", Date.now());

    const url = `${API_URL}/api/jobs?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error };
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: "Server sync failed." };
  }
}

export async function getJobByIdAction(jobId) {
  try {
    const response = await fetch(
      `${API_URL}/api/jobs/${jobId}?t=${Date.now()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error };
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: "Server sync failed." };
  }
}
