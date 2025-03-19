import db from "@/db/db";

type LogPageProps = {
  params: {
    id: string;
  };
};

// TODO: give more descriptive errors in _actions

export default async function LogPage({ params }: LogPageProps) {
  const { id } = await params;
  const group = await db.flashcardGroup.findUnique({ where: { id } });

  return (
    <div className="flex flex-col gap-2">
      <p>{group?.prompt}</p>
      <p>{group?.error}</p>
    </div>
  );
}
