import "server-only";

import Stripe from "stripe";
import { STRIPE_PRICE_IDS } from "./plan";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PLAN_PRICE_ID = STRIPE_PRICE_IDS;
