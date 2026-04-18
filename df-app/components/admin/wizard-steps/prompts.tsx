"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { useModelStore } from "@/stores/model-store";

type PromptSource = "annotator" | "dataset" | "model-generated" | "mixed";

interface PromptsData {
  source: PromptSource;
  categories: string[];
  minLength: string;
  maxLength: string;
  modelGenConfig: { model: string; seedTopics: string; count: string };
  mixedConfig: { humanProportion: string; modelProportion: string };
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

const DEFAULT_CATEGORIES = ["General", "Coding", "Creative", "Factual", "Math"];

export function Prompts({ data, onChange }: PromptsProps) {
  const [catInput, setCatInput] = useState("");
  const endpoints = useModelStore((s) => s.endpoints);

  const categories =
    data.categories.length > 0 ? data.categories : DEFAULT_CATEGORIES;

  const addCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (trimmed && !categories.includes(trimmed)) {
      onChange({ ...data, categories: [...categories, trimmed] });
    }
    setCatInput("");
  };

  const removeCategory = (cat: string) => {
    onChange({ ...data, categories: categories.filter((c) => c !== cat) });
  };

  const handleCatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory(catInput);
    }
  };

  const modelOptions = endpoints.map((ep) => ({
    value: ep.id,
    label: `${ep.name} (${ep.version})`,
  }));

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

      {/* Upload Area (dataset source) */}
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

      {/* Model-generated config */}
      {data.source === "model-generated" && (
        <div className="mt-6 rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Model-Generated Prompt Settings
          </h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">
            Configure which model generates prompts and what topics to cover.
          </p>
          <div className="mt-4 space-y-4">
            <Select
              label="Generation Model"
              options={modelOptions}
              placeholder="Select a model to generate prompts"
              value={data.modelGenConfig.model}
              onChange={(e) =>
                onChange({
                  ...data,
                  modelGenConfig: {
                    ...data.modelGenConfig,
                    model: e.target.value,
                  },
                })
              }
            />
            <Textarea
              label="Seed Topics"
              placeholder="Enter topics separated by newlines, e.g.:\nPython programming\nData structures\nMachine learning basics"
              value={data.modelGenConfig.seedTopics}
              onChange={(e) =>
                onChange({
                  ...data,
                  modelGenConfig: {
                    ...data.modelGenConfig,
                    seedTopics: e.target.value,
                  },
                })
              }
              helper="One topic per line — the model will generate diverse prompts from these seeds"
            />
            <Input
              label="Prompts to Generate"
              type="number"
              placeholder="500"
              value={data.modelGenConfig.count}
              onChange={(e) =>
                onChange({
                  ...data,
                  modelGenConfig: {
                    ...data.modelGenConfig,
                    count: e.target.value,
                  },
                })
              }
              helper="Total number of prompts to generate"
            />
          </div>
        </div>
      )}

      {/* Mixed source config */}
      {data.source === "mixed" && (
        <div className="mt-6 rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Source Mix Proportions
          </h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">
            Define how prompts are distributed across sources.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input
              label="Human-authored %"
              type="number"
              placeholder="70"
              value={data.mixedConfig.humanProportion}
              onChange={(e) =>
                onChange({
                  ...data,
                  mixedConfig: {
                    ...data.mixedConfig,
                    humanProportion: e.target.value,
                  },
                })
              }
              helper="Percentage of annotator-written prompts"
            />
            <Input
              label="Model-generated %"
              type="number"
              placeholder="30"
              value={data.mixedConfig.modelProportion}
              onChange={(e) =>
                onChange({
                  ...data,
                  mixedConfig: {
                    ...data.mixedConfig,
                    modelProportion: e.target.value,
                  },
                })
              }
              helper="Percentage of LLM-generated prompts"
            />
          </div>
        </div>
      )}

      {/* Category Taxonomy (editable) */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Category Taxonomy
        </label>
        <p className="mt-1 font-inter text-[12px] text-tertiary-text">
          Define prompt categories for annotation routing and analytics.
        </p>
        <div className="mt-2 flex min-h-[40px] flex-wrap items-center gap-1.5 rounded-standard border border-level-2 bg-level-1 px-3 py-2 transition-colors focus-within:border-deep-teal focus-within:bg-white focus-within:ring-2 focus-within:ring-deep-teal/20">
          {categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 rounded-tight bg-selected-bg px-2 py-0.5 font-inter text-[12px] font-medium text-deep-teal"
            >
              {cat}
              <button
                type="button"
                onClick={() => removeCategory(cat)}
                className="ml-0.5 hover:text-error"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            className="min-w-[100px] flex-1 bg-transparent font-inter text-body-md text-ink placeholder:text-tertiary-text outline-none"
            placeholder={
              categories.length === 0 ? "Type a category and press Enter" : "Add category..."
            }
            value={catInput}
            onChange={(e) => setCatInput(e.target.value)}
            onKeyDown={handleCatKeyDown}
          />
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
