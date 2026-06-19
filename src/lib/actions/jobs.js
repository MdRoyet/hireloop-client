const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Sends the raw job form data directly to the Express backend to save in MongoDB
 * @param {Object} jobData - Synced data object from the client UI form
 */
export async function createJobAction(jobData) {
  try {
    const response = await fetch(`${API_URL}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          result.error || "An error occurred while saving to the database.",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("❌ Network Error inside createJobAction:", error);
    return {
      success: false,
      error: "Could not connect to the backend server.",
    };
  }
}

/**
 * 🚀 GET ACTION: Fetches all listed jobs from the Express API
 */
export async function getJobsAction() {
  try {
    const response = await fetch(`${API_URL}/api/jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensures fresh data pulling on every dashboard reload
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to parse job information from server.",
      };
    }

    return {
      success: true,
      data: result.data, // Contains raw MongoDB array
    };
  } catch (error) {
    console.error("❌ Network Error inside getJobsAction:", error);
    return {
      success: false,
      error: "Could not fetch data. Check if backend server is online.",
    };
  }
}
