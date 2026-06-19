const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getCompaniesAction(recruiterId = null) {
  try {
    const url = recruiterId
      ? `${API_URL}/api/company?recruiterId=${recruiterId}&t=${Date.now()}`
      : `${API_URL}/api/company?t=${Date.now()}`;

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
