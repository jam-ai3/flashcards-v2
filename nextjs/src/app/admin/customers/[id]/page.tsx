import InfoLine from "@/components/info-line";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { PRODUCTS_ARRAY } from "@/lib/constants";
import { formatNumber, formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";

type CustomerPageProps = {
  params: { id: string };
};

async function getCustomerData(id: string) {
  return await db.user.findUnique({
    where: { id },
    select: {
      email: true,
      createdAt: true,
      freeGenerates: true,
      paidGenerates: true,
      subscriptions: {
        select: {
          type: true,
          expiresAt: true,
          generatesUsed: true,
        },
      },
      groups: {
        select: {
          id: true,
          cards: {
            select: {
              id: true,
            },
          },
        },
      },
      sales: {
        select: {
          id: true,
          createdAt: true,
          productId: true,
          pricePaidInPennies: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  const customer = await getCustomerData(id);
  if (!customer) return notFound();
  const subscription =
    customer.subscriptions.length === 0 ? null : customer.subscriptions[0];
  const transactions = customer.sales.map((sale) => ({
    ...sale,
    productName:
      PRODUCTS_ARRAY.find((p) => p.id === sale.productId)?.name ?? "Unknown",
  }));

  return (
    <div className="grid grid-cols-2">
      <section className="p-4 space-y-4">
        <p className="text-xl font-semibold">Customer Info</p>
        <div className="space-y-4">
          <InfoLine label="ID" value={id} />
          <InfoLine label="Email" value={customer.email} />
          <InfoLine label="Transactions" value={customer.sales.length} />
          <InfoLine
            label="Total Spent"
            value={formatPrice(
              customer.sales.reduce(
                (acc, sale) => acc + sale.pricePaidInPennies,
                0
              )
            )}
          />
          <InfoLine
            label="Subscription Type"
            value={subscription?.type ?? "None"}
          />
          <InfoLine
            label="Subscription Expires"
            value={subscription?.expiresAt.toLocaleDateString() ?? "N/A"}
          />
          <InfoLine label="Free Generates" value={customer.freeGenerates} />
          <InfoLine label="Paid Generates" value={customer.paidGenerates} />
          <InfoLine
            label="Subscription Generates Used"
            value={subscription?.generatesUsed ?? "N/A"}
          />
          <InfoLine label="Flashcard Groups" value={customer.groups.length} />
          <InfoLine
            label="Flashcards"
            value={formatNumber(
              customer.groups.reduce(
                (acc, group) => acc + group.cards.length,
                0
              )
            )}
          />
        </div>
      </section>
      <section className="p-4 space-y-4">
        <p className="text-xl font-semibold">Transactions</p>
        {customer.sales.length === 0 ? (
          <p className="italic">No Sales Data</p>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}
      </section>
    </div>
  );
}

type TransactionsTableProps = {
  transactions: {
    id: string;
    createdAt: Date;
    productId: string;
    productName: string;
    pricePaidInPennies: number;
  }[];
};

function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Product ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{sale.createdAt.toLocaleString()}</TableCell>
            <TableCell>{sale.productId}</TableCell>
            <TableCell>
              {PRODUCTS_ARRAY.find((p) => p.id === sale.productId)?.name ??
                "Unknown"}
            </TableCell>
            <TableCell>{formatPrice(sale.pricePaidInPennies)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
