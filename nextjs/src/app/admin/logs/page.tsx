import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import TableNavigation from "./_components/table-navigation";
import { LOGS_PER_PAGE } from "@/lib/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function getLogs(page: number = 1) {
  const [logs, total] = await Promise.all([
    db.flashcardGroup.findMany({
      orderBy: { createdAt: "desc" },
      take: LOGS_PER_PAGE,
      skip: (page - 1) * LOGS_PER_PAGE,
    }),
    db.flashcardGroup.count(),
  ]);
  return { logs, total };
}

type AdminLogsPageProps = {
  searchParams: {
    page: number;
  };
};

export default async function AdminLogsPage({
  searchParams,
}: AdminLogsPageProps) {
  const page = (await searchParams).page ?? 1;
  const { logs, total } = await getLogs(page);

  return (
    <div className="h-full space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="relative">
              <TableCell>{log.createdAt.toLocaleString()}</TableCell>
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
      <TableNavigation page={page} total={total} />
    </div>
  );
}
