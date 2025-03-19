import db from "@/db/db";
import FlashcardGrid from "./_components/flashcard-grid";
import { notFound } from "next/navigation";

type FlashcardsPageProps = {
  params: {
    id: string;
  };
};

export default async function FlashcardsPage({ params }: FlashcardsPageProps) {
  const { id } = await params;
  const [group, flashcards] = await Promise.all([
    db.flashcardGroup.findUnique({ where: { id } }),
    db.flashcard.findMany({ where: { groupId: id } }),
  ]);

  if (!group) {
    return notFound();
  }

  return <FlashcardGrid group={group} flashcards={flashcards} />;
}
