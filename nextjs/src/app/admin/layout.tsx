import AdminHeader from "./_components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <AdminHeader />
      <div className="p-4">{children}</div>
    </main>
  );
}
