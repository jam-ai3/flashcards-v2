import Link from "next/link";

export default function AdminHeader() {
  return (
    <nav className="flex justify-center w-full py-6 bg-secondary shadow">
      <ul className="flex gap-6">
        <li>
          <Link href="/admin">Dashboard</Link>
        </li>
        <li>
          <Link href="/admin/customers">Customers</Link>
        </li>
        <li>
          <Link href="/admin/products">Products</Link>
        </li>
        <li>
          <Link href="/admin/sales">Sales</Link>
        </li>
      </ul>
    </nav>
  );
}
