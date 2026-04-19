"use client";

import { Plus, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/toast";

interface ActiveExperiment {
  id: string;
  experiment: string;
  variantA: string;
  variantB: string;
  aAnnotations: number;
  bAnnotations: number;
  aMetric: string;
  bMetric: string;
  significance: "significant" | "insufficient";
  [key: string]: unknown;
}

interface CompletedExperiment {
  id: string;
  experiment: string;
  winner: string;
  resultSummary: string;
  completed: string;
  [key: string]: unknown;
}

const activeExperiments: ActiveExperiment[] = [
  {
    id: "exp-1",
    experiment: "Binary vs. 4-point scale",
    variantA: "Binary (better/worse)",
    variantB: "4-point strength scale",
    aAnnotations: 120,
    bAnnotations: 118,
    aMetric: "IAA: 0.71",
    bMetric: "IAA: 0.68",
    significance: "significant",
  },
  {
    id: "exp-2",
    experiment: "Safer vs. more harmful (red-team)",
    variantA: "Choose safer response",
    variantB: "Choose more harmful",
    aAnnotations: 80,
    bAnnotations: 75,
    aMetric: "Confusion: 12%",
    bMetric: "Confusion: 34%",
    significance: "insufficient",
  },
];

const completedExperiments: CompletedExperiment[] = [
  {
    id: "exp-c1",
    experiment: "Per-turn vs. final preference (chat)",
    winner: "Per-turn",
    resultSummary: "Per-turn pref. improved IAA by 8%",
    completed: "Mar 28, 2026",
  },
  {
    id: "exp-c2",
    experiment: "Justification required vs. optional",
    winner: "Required",
    resultSummary: "Required justification reduced review rejections by 23%",
    completed: "Mar 15, 2026",
  },
];

const activeColumns = [
  {
    key: "experiment",
    header: "Experiment",
    render: (item: ActiveExperiment) => (
      <span className="font-inter text-body-md font-medium text-ink">
        {item.experiment}
      </span>
    ),
  },
  {
    key: "variantA",
    header: "Variant A",
    render: (item: ActiveExperiment) => (
      <span className="font-inter text-body-md text-secondary-text">
        {item.variantA}
      </span>
    ),
  },
  {
    key: "variantB",
    header: "Variant B",
    render: (item: ActiveExperiment) => (
      <span className="font-inter text-body-md text-secondary-text">
        {item.variantB}
      </span>
    ),
  },
  {
    key: "aAnnotations",
    header: "A Annotations",
    render: (item: ActiveExperiment) => (
      <span className="font-inter text-body-md text-ink">
        {item.aAnnotations}
      </span>
    ),
  },
  {
    key: "bAnnotations",
    header: "B Annotations",
    render: (item: ActiveExperiment) => (
      <span className="font-inter text-body-md text-ink">
        {item.bAnnotations}
      </span>
    ),
  },
  {
    key: "aMetric",
    header: "A Metric",
    render: (item: ActiveExperiment) => (
      <span className="font-inter text-body-md font-medium text-ink">
        {item.aMetric}
      </span>
    ),
  },
  {
    key: "bMetric",
    header: "B Metric",
    render: (item: ActiveExperiment) => (
      <span className="font-inter text-body-md font-medium text-ink">
        {item.bMetric}
      </span>
    ),
  },
  {
    key: "significance",
    header: "Significance",
    render: (item: ActiveExperiment) =>
      item.significance === "significant" ? (
        <span className="inline-flex items-center gap-1.5 font-inter text-label-sm font-medium text-[#059669]">
          <CheckCircle2 className="h-4 w-4" />
          Significant
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 font-inter text-label-sm font-medium text-secondary-text">
          <Clock className="h-4 w-4" />
          Insufficient data
        </span>
      ),
  },
];

const completedColumns = [
  {
    key: "experiment",
    header: "Experiment",
    render: (item: CompletedExperiment) => (
      <span className="font-inter text-body-md font-medium text-ink">
        {item.experiment}
      </span>
    ),
  },
  {
    key: "winner",
    header: "Winner",
    render: (item: CompletedExperiment) => (
      <span className="inline-flex items-center gap-1 font-inter text-body-md font-medium text-[#059669]">
        {item.winner} &#10003;
      </span>
    ),
  },
  {
    key: "resultSummary",
    header: "Result Summary",
    render: (item: CompletedExperiment) => (
      <span className="font-inter text-body-md text-secondary-text">
        {item.resultSummary}
      </span>
    ),
  },
  {
    key: "completed",
    header: "Completed",
    render: (item: CompletedExperiment) => (
      <span className="font-inter text-body-md text-secondary-text">
        {item.completed}
      </span>
    ),
  },
];

export default function ExperimentsPage() {
  const { toast } = useToast();

  return (
    <div>
      <PageHeader
        title="Task Experiments"
        action={
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => toast("New experiment wizard coming soon", "info")}
          >
            New Experiment
          </Button>
        }
      />

      {/* Active Experiments */}
      <div className="mt-6">
        <h2 className="mb-3 font-literata text-title-lg font-semibold text-ink">
          Active Experiments
        </h2>
        <div className="rounded-comfortable border border-level-2 bg-white">
          <DataTable<ActiveExperiment & Record<string, unknown>>
            columns={
              activeColumns as {
                key: string;
                header: string;
                className?: string;
                render?: (
                  item: ActiveExperiment & Record<string, unknown>
                ) => React.ReactNode;
              }[]
            }
            data={activeExperiments as (ActiveExperiment & Record<string, unknown>)[]}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* Completed Experiments */}
      <div className="mt-8">
        <h2 className="mb-3 font-literata text-title-lg font-semibold text-ink">
          Completed Experiments
        </h2>
        <div className="rounded-comfortable border border-level-2 bg-white">
          <DataTable<CompletedExperiment & Record<string, unknown>>
            columns={
              completedColumns as {
                key: string;
                header: string;
                className?: string;
                render?: (
                  item: CompletedExperiment & Record<string, unknown>
                ) => React.ReactNode;
              }[]
            }
            data={
              completedExperiments as (CompletedExperiment &
                Record<string, unknown>)[]
            }
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>
    </div>
  );
}
