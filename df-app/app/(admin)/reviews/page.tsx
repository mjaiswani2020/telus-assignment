"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useReviewStore } from "@/stores/review-store";
import type { ReviewItem } from "@/data/seed";

type Row = ReviewItem & Record<string, unknown>;

// --- Unit 17: QA Reviewer Calibration data ---
interface ReviewerPerf {
  id: string;
  name: string;
  reviewsPerDay: number;
  agreement: number;
  overturnRate: number;
  avgTime: string;
  calibrationNeeded: boolean;
}

type ReviewerRow = ReviewerPerf & Record<string, unknown>;

const reviewerPerfData: ReviewerPerf[] = [
  { id: "r1", name: "Sarah C.", reviewsPerDay: 45, agreement: 91, overturnRate: 3, avgTime: "2.1 min", calibrationNeeded: false },
  { id: "r2", name: "James K.", reviewsPerDay: 32, agreement: 84, overturnRate: 8, avgTime: "3.4 min", calibrationNeeded: true },
  { id: "r3", name: "Maria L.", reviewsPerDay: 38, agreement: 89, overturnRate: 5, avgTime: "2.8 min", calibrationNeeded: false },
  { id: "r4", name: "David W.", reviewsPerDay: 28, agreement: 76, overturnRate: 12, avgTime: "4.2 min", calibrationNeeded: true },
];

// --- Unit 17: Rejection cost data ---
const rejectionReasons = [
  { reason: "Insufficient justification", percent: 34 },
  { reason: "Gold standard failure", percent: 28 },
  { reason: "Time violation", percent: 22 },
  { reason: "Off-topic", percent: 16 },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `${Math.floor(diff / 60_000)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type TabId = "all" | "flagged" | "auto" | "escalated";

/* ---------- Auto-check dot indicator ---------- */
function AutoCheckDots({ checks }: { checks: ReviewItem["autoChecks"] }) {
  const labels = [
    { key: "gold" as const, label: "Gold" },
    { key: "time" as const, label: "Time" },
    { key: "iaa" as const, label: "IAA" },
    { key: "consistency" as const, label: "Consistency" },
  ];
  return (
    <div className="flex items-center gap-1.5">
      {labels.map(({ key, label }) => (
        <span
          key={key}
          title={`${label}: ${checks[key] ? "Passed" : "Failed"}`}
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            checks[key] ? "bg-[#059669]" : "bg-[#DC2626]"
          }`}
        />
      ))}
    </div>
  );
}

/* ---------- Confidence display ---------- */
function ConfidenceCell({ value }: { value: number }) {
  const color =
    value >= 70
      ? "text-[#059669]"
      : value >= 50
        ? "text-[#D97706]"
        : "text-[#DC2626]";
  return <span className={`font-inter text-body-md font-medium ${color}`}>{value}%</span>;
}

export default function ReviewsPage() {
  const items = useReviewStore((s) => s.items);
  const counts = useReviewStore((s) => s.getQueueCounts)();
  const pipeline = useReviewStore((s) => s.getPipelineCounts)();
  const autoSummary = useReviewStore((s) => s.getAutoScreeningSummary)();
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const tabs = [
    { id: "all", label: "All", count: counts.total },
    { id: "flagged", label: "Flagged", count: counts.flaggedByAnnotator },
    { id: "auto", label: "Rule-flagged", count: counts.autoFlagged },
    { id: "escalated", label: "Escalated", count: counts.escalated },
  ];

  const filtered = useMemo(() => {
    const pending = items.filter((i) => i.status === "Flagged" || i.status === "Escalated");
    switch (activeTab) {
      case "flagged":
        return pending.filter((i) => i.source === "Annotator");
      case "auto":
        return pending.filter((i) => i.source === "Auto");
      case "escalated":
        return pending.filter((i) => i.status === "Escalated");
      default:
        return pending;
    }
  }, [items, activeTab]);

  const columns: { key: string; header: string; className?: string; render?: (item: Row) => React.ReactNode }[] = [
    {
      key: "title",
      header: "Reason",
      render: (item) => (
        <span className="font-medium text-ink">{item.title}</span>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      render: (item) => (
        <Badge variant={item.tier === "escalated" ? "error" : "caution"}>
          {item.tier === "escalated" ? "Escalated" : "Human Review"}
        </Badge>
      ),
    },
    {
      key: "source",
      header: "Source",
      render: (item) => (
        <Badge variant={item.source === "Annotator" ? "flagged" : "caution"}>
          {item.source === "Annotator" ? "Flagged" : "Rule"}
        </Badge>
      ),
    },
    {
      key: "autoChecks",
      header: "Quality Checks",
      render: (item) => <AutoCheckDots checks={item.autoChecks} />,
    },
    {
      key: "confidence",
      header: "Confidence",
      render: (item) => <ConfidenceCell value={item.confidence} />,
    },
    {
      key: "taskType",
      header: "Task Type",
      render: (item) => {
        const variant = item.taskType.toLowerCase() as
          | "pairwise"
          | "safety"
          | "sft"
          | "rubric"
          | "arena";
        return <Badge variant={variant}>{item.taskType}</Badge>;
      },
    },
    {
      key: "flaggedAt",
      header: "Time",
      render: (item) => (
        <span className="text-tertiary-text">{timeAgo(item.flaggedAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <Link href={`/reviews/${item.id}`}>
          <Button variant="secondary" size="sm">
            Review
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Review Queue" />

      {/* ── Pipeline Overview ── */}
      <motion.div
        className="mt-4 rounded-comfortable border border-level-2 bg-white p-5"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <p className="mb-4 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Review Pipeline
        </p>
        <div className="flex items-center justify-between gap-2">
          {/* Auto-Screened */}
          <div className="flex-1 rounded-comfortable bg-[#ECFDF5] border border-[#A7F3D0] p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#059669]" />
              <span className="font-inter text-label-sm uppercase tracking-[0.5px] text-[#059669] font-medium">
                Quality Checks Passed
              </span>
            </div>
            <p className="mt-2 font-literata text-[28px] font-semibold leading-[34px] tracking-[-0.02em] text-[#059669]">
              {pipeline.autoScreened.toLocaleString()}
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-[#059669]/70">today</p>
          </div>

          {/* Arrow 1 */}
          <div className="flex flex-col items-center gap-0.5 px-1">
            <span className="font-inter text-[11px] font-medium text-tertiary-text whitespace-nowrap">
              {pipeline.routedToHuman} routed
            </span>
            <ArrowRight className="h-5 w-5 text-tertiary-text" />
          </div>

          {/* Human Review */}
          <div className="flex-1 rounded-comfortable bg-[#FFF7ED] border border-[#FED7AA] p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#D97706]" />
              <span className="font-inter text-label-sm uppercase tracking-[0.5px] text-[#D97706] font-medium">
                Human Review
              </span>
            </div>
            <p className="mt-2 font-literata text-[28px] font-semibold leading-[34px] tracking-[-0.02em] text-[#D97706]">
              {pipeline.humanReview}
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-[#D97706]/70">pending</p>
          </div>

          {/* Arrow 2 */}
          <div className="flex flex-col items-center gap-0.5 px-1">
            <span className="font-inter text-[11px] font-medium text-tertiary-text whitespace-nowrap">
              {pipeline.routedToEscalation} escalated
            </span>
            <ArrowRight className="h-5 w-5 text-tertiary-text" />
          </div>

          {/* Escalated */}
          <div className="flex-1 rounded-comfortable bg-[#FEF2F2] border border-[#FECACA] p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#DC2626]" />
              <span className="font-inter text-label-sm uppercase tracking-[0.5px] text-[#DC2626] font-medium">
                Escalated
              </span>
            </div>
            <p className="mt-2 font-literata text-[28px] font-semibold leading-[34px] tracking-[-0.02em] text-[#DC2626]">
              {pipeline.escalated}
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-[#DC2626]/70">items</p>
          </div>
        </div>
      </motion.div>

      {/* ── Auto-Screening Summary ── */}
      <motion.div
        className="mt-3 rounded-comfortable border border-level-2 bg-white p-5"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <p className="mb-3 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Quality Check Results (Today)
        </p>
        <div className="grid grid-cols-4 gap-3">
          <div className="flex items-center gap-3 rounded-standard bg-level-1 px-3 py-2.5">
            <ShieldAlert className="h-4 w-4 text-[#DC2626] shrink-0" />
            <div>
              <p className="font-inter text-[11px] text-tertiary-text">Gold Failures</p>
              <p className="font-inter text-body-md font-semibold text-ink">{autoSummary.goldFailures}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-standard bg-level-1 px-3 py-2.5">
            <Clock className="h-4 w-4 text-[#D97706] shrink-0" />
            <div>
              <p className="font-inter text-[11px] text-tertiary-text">Time Violations</p>
              <p className="font-inter text-body-md font-semibold text-ink">{autoSummary.timeViolations}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-standard bg-level-1 px-3 py-2.5">
            <Users className="h-4 w-4 text-[#D97706] shrink-0" />
            <div>
              <p className="font-inter text-[11px] text-tertiary-text">IAA Outliers</p>
              <p className="font-inter text-body-md font-semibold text-ink">{autoSummary.iaaOutliers}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-standard bg-level-1 px-3 py-2.5">
            <Sparkles className="h-4 w-4 text-[#059669] shrink-0" />
            <div>
              <p className="font-inter text-[11px] text-tertiary-text">Checks Passed</p>
              <p className="font-inter text-body-md font-semibold text-[#059669]">{autoSummary.autoApproved.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="stagger-children mt-4 grid grid-cols-4 gap-3">
        <StatCard label="Pending" value={counts.total} />
        <StatCard label="Flagged" value={counts.flaggedByAnnotator} />
        <StatCard label="Rule-flagged" value={counts.autoFlagged} />
        <StatCard label="Resolved Today" value={counts.resolvedToday} />
      </div>

      {/* ── Tabs ── */}
      <div className="mt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
          variant="underline"
        />
      </div>

      {/* ── Review Table ── */}
      <div className="stagger-children mt-4 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Row>
          columns={columns}
          data={filtered as Row[]}
          keyExtractor={(item) => item.id}
        />
      </div>

      {/* ================================================================== */}
      {/* Unit 17: QA Reviewer Calibration                                   */}
      {/* ================================================================== */}
      <div className="mt-8">
        <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
          Reviewer Performance
        </h2>

        <div className="mt-4 rounded-comfortable border border-level-2 bg-white">
          <DataTable<ReviewerRow>
            columns={[
              {
                key: "name",
                header: "Reviewer",
                render: (item) => (
                  <span className="font-medium text-ink">{item.name}</span>
                ),
              },
              {
                key: "reviewsPerDay",
                header: "Reviews/Day",
                render: (item) => (
                  <span className="text-ink">{item.reviewsPerDay}</span>
                ),
              },
              {
                key: "agreement",
                header: "Agreement",
                render: (item) => {
                  const color =
                    item.agreement >= 90
                      ? "text-[#059669]"
                      : item.agreement >= 85
                        ? "text-[#D97706]"
                        : "text-[#DC2626]";
                  return <span className={`font-medium ${color}`}>{item.agreement}%</span>;
                },
              },
              {
                key: "overturnRate",
                header: "Overturn Rate",
                render: (item) => {
                  const color =
                    item.overturnRate <= 5
                      ? "text-[#059669]"
                      : item.overturnRate <= 8
                        ? "text-[#D97706]"
                        : "text-[#DC2626]";
                  return <span className={`font-medium ${color}`}>{item.overturnRate}%</span>;
                },
              },
              {
                key: "avgTime",
                header: "Avg Time",
                render: (item) => (
                  <span className="text-ink">{item.avgTime}</span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (item) =>
                  item.calibrationNeeded ? (
                    <Badge variant="caution">Calibration needed</Badge>
                  ) : (
                    <span className="text-tertiary-text">&mdash;</span>
                  ),
              },
            ]}
            data={reviewerPerfData as ReviewerRow[]}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* Unit 17: Rejection Cost Dashboard                                  */}
      {/* ================================================================== */}
      <div className="mt-8 mb-8">
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h2 className="font-literata text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
            Rejection Costs (30D)
          </h2>

          {/* 4 metrics row */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            <div className="rounded-standard bg-[#F7F8F8] border border-[#EBEEED] px-4 py-3">
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                Rejection Rate
              </p>
              <p className="mt-1 font-literata text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-ink">
                12%
              </p>
            </div>
            <div className="rounded-standard bg-[#F7F8F8] border border-[#EBEEED] px-4 py-3">
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                Estimated Wasted Cost
              </p>
              <p className="mt-1 font-literata text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-[#DC2626]">
                $3,840
              </p>
            </div>
            <div className="rounded-standard bg-[#F7F8F8] border border-[#EBEEED] px-4 py-3">
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                Avg Rejections/Annotator
              </p>
              <p className="mt-1 font-literata text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-ink">
                4.2
              </p>
            </div>
            <div className="rounded-standard bg-[#F7F8F8] border border-[#EBEEED] px-4 py-3">
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                Salvage Rate
              </p>
              <p className="mt-1 font-literata text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-ink">
                34%
              </p>
            </div>
          </div>

          {/* Top rejection reasons - horizontal bar chart */}
          <div className="mt-5">
            <p className="mb-3 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
              Top Rejection Reasons
            </p>
            <div className="space-y-3">
              {rejectionReasons.map((r) => (
                <div key={r.reason} className="flex items-center gap-3">
                  <span className="w-48 shrink-0 font-inter text-[13px] text-ink">
                    {r.reason}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-6 flex-1 rounded-sm bg-[#F7F8F8]">
                      <div
                        className="h-full rounded-sm bg-[#005151]"
                        style={{ width: `${r.percent}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-inter text-[13px] font-medium text-ink">
                      {r.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
