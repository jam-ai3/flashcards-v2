"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between w-full p-6 bg-secondary shadow">
      <Link href="/admin">
        <p className="text-xl font-semibold text-primary">Admin</p>
      </Link>
      <ul className="flex gap-6">
        <li>
          <Link href="/admin">
            <span
              className={
                pathname === "/admin"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }
            >
              Dashboard
            </span>
          </Link>
        </li>
        <li>
          <Link href="/admin/customers">
            <span
              className={
                pathname === "/admin/customers"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }
            >
              Customers
            </span>
          </Link>
        </li>
        <li>
          <Link href="/admin/sales">
            <span
              className={
                pathname === "/admin/sales"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }
            >
              Sales
            </span>
          </Link>
        </li>
        <li>
          <Link href="/admin/logs">
            <span
              className={
                pathname === "/admin/logs"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }
            >
              Logs
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
