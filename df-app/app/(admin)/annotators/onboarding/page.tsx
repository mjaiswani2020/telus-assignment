"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";

// ---- Kanban column data ----

interface KanbanCard {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  detail: string;
  badge: { label: string; variant: "review" | "info" | "active" | "success" | "neutral" };
}

interface KanbanColumn {
  title: string;
  count: number;
  cards: KanbanCard[];
}

const COLUMNS: KanbanColumn[] = [
  {
    title: "Applied",
    count: 14,
    cards: [
      {
        id: "ob-1",
        name: "Priya Sharma",
        initials: "PS",
        avatarColor: "#005151",
        detail: "Applied Apr 12",
        badge: { label: "Pending review", variant: "review" },
      },
      {
        id: "ob-2",
        name: "James Okafor",
        initials: "JO",
        avatarColor: "#7C3AED",
        detail: "Applied Apr 13",
        badge: { label: "Pending review", variant: "review" },
      },
      {
        id: "ob-3",
        name: "Lin Chen",
        initials: "LC",
        avatarColor: "#2563EB",
        detail: "Applied Apr 14",
        badge: { label: "Pending review", variant: "review" },
      },
    ],
  },
  {
    title: "Grammar Test",
    count: 8,
    cards: [
      {
        id: "ob-4",
        name: "Sofia Martinez",
        initials: "SM",
        avatarColor: "#DB2777",
        detail: "Score: 87/100",
        badge: { label: "Apr 11", variant: "neutral" },
      },
      {
        id: "ob-5",
        name: "Ahmed Hassan",
        initials: "AH",
        avatarColor: "#D97706",
        detail: "Score: 91/100",
        badge: { label: "Apr 10", variant: "neutral" },
      },
    ],
  },
  {
    title: "Topic Alignment",
    count: 5,
    cards: [
      {
        id: "ob-6",
        name: "Yuki Tanaka",
        initials: "YT",
        avatarColor: "#059669",
        detail: "Alignment: 92%",
        badge: { label: "Apr 9", variant: "neutral" },
      },
      {
        id: "ob-7",
        name: "Maria Costa",
        initials: "MC",
        avatarColor: "#B45309",
        detail: "Alignment: 88%",
        badge: { label: "Apr 8", variant: "neutral" },
      },
    ],
  },
  {
    title: "Ranking Assessment",
    count: 3,
    cards: [
      {
        id: "ob-8",
        name: "David Kim",
        initials: "DK",
        avatarColor: "#005151",
        detail: "Accuracy: 78%",
        badge: { label: "Apr 7", variant: "neutral" },
      },
    ],
  },
  {
    title: "Active",
    count: 2,
    cards: [
      {
        id: "ob-9",
        name: "Elena Volkov",
        initials: "EV",
        avatarColor: "#16A34A",
        detail: "Joined Apr 16",
        badge: { label: "Joined Apr 16", variant: "success" },
      },
    ],
  },
];

const CONVERSION_RATES = ["57%", "63%", "60%", "67%"];

// ---- Funnel data ----

const FUNNEL_STAGES = [
  { label: "Applied", value: 14, opacity: 1 },
  { label: "Grammar Test", value: 8, opacity: 0.8 },
  { label: "Topic Alignment", value: 5, opacity: 0.6 },
  { label: "Ranking Assessment", value: 3, opacity: 0.4 },
  { label: "Active", value: 2, opacity: 0.25 },
];

const MAX_FUNNEL = 14;

export default function OnboardingPage() {
  return (
    <div>
      <PageHeader
        title="Onboarding Pipeline"
        subtitle="Annotator recruitment and vetting workflow"
      />

      {/* ---- Kanban Board ---- */}
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
        {COLUMNS.map((col, colIdx) => (
          <div key={col.title} className="flex items-start gap-0">
            {/* Column */}
            <div className="w-[220px] shrink-0">
              {/* Column Header */}
              <div className="mb-3 flex items-center gap-2 rounded-comfortable bg-[#F7F8F8] px-3 py-2">
                <span className="font-inter text-[13px] font-semibold text-ink">
                  {col.title}
                </span>
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#EBEEED] px-1.5 font-inter text-[11px] font-medium text-secondary-text">
                  {col.count}
                </span>
                {col.title === "Active" && (
                  <span className="font-inter text-[11px] text-tertiary-text">
                    this week
                  </span>
                )}
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {col.cards.map((card, cardIdx) => (
                  <motion.div
                    key={card.id}
                    className="rounded-comfortable border border-[#EBEEED] bg-white p-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: colIdx * 0.08 + cardIdx * 0.04,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-inter text-[11px] font-medium text-white"
                        style={{ backgroundColor: card.avatarColor }}
                      >
                        {card.initials}
                      </div>
                      <span className="font-inter text-[13px] font-medium text-ink">
                        {card.name}
                      </span>
                    </div>
                    <p className="font-inter text-[12px] text-secondary-text mb-2">
                      {card.detail}
                    </p>
                    <Badge variant={card.badge.variant} dot>
                      {card.badge.label}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Conversion arrow between columns */}
            {colIdx < COLUMNS.length - 1 && (
              <div className="flex h-[60px] w-[56px] shrink-0 flex-col items-center justify-center">
                <span className="font-inter text-[11px] font-semibold text-[#005151]">
                  {CONVERSION_RATES[colIdx]}
                </span>
                <ArrowRight className="h-4 w-4 text-[#005151]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ---- Funnel Chart ---- */}
      <div className="mt-8">
        <h2 className="font-literata text-[13px] font-semibold uppercase tracking-[1.5px] text-secondary-text mb-4">
          Pipeline Funnel
        </h2>
        <div className="rounded-comfortable border border-[#EBEEED] bg-white p-5">
          <div className="flex flex-col gap-3">
            {FUNNEL_STAGES.map((stage) => (
              <div key={stage.label} className="flex items-center gap-4">
                <span className="w-[140px] shrink-0 text-right font-inter text-[13px] text-secondary-text">
                  {stage.label}
                </span>
                <div className="relative flex-1 h-8 rounded bg-[#F7F8F8]">
                  <motion.div
                    className="h-full rounded"
                    style={{
                      backgroundColor: `rgba(0, 81, 81, ${stage.opacity})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(stage.value / MAX_FUNNEL) * 100}%`,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center font-inter text-[13px] font-semibold text-white mix-blend-difference">
                    {stage.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
