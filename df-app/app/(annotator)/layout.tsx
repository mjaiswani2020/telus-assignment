"use client";

import { ToastProvider } from "@/components/ui/toast";

export default function AnnotatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-off-white">
        {children}
      </div>
    </ToastProvider>
  );
}
