import Stripe from "stripe";
import {
  DURATIONS,
  FRONTEND_URL,
  STRIPE_API_KEY,
  WEBHOOK_SECRET,
} from "./constants";
import { Product } from "../types";
import { Request } from "express";
import { turso } from "../database";

if (!STRIPE_API_KEY || !WEBHOOK_SECRET) {
  throw new Error("STRIPE_API_KEY must be set");
}

const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export async function createCheckoutSession(product: Product, userId: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: product.isSubscription ? "subscription" : "payment",
    line_items: [{ price: product.id, quantity: 1 }],
    success_url: FRONTEND_URL,
    cancel_url: `${FRONTEND_URL}/product`,
    metadata: {
      userId,
      productId: product.id,
    },
  });
  return session;
}

export function createStripeEvent(req: Request, signature: string | string[]) {
  if (!WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET must be set");
  }
  return stripe.webhooks.constructEvent(req.body, signature, WEBHOOK_SECRET);
}

export async function handleEvent(event: Stripe.Event) {
  console.log(event);
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { userId, productId } = paymentIntent.metadata;
      await handlePayentSuccess(userId, productId);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handlePayentSuccess(userId: string, productId: string) {
  switch (productId) {
    case "price_1QzUQzEkbD2Tq5Z2KxgiIwdF": // single
      await turso.buyGenerate(userId);
      break;
    case "price_1QzURjEkbD2Tq5Z29eLJ8Zvv": // monthly
      await turso.subscribe(userId, DURATIONS.ONE_MONTH);
      break;
    case "price_1QzUSBEkbD2Tq5Z2t0J0BgTM": // yearly
      await turso.subscribe(userId, DURATIONS.ONE_YEAR);
      break;
  }
}
