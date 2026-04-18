"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const tocSections = [
  "Overview",
  "Research Foundation",
  "Stakeholder Archetypes",
  "E2E Workflow",
  "Pain Point Analysis",
  "Platform Architecture",
  "Core Module Deep Dives",
  "Feature Roadmap",
  "Strategic Patterns",
];

const stakeholders = [
  {
    name: "ML / Alignment Researcher",
    description:
      'Designs training methodology, defines what "good data" looks like, needs to iterate fast. The client.',
    color: "#7F77DD",
  },
  {
    name: "Task Designer / PM",
    description:
      "Translates research goals into annotation guidelines, manages annotator pools, monitors quality.",
    color: "#1D9E75",
  },
  {
    name: "Annotator",
    description:
      "Has conversations with models, writes prompts, chooses responses, writes demonstrations.",
    color: "#378ADD",
  },
  {
    name: "QA Reviewer",
    description:
      "Reviews annotations for consistency, instruction-following, grammar, and safety compliance.",
    color: "#BA7517",
  },
];

const workflowPhases = [
  { name: "Phase 1: Strategy & Objective Definition", bg: "#3C3489", text: "#CECBF6" },
  { name: "Phase 2: Task Design", bg: "#085041", text: "#9FE1CB" },
  { name: "Phase 3: Model & Prompt Setup", bg: "#085041", text: "#9FE1CB" },
  { name: "Phase 4: Human Annotation", bg: "#0C447C", text: "#B5D4F4" },
  { name: "Phase 5: Quality Assurance", bg: "#633806", text: "#FAC775" },
  { name: "Phase 6: Model Training & Evaluation", bg: "#72243E", text: "#F4C0D1" },
];

const painPhases = [
  { name: "Strategy", color: "#7F77DD", bars: [8, 6, 5] as const, colors: ["#E24B4A", "#EF9F27", "#EF9F27"] as const },
  { name: "Task Design", color: "#1D9E75", bars: [6, 9, 4] as const, colors: ["#EF9F27", "#E24B4A", "#1D9E75"] as const },
  { name: "Model / Prompt", color: "#D85A30", bars: [6, 8, 4] as const, colors: ["#EF9F27", "#E24B4A", "#1D9E75"] as const },
  { name: "Annotation", color: "#378ADD", bars: [9, 7, 10, 6, 6, 7] as const, colors: ["#E24B4A", "#E24B4A", "#E24B4A", "#EF9F27", "#EF9F27", "#E24B4A"] as const },
  { name: "QA / Processing", color: "#BA7517", bars: [7, 6, 6, 6] as const, colors: ["#E24B4A", "#EF9F27", "#EF9F27", "#EF9F27"] as const },
  { name: "Training / Eval", color: "#D4537E", bars: [6, 8, 6] as const, colors: ["#EF9F27", "#E24B4A", "#EF9F27"] as const },
];

const modules = [
  { id: "M1", name: "Project Hub", layer: "ORCHESTRATION", color: "#7F77DD", desc: "Strategy, iterations, target metrics" },
  { id: "M2", name: "Task Studio", layer: "CONFIGURATION", color: "#1D9E75" },
  { id: "M3", name: "Workforce Hub", layer: "CONFIGURATION", color: "#1D9E75" },
  { id: "M4", name: "Model Gateway", layer: "GENERATION", color: "#D85A30" },
  { id: "M5", name: "Prompt Engine", layer: "GENERATION", color: "#D85A30" },
  { id: "M6", name: "Annotation Workbench", layer: "CORE EXECUTION", color: "#378ADD", desc: "The heart of the platform" },
  { id: "M7", name: "Quality Control", layer: "QUALITY & PROCESSING", color: "#BA7517" },
  { id: "M8", name: "Data Engine", layer: "QUALITY & PROCESSING", color: "#D4537E" },
  { id: "M9", name: "Analytics & Insights", layer: "INTELLIGENCE", color: "#7F77DD", desc: "Cross-iteration learning, closes the loop" },
];

const coreModules = [
  {
    id: "M2",
    name: "Task Studio",
    subtitle: "The translation layer",
    color: "#1D9E75",
    description:
      "Where research intent becomes executable annotation work. The core insight: task design is not a one-time activity. Anthropic was amending guidelines via Slack messages. Meta iterated through 14 batch stages. Task Studio treats guidelines as living, versioned artifacts.",
    tags: ["Task type templates", "Evaluation dimensions", "Safety taxonomy", "Guideline versioning", "Edge case library"],
  },
  {
    id: "M6",
    name: "Annotation Workbench",
    subtitle: "The heart",
    color: "#378ADD",
    description:
      "Faces a fundamental tension: simple enough for annotators to work quickly at scale, but structured enough for high-quality data. Anthropic\u2019s 63% IAA suggests insufficient scaffolding; over-structuring kills throughput. Eight distinct task modes serve different annotation workflows.",
    tags: ["Pairwise Preference", "Multi-Turn", "SFT Authoring", "Safety Red-Team", "Response Editing", "N-Way Ranking", "Rubric Scoring", "Model Arena"],
  },
  {
    id: "M7",
    name: "Quality Control Center",
    subtitle: "The intelligence layer",
    color: "#BA7517",
    description:
      "Where the platform earns its premium over manual processes. Answers the question both papers struggled with: is this data actually good enough to train on? Combines golden-task accuracy, IAA, RM alignment, preference strength, and time-spent into a composite confidence score.",
    tags: ["Tiered review pipeline", "RM alignment scoring", "Drift detection", "Calibration nudges", "Coverage heatmap"],
  },
];

const patterns = [
  {
    num: "01",
    title: "Pain concentrates in human annotation",
    body: "Six pain points in Phase 4, four high severity. This is where human judgment, model behavior, task design, and quality control collide. The platform\u2019s center of gravity.",
  },
  {
    num: "02",
    title: "Value lives in the feedback loops, not the phases",
    body: "The biggest value isn\u2019t in making any single phase better, but in tightening the loops between them. Information not flowing fast enough between stakeholders is the systemic failure mode.",
  },
  {
    num: "03",
    title: "The degradation paradox",
    body: "As the pipeline succeeds (models get better), data collection gets harder. Responses become more similar, annotators struggle to distinguish, preference signals weaken. The platform must be designed for this \u2014 it can\u2019t just optimize for the early-stage case.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProductDirectionPage() {
  return (
    <div className="flex min-h-screen bg-off-white">
      {/* Document outline */}
      <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-level-2 px-5 pt-7 pb-10">
        <Link
          href="/login"
          className="mb-4 flex items-center gap-2 font-inter text-[12px] text-secondary-text transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
        <span className="mb-3 font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
          Contents
        </span>
        {tocSections.map((s, i) => (
          <a
            key={s}
            href={`#section-${i + 1}`}
            className="rounded-tight px-2.5 py-1.5 font-inter text-[13px] text-secondary-text transition-colors hover:bg-level-1 hover:text-ink"
          >
            {i + 1}. {s}
          </a>
        ))}
      </aside>

      {/* Document body */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="border-b border-level-2 px-12 pt-10 pb-8">
          <p className="mb-2 font-inter text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
            Product Direction
          </p>
          <h1 className="font-literata text-[28px] font-semibold leading-tight text-deep-teal">
            DataForge: RLHF Data Collection Platform
          </h1>
          <p className="mt-2 font-literata text-[16px] leading-relaxed text-secondary-text">
            Background research, architectural thinking, and product strategy for
            an end-to-end platform that operationalizes RLHF data collection at
            scale.
          </p>
          <div className="mt-3 flex gap-6 font-inter text-[12px] text-tertiary-text">
            <span>Last updated: April 2026</span>
            <span>Version 1.0</span>
            <span>9 modules, 78 features</span>
          </div>
        </header>

        {/* Section 1: Overview */}
        <section id="section-1" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            1. Overview
          </h2>
          <p className="mb-4 font-literata text-[15px] leading-[1.75] text-ink/85">
            DataForge is an end-to-end platform for RLHF (Reinforcement Learning
            from Human Feedback) data collection. It operationalizes the entire
            cycle of aligning large language models using human preference data —
            from strategy definition through annotation, quality assurance, and
            training data export.
          </p>
          <p className="mb-6 font-literata text-[15px] leading-[1.75] text-ink/85">
            The platform design was informed by deep analysis of two seminal
            papers: Anthropic&apos;s &ldquo;Training a Helpful and Harmless
            Assistant with RLHF&rdquo; and Meta&apos;s Llama 2 alignment
            methodology. These papers reveal a rich space of operational
            challenges that no existing tool adequately addresses.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-comfortable bg-level-1 px-5 py-4">
              <p className="mb-1 font-inter text-[11px] font-medium uppercase tracking-[0.04em] text-tertiary-text">
                Stakeholders
              </p>
              <p className="font-inter text-[13px] leading-snug text-ink/80">
                ML Researcher, Task Designer, Annotator, QA Reviewer
              </p>
            </div>
            <div className="rounded-comfortable bg-level-1 px-5 py-4">
              <p className="mb-1 font-inter text-[11px] font-medium uppercase tracking-[0.04em] text-tertiary-text">
                Task types
              </p>
              <p className="font-inter text-[13px] leading-snug text-ink/80">
                SFT Authoring, Pairwise Preference, Red-Team, Multi-Turn,
                Response Editing, N-Way Ranking, Rubric Scoring, Model Arena
              </p>
            </div>
            <div className="rounded-comfortable bg-level-1 px-5 py-4">
              <p className="mb-1 font-inter text-[11px] font-medium uppercase tracking-[0.04em] text-tertiary-text">
                Pain points identified
              </p>
              <p className="font-inter text-[13px] leading-snug text-ink/80">
                19 pain points across 6 phases, 8 rated high severity
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Research Foundation */}
        <section id="section-2" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            2. Research Foundation
          </h2>
          <p className="mb-6 font-literata text-[15px] leading-[1.75] text-ink/85">
            Two papers formed the analytical foundation for this platform. Each
            reveals distinct operational patterns that define the space of
            requirements.
          </p>
          <div className="grid grid-cols-2 gap-5">
            {[
              {
                name: "Anthropic",
                paper: "\u201cTraining a Helpful and Harmless Assistant with RLHF\u201d",
                body: "Lean, iterative setup. ~30 vetted crowdworkers across MTurk and Upwork. Open-ended conversations, two responses per turn, weekly model updates. Lightweight QA via spot-checks. 63% inter-annotator agreement.",
                finding: 'The "hostage negotiator" problem \u2014 having annotators choose the more harmful response during red-teaming made it structurally impossible for models to learn good responses to harmful queries.',
              },
              {
                name: "Meta (Llama 2)",
                paper: "Llama 2 alignment methodology",
                body: "Industrial-scale. 1.4M+ binary comparisons. 4-stage annotator selection. 4-point preference strength scale. Separate helpfulness and safety reward models. Margin-based loss leveraging preference strength signal.",
                finding: "A few thousand high-quality SFT annotations outperformed millions of lower-quality third-party examples. Quality over quantity is the defining tradeoff.",
              },
            ].map((r) => (
              <div key={r.name} className="rounded-comfortable border border-level-2 p-5">
                <h3 className="mb-1 font-inter text-[14px] font-semibold text-ink">{r.name}</h3>
                <p className="mb-3 font-literata text-[13px] italic text-secondary-text">{r.paper}</p>
                <p className="mb-4 font-literata text-[14px] leading-relaxed text-ink/80">{r.body}</p>
                <div className="border-t border-level-2 pt-3">
                  <p className="mb-1 font-inter text-[11px] font-medium uppercase text-tertiary-text">Key finding</p>
                  <p className="font-literata text-[13px] leading-snug text-[#D85A30]">{r.finding}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Stakeholder Archetypes */}
        <section id="section-3" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-5 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            3. Stakeholder Archetypes
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {stakeholders.map((s) => (
              <div
                key={s.name}
                className="rounded-none border-l-[3px] bg-level-1 px-4 py-4"
                style={{ borderLeftColor: s.color }}
              >
                <h3 className="mb-1.5 font-inter text-[13px] font-semibold text-ink">{s.name}</h3>
                <p className="font-literata text-[13px] leading-snug text-secondary-text">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: E2E Workflow */}
        <section id="section-4" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            4. End-to-End Workflow
          </h2>
          <p className="mb-6 font-literata text-[15px] leading-[1.75] text-ink/85">
            The RLHF data collection lifecycle spans six phases — from strategy
            definition to model deployment — with a weekly iteration loop that
            keeps the reward model on-distribution as models improve.
          </p>
          <div className="overflow-hidden rounded-comfortable border border-level-2">
            <div className="flex items-center gap-2 border-b border-level-2 bg-level-1 px-4 py-2.5">
              <span className="h-2 w-2 rounded-sm bg-tertiary-text" />
              <span className="font-inter text-[11px] font-medium text-secondary-text">FIGURE 1</span>
              <span className="font-inter text-[11px] text-tertiary-text">E2E RLHF Data Collection Workflow</span>
            </div>
            <div className="flex flex-col gap-2 bg-[#1A1A19] p-6">
              {workflowPhases.map((p, i) => (
                <div key={p.name}>
                  <div
                    className="flex items-center justify-center rounded-comfortable px-4 py-3"
                    style={{ backgroundColor: p.bg }}
                  >
                    <span className="font-inter text-[12px] font-medium" style={{ color: p.text }}>
                      {p.name}
                    </span>
                  </div>
                  {i < workflowPhases.length - 1 && (
                    <div className="flex justify-center py-1 text-[14px] text-white/30">&darr;</div>
                  )}
                </div>
              ))}
              <div className="mt-1 flex justify-center">
                <span className="rounded-tight border border-dashed border-white/25 px-3 py-1 font-inter text-[11px] text-white/50">
                  &#8635; Weekly iteration cycle back to Phase 3
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 font-literata text-[14px] italic leading-relaxed text-secondary-text">
            Both Anthropic and Meta ran this cycle weekly. Anthropic ran 5+
            weeks; Meta ran 14+ batches (RLHF V1 through V5). The platform must
            operationalize this entire cycle and make it repeatable,
            configurable, and scalable.
          </p>
        </section>

        {/* Section 5: Pain Points */}
        <section id="section-5" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            5. Pain Point Analysis
          </h2>
          <p className="mb-6 font-literata text-[15px] leading-[1.75] text-ink/85">
            19 pain points were identified across all six phases. The
            highest-severity cluster is in Phase 4 (Human Annotation) — where
            human judgment, model behavior, task design, and quality control all
            collide.
          </p>
          <div className="overflow-hidden rounded-comfortable border border-level-2">
            <div className="flex items-center gap-2 border-b border-level-2 bg-level-1 px-4 py-2.5">
              <span className="h-2 w-2 rounded-sm bg-tertiary-text" />
              <span className="font-inter text-[11px] font-medium text-secondary-text">FIGURE 2</span>
              <span className="font-inter text-[11px] text-tertiary-text">Pain Point Severity Map</span>
            </div>
            <div className="flex flex-col gap-3 bg-level-1/50 p-5">
              <div className="mb-2 flex gap-4">
                {[
                  { color: "#E24B4A", label: "High — data quality / pipeline failure" },
                  { color: "#EF9F27", label: "Medium — efficiency loss" },
                  { color: "#1D9E75", label: "Low — friction" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="h-[5px] w-5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="font-inter text-[11px] text-secondary-text">{l.label}</span>
                  </div>
                ))}
              </div>
              {painPhases.map((phase) => (
                <div key={phase.name} className="flex items-center gap-2">
                  <span
                    className="w-24 shrink-0 font-inter text-[11px] font-medium"
                    style={{ color: phase.color }}
                  >
                    {phase.name}
                  </span>
                  <div className="flex flex-1 items-center gap-1.5">
                    {phase.bars.map((w, i) => (
                      <span
                        key={i}
                        className="h-[5px] rounded-full"
                        style={{ backgroundColor: phase.colors[i], flex: w }}
                      />
                    ))}
                    <span style={{ flex: 30 - phase.bars.reduce((a, b) => a + b, 0) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Platform Architecture */}
        <section id="section-6" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            6. Platform Architecture
          </h2>
          <p className="mb-6 font-literata text-[15px] leading-[1.75] text-ink/85">
            Nine modules organized in three concentric rings. The inner ring runs
            the real-time annotation loop. The middle ring configures, manages,
            and processes. The outer ring sets direction and learns across
            iterations.
          </p>
          <div className="overflow-hidden rounded-comfortable border border-level-2">
            <div className="flex items-center gap-2 border-b border-level-2 bg-level-1 px-4 py-2.5">
              <span className="h-2 w-2 rounded-sm bg-tertiary-text" />
              <span className="font-inter text-[11px] font-medium text-secondary-text">FIGURE 3</span>
              <span className="font-inter text-[11px] text-tertiary-text">Platform Module Architecture</span>
            </div>
            <div className="flex flex-col gap-2.5 bg-level-1/50 p-5">
              {Array.from(new Set(modules.map((m) => m.layer))).map((layer) => (
                <div key={layer}>
                  <p className="mb-1.5 font-inter text-[10px] font-medium uppercase tracking-[0.05em] text-tertiary-text">
                    {layer}
                  </p>
                  <div className="flex gap-2">
                    {modules
                      .filter((m) => m.layer === layer)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="flex flex-1 items-center gap-2 rounded-none border-l-[3px] bg-white px-3 py-2.5"
                          style={{ borderLeftColor: m.color }}
                        >
                          <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: m.color }} />
                          <span className="font-inter text-[12px] font-medium text-ink">
                            {m.id} {m.name}
                          </span>
                          {m.desc && (
                            <span className="font-inter text-[11px] text-tertiary-text">{m.desc}</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 font-literata text-[15px] leading-[1.75] text-ink/85">
            Three critical feedback loops tie the modules together: (1) Annotator
            calibration: M7 &rarr; M3 &rarr; M6, (2) Guideline evolution: M7
            &rarr; M2, and (3) Iteration strategy: M9 &rarr; M1 &rarr;
            generation layer. These loops are the platform&apos;s primary
            competitive moat.
          </p>
        </section>

        {/* Section 7: Core Module Deep Dives */}
        <section id="section-7" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            7. Core Module Deep Dives
          </h2>
          <p className="mb-6 font-literata text-[15px] leading-[1.75] text-ink/85">
            Three modules represent the core differentiation — where the platform
            wins or loses against manual processes. Together they address 15 of
            the 19 pain points identified.
          </p>
          <div className="flex flex-col gap-4">
            {coreModules.map((mod) => (
              <div key={mod.id} className="rounded-comfortable border border-level-2 p-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: mod.color }} />
                  <h3 className="font-inter text-[15px] font-semibold text-ink">
                    {mod.id}: {mod.name}
                  </h3>
                  <span className="font-inter text-[12px] text-tertiary-text">{mod.subtitle}</span>
                </div>
                <p className="mb-4 font-literata text-[14px] leading-relaxed text-ink/80">
                  {mod.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-tight px-2.5 py-1 font-inter text-[11px]"
                      style={{ backgroundColor: mod.color + "1A", color: mod.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Feature Roadmap (link) */}
        <section id="section-8" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            8. Feature Roadmap
          </h2>
          <p className="mb-4 font-literata text-[15px] leading-[1.75] text-ink/85">
            78 features across five themes — Core Pipeline (19), Intelligence
            (16), AI-Augmented (12), Scale (8), and Ecosystem (6) — organized
            into a phased delivery plan.
          </p>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-comfortable border border-level-2 bg-white px-5 py-3 font-inter text-[13px] font-medium text-ink transition-colors hover:bg-level-1"
          >
            View full Product Roadmap &rarr;
          </Link>
        </section>

        {/* Section 9: Strategic Patterns */}
        <section id="section-9" className="scroll-mt-4 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            9. Strategic Patterns
          </h2>
          <p className="mb-6 font-literata text-[15px] leading-[1.75] text-ink/85">
            Three cross-cutting patterns emerged from the research that should
            shape every product decision:
          </p>
          <div className="flex flex-col gap-3">
            {patterns.map((p) => (
              <div key={p.num} className="rounded-comfortable bg-deep-teal p-5">
                <div className="mb-2 flex items-baseline gap-2.5">
                  <span className="font-mono text-[12px] font-medium text-[#5DCA7A]">{p.num}</span>
                  <h3 className="font-inter text-[14px] font-semibold text-off-white">{p.title}</h3>
                </div>
                <p className="pl-7 font-literata text-[14px] leading-relaxed text-white/65">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
