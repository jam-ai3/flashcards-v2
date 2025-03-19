"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";
import { createCheckoutSession } from "../_actions/stripe";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/constants";

type ProductCardProps = {
  product: Product;
  userId: string;
  isSubscribed: boolean;
};

export default function ProductCard({
  product,
  userId,
  isSubscribed,
}: ProductCardProps) {
  async function handlePurchase() {
    const url = await createCheckoutSession(product, userId);
    if (!url) return;
    redirect(url);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatPrice(product.priceInPennies)}</CardTitle>
        <CardDescription>{product.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
      </CardContent>
      <CardFooter>
        <Button disabled={isSubscribed} onClick={handlePurchase}>
          <span>Purchase</span>
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
