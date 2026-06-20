import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userEmail = req.headers.get("user-email");
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const EXPRESS_BACKEND_URL =
      process.env.EXPRESS_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${EXPRESS_BACKEND_URL}/api/user/plan-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "user-email": userEmail,
        "user-role": req.headers.get("user-role") || "job_seeker",
        "user-id": req.headers.get("user-id") || "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch plan status." },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Plan status proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
