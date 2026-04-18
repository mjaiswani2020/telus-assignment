"use client";

import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

interface ResponsePanelProps {
  label: string;
  title: string;
  content: string;
  tokenCount: number;
  selected?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function renderContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const inner = part.slice(3, -3);
      const newlineIdx = inner.indexOf("\n");
      const code = newlineIdx >= 0 ? inner.slice(newlineIdx + 1) : inner;
      return (
        <pre
          key={i}
          className="my-3 overflow-x-auto rounded-standard bg-level-1 p-3 font-mono text-code-sm text-ink"
        >
          <code>{code}</code>
        </pre>
      );
    }
    return (
      <span key={i} className="whitespace-pre-wrap">
        {part}
      </span>
    );
  });
}

export function ResponsePanel({
  label,
  title,
  content,
  tokenCount,
  selected = false,
  className,
  children,
}: ResponsePanelProps) {
  return (
    <div
      className={cn(
        "rounded-comfortable border bg-white transition-shadow",
        selected
          ? "ring-2 ring-deep-teal border-deep-teal"
          : "border-level-2",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-level-2 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-teal font-inter text-[13px] font-bold text-white">
          {label}
        </span>
        <span className="font-inter text-body-md font-medium text-ink">
          {title}
        </span>
        <Badge variant="neutral" animate={false} className="ml-auto">
          {tokenCount} tokens
        </Badge>
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto p-4 font-inter text-body-md leading-relaxed text-ink">
        {renderContent(content)}
      </div>

      {/* Optional children for extra elements like warnings */}
      {children && <div className="border-t border-level-2 px-4 py-3">{children}</div>}
    </div>
  );
}
