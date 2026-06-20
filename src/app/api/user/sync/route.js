import { NextResponse } from "next/server";
import { syncUserProfile } from "@/lib/plan-upgrade";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await syncUserProfile(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
