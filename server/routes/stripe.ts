import { Router, raw } from "express";
import { errorBoundary, getSession } from "../utils/middleware";
import { PRODUCTS } from "../utils/constants";
import {
  createCheckoutSession,
  createStripeEvent,
  handleEvent,
} from "../utils/stripe";

const router = Router();

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
    const stripeSession = await createCheckoutSession(product, userId);
    return res.json(stripeSession.url);
  });
});

// Use raw body for webhook route
router.post("/", raw({ type: "application/json" }), async (req, res: any) => {
  errorBoundary(req, res, async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ message: "Missing signature" });
    }
    const event = createStripeEvent(req, signature);
    await handleEvent(event);
    return res.status(200).json({ received: true });
  });
});

export default router;
