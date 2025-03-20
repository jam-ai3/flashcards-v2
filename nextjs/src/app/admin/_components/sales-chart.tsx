"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Sale } from "@prisma/client";
import { DollarSign } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PRODUCTS_ARRAY } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  pricePaidInPennies: {
    label: "Sales",
    icon: DollarSign,
    color: "bg-blue-500",
  },
} satisfies ChartConfig;

type SalesChart = {
  sales: Sale[];
  className?: string;
};

type GraphType = "product" | "month" | "";

export default function SalesChart({ sales, className }: SalesChart) {
  const [graphType, setGraphType] = useState<GraphType>("month");
  const graphData = getGraphData(sales, graphType);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{graphData.title}</span>
          <Select
            value={graphType}
            onValueChange={(e) => setGraphType(e as GraphType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort</SelectLabel>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={graphData.data}>
          <CartesianGrid />
          <XAxis dataKey="x" />
          <YAxis
            scale="linear"
            tickFormatter={formatPrice}
            domain={[0, "auto"]}
          />
          <Bar dataKey="y" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}

type GraphData = {
  title: string;
  description: string;
  data: GraphPoint[];
};

type GraphPoint = {
  x: string;
  y: number;
};

function getGraphData(sales: Sale[], type: GraphType): GraphData {
  switch (type) {
    case "product":
      return {
        title: "Revenue / Product",
        description: "",
        data: getRevenuePerProduct(sales),
      };
    case "month":
      return {
        title: "Revenue / Month",
        description: "",
        data: getRevenuePerMonth(sales),
      };
    default:
      return {
        title: "",
        description: "",
        data: [],
      };
  }
}

function getRevenuePerProduct(sales: Sale[]): GraphPoint[] {
  return sales.reduce((acc, sale) => {
    const product = PRODUCTS_ARRAY.find((p) => p.id === sale.productId);
    if (!product) return acc;
    const index = acc.findIndex((p) => p.x === product.name);
    if (index === -1) {
      acc.push({ x: product.name, y: sale.pricePaidInPennies });
    } else {
      acc[index].y += sale.pricePaidInPennies;
    }
    return acc;
  }, [] as GraphPoint[]);
}

function getRevenuePerMonth(sales: Sale[]): GraphPoint[] {
  return sales.reduce((acc, sale) => {
    const month = sale.createdAt.toLocaleString("default", { month: "long" });
    const index = acc.findIndex((p) => p.x === month);
    if (index === -1) {
      acc.push({ x: month, y: sale.pricePaidInPennies });
    } else {
      acc[index].y += sale.pricePaidInPennies;
    }
    return acc;
  }, [] as GraphPoint[]);
}
