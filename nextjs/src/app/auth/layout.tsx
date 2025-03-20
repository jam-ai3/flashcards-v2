import db from "@/db/db";
import useSession from "@/hooks/useSession";
import { AUTH_REDIRECT_PATH } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await useSession();
  if (!session?.id) return children;
  const user = await db.user.findUnique({ where: { id: session?.id } });
  if (!user) return children;

  return redirect(AUTH_REDIRECT_PATH);
}
