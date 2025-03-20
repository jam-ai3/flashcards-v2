"use server";

import db from "@/db/db";
import { TABLE_ROWS_PER_PAGE } from "@/lib/constants";

export type Ordering =
  | "createdAsc"
  | "createdDesc"
  | "purchasesAsc"
  | "purchasesDesc";

export type Customer = {
  id: string;
  email: string;
  createdAt: Date;
  subscriptions: {
    type: string;
  }[];
  sales: {
    pricePaidInPennies: number;
  }[];
};

export async function getCustomers(ordering: Ordering, page: number = 1) {
  const orderFunction = getOrdering(ordering);
  return await db.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      subscriptions: {
        select: {
          type: true,
        },
      },
      sales: {
        select: {
          pricePaidInPennies: true,
        },
      },
    },
    take: TABLE_ROWS_PER_PAGE,
    skip: (page - 1) * TABLE_ROWS_PER_PAGE,
    orderBy: orderFunction as any,
  });
}

function getOrdering(ordering: Ordering) {
  switch (ordering) {
    case "createdAsc":
      return { createdAt: "asc" };
    case "createdDesc":
      return { createdAt: "desc" };
    case "purchasesAsc":
      return { sales: { _count: "asc" } };
    case "purchasesDesc":
      return { sales: { _count: "desc" } };
  }
}

export async function getTotalCustomers() {
  return await db.user.count();
}
