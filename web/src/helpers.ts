import { RawFlashcard } from "./types";

export function exportToCSV(flashcards: RawFlashcard[]) {
  const csv = flashcards.map((c) => `${c.front},${c.back}`).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "flashcards.csv";
  link.click();
  window.URL.revokeObjectURL(url);
}

export function formatPrice(priceInPennies: number) {
  const dollars = Math.floor(priceInPennies / 100);
  const cents = priceInPennies % 100;
  return `$${dollars}.${cents.toString().padStart(2, "0")}`;
}
