"use client";

import { HeaderBar } from "@/components/annotator/header-bar";
import { ToastProvider } from "@/components/ui/toast";

export default function AnnotatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-off-white">
        <HeaderBar />
        <main>{children}</main>
      </div>
    </ToastProvider>
  );
}
