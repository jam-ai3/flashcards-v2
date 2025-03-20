"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Customer,
  getCustomers,
  getTotalCustomers,
  Ordering,
} from "./_actions/data";
import OrderMenu from "./_components/order-menu";
import Loading from "@/components/loading";
import TableNavigation from "../_components/table-navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminCustomersPage() {
  const page = Number(useSearchParams().get("page") ?? "1");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [ordering, setOrdering] = useState<Ordering>("createdDesc");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getCustomers(ordering, page)
      .then((customers) => setCustomers(customers))
      .finally(() => setIsLoading(false));
  }, [ordering]);

  useEffect(() => {
    getTotalCustomers().then((total) => setTotal(total));
  }, []);

  return (
    <div className="h-full flex flex-col justify-between pb-6 px-4">
      <div className="space-y-4 h-full">
        <div className="flex justify-between">
          <p className="text-xl font-semibold">Customers</p>
          <OrderMenu ordering={ordering} setOrdering={setOrdering} />
        </div>
        {isLoading ? <Loading /> : <CustomersTable customers={customers} />}
      </div>
      <TableNavigation page={page} total={total} route="/admin/customers" />
    </div>
  );
}

type CustomerTableProps = {
  customers: Customer[];
};

function CustomersTable({ customers }: CustomerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Joined Date</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Subscription</TableHead>
          <TableHead>Purchases</TableHead>
          <TableHead>Total Spent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id} className="relative">
            <TableCell>{customer.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>{customer.id}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>
              {customer.subscriptions.length === 0
                ? "None"
                : customer.subscriptions[0].type}
            </TableCell>
            <TableCell>{customer.sales.length}</TableCell>
            <TableCell>
              {formatPrice(
                customer.sales.reduce(
                  (acc, sale) => acc + sale.pricePaidInPennies,
                  0
                )
              )}
            </TableCell>
            <TableCell>
              <Link
                href={`/admin/customers/${customer.id}`}
                className="absolute inset-0"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
