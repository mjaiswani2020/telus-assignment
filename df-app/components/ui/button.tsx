"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "compact" | "default" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-deep-teal text-white hover:bg-[#004242] active:bg-[#003636] focus-visible:ring-2 focus-visible:ring-deep-teal focus-visible:ring-offset-2 disabled:bg-deep-teal/40",
  secondary:
    "border border-deep-teal text-deep-teal hover:bg-selected-bg active:bg-[#CCE0E0] focus-visible:ring-2 focus-visible:ring-deep-teal focus-visible:ring-offset-2 disabled:border-deep-teal/40 disabled:text-deep-teal/40",
  ghost:
    "text-ink hover:bg-level-1 active:bg-level-2 focus-visible:ring-2 focus-visible:ring-deep-teal focus-visible:ring-offset-2 disabled:text-ink/40",
  destructive:
    "bg-error text-white hover:bg-[#C42020] active:bg-[#B01C1C] focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 disabled:bg-error/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-[13px]",
  compact: "h-8 px-3 text-[13px]",
  default: "h-9 px-4 text-[14px]",
  md: "h-10 px-5 text-[14px]",
  lg: "h-12 px-6 text-[16px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      icon,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-standard font-inter font-medium transition-colors duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
