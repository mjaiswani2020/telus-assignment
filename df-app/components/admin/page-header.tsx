"use client";

import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="flex items-baseline gap-3">
        <h1 className="font-literata text-[28px] font-semibold uppercase tracking-[-0.02em] leading-[34px] text-ink">
          {title}
        </h1>
        {subtitle && (
          <span className="font-inter text-body-md text-tertiary-text">{subtitle}</span>
        )}
      </div>
      {action}
    </div>
  );
}
