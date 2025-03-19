export const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;
export const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;

export type Product = {
  id: string;
  name: string;
  description: string;
  priceInPennies: number;
  isSubscription: boolean;
  subscriptionInterval: "day" | "week" | "month" | "year";
};

export const PRODUCTS: Record<string, Product> = {
  single: {
    id: "0",
    name: "Single Generate",
    description: "A one-time purchase of a single use of flashcards generator",
    priceInPennies: 99,
    isSubscription: false,
    subscriptionInterval: "year",
  },
  monthly: {
    id: "1",
    name: "Monthly Subscription",
    description: "Unlimited use of flashcards generator for a one-month period",
    priceInPennies: 799,
    isSubscription: true,
    subscriptionInterval: "month",
  },
  yearly: {
    id: "2",
    name: "Yearly Subscription",
    description: "Unlimited use of flashcards generator for a one-year period",
    priceInPennies: 7999,
    isSubscription: true,
    subscriptionInterval: "year",
  },
};

export const PRODUCTS_ARRAY: Product[] = Object.values(PRODUCTS);
