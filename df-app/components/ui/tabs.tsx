"use client";

import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}: TabsProps) {
  if (variant === "pill") {
    return (
      <div className={cn("flex gap-1 rounded-standard bg-level-1 p-1", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-tight px-3 py-1.5 font-inter text-label-md transition-colors duration-150",
              activeTab === tab.id
                ? "bg-white text-ink shadow-sm"
                : "text-tertiary-text hover:text-ink"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-tertiary-text">({tab.count})</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex border-b border-level-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative px-4 py-2.5 font-inter text-label-lg transition-colors duration-150",
            activeTab === tab.id
              ? "text-ink font-medium"
              : "text-tertiary-text hover:text-ink"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-tertiary-text">({tab.count})</span>
          )}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />
          )}
        </button>
      ))}
    </div>
  );
}
