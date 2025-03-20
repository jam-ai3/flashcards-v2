import db from "@/db/db";
import InfoLine from "@/components/info-line";
import { notFound } from "next/navigation";
import CopyButton from "@/components/copy-btn";

type LogPageProps = {
  params: {
    id: string;
  };
};

export default async function LogPage({ params }: LogPageProps) {
  const { id } = await params;
  const group = await db.flashcardGroup.findUnique({ where: { id } });

  if (!group) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-2 p-4">
      <section className="p-4 space-y-4">
        <p className="text-xl font-semibold">Log Info</p>
        <div className="space-y-4">
          <InfoLine label="Group ID" value={group.id} />
          <InfoLine label="User ID" value={group.userId} />
          <InfoLine
            label="Timestamp"
            value={group.createdAt.toLocaleString()}
          />
          <InfoLine label="Payment Type" value={group.paymentType} />
          <InfoLine label="Input Type" value={group.inputType} />
          <InfoLine label="Input Format" value={group.inputFormat} />
          <InfoLine label="Error Message" value={group.error ?? "None"} />
        </div>
      </section>
      <section className="bg-secondary rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">Prompt</p>
          <CopyButton text={group.prompt} className="bg-inherit" />
        </div>
        <p className="text-sm">{group?.prompt}</p>
      </section>
      <p>{group?.error}</p>
    </div>
  );
}
