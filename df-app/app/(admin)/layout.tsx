"use client";

import { Sidebar } from "@/components/admin/sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { ChevronDown } from "lucide-react";

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
          {/* Org selector + avatar fixed top-right */}
          <div className="fixed top-0 right-0 z-20 flex items-center gap-3 pr-8 pt-5">
            <button className="flex items-center gap-1.5 rounded-standard border border-level-2 px-3 py-1.5 font-inter text-body-md text-ink hover:bg-level-1 transition-colors duration-150">
              Alignment Lab
              <ChevronDown className="h-4 w-4 text-tertiary-text" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-teal">
              <span className="font-inter text-[14px] font-medium text-white">P</span>
            </div>
          </div>
          <main className="px-8 pt-5 pb-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
