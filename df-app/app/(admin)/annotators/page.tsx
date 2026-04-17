"use client";

import { useState, useMemo } from "react";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAnnotatorStore } from "@/stores/annotator-store";
import { useToast } from "@/components/ui/toast";
import type { Annotator, AnnotatorStatus } from "@/data/seed";

type Row = Annotator & Record<string, unknown>;

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "In Review", label: "In Review" },
  { value: "Onboarding", label: "Onboarding" },
  { value: "Paused", label: "Paused" },
];

const statusBadgeVariant: Record<AnnotatorStatus, "active" | "review" | "info" | "paused"> = {
  Active: "active",
  "In Review": "review",
  Onboarding: "info",
  Paused: "paused",
};

function goldAccColor(acc: number): string {
  if (acc >= 75) return "text-success";
  if (acc >= 60) return "text-caution";
  return "text-error";
}

export default function AnnotatorsPage() {
  const annotators = useAnnotatorStore((s) => s.annotators);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return annotators.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [annotators, search, statusFilter]);

  const counts = useAnnotatorStore((s) => s.getStatusCounts)();
  const total = annotators.length;

  const columns: { key: string; header: string; className?: string; render?: (item: Row) => React.ReactNode }[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-inter text-[12px] font-medium text-white"
            style={{ backgroundColor: item.avatarColor }}
          >
            {item.initials}
          </div>
          <span className="font-medium text-ink">{item.name}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge variant={statusBadgeVariant[item.status]} dot>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "skills",
      header: "Skills",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.skills.map((skill) => (
            <Badge key={skill} variant="neutral">
              {skill}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "goldAccuracy",
      header: "Gold Acc",
      render: (item) => (
        <span className={`font-medium ${goldAccColor(item.goldAccuracy)}`}>
          {item.goldAccuracy > 0 ? `${item.goldAccuracy}%` : "--"}
        </span>
      ),
    },
    {
      key: "iaa",
      header: "IAA",
      render: (item) => (
        <span className="text-ink">
          {item.iaa > 0 ? item.iaa.toFixed(2) : "--"}
        </span>
      ),
    },
    {
      key: "tasks30d",
      header: "Tasks (30D)",
      render: (item) => (
        <span className="text-ink">
          {item.tasks30d > 0 ? item.tasks30d.toLocaleString() : "--"}
        </span>
      ),
    },
    {
      key: "trend",
      header: "Trend",
      render: (item) => {
        const color =
          item.trend === "Improving"
            ? "text-success"
            : item.trend === "Declining"
              ? "text-error"
              : "text-tertiary-text";
        return (
          <span className={`flex items-center gap-1 ${color}`}>
            {item.trend === "Improving" && <TrendingUp className="h-3.5 w-3.5" />}
            {item.trend === "Declining" && <TrendingDown className="h-3.5 w-3.5" />}
            {item.trend === "Stable" && <Minus className="h-3.5 w-3.5" />}
            {item.trend}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Annotators"
        action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search annotators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
            <Button
              icon={<Plus className="h-4 w-4" />}
              onClick={() => toast("Annotator invite sent", "success")}
            >
              Add Annotator
            </Button>
          </div>
        }
      />

      <div className="stagger-children mt-6 grid grid-cols-4 gap-4">
        <StatCard label="Total" value={total} />
        <StatCard label="Active" value={counts.Active} />
        <StatCard label="In Review" value={counts["In Review"]} />
        <StatCard label="Onboarding" value={counts.Onboarding} />
      </div>

      <div className="stagger-children mt-6 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Row>
          columns={columns}
          data={filtered as Row[]}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
