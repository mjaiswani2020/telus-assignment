"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Info, AlertTriangle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";

/* ------------------------------------------------------------------ */
/* Near-Duplicate Detection data                                      */
/* ------------------------------------------------------------------ */

interface DuplicatePair {
  id: string;
  promptA: string;
  promptB: string;
  similarity: number;
  status: "Remove" | "Keep Both" | "Merge";
}

type DuplicateRow = DuplicatePair & Record<string, unknown>;

const duplicatePairs: DuplicatePair[] = [
  {
    id: "1",
    promptA: "Write a function that...",
    promptB: "Create a function to...",
    similarity: 0.97,
    status: "Remove",
  },
  {
    id: "2",
    promptA: "Explain quantum...",
    promptB: "Describe quantum...",
    similarity: 0.94,
    status: "Keep Both",
  },
  {
    id: "3",
    promptA: "What are the benefits...",
    promptB: "List the advantages...",
    similarity: 0.92,
    status: "Merge",
  },
  {
    id: "4",
    promptA: "How does machine...",
    promptB: "Explain how machine...",
    similarity: 0.96,
    status: "Remove",
  },
  {
    id: "5",
    promptA: "Compare Python and...",
    promptB: "Differences between...",
    similarity: 0.91,
    status: "Keep Both",
  },
];

/* ------------------------------------------------------------------ */
/* Cross-Batch Distribution data                                      */
/* ------------------------------------------------------------------ */

const distributionData = [
  { round: "R1", General: 30, Coding: 25, Safety: 20, Creative: 15, Other: 10 },
  { round: "R2", General: 28, Coding: 28, Safety: 22, Creative: 14, Other: 8 },
  { round: "R3", General: 25, Coding: 30, Safety: 20, Creative: 15, Other: 10 },
  { round: "R4", General: 20, Coding: 45, Safety: 15, Creative: 12, Other: 8 },
  { round: "R5", General: 22, Coding: 35, Safety: 18, Creative: 15, Other: 10 },
];

const categoryColors: Record<string, string> = {
  General: "#0D9488",
  Coding: "#2563EB",
  Safety: "#D97706",
  Creative: "#7C3AED",
  Other: "#9CA3AF",
};

const languageData = [
  { name: "English", value: 82, color: "#005151" },
  { name: "Spanish", value: 8, color: "#0D9488" },
  { name: "Mandarin", value: 5, color: "#2563EB" },
  { name: "Other", value: 5, color: "#9CA3AF" },
];

/* ------------------------------------------------------------------ */
/* Data Valuation data                                                */
/* ------------------------------------------------------------------ */

interface ValuationRow {
  id: string;
  category: string;
  marginalValue: "High" | "Medium" | "Low";
  rmGap: string;
  action: string;
}

type ValuationDataRow = ValuationRow & Record<string, unknown>;

const valuationData: ValuationRow[] = [
  { id: "1", category: "Safety", marginalValue: "High", rmGap: "8 pts below target", action: "Collect 500 more" },
  { id: "2", category: "Helpfulness", marginalValue: "Medium", rmGap: "3 pts below", action: "Maintain pace" },
  { id: "3", category: "Coding", marginalValue: "Low", rmGap: "At target", action: "No additional needed" },
  { id: "4", category: "Creative", marginalValue: "Medium", rmGap: "Limited samples", action: "Collect 200 more" },
];

const diminishingReturnsData = [
  { annotations: 0, Safety: 62, Helpfulness: 70, Coding: 78, Creative: 66 },
  { annotations: 100, Safety: 66, Helpfulness: 72, Coding: 79, Creative: 68 },
  { annotations: 200, Safety: 70, Helpfulness: 73.5, Coding: 79.5, Creative: 69.5 },
  { annotations: 300, Safety: 73.5, Helpfulness: 74.5, Coding: 79.8, Creative: 70.5 },
  { annotations: 400, Safety: 76, Helpfulness: 75.2, Coding: 80, Creative: 71.2 },
  { annotations: 500, Safety: 78, Helpfulness: 75.8, Coding: 80.1, Creative: 71.8 },
  { annotations: 600, Safety: 79.5, Helpfulness: 76.2, Coding: 80.15, Creative: 72.2 },
  { annotations: 700, Safety: 80.5, Helpfulness: 76.5, Coding: 80.2, Creative: 72.5 },
  { annotations: 800, Safety: 81.2, Helpfulness: 76.7, Coding: 80.22, Creative: 72.7 },
  { annotations: 900, Safety: 81.7, Helpfulness: 76.85, Coding: 80.24, Creative: 72.85 },
  { annotations: 1000, Safety: 82, Helpfulness: 77, Coding: 80.25, Creative: 73 },
];

const returnsCurves = [
  { key: "Safety", color: "#DC2626", name: "Safety" },
  { key: "Helpfulness", color: "#D97706", name: "Helpfulness" },
  { key: "Coding", color: "#059669", name: "Coding" },
  { key: "Creative", color: "#7C3AED", name: "Creative" },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function DataAnalysisPage() {
  const [threshold, setThreshold] = useState(0.95);

  // Calculate impact based on threshold
  const aboveThreshold = duplicatePairs.filter(
    (p) => p.similarity >= threshold
  ).length;
  const estimatedRemoval = Math.round(127 * (aboveThreshold / 5));
  const removalPercent = ((estimatedRemoval / 14200) * 100).toFixed(1);

  /* Duplicate detection columns */
  const duplicateColumns: {
    key: string;
    header: string;
    className?: string;
    render?: (item: DuplicateRow) => React.ReactNode;
  }[] = [
    {
      key: "promptA",
      header: "Prompt A",
      render: (item) => (
        <span className="font-inter text-body-md text-ink">
          &ldquo;{item.promptA}&rdquo;
        </span>
      ),
    },
    {
      key: "promptB",
      header: "Prompt B",
      render: (item) => (
        <span className="font-inter text-body-md text-ink">
          &ldquo;{item.promptB}&rdquo;
        </span>
      ),
    },
    {
      key: "similarity",
      header: "Similarity",
      render: (item) => (
        <span className="font-inter text-body-md font-medium text-ink">
          {(item.similarity as number).toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const variant =
          item.status === "Remove"
            ? "error"
            : item.status === "Keep Both"
              ? "success"
              : "caution";
        return <Badge variant={variant}>{item.status as string}</Badge>;
      },
    },
  ];

  /* Valuation columns */
  const valuationColumns: {
    key: string;
    header: string;
    className?: string;
    render?: (item: ValuationDataRow) => React.ReactNode;
  }[] = [
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <span className="font-medium text-ink">{item.category as string}</span>
      ),
    },
    {
      key: "marginalValue",
      header: "Marginal Value",
      render: (item) => {
        const variant =
          item.marginalValue === "High"
            ? "error"
            : item.marginalValue === "Medium"
              ? "caution"
              : "success";
        return <Badge variant={variant}>{item.marginalValue as string}</Badge>;
      },
    },
    {
      key: "rmGap",
      header: "RM Gap",
      render: (item) => (
        <span className="text-ink">{item.rmGap as string}</span>
      ),
    },
    {
      key: "action",
      header: "Recommended Action",
      render: (item) => (
        <span className="text-ink">{item.action as string}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Data Analysis"
        subtitle="Deduplication, distribution analysis, and data valuation"
      />

      <div className="stagger-children mt-6 space-y-8">
        {/* ============================================================ */}
        {/* Section 1: Near-Duplicate Detection                          */}
        {/* ============================================================ */}
        <div>
          <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
            Near-Duplicate Detection
          </h2>

          {/* Summary */}
          <div className="mt-4 flex items-center gap-2 rounded-comfortable border border-level-2 bg-white px-5 py-3">
            <Info className="h-4 w-4 shrink-0 text-[#2563EB]" />
            <span className="font-inter text-body-md text-ink">
              Potential Duplicates Found:{" "}
              <span className="font-semibold">
                127 pairs (0.9% of dataset)
              </span>
            </span>
          </div>

          {/* Table */}
          <div className="mt-4 rounded-comfortable border border-level-2 bg-white">
            <DataTable<DuplicateRow>
              columns={duplicateColumns}
              data={duplicatePairs as DuplicateRow[]}
              keyExtractor={(item) => item.id as string}
            />
          </div>

          {/* Threshold slider */}
          <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-5">
            <div className="flex items-center gap-4">
              <label className="shrink-0 font-inter text-body-md font-medium text-ink">
                Auto-deduplicate above:
              </label>
              <input
                type="range"
                min={90}
                max={99}
                value={Math.round(threshold * 100)}
                onChange={(e) => setThreshold(parseInt(e.target.value, 10) / 100)}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[#EBEEED] accent-[#005151]"
              />
              <span className="w-12 shrink-0 text-right font-inter text-body-md font-semibold text-ink">
                {threshold.toFixed(2)}
              </span>
            </div>
            <p className="mt-3 font-inter text-[13px] text-[#6F7A77]">
              Removing duplicates above {threshold.toFixed(2)} would reduce
              dataset by{" "}
              <span className="font-medium text-ink">
                {estimatedRemoval} items ({removalPercent}%)
              </span>
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Section 2: Distribution Analysis                             */}
        {/* ============================================================ */}
        <div>
          <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
            Distribution Analysis
          </h2>

          {/* Stacked bar chart */}
          <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-inter text-[14px] font-semibold text-ink">
                Cross-Batch Category Distribution
              </h3>
              <div className="flex items-center gap-4">
                {Object.entries(categoryColors).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-inter text-[12px] text-tertiary-text">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#EBEEED"
                  vertical={false}
                />
                <XAxis
                  dataKey="round"
                  tick={{ fontSize: 12, fill: "#6F7A77" }}
                  axisLine={{ stroke: "#EBEEED" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6F7A77" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #EBEEED",
                    boxShadow: "none",
                  }}
                  formatter={(value) => `${value}%`}
                />
                {Object.entries(categoryColors).map(([name, color]) => (
                  <Bar
                    key={name}
                    dataKey={name}
                    stackId="categories"
                    fill={color}
                    name={name}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alert card */}
          <div className="mt-4 flex items-start gap-2.5 rounded-comfortable border border-[#D97706] bg-[#FFF7ED] px-5 py-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#D97706]" />
            <p className="font-inter text-[14px] leading-relaxed text-ink">
              Round 4 has 45% coding prompts vs. 25% average &mdash; possible
              prompt sourcing bias
            </p>
          </div>

          {/* Language distribution pie chart */}
          <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-5">
            <h3 className="mb-4 font-inter text-[14px] font-semibold text-ink">
              Language Distribution
            </h3>
            <div className="flex items-center gap-8">
              <div className="w-[180px]">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {languageData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 6,
                        border: "1px solid #EBEEED",
                        boxShadow: "none",
                      }}
                      formatter={(value) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2">
                {languageData.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="font-inter text-body-md text-ink">
                      {lang.name}
                    </span>
                    <span className="font-inter text-body-md font-semibold text-ink">
                      {lang.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Section 3: Data Valuation                                    */}
        {/* ============================================================ */}
        <div className="mb-8">
          <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
            Data Valuation
          </h2>

          {/* Valuation table */}
          <div className="mt-4 rounded-comfortable border border-level-2 bg-white">
            <DataTable<ValuationDataRow>
              columns={valuationColumns}
              data={valuationData as ValuationDataRow[]}
              keyExtractor={(item) => item.id as string}
            />
          </div>

          {/* Recommendation card */}
          <div className="mt-4 rounded-comfortable border border-[#C4B5FD] bg-[#F5F3FF] p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#7C3AED]" />
              <p className="font-inter text-[14px] leading-relaxed text-ink">
                Collect 500 more safety annotations &mdash; estimated +2.4% RM
                accuracy improvement. Cost: ~$310
              </p>
            </div>
          </div>

          {/* Diminishing Returns chart */}
          <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-inter text-[14px] font-semibold text-ink">
                Diminishing Returns
              </h3>
              <div className="flex items-center gap-4">
                {returnsCurves.map((s) => (
                  <div key={s.key} className="flex items-center gap-1.5">
                    <span
                      className="h-0.5 w-4 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="font-inter text-[12px] text-tertiary-text">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={diminishingReturnsData}>
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#EBEEED"
                  vertical={false}
                />
                <XAxis
                  dataKey="annotations"
                  tick={{ fontSize: 12, fill: "#6F7A77" }}
                  axisLine={{ stroke: "#EBEEED" }}
                  tickLine={false}
                  label={{
                    value: "Additional Annotations",
                    position: "insideBottom",
                    offset: -5,
                    style: { fontSize: 12, fill: "#6F7A77" },
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6F7A77" }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                  domain={[60, 85]}
                  tickFormatter={(v: number) => `${v}%`}
                  label={{
                    value: "RM Accuracy",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fontSize: 12, fill: "#6F7A77" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #EBEEED",
                    boxShadow: "none",
                  }}
                  formatter={(value) => `${value}%`}
                  labelFormatter={(label) =>
                    `+${label} annotations`
                  }
                />
                {returnsCurves.map((s) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                    name={s.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
