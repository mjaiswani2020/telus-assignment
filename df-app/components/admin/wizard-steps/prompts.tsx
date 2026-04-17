"use client";

import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";

type PromptSource = "annotator" | "dataset" | "model-generated" | "mixed";

interface PromptsData {
  source: PromptSource;
  categories: string[];
  minLength: string;
  maxLength: string;
}

interface PromptsProps {
  data: PromptsData;
  onChange: (data: PromptsData) => void;
}

const sourceOptions: { value: PromptSource; label: string; description: string }[] = [
  {
    value: "annotator",
    label: "Annotator-authored",
    description: "Annotators write original prompts based on guidelines",
  },
  {
    value: "dataset",
    label: "Dataset import",
    description: "Import prompts from an existing dataset or CSV",
  },
  {
    value: "model-generated",
    label: "Model-generated",
    description: "Use an LLM to generate prompts from seed topics",
  },
  {
    value: "mixed",
    label: "Mixed",
    description: "Combine multiple prompt sources in a single task",
  },
];

export function Prompts({ data, onChange }: PromptsProps) {
  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Prompt Configuration</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Define how prompts are sourced, categorized, and constrained.
      </p>

      {/* Prompt Source */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Prompt Source
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {sourceOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...data, source: opt.value })}
              className={`rounded-comfortable border p-4 text-left transition-colors ${
                data.source === opt.value
                  ? "border-deep-teal bg-selected-bg"
                  : "border-level-2 bg-white hover:border-level-3"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    data.source === opt.value
                      ? "border-deep-teal"
                      : "border-level-2"
                  }`}
                >
                  {data.source === opt.value && (
                    <span className="h-2 w-2 rounded-full bg-deep-teal" />
                  )}
                </span>
                <span className="font-inter text-[14px] font-medium text-ink">
                  {opt.label}
                </span>
              </div>
              <p className="mt-1.5 pl-6 font-inter text-[13px] text-tertiary-text">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      {data.source === "dataset" && (
        <div className="mt-6">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Upload Dataset
          </label>
          <div className="mt-2 flex flex-col items-center justify-center rounded-comfortable border-2 border-dashed border-level-2 bg-level-1 p-10 transition-colors hover:border-deep-teal">
            <Upload className="h-8 w-8 text-tertiary-text" />
            <p className="mt-3 font-inter text-body-md font-medium text-secondary-text">
              Drag & drop files here, or click to browse
            </p>
            <p className="mt-1 font-inter text-[12px] text-tertiary-text">
              CSV, JSONL, or Parquet -- up to 500MB
            </p>
          </div>
        </div>
      )}

      {/* Category Taxonomy */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Category Taxonomy
        </label>
        <div className="mt-2 rounded-comfortable border border-level-2 bg-white p-4">
          <div className="flex items-center gap-2 text-tertiary-text">
            <FileText className="h-4 w-4" />
            <span className="font-inter text-body-md">
              Define prompt categories for annotation routing and analytics
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(data.categories.length > 0
              ? data.categories
              : ["General", "Coding", "Creative", "Factual", "Math"]
            ).map((cat) => (
              <span
                key={cat}
                className="rounded-tight bg-level-1 border border-level-2 px-2.5 py-1 font-inter text-[12px] text-secondary-text"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Length Constraints */}
      <div className="mt-6">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Length Constraints
        </label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <Input
            label="Min tokens"
            type="number"
            placeholder="e.g., 10"
            value={data.minLength}
            onChange={(e) => onChange({ ...data, minLength: e.target.value })}
          />
          <Input
            label="Max tokens"
            type="number"
            placeholder="e.g., 2048"
            value={data.maxLength}
            onChange={(e) => onChange({ ...data, maxLength: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export type { PromptsData, PromptSource };
