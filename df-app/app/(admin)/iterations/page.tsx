"use client";

import { motion } from "framer-motion";
import {
  ArrowUp,
  Quote,
  CheckCircle,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { useIterationStore } from "@/stores/iteration-store";
import type { Iteration } from "@/data/iteration-seed";

/* ------------------------------------------------------------------ */
/* Iteration timeline node                                             */
/* ------------------------------------------------------------------ */
function TimelineNode({
  iteration,
  isSelected,
  onSelect,
}: {
  iteration: Iteration;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isActive = iteration.status === "Active";
  const isComplete = iteration.status === "Complete";
  const isPlanned = iteration.status === "Planned";

  return (
    <button
      onClick={onSelect}
      className="group flex flex-col items-center gap-2"
    >
      {/* Node circle */}
      <div className="relative">
        {isActive && (
          <span className="absolute -inset-2 animate-pulse rounded-full bg-[#005151]/15" />
        )}
        <div
          className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
            isActive
              ? "h-10 w-10 border-[3px] border-[#005151] bg-[#005151] shadow-[0_0_12px_rgba(0,81,81,0.35)]"
              : isComplete
                ? "h-8 w-8 border-2 border-[#059669] bg-[#059669]"
                : "h-8 w-8 border-2 border-dashed border-[#9CA3AF] bg-white"
          } ${isSelected && !isActive ? "ring-2 ring-[#005151] ring-offset-2" : ""}`}
        >
          <span
            className={`font-inter text-[11px] font-bold ${
              isPlanned ? "text-[#9CA3AF]" : "text-white"
            }`}
          >
            {iteration.round}
          </span>
        </div>
      </div>

      {/* Label + badge */}
      <div className="flex flex-col items-center gap-1">
        <span
          className={`font-inter text-[12px] font-medium ${
            isSelected ? "text-ink" : "text-tertiary-text"
          }`}
        >
          Round {iteration.round}
        </span>
        <Badge
          variant={
            isComplete ? "success" : isActive ? "active" : "neutral"
          }
          dot
          animate={false}
        >
          {iteration.status}
        </Badge>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Data mix bar                                                        */
/* ------------------------------------------------------------------ */
function DataMixBar({
  mix,
}: {
  mix: { label: string; pct: number; color: string }[];
}) {
  return (
    <div className="mt-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {mix.map((seg) => (
          <motion.div
            key={seg.label}
            className="h-full"
            style={{ backgroundColor: seg.color }}
            initial={{ width: 0 }}
            animate={{ width: `${seg.pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex items-center gap-3">
        {mix.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: seg.color }}
            />
            <span className="font-inter text-[11px] text-tertiary-text">
              {seg.label} {seg.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                        */
/* ------------------------------------------------------------------ */
function ProgressBar({
  current,
  target,
  color = "#005151",
}: {
  current: number;
  target: number;
  color?: string;
}) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  return (
    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EBEEED]">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini gauge for RM accuracy                                          */
/* ------------------------------------------------------------------ */
function Gauge({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    value >= 75 ? "#059669" : value >= 60 ? "#D97706" : "#DC2626";
  return (
    <div className="relative mt-1.5 h-3 w-full overflow-hidden rounded-full bg-[#EBEEED]">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <span className="absolute inset-0 flex items-center justify-center font-inter text-[9px] font-semibold text-ink">
        {value}%
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail card section helper                                          */
/* ------------------------------------------------------------------ */
function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-comfortable border border-level-2 bg-white p-4">
      <h4 className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
        {title}
      </h4>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Comparison table row type                                           */
/* ------------------------------------------------------------------ */
type ComparisonRow = {
  round: number;
  duration: string;
  annotations: string;
  iaa: string;
  rmAccuracy: string;
  eloDelta: string;
  cost: string;
  keyChange: string;
} & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */
export default function IterationsPage() {
  const {
    iterations,
    selectedIterationId,
    selectIteration,
    getSelectedIteration,
  } = useIterationStore();

  const selected = getSelectedIteration();

  /* Table data ---------------------------------------------------- */
  const comparisonData: ComparisonRow[] = iterations.map((it) => ({
    round: it.round,
    duration: it.duration ?? "\u2014",
    annotations:
      it.status === "Planned"
        ? "\u2014"
        : it.collection.current.toLocaleString(),
    iaa:
      it.status === "Planned" ? "\u2014" : it.collection.iaa.toFixed(2),
    rmAccuracy:
      it.status === "Planned"
        ? "\u2014"
        : `${it.training.rmAccuracy}%`,
    eloDelta:
      it.evaluation.eloDelta == null
        ? "\u2014"
        : `+${it.evaluation.eloDelta}`,
    cost: it.cost != null ? `$${it.cost.toLocaleString()}` : "\u2014",
    keyChange: it.keyChange,
  }));

  /* Delta color helper -------------------------------------------- */
  function cellColor(
    round: number,
    field: "iaa" | "rmAccuracy" | "annotations",
  ): string {
    const idx = iterations.findIndex((i) => i.round === round);
    if (idx <= 0) return "";
    const cur = iterations[idx];
    const prev = iterations[idx - 1];
    if (cur.status === "Planned" || prev.status === "Planned") return "";

    let curVal: number;
    let prevVal: number;
    if (field === "iaa") {
      curVal = cur.collection.iaa;
      prevVal = prev.collection.iaa;
    } else if (field === "rmAccuracy") {
      curVal = cur.training.rmAccuracy;
      prevVal = prev.training.rmAccuracy;
    } else {
      curVal = cur.collection.current;
      prevVal = prev.collection.current;
    }
    if (curVal > prevVal) return "text-[#059669]";
    if (curVal < prevVal) return "text-[#DC2626]";
    return "";
  }

  const comparisonColumns: {
    key: string;
    header: string;
    className?: string;
    render?: (item: ComparisonRow) => React.ReactNode;
  }[] = [
    {
      key: "round",
      header: "Round",
      render: (item) => (
        <span className="font-medium text-ink">Round {item.round}</span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (item) => <span className="text-ink">{item.duration}</span>,
    },
    {
      key: "annotations",
      header: "Annotations",
      render: (item) => (
        <span
          className={`font-medium ${cellColor(item.round, "annotations")}`}
        >
          {item.annotations}
        </span>
      ),
    },
    {
      key: "iaa",
      header: "IAA",
      render: (item) => (
        <span className={`font-medium ${cellColor(item.round, "iaa")}`}>
          {item.iaa}
        </span>
      ),
    },
    {
      key: "rmAccuracy",
      header: "RM Accuracy",
      render: (item) => (
        <span
          className={`font-medium ${cellColor(item.round, "rmAccuracy")}`}
        >
          {item.rmAccuracy}
        </span>
      ),
    },
    {
      key: "eloDelta",
      header: "Elo Delta",
      render: (item) => (
        <span
          className={`font-medium ${
            item.eloDelta !== "\u2014" ? "text-[#059669]" : ""
          }`}
        >
          {item.eloDelta}
        </span>
      ),
    },
    {
      key: "cost",
      header: "Cost",
      render: (item) => <span className="text-ink">{item.cost}</span>,
    },
    {
      key: "keyChange",
      header: "Key Change",
      render: (item) => (
        <span className="text-tertiary-text">{item.keyChange}</span>
      ),
    },
  ];

  /* "What Worked" notes ------------------------------------------- */
  const allNotes = iterations
    .filter((it) => it.notes.length > 0)
    .flatMap((it) =>
      it.notes.map((note) => ({ round: it.round, text: note })),
    );

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <PageHeader
        title="Iterations"
        subtitle="Track strategy, models, cohorts, and outcomes across training iterations"
      />

      {/* ── Timeline ───────────────────────────────────────────── */}
      <div className="mt-6 rounded-comfortable border border-level-2 bg-white px-8 py-6">
        <div className="relative flex items-start justify-between">
          {/* Connecting line */}
          <div className="pointer-events-none absolute top-[19px] left-[5%] right-[5%] h-0.5 bg-[#EBEEED]" />

          {iterations.map((it) => (
            <TimelineNode
              key={it.id}
              iteration={it}
              isSelected={it.id === selectedIterationId}
              onSelect={() => selectIteration(it.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Selected Iteration Detail Card ─────────────────────── */}
      {selected && selected.status !== "Planned" && (
        <motion.div
          key={selected.id}
          className="mt-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="rounded-comfortable border border-level-2 bg-[#F7F8F8] p-5">
            <h3 className="mb-4 font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
              Round {selected.round} Detail
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {/* Strategy */}
              <DetailSection title="Strategy">
                <p className="font-inter text-[13px] text-ink">
                  {selected.strategy.label}
                </p>
                <DataMixBar mix={selected.strategy.mix} />
              </DetailSection>

              {/* Model */}
              <DetailSection title="Model">
                <div className="flex items-center gap-2">
                  <span className="font-inter text-[13px] font-medium text-ink">
                    {selected.model.name}
                  </span>
                  <Badge variant="success" dot animate={false}>
                    <ArrowUp className="mr-0.5 inline h-3 w-3" />
                    {selected.model.health}
                  </Badge>
                </div>
                <p className="mt-1.5 font-inter text-[12px] text-tertiary-text">
                  Temperature: {selected.model.temperature} &middot; Top-P:{" "}
                  {selected.model.topP}
                </p>
              </DetailSection>

              {/* Cohort */}
              <DetailSection title="Cohort">
                <p className="font-inter text-[13px] text-ink">
                  {selected.cohort.total} annotators &middot; Avg tier:{" "}
                  {selected.cohort.avgTier.toFixed(1)}
                </p>
                <p className="mt-1 font-inter text-[12px] text-tertiary-text">
                  {selected.cohort.returning} returning,{" "}
                  {selected.cohort.new} new
                </p>
                {selected.cohort.total > 0 && (
                  <ProgressBar
                    current={selected.cohort.returning}
                    target={selected.cohort.total}
                    color="#005151"
                  />
                )}
              </DetailSection>

              {/* Collection */}
              <DetailSection title="Collection">
                <p className="font-inter text-[13px] text-ink">
                  {selected.collection.current.toLocaleString()} /{" "}
                  {selected.collection.target.toLocaleString()} annotations
                  <span className="ml-1 text-tertiary-text">
                    (
                    {selected.collection.target > 0
                      ? Math.round(
                          (selected.collection.current /
                            selected.collection.target) *
                            100,
                        )
                      : 0}
                    %)
                  </span>
                </p>
                <ProgressBar
                  current={selected.collection.current}
                  target={selected.collection.target}
                />
                <p className="mt-1.5 font-inter text-[12px] text-tertiary-text">
                  IAA: {selected.collection.iaa.toFixed(2)} &middot; Gold:{" "}
                  {selected.collection.goldAcc}%
                </p>
              </DetailSection>

              {/* Training */}
              <DetailSection title="Training">
                <p className="font-inter text-[13px] text-ink">
                  RM Accuracy: {selected.training.rmAccuracy}%
                </p>
                <Gauge value={selected.training.rmAccuracy} />
                <p className="mt-1.5 font-inter text-[12px] text-tertiary-text">
                  Policy improvement:{" "}
                  {selected.training.policyImprovement > 0
                    ? `+${selected.training.policyImprovement}`
                    : selected.training.policyImprovement}
                  %
                </p>
              </DetailSection>

              {/* Evaluation */}
              <DetailSection title="Evaluation">
                <p className="font-inter text-[13px] text-ink">
                  Elo: {selected.evaluation.elo}
                  {selected.evaluation.eloDelta != null && (
                    <span className="ml-1 text-[#059669]">
                      (+{selected.evaluation.eloDelta})
                    </span>
                  )}
                </p>
                <p className="mt-1 font-inter text-[12px] text-tertiary-text">
                  False refusal: {selected.evaluation.falseRefusal}%
                </p>
                <div className="mt-1 flex items-center gap-1 font-inter text-[12px] text-tertiary-text">
                  Regression:{" "}
                  {selected.evaluation.regression ===
                    "None detected" ? (
                    <span className="flex items-center gap-1 text-[#059669]">
                      None detected{" "}
                      <CheckCircle className="inline h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span>{selected.evaluation.regression}</span>
                  )}
                </div>
              </DetailSection>
            </div>
          </div>
        </motion.div>
      )}

      {/* Planned state fallback */}
      {selected && selected.status === "Planned" && (
        <motion.div
          key={selected.id}
          className="mt-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="rounded-comfortable border border-dashed border-[#9CA3AF] bg-white p-8 text-center">
            <p className="font-inter text-[14px] text-tertiary-text">
              Round {selected.round} is planned. Details will appear once
              collection begins.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Iteration Comparison Table ─────────────────────────── */}
      <div className="mt-6">
        <div className="rounded-comfortable border border-level-2 bg-white">
          <div className="border-b border-level-2 px-5 py-4">
            <h3 className="font-inter text-[14px] font-semibold text-ink">
              Iteration Comparison
            </h3>
          </div>
          <DataTable<ComparisonRow>
            columns={comparisonColumns}
            data={comparisonData}
            keyExtractor={(item) => String(item.round)}
          />
        </div>
      </div>

      {/* ── "What Worked" Notes ─────────────────────────────────── */}
      {allNotes.length > 0 && (
        <div className="mt-6 mb-8">
          <div className="rounded-comfortable border border-level-2 bg-white p-5">
            <h3 className="mb-4 font-inter text-[14px] font-semibold text-ink">
              What Worked
            </h3>
            <div className="space-y-3">
              {allNotes.map((note, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-standard border border-level-2 bg-[#F7F8F8] p-4"
                >
                  <Quote className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#005151]" />
                  <div className="flex-1">
                    <p className="font-inter text-[13px] leading-[1.6] text-ink">
                      {note.text}
                    </p>
                  </div>
                  <Badge variant="neutral" animate={false}>
                    Round {note.round}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
