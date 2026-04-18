"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  TOC sections                                                       */
/* ------------------------------------------------------------------ */

interface TocItem {
  id: string;
  title: string;
  children?: { id: string; title: string }[];
}

const tocSections: TocItem[] = [
  { id: "overview", title: "Overview" },
  { id: "research", title: "Research Foundation" },
  { id: "stakeholders", title: "Stakeholder Archetypes" },
  { id: "workflow", title: "E2E Workflow" },
  { id: "pain-points", title: "Pain Point Analysis" },
  { id: "architecture", title: "Platform Architecture" },
  {
    id: "modules",
    title: "Core Module Deep Dives",
    children: [
      { id: "mod-task-studio", title: "Task Studio" },
      { id: "mod-workbench", title: "Annotation Workbench" },
      { id: "mod-qcc", title: "Quality Control Center" },
    ],
  },
  { id: "patterns", title: "Strategic Patterns" },
];

/* ------------------------------------------------------------------ */
/*  Pain point data                                                    */
/* ------------------------------------------------------------------ */

interface PainPoint {
  id: string;
  desc: string;
  severity: "high" | "med" | "low";
}

interface PainPhase {
  name: string;
  color: string;
  points: PainPoint[];
}

const painPhases: PainPhase[] = [
  {
    name: "Strategy & Objectives",
    color: "#7F77DD",
    points: [
      { id: "1.1", desc: "Research-to-task translation gap", severity: "high" },
      { id: "1.2", desc: "No fast feedback loop on strategy decisions", severity: "med" },
      { id: "1.3", desc: "Cross-iteration memory loss", severity: "med" },
    ],
  },
  {
    name: "Task Design & Guidelines",
    color: "#1D9E75",
    points: [
      { id: "2.1", desc: "Guidelines evolve but aren\u2019t versioned", severity: "med" },
      { id: "2.2", desc: "Rubric ambiguity \u2192 low inter-annotator agreement", severity: "high" },
      { id: "2.3", desc: "Task design can\u2019t be A/B tested", severity: "low" },
    ],
  },
  {
    name: "Model / Prompt",
    color: "#D85A30",
    points: [
      { id: "3.1", desc: "Model serving infra for live annotation", severity: "med" },
      { id: "3.2", desc: "Prompt diversity hard to control/measure", severity: "high" },
      { id: "3.3", desc: "Synthetic prompts lack quality gate", severity: "low" },
    ],
  },
  {
    name: "Human Annotation",
    color: "#378ADD",
    points: [
      { id: "4.1", desc: "Cognitive load and task confusion (esp. red-teaming)", severity: "high" },
      { id: "4.2", desc: "Annotator fatigue and quality drift over time", severity: "high" },
      { id: "4.3", desc: "Preference signal degrades as models improve", severity: "high" },
      { id: "4.4", desc: "Model latency kills annotator throughput", severity: "med" },
      { id: "4.5", desc: "Multi-turn conversations compound errors", severity: "med" },
      { id: "4.6", desc: "No real-time quality feedback to annotators", severity: "high" },
    ],
  },
  {
    name: "QA & Data Processing",
    color: "#BA7517",
    points: [
      { id: "5.1", desc: "QA is a manual bottleneck", severity: "high" },
      { id: "5.2", desc: "Rejected annotations waste resources", severity: "med" },
      { id: "5.3", desc: "Data mixing across iterations is ad-hoc", severity: "med" },
      { id: "5.4", desc: "No systematic distribution/coverage analysis", severity: "med" },
    ],
  },
  {
    name: "Training & Evaluation",
    color: "#D4537E",
    points: [
      { id: "6.1", desc: "RM accuracy unknown until after training", severity: "med" },
      { id: "6.2", desc: "Evaluation-to-strategy feedback loop is slow", severity: "high" },
      { id: "6.3", desc: "Human evaluation is expensive and noisy", severity: "med" },
    ],
  },
];

const severityMeta = {
  high: { label: "High", color: "#E24B4A", width: "75%" },
  med: { label: "Medium", color: "#EF9F27", width: "50%" },
  low: { label: "Low", color: "#1D9E75", width: "30%" },
};

/* ------------------------------------------------------------------ */
/*  Architecture data                                                  */
/* ------------------------------------------------------------------ */

interface ModuleInfo {
  id: string;
  name: string;
  desc: string;
  color: string;
}

const archLayers: { label: string; modules: ModuleInfo[] }[] = [
  {
    label: "ORCHESTRATION",
    modules: [
      { id: "M1", name: "Project Hub", desc: "Strategy, iterations, target metrics", color: "#7F77DD" },
    ],
  },
  {
    label: "CONFIGURATION",
    modules: [
      { id: "M2", name: "Task Studio", desc: "Guidelines, rubrics, evaluation dimensions", color: "#1D9E75" },
      { id: "M3", name: "Workforce Hub", desc: "Annotator lifecycle, vetting, task routing", color: "#1D9E75" },
    ],
  },
  {
    label: "GENERATION",
    modules: [
      { id: "M4", name: "Model Gateway", desc: "Model endpoints, response generation", color: "#D85A30" },
      { id: "M5", name: "Prompt Engine", desc: "Prompt sourcing, diversity, coverage", color: "#D85A30" },
    ],
  },
  {
    label: "CORE EXECUTION",
    modules: [
      { id: "M6", name: "Annotation Workbench", desc: "The heart of the platform", color: "#378ADD" },
    ],
  },
  {
    label: "QUALITY & PROCESSING",
    modules: [
      { id: "M7", name: "Quality Control", desc: "Review pipelines, scoring, drift detection", color: "#BA7517" },
      { id: "M8", name: "Data Engine", desc: "Export, mixing, deduplication, splits", color: "#D4537E" },
    ],
  },
  {
    label: "INTELLIGENCE",
    modules: [
      { id: "M9", name: "Analytics & Insights", desc: "Cross-iteration learning, recommendations", color: "#7F77DD" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Module deep-dive data                                              */
/* ------------------------------------------------------------------ */

interface ModuleDeepDive {
  anchor: string;
  moduleId: string;
  name: string;
  tagline: string;
  color: string;
  capabilities: string[];
  bullets: string[];
}

const coreModules: ModuleDeepDive[] = [
  {
    anchor: "mod-task-studio",
    moduleId: "M2",
    name: "Task Studio",
    tagline: "The translation layer",
    color: "#1D9E75",
    capabilities: [
      "Task type templates",
      "Evaluation dimensions",
      "Safety taxonomy",
      "Guideline versioning",
      "Edge case library",
    ],
    bullets: [
      "Template system for 8 task types with default UX layouts and required fields",
      "Evaluation dimension builder: helpfulness, safety, honesty with definitions and scored examples",
      "Safety taxonomy: risk categories \u00d7 attack vectors matrix (from Meta\u2019s framework)",
      "Preference scale: 4-point strength rating with configurable labels and minimum thresholds",
      "Guideline version control: every change tracked with diffs, rationale, and data linkage",
      "Edge case library: adjudicated disagreements become future calibration tasks",
    ],
  },
  {
    anchor: "mod-workbench",
    moduleId: "M6",
    name: "Annotation Workbench",
    tagline: "The heart of the platform",
    color: "#378ADD",
    capabilities: [
      "Pairwise Preference",
      "Multi-Turn",
      "SFT Authoring",
      "Safety Red-Team",
      "Response Editing",
      "N-Way Ranking",
      "Rubric Scoring",
      "Model Arena",
    ],
    bullets: [
      "8 distinct task modes with purpose-built UX tailored to each annotation type",
      "Pairwise comparison: side-by-side responses with preference strength rating and optional rationale",
      "Red-team reframing: \u201cchoose best response per safety guidelines\u201d (solves Anthropic\u2019s hostage-negotiator problem)",
      "Real-time quality signals: personal calibration score, peer agreement rate, quality trend",
      "Keyboard-first: full shortcuts for selection, strength, submit, flag, skip",
      "Difficulty indicator: surface when responses are very similar, prompting careful evaluation",
    ],
  },
  {
    anchor: "mod-qcc",
    moduleId: "M7",
    name: "Quality Control Center",
    tagline: "The differentiator",
    color: "#BA7517",
    capabilities: [
      "Tiered review pipeline",
      "Drift detection",
      "Calibration nudges",
      "Coverage heatmap",
    ],
    bullets: [
      "Tiered review: auto-approve high-confidence, spot-check medium, mandatory review for low-confidence",
      "Composite quality score: golden-task accuracy + IAA + RM alignment + preference strength + time-spent",
      "Calibration drift detection: monitor quality trends within and across batches, alert on decline",
      "Coverage heatmap: real-time annotation coverage against safety taxonomy; highlight gaps",
      "Structured rejection feedback: categorized reasons flow back to annotators as corrective signals",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Workflow phases                                                    */
/* ------------------------------------------------------------------ */

const workflowPhases = [
  { num: 1, name: "Strategy & Objective Definition", desc: "What data to collect, which dimensions, target volume per batch", color: "#7F77DD" },
  { num: 2, name: "Task Design & Guidelines", desc: "Annotation instructions, rubrics, risk categories, attack vectors", color: "#1D9E75" },
  { num: 3, name: "Model & Prompt Setup", desc: "Deploy model variants, source prompts, enforce diversity targets", color: "#D85A30" },
  { num: 4, name: "Human Annotation", desc: "SFT authoring, preference comparison, red-team probing", color: "#378ADD" },
  { num: 5, name: "Quality Assurance", desc: "Review, score, filter, mix data across iterations", color: "#BA7517" },
  { num: 6, name: "Training & Evaluation", desc: "Train reward models, evaluate, generate iteration recommendations", color: "#D4537E" },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ProductDirectionPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedModule, setExpandedModule] = useState<string | null>("mod-task-studio");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* Scroll tracking via IntersectionObserver */
  useEffect(() => {
    const allIds = tocSections.flatMap((s) =>
      s.children ? [s.id, ...s.children.map((c) => c.id)] : [s.id]
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    allIds.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const ref = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  /* Helpers */
  const SectionTitle = ({
    num,
    title,
    id,
  }: {
    num: number;
    title: string;
    id: string;
  }) => (
    <h2
      id={id}
      ref={ref(id)}
      className="mb-5 mt-12 scroll-mt-24 border-b border-level-2 pb-3 font-literata text-[22px] font-semibold text-ink first:mt-8"
    >
      <span className="mr-2 text-tertiary-text">{num}.</span>
      {title}
    </h2>
  );

  return (
    <div className="flex gap-10">
      {/* ---- Sticky TOC sidebar ---- */}
      <aside className="sticky top-20 hidden w-[200px] shrink-0 self-start lg:block">
        <p className="mb-3 font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
          Contents
        </p>
        <nav className="space-y-0.5">
          {tocSections.map((s, i) => {
            const isParentActive =
              activeSection === s.id ||
              s.children?.some((c) => c.id === activeSection);
            return (
              <div key={s.id}>
                <button
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "block w-full border-l-2 py-1.5 pl-3 text-left font-inter text-[13px] transition-colors",
                    isParentActive
                      ? "border-deep-teal font-medium text-deep-teal"
                      : "border-transparent text-secondary-text hover:text-ink"
                  )}
                >
                  {i + 1}. {s.title}
                </button>
                {s.children && (
                  <div className="ml-4 space-y-0.5">
                    {s.children.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => scrollTo(c.id)}
                        className={cn(
                          "block w-full border-l-2 py-1 pl-3 text-left font-inter text-[12px] transition-colors",
                          activeSection === c.id
                            ? "border-deep-teal font-medium text-deep-teal"
                            : "border-transparent text-tertiary-text hover:text-secondary-text"
                        )}
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ---- Main content ---- */}
      <div className="min-w-0 max-w-[860px] flex-1 pb-20">
        {/* Header */}
        <div className="mb-2">
          <p className="font-inter text-[11px] font-medium uppercase tracking-[0.08em] text-tertiary-text">
            Product Direction
          </p>
          <h1 className="mt-1 font-literata text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
            DataForge: RLHF Data Collection Platform
          </h1>
          <p className="mt-3 font-inter text-[15px] leading-relaxed text-secondary-text">
            Background research, architectural thinking, and product strategy
            for an end-to-end platform that operationalizes RLHF data collection
            at scale.
          </p>
          <div className="mt-3 flex gap-4 font-inter text-[12px] text-tertiary-text">
            <span>Last updated: April 2026</span>
            <span className="text-level-2">|</span>
            <span>Version 1.0</span>
            <span className="text-level-2">|</span>
            <span>9 modules, 61 features</span>
          </div>
        </div>

        {/* ============================================================
            SECTION 1: OVERVIEW
            ============================================================ */}
        <SectionTitle num={1} title="Overview" id="overview" />

        <p className="font-inter text-[14px] leading-relaxed text-secondary-text">
          DataForge is an end-to-end platform for RLHF (Reinforcement Learning
          from Human Feedback) data collection. It operationalizes the entire
          cycle of aligning large language models using human preference data
          &mdash; from strategy definition through annotation, quality
          assurance, and training data export.
        </p>
        <p className="mt-3 font-inter text-[14px] leading-relaxed text-secondary-text">
          The platform design was informed by deep analysis of two seminal
          papers: Anthropic&apos;s &ldquo;Training a Helpful and Harmless
          Assistant with RLHF&rdquo; and Meta&apos;s Llama&nbsp;2 alignment
          methodology. These papers reveal a rich space of operational
          challenges that no existing tool adequately addresses.
        </p>

        {/* Task type badges */}
        <div className="mt-5">
          <p className="mb-2 font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
            Supported Task Types
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "SFT Authoring",
              "Pairwise Preference",
              "Multi-Turn Conversational",
              "Safety Red-Teaming",
              "Response Editing",
              "N-Way Ranking",
              "Rubric Scoring",
              "Model Arena",
            ].map((t) => (
              <span
                key={t}
                className="rounded-tight border border-level-2 bg-white px-2.5 py-1 font-inter text-[12px] text-ink"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Key stats row */}
        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            { label: "Pain points identified", value: "19", sub: "across 6 phases" },
            { label: "High severity", value: "8", sub: "require platform solutions" },
            { label: "Platform modules", value: "9", sub: "designed" },
            { label: "Features planned", value: "61", sub: "across 5 themes" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-standard border border-level-2 bg-white px-4 py-3"
            >
              <p className="font-inter text-[11px] font-medium uppercase tracking-[0.04em] text-tertiary-text">
                {s.label}
              </p>
              <p className="mt-1 font-literata text-[24px] font-semibold text-ink">
                {s.value}
              </p>
              <p className="font-inter text-[11px] text-tertiary-text">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ============================================================
            SECTION 2: RESEARCH FOUNDATION
            ============================================================ */}
        <SectionTitle num={2} title="Research Foundation" id="research" />

        <p className="mb-5 font-inter text-[14px] leading-relaxed text-secondary-text">
          Two papers formed the analytical foundation. Each reveals distinct
          operational patterns that define the space of requirements.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Anthropic */}
          <div className="rounded-comfortable border border-level-2 bg-white p-5">
            <p className="font-literata text-[16px] font-semibold text-ink">
              Anthropic
            </p>
            <p className="mt-0.5 font-inter text-[12px] italic text-tertiary-text">
              &ldquo;Training a Helpful and Harmless Assistant with RLHF&rdquo;
            </p>
            <ul className="mt-3 space-y-2 font-inter text-[13px] leading-relaxed text-secondary-text">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                Lean, iterative setup: ~30 vetted crowdworkers via MTurk and Upwork
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                Open-ended conversations, binary preference choice
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                Separate helpfulness and harmlessness (red-teaming) tracks
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                Weekly model updates with iterated online training
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                Lightweight QC: spot-checks only, ~63% inter-annotator agreement
              </li>
            </ul>
            <div className="mt-3 rounded-standard border-l-[3px] border-[#D97706] bg-[#FFFBEB] px-3 py-2">
              <p className="font-inter text-[12px] font-medium text-[#92400E]">
                Key finding: &ldquo;Hostage negotiator&rdquo; problem
              </p>
              <p className="mt-0.5 font-inter text-[11px] text-[#92400E]/80">
                Choosing &ldquo;more harmful&rdquo; made it impossible for models to learn
                good responses to harmful queries.
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="rounded-comfortable border border-level-2 bg-white p-5">
            <p className="font-literata text-[16px] font-semibold text-ink">
              Meta (Llama 2)
            </p>
            <p className="mt-0.5 font-inter text-[12px] italic text-tertiary-text">
              Llama 2 alignment methodology
            </p>
            <ul className="mt-3 space-y-2 font-inter text-[13px] leading-relaxed text-secondary-text">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                Industrial scale: 1.4M+ binary comparisons
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                4-stage annotator selection (grammar, alignment, ranking, writing)
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                4-point preference strength scale with margin-based loss
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                Separate helpfulness and safety reward models
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                Formal QA with content managers reviewing before training
              </li>
            </ul>
            <div className="mt-3 rounded-standard border-l-[3px] border-[#2563EB] bg-[#EFF6FF] px-3 py-2">
              <p className="font-inter text-[12px] font-medium text-[#1E40AF]">
                Key finding: Quality over quantity
              </p>
              <p className="mt-0.5 font-inter text-[11px] text-[#1E40AF]/80">
                A few thousand high-quality SFT annotations outperformed millions of
                lower-quality third-party examples.
              </p>
            </div>
          </div>
        </div>

        {/* Shared tensions */}
        <div className="mt-4 rounded-comfortable border border-level-2 bg-level-1 px-5 py-3">
          <p className="font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-tertiary-text">
            Shared Tensions Both Teams Hit
          </p>
          <div className="mt-2 flex gap-6">
            {[
              "Helpfulness vs. safety \u2014 both explicitly fought this tradeoff",
              "Signal degrades as models improve \u2014 preference choices become harder",
              "No standard for measuring annotation quality at scale",
            ].map((t) => (
              <p
                key={t}
                className="flex-1 font-inter text-[12px] leading-relaxed text-secondary-text"
              >
                {t}
              </p>
            ))}
          </div>
        </div>

        {/* ============================================================
            SECTION 3: STAKEHOLDER ARCHETYPES
            ============================================================ */}
        <SectionTitle
          num={3}
          title="Stakeholder Archetypes"
          id="stakeholders"
        />

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              role: "ML / Alignment Researcher",
              color: "#7F77DD",
              owns: "M1 Project Hub, M9 Analytics",
              tasks: [
                "Designs training methodology and evaluation criteria",
                "Defines what \u201cgood data\u201d looks like per iteration",
                "Needs fast iteration cycles and cross-batch visibility",
              ],
            },
            {
              role: "Task Designer / PM",
              color: "#1D9E75",
              owns: "M2 Task Studio, M3 Workforce Hub",
              tasks: [
                "Translates research goals into annotation guidelines",
                "Manages annotator pools and monitors quality",
                "Maintains living guidelines as edge cases emerge",
              ],
            },
            {
              role: "Annotator",
              color: "#378ADD",
              owns: "M6 Annotation Workbench",
              tasks: [
                "Has conversations with models, writes prompts",
                "Compares responses, writes SFT demonstrations",
                "Needs clear instructions, fair pay, real-time feedback",
              ],
            },
            {
              role: "QA Reviewer",
              color: "#BA7517",
              owns: "M7 Quality Control Center",
              tasks: [
                "Reviews annotations for consistency and safety",
                "Calibrates edge cases and builds golden dataset",
                "Provides structured rejection feedback",
              ],
            },
          ].map((p) => (
            <div
              key={p.role}
              className="rounded-comfortable border border-level-2 bg-white p-5"
              style={{ borderLeftWidth: 3, borderLeftColor: p.color }}
            >
              <p className="font-literata text-[15px] font-semibold text-ink">
                {p.role}
              </p>
              <p className="mt-1 font-inter text-[11px] text-tertiary-text">
                Owns: {p.owns}
              </p>
              <ul className="mt-3 space-y-1.5">
                {p.tasks.map((t) => (
                  <li
                    key={t}
                    className="flex gap-2 font-inter text-[13px] leading-snug text-secondary-text"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-text" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ============================================================
            SECTION 4: E2E WORKFLOW
            ============================================================ */}
        <SectionTitle num={4} title="E2E Workflow" id="workflow" />

        <p className="mb-5 font-inter text-[14px] leading-relaxed text-secondary-text">
          The RLHF data collection lifecycle spans six phases &mdash; from
          strategy definition to model deployment &mdash; with a weekly
          iteration loop that keeps the reward model re-distribution as models
          improve.
        </p>

        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <div className="space-y-0">
            {workflowPhases.map((wp, i) => (
              <div key={wp.num}>
                <div className="flex items-start gap-4 py-3">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                    style={{ backgroundColor: wp.color }}
                  >
                    {wp.num}
                  </div>
                  <div className="min-w-0">
                    <p className="font-inter text-[14px] font-medium text-ink">
                      {wp.name}
                    </p>
                    <p className="mt-0.5 font-inter text-[13px] text-tertiary-text">
                      {wp.desc}
                    </p>
                  </div>
                </div>
                {i < workflowPhases.length - 1 && (
                  <div className="ml-[13px] h-3 w-px bg-level-2" />
                )}
              </div>
            ))}
          </div>
          {/* Iteration loop callout */}
          <div className="mt-3 flex items-center gap-2 rounded-standard bg-level-1 px-4 py-2.5">
            <span className="font-inter text-[16px] text-deep-teal">&circlearrowleft;</span>
            <p className="font-inter text-[13px] font-medium text-deep-teal">
              Weekly iteration loop back to Phase 1
            </p>
            <span className="ml-auto font-inter text-[12px] text-tertiary-text">
              Anthropic ran 5+ week cycles; Meta ran 14 batch stages
            </span>
          </div>
        </div>

        {/* ============================================================
            SECTION 5: PAIN POINT ANALYSIS
            ============================================================ */}
        <SectionTitle num={5} title="Pain Point Analysis" id="pain-points" />

        <p className="mb-4 font-inter text-[14px] leading-relaxed text-secondary-text">
          19 pain points were identified across all six phases. The
          highest-severity cluster is in Phase 4 (Human Annotation) &mdash;
          where human judgment, model behavior, task design, and quality control
          all collide.
        </p>

        {/* Legend */}
        <div className="mb-4 flex gap-5 rounded-standard bg-level-1 px-4 py-2.5">
          {(["high", "med", "low"] as const).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className="h-1.5 w-6 rounded-full"
                style={{ backgroundColor: severityMeta[s].color }}
              />
              <span className="font-inter text-[12px] text-secondary-text">
                {s === "high"
                  ? "High \u2014 data quality / pipeline failure"
                  : s === "med"
                    ? "Medium \u2014 efficiency loss"
                    : "Low \u2014 friction"}
              </span>
            </div>
          ))}
        </div>

        {/* Pain point bars */}
        <div className="space-y-5">
          {painPhases.map((phase) => (
            <div key={phase.name}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
                <p className="font-inter text-[13px] font-medium text-ink">
                  {phase.name}
                </p>
              </div>
              <div className="space-y-1">
                {phase.points.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 py-1"
                  >
                    <span className="w-7 font-mono text-[11px] text-tertiary-text">
                      {p.id}
                    </span>
                    <span className="min-w-0 flex-1 font-inter text-[13px] text-secondary-text">
                      {p.desc}
                    </span>
                    <div className="w-28 shrink-0">
                      <div
                        className="h-[6px] rounded-full"
                        style={{
                          width: severityMeta[p.severity].width,
                          backgroundColor: severityMeta[p.severity].color,
                        }}
                      />
                    </div>
                    <span className="w-14 text-right font-inter text-[11px] text-tertiary-text">
                      {severityMeta[p.severity].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================
            SECTION 6: PLATFORM ARCHITECTURE
            ============================================================ */}
        <SectionTitle
          num={6}
          title="Platform Architecture"
          id="architecture"
        />

        <p className="mb-5 font-inter text-[14px] leading-relaxed text-secondary-text">
          Nine modules organized in three concentric rings. The inner ring runs
          the real-time annotation loop. The middle ring configures, manages, and
          processes. The outer ring sets direction and learns across iterations.
        </p>

        <div className="space-y-3">
          {archLayers.map((layer) => (
            <div key={layer.label}>
              <p className="mb-1.5 pl-1 font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                {layer.label}
              </p>
              <div
                className={cn(
                  "gap-3",
                  layer.modules.length > 1
                    ? "grid grid-cols-2"
                    : "grid grid-cols-1"
                )}
              >
                {layer.modules.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start gap-3 rounded-comfortable border border-level-2 bg-white px-4 py-3"
                    style={{ borderLeftWidth: 3, borderLeftColor: m.color }}
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.id.replace("M", "")}
                    </span>
                    <div>
                      <p className="font-inter text-[13px] font-medium text-ink">
                        {m.name}
                      </p>
                      <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback loops */}
        <div className="mt-6 rounded-comfortable border border-level-2 bg-level-1 p-5">
          <p className="mb-3 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-tertiary-text">
            Three Critical Feedback Loops
          </p>
          <div className="space-y-3">
            {[
              {
                name: "Annotator calibration",
                path: "M7 \u2192 M3 \u2192 M6",
                desc: "Quality signals trigger calibration tasks and difficulty routing in real time",
              },
              {
                name: "Guideline evolution",
                path: "M7 \u2192 M2 \u2192 M6",
                desc: "Disagreement patterns surface rubric ambiguities; refined guidelines propagate to all annotators",
              },
              {
                name: "Iteration strategy",
                path: "M9 \u2192 M1 \u2192 Generation",
                desc: "Cross-iteration analytics drive next-batch volume, mix ratios, and prompt emphasis",
              },
            ].map((loop, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-deep-teal text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-inter text-[13px] text-ink">
                    <span className="font-medium">{loop.name}</span>
                    <span className="mx-2 font-mono text-[11px] text-tertiary-text">
                      {loop.path}
                    </span>
                  </p>
                  <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
                    {loop.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            SECTION 7: CORE MODULE DEEP DIVES
            ============================================================ */}
        <SectionTitle num={7} title="Core Module Deep Dives" id="modules" />

        <p className="mb-5 font-inter text-[14px] leading-relaxed text-secondary-text">
          Three modules represent the core differentiation &mdash; where the
          platform wins or loses against manual processes. Together they address
          15 of the 19 pain points identified.
        </p>

        <div className="space-y-4">
          {coreModules.map((mod) => {
            const isExpanded = expandedModule === mod.anchor;
            return (
              <div
                key={mod.anchor}
                id={mod.anchor}
                ref={ref(mod.anchor)}
                className="scroll-mt-24 overflow-hidden rounded-comfortable border border-level-2 bg-white"
              >
                {/* Module header — clickable */}
                <button
                  onClick={() =>
                    setExpandedModule(isExpanded ? null : mod.anchor)
                  }
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-level-1"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: mod.color }}
                  >
                    {mod.moduleId.replace("M", "")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-inter text-[15px] font-semibold text-ink">
                      {mod.moduleId}: {mod.name}
                    </span>
                    <span className="ml-2 font-inter text-[13px] italic text-tertiary-text">
                      {mod.tagline}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-tertiary-text transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-level-2 px-5 py-4">
                    {/* Capability pills */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {mod.capabilities.map((c) => (
                        <span
                          key={c}
                          className="rounded-tight border px-2.5 py-1 font-inter text-[11px] font-medium"
                          style={{
                            borderColor: mod.color + "40",
                            color: mod.color,
                            backgroundColor: mod.color + "0D",
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    {/* Bullets */}
                    <ul className="space-y-2">
                      {mod.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-2 font-inter text-[13px] leading-relaxed text-secondary-text"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: mod.color }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================
            SECTION 8: STRATEGIC PATTERNS
            ============================================================ */}
        <SectionTitle num={8} title="Strategic Patterns" id="patterns" />

        <p className="mb-5 font-inter text-[14px] leading-relaxed text-secondary-text">
          Three cross-cutting patterns emerged from the research that should
          shape every product decision:
        </p>

        <div className="space-y-4">
          {[
            {
              num: "01",
              title: "Pain concentrates in human annotation",
              body: "Six pain points in Phase 4, four of high severity. This is where human judgment, model behavior, task design, and quality control collide. The platform\u2019s center of gravity.",
              borderColor: "#E24B4A",
            },
            {
              num: "02",
              title: "Value lives in the feedback loops, not the phases",
              body: "The biggest value isn\u2019t making any single phase better \u2014 it\u2019s tightening the loops between them. Information not flowing fast enough between stakeholders is the systemic failure mode.",
              borderColor: "#BA7517",
            },
            {
              num: "03",
              title: "The degradation paradox",
              body: "As the pipeline succeeds (models get better), data collection gets harder. Responses become more similar, annotators struggle to distinguish, preference signals weaken. The platform must be designed for this \u2014 it can\u2019t just optimize for the easy early-stage case.",
              borderColor: "#7F77DD",
            },
          ].map((p) => (
            <div
              key={p.num}
              className="rounded-comfortable border border-level-2 bg-white px-5 py-4"
              style={{ borderLeftWidth: 4, borderLeftColor: p.borderColor }}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="font-mono text-[20px] font-bold"
                  style={{ color: p.borderColor }}
                >
                  {p.num}
                </span>
                <p className="font-literata text-[16px] font-semibold text-ink">
                  {p.title}
                </p>
              </div>
              <p className="mt-2 pl-9 font-inter text-[13px] leading-relaxed text-secondary-text">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Link to roadmap */}
        <div className="mt-10 flex items-center justify-between rounded-comfortable border border-deep-teal/20 bg-[#E6F2F2] px-5 py-4">
          <div>
            <p className="font-inter text-[14px] font-medium text-deep-teal">
              See the full feature roadmap
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-deep-teal/70">
              61 features across 5 phases with impact and differentiator tags
            </p>
          </div>
          <Link
            href="/roadmap"
            className="flex items-center gap-2 rounded-standard bg-deep-teal px-4 py-2 font-inter text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            View Roadmap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
