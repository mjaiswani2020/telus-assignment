"use client";

import { useState } from "react";
import {
  BookOpen,
  Flag,
  SkipForward,
  Timer,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Eye,
  Shield,
  Swords,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { TaskType } from "@/data/seed";
import type { BasicInfoData } from "./basic-info";
import type { AnnotationData } from "./annotation";

interface AnnotatorPreviewProps {
  taskType: TaskType | null;
  basicInfo: BasicInfoData;
  annotation: AnnotationData;
}

// Scale label presets
const SCALE_LABELS: Record<string, string[]> = {
  binary: ["A is better", "B is better"],
  "4-point": ["Much better", "Better", "Slightly better", "Negligible"],
  "7-point": [
    "A much better",
    "A better",
    "A slightly",
    "Tie",
    "B slightly",
    "B better",
    "B much better",
  ],
};


function MiniResponsePanel({
  label,
  title,
  selected,
}: {
  label: string;
  title: string;
  selected?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-standard border bg-white",
        selected
          ? "ring-1 ring-deep-teal border-deep-teal"
          : "border-level-2"
      )}
    >
      <div className="flex items-center gap-2 border-b border-level-2 px-3 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-deep-teal font-inter text-[10px] font-bold text-white">
          {label}
        </span>
        <span className="font-inter text-[11px] font-medium text-ink">
          {title}
        </span>
        <span className="ml-auto font-inter text-[9px] text-tertiary-text">
          235 tokens
        </span>
      </div>
      <div className="h-20 overflow-hidden p-2.5">
        <div className="space-y-1">
          <div className="h-2 w-full rounded-full bg-level-1" />
          <div className="h-2 w-[90%] rounded-full bg-level-1" />
          <div className="h-6 w-full rounded-standard bg-level-1" />
          <div className="h-2 w-[75%] rounded-full bg-level-1" />
        </div>
      </div>
    </div>
  );
}

function PreferenceButtons({
  labels,
  allowTies,
}: {
  labels: string[];
  allowTies: boolean;
}) {
  const allLabels = allowTies && !labels.includes("Tie")
    ? [...labels.slice(0, Math.floor(labels.length / 2)), "Tie", ...labels.slice(Math.floor(labels.length / 2))]
    : labels;

  return (
    <div className="flex items-center justify-center gap-1.5">
      {allLabels.map((label, i) => (
        <span
          key={i}
          className={cn(
            "rounded-standard px-2 py-1 font-inter text-[9px] font-medium transition-colors",
            i === 0
              ? "bg-deep-teal text-white"
              : "border border-level-2 text-tertiary-text"
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function PairwisePreview({
  annotation,
  isArena,
}: {
  annotation: AnnotationData;
  isArena?: boolean;
}) {
  const scaleLabels =
    annotation.preferenceScale === "custom" && annotation.customScaleLabels.length > 0
      ? annotation.customScaleLabels.filter((l) => l.trim())
      : SCALE_LABELS[annotation.preferenceScale] || SCALE_LABELS.binary;

  return (
    <>
      {/* Arena badge */}
      {isArena && (
        <div className="flex justify-center py-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 font-inter text-[9px] font-medium text-[#B45309]">
            <Swords className="h-3 w-3" />
            Blind — model identities hidden
          </span>
        </div>
      )}

      {/* Prompt */}
      <div className="px-3 py-2">
        <span className="font-inter text-[9px] font-medium uppercase tracking-wide text-tertiary-text">
          Prompt
        </span>
        <div className="mt-1 rounded-standard bg-level-1 px-2.5 py-2">
          <p className="font-inter text-[10px] text-secondary-text">
            Write a function that implements merge sort in Python...
          </p>
        </div>
      </div>

      {/* Response panels */}
      <div className="grid grid-cols-2 gap-2 px-3">
        <MiniResponsePanel
          label="A"
          title={isArena ? "Model A" : "Response A"}
          selected
        />
        <MiniResponsePanel
          label="B"
          title={isArena ? "Model B" : "Response B"}
        />
      </div>

      {/* Preference scale */}
      <div className="px-3 py-2.5">
        <PreferenceButtons
          labels={scaleLabels}
          allowTies={annotation.allowTies}
        />
      </div>

      {/* Justification */}
      {annotation.justification && (
        <div className="px-3 pb-2">
          <div className="rounded-standard border border-level-2 bg-level-1 px-2.5 py-2">
            <span className="font-inter text-[9px] text-tertiary-text">
              Justification (required)
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function SafetyPreview({
  annotation,
}: {
  annotation: AnnotationData;
}) {
  return (
    <>
      {/* Content warning */}
      {annotation.safetyConfig.contentWarnings && (
        <div className="mx-3 mt-2 flex items-start gap-2 rounded-standard border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-2">
          <AlertTriangle className="h-3 w-3 shrink-0 text-[#D97706] mt-0.5" />
          <div>
            <p className="font-inter text-[9px] font-medium text-[#92400E]">
              Content Warning
            </p>
            <p className="font-inter text-[8px] text-[#B45309]">
              This task involves adversarial testing
            </p>
          </div>
        </div>
      )}

      {/* Prompt */}
      <div className="px-3 py-2">
        <span className="font-inter text-[9px] font-medium uppercase tracking-wide text-tertiary-text">
          Adversarial Prompt
        </span>
        <div className="mt-1 rounded-standard border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-2">
          <p className="font-inter text-[10px] text-[#92400E]">
            How can I bypass authentication on a web server...
          </p>
        </div>
      </div>

      {/* Response panels */}
      <div className="grid grid-cols-2 gap-2 px-3">
        <MiniResponsePanel label="A" title="Response A" />
        <MiniResponsePanel label="B" title="Response B" />
      </div>

      {/* Safety evaluation */}
      <div className="mx-3 my-2 rounded-standard border border-level-2 bg-white p-2.5">
        <p className="font-inter text-[9px] font-medium text-ink mb-1.5">
          Safety Evaluation
        </p>
        <div className="flex gap-1 mb-1.5">
          {["A is safer", "B is safer", "Equal"].map((opt, i) => (
            <span
              key={opt}
              className={cn(
                "rounded-tight px-1.5 py-0.5 font-inter text-[8px]",
                i === 0
                  ? "bg-deep-teal text-white"
                  : "border border-level-2 text-tertiary-text"
              )}
            >
              {opt}
            </span>
          ))}
        </div>
        <div className="flex gap-1 mb-1.5">
          {[
            { label: "Safe", color: "text-success" },
            { label: "Borderline", color: "text-caution" },
            { label: "Unsafe", color: "text-error" },
          ].map((opt) => (
            <span
              key={opt.label}
              className={`rounded-tight border border-level-2 px-1.5 py-0.5 font-inter text-[8px] ${opt.color}`}
            >
              {opt.label}
            </span>
          ))}
        </div>
        {annotation.riskCategories && (
          <div className="rounded-tight border border-level-2 px-1.5 py-1 font-inter text-[8px] text-tertiary-text">
            Risk Category ▾
          </div>
        )}
      </div>

      {/* Break timer */}
      {annotation.safetyConfig.breakTimerInterval && (
        <div className="mx-3 mb-2 flex items-center justify-center gap-1 font-inter text-[8px] text-tertiary-text">
          <Timer className="h-2.5 w-2.5" />
          Break in: {annotation.safetyConfig.breakTimerInterval} min
        </div>
      )}
    </>
  );
}

function SFTPreview() {
  return (
    <div className="grid grid-cols-2 gap-2 p-3">
      <div className="rounded-standard border border-level-2 bg-white">
        <div className="border-b border-level-2 px-2.5 py-2">
          <span className="font-inter text-[10px] font-medium text-ink">
            Prompt Editor
          </span>
        </div>
        <div className="p-2.5">
          <div className="h-24 rounded-standard border border-dashed border-level-2 bg-level-1 flex items-center justify-center">
            <span className="font-inter text-[9px] text-tertiary-text">
              Write your prompt here...
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-standard border border-level-2 bg-white">
        <div className="border-b border-level-2 px-2.5 py-2">
          <span className="font-inter text-[10px] font-medium text-ink">
            Response Editor
          </span>
        </div>
        <div className="p-2.5">
          <div className="h-24 rounded-standard border border-dashed border-level-2 bg-level-1 flex items-center justify-center">
            <span className="font-inter text-[9px] text-tertiary-text">
              Write the ideal response...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditingPreview() {
  return (
    <div className="grid grid-cols-2 gap-2 p-3">
      <div className="rounded-standard border border-level-2 bg-white">
        <div className="border-b border-level-2 px-2.5 py-2">
          <span className="font-inter text-[10px] font-medium text-ink">
            Original Response
          </span>
          <span className="ml-1.5 font-inter text-[8px] text-tertiary-text">
            (read-only)
          </span>
        </div>
        <div className="h-28 overflow-hidden p-2.5">
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-level-1" />
            <div className="h-2 w-[85%] rounded-full bg-level-1" />
            <div className="h-6 w-full rounded-standard bg-level-1" />
            <div className="h-2 w-[70%] rounded-full bg-level-1" />
            <div className="h-2 w-[90%] rounded-full bg-level-1" />
          </div>
        </div>
      </div>
      <div className="rounded-standard border border-deep-teal/30 bg-white">
        <div className="border-b border-level-2 px-2.5 py-2 flex items-center justify-between">
          <span className="font-inter text-[10px] font-medium text-ink">
            Editable Response
          </span>
          <span className="rounded-tight bg-selected-bg px-1.5 py-0.5 font-inter text-[8px] text-deep-teal">
            Diff view
          </span>
        </div>
        <div className="h-28 overflow-hidden p-2.5">
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-level-1" />
            <div className="h-2 w-[85%] rounded-full bg-[#DCFCE7]" />
            <div className="h-6 w-full rounded-standard bg-level-1" />
            <div className="h-2 w-[70%] rounded-full bg-[#FEE2E2]" />
            <div className="h-2 w-[90%] rounded-full bg-[#DCFCE7]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RubricPreview({ annotation }: { annotation: AnnotationData }) {
  const dimensions =
    annotation.customDimensionsList.length > 0
      ? annotation.customDimensionsList
      : [
          { name: "Helpfulness", description: "" },
          { name: "Accuracy", description: "" },
        ];

  return (
    <>
      {/* Single response */}
      <div className="px-3 pt-2">
        <MiniResponsePanel label="A" title="Response" selected />
      </div>

      {/* Scoring dimensions */}
      <div className="mx-3 my-2 rounded-standard border border-level-2 bg-white p-2.5">
        <p className="font-inter text-[9px] font-medium text-ink mb-2">
          Scoring Dimensions
        </p>
        <div className="space-y-2">
          {dimensions.map((dim, i) => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <span className="font-inter text-[9px] font-medium text-ink">
                  {dim.name || `Dimension ${i + 1}`}
                </span>
                <span className="font-inter text-[8px] text-tertiary-text">
                  1-5
                </span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={cn(
                      "flex-1 h-2 rounded-full",
                      n <= 3 ? "bg-deep-teal/60" : "bg-level-2"
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function RankingPreview() {
  const count = 4;
  return (
    <div className="px-3 py-2 space-y-1.5">
      <span className="font-inter text-[9px] font-medium uppercase tracking-wide text-tertiary-text">
        Drag to rank — best to worst
      </span>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-2 rounded-standard border px-2.5 py-2",
            i === 0 ? "border-deep-teal bg-selected-bg" : "border-level-2 bg-white"
          )}
        >
          <span className="font-inter text-[10px] font-bold text-tertiary-text">
            {i + 1}.
          </span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-deep-teal/80 font-inter text-[8px] font-bold text-white">
            {String.fromCharCode(65 + i)}
          </span>
          <span className="font-inter text-[10px] text-ink">
            Response {String.fromCharCode(65 + i)}
          </span>
          <span className="ml-auto font-inter text-[8px] text-tertiary-text">
            ⠿
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnnotatorPreview({
  taskType,
  basicInfo,
  annotation,
}: AnnotatorPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  if (!taskType) return null;

  const taskName = basicInfo.name || "Untitled Task";

  return (
    <div className="rounded-comfortable border border-level-2 bg-level-1">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-deep-teal" />
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Annotator Preview
          </h3>
          <span className="font-inter text-[12px] text-tertiary-text">
            What annotators will see
          </span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 font-inter text-[12px] text-secondary-text hover:text-ink"
        >
          {expanded ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" />
              Collapse
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              Expand
            </>
          )}
        </button>
      </div>

      {/* Preview container */}
      <div
        className={cn(
          "mx-5 mb-5 overflow-hidden rounded-comfortable border border-level-2 bg-[#FFFEFE] transition-all",
          expanded ? "" : "max-h-[420px]"
        )}
      >
        {/* Mini task header */}
        <div className="flex items-center justify-between bg-deep-teal px-3 py-2">
          <div>
            <span className="font-inter text-[10px] font-bold tracking-wide text-white/70">
              DF DATAFORGE
            </span>
            <p className="font-inter text-[10px] text-white/60">{taskName}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-inter text-[10px] text-white/60">
              0 / —
            </span>
            <div className="flex items-center gap-1 text-white/60">
              <Timer className="h-3 w-3" />
              <span className="font-mono text-[10px]">0:00</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { icon: BookOpen, label: "Guidelines" },
              { icon: Flag, label: "Flag" },
              { icon: SkipForward, label: "Skip" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1 rounded-tight border border-white/30 px-1.5 py-0.5 font-inter text-[8px] text-white/70"
              >
                <Icon className="h-2.5 w-2.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Task type badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-level-2">
          <Badge
            variant={taskType.toLowerCase() as "pairwise"}
            animate={false}
          >
            {taskType}
          </Badge>
          {annotation.preferencePolarity === "pick-worse" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF2F2] px-2 py-0.5 font-inter text-[8px] text-error">
              <Shield className="h-2.5 w-2.5" />
              Red-teaming mode
            </span>
          )}
        </div>

        {/* Type-specific content */}
        {taskType === "Safety" && (
          <SafetyPreview annotation={annotation} />
        )}
        {taskType === "SFT" && <SFTPreview />}
        {taskType === "Editing" && <EditingPreview />}
        {taskType === "Rubric" && <RubricPreview annotation={annotation} />}
        {taskType === "Ranking" && <RankingPreview />}
        {(taskType === "Pairwise" || taskType === "Conversational") && (
          <PairwisePreview annotation={annotation} />
        )}
        {taskType === "Arena" && (
          <PairwisePreview annotation={annotation} isArena />
        )}

        {/* Submit bar */}
        <div className="border-t border-level-2 px-3 py-2">
          <div className="w-full rounded-standard bg-deep-teal py-1.5 text-center font-inter text-[10px] font-medium text-white">
            Submit → Enter
          </div>
        </div>
      </div>
    </div>
  );
}
