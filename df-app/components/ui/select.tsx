"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helper?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helper, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "h-10 w-full appearance-none rounded-standard border border-level-2 bg-level-1 pl-3 pr-9 font-inter text-body-md text-ink transition-colors duration-150",
              "hover:border-level-3",
              "focus:border-deep-teal focus:bg-white focus:ring-2 focus:ring-deep-teal/20 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-40",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary-text" />
        </div>
        {helper && !error && (
          <p className="text-[12px] text-tertiary-text">{helper}</p>
        )}
        {error && <p className="text-[12px] text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
