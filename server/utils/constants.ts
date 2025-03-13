import { Product } from "../types";
import { config } from "dotenv";
config();

export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
export const PORT = process.env.PORT ?? 3000;
export const JWT_SECRET = process.env.JWT_SECRET ?? "flashcards-secret";
export const SESSION_KEY = process.env.SESSION_KEY ?? "flashcards-session-id";
export const FREE_GENERATE_LIMIT = 4;
export const STRIPE_API_KEY = process.env.STRIPE_API_KEY ?? "";
export const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

export const PRODUCTS: Product[] = [
  {
    id: "price_1QzUQzEkbD2Tq5Z2KxgiIwdF",
    name: "Single Generate",
    description: "A one-time purchase of a single use of flashcards generator",
    priceInPennies: 99,
  },
  {
    id: "price_1QzURjEkbD2Tq5Z29eLJ8Zvv",
    name: "Monthly Subscription",
    description: "Unlimited use of flashcards generator for a one-month period",
    priceInPennies: 799,
  },
  {
    id: "price_1QzUSBEkbD2Tq5Z2t0J0BgTM",
    name: "Yearly Subscription",
    description: "Unlimited use of flashcards generator for a one-year period",
    priceInPennies: 7999,
  },
];

export const DURATIONS = {
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  ONE_YEAR: 365 * 24 * 60 * 60 * 1000,
};
