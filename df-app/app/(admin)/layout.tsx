"use client";

import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/top-bar";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-off-white">
        <Sidebar />
        <div className="ml-[240px]">
          <TopBar />
          <main className="px-8 pb-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
