import Link from "next/link";

export default function AdminHeader() {
  return (
    <nav className="flex justify-between w-full p-6 bg-secondary shadow">
      <Link href="/admin">
        <p className="text-xl font-semibold text-primary">Admin</p>
      </Link>
      <ul className="flex gap-6">
        <li>
          <Link href="/admin">Dashboard</Link>
        </li>
        <li>
          <Link href="/admin/customers">Customers</Link>
        </li>
        <li>
          <Link href="/admin/sales">Sales</Link>
        </li>
        <li>
          <Link href="/admin/logs">Logs</Link>
        </li>
      </ul>
    </nav>
  );
}
