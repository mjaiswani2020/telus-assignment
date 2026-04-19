"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
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
import { ProgressBar } from "@/components/ui/progress-bar";
import { useModelStore } from "@/stores/model-store";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import type { ModelEndpoint } from "@/data/seed";

/* ------------------------------------------------------------------ */
/*  Detail Panel — shown when a model row is clicked                   */
/* ------------------------------------------------------------------ */
function ModelDetailPanel({
  endpoint,
  onClose,
}: {
  endpoint: ModelEndpoint;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"config" | "ab" | "swap" | "latency">("config");
  const config = useModelStore((s) => s.deploymentConfig);
  const abTest = useModelStore((s) => s.abTest);
  const scheduledSwap = useModelStore((s) => s.scheduledSwap);
  const swapHistory = useModelStore((s) => s.swapHistory);
  const latencyPercentiles = useModelStore((s) => s.latencyPercentiles);
  const cache = useModelStore((s) => s.cacheMetrics);
  const { toast } = useToast();

  const isInABTest =
    abTest.modelA.toLowerCase().includes(endpoint.name.toLowerCase().split("-")[0]) ||
    abTest.modelB.toLowerCase().includes(endpoint.name.toLowerCase().split("-")[0]);

  const tabs = [
    { key: "config" as const, label: "Configuration", icon: Cpu },
    { key: "ab" as const, label: "A/B Testing", icon: ArrowRightLeft },
    { key: "swap" as const, label: "Hot-Swap", icon: CalendarClock },
    { key: "latency" as const, label: "Latency & Cache", icon: Clock },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="mt-3 rounded-comfortable border border-[#005151]/30 bg-white shadow-sm"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-level-2 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F2F2]">
            <Cpu className="h-4 w-4 text-[#005151]" />
          </div>
          <div>
            <h3 className="font-inter text-[15px] font-semibold text-ink">
              {endpoint.name}
            </h3>
            <p className="font-inter text-[12px] text-tertiary-text">
              {endpoint.provider} &middot; {endpoint.version}
            </p>
          </div>
          <Badge
            variant={
              endpoint.health === "Up"
                ? "success"
                : endpoint.health === "Slow"
                  ? "caution"
                  : "error"
            }
            dot
          >
            {endpoint.health}
          </Badge>
        </div>
        <button
          onClick={onClose}
          className="rounded-standard p-1.5 text-tertiary-text transition-colors hover:bg-level-1 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-level-2 px-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-inter text-[13px] transition-colors",
                activeTab === tab.key
                  ? "border-[#005151] font-medium text-[#005151]"
                  : "border-transparent text-tertiary-text hover:text-secondary-text"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === "config" && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
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
        )}

        {activeTab === "ab" && (
          <div>
            {isInABTest ? (
              <>
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

                <div className="mt-4">
                  <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                    Traffic Split
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="w-24 font-inter text-[12px] font-medium text-[#005151]">
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
                    <span className="w-24 text-right font-inter text-[12px] font-medium text-[#D97706]">
                      {abTest.modelB}
                    </span>
                  </div>
                </div>

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
                          className={
                            i < abTest.metrics.length - 1
                              ? "border-b border-level-2"
                              : ""
                          }
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
              </>
            ) : (
              <div className="py-8 text-center">
                <ArrowRightLeft className="mx-auto h-8 w-8 text-tertiary-text" />
                <p className="mt-2 font-inter text-body-md text-tertiary-text">
                  This model is not currently in an A/B test.
                </p>
                <Button
                  size="compact"
                  className="mt-3"
                  onClick={() => toast("A/B test creation coming soon", "info")}
                >
                  Start A/B Test
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "swap" && (
          <div className="space-y-5">
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

            <div>
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Swap History
              </label>
              <div className="mt-2 space-y-0">
                {swapHistory.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
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
                        <span className="text-tertiary-text">
                          ({entry.type})
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
        )}

        {activeTab === "latency" && (
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={latencyPercentiles.map((ep) => ({
                    name: ep.endpointName,
                    p50: ep.p50,
                    p95: ep.p95,
                    p99: ep.p99,
                  }))}
                  barCategoryGap="20%"
                >
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

            <div className="col-span-2 flex flex-col gap-3">
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
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function ModelsPage() {
  const endpoints = useModelStore((s) => s.endpoints);
  const selectedEndpointId = useModelStore((s) => s.selectedEndpointId);
  const selectEndpoint = useModelStore((s) => s.selectEndpoint);
  const { toast } = useToast();

  const selectedEndpoint = endpoints.find((e) => e.id === selectedEndpointId);

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

      {/* Model table */}
      <div className="stagger-children mt-4 overflow-hidden rounded-comfortable border border-level-2 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-level-2 bg-level-1">
              {["Name", "Provider", "Version", "Health", "Tasks", "Latency"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {endpoints.map((ep) => {
              const isSelected = ep.id === selectedEndpointId;
              return (
                <tr
                  key={ep.id}
                  onClick={() =>
                    selectEndpoint(isSelected ? null : ep.id)
                  }
                  className={cn(
                    "cursor-pointer border-b border-level-2 transition-colors last:border-b-0",
                    isSelected
                      ? "bg-[#E6F2F2]"
                      : "hover:bg-level-1"
                  )}
                >
                  <td className="px-4 py-3 font-inter text-body-md font-medium text-ink">
                    {ep.name}
                  </td>
                  <td className="px-4 py-3 font-inter text-body-md text-secondary-text">
                    {ep.provider}
                  </td>
                  <td className="px-4 py-3 font-mono text-code-sm text-ink">
                    {ep.version}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        ep.health === "Up"
                          ? "success"
                          : ep.health === "Slow"
                            ? "caution"
                            : "error"
                      }
                      dot
                    >
                      {ep.health}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-inter text-body-md text-ink">
                    {ep.activeTasks}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 font-inter text-body-md",
                      ep.latencyMs > 1000
                        ? "font-medium text-error"
                        : "text-ink"
                    )}
                  >
                    {ep.latencyMs.toLocaleString()}ms
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail panel — only shown when a model is selected */}
      <AnimatePresence>
        {selectedEndpoint && (
          <ModelDetailPanel
            key={selectedEndpoint.id}
            endpoint={selectedEndpoint}
            onClose={() => selectEndpoint(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
