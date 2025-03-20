import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatNumber, formatPrice } from "@/lib/utils";
import { DollarSign, Newspaper, User } from "lucide-react";
import SalesChart from "./_components/sales-chart";
import { PRODUCTS_ARRAY } from "@/lib/constants";

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
  const [count, sales] = await Promise.all([
    db.user.count(),
    db.sale.aggregate({
      _sum: { pricePaidInPennies: true },
    }),
  ]);

  return {
    count,
    averagePaid: (sales._sum.pricePaidInPennies ?? 0) / count,
  };
}

async function getRawSales() {
  return await db.sale.findMany({
    select: {
      id: true,
      createdAt: true,
      pricePaidInPennies: true,
      productId: true,
      userId: true,
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function AdminPage() {
  const [sales, subs, users, rawSales] = await Promise.all([
    getSales(),
    getSubscriptions(),
    getUsers(),
    getRawSales(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <DashboardComponent title="Sales" icon={<DollarSign />} description="">
          <p>Total Revenue - {formatPrice(sales.total ?? 0)}</p>
          <p>Total Sales - {formatNumber(sales.count ?? 0)}</p>
        </DashboardComponent>
        <DashboardComponent
          title="Active Subscriptions"
          icon={<Newspaper />}
          description=""
        >
          <p>Monthly - {formatNumber(subs.monthly ?? 0)}</p>
          <p>Yearly - {formatNumber(subs.yearly ?? 0)}</p>
        </DashboardComponent>
        <DashboardComponent title="Users" icon={<User />} description="">
          <p>Total Users - {formatNumber(users.count ?? 0)}</p>
          <p>
            Average Revenue Per User - {formatPrice(users.averagePaid ?? 0)}
          </p>
        </DashboardComponent>
      </div>
      <div className="flex gap-4">
        <SalesChart sales={rawSales} className="flex-1/2" />
        <Card className="flex-1/2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rawSales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex justify-between items-center">
                <div>
                  <p>{sale.user.email}</p>
                  <p className="text-muted-foreground text-sm">
                    {sale.createdAt.toLocaleString()}
                  </p>
                </div>
                <p className="font-bold">
                  {PRODUCTS_ARRAY.find((p) => p.id === sale.productId)?.name ??
                    "Unknown"}
                  {" - "}
                  {formatPrice(sale.pricePaidInPennies)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type DashboardComponentProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

function DashboardComponent({
  icon,
  title,
  description,
  children,
}: DashboardComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {icon}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
