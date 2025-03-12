import { Router } from "express";
import Stripe from "stripe";
import { errorBoundary } from "../utils/middleware";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_API_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Use raw body for webhook route
router.post("/", async (req, res: any) => {
  errorBoundary(req, res, async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ message: "Missing signature" });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Checkout session completed:", session);
        break;
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        console.log("Subscription deleted:", subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  });
});

export default router;
