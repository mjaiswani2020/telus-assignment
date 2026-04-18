"use client";

import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

const steps = [
  { number: 1, name: "Basic Info" },
  { number: 2, name: "Prompts" },
  { number: 3, name: "Models" },
  { number: 4, name: "Annotation" },
  { number: 5, name: "Quality" },
  { number: 6, name: "Guidelines" },
  { number: 7, name: "Review" },
];

interface WizardStepSidebarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function WizardStepSidebar({
  currentStep,
  onStepClick,
}: WizardStepSidebarProps) {
  return (
    <div className="w-[220px] shrink-0 border-r border-level-2 bg-white py-8 px-5">
      <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text mb-6">
        Configuration
      </p>
      <nav className="flex flex-col gap-1">
        {steps.map((s) => {
          const isActive = s.number === currentStep;
          const isCompleted = s.number < currentStep;

          return (
            <button
              key={s.number}
              type="button"
              onClick={() => onStepClick(s.number)}
              className={cn(
                "flex items-center gap-3 rounded-standard px-3 py-2.5 text-left transition-colors duration-150",
                isActive && "bg-selected-bg",
                !isActive && !isCompleted && "hover:bg-level-1"
              )}
            >
              {/* Step circle */}
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-medium transition-colors duration-150",
                  isActive &&
                    "bg-deep-teal text-white",
                  isCompleted &&
                    "bg-deep-teal text-white",
                  !isActive &&
                    !isCompleted &&
                    "border border-level-2 text-tertiary-text"
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  s.number
                )}
              </span>

              {/* Step name */}
              <span
                className={cn(
                  "font-inter text-[14px]",
                  isActive && "font-semibold text-deep-teal",
                  isCompleted && "font-medium text-ink",
                  !isActive && !isCompleted && "text-tertiary-text"
                )}
              >
                {s.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
