"use client";

import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AnnotationVolumeChart } from "@/components/charts/annotation-volume-chart";

const campaigns = [
  {
    name: "Alignment v2 — Round 3",
    current: 8231,
    total: 11500,
    percent: 72,
    color: "bg-deep-teal",
  },
  {
    name: "Safety Track — Round 5",
    current: 2104,
    total: 5500,
    percent: 38,
    color: "bg-caution",
  },
  {
    name: "Arena Eval — Batch 2",
    current: 2512,
    total: 2800,
    percent: 89,
    color: "bg-deep-teal",
  },
];

const alerts = [
  {
    title: "Annotator #14 gold accuracy dropped",
    description: "Below threshold: 0.58 < 0.60",
    borderColor: "border-l-[#D97706]",
    bg: "bg-[#FFFBEB]",
  },
  {
    title: "Safety Eval v2 IAA below threshold",
    description: "Current: 0.58 — Target: 0.65",
    borderColor: "border-l-[#F472B6]",
    bg: "bg-[#FDF2F8]",
  },
  {
    title: "23 flagged annotations pending",
    description: "Review queue needs attention",
    borderColor: "border-l-[#2563EB]",
    bg: "bg-[#EFF6FF]",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Last 7 days" />

      {/* KPI Cards */}
      <div className="stagger-children mt-6 grid grid-cols-4 gap-4">
        <StatCard
          label="Annotations"
          value={12847}
          trend={{ value: "14% WoW", direction: "up" }}
        />
        <StatCard
          label="Active Annotators"
          value={24}
          trend={{ value: "3 new", direction: "up" }}
        />
        <StatCard
          label="Avg IAA (AC2)"
          value="0.72"
          trend={{ value: "+0.03", direction: "up" }}
        />
        <StatCard
          label="Active Campaigns"
          value={3}
          trend={{ value: "7 rounds total", direction: "neutral" }}
        />
      </div>

      {/* Campaign Progress + Quality Alerts */}
      <div className="mt-6 grid grid-cols-[1fr_380px] gap-4">
        {/* Campaign Progress */}
        <div className="rounded-comfortable border border-level-2 bg-white p-6">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Campaign Progress
          </h3>
          <div className="mt-5 space-y-6">
            {campaigns.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-inter text-body-md font-medium text-ink">
                    {c.name}
                  </span>
                  <span className="font-inter text-body-md text-tertiary-text">
                    {c.percent}%
                  </span>
                </div>
                <ProgressBar value={c.current} max={c.total} color={c.color} size="md" />
                <p className="mt-1.5 font-inter text-[12px] text-tertiary-text">
                  {c.current.toLocaleString()} / {c.total.toLocaleString()} annotations
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Alerts */}
        <div className="rounded-comfortable border border-level-2 bg-white p-6">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Quality Alerts
          </h3>
          <div className="mt-5 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={`rounded-standard border-l-4 ${alert.borderColor} ${alert.bg} p-4`}
              >
                <p className="font-inter text-body-md font-medium text-ink">
                  {alert.title}
                </p>
                <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annotation Volume Chart */}
      <div className="mt-6">
        <AnnotationVolumeChart />
      </div>
    </div>
  );
}
