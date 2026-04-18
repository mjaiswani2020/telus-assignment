"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { ChevronDown, Check } from "lucide-react";

const orgs = [
  { id: "google", name: "Google DeepMind", initial: "G", color: "#4285F4" },
  { id: "meta", name: "Meta AI", initial: "M", color: "#0668E1" },
  { id: "anthropic", name: "Anthropic", initial: "A", color: "#D97706" },
  { id: "openai", name: "OpenAI", initial: "O", color: "#10A37F" },
  { id: "alignment-lab", name: "Alignment Lab", initial: "A", color: "#005151" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedOrg, setSelectedOrg] = useState("google");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = orgs.find((o) => o.id === selectedOrg)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-off-white">
        <Sidebar />
        <div className="ml-[240px]">
          {/* Org selector + avatar fixed top-right */}
          <div className="fixed top-0 right-0 z-20 flex items-center gap-3 pr-8 pt-5">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 rounded-standard border border-level-2 px-3 py-1.5 font-inter text-body-md text-ink hover:bg-level-1 transition-colors duration-150"
              >
                {current.name}
                <ChevronDown className={`h-4 w-4 text-tertiary-text transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="absolute right-0 mt-1 w-56 rounded-comfortable border border-level-2 bg-white py-1 shadow-lg">
                  {orgs.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => { setSelectedOrg(org.id); setOpen(false); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 font-inter text-[13px] text-ink hover:bg-level-1 transition-colors"
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ backgroundColor: org.color }}
                      >
                        {org.initial}
                      </div>
                      <span className="flex-1 text-left">{org.name}</span>
                      {org.id === selectedOrg && (
                        <Check className="h-4 w-4 text-deep-teal" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: current.color }}
            >
              <span className="font-inter text-[14px] font-medium text-white">
                {current.initial}
              </span>
            </div>
          </div>
          <main className="px-8 pt-5 pb-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
