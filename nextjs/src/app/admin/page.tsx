import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatNumber, formatPrice } from "@/lib/utils";

async function getSales() {
  const sales = await db.sale.aggregate({
    _count: true,
    _sum: {
      pricePaidInPennies: true,
    },
  });
  return {
    count: sales._count,
    total: sales._sum.pricePaidInPennies,
  };
}

async function getSubscriptions() {
  const [monthly, yearly] = await Promise.all([
    db.subscription.count({ where: { type: "Monthly" } }),
    db.subscription.count({ where: { type: "Yearly" } }),
  ]);
  return { monthly, yearly };
}

async function getUsers() {
  const [count, avgList] = await Promise.all([
    db.user.count(),
    db.sale.groupBy({
      by: ["userId"],
      _avg: {
        pricePaidInPennies: true,
      },
    }),
  ]);
  return {
    count,
    averagePaid:
      avgList.reduce((a, b) => a + (b._avg.pricePaidInPennies ?? 0), 0) / count,
  };
}

export default async function AdminPage() {
  const [sales, subs, users] = await Promise.all([
    getSales(),
    getSubscriptions(),
    getUsers(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <DashboardComponent title="Sales" description="">
          <p>Total Revenue - {formatPrice(sales.total ?? 0)}</p>
          <p>Total Sales - {formatNumber(sales.count ?? 0)}</p>
        </DashboardComponent>
        <DashboardComponent title="Subscriptions" description="">
          <p>Monthly - {formatNumber(subs.monthly ?? 0)}</p>
          <p>Yearly - {formatNumber(subs.yearly ?? 0)}</p>
        </DashboardComponent>
        <DashboardComponent title="Users" description="">
          <p>Total Users - {formatNumber(users.count ?? 0)}</p>
          <p>
            Average Revenue Per User - {formatPrice(users.averagePaid ?? 0)}
          </p>
        </DashboardComponent>
      </div>
    </div>
  );
}

type DashboardComponentProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function DashboardComponent({
  title,
  description,
  children,
}: DashboardComponentProps) {
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
