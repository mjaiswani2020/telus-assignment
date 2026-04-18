"use client";

import Link from "next/link";
import { Activity, GitBranch, BookOpen, Brain } from "lucide-react";
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
      <div className="stagger-children mt-4 grid grid-cols-4 gap-3">
        <StatCard
          label="Annotations"
          value={12847}
          trend={{ value: "14% WoW", direction: "up" }}
          className="p-4"
        />
        <StatCard
          label="Active Annotators"
          value={24}
          trend={{ value: "3 new", direction: "up" }}
          className="p-4"
        />
        <StatCard
          label="Avg IAA (AC2)"
          value="0.72"
          trend={{ value: "+0.03", direction: "up" }}
          className="p-4"
        />
        <StatCard
          label="Active Campaigns"
          value={3}
          trend={{ value: "7 rounds total", direction: "neutral" }}
          className="p-4"
        />
      </div>

      {/* Campaign Progress + Quality Alerts */}
      <div className="mt-4 grid grid-cols-[1fr_360px] gap-3">
        {/* Campaign Progress */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Campaign Progress
          </h3>
          <div className="mt-4 space-y-4">
            {campaigns.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-inter text-[13px] font-medium text-ink">
                    {c.name}
                  </span>
                  <span className="font-inter text-[13px] text-tertiary-text">
                    {c.percent}%
                  </span>
                </div>
                <ProgressBar value={c.current} max={c.total} color={c.color} size="sm" />
                <p className="mt-1 font-inter text-[11px] text-tertiary-text">
                  {c.current.toLocaleString()} / {c.total.toLocaleString()} annotations
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Alerts */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Quality Alerts
          </h3>
          <div className="mt-4 space-y-2.5">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={`rounded-standard border-l-4 ${alert.borderColor} ${alert.bg} px-3 py-2.5`}
              >
                <p className="font-inter text-[13px] font-medium text-ink">
                  {alert.title}
                </p>
                <p className="mt-0.5 font-inter text-[11px] text-tertiary-text">
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annotation Volume Chart */}
      <div className="mt-4">
        <AnnotationVolumeChart />
      </div>

      {/* Feedback Loop Health */}
      <div className="mt-6">
        <h3 className="font-literata text-[11px] font-semibold uppercase tracking-[0.08em] text-tertiary-text">
          Feedback Loop Health
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {/* Inner Loop */}
          <div className="flex flex-col rounded-[8px] border border-[#EBEEED] bg-white p-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-[10px] w-[10px] rounded-full bg-[#059669]" />
              <Activity className="h-4 w-4 text-[#005151]" />
            </div>
            <p className="mt-3 font-inter text-[14px] font-semibold text-ink">
              Annotator Quality Loop
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
              Active — 24 annotators receiving real-time feedback
            </p>
            <div className="mt-3 space-y-1.5">
              <p className="font-inter text-[12px] text-secondary-text">
                3 calibration nudges triggered today
              </p>
              <p className="font-inter text-[12px] text-secondary-text">
                Avg response to nudge: 12 min
              </p>
            </div>
          </div>

          {/* Calibration Loop */}
          <div className="flex flex-col rounded-[8px] border border-[#EBEEED] bg-white p-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-[10px] w-[10px] rounded-full bg-[#D97706]" />
              <GitBranch className="h-4 w-4 text-[#005151]" />
            </div>
            <p className="mt-3 font-inter text-[14px] font-semibold text-ink">
              Routing &amp; Calibration Loop
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
              2 routing adjustments this week
            </p>
            <div className="mt-3 space-y-1.5">
              <p className="font-inter text-[12px] text-secondary-text">
                4 annotators reassigned: safety &rarr; helpfulness
              </p>
              <p className="font-inter text-[12px] text-secondary-text">
                Avg calibration score: 87%
              </p>
            </div>
          </div>

          {/* Evolution Loop */}
          <div className="flex flex-col rounded-[8px] border border-[#EBEEED] bg-white p-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-[10px] w-[10px] rounded-full bg-[#059669]" />
              <BookOpen className="h-4 w-4 text-[#005151]" />
            </div>
            <p className="mt-3 font-inter text-[14px] font-semibold text-ink">
              Guideline Evolution Loop
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
              Guidelines v2.3 deployed 3 days ago
            </p>
            <div className="mt-3 space-y-1.5">
              <p className="font-inter text-[12px] text-secondary-text">
                Triggered by: 23% disagreement on borderline safety
              </p>
              <p className="font-inter text-[12px] text-secondary-text">
                Impact: disagreement dropped to 14%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Intelligence Summary */}
      <div className="mt-4 rounded-[8px] bg-[#F0F4F8] p-5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-[#005151]" />
          <h3 className="font-literata text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
            Platform Intelligence
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-6">
          <div>
            <p className="font-inter text-[14px] font-semibold text-ink">
              Signal Strength: 72%
            </p>
            <p className="mt-1 font-inter text-[12px] text-[#D97706]">
              (declining — 34% negligible comparisons)
            </p>
          </div>
          <div>
            <p className="font-inter text-[14px] font-semibold text-ink">
              Data Efficiency: 2.3x
            </p>
            <p className="mt-1 font-inter text-[12px] text-tertiary-text">
              improvement vs. random assignment
            </p>
          </div>
          <div>
            <p className="font-inter text-[14px] font-semibold text-ink">
              Iteration Readiness: 78%
            </p>
            <p className="mt-1 font-inter text-[12px] text-tertiary-text">
              Round 6 preparation
            </p>
            <Link
              href="/analytics"
              className="mt-1 inline-block font-inter text-[12px] font-medium text-[#005151] hover:underline"
            >
              See Playbook &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
