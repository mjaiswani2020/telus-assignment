"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useReviewStore } from "@/stores/review-store";
import type { ReviewItem } from "@/data/seed";

type Row = ReviewItem & Record<string, unknown>;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `${Math.floor(diff / 60_000)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type TabId = "all" | "flagged" | "auto" | "escalated";

export default function ReviewsPage() {
  const items = useReviewStore((s) => s.items);
  const counts = useReviewStore((s) => s.getQueueCounts)();
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const tabs = [
    { id: "all", label: "All", count: counts.total },
    { id: "flagged", label: "Flagged", count: counts.flaggedByAnnotator },
    { id: "auto", label: "Auto-flagged", count: counts.autoFlagged },
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
      key: "source",
      header: "Source",
      render: (item) => (
        <Badge variant={item.source === "Annotator" ? "flagged" : "caution"}>
          {item.source === "Annotator" ? "Flagged" : "Auto"}
        </Badge>
      ),
    },
    {
      key: "flaggedBy",
      header: "Flagged By",
      render: (item) => (
        <span className="text-secondary-text">{item.flaggedBy}</span>
      ),
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

      <div className="stagger-children mt-4 grid grid-cols-4 gap-3">
        <StatCard label="Pending" value={counts.total} />
        <StatCard label="Flagged" value={counts.flaggedByAnnotator} />
        <StatCard label="Auto-flagged" value={counts.autoFlagged} />
        <StatCard label="Resolved Today" value={counts.resolvedToday} />
      </div>

      <div className="mt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
          variant="underline"
        />
      </div>

      <div className="stagger-children mt-4 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Row>
          columns={columns}
          data={filtered as Row[]}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
