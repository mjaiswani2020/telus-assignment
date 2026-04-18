"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { scaleIn } from "@/lib/animations";

type BadgeVariant =
  | "active"
  | "draft"
  | "complete"
  | "paused"
  | "review"
  | "flagged"
  | "pairwise"
  | "safety"
  | "sft"
  | "arena"
  | "editing"
  | "ranking"
  | "rubric"
  | "conversational"
  | "info"
  | "success"
  | "caution"
  | "error"
  | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  active: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
  draft: "bg-[#FFF7ED] text-[#D97706] border-[#FED7AA]",
  complete: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
  paused: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  review: "bg-[#FFF7ED] text-[#D97706] border-[#FED7AA]",
  flagged: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  pairwise: "bg-[#E6F2F2] text-[#005151] border-[#B3D9D9]",
  safety: "bg-[#FFF7ED] text-[#D97706] border-[#FED7AA]",
  sft: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  arena: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
  editing: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]",
  ranking: "bg-[#FDF2F8] text-[#DB2777] border-[#FBCFE8]",
  rubric: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
  conversational: "bg-[#E6F2F2] text-[#005151] border-[#B3D9D9]",
  info: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  success: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
  caution: "bg-[#FFF7ED] text-[#D97706] border-[#FED7AA]",
  error: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  neutral: "bg-level-1 text-secondary-text border-level-2",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  animate?: boolean;
}

export function Badge({
  variant = "neutral",
  children,
  className,
  dot,
  animate = true,
}: BadgeProps) {
  const Comp = animate ? motion.span : "span";
  const motionProps = animate
    ? { variants: scaleIn, initial: "hidden", animate: "visible" }
    : {};

  return (
    <Comp
      className={cn(
        "inline-flex items-center gap-1.5 rounded-tight border px-2 py-0.5 font-inter text-label-sm uppercase tracking-[0.5px]",
        variantStyles[variant],
        className
      )}
      {...motionProps}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-[#059669]": variant === "active" || variant === "complete" || variant === "success",
            "bg-[#D97706]": variant === "draft" || variant === "review" || variant === "caution",
            "bg-[#DC2626]": variant === "paused" || variant === "flagged" || variant === "error",
            "bg-[#2563EB]": variant === "info",
            "bg-secondary-text": variant === "neutral",
          })}
        />
      )}
      {children}
    </Comp>
  );
}

export type { BadgeVariant };
