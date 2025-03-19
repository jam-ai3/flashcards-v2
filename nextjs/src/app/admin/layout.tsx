import AdminHeader from "./_components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col h-screen">
      <AdminHeader />
      <div className="p-4 h-full">{children}</div>
    </main>
  );
}
