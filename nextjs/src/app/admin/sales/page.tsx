"use client";

import { useEffect, useState } from "react";
import { getSalesData, getTotalSales, Sale } from "./_actions/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PRODUCTS_ARRAY } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import Loading from "../loading";
import { useSearchParams } from "next/navigation";
import TableNavigation from "../_components/table-navigation";
import TableFilters from "./_components/table-fiilters";

export default function AdminSalesPage() {
  const page = Number(useSearchParams().get("page") ?? "1");
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const productIds = PRODUCTS_ARRAY.map((p) => p.id);

  useEffect(() => {
    setIsLoading(true);
    getSalesData(productId, page)
      .then((sales) => setSales(sales))
      .finally(() => setIsLoading(false));
  }, [productId, page]);

  useEffect(() => {
    getTotalSales(productId).then((totalSales) => setTotalSales(totalSales));
  }, [productId]);

  return (
    <div className="h-full flex flex-col justify-between pb-6 px-4">
      <div className="space-y-4 h-full">
        <div className="flex justify-between">
          <p className="text-xl font-semibold">Sales</p>
          <TableFilters
            productId={productId}
            setProductId={setProductId}
            options={productIds}
            clear={() => setProductId("")}
          />
        </div>
        {isLoading ? <Loading /> : <SalesTable sales={sales} />}
      </div>
      <TableNavigation page={page} total={totalSales} route="/admin/sales" />
    </div>
  );
}

type SalesTableProps = {
  sales: Sale[];
};

function SalesTable({ sales }: SalesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Product ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>User ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{sale.createdAt.toLocaleString()}</TableCell>
            <TableCell>{sale.productId}</TableCell>
            <TableCell>
              {PRODUCTS_ARRAY.find((p) => p.id === sale.productId)?.name ??
                "Unknown"}
            </TableCell>
            <TableCell>{formatPrice(sale.pricePaidInPennies)}</TableCell>
            <TableCell>{sale.userId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
