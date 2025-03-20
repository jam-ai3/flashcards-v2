import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Error = {
  error: string;
  devError?: string;
};

export function isError<T>(response: T | Error): response is Error {
  return (
    typeof response === "object" && response !== null && "error" in response
  );
}

export function exportCsv(string: string) {
  const blob = new Blob([string], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.csv";
  a.click();
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatPrice(priceInPennies: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(priceInPennies / 100);
}

export function formatNumber(num: number) {
  const formatter = new Intl.NumberFormat("en-US");
  return formatter.format(num);
}
