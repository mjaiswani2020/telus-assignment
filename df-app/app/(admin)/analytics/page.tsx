"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CheckCircle, AlertTriangle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import {
  iterationMetrics,
  signalDegradation,
  metricToggleOptions,
  playbookRecommendations,
  type IterationMetricKey,
  type IterationMetric,
} from "@/data/iteration-analytics";

// --- Mock IAA trend data ---
const iaaData = [
  { week: "W1", helpfulness: 0.64, safety: 0.60, overall: 0.62 },
  { week: "W2", helpfulness: 0.66, safety: 0.63, overall: 0.65 },
  { week: "W3", helpfulness: 0.69, safety: 0.66, overall: 0.68 },
  { week: "W4", helpfulness: 0.71, safety: 0.68, overall: 0.70 },
  { week: "W5", helpfulness: 0.72, safety: 0.69, overall: 0.71 },
  { week: "W6", helpfulness: 0.74, safety: 0.71, overall: 0.73 },
  { week: "W7", helpfulness: 0.76, safety: 0.72, overall: 0.74 },
  { week: "W8", helpfulness: 0.78, safety: 0.74, overall: 0.76 },
  { week: "W9", helpfulness: 0.79, safety: 0.73, overall: 0.76 },
  { week: "W10", helpfulness: 0.81, safety: 0.75, overall: 0.78 },
  { week: "W11", helpfulness: 0.82, safety: 0.76, overall: 0.79 },
  { week: "W12", helpfulness: 0.83, safety: 0.77, overall: 0.80 },
];

const series = [
  { key: "helpfulness", color: "#005151", name: "Helpfulness" },
  { key: "safety", color: "#D97706", name: "Safety" },
  { key: "overall", color: "#2563EB", name: "Overall" },
];

// --- Mock annotator performance ---
interface AnnotatorPerf {
  id: string;
  name: string;
  goldAcc: number;
  peerIaa: number;
  tasksPerHr: number;
  status: "On Track" | "Warning" | "At Risk";
}

type PerfRow = AnnotatorPerf & Record<string, unknown>;

const annotatorPerf: AnnotatorPerf[] = [
  { id: "1", name: "Priya M.", goldAcc: 93, peerIaa: 0.86, tasksPerHr: 12.4, status: "On Track" },
  { id: "2", name: "Sarah K.", goldAcc: 91, peerIaa: 0.84, tasksPerHr: 11.2, status: "On Track" },
  { id: "3", name: "Rachel Q.", goldAcc: 92, peerIaa: 0.85, tasksPerHr: 10.8, status: "On Track" },
  { id: "4", name: "Li W.", goldAcc: 90, peerIaa: 0.83, tasksPerHr: 10.1, status: "On Track" },
  { id: "5", name: "Elena R.", goldAcc: 89, peerIaa: 0.82, tasksPerHr: 9.8, status: "On Track" },
  { id: "6", name: "Marcus T.", goldAcc: 82, peerIaa: 0.76, tasksPerHr: 7.6, status: "Warning" },
  { id: "7", name: "Alex C.", goldAcc: 58, peerIaa: 0.61, tasksPerHr: 4.2, status: "At Risk" },
  { id: "8", name: "Hannah J.", goldAcc: 62, peerIaa: 0.63, tasksPerHr: 5.1, status: "At Risk" },
];

// --- Bias detection cards ---
const biasCards = [
  {
    title: "Position Bias",
    description: "Response A chosen 52.3% vs Response B 47.7%",
    status: "ok" as const,
    statusText: "Within normal",
  },
  {
    title: "Length Bias",
    description: "Longer responses preferred 58.2% of the time",
    status: "warn" as const,
    statusText: "Investigate",
  },
  {
    title: "Model Bias",
    description: "Llama-3-70B preferred 51.8% vs GPT-4 48.2%",
    status: "ok" as const,
    statusText: "Within normal",
  },
];

const projectOptions = [
  { value: "all", label: "All Projects" },
  { value: "helpfulness", label: "Helpfulness Track" },
  { value: "safety", label: "Safety Track" },
  { value: "code", label: "Code Evaluation" },
];

const dateOptions = [
  { value: "12w", label: "Last 12 Weeks" },
  { value: "4w", label: "Last 4 Weeks" },
  { value: "8w", label: "Last 8 Weeks" },
];

// --- Cross-iteration comparison helpers ---
type IterationRow = IterationMetric & Record<string, unknown>;

function getDelta(current: number, previous: number | undefined): 'up' | 'down' | 'same' {
  if (previous === undefined) return 'same';
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'same';
}

function deltaColor(dir: 'up' | 'down' | 'same', inverted = false): string {
  if (dir === 'same') return '';
  if (inverted) return dir === 'up' ? 'text-error' : 'text-success';
  return dir === 'up' ? 'text-success' : 'text-error';
}

export default function AnalyticsPage() {
  const [project, setProject] = useState("all");
  const [dateRange, setDateRange] = useState("12w");
  const [selectedMetric, setSelectedMetric] = useState<IterationMetricKey>("rmAccuracy");

  const perfColumns: { key: string; header: string; className?: string; render?: (item: PerfRow) => React.ReactNode }[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => (
        <span className="font-medium text-ink">{item.name}</span>
      ),
    },
    {
      key: "goldAcc",
      header: "Gold Acc",
      render: (item) => {
        const color =
          item.goldAcc >= 75
            ? "text-success"
            : item.goldAcc >= 60
              ? "text-caution"
              : "text-error";
        return <span className={`font-medium ${color}`}>{item.goldAcc}%</span>;
      },
    },
    {
      key: "peerIaa",
      header: "Peer IAA",
      render: (item) => (
        <span className="text-ink">{item.peerIaa.toFixed(2)}</span>
      ),
    },
    {
      key: "tasksPerHr",
      header: "Tasks/Hr",
      render: (item) => (
        <span className="text-ink">{item.tasksPerHr.toFixed(1)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const variant =
          item.status === "On Track"
            ? "success"
            : item.status === "Warning"
              ? "caution"
              : "error";
        return (
          <Badge variant={variant} dot>
            {item.status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quality Dashboard"
        action={
          <div className="flex items-center gap-3">
            <Select
              options={projectOptions}
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-48"
            />
            <Select
              options={dateOptions}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-40"
            />
          </div>
        }
      />

      {/* IAA Trend Chart */}
      <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Inter-Annotator Agreement Trend
          </h3>
          <div className="flex items-center gap-4">
            {series.map((s) => (
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
          <LineChart data={iaaData}>
            <CartesianGrid
              strokeDasharray="0"
              stroke="#EBEEED"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: "#6F7A77" }}
              axisLine={{ stroke: "#EBEEED" }}
              tickLine={false}
            />
            <YAxis
              domain={[0.5, 1.0]}
              tick={{ fontSize: 12, fill: "#6F7A77" }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(v: number) => v.toFixed(2)}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #EBEEED",
                boxShadow: "none",
              }}
              formatter={(value) => typeof value === "number" ? value.toFixed(2) : String(value)}
            />
            <ReferenceLine
              y={0.8}
              stroke="#059669"
              strokeDasharray="6 4"
              label={{
                value: "Target",
                position: "insideTopRight",
                fill: "#059669",
                fontSize: 11,
              }}
            />
            <ReferenceLine
              y={0.65}
              stroke="#DC2626"
              strokeDasharray="6 4"
              label={{
                value: "Threshold",
                position: "insideTopRight",
                fill: "#DC2626",
                fontSize: 11,
              }}
            />
            {series.map((s) => (
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

      {/* Annotator Performance Table */}
      <div className="mt-4">
        <div className="rounded-comfortable border border-level-2 bg-white">
          <div className="border-b border-level-2 px-5 py-4">
            <h3 className="font-inter text-[14px] font-semibold text-ink">
              Annotator Performance
            </h3>
          </div>
          <DataTable<PerfRow>
            columns={perfColumns}
            data={annotatorPerf as PerfRow[]}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* Bias Detection */}
      <div className="mt-4">
        <h3 className="mb-4 font-inter text-[14px] font-semibold text-ink">
          Bias Detection
        </h3>
        <div className="stagger-children grid grid-cols-3 gap-3">
          {biasCards.map((card) => (
            <div
              key={card.title}
              className="rounded-comfortable border border-level-2 bg-white p-4"
            >
              <h4 className="font-inter text-[14px] font-medium text-ink">
                {card.title}
              </h4>
              <p className="mt-1 font-inter text-[13px] text-tertiary-text">
                {card.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {card.status === "ok" ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-caution" />
                )}
                <span
                  className={`font-inter text-label-md ${
                    card.status === "ok" ? "text-success" : "text-caution"
                  }`}
                >
                  {card.statusText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================== */}
      {/* Section 1: Cross-Iteration Comparison                              */}
      {/* ================================================================== */}
      <div className="mt-8">
        <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
          Cross-Iteration Comparison
        </h2>

        {/* Metric toggle + LineChart */}
        <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {metricToggleOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedMetric(opt.key)}
                className={`rounded-tight border px-3 py-1.5 font-inter text-label-sm transition-colors ${
                  selectedMetric === opt.key
                    ? "border-[#005151] bg-[#E6F2F2] text-[#005151]"
                    : "border-level-2 bg-white text-tertiary-text hover:border-[#005151] hover:text-[#005151]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={iterationMetrics}>
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
                width={50}
                domain={
                  selectedMetric === "iaa"
                    ? [0.5, 1.0]
                    : selectedMetric === "costPerAnnotation"
                      ? [0, 1]
                      : ["auto", "auto"]
                }
                tickFormatter={(v: number) =>
                  selectedMetric === "iaa"
                    ? v.toFixed(2)
                    : selectedMetric === "costPerAnnotation"
                      ? `$${v.toFixed(2)}`
                      : String(v)
                }
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 6,
                  border: "1px solid #EBEEED",
                  boxShadow: "none",
                }}
                formatter={(value) => {
                  const v = typeof value === "number" ? value : Number(value);
                  if (selectedMetric === "iaa") return v.toFixed(2);
                  if (selectedMetric === "costPerAnnotation") return `$${v.toFixed(2)}`;
                  if (selectedMetric === "rmAccuracy" || selectedMetric === "goldAccuracy") return `${v}%`;
                  return v.toLocaleString();
                }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#005151"
                strokeWidth={2}
                dot={{ r: 4, fill: "#005151", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#005151", strokeWidth: 2, stroke: "#E6F2F2" }}
                name={metricToggleOptions.find((o) => o.key === selectedMetric)?.label}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison table */}
        <div className="mt-4 rounded-comfortable border border-level-2 bg-white">
          <div className="border-b border-level-2 px-5 py-4">
            <h3 className="font-inter text-[14px] font-semibold text-ink">
              Round-over-Round Comparison
            </h3>
          </div>
          <DataTable<IterationRow>
            columns={(() => {
              const cols: { key: string; header: string; className?: string; render?: (item: IterationRow) => React.ReactNode }[] = [
                {
                  key: "round",
                  header: "Round",
                  render: (item) => (
                    <span className="font-medium text-ink">{item.round}</span>
                  ),
                },
                {
                  key: "duration",
                  header: "Duration",
                  render: (item) => (
                    <span className="text-ink">{item.duration}</span>
                  ),
                },
                {
                  key: "annotations",
                  header: "Annotations",
                  render: (item) => {
                    const idx = iterationMetrics.findIndex((m) => m.round === item.round);
                    const prev = idx > 0 ? iterationMetrics[idx - 1].annotations : undefined;
                    const dir = getDelta(item.annotations, prev);
                    return (
                      <span className={`font-medium ${deltaColor(dir)}`}>
                        {item.annotations.toLocaleString()}
                      </span>
                    );
                  },
                },
                {
                  key: "iaa",
                  header: "IAA",
                  render: (item) => {
                    const idx = iterationMetrics.findIndex((m) => m.round === item.round);
                    const prev = idx > 0 ? iterationMetrics[idx - 1].iaa : undefined;
                    const dir = getDelta(item.iaa, prev);
                    return (
                      <span className={`font-medium ${deltaColor(dir)}`}>
                        {item.iaa.toFixed(2)}
                      </span>
                    );
                  },
                },
                {
                  key: "rmAccuracy",
                  header: "RM Accuracy",
                  render: (item) => {
                    const idx = iterationMetrics.findIndex((m) => m.round === item.round);
                    const prev = idx > 0 ? iterationMetrics[idx - 1].rmAccuracy : undefined;
                    const dir = getDelta(item.rmAccuracy, prev);
                    return (
                      <span className={`font-medium ${deltaColor(dir)}`}>
                        {item.rmAccuracy}%
                      </span>
                    );
                  },
                },
                {
                  key: "goldAccuracy",
                  header: "Gold Accuracy",
                  render: (item) => {
                    const idx = iterationMetrics.findIndex((m) => m.round === item.round);
                    const prev = idx > 0 ? iterationMetrics[idx - 1].goldAccuracy : undefined;
                    const dir = getDelta(item.goldAccuracy, prev);
                    return (
                      <span className={`font-medium ${deltaColor(dir)}`}>
                        {item.goldAccuracy}%
                      </span>
                    );
                  },
                },
                {
                  key: "keyChange",
                  header: "Key Change",
                  render: (item) => (
                    <span className="text-tertiary-text">{item.keyChange}</span>
                  ),
                },
              ];
              return cols;
            })()}
            data={iterationMetrics as IterationRow[]}
            keyExtractor={(item) => item.round}
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* Section 2: Preference Signal Degradation Monitor                   */}
      {/* ================================================================== */}
      <div className="mt-8">
        <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
          Signal Strength Monitor
        </h2>

        {/* Stacked AreaChart */}
        <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-inter text-[14px] font-semibold text-ink">
              Preference Margin Distribution
            </h3>
            <div className="flex items-center gap-4">
              {[
                { label: "Significantly Better", color: "#005151" },
                { label: "Better", color: "#0D9488" },
                { label: "Slightly Better", color: "#5EEAD4" },
                { label: "Negligible", color: "#9CA3AF" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="font-inter text-[12px] text-tertiary-text">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={signalDegradation}>
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
              <Area
                type="monotone"
                dataKey="significantlyBetter"
                stackId="1"
                stroke="#005151"
                fill="#005151"
                name="Significantly Better"
              />
              <Area
                type="monotone"
                dataKey="better"
                stackId="1"
                stroke="#0D9488"
                fill="#0D9488"
                name="Better"
              />
              <Area
                type="monotone"
                dataKey="slightlyBetter"
                stackId="1"
                stroke="#5EEAD4"
                fill="#5EEAD4"
                name="Slightly Better"
              />
              <Area
                type="monotone"
                dataKey="negligible"
                stackId="1"
                stroke="#9CA3AF"
                fill="#9CA3AF"
                name="Negligible"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Signal degradation alert */}
        <div className="mt-4 rounded-comfortable border border-level-2 border-l-4 border-l-caution bg-white p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-caution" />
            <div>
              <p className="font-inter text-[14px] font-medium text-ink">
                Signal strength declining &mdash; 34% of comparisons now rated
                &lsquo;negligibly better&rsquo;, up from 12% in Round 1.
              </p>
              <p className="mt-2 font-inter text-[13px] text-tertiary-text">
                Consider: increasing response temperature diversity, adding
                harder prompts, or switching to rubric scoring for subtle
                distinctions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Section 3: Iteration Playbook Recommendation                       */}
      {/* ================================================================== */}
      <div className="mt-8 mb-8">
        <div className="rounded-comfortable border border-[#C4B5FD] bg-[#F5F3FF] p-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="font-literata text-[16px] font-semibold text-[#5B21B6]">
              Recommended Strategy for Round 6
            </h2>
          </div>

          <ul className="mt-4 space-y-3">
            {playbookRecommendations.map((rec, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#DDD6FE] font-inter text-[11px] font-semibold text-[#5B21B6]">
                  {i + 1}
                </span>
                <span className="font-inter text-[14px] leading-[1.5] text-ink">
                  {rec}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <button
              onClick={() => {/* mock */}}
              className="rounded-standard bg-[#005151] px-5 py-2.5 font-inter text-[14px] font-medium text-white transition-colors hover:bg-[#003D3D]"
            >
              Apply to Next Iteration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
