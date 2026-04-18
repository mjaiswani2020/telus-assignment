"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  Cpu,
  ArrowRightLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useModelStore } from "@/stores/model-store";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { fadeSlideUp } from "@/lib/animations";
import type { ModelEndpoint } from "@/data/seed";

type Row = ModelEndpoint & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/*  Section 1 — Deployment Configuration                              */
/* ------------------------------------------------------------------ */
function DeploymentConfigSection() {
  const [expanded, setExpanded] = useState(true);
  const config = useModelStore((s) => s.deploymentConfig);
  const endpoints = useModelStore((s) => s.endpoints);
  const endpointName = endpoints[0]?.name ?? "Endpoint";

  return (
    <motion.div
      className="rounded-comfortable border border-level-2 bg-white"
      variants={fadeSlideUp}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#005151]" />
          <h3 className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-text">
            Deployment Configuration
          </h3>
          <span className="font-inter text-[12px] text-tertiary-text">
            — {endpointName}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-tertiary-text" />
        ) : (
          <ChevronDown className="h-4 w-4 text-tertiary-text" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-level-2 px-5 pb-5 pt-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {/* Temperature */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Temperature
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={config.temperature}
                  readOnly
                  className="h-2 flex-1 cursor-default appearance-none rounded-full bg-level-2 accent-[#005151] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#005151]"
                />
                <span className="w-10 text-right font-mono text-code-sm text-ink">
                  {config.temperature.toFixed(1)}
                </span>
              </div>
              <span className="font-inter text-[11px] text-tertiary-text">
                Range: 0.0 — 2.0
              </span>
            </div>

            {/* Top-P */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Top-P
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.topP}
                  readOnly
                  className="h-2 flex-1 cursor-default appearance-none rounded-full bg-level-2 accent-[#005151] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#005151]"
                />
                <span className="w-10 text-right font-mono text-code-sm text-ink">
                  {config.topP.toFixed(2)}
                </span>
              </div>
              <span className="font-inter text-[11px] text-tertiary-text">
                Range: 0.0 — 1.0
              </span>
            </div>

            {/* Max Tokens */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Max Tokens
              </label>
              <input
                type="number"
                value={config.maxTokens}
                readOnly
                className="h-10 rounded-standard border border-level-2 bg-level-1 px-3 font-mono text-code-sm text-ink"
              />
            </div>

            {/* Response Pairs */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Response Pairs
              </label>
              <div className="flex items-center gap-2">
                {([2, 4, 6] as const).map((n) => (
                  <label
                    key={n}
                    className={cn(
                      "flex h-10 w-14 cursor-default items-center justify-center rounded-standard border font-inter text-body-md transition-colors",
                      config.responsePairs === n
                        ? "border-[#005151] bg-[#E6F2F2] font-medium text-[#005151]"
                        : "border-level-2 bg-level-1 text-secondary-text"
                    )}
                  >
                    {n}
                  </label>
                ))}
              </div>
            </div>

            {/* GPU Allocation */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                GPU Allocation
              </label>
              <div className="flex items-center gap-3">
                <span className="font-mono text-code-sm text-ink">
                  {config.gpuAllocation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ProgressBar
                  value={config.gpuUtilization}
                  max={100}
                  color={
                    config.gpuUtilization > 85
                      ? "bg-error"
                      : config.gpuUtilization > 60
                        ? "bg-caution"
                        : "bg-success"
                  }
                  size="sm"
                  className="flex-1"
                />
                <span className="font-inter text-[12px] text-secondary-text">
                  {config.gpuUtilization}% utilized
                </span>
              </div>
            </div>

            {/* System Prompt */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                System Prompt
              </label>
              <textarea
                readOnly
                value={config.systemPrompt}
                className="min-h-[80px] resize-none rounded-standard border border-level-2 bg-level-1 px-3 py-2.5 font-inter text-[13px] leading-[1.5] text-tertiary-text"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 2 — A/B Testing                                           */
/* ------------------------------------------------------------------ */
function ABTestingSection() {
  const abTest = useModelStore((s) => s.abTest);
  const { toast } = useToast();

  return (
    <motion.div
      className="rounded-comfortable border border-level-2 bg-white"
      variants={fadeSlideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-[#005151]" />
          <h3 className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-text">
            Model A/B Testing
          </h3>
        </div>
      </div>

      <div className="border-t border-level-2 px-5 pb-5 pt-4">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="success" dot>
              {abTest.status}
            </Badge>
            <span className="font-inter text-body-md font-medium text-ink">
              {abTest.name}
            </span>
          </div>
          <span className="font-inter text-[12px] text-tertiary-text">
            Running for {abTest.runningDays} days
          </span>
        </div>

        {/* Split ratio */}
        <div className="mt-4">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Traffic Split
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="w-20 font-inter text-[12px] font-medium text-[#005151]">
              {abTest.modelA}
            </span>
            <div className="flex h-6 flex-1 overflow-hidden rounded-tight">
              <div
                className="flex items-center justify-center bg-[#005151] text-[11px] font-medium text-white"
                style={{ width: `${abTest.splitA}%` }}
              >
                {abTest.splitA}%
              </div>
              <div
                className="flex items-center justify-center bg-[#D97706] text-[11px] font-medium text-white"
                style={{ width: `${abTest.splitB}%` }}
              >
                {abTest.splitB}%
              </div>
            </div>
            <span className="w-20 text-right font-inter text-[12px] font-medium text-[#D97706]">
              {abTest.modelB}
            </span>
          </div>
        </div>

        {/* Metrics comparison mini-table */}
        <div className="mt-4 overflow-hidden rounded-standard border border-level-2">
          <table className="w-full">
            <thead>
              <tr className="bg-level-1">
                <th className="px-4 py-2 text-left font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                  Metric
                </th>
                <th className="px-4 py-2 text-right font-inter text-label-sm uppercase tracking-[0.5px] text-[#005151]">
                  {abTest.modelA}
                </th>
                <th className="px-4 py-2 text-right font-inter text-label-sm uppercase tracking-[0.5px] text-[#D97706]">
                  {abTest.modelB}
                </th>
              </tr>
            </thead>
            <tbody>
              {abTest.metrics.map((m, i) => (
                <tr
                  key={m.label}
                  className={i < abTest.metrics.length - 1 ? "border-b border-level-2" : ""}
                >
                  <td className="px-4 py-2.5 font-inter text-body-md text-ink">
                    {m.label}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-code-sm text-ink">
                    {m.modelA}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-code-sm text-ink">
                    {m.modelB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end">
          <Button
            variant="ghost"
            size="compact"
            className="text-error hover:bg-[#FEF2F2] hover:text-error"
            onClick={() => toast("A/B test stopped", "info")}
          >
            Stop Test
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 3 — Hot-Swap Workflow                                     */
/* ------------------------------------------------------------------ */
function HotSwapSection() {
  const scheduledSwap = useModelStore((s) => s.scheduledSwap);
  const swapHistory = useModelStore((s) => s.swapHistory);
  const { toast } = useToast();

  return (
    <motion.div
      className="rounded-comfortable border border-level-2 bg-white"
      variants={fadeSlideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-[#005151]" />
          <h3 className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-text">
            Model Hot-Swap
          </h3>
        </div>
      </div>

      <div className="border-t border-level-2 px-5 pb-5 pt-4 space-y-5">
        {/* Scheduled swap card */}
        <div className="rounded-standard border border-[#FED7AA] bg-[#FFF7ED] p-4">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-[#D97706]" />
            <div>
              <p className="font-inter text-body-md font-medium text-ink">
                Swap {scheduledSwap.from} → {scheduledSwap.to} on{" "}
                {scheduledSwap.scheduledAt}
              </p>
              <p className="mt-1 font-inter text-[12px] text-secondary-text">
                Active sessions at swap: ~{scheduledSwap.activeSessions}{" "}
                annotators — sessions will complete on current model
              </p>
            </div>
          </div>
        </div>

        {/* Swap history timeline */}
        <div>
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Swap History
          </label>
          <div className="mt-2 space-y-0">
            {swapHistory.map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669]" />
                  {i < swapHistory.length - 1 && (
                    <div className="h-6 w-px bg-level-2" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="font-inter text-body-md text-ink">
                    <span className="font-medium">{entry.date}:</span>{" "}
                    {entry.from} → {entry.to}{" "}
                    <span className="text-tertiary-text">({entry.type})</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-end">
          <Button
            size="compact"
            icon={<Clock className="h-4 w-4" />}
            onClick={() => toast("Swap scheduling coming soon", "info")}
          >
            Schedule Swap
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 4 — Latency & Caching                                     */
/* ------------------------------------------------------------------ */
function LatencyCachingSection() {
  const latencyPercentiles = useModelStore((s) => s.latencyPercentiles);
  const cache = useModelStore((s) => s.cacheMetrics);

  const chartData = latencyPercentiles.map((ep) => ({
    name: ep.endpointName,
    p50: ep.p50,
    p95: ep.p95,
    p99: ep.p99,
  }));

  return (
    <motion.div
      className="rounded-comfortable border border-level-2 bg-white"
      variants={fadeSlideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#005151]" />
          <h3 className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-text">
            Latency &amp; Caching
          </h3>
        </div>
      </div>

      <div className="border-t border-level-2 px-5 pb-5 pt-4">
        <div className="grid grid-cols-5 gap-6">
          {/* Left — Bar chart (3 cols) */}
          <div className="col-span-3">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#EBEEED"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6F7A77" }}
                  axisLine={{ stroke: "#EBEEED" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6F7A77" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                  unit="s"
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #EBEEED",
                    boxShadow: "none",
                  }}
                  formatter={(value) => [`${value}s`]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: "#6F7A77" }}
                />
                <Bar
                  dataKey="p50"
                  name="p50"
                  fill="#059669"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="p95"
                  name="p95"
                  fill="#D97706"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="p99"
                  name="p99"
                  fill="#DC2626"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right — 4 metric cards stacked (2 cols) */}
          <div className="col-span-2 flex flex-col gap-3">
            {/* Cache Hit Rate */}
            <div className="rounded-standard border border-level-2 bg-level-1 p-3.5">
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                Cache Hit Rate
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="font-literata text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-ink">
                  {cache.hitRate}%
                </span>
                <span className="flex items-center gap-0.5 pb-0.5 text-[12px] font-medium text-[#059669]">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +3%
                </span>
              </div>
            </div>

            {/* Avg Wait Time */}
            <div className="rounded-standard border border-level-2 bg-level-1 p-3.5">
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                Avg Wait Time
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="font-literata text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-ink">
                  {cache.avgWaitTime}s
                </span>
                <span className="flex items-center gap-0.5 pb-0.5 text-[12px] font-medium text-[#D97706]">
                  <TrendingDown className="h-3.5 w-3.5" />
                  +0.4s
                </span>
              </div>
            </div>

            {/* Pre-generated */}
            <div className="rounded-standard border border-level-2 bg-level-1 p-3.5">
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                Pre-generated
              </p>
              <div className="mt-1">
                <span className="font-literata text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-ink">
                  {cache.preGenerated} pairs
                </span>
              </div>
            </div>

            {/* Pending Queue */}
            <div className="rounded-standard border border-level-2 bg-level-1 p-3.5">
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                Pending Queue
              </p>
              <div className="mt-1">
                <span className="font-literata text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-ink">
                  {cache.pendingQueue} pairs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */
export default function ModelsPage() {
  const endpoints = useModelStore((s) => s.endpoints);
  const { toast } = useToast();

  const columns: { key: string; header: string; className?: string; render?: (item: Row) => React.ReactNode }[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => (
        <span className="font-medium text-ink">{item.name}</span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      render: (item) => (
        <span className="text-secondary-text">{item.provider}</span>
      ),
    },
    {
      key: "version",
      header: "Version",
      render: (item) => (
        <span className="font-mono text-code-sm">{item.version}</span>
      ),
    },
    {
      key: "health",
      header: "Health",
      render: (item) => {
        const variant =
          item.health === "Up"
            ? "success"
            : item.health === "Slow"
              ? "caution"
              : "error";
        return (
          <Badge variant={variant} dot>
            {item.health}
          </Badge>
        );
      },
    },
    {
      key: "activeTasks",
      header: "Tasks",
      render: (item) => <span>{item.activeTasks}</span>,
    },
    {
      key: "latencyMs",
      header: "Latency",
      render: (item) => (
        <span className={item.latencyMs > 1000 ? "font-medium text-error" : "text-ink"}>
          {item.latencyMs.toLocaleString()}ms
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Model Endpoints"
        action={
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => toast("Endpoint creation coming soon", "info")}
          >
            Add Endpoint
          </Button>
        }
      />

      <div className="stagger-children mt-4 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Row>
          columns={columns}
          data={endpoints as Row[]}
          keyExtractor={(item) => item.id}
        />
      </div>

      {/* --- New sections below existing table --- */}
      <div className="mt-6 space-y-6">
        <DeploymentConfigSection />
        <ABTestingSection />
        <HotSwapSection />
        <LatencyCachingSection />
      </div>
    </div>
  );
}
