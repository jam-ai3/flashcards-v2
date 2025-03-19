import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import useSession from "@/hooks/useSession";
import { formatNumber } from "@/lib/utils";
import { redirect } from "next/navigation";
import ProductCard from "./_components/product-card";
import { PRODUCTS_ARRAY } from "@/lib/constants";

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
        <div className="bg-secondary rounded-md shadow p-4 h-full">
          <div className="grid grid-cols-2 gap-2">
            <InformationCard title="Account" description="">
              <p>Email - {user.email}</p>
            </InformationCard>
            <InformationCard title="Single Generates" description="">
              <p>{formatNumber(user.freeGenerates)} free</p>
              <p>{formatNumber(user.paidGenerates)} paid</p>
            </InformationCard>
            <InformationCard title="Subscription" description="">
              <p>Subscription Plan - {subscription?.type ?? "None"}</p>
              <p>
                Expires -{" "}
                {subscription?.expiresAt.toLocaleDateString() ?? "N/A"}
              </p>
              <p>Generates Used - {subscription?.generatesUsed ?? "N/A"}</p>
            </InformationCard>
          </div>
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

type InformationCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function InformationCard({
  title,
  description,
  children,
}: InformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
