"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { usePromptStore } from "@/stores/prompt-store";

export default function PromptsPage() {
  const store = usePromptStore();

  return (
    <div>
      <PageHeader
        title="Prompts"
        subtitle="Prompt sourcing, coverage, and distribution management"
      />

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        <StatCard
          label="Total Prompts"
          value={store.totalPrompts}
          format="number"
        />
        <StatCard
          label="Human-Written"
          value={store.humanWritten}
          format="number"
          trend={{
            value: `${store.humanPercent}%`,
            direction: "up",
          }}
        />
        <StatCard
          label="Synthetic"
          value={store.synthetic}
          format="number"
          trend={{
            value: `${store.syntheticPercent}%`,
            direction: "neutral",
          }}
        />
        <StatCard
          label="Coverage Score"
          value={store.coverageScore}
          format="percent"
          trend={{
            value: "Gaps exist",
            direction: "neutral",
          }}
        />
      </div>

      {/* Topic Distribution */}
      <div className="mt-8">
        <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
          Topic Distribution
        </h2>
        <div className="mt-4 grid grid-cols-5 gap-3">
          {store.categories.map((cat) => (
            <div
              key={cat.name}
              className={`rounded-comfortable border-2 bg-white p-4 ${
                cat.meetsTarget
                  ? "border-[#059669]"
                  : "border-[#DC2626]"
              }`}
            >
              <h4 className="font-inter text-[13px] font-semibold text-ink">
                {cat.name}
              </h4>
              <p className="mt-2 font-literata text-[24px] font-semibold leading-[30px] text-ink">
                {cat.count.toLocaleString()}
              </p>
              <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
                {cat.percentage}% of total
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {cat.meetsTarget ? (
                  <CheckCircle className="h-3.5 w-3.5 text-[#059669]" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-[#DC2626]" />
                )}
                <span
                  className={`font-inter text-[11px] font-medium ${
                    cat.meetsTarget ? "text-[#059669]" : "text-[#DC2626]"
                  }`}
                >
                  Target: {cat.target}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Gap Alerts */}
      <div className="mt-8">
        <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
          Coverage Gap Alerts
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {store.gaps.map((gap) => (
            <div
              key={gap.category}
              className="rounded-comfortable border-2 border-[#D97706] bg-white p-4"
            >
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D97706]" />
                <div>
                  <p className="font-inter text-[14px] font-medium text-ink">
                    {gap.category} prompts at {gap.current}% (target: {gap.target}%)
                  </p>
                  <p className="mt-1 font-inter text-[13px] text-tertiary-text">
                    {gap.additional} additional prompts needed
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source & Quality */}
      <div className="mt-8">
        <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
          Source &amp; Quality
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Source Breakdown */}
          <div className="rounded-comfortable border border-level-2 bg-white">
            <div className="border-b border-level-2 px-5 py-4">
              <h3 className="font-inter text-[14px] font-semibold text-ink">
                Source Breakdown
              </h3>
            </div>
            <div className="divide-y divide-level-2">
              {store.sources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="font-inter text-[14px] text-ink">
                    {source.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-[14px] font-semibold text-ink">
                      {source.count.toLocaleString()}
                    </span>
                    <Badge variant="neutral">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Gate */}
          <div className="rounded-comfortable border border-level-2 bg-white">
            <div className="border-b border-level-2 px-5 py-4">
              <h3 className="font-inter text-[14px] font-semibold text-ink">
                Quality Gate
              </h3>
            </div>
            <div className="p-5 space-y-3">
              {store.quality.map((gate) => {
                const colorMap = {
                  success: {
                    bg: "bg-[#ECFDF5]",
                    border: "border-[#A7F3D0]",
                    text: "text-[#059669]",
                    bar: "bg-[#059669]",
                  },
                  caution: {
                    bg: "bg-[#FFF7ED]",
                    border: "border-[#FED7AA]",
                    text: "text-[#D97706]",
                    bar: "bg-[#D97706]",
                  },
                  error: {
                    bg: "bg-[#FEF2F2]",
                    border: "border-[#FECACA]",
                    text: "text-[#DC2626]",
                    bar: "bg-[#DC2626]",
                  },
                };
                const colors = colorMap[gate.variant];
                const pct = Math.round(
                  (gate.count / store.totalPrompts) * 100
                );

                return (
                  <div key={gate.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-inter text-[13px] font-medium text-ink">
                        {gate.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-inter text-[13px] font-semibold ${colors.text}`}>
                          {gate.count.toLocaleString()}
                        </span>
                        <Badge variant={gate.variant}>{pct}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-level-1">
                      <div
                        className={`h-2 rounded-full ${colors.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Diversity Score Trend */}
      <div className="mt-8 mb-8">
        <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
          Diversity Score Trend
        </h2>
        <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-5">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={store.trend}>
              <CartesianGrid
                strokeDasharray="0"
                stroke="#EBEEED"
                vertical={false}
              />
              <XAxis
                dataKey="iteration"
                tick={{ fontSize: 12, fill: "#6F7A77" }}
                axisLine={{ stroke: "#EBEEED" }}
                tickLine={false}
              />
              <YAxis
                domain={[50, 100]}
                tick={{ fontSize: 12, fill: "#6F7A77" }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 6,
                  border: "1px solid #EBEEED",
                  boxShadow: "none",
                }}
                formatter={(value) => [`${value}%`, "Diversity Score"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#005151"
                strokeWidth={2}
                dot={{ r: 4, fill: "#005151", strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  fill: "#005151",
                  strokeWidth: 2,
                  stroke: "#E6F2F2",
                }}
                name="Diversity Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
