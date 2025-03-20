import db from "@/db/db";
import useSession from "@/hooks/useSession";
import { formatNumber } from "@/lib/utils";
import { redirect } from "next/navigation";
import ProductCard from "./_components/product-card";
import { PRODUCTS_ARRAY } from "@/lib/constants";
import InfoLine from "@/components/info-line";

export default async function PlanPage() {
  const session = await useSession();
  if (!session) redirect("/auth/login");
  const user = await db.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/auth/login");
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
