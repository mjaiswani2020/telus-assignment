"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Settings2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RoutingConfigModal } from "@/components/admin/routing-config-modal";
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

// ---- Routing mock data ----

const ROUTING_RULES = [
  {
    id: "rule-1",
    name: "Safety Tasks",
    criteria: "Annotators with safety certification + gold accuracy > 80%",
    matchCount: 12,
    assigned: 340,
  },
  {
    id: "rule-2",
    name: "Expert Coding",
    criteria: "Annotators with coding skill + tasks(30d) > 50",
    matchCount: 8,
    assigned: 210,
  },
  {
    id: "rule-3",
    name: "New Annotators",
    criteria: "Easy difficulty tasks only for first 100 annotations",
    matchCount: 4,
    assigned: 45,
  },
];

// Static routing metadata per annotator id
const ANNOTATOR_ROUTING: Record<
  string,
  {
    taskTypes: { label: string; variant: "safety" | "pairwise" | "sft" | "editing" | "ranking" | "rubric" | "arena" | "conversational" }[];
    difficulty: "Easy" | "Medium" | "Hard";
    atCapacity?: boolean;
  }
> = {
  "ann-001": {
    taskTypes: [
      { label: "Safety", variant: "safety" },
      { label: "Pairwise", variant: "pairwise" },
    ],
    difficulty: "Hard",
  },
  "ann-002": {
    taskTypes: [
      { label: "Safety", variant: "safety" },
    ],
    difficulty: "Medium",
  },
  "ann-003": {
    taskTypes: [
      { label: "SFT", variant: "sft" },
      { label: "Editing", variant: "editing" },
    ],
    difficulty: "Hard",
    atCapacity: true,
  },
  "ann-006": {
    taskTypes: [
      { label: "Pairwise", variant: "pairwise" },
      { label: "Rubric", variant: "rubric" },
    ],
    difficulty: "Medium",
  },
  "ann-007": {
    taskTypes: [
      { label: "SFT", variant: "sft" },
    ],
    difficulty: "Medium",
  },
  "ann-008": {
    taskTypes: [
      { label: "Safety", variant: "safety" },
      { label: "Ranking", variant: "ranking" },
    ],
    difficulty: "Hard",
    atCapacity: true,
  },
  "ann-009": {
    taskTypes: [
      { label: "Arena", variant: "arena" },
    ],
    difficulty: "Easy",
  },
  "ann-010": {
    taskTypes: [
      { label: "Safety", variant: "safety" },
    ],
    difficulty: "Medium",
  },
  "ann-011": {
    taskTypes: [
      { label: "SFT", variant: "sft" },
      { label: "Conversational", variant: "conversational" },
    ],
    difficulty: "Medium",
  },
  "ann-012": {
    taskTypes: [
      { label: "Pairwise", variant: "pairwise" },
    ],
    difficulty: "Easy",
  },
  "ann-013": {
    taskTypes: [
      { label: "Safety", variant: "safety" },
    ],
    difficulty: "Medium",
  },
  "ann-014": {
    taskTypes: [
      { label: "SFT", variant: "sft" },
      { label: "Editing", variant: "editing" },
    ],
    difficulty: "Hard",
    atCapacity: true,
  },
  "ann-015": {
    taskTypes: [
      { label: "Arena", variant: "arena" },
    ],
    difficulty: "Easy",
  },
  "ann-016": {
    taskTypes: [
      { label: "Safety", variant: "safety" },
    ],
    difficulty: "Easy",
  },
  "ann-017": {
    taskTypes: [
      { label: "Ranking", variant: "ranking" },
    ],
    difficulty: "Medium",
  },
  "ann-018": {
    taskTypes: [
      { label: "SFT", variant: "sft" },
    ],
    difficulty: "Medium",
  },
  "ann-019": {
    taskTypes: [
      { label: "Safety", variant: "safety" },
      { label: "Pairwise", variant: "pairwise" },
    ],
    difficulty: "Medium",
  },
  "ann-020": {
    taskTypes: [
      { label: "Arena", variant: "arena" },
    ],
    difficulty: "Easy",
  },
};

const difficultyColor: Record<string, string> = {
  Easy: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
  Medium: "bg-[#FFF7ED] text-[#D97706] border-[#FED7AA]",
  Hard: "bg-[#FFF7ED] text-[#EA580C] border-[#FDBA74]",
};

export default function AnnotatorsPage() {
  const annotators = useAnnotatorStore((s) => s.annotators);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [autoRoute, setAutoRoute] = useState(true);
  const [routingModalOpen, setRoutingModalOpen] = useState(false);

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
      key: "routing",
      header: "Routing",
      render: (item) => {
        const routing = ANNOTATOR_ROUTING[item.id];
        if (!routing) {
          return <span className="text-tertiary-text">--</span>;
        }
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {routing.taskTypes.map((tt) => (
              <Badge key={tt.label} variant={tt.variant} className="text-[10px] px-1.5 py-0">
                {tt.label}
              </Badge>
            ))}
            <span
              className={`inline-flex items-center rounded-tight border px-1.5 py-0 font-inter text-[10px] uppercase tracking-[0.5px] ${difficultyColor[routing.difficulty]}`}
            >
              {routing.difficulty}
            </span>
            {routing.atCapacity && (
              <Badge variant="error" className="text-[10px] px-1.5 py-0" dot>
                At Capacity
              </Badge>
            )}
          </div>
        );
      },
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

      <div className="stagger-children mt-4 grid grid-cols-4 gap-3">
        <StatCard label="Total" value={total} />
        <StatCard label="Active" value={counts.Active} />
        <StatCard label="In Review" value={counts["In Review"]} />
        <StatCard label="Onboarding" value={counts.Onboarding} />
      </div>

      <div className="stagger-children mt-4 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Row>
          columns={columns}
          data={filtered as Row[]}
          keyExtractor={(item) => item.id}
        />
      </div>

      {/* ---- Task Routing Section ---- */}
      <div className="mt-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-literata text-[13px] font-semibold uppercase tracking-[1.5px] text-secondary-text">
            Task Routing
          </h2>
          <div className="flex items-center gap-3">
            {/* Auto-Route Toggle */}
            <div className="flex items-center gap-2">
              <span className="font-inter text-body-md text-ink">Auto-Route</span>
              <button
                onClick={() => setAutoRoute(!autoRoute)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  autoRoute ? "bg-[#059669]" : "bg-level-3"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 mt-0.5 ${
                    autoRoute ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <Button
              variant="secondary"
              size="compact"
              icon={<Settings2 className="h-4 w-4" />}
              onClick={() => setRoutingModalOpen(true)}
            >
              Configure Rules
            </Button>
          </div>
        </div>

        {/* Routing Rule Cards */}
        <div className="grid grid-cols-3 gap-3">
          {ROUTING_RULES.map((rule) => (
            <div
              key={rule.id}
              className="rounded-comfortable border border-[#EBEEED] bg-white p-4 border-l-[3px] border-l-[#005151]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-inter text-body-md font-semibold text-ink">
                  {rule.name}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-tertiary-text shrink-0" />
              </div>
              <p className="font-inter text-[13px] text-secondary-text leading-snug mb-3">
                {rule.criteria}
              </p>
              <p className="font-inter text-[12px] text-tertiary-text">
                <span className="font-medium text-[#005151]">{rule.matchCount} annotators match</span>
                {" "}
                <span className="mx-1">&middot;</span>
                {" "}
                {rule.assigned} assigned
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Routing Config Modal ---- */}
      <RoutingConfigModal
        open={routingModalOpen}
        onClose={() => setRoutingModalOpen(false)}
        onSave={() => toast("Routing rule saved", "success")}
      />
    </div>
  );
}
