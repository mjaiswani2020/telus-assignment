"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Check } from "lucide-react";
import type { TypeFeatures, MultiTurnConfig, SafetyConfig, CustomDimension } from "@/lib/task-type-config";

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
  customScaleLabels: string[];
  customDimensionsList: CustomDimension[];
  multiTurnConfig: MultiTurnConfig;
  safetyConfig: SafetyConfig;
}

interface AnnotationProps {
  data: AnnotationData;
  onChange: (data: AnnotationData) => void;
  features: TypeFeatures;
}

const scaleOptions: { value: PreferenceScale; label: string; description: string }[] = [
  { value: "binary", label: "Binary", description: "A or B (no degree)" },
  { value: "4-point", label: "4-Point", description: "Much better, Better, Slightly better, Negligible" },
  { value: "7-point", label: "7-Point", description: "Full Likert scale with neutral midpoint" },
  { value: "custom", label: "Custom", description: "Define your own preference labels" },
];

const polarityOptions = [
  { value: "pick-better", label: "Pick the better response" },
  { value: "pick-worse", label: "Pick the worse response (red-teaming)" },
  { value: "position-blind", label: "Position-blind (randomized labels)" },
];

const additionalInputs = [
  { key: "justification" as const, label: "Justification text", description: "Require a written rationale for each preference" },
  { key: "safetyLabels" as const, label: "Safety labels", description: "Tag responses with safety classification (Safe / Borderline / Unsafe)" },
  { key: "riskCategories" as const, label: "Risk categories", description: "Multi-select risk taxonomy labels (violence, self-harm, etc.)" },
  { key: "customDimensions" as const, label: "Custom dimensions", description: "Add custom evaluation dimensions with configurable scales" },
];

export function Annotation({ data, onChange, features }: AnnotationProps) {
  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Annotation Setup</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Configure preference scales, inputs, and annotator constraints.
      </p>

      {/* Preference Scale — hidden for SFT */}
      {features.showPreferenceScale && (
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

          {/* Custom Scale Label Editor */}
          {data.preferenceScale === "custom" && (
            <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-4">
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Custom Scale Labels
              </label>
              <p className="mt-1 font-inter text-[12px] text-tertiary-text">
                Define labels from strongest to weakest preference.
              </p>
              <div className="mt-3 space-y-2">
                {(data.customScaleLabels.length > 0
                  ? data.customScaleLabels
                  : ["", ""]
                ).map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-center font-inter text-[12px] text-tertiary-text">
                      {i + 1}.
                    </span>
                    <input
                      type="text"
                      value={label}
                      placeholder={`Label ${i + 1} (e.g., "Much better")`}
                      onChange={(e) => {
                        const next = [...(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""])];
                        next[i] = e.target.value;
                        onChange({ ...data, customScaleLabels: next });
                      }}
                      className="flex-1 rounded-standard border border-level-2 bg-level-1 px-3 py-2 font-inter text-body-md text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-teal/20"
                    />
                    {(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""]).length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""])];
                          next.splice(i, 1);
                          onChange({ ...data, customScaleLabels: next });
                        }}
                        className="text-tertiary-text hover:text-error"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = [...(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""]), ""];
                  onChange({ ...data, customScaleLabels: next });
                }}
                className="mt-2 font-inter text-[13px] font-medium text-deep-teal hover:underline"
              >
                + Add label
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preference Polarity & Allow Ties */}
      {features.showPreferenceScale && (
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
      )}

      {/* Multi-Turn Configuration */}
      {features.showMultiTurnConfig && (
        <div className="mt-8 rounded-comfortable border border-deep-teal/20 bg-selected-bg p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Multi-Turn Conversation
          </h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">
            Configure conversational RLHF where annotators chat with live models.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input
              label="Min Turns"
              type="number"
              placeholder="3"
              value={data.multiTurnConfig.minTurns}
              onChange={(e) =>
                onChange({
                  ...data,
                  multiTurnConfig: {
                    ...data.multiTurnConfig,
                    minTurns: e.target.value,
                  },
                })
              }
              helper="Minimum conversation turns before completion"
            />
            <Input
              label="Max Turns"
              type="number"
              placeholder="8"
              value={data.multiTurnConfig.maxTurns}
              onChange={(e) =>
                onChange({
                  ...data,
                  multiTurnConfig: {
                    ...data.multiTurnConfig,
                    maxTurns: e.target.value,
                  },
                })
              }
              helper="Maximum conversation turns allowed"
            />
          </div>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  multiTurnConfig: {
                    ...data.multiTurnConfig,
                    perTurnPreference: !data.multiTurnConfig.perTurnPreference,
                  },
                })
              }
              className="flex items-center gap-2.5"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-tight border-2 transition-colors ${
                  data.multiTurnConfig.perTurnPreference
                    ? "border-deep-teal bg-deep-teal"
                    : "border-level-2"
                }`}
              >
                {data.multiTurnConfig.perTurnPreference && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </span>
              <span className="font-inter text-body-md text-ink">
                Collect preference at every turn
              </span>
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  multiTurnConfig: {
                    ...data.multiTurnConfig,
                    allowUndo: !data.multiTurnConfig.allowUndo,
                  },
                })
              }
              className="flex items-center gap-2.5"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-tight border-2 transition-colors ${
                  data.multiTurnConfig.allowUndo
                    ? "border-deep-teal bg-deep-teal"
                    : "border-level-2"
                }`}
              >
                {data.multiTurnConfig.allowUndo && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </span>
              <span className="font-inter text-body-md text-ink">
                Allow annotators to undo previous turns
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Safety Configuration */}
      {features.showSafetyConfig && (
        <div className="mt-8 rounded-comfortable border border-caution/30 bg-[#FFFBEB] p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Safety & Red-Teaming
          </h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">
            Configure safety-specific features for adversarial annotation tasks.
          </p>
          <div className="mt-4 space-y-3">
            {[
              {
                key: "contentWarnings" as const,
                label: "Content warning before each task",
                desc: "Show a warning banner that annotators must acknowledge",
              },
              {
                key: "escalationButton" as const,
                label: "Escalation button",
                desc: "Show 'Report to Safety Team' button for severe content",
              },
              {
                key: "wellbeingChecks" as const,
                label: "Wellbeing check-ins",
                desc: "Periodic dialog asking annotators if they want to continue or switch tasks",
              },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    safetyConfig: {
                      ...data.safetyConfig,
                      [item.key]: !data.safetyConfig[item.key],
                    },
                  })
                }
                className={`flex w-full items-center gap-3 rounded-standard border p-3.5 text-left transition-colors ${
                  data.safetyConfig[item.key]
                    ? "border-deep-teal bg-selected-bg"
                    : "border-level-2 bg-white hover:border-level-3"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-tight border-2 transition-colors ${
                    data.safetyConfig[item.key]
                      ? "border-deep-teal bg-deep-teal"
                      : "border-level-2"
                  }`}
                >
                  {data.safetyConfig[item.key] && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </span>
                <div>
                  <span className="font-inter text-[14px] font-medium text-ink">
                    {item.label}
                  </span>
                  <p className="font-inter text-[12px] text-tertiary-text">
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
            <div className="mt-2">
              <Input
                label="Break Timer (minutes)"
                type="number"
                placeholder="30"
                value={data.safetyConfig.breakTimerInterval}
                onChange={(e) =>
                  onChange({
                    ...data,
                    safetyConfig: {
                      ...data.safetyConfig,
                      breakTimerInterval: e.target.value,
                    },
                  })
                }
                helper="Remind annotators to take breaks after this many minutes"
              />
            </div>
          </div>
        </div>
      )}

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

      {/* Custom Dimensions Editor */}
      {data.customDimensions && (
        <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-4">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Evaluation Dimensions
          </label>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">
            Define the scoring axes annotators will evaluate responses on.
          </p>
          <div className="mt-3 space-y-2">
            {(data.customDimensionsList.length > 0
              ? data.customDimensionsList
              : [
                  { name: "Helpfulness", description: "Does the response address the user's needs?" },
                  { name: "Accuracy", description: "Is the information factually correct?" },
                ]
            ).map((dim, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-2.5 w-6 shrink-0 text-center font-inter text-[12px] text-tertiary-text">
                  {i + 1}.
                </span>
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={dim.name}
                    placeholder="Dimension name"
                    onChange={(e) => {
                      const next = [...(data.customDimensionsList.length > 0 ? data.customDimensionsList : [
                        { name: "Helpfulness", description: "Does the response address the user's needs?" },
                        { name: "Accuracy", description: "Is the information factually correct?" },
                      ])];
                      next[i] = { ...next[i], name: e.target.value };
                      onChange({ ...data, customDimensionsList: next });
                    }}
                    className="w-40 rounded-standard border border-level-2 bg-level-1 px-3 py-2 font-inter text-body-md text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-teal/20"
                  />
                  <input
                    type="text"
                    value={dim.description}
                    placeholder="Description"
                    onChange={(e) => {
                      const next = [...(data.customDimensionsList.length > 0 ? data.customDimensionsList : [
                        { name: "Helpfulness", description: "Does the response address the user's needs?" },
                        { name: "Accuracy", description: "Is the information factually correct?" },
                      ])];
                      next[i] = { ...next[i], description: e.target.value };
                      onChange({ ...data, customDimensionsList: next });
                    }}
                    className="flex-1 rounded-standard border border-level-2 bg-level-1 px-3 py-2 font-inter text-body-md text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-teal/20"
                  />
                </div>
                {(data.customDimensionsList.length > 0 ? data.customDimensionsList : [
                  { name: "Helpfulness", description: "" },
                  { name: "Accuracy", description: "" },
                ]).length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...(data.customDimensionsList.length > 0 ? data.customDimensionsList : [
                        { name: "Helpfulness", description: "" },
                        { name: "Accuracy", description: "" },
                      ])];
                      next.splice(i, 1);
                      onChange({ ...data, customDimensionsList: next });
                    }}
                    className="mt-2.5 text-tertiary-text hover:text-error"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              const next = [...(data.customDimensionsList.length > 0 ? data.customDimensionsList : [
                { name: "Helpfulness", description: "Does the response address the user's needs?" },
                { name: "Accuracy", description: "Is the information factually correct?" },
              ]), { name: "", description: "" }];
              onChange({ ...data, customDimensionsList: next });
            }}
            className="mt-2 font-inter text-[13px] font-medium text-deep-teal hover:underline"
          >
            + Add dimension
          </button>
        </div>
      )}

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
