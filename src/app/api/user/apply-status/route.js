import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userEmail = req.headers.get("user-email");
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const EXPRESS_BACKEND_URL =
      process.env.EXPRESS_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(
      `${EXPRESS_BACKEND_URL}/api/user/apply-status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": userEmail,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.error ||
            "Express backend data pipeline execution failure",
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("💥 Next.js Proxy Network Fault Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
