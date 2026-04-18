"use client";

import { useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/cn";
import { Download } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Tag = "high-impact" | "differentiator";

interface Feature {
  name: string;
  tags?: Tag[];
  module: string;
}

interface FeatureGroup {
  name: string;
  features: Feature[];
}

interface Phase {
  id: string;
  name: string;
  shortName: string;
  status: string;
  featureCount: number;
  description: string;
  color: string;
  dotFilled: boolean;
  flex: number;
  groups: FeatureGroup[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const phases: Phase[] = [
  {
    id: "phase-1",
    name: "Phase 1: MVP Core Pipeline",
    shortName: "Phase 1: MVP Core",
    status: "Prototyped",
    featureCount: 19,
    description:
      "Table stakes \u2014 the fundamental ability to collect RLHF training data from humans",
    color: "#1D9E75",
    dotFilled: true,
    flex: 19,
    groups: [
      {
        name: "TASK CONFIGURATION",
        features: [
          { name: "Task type templates (SFT, preference, red-team, ranking)", tags: [], module: "M2" },
          { name: "Evaluation dimension builder", module: "M2" },
          { name: "Preference scale configuration", module: "M2" },
          { name: "Safety taxonomy builder", module: "M2" },
          { name: "Guideline version control", module: "M2" },
        ],
      },
      {
        name: "ANNOTATION INTERFACE",
        features: [
          { name: "Multi-mode annotation workbench", tags: ["high-impact"], module: "M6" },
          { name: "Side-by-side response comparison with preference selector", module: "M6" },
          { name: "Multi-turn conversation threading", module: "M6" },
          { name: "Red-team task reframing", tags: ["high-impact"], module: "M6" },
          { name: "Response editing capability", module: "M6" },
          { name: "Keyboard-first interaction design", module: "M6" },
        ],
      },
      {
        name: "MODEL INTEGRATION & DATA MANAGEMENT",
        features: [
          { name: "Model endpoint registry with hot-swap", module: "M4" },
          { name: "Response pair generation strategies", module: "M4" },
          { name: "Full response provenance tracking", module: "M4" },
          { name: "Project \u2192 Iteration \u2192 Batch hierarchy", module: "M1" },
          { name: "Multi-tenant isolation", module: "M1" },
          { name: "Multi-format data export (JSONL, Parquet, custom)", module: "M8" },
          { name: "Train/test split management", module: "M8" },
          { name: "Basic annotator management", module: "M3" },
        ],
      },
    ],
  },
  {
    id: "phase-2",
    name: "Phase 2: Quality & Strategic Intelligence",
    shortName: "Phase 2: Intelligence",
    status: "In Progress",
    featureCount: 16,
    description:
      'Where the platform moves from "tool" to "intelligent system"',
    color: "#7F77DD",
    dotFilled: true,
    flex: 16,
    groups: [
      {
        name: "REAL-TIME QUALITY MONITORING",
        features: [
          { name: "Tiered review pipeline (auto-approve / spot-check / mandatory)", tags: ["high-impact", "differentiator"], module: "M7" },
          { name: "Reward model alignment scoring", tags: ["high-impact"], module: "M7" },
          { name: "Calibration drift detection", module: "M7" },
          { name: "Difficulty distribution monitor", tags: ["high-impact"], module: "M7" },
          { name: "Composite quality score per annotation", module: "M7" },
        ],
      },
      {
        name: "ANNOTATOR FEEDBACK & WORKFORCE",
        features: [
          { name: "Calibration nudge system", tags: ["differentiator"], module: "M6+M7" },
          { name: "Intelligent task routing", tags: ["high-impact"], module: "M3" },
          { name: "Fatigue management system", module: "M6+M3" },
          { name: "Content exposure management for red-team work", module: "M3" },
          { name: "Skill tier system with per-dimension scoring", module: "M3" },
        ],
      },
      {
        name: "DATA & STRATEGIC INTELLIGENCE",
        features: [
          { name: "Coverage heatmap (risk category \u00d7 attack vector)", tags: ["differentiator"], module: "M7" },
          { name: "Configurable data mixing engine", tags: ["differentiator"], module: "M8" },
          { name: "Cross-iteration comparison dashboard", module: "M1+M9" },
          { name: "Distribution shift detector", module: "M9" },
          { name: "Coverage-driven prompt allocation", module: "M5" },
          { name: "Cost & efficiency analytics", module: "M9" },
        ],
      },
    ],
  },
  {
    id: "phase-3",
    name: "Phase 3: AI-Augmented Capabilities",
    shortName: "Phase 3: AI Augmented",
    status: "Planned",
    featureCount: 12,
    description:
      "Using AI to improve the data collection process itself",
    color: "#BA7517",
    dotFilled: false,
    flex: 12,
    groups: [
      {
        name: "AI-ASSISTED ANNOTATION",
        features: [
          { name: "Intelligent diff highlighting", tags: ["high-impact"], module: "M6" },
          { name: "AI pre-labeling with human review", tags: ["high-impact"], module: "M6+M7" },
          { name: "Automated rubric ambiguity detection", tags: ["differentiator"], module: "M7" },
          { name: "Difficulty-aware comparison indicator", module: "M6" },
        ],
      },
      {
        name: "ACTIVE LEARNING & DATA EFFICIENCY",
        features: [
          { name: "Active learning comparison selection", tags: ["high-impact", "differentiator"], module: "M4+M7" },
          { name: "Data valuation engine", tags: ["high-impact"], module: "M9" },
          { name: "Adversarial prompt auto-generation", module: "M5" },
          { name: "Topic-guided synthetic prompt generation", module: "M5" },
        ],
      },
      {
        name: "AUTOMATED STRATEGIC PLANNING",
        features: [
          { name: "Iteration playbook generator", tags: ["differentiator"], module: "M9" },
          { name: "Guideline A/B testing with automated analysis", module: "M2" },
          { name: "Workforce planning predictor", module: "M3+M9" },
          { name: "Optimal temperature/sampling recommender", module: "M4+M9" },
        ],
      },
    ],
  },
  {
    id: "phase-4",
    name: "Phase 4: Scale",
    shortName: "Phase 4: Scale",
    status: "Future",
    featureCount: 8,
    description: "",
    color: "#D85A30",
    dotFilled: false,
    flex: 8,
    groups: [
      {
        name: "",
        features: [
          { name: "Vision annotation workbench", module: "" },
          { name: "Code execution annotation", module: "" },
          { name: "Multi-lingual annotation support", module: "" },
          { name: "Expert annotator marketplace", module: "" },
          { name: "Conversation branching & tree annotation", module: "" },
          { name: "Domain-specific evaluation rubrics", module: "" },
          { name: "Tool-use annotation", module: "" },
          { name: "Long-form content annotation", module: "" },
        ],
      },
    ],
  },
  {
    id: "phase-5",
    name: "Phase 5: Ecosystem",
    shortName: "Phase 5",
    status: "Future",
    featureCount: 6,
    description: "",
    color: "#378ADD",
    dotFilled: false,
    flex: 6,
    groups: [
      {
        name: "",
        features: [
          { name: "Full audit trail", module: "" },
          { name: "Data lineage & provenance chain", module: "" },
          { name: "GDPR/privacy compliance framework", module: "" },
          { name: "Custom workflow builder", module: "" },
          { name: "Training infrastructure integration", module: "" },
          { name: "API-first platform", module: "" },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Tag pill                                                           */
/* ------------------------------------------------------------------ */

const tagStyles: Record<Tag, string> = {
  "high-impact": "bg-[#FCEBEB] text-[#791F1F]",
  differentiator: "bg-[#E6F2F2] text-[#005151]",
};
const tagLabels: Record<Tag, string> = {
  "high-impact": "HIGH IMPACT",
  differentiator: "DIFFERENTIATOR",
};

function TagPill({ tag }: { tag: Tag }) {
  return (
    <span
      className={cn(
        "rounded-tight px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide whitespace-nowrap",
        tagStyles[tag]
      )}
    >
      {tagLabels[tag]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RoadmapPage() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const total = phases.reduce((s, p) => s + p.featureCount, 0);

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Product Roadmap"
        subtitle={`${total} features across 5 themes`}
        action={
          <button className="flex items-center gap-2 rounded-standard border border-level-2 bg-white px-3 py-1.5 font-inter text-body-md text-secondary-text transition-colors hover:bg-level-1">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        }
      />

      {/* Stat cards */}
      <div className="mt-4 grid grid-cols-5 gap-3">
        <StatCard
          label="Total Features"
          value={total}
          trend={{ value: "5 themes, 9 modules", direction: "neutral" }}
          className="p-4"
        />
        <StatCard
          label="Prototyped"
          value={phases[0].featureCount}
          trend={{ value: "Core pipeline", direction: "neutral" }}
          className="p-4"
        />
        <StatCard
          label="In Progress"
          value={phases[1].featureCount}
          trend={{ value: "Intelligence layer", direction: "neutral" }}
          className="p-4"
        />
        <StatCard
          label="Planned"
          value={phases[2].featureCount}
          trend={{ value: "AI augmentation", direction: "neutral" }}
          className="p-4"
        />
        <StatCard
          label="Future"
          value={phases[3].featureCount + phases[4].featureCount}
          trend={{ value: "Scale + ecosystem", direction: "neutral" }}
          className="p-4"
        />
      </div>

      {/* Phase timeline bar */}
      <div className="mt-6">
        <div className="flex gap-1 overflow-hidden rounded-featured">
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => scrollTo(p.id)}
              className="py-2.5 font-inter text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: p.color, flex: p.flex }}
            >
              {p.shortName}
            </button>
          ))}
        </div>
        <div className="mt-2 flex">
          {phases.map((p) => (
            <span
              key={p.id}
              className="text-center font-inter text-[12px] font-medium italic"
              style={{ flex: p.flex, color: p.color }}
            >
              {p.status}
            </span>
          ))}
        </div>
      </div>

      {/* Phases 1-3: full detail */}
      {phases.slice(0, 3).map((phase) => (
        <section
          key={phase.id}
          ref={(el) => {
            sectionRefs.current[phase.id] = el;
          }}
          className="mt-10 scroll-mt-20"
        >
          {/* Phase header */}
          <div className="mb-5 flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: phase.color }}
            />
            <h2 className="font-literata text-[20px] font-semibold text-ink">
              {phase.name}
            </h2>
            <span
              className="rounded-tight px-2.5 py-0.5 font-mono text-[11px] font-medium"
              style={{
                backgroundColor: phase.color + "1A",
                color: phase.color,
              }}
            >
              {phase.featureCount} features {phase.status.toLowerCase()}
            </span>
            <span className="ml-auto font-inter text-[13px] italic text-tertiary-text">
              {phase.description}
            </span>
          </div>

          {/* Feature groups */}
          <div className="space-y-5">
            {phase.groups.map((group) => (
              <div key={group.name}>
                <h3 className="mb-2 pl-1 font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                  {group.name}
                </h3>
                <div className="overflow-hidden rounded-comfortable border border-level-2 bg-white">
                  {group.features.map((f, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5",
                        i < group.features.length - 1 &&
                          "border-b border-level-2"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {phase.dotFilled ? (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: phase.color }}
                          />
                        ) : (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full border-[1.5px]"
                            style={{ borderColor: phase.color }}
                          />
                        )}
                        <span className="font-inter text-[13px] text-ink">
                          {f.name}
                        </span>
                      </div>
                      <div className="ml-4 flex shrink-0 items-center gap-2">
                        {f.tags?.map((t) => (
                          <TagPill key={t} tag={t} />
                        ))}
                        {f.module && (
                          <span className="w-14 text-right font-mono text-[11px] text-tertiary-text">
                            {f.module}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Phases 4 + 5: compressed two-column layout */}
      <div className="mt-10 grid grid-cols-2 gap-6">
        {phases.slice(3).map((phase) => (
          <section
            key={phase.id}
            ref={(el) => {
              sectionRefs.current[phase.id] = el;
            }}
            className="scroll-mt-20"
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: phase.color }}
              />
              <h2 className="font-literata text-[18px] font-semibold text-ink">
                {phase.name}
              </h2>
              <span
                className="rounded-tight px-2 py-0.5 font-mono text-[11px] font-medium"
                style={{
                  backgroundColor: phase.color + "1A",
                  color: phase.color,
                }}
              >
                {phase.featureCount} features
              </span>
            </div>
            <div className="overflow-hidden rounded-comfortable border border-level-2 bg-white">
              {phase.groups[0].features.map((f, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2",
                    i < phase.groups[0].features.length - 1 &&
                      "border-b border-level-2"
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full opacity-50"
                    style={{ backgroundColor: phase.color }}
                  />
                  <span className="font-inter text-[13px] text-secondary-text">
                    {f.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
