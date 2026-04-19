"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const settingsTabs = [
  { id: "general", label: "General", href: "/settings/general" },
  { id: "api-keys", label: "API Keys", href: "/settings/api-keys" },
  { id: "sso", label: "SSO", href: "/settings/sso" },
  { id: "webhooks", label: "Webhooks", href: "/settings/webhooks" },
  { id: "workflows", label: "Workflows", href: "/settings/workflows" },
  { id: "compliance", label: "Compliance", href: "/settings/compliance" },
  { id: "billing", label: "Billing", href: "/settings/billing" },
  { id: "security", label: "Security", href: "/settings/security" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="flex border-b border-level-2">
      {settingsTabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "relative px-4 py-2.5 font-inter text-label-lg transition-colors duration-150",
              isActive
                ? "text-ink font-medium"
                : "text-tertiary-text hover:text-ink"
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005151]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
