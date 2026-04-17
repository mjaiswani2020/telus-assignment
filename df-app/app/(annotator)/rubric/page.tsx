"use client";

import { useState } from "react";
import { TaskHeader } from "@/components/annotator/task-header";
import { GuidelinesDrawer } from "@/components/guidelines-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const PROMPT_TEXT = `What are the key differences between REST and GraphQL APIs? When should I choose one over the other for a new project?`;

const RESPONSE_TEXT = `REST and GraphQL are two popular approaches to building APIs, each with distinct characteristics:

**REST (Representational State Transfer):**
- Uses standard HTTP methods (GET, POST, PUT, DELETE)
- Has multiple endpoints, each representing a resource
- Returns fixed data structures defined by the server
- Leverages HTTP caching natively
- Well-suited for simple, resource-oriented APIs

**GraphQL:**
- Uses a single endpoint with a query language
- Clients specify exactly what data they need
- Reduces over-fetching and under-fetching of data
- Has a strong type system with schema introspection
- Better for complex, interconnected data models

**When to choose REST:**
- Simple CRUD operations with straightforward data models
- When HTTP caching is critical
- When your team is more familiar with REST conventions
- For public APIs where simplicity aids adoption

**When to choose GraphQL:**
- Complex data requirements with multiple related entities
- Mobile applications where bandwidth is a concern
- Rapidly evolving frontends that need flexible data fetching
- When you want to aggregate data from multiple microservices

Both approaches can coexist. Many organizations use REST for simple services and GraphQL as a gateway layer for complex client needs.`;

type SafetyValue = "safe" | "borderline" | "unsafe" | null;
type VerbosityValue = "too-short" | "appropriate" | "too-verbose" | null;

export default function RubricPage() {
  const [helpfulness, setHelpfulness] = useState(3);
  const [accuracy, setAccuracy] = useState(4);
  const [safety, setSafety] = useState<SafetyValue>("safe");
  const [verbosity, setVerbosity] = useState<VerbosityValue>("appropriate");
  const [tone, setTone] = useState(4);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  function SliderDimension({
    label,
    subtitle,
    value,
    onChange,
  }: {
    label: string;
    subtitle: string;
    value: number;
    onChange: (v: number) => void;
  }) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-inter text-body-md font-medium text-ink">{label}</p>
            <p className="font-inter text-label-md text-tertiary-text">{subtitle}</p>
          </div>
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-standard font-inter text-[14px] font-bold",
              value >= 4 ? "bg-[#ECFDF5] text-success" : value >= 3 ? "bg-[#FFFBEB] text-caution" : "bg-[#FEF2F2] text-error"
            )}
          >
            {value}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-inter text-label-sm text-tertiary-text">1</span>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-level-2 accent-deep-teal [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-deep-teal [&::-webkit-slider-thumb]:shadow-md"
          />
          <span className="font-inter text-label-sm text-tertiary-text">5</span>
        </div>
      </div>
    );
  }

  function ButtonGroup<T extends string>({
    label,
    subtitle,
    options,
    value,
    onChange,
  }: {
    label: string;
    subtitle: string;
    options: { key: T; label: string }[];
    value: T | null;
    onChange: (v: T) => void;
  }) {
    return (
      <div className="space-y-2">
        <div>
          <p className="font-inter text-body-md font-medium text-ink">{label}</p>
          <p className="font-inter text-label-md text-tertiary-text">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              className={cn(
                "rounded-standard border px-4 py-2 font-inter text-label-md font-medium transition-colors duration-150",
                value === opt.key
                  ? "border-deep-teal bg-deep-teal text-white"
                  : "border-level-2 text-secondary-text hover:border-deep-teal hover:text-ink"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <TaskHeader
        taskName="Rubric Evaluation"
        subtitle="Rubric Scoring"
        progress={{ current: 15, total: 80 }}
        timer="2:15"
        onGuidelines={() => setGuidelinesOpen(true)}
      />

      <div className="stagger-children mx-auto max-w-[1440px] space-y-4 px-8 py-6">
        {/* Prompt */}
        <div>
          <p className="mb-2 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Prompt
          </p>
          <div className="rounded-comfortable bg-level-1 px-5 py-4">
            <p className="font-inter text-body-md text-ink">{PROMPT_TEXT}</p>
          </div>
        </div>

        {/* Response card */}
        <div>
          <div className="rounded-comfortable border border-level-2 bg-white">
            <div className="flex items-center justify-between border-b border-level-2 px-4 py-3">
              <span className="font-inter text-body-md font-medium text-ink">Model Response</span>
              <Badge variant="neutral" animate={false}>487 tokens</Badge>
            </div>
            <div className="p-4">
              <p className="whitespace-pre-wrap font-inter text-body-md leading-relaxed text-ink">
                {RESPONSE_TEXT}
              </p>
            </div>
          </div>
        </div>

        {/* Scoring dimensions */}
        <div className="space-y-4 rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-literata text-title-lg text-ink">Scoring Dimensions</h3>

          <SliderDimension
            label="Helpfulness"
            subtitle="Does the response directly and thoroughly address the user's question?"
            value={helpfulness}
            onChange={setHelpfulness}
          />

          <hr className="border-level-2" />

          <SliderDimension
            label="Factual Accuracy"
            subtitle="Are all claims factually correct and properly nuanced?"
            value={accuracy}
            onChange={setAccuracy}
          />

          <hr className="border-level-2" />

          <ButtonGroup<SafetyValue & string>
            label="Safety"
            subtitle="Does the response avoid harmful, misleading, or biased content?"
            options={[
              { key: "safe", label: "Safe" },
              { key: "borderline", label: "Borderline" },
              { key: "unsafe", label: "Unsafe" },
            ]}
            value={safety}
            onChange={setSafety}
          />

          <hr className="border-level-2" />

          <ButtonGroup<VerbosityValue & string>
            label="Verbosity"
            subtitle="Is the response length appropriate for the question asked?"
            options={[
              { key: "too-short", label: "Too short" },
              { key: "appropriate", label: "Appropriate" },
              { key: "too-verbose", label: "Too verbose" },
            ]}
            value={verbosity}
            onChange={setVerbosity}
          />

          <hr className="border-level-2" />

          <SliderDimension
            label="Tone / Style"
            subtitle="Is the tone professional, clear, and appropriate for the context?"
            value={tone}
            onChange={setTone}
          />
        </div>

        {/* Submit */}
        <div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!safety || !verbosity}
          >
            Submit Evaluation
          </Button>
        </div>
      </div>

      <GuidelinesDrawer open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </>
  );
}
