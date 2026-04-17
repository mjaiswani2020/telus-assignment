"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  format?: "number" | "decimal" | "percent" | "currency";
  prefix?: string;
  suffix?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

function useCountUp(target: number, duration = 600, enabled = true) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!enabled) {
      setCurrent(target);
      return;
    }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, enabled]);

  return current;
}

function formatValue(
  value: number,
  format: StatCardProps["format"],
  prefix?: string,
  suffix?: string
) {
  let formatted: string;
  switch (format) {
    case "decimal":
      formatted = value.toFixed(2);
      break;
    case "percent":
      formatted = `${value}%`;
      break;
    case "currency":
      formatted = `$${value.toLocaleString()}`;
      break;
    default:
      formatted = value.toLocaleString();
  }
  return `${prefix || ""}${formatted}${suffix || ""}`;
}

export function StatCard({
  label,
  value,
  format = "number",
  prefix,
  suffix,
  trend,
  className,
}: StatCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(value);
  const isInteger = typeof value === "number" && Number.isInteger(value);
  const shouldAnimate = isInteger && numericValue > 1;
  const countedValue = useCountUp(
    shouldAnimate ? numericValue : 0,
    600,
    shouldAnimate
  );

  const displayValue = shouldAnimate
    ? formatValue(countedValue, format, prefix, suffix)
    : typeof value === "number"
      ? formatValue(value, format, prefix, suffix)
      : String(value);

  return (
    <motion.div
      className={cn(
        "rounded-comfortable border border-level-2 bg-white p-5",
        className
      )}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
        {label}
      </p>
      <div className="mt-2 flex items-end gap-3">
        <span className="font-literata text-display-lg text-ink">
          {displayValue}
        </span>
        {trend && (
          <span
            className={cn("flex items-center gap-1 pb-1 text-label-md", {
              "text-success": trend.direction === "up",
              "text-error": trend.direction === "down",
              "text-tertiary-text": trend.direction === "neutral",
            })}
          >
            {trend.direction === "up" && <TrendingUp className="h-3.5 w-3.5" />}
            {trend.direction === "down" && (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {trend.direction === "neutral" && <Minus className="h-3.5 w-3.5" />}
            {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}
