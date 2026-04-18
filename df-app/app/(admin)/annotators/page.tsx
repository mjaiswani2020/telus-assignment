"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Settings2,
  AlertTriangle,
  Clock,
  Activity,
  DollarSign,
  ShieldAlert,
  Award,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
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

// ---- Session Health mock data ----

const SESSION_QUALITY_DATA = [
  { range: "0-2h", quality: 84, fill: "#059669" },
  { range: "2-4h", quality: 81, fill: "#16A34A" },
  { range: "4-6h", quality: 73, fill: "#D97706" },
  { range: "6-8h", quality: 65, fill: "#EA580C" },
  { range: "8+h", quality: 58, fill: "#DC2626" },
];

const SESSION_ALERTS = [
  {
    id: "sa-1",
    icon: Clock,
    text: "3 annotators have been active >5 hours without a break",
    severity: "caution" as const,
  },
  {
    id: "sa-2",
    icon: Activity,
    text: "J. Lee shows 78% A-preference in last 50 tasks (expected: ~50%)",
    severity: "error" as const,
  },
  {
    id: "sa-3",
    icon: AlertTriangle,
    text: "R. Patel gold accuracy dropped from 85% to 62% in last 2 hours",
    severity: "error" as const,
  },
];

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

  const fatigueCount = useMemo(
    () =>
      annotators.filter(
        (a) =>
          a.fatigueRisk === "high" ||
          a.fatigueRisk === "medium" ||
          !!a.driftAlert
      ).length,
    [annotators]
  );

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
        const showFatigue =
          item.fatigueRisk === "high" || item.fatigueRisk === "medium";
        const showDrift = !!item.driftAlert;
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`flex items-center gap-1 ${color}`}>
              {item.trend === "Improving" && <TrendingUp className="h-3.5 w-3.5" />}
              {item.trend === "Declining" && <TrendingDown className="h-3.5 w-3.5" />}
              {item.trend === "Stable" && <Minus className="h-3.5 w-3.5" />}
              {item.trend}
            </span>
            {showFatigue && (
              <span
                title={`Fatigue risk: ${item.fatigueRisk} — ${item.sessionHours ?? 0}h session`}
                className="inline-flex items-center gap-1 rounded-tight border border-[#FED7AA] bg-[#FFF7ED] px-1.5 py-0 font-inter text-[10px] font-medium uppercase tracking-[0.5px] text-[#D97706]"
              >
                Fatigue
              </span>
            )}
            {showDrift && (
              <span
                title={item.driftAlert as string}
                className="inline-flex items-center gap-1 rounded-tight border border-[#FDBA74] bg-[#FFF7ED] px-1.5 py-0 font-inter text-[10px] font-medium uppercase tracking-[0.5px] text-[#EA580C]"
              >
                Drift
              </span>
            )}
          </div>
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

      <div className="stagger-children mt-4 grid grid-cols-5 gap-3">
        <StatCard label="Total" value={total} />
        <StatCard label="Active" value={counts.Active} />
        <StatCard label="In Review" value={counts["In Review"]} />
        <StatCard label="Onboarding" value={counts.Onboarding} />
        <StatCard
          label="At-Risk (Fatigue)"
          value={fatigueCount}
          trend={{ value: `${fatigueCount} flagged`, direction: "down" }}
        />
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

      {/* ---- Session Health Section ---- */}
      <div className="mt-6">
        <h2 className="font-literata text-[13px] font-semibold uppercase tracking-[1.5px] text-secondary-text mb-4">
          Session Health
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Left: Quality vs Session Duration Bar Chart */}
          <div className="rounded-comfortable border border-[#EBEEED] bg-white p-5">
            <h3 className="font-inter text-[14px] font-semibold text-ink mb-4">
              Quality vs. Session Duration
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SESSION_QUALITY_DATA} barCategoryGap="20%">
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#EBEEED"
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12, fill: "#6F7A77" }}
                  axisLine={{ stroke: "#EBEEED" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#6F7A77" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Quality"]}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #EBEEED",
                    boxShadow: "none",
                  }}
                />
                <Bar dataKey="quality" radius={[4, 4, 0, 0]}>
                  {SESSION_QUALITY_DATA.map((entry) => (
                    <Cell key={entry.range} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Alert Cards */}
          <div className="flex flex-col gap-3">
            {SESSION_ALERTS.map((alert) => {
              const Icon = alert.icon;
              const borderColor =
                alert.severity === "error" ? "#DC2626" : "#D97706";
              const iconColor =
                alert.severity === "error" ? "text-[#DC2626]" : "text-[#D97706]";
              const bgColor =
                alert.severity === "error" ? "bg-[#FEF2F2]" : "bg-[#FFF7ED]";
              return (
                <div
                  key={alert.id}
                  className={`rounded-comfortable border border-[#EBEEED] ${bgColor} p-4 border-l-[3px]`}
                  style={{ borderLeftColor: borderColor }}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
                    <p className="font-inter text-[13px] text-ink leading-snug">
                      {alert.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---- Compensation Section ---- */}
      <div className="mt-6">
        <h2 className="font-literata text-[13px] font-semibold uppercase tracking-[1.5px] text-secondary-text mb-4">
          Compensation
        </h2>

        {/* Rate Cards 2x2 */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              icon: DollarSign,
              label: "Base Rate",
              value: "$18/hr",
              subtitle: null,
              color: "#005151",
            },
            {
              icon: ShieldAlert,
              label: "Safety Premium",
              value: "+$4/hr",
              subtitle: "Hazard pay for red-teaming",
              color: "#D97706",
            },
            {
              icon: Award,
              label: "Quality Bonus",
              value: "+15%",
              subtitle: "For gold accuracy > 90%",
              color: "#059669",
            },
            {
              icon: Zap,
              label: "Volume Bonus",
              value: "+10%",
              subtitle: "For > 80 annotations/day",
              color: "#2563EB",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-comfortable border border-[#EBEEED] bg-white p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4" style={{ color: card.color }} />
                  <span className="font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                    {card.label}
                  </span>
                </div>
                <p className="font-literata text-[28px] font-semibold leading-[34px] tracking-[-0.02em] text-ink">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="mt-1 font-inter text-[12px] text-secondary-text">
                    {card.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Pay by Task Type Table */}
        <div className="mt-4 rounded-comfortable border border-[#EBEEED] bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink mb-3">
            Pay by Task Type
          </h3>
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 lg:grid-cols-8">
            {[
              { type: "Pairwise", rate: "$0.45" },
              { type: "Safety", rate: "$0.62" },
              { type: "SFT", rate: "$0.85" },
              { type: "Conversational", rate: "$0.55" },
              { type: "Editing", rate: "$0.50" },
              { type: "Ranking", rate: "$0.48" },
              { type: "Rubric", rate: "$0.52" },
              { type: "Arena", rate: "$0.45" },
            ].map((item) => (
              <div key={item.type} className="flex flex-col">
                <span className="font-inter text-[11px] text-tertiary-text uppercase tracking-[0.06em]">
                  {item.type}
                </span>
                <span className="font-inter text-[14px] font-semibold text-ink">
                  {item.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Budget Bar */}
        <div className="mt-4 rounded-comfortable border border-[#EBEEED] bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-inter text-[14px] font-semibold text-ink">
              Monthly Spend
            </h3>
            <span className="font-inter text-[13px] text-secondary-text">
              $42,300 / $50,000 budget
            </span>
          </div>
          <div className="relative h-3 w-full rounded-full bg-[#F7F8F8]">
            <motion.div
              className="h-full rounded-full bg-[#005151]"
              initial={{ width: 0 }}
              animate={{ width: "84.6%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1.5 font-inter text-[12px] text-tertiary-text">
            85% of budget utilized
          </p>
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
