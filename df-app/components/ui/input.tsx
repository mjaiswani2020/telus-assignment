"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helper, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 rounded-standard border border-level-2 bg-level-1 px-3 font-inter text-body-md text-ink placeholder:text-tertiary-text transition-colors duration-150",
            "hover:border-level-3",
            "focus:border-deep-teal focus:bg-white focus:ring-2 focus:ring-deep-teal/20 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-40",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
        {helper && !error && (
          <p className="text-[12px] text-tertiary-text">{helper}</p>
        )}
        {error && <p className="text-[12px] text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helper, error, charCount, maxChars, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "min-h-[100px] rounded-standard border border-level-2 bg-level-1 px-3 py-2.5 font-inter text-body-md text-ink placeholder:text-tertiary-text transition-colors duration-150 resize-y",
            "hover:border-level-3",
            "focus:border-deep-teal focus:bg-white focus:ring-2 focus:ring-deep-teal/20 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-40",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
        <div className="flex justify-between">
          {(helper || error) && (
            <p className={cn("text-[12px]", error ? "text-error" : "text-tertiary-text")}>
              {error || helper}
            </p>
          )}
          {maxChars !== undefined && (
            <p className="text-[12px] text-tertiary-text">
              {charCount !== undefined ? `${maxChars - charCount} characters remaining` : ""}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
