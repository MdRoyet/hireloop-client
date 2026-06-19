const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function applyForJobAction(applicationData) {
  try {
    const response = await fetch(`${API_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    });

    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error };

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Server connection failed." };
  }
}
