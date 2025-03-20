import db from "@/db/db";
import useSession from "@/hooks/useSession";
import { UNAUTH_REDIRECT_PATH } from "@/lib/constants";
import { CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GroupsPage() {
  const session = await useSession();
  if (!session) redirect(UNAUTH_REDIRECT_PATH);
  const groups = await db.flashcardGroup.findMany({
    where: { userId: session.id },
  });

  return (
    <ul className="flex flex-col gap-2">
      {groups.map((group, index) => (
        <Link key={group.id} href={`/flashcards/${group.id}`}>
          <li className="flex justify-between items-center rounded-md border bg-secondary py-2 px-4 text-primary">
            <div>
              <p className="font-semibold">Group #{index + 1}</p>
              <p className="text-muted-foreground">
                {group.createdAt.toLocaleString()}
              </p>
            </div>
            {group.error === null ? (
              <CircleCheck />
            ) : (
              <CircleX className="text-destructive" />
            )}
          </li>
        </Link>
      ))}
    </ul>
  );
}
