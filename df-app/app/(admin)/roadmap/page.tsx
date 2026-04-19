"use client";

import { useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { cn } from "@/lib/cn";
import { Download } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Feature {
  name: string;
  module?: string;
}

interface Theme {
  name: string;
  features: Feature[];
}

interface Bucket {
  id: string;
  name: string;
  description: string;
  color: string;
  themes: Theme[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const buckets: Bucket[] = [
  {
    id: "now",
    name: "Now",
    description:
      "Table stakes \u2014 the capabilities every competitive RLHF data platform must have",
    color: "#1D9E75",
    themes: [
      {
        name: "THE ANNOTATION CORE",
        features: [
          {
            name: "Multi-mode annotation workbench (SFT, pairwise, red-team, ranking, rubric, chat, arena)",
            module: "M6",
          },
          {
            name: "Side-by-side response comparison with preference selector",
            module: "M6",
          },
          {
            name: "Multi-turn conversation threading",
            module: "M6",
          },
          {
            name: "Red-team adversarial probing with safety categorization",
            module: "M6",
          },
          {
            name: "Rubric-based dimensional scoring",
            module: "M6",
          },
          {
            name: "SFT demonstration writing",
            module: "M6",
          },
          {
            name: "Response editing & rewriting capability",
            module: "M6",
          },
          {
            name: "Model arena for head-to-head evaluation",
            module: "M6",
          },
          {
            name: "Keyboard-first interaction design",
            module: "M6",
          },
          {
            name: "Annotation skip & flag workflows",
            module: "M6",
          },
        ],
      },
      {
        name: "TASK DESIGN & CONFIGURATION",
        features: [
          {
            name: "Task type templates with type-specific configuration",
            module: "M2",
          },
          {
            name: "Evaluation dimension builder",
            module: "M2",
          },
          {
            name: "Preference scale configuration (binary, Likert, margin-based)",
            module: "M2",
          },
          {
            name: "Safety taxonomy builder (risk categories & attack vectors)",
            module: "M2",
          },
          { name: "Guideline version control", module: "M2" },
          {
            name: "Annotator-facing task preview",
            module: "M2",
          },
        ],
      },
      {
        name: "WORKFORCE & ONBOARDING",
        features: [
          {
            name: "Annotator profiles & management",
            module: "M3",
          },
          {
            name: "Multi-stage qualification testing",
            module: "M3",
          },
          {
            name: "Qualification test builder",
            module: "M3",
          },
          {
            name: "Annotator onboarding flows",
            module: "M3",
          },
          { name: "Basic skill & performance tracking", module: "M3" },
        ],
      },
      {
        name: "PROJECT & ITERATION MANAGEMENT",
        features: [
          {
            name: "Project creation & configuration",
            module: "M1",
          },
          {
            name: "Campaign management with batch rounds",
            module: "M1",
          },
          {
            name: "Iteration lifecycle tracking",
            module: "M1",
          },
          {
            name: "Project-level analytics dashboard",
            module: "M1+M9",
          },
          { name: "Multi-tenant workspace isolation", module: "M1" },
        ],
      },
      {
        name: "MODEL & PROMPT INFRASTRUCTURE",
        features: [
          {
            name: "Model endpoint registry",
            module: "M4",
          },
          {
            name: "Prompt pool management & curation",
            module: "M5",
          },
          { name: "Response pair generation strategies", module: "M4" },
          { name: "Model hot-swap without session disruption", module: "M4" },
        ],
      },
      {
        name: "DATA & EXPORT PIPELINE",
        features: [
          {
            name: "Multi-format data export (JSONL, Parquet, HuggingFace)",
            module: "M8",
          },
          {
            name: "Export configuration & preview",
            module: "M8",
          },
          {
            name: "Export analysis & statistics",
            module: "M8",
          },
          { name: "Train/test split management", module: "M8" },
          { name: "Full data provenance tracking", module: "M8" },
        ],
      },
      {
        name: "REVIEW & QUALITY FOUNDATIONS",
        features: [
          {
            name: "Review queue & assignment workflows",
            module: "M7",
          },
          {
            name: "Individual annotation review with approve/reject",
            module: "M7",
          },
          {
            name: "Quality analytics dashboard",
            module: "M7+M9",
          },
          {
            name: "Task experimentation framework",
            module: "M2",
          },
          { name: "Inter-annotator agreement metrics", module: "M7" },
        ],
      },
    ],
  },
  {
    id: "next",
    name: "Next",
    description:
      "Differentiation \u2014 where the platform moves from tool to intelligent system",
    color: "#7F77DD",
    themes: [
      {
        name: "REAL-TIME QUALITY INTELLIGENCE",
        features: [
          {
            name: "Tiered review pipeline (auto-approve / spot-check / mandatory)",
            module: "M7",
          },
          {
            name: "Reward model alignment scoring",
            module: "M7",
          },
          { name: "Calibration drift detection", module: "M7" },
          {
            name: "Difficulty distribution monitor",
            module: "M7",
          },
          { name: "Composite quality score per annotation", module: "M7" },
          { name: "Golden task injection & tracking", module: "M7" },
        ],
      },
      {
        name: "ANNOTATOR FEEDBACK LOOPS",
        features: [
          {
            name: "Real-time calibration nudge system",
            module: "M6+M7",
          },
          {
            name: "Intelligent task routing by skill & difficulty",
            module: "M3",
          },
          { name: "Fatigue detection & session management", module: "M6+M3" },
          {
            name: "Content exposure management for red-team work",
            module: "M3",
          },
          {
            name: "Skill tier system with per-dimension scoring",
            module: "M3",
          },
          {
            name: "Preference strength signal capture (margin-based)",
            module: "M6",
          },
        ],
      },
      {
        name: "STRATEGIC DATA ANALYTICS",
        features: [
          {
            name: "Coverage heatmap (risk category \u00d7 attack vector)",
            module: "M7",
          },
          {
            name: "Cross-iteration comparison dashboard",
            module: "M1+M9",
          },
          {
            name: "Distribution shift detection across batches",
            module: "M9",
          },
          { name: "Cost & efficiency analytics", module: "M9" },
          { name: "Annotator cohort performance analysis", module: "M9" },
          { name: "Batch-over-batch quality trending", module: "M9" },
        ],
      },
      {
        name: "DATA MIXING & OPTIMIZATION",
        features: [
          {
            name: "Configurable data mixing engine (cross-iteration blending)",
            module: "M8",
          },
          { name: "Coverage-driven prompt allocation", module: "M5" },
          { name: "Near-duplicate detection & deduplication", module: "M8" },
          {
            name: "Topic distribution analysis & gap detection",
            module: "M8",
          },
          { name: "Data quality scoring & filtering", module: "M8" },
        ],
      },
      {
        name: "PLATFORM EXTENSIBILITY",
        features: [
          {
            name: "API-first platform with programmatic access",
            module: "M1",
          },
          {
            name: "Webhook integrations for external systems",
            module: "M1",
          },
          {
            name: "SSO/SAML authentication",
            module: "M1",
          },
          {
            name: "Custom workflow builder",
            module: "M1",
          },
          {
            name: "Compliance & audit framework",
            module: "M1",
          },
          {
            name: "Training infrastructure integration (direct pipeline export)",
            module: "M8",
          },
        ],
      },
    ],
  },
  {
    id: "later",
    name: "Later",
    description:
      "Future bets \u2014 R&D-intensive capabilities that reshape the data collection paradigm",
    color: "#BA7517",
    themes: [
      {
        name: "AI-AUGMENTED ANNOTATION",
        features: [
          {
            name: "AI pre-labeling with human review",
            module: "M6+M7",
          },
          {
            name: "Intelligent diff highlighting between response pairs",
            module: "M6",
          },
          {
            name: "Automated rubric ambiguity detection",
            module: "M7",
          },
          {
            name: "Active learning comparison selection",
            module: "M4+M7",
          },
          { name: "Difficulty-aware comparison indicator", module: "M6" },
        ],
      },
      {
        name: "AUTONOMOUS DATA STRATEGY",
        features: [
          {
            name: "Data valuation engine (marginal value per category)",
            module: "M9",
          },
          {
            name: "Iteration playbook generator",
            module: "M9",
          },
          { name: "Workforce planning predictor", module: "M3+M9" },
          {
            name: "Optimal temperature/sampling recommender",
            module: "M4+M9",
          },
          {
            name: "Guideline A/B testing with automated analysis",
            module: "M2",
          },
        ],
      },
      {
        name: "MULTIMODAL & DOMAIN EXPANSION",
        features: [
          { name: "Vision annotation workbench", module: "M6" },
          {
            name: "Code execution annotation with sandboxed environments",
            module: "M6",
          },
          {
            name: "Tool-use annotation (function calling, API interactions)",
            module: "M6",
          },
          { name: "Conversation branching & tree annotation", module: "M6" },
          { name: "Long-form content annotation", module: "M6" },
          {
            name: "Domain-specific evaluation rubrics (medical, legal, financial)",
            module: "M2",
          },
        ],
      },
      {
        name: "SYNTHETIC DATA GENERATION",
        features: [
          { name: "Adversarial prompt auto-generation", module: "M5" },
          {
            name: "Topic-guided synthetic prompt generation",
            module: "M5",
          },
          {
            name: "Model-generated prompt curation & quality gating",
            module: "M5",
          },
          {
            name: "Red-team scenario generation from failure patterns",
            module: "M5+M7",
          },
        ],
      },
      {
        name: "SCALE & MARKETPLACE",
        features: [
          {
            name: "Expert annotator marketplace",
            module: "M3",
          },
          {
            name: "Multi-lingual annotation support with locale management",
            module: "M6",
          },
          { name: "GDPR/privacy compliance framework", module: "M1" },
          { name: "Full audit trail & data lineage chain", module: "M8" },
          {
            name: "Federated annotation across distributed teams",
            module: "M3",
          },
        ],
      },
    ],
  },
];

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

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Product Roadmap"
        action={
          <button className="flex items-center gap-2 rounded-standard border border-level-2 bg-white px-3 py-1.5 font-inter text-body-md text-secondary-text transition-colors hover:bg-level-1">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        }
      />

      {/* Now / Next / Later navigation */}
      <div className="mt-6">
        <div className="flex gap-1 overflow-hidden rounded-featured">
          {buckets.map((b) => (
            <button
              key={b.id}
              onClick={() => scrollTo(b.id)}
              className="flex-1 py-2.5 font-inter text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: b.color }}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bucket sections */}
      {buckets.map((bucket) => (
        <section
          key={bucket.id}
          ref={(el) => {
            sectionRefs.current[bucket.id] = el;
          }}
          className="mt-10 scroll-mt-20"
        >
          {/* Bucket header */}
          <div className="mb-5 flex items-baseline gap-3">
            <span
              className="relative top-[1px] h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: bucket.color }}
            />
            <h2 className="font-literata text-[20px] font-semibold text-ink">
              {bucket.name}
            </h2>
            <span className="font-inter text-[13px] italic text-tertiary-text">
              {bucket.description}
            </span>
          </div>

          {/* Theme groups */}
          <div className="space-y-5">
            {bucket.themes.map((theme) => (
              <div key={theme.name}>
                <h3 className="mb-2 pl-1 font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                  {theme.name}
                </h3>
                <div className="overflow-hidden rounded-comfortable border border-level-2 bg-white">
                  {theme.features.map((f, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5",
                        i < theme.features.length - 1 &&
                          "border-b border-level-2",
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: bucket.color }}
                        />
                        <span className="font-inter text-[13px] text-ink">
                          {f.name}
                        </span>
                      </div>
                      {f.module && (
                        <span className="ml-4 shrink-0 w-14 text-right font-mono text-[11px] text-tertiary-text">
                          {f.module}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
