"use server";

import db from "@/db/db";
import { TABLE_ROWS_PER_PAGE } from "@/lib/constants";

export type Sale = {
  id: string;
  productId: string;
  userId: string;
  pricePaidInPennies: number;
  createdAt: Date;
};

export async function getSalesData(productId: string, page: number = 1) {
  return await db.sale.findMany({
    select: {
      id: true,
      productId: true,
      userId: true,
      pricePaidInPennies: true,
      createdAt: true,
    },
    where: {
      productId: productId === "" ? undefined : productId,
    },
    take: TABLE_ROWS_PER_PAGE,
    skip: (page - 1) * TABLE_ROWS_PER_PAGE,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTotalSales(productId: string) {
  return await db.sale.count({
    where: {
      productId: productId === "" ? undefined : productId,
    },
  });
}
