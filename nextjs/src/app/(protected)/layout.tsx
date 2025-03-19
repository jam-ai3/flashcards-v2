import Header from "@/components/header";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col gap-6 p-8 h-screen">
      <Header />
      {children}
    </main>
  );
}
