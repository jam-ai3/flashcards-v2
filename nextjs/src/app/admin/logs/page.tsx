"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableNavigation from "./_components/table-navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FlashcardGroup } from "@prisma/client";
import { useEffect, useState } from "react";
import { getLogs } from "./_actions/data";
import { useSearchParams } from "next/navigation";
import TableFilters from "./_components/table-filters";
import { Loader2 } from "lucide-react";
import { Status, PaymentType, InputFormat, InputType } from "@/lib/types";

export default function AdminLogsPage() {
  const page = Number(useSearchParams().get("page") ?? "1");
  const [logs, setLogs] = useState<FlashcardGroup[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status | "">("");
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [inputFormat, setInputFormat] = useState<InputFormat | "">("");
  const [inputType, setInputType] = useState<InputType | "">("");

  useEffect(() => {
    setIsLoading(true);
    getLogs(page, { status, paymentType, inputFormat, inputType })
      .then(({ logs, total }) => {
        setLogs(logs);
        setTotal(total);
      })
      .finally(() => setIsLoading(false));
  }, [status, paymentType, inputFormat, inputType, page]);

  return (
    <div className="h-full flex flex-col justify-between pb-6 px-4">
      <div className="space-y-4 h-full">
        <div className="flex justify-between">
          <p className="font-semibold text-xl">Logs</p>
          <TableFilters
            status={status}
            paymentType={paymentType}
            inputFormat={inputFormat}
            inputType={inputType}
            setStatus={setStatus}
            setPaymentType={setPaymentType}
            setInputFormat={setInputFormat}
            setInputType={setInputType}
          />
        </div>
        {isLoading ? (
          <div className="grid place-items-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <LogsTable logs={logs} />
        )}
      </div>
      <TableNavigation page={page} total={total} />
    </div>
  );
}

type LogsTableProps = {
  logs: FlashcardGroup[];
};

function LogsTable({ logs }: LogsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Input Type</TableHead>
          <TableHead>Input Format</TableHead>
          <TableHead>Payment Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id} className="relative">
            <TableCell>{log.createdAt.toLocaleString()}</TableCell>
            <TableCell>{log.inputType}</TableCell>
            <TableCell>{log.inputFormat}</TableCell>
            <TableCell>{log.paymentType}</TableCell>
            <TableCell
              className={cn(
                log.error === null ? "text-green-600" : "text-destructive"
              )}
            >
              {log.error === null ? "Success" : "Failed"}
            </TableCell>
            <TableCell className="absolute inset-0">
              <Link
                href={`/admin/logs/${log.id}`}
                className="absolute inset-0"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
