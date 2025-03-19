"use server";

import { Product } from "@/lib/constants";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function createCheckoutSession(product: Product, userId: string) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.priceInPennies,
          recurring: product.isSubscription
            ? { interval: product.subscriptionInterval }
            : undefined,
        },
        quantity: 1,
      },
    ],
    mode: product.isSubscription ? "subscription" : "payment",
    success_url: `${process.env.SERVER_URL!}/payment/success?productId=${
      product.id
    }`,
    cancel_url: `${process.env.SERVER_URL!}/payment/failure?productId=${
      product.id
    }`,
    payment_method_types: ["card"],
    metadata: {
      productId: product.id,
      userId,
    },
  });

  return session.url;
}
