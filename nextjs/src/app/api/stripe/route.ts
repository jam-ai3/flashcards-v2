import db from "@/db/db";
import { MONTH_IN_MS, PRODUCTS, YEAR_IN_MS } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function POST(req: NextRequest) {
  const events = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (events.type === "checkout.session.completed") {
    const charge = events.data.object as Stripe.Checkout.Session;
    const { userId, productId } = charge.metadata ?? {};
    if (!userId || !productId) {
      console.error("Missing metadata");
      return new NextResponse(null, { status: 400 });
    }

    switch (productId) {
      case PRODUCTS.single.id:
        await handleSinglePayment(userId);
        break;
      case PRODUCTS.monthly.id:
        await handleMonthlyPayment(userId);
        break;
      case PRODUCTS.yearly.id:
        await handleYearlyPayment(userId);
        break;
    }
  } else {
    console.error(`Unhandled event type: ${events.type}`);
    return new NextResponse(null, { status: 400 });
  }

  return new NextResponse(null, { status: 200 });
}

async function handleSinglePayment(userId: string) {
  await Promise.all([
    db.sale.create({
      data: {
        userId,
        productId: PRODUCTS.single.id,
        pricePaidInPennies: PRODUCTS.single.priceInPennies,
      },
    }),
    db.user.update({
      where: { id: userId },
      data: { paidGenerates: { increment: 1 } },
    }),
  ]);
}

async function handleMonthlyPayment(userId: string) {
  await Promise.all([
    db.sale.create({
      data: {
        userId,
        productId: PRODUCTS.monthly.id,
        pricePaidInPennies: PRODUCTS.monthly.priceInPennies,
      },
    }),
    db.subscription.upsert({
      where: { userId },
      update: {
        type: "Monthly",
        expiresAt: new Date(Date.now() + MONTH_IN_MS),
      },
      create: {
        userId,
        type: "Monthly",
        expiresAt: new Date(Date.now() + MONTH_IN_MS),
      },
    }),
  ]);
}

async function handleYearlyPayment(userId: string) {
  await Promise.all([
    db.sale.create({
      data: {
        userId,
        productId: PRODUCTS.yearly.id,
        pricePaidInPennies: PRODUCTS.yearly.priceInPennies,
      },
    }),
    db.subscription.upsert({
      where: { userId },
      update: {
        type: "Yearly",
        expiresAt: new Date(Date.now() + YEAR_IN_MS),
      },
      create: {
        userId,
        type: "Yearly",
        expiresAt: new Date(Date.now() + YEAR_IN_MS),
      },
    }),
  ]);
}
