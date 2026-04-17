"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Check } from "lucide-react";

type PreferenceScale = "binary" | "4-point" | "7-point" | "custom";

interface AnnotationData {
  preferenceScale: PreferenceScale;
  preferencePolarity: string;
  allowTies: boolean;
  justification: boolean;
  safetyLabels: boolean;
  riskCategories: boolean;
  customDimensions: boolean;
  minTime: string;
  allowSkip: boolean;
  allowFlag: boolean;
}

interface AnnotationProps {
  data: AnnotationData;
  onChange: (data: AnnotationData) => void;
}

const scaleOptions: { value: PreferenceScale; label: string; description: string }[] = [
  { value: "binary", label: "Binary", description: "A or B (no degree)" },
  { value: "4-point", label: "4-Point", description: "Much better, Better, Slightly better, Negligible" },
  { value: "7-point", label: "7-Point", description: "Full Likert scale with neutral midpoint" },
  { value: "custom", label: "Custom", description: "Define your own preference labels" },
];

const polarityOptions = [
  { value: "a-vs-b", label: "A vs B (position-aware)" },
  { value: "better-worse", label: "Better / Worse (abstract)" },
  { value: "left-right", label: "Left / Right" },
];

const additionalInputs = [
  { key: "justification" as const, label: "Justification text", description: "Require a written rationale for each preference" },
  { key: "safetyLabels" as const, label: "Safety labels", description: "Tag responses with safety classification" },
  { key: "riskCategories" as const, label: "Risk categories", description: "Multi-select risk taxonomy labels" },
  { key: "customDimensions" as const, label: "Custom dimensions", description: "Add custom evaluation dimensions" },
];

export function Annotation({ data, onChange }: AnnotationProps) {
  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Annotation Setup</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Configure preference scales, inputs, and annotator constraints.
      </p>

      {/* Preference Scale */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Preference Scale
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {scaleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...data, preferenceScale: opt.value })}
              className={`rounded-comfortable border p-4 text-left transition-colors ${
                data.preferenceScale === opt.value
                  ? "border-deep-teal bg-selected-bg"
                  : "border-level-2 bg-white hover:border-level-3"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    data.preferenceScale === opt.value
                      ? "border-deep-teal"
                      : "border-level-2"
                  }`}
                >
                  {data.preferenceScale === opt.value && (
                    <span className="h-2 w-2 rounded-full bg-deep-teal" />
                  )}
                </span>
                <span className="font-inter text-[14px] font-medium text-ink">
                  {opt.label}
                </span>
              </div>
              <p className="mt-1 pl-6 font-inter text-[12px] text-tertiary-text">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Preference Polarity & Allow Ties */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <Select
          label="Preference Polarity"
          options={polarityOptions}
          value={data.preferencePolarity}
          onChange={(e) =>
            onChange({ ...data, preferencePolarity: e.target.value })
          }
        />
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Allow Ties
          </label>
          <button
            type="button"
            onClick={() => onChange({ ...data, allowTies: !data.allowTies })}
            className="flex items-center gap-2.5 mt-2"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-tight border-2 transition-colors ${
                data.allowTies
                  ? "border-deep-teal bg-deep-teal"
                  : "border-level-2"
              }`}
            >
              {data.allowTies && <Check className="h-3 w-3 text-white" />}
            </span>
            <span className="font-inter text-body-md text-ink">
              Allow annotators to mark responses as equally good
            </span>
          </button>
        </div>
      </div>

      {/* Additional Inputs */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Additional Inputs
        </label>
        <div className="mt-3 space-y-3">
          {additionalInputs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                onChange({ ...data, [item.key]: !data[item.key] })
              }
              className={`flex w-full items-center gap-3 rounded-standard border p-3.5 text-left transition-colors ${
                data[item.key]
                  ? "border-deep-teal bg-selected-bg"
                  : "border-level-2 bg-white hover:border-level-3"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-tight border-2 transition-colors ${
                  data[item.key]
                    ? "border-deep-teal bg-deep-teal"
                    : "border-level-2"
                }`}
              >
                {data[item.key] && <Check className="h-3 w-3 text-white" />}
              </span>
              <div>
                <span className="font-inter text-[14px] font-medium text-ink">
                  {item.label}
                </span>
                <p className="font-inter text-[12px] text-tertiary-text">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Min Time, Allow Skip, Allow Flag */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <Input
          label="Min Time (seconds)"
          type="number"
          placeholder="45"
          value={data.minTime}
          onChange={(e) => onChange({ ...data, minTime: e.target.value })}
          helper="Minimum time before submission is allowed"
        />
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Allow Skip
          </label>
          <button
            type="button"
            onClick={() => onChange({ ...data, allowSkip: !data.allowSkip })}
            className="flex items-center gap-2.5 mt-2"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-tight border-2 transition-colors ${
                data.allowSkip
                  ? "border-deep-teal bg-deep-teal"
                  : "border-level-2"
              }`}
            >
              {data.allowSkip && <Check className="h-3 w-3 text-white" />}
            </span>
            <span className="font-inter text-body-md text-ink">
              Annotators may skip items
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Allow Flag
          </label>
          <button
            type="button"
            onClick={() => onChange({ ...data, allowFlag: !data.allowFlag })}
            className="flex items-center gap-2.5 mt-2"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-tight border-2 transition-colors ${
                data.allowFlag
                  ? "border-deep-teal bg-deep-teal"
                  : "border-level-2"
              }`}
            >
              {data.allowFlag && <Check className="h-3 w-3 text-white" />}
            </span>
            <span className="font-inter text-body-md text-ink">
              Annotators may flag items
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export type { AnnotationData, PreferenceScale };
