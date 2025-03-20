import db from "@/db/db";
import useSession from "@/hooks/useSession";
import { formatNumber } from "@/lib/utils";
import { redirect } from "next/navigation";
import ProductCard from "./_components/product-card";
import { PRODUCTS_ARRAY, UNAUTH_REDIRECT_PATH } from "@/lib/constants";
import InfoLine from "@/components/info-line";
import { Label } from "@/components/ui/label";
import LogoutBtn from "./_components/logout-btn";

export default async function PlanPage() {
  const session = await useSession();
  if (!session) redirect(UNAUTH_REDIRECT_PATH);
  const user = await db.user.findUnique({ where: { id: session.id } });
  if (!user) redirect(UNAUTH_REDIRECT_PATH);
  const subscription = await db.subscription.findUnique({
    where: { userId: session.id },
  });
  const isSubscribed = (subscription?.expiresAt ?? 0) > new Date();

  return (
    <div className="flex h-full gap-4">
      <section className="flex-1/2 h-full flex flex-col gap-4">
        <h2 className="font-semibold text-xl">Your Plan</h2>
        <div className="h-full space-y-6">
          <InfoLine label="Email" value={user.email} />
          <InfoLine
            label="Paid Generates"
            value={formatNumber(user.paidGenerates)}
          />
          <InfoLine
            label="Free Generates"
            value={formatNumber(user.freeGenerates)}
          />
          <InfoLine
            label="Subscription Plan"
            value={subscription?.type ?? "None"}
          />
          <InfoLine
            label="Expires"
            value={subscription?.expiresAt.toLocaleDateString() ?? "N/A"}
          />
          <InfoLine
            label="Generates Used"
            value={subscription?.generatesUsed ?? "N/A"}
          />
          <LogoutBtn />
        </div>
      </section>
      <section className="flex-1/2 h-full flex flex-col gap-4">
        <h2 className="font-semibold text-xl">Available Options</h2>
        <div className="grid grid-rows-3 gap-2">
          {PRODUCTS_ARRAY.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              userId={session.id}
              isSubscribed={isSubscribed}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
