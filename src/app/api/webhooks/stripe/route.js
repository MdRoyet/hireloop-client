import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { planFromStripePriceId } from "@/lib/plan";
import { upgradeUserPlan } from "@/lib/plan-upgrade";

export const runtime = "nodejs";

async function resolvePlanFromCheckoutSession(session) {
  if (session.metadata?.planId) {
    return session.metadata.planId;
  }

  const priceId = session.line_items?.data?.[0]?.price?.id;
  return planFromStripePriceId(priceId);
}

async function applyCheckoutUpgrade(session) {
  const planId = await resolvePlanFromCheckoutSession(session);
  const email =
    session.metadata?.userEmail ||
    session.customer_details?.email ||
    session.customer_email;

  if (!planId || !email) {
    throw new Error("Missing plan or customer email on checkout session.");
  }

  return upgradeUserPlan({
    email,
    plan: planId,
    role: session.metadata?.userRole,
    authUserId: session.metadata?.authUserId,
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : undefined,
    stripeSubscriptionId:
      typeof session.subscription === "string"
        ? session.subscription
        : undefined,
  });
}

export async function POST(req) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook secret is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature." }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.payment_status === "paid") {
          const expanded = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
          });
          await applyCheckoutUpgrade(expanded);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object;
        const planId =
          subscription.metadata?.planId ||
          planFromStripePriceId(subscription.items?.data?.[0]?.price?.id);
        const email = subscription.metadata?.userEmail;

        if (planId && email && subscription.status === "active") {
          await upgradeUserPlan({
            email,
            plan: planId,
            role: subscription.metadata?.userRole,
            authUserId: subscription.metadata?.authUserId,
            stripeCustomerId:
              typeof subscription.customer === "string"
                ? subscription.customer
                : undefined,
            stripeSubscriptionId: subscription.id,
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const email = subscription.metadata?.userEmail;
        const role = subscription.metadata?.userRole;
        const fallbackPlan =
          role === "recruiter" ? "recruiter_free" : "seeker_free";

        if (email) {
          await upgradeUserPlan({
            email,
            plan: fallbackPlan,
            role,
            authUserId: subscription.metadata?.authUserId,
            stripeCustomerId:
              typeof subscription.customer === "string"
                ? subscription.customer
                : undefined,
          });
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed." },
      { status: 400 },
    );
  }
}
