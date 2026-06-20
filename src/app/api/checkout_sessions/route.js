import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import {
  isPlanAllowedForRole,
  planFromStripePriceId,
  STRIPE_PRICE_IDS,
} from "@/lib/plan";
import { upgradeUserPlan } from "@/lib/plan-upgrade";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const planId = formData.get("id");
    const formEmail = formData.get("email");

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.redirect(`${origin}/auth/signin`, 303);
    }

    const userEmail = session.user.email || formEmail;
    const userRole = session.user.role;
    const authUserId = session.user.id;

    if (!isPlanAllowedForRole(planId, userRole)) {
      return NextResponse.redirect(`${origin}/pricing?error=invalid_plan`, 303);
    }

    const stripePriceId = STRIPE_PRICE_IDS[planId];

    if (!stripePriceId) {
      const dashboardPath =
        userRole === "recruiter"
          ? "/dashboard/recruiter"
          : "/dashboard/job-seeker";
      return NextResponse.redirect(`${origin}${dashboardPath}`, 303);
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ["card"],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        planId,
        userEmail,
        userRole,
        authUserId,
      },
      subscription_data: {
        metadata: {
          planId,
          userEmail,
          userRole,
          authUserId,
        },
      },
    });

    return NextResponse.redirect(checkoutSession.url, 303);
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
