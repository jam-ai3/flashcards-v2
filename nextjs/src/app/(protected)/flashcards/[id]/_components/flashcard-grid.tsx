"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exportCsv } from "@/lib/utils";
import { Flashcard, FlashcardGroup } from "@prisma/client";
import { Circle, CircleCheck } from "lucide-react";
import { useState } from "react";

type FlashcardGridProps = {
  group: FlashcardGroup;
  flashcards: Flashcard[];
};

export default function FlashcardGrid({
  group,
  flashcards,
}: FlashcardGridProps) {
  const [selected, setSelected] = useState<Flashcard[]>([]);

  function toggleSelectAll() {
    if (selected.length === flashcards.length) {
      setSelected([]);
    } else {
      setSelected(flashcards);
    }
  }

  function toggleSelect(flashcard: Flashcard) {
    if (selected.includes(flashcard)) {
      setSelected(selected.filter((f) => f !== flashcard));
    } else {
      setSelected([...selected, flashcard]);
    }
  }

  function handleExport() {
    const csv = selected.map((f) => `${f.front},${f.back}`).join("\n");
    exportCsv(csv);
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {formatPaymentString(group.paymentType)}
        </p>
        <div className="flex gap-2">
          <Button onClick={toggleSelectAll} variant="secondary">
            <span>
              {selected.length} / {flashcards.length}
            </span>
            <span>
              {selected.length === flashcards.length
                ? "Deselect All"
                : "Select All"}
            </span>
          </Button>
          <Button onClick={handleExport}>Export CSV</Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {flashcards.map((flashcard) => (
          <FlashcardView
            key={flashcard.id}
            flashcard={flashcard}
            isSelected={selected.includes(flashcard)}
            handleSelect={toggleSelect}
          />
        ))}
      </div>
    </>
  );
}

type FlashcardViewProps = {
  flashcard: Flashcard;
  isSelected: boolean;
  handleSelect: (flashcard: Flashcard) => void;
};

const CIRCLE_SIZE = 16;

function FlashcardView({
  flashcard,
  isSelected,
  handleSelect,
}: FlashcardViewProps) {
  return (
    <Card
      onClick={handleSelect.bind(null, flashcard)}
      className="cursor-pointer relative"
    >
      <CardContent>
        <div className="absolute top-2 right-2 accent-accent">
          {isSelected ? (
            <CircleCheck size={CIRCLE_SIZE} />
          ) : (
            <Circle size={CIRCLE_SIZE} className="text-muted-foreground" />
          )}
        </div>
        <p>{flashcard.front}</p>
        <p>{flashcard.back}</p>
      </CardContent>
    </Card>
  );
}

function formatPaymentString(paymentType: string | null) {
  switch (paymentType) {
    case "free":
      return "Flashcards generated with free trial";
    case "paid":
      return "Flashcards generated with single payment";
    case "subscription":
      return "Flashcards generated with subscription";
    case null:
      return "An error occured while generating flashcards, you have not been charged";
    default:
      return "Flashcards generated with unknown payment type";
  }
}
