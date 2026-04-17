"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  FolderOpen,
  Megaphone,
  ListChecks,
  Server,
  Users,
  Award,
  BarChart3,
  ClipboardCheck,
  Download,
  Key,
} from "lucide-react";

const navSections = [
  {
    label: "ADMIN",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Projects", href: "/projects", icon: FolderOpen },
      { name: "Campaigns", href: "/campaigns", icon: Megaphone },
      { name: "Tasks", href: "/tasks", icon: ListChecks },
      { name: "Models", href: "/models", icon: Server },
    ],
  },
  {
    label: "WORKFORCE",
    items: [
      { name: "Annotators", href: "/annotators", icon: Users },
      { name: "Qualifications", href: "/qualifications", icon: Award },
    ],
  },
  {
    label: "QUALITY",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Reviews", href: "/reviews", icon: ClipboardCheck },
    ],
  },
  {
    label: "DATA",
    items: [
      { name: "Exports", href: "/exports", icon: Download },
      { name: "API Keys", href: "/settings/api-keys", icon: Key },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] border-r border-level-2 bg-white flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-standard bg-deep-teal">
          <span className="font-inter text-[13px] font-bold text-white">DF</span>
        </div>
        <span className="font-inter text-[15px] font-semibold tracking-[0.08em] text-ink">
          DATAFORGE
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navSections.map((section) => (
          <div key={section.label} className="mt-6 first:mt-2">
            <p className="px-3 pb-2 font-inter text-[11px] font-medium uppercase tracking-[0.06em] leading-[14px] text-tertiary-text">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-standard px-3 py-2 font-inter text-[14px] transition-colors duration-150",
                      isActive
                        ? "bg-selected-bg text-deep-teal font-medium border-l-[3px] border-deep-teal pl-[9px]"
                        : "text-sidebar-text hover:bg-level-1 hover:text-ink"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
