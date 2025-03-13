import express, { Router } from "express";
import Stripe from "stripe";
import { errorBoundary, getSession } from "../utils/middleware";
import { DURATIONS, PRODUCTS } from "../utils/constants";
import {
  FRONTEND_URL,
  STRIPE_API_KEY,
  WEBHOOK_SECRET,
} from "../utils/constants";
import { turso } from "../database";

const router = Router();
const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: "2025-02-24.acacia",
});

router.get("/:productId", async (req, res) => {
  errorBoundary(req, res, async (req, res) => {
    const { productId } = req.params;
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = session.userId;
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: product.id, quantity: 1 }],
      success_url: FRONTEND_URL,
      cancel_url: `${FRONTEND_URL}/product`,
      metadata: { userId, productId },
    });
    return res.json(stripeSession.url);
  });
});

// Use raw body for webhook route
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res: any) => {
    errorBoundary(req, res, async (req, res) => {
      const signature = req.headers["stripe-signature"];
      if (!signature) {
        return res.status(400).json({ message: "Missing signature" });
      }
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        WEBHOOK_SECRET
      );
      await handleEvent(event);
      return res.status(200).json({ received: true });
    });
  }
);

async function handleEvent(event: Stripe.Event) {
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

export default router;
