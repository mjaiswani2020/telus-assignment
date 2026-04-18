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






/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

interface PainItem {
  id: string;
  desc: string;
  severity: string;
  barColor: string;
  barWidth: number;
}

function PainPhaseBlock({ color, name, items }: { color: string; name: string; items: PainItem[] }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-inter text-[14px] font-medium text-ink" dangerouslySetInnerHTML={{ __html: name }} />
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          className="flex items-center gap-2 py-1.5"
          style={{ borderBottom: i < items.length - 1 ? "1px solid var(--color-border-tertiary, #e5e5e3)" : "none" }}
        >
          <span className="min-w-[28px] font-mono text-[11px] text-tertiary-text">{item.id}</span>
          <span className="flex-1 font-inter text-[13px] text-secondary-text">{item.desc}</span>
          <div className="flex w-[140px] shrink-0 items-center gap-1.5">
            <span className="h-1.5 rounded-full" style={{ backgroundColor: item.barColor, width: item.barWidth }} />
          </div>
          <span className="min-w-[60px] text-right font-inter text-[11px] text-tertiary-text">{item.severity}</span>
        </div>
      ))}
    </div>
  );
}

function ModuleCard({ color, name, num, desc, pain }: { color: string; name: string; num: string; desc: string; pain: string }) {
  return (
    <div
      className="rounded-r-lg border border-level-2 border-l-[3px] bg-white p-3.5"
      style={{ borderLeftColor: color }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-inter text-[14px] font-medium text-ink" dangerouslySetInnerHTML={{ __html: name }} />
        <span className="font-mono text-[11px] text-tertiary-text">{num}</span>
      </div>
      <p className="font-inter text-[13px] leading-relaxed text-secondary-text">{desc}</p>
      <p className="mt-1.5 border-t border-level-2 pt-1.5 font-inter text-[12px] text-[#BA7517]">{pain}</p>
    </div>
  );
}

function ModuleSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1.5">
      <p className="mb-1.5 pl-1 font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-tertiary-text" dangerouslySetInnerHTML={{ __html: label }} />
      {children}
    </div>
  );
}

function FlowArrow({ label, up }: { label: string; up?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      <span className="text-[16px] text-tertiary-text">&darr;</span>
      <span className="rounded-md border border-dashed border-level-2 px-2.5 py-1 font-inter text-[12px] text-tertiary-text">{label}</span>
      <span className="text-[16px] text-tertiary-text">{up ? "\u2191" : "\u2193"}</span>
    </div>
  );
}

function DeepDiveModule({ color, id, name, subtitle, children }: { color: string; id: string; name: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-comfortable border border-level-2 p-5">
      <div className="mb-4 flex items-center gap-2.5 border-b border-level-2 pb-3">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="font-inter text-[16px] font-semibold text-ink">{id}: {name}</h3>
        <span className="font-inter text-[13px] text-tertiary-text">{subtitle}</span>
      </div>
      {children}
    </div>
  );
}

function DeepDiveGroup({ title, rationale, children }: { title: string; rationale?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="mb-2 border-b border-level-2 pb-1.5 font-inter text-[14px] font-medium text-ink">{title}</h4>
      {rationale && (
        <p className="mb-2 rounded-md bg-level-1 px-3 py-2 font-inter text-[13px] leading-relaxed text-secondary-text">{rationale}</p>
      )}
      {children}
    </div>
  );
}

interface FeatTag { label: string; type: "pain" | "new" | "critical" }

function Feat({ color, name, desc, tags }: { color: string; name: string; desc: string; tags?: FeatTag[] }) {
  const tagStyles: Record<string, string> = {
    pain: "bg-[#EF9F27]/15 text-[#BA7517]",
    new: "bg-[#378ADD]/15 text-[#378ADD]",
    critical: "bg-[#E24B4A]/15 text-[#E24B4A]",
  };
  return (
    <div className="my-2 rounded-r-md border-l-2 bg-level-1 px-3.5 py-2.5" style={{ borderLeftColor: color }}>
      <p className="mb-1 font-inter text-[13px] font-medium text-ink">{name}</p>
      <p className="font-inter text-[13px] leading-relaxed text-secondary-text">
        {desc}
        {tags?.map((t) => (
          <span key={t.label} className={`ml-1.5 inline-block rounded px-1.5 py-0.5 font-mono text-[11px] ${tagStyles[t.type]}`}>{t.label}</span>
        ))}
      </p>
    </div>
  );
}

function DeepDiveConnections({ connections }: { connections: { label: string; desc: string }[] }) {
  return (
    <div className="mb-2">
      <h4 className="mb-2 font-inter text-[13px] font-medium text-tertiary-text">Key connections</h4>
      {connections.map((c) => (
        <div key={c.label} className="my-1.5 rounded-md border border-dashed border-level-2 px-3.5 py-2.5">
          <p className="mb-1 font-inter text-[12px] font-medium text-tertiary-text">{c.label}</p>
          <p className="font-inter text-[13px] text-secondary-text">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

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
        </header>

        {/* Section 1: Overview */}
        <section id="section-1" className="scroll-mt-4 border-b border-level-2 px-12 py-10">
          <h2 className="mb-4 font-inter text-[12px] font-medium uppercase tracking-[0.04em] text-[#1D9E75]">
            1. Overview
          </h2>
          <p className="mb-4 font-literata text-[15px] leading-[1.75] text-ink/85">
            DataForge is an end-to-end platform for RLHF data collection. It operationalizes the entire
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
              },
              {
                name: "Meta (Llama 2)",
                paper: "Llama 2 alignment methodology",
                body: "Industrial-scale. 1.4M+ binary comparisons. 4-stage annotator selection. 4-point preference strength scale. Separate helpfulness and safety reward models. Margin-based loss leveraging preference strength signal.",
              },
            ].map((r) => (
              <div key={r.name} className="rounded-comfortable border border-level-2 p-5">
                <h3 className="mb-1 font-inter text-[14px] font-semibold text-ink">{r.name}</h3>
                <p className="mb-3 font-literata text-[13px] italic text-secondary-text">{r.paper}</p>
                <p className="mb-4 font-literata text-[14px] leading-relaxed text-ink/80">{r.body}</p>
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
            <div className="bg-[#1A1A19] p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/rlhf_data_collection_e2e_workflow.svg"
                alt="End-to-end RLHF data collection workflow showing six phases: Strategy, Setup, Generation, Annotation, Processing, and Training with an iteration loop"
                className="mx-auto w-full max-w-[680px]"
              />
            </div>
          </div>
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
            <div className="p-5">
              {/* Legend */}
              <div className="mb-4 flex gap-4 rounded-md bg-level-1 px-3 py-2">
                {[
                  { color: "#E24B4A", label: "High severity — data quality or pipeline failure" },
                  { color: "#EF9F27", label: "Medium — efficiency loss or rework" },
                  { color: "#1D9E75", label: "Low — friction but manageable" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-6 shrink-0 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="font-inter text-[12px] text-secondary-text">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Phase: Strategy & objectives */}
              <PainPhaseBlock color="#7F77DD" name="Strategy &amp; objectives" items={[
                { id: "1.1", desc: "Research-to-task translation gap", severity: "High", barColor: "#E24B4A", barWidth: 120 },
                { id: "1.2", desc: "No fast feedback loop on strategy decisions", severity: "Medium", barColor: "#EF9F27", barWidth: 90 },
                { id: "1.3", desc: "Cross-iteration memory loss", severity: "Medium", barColor: "#EF9F27", barWidth: 80 },
              ]} />

              {/* Phase: Task design & guidelines */}
              <PainPhaseBlock color="#1D9E75" name="Task design &amp; guidelines" items={[
                { id: "2.1", desc: "Guidelines evolve but aren\u2019t versioned", severity: "Medium", barColor: "#EF9F27", barWidth: 100 },
                { id: "2.2", desc: "Rubric ambiguity \u2192 low inter-annotator agreement", severity: "High", barColor: "#E24B4A", barWidth: 130 },
                { id: "2.3", desc: "Task design can\u2019t be A/B tested", severity: "Low", barColor: "#1D9E75", barWidth: 60 },
              ]} />

              {/* Phase: Model deployment & prompt sourcing */}
              <PainPhaseBlock color="#D85A30" name="Model deployment &amp; prompt sourcing" items={[
                { id: "3.1", desc: "Model serving infra for live annotation", severity: "Medium", barColor: "#EF9F27", barWidth: 100 },
                { id: "3.2", desc: "Prompt diversity hard to control/measure", severity: "High", barColor: "#E24B4A", barWidth: 120 },
                { id: "3.3", desc: "Synthetic prompts lack quality gate", severity: "Low", barColor: "#1D9E75", barWidth: 70 },
              ]} />

              {/* Phase: Human annotation */}
              <PainPhaseBlock color="#378ADD" name="Human annotation" items={[
                { id: "4.1", desc: "Cognitive load and task confusion (esp. red-teaming)", severity: "High", barColor: "#E24B4A", barWidth: 130 },
                { id: "4.2", desc: "Annotator fatigue and quality drift over time", severity: "High", barColor: "#E24B4A", barWidth: 110 },
                { id: "4.3", desc: "Preference signal degrades as models improve", severity: "High", barColor: "#E24B4A", barWidth: 140 },
                { id: "4.4", desc: "Model latency kills annotator throughput", severity: "Medium", barColor: "#EF9F27", barWidth: 90 },
                { id: "4.5", desc: "Multi-turn conversations compound errors", severity: "Medium", barColor: "#EF9F27", barWidth: 100 },
                { id: "4.6", desc: "No real-time quality feedback to annotators", severity: "High", barColor: "#E24B4A", barWidth: 110 },
              ]} />

              {/* Phase: QA & data processing */}
              <PainPhaseBlock color="#BA7517" name="QA &amp; data processing" items={[
                { id: "5.1", desc: "QA is a manual bottleneck", severity: "High", barColor: "#E24B4A", barWidth: 110 },
                { id: "5.2", desc: "Rejected annotations waste resources", severity: "Medium", barColor: "#EF9F27", barWidth: 90 },
                { id: "5.3", desc: "Data mixing across iterations is ad-hoc", severity: "Medium", barColor: "#EF9F27", barWidth: 100 },
                { id: "5.4", desc: "No systematic distribution/coverage analysis", severity: "Medium", barColor: "#EF9F27", barWidth: 100 },
              ]} />

              {/* Phase: Training & evaluation */}
              <PainPhaseBlock color="#D4537E" name="Training &amp; evaluation" items={[
                { id: "6.1", desc: "RM accuracy unknown until after training", severity: "Medium", barColor: "#EF9F27", barWidth: 100 },
                { id: "6.2", desc: "Evaluation-to-strategy feedback loop is slow", severity: "High", barColor: "#E24B4A", barWidth: 120 },
                { id: "6.3", desc: "Human evaluation is expensive and noisy", severity: "Medium", barColor: "#EF9F27", barWidth: 90 },
              ]} />
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
            <div className="p-5">
              {/* Legend */}
              <div className="mb-3 flex flex-wrap gap-3.5">
                {[
                  { color: "#7F77DD", label: "Researcher-owned" },
                  { color: "#1D9E75", label: "Task designer-owned" },
                  { color: "#378ADD", label: "Annotator-facing" },
                  { color: "#BA7517", label: "QA reviewer-owned" },
                  { color: "#D4537E", label: "Automated + Researcher" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="font-inter text-[12px] text-secondary-text">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Orchestration layer */}
              <ModuleSection label="Orchestration layer">
                <ModuleCard color="#7F77DD" name="Project hub" num="M1"
                  desc='The top-level container. A "project" = one client engagement (e.g., Anthropic&apos;s RLHF campaign). Contains iteration cycles, target metrics, data volume goals, and model version history. This is where the researcher defines "what are we trying to achieve this week" and tracks progress across iterations.'
                  pain="Addresses pain: 1.2 (strategy feedback), 1.3 (cross-iteration memory)" />
              </ModuleSection>

              {/* Configuration layer */}
              <ModuleSection label="Configuration layer">
                <div className="grid grid-cols-2 gap-3">
                  <ModuleCard color="#1D9E75" name="Task studio" num="M2"
                    desc="Where task designers build annotation tasks: define guidelines, rubrics, evaluation dimensions, preference scales, risk categories, and attack vectors. Version-controlled — every guideline change is tracked and can be A/B tested."
                    pain="Addresses pain: 1.1 (translation gap), 2.1 (versioning), 2.2 (rubric ambiguity), 2.3 (A/B testing)" />
                  <ModuleCard color="#1D9E75" name="Workforce hub" num="M3"
                    desc="Annotator lifecycle management: recruitment pipelines, multi-stage vetting (Meta's 4-test process), skill tiering, task routing, compensation tracking, communication channels, and demographics. Maps annotators to task types by capability."
                    pain="Addresses pain: 4.2 (fatigue detection), 4.6 (feedback loops to annotators)" />
                </div>
              </ModuleSection>

              <FlowArrow label="Task configs + annotator assignments flow down" />

              {/* Generation layer */}
              <ModuleSection label="Generation layer">
                <div className="grid grid-cols-2 gap-3">
                  <ModuleCard color="#D85A30" name="Model gateway" num="M4"
                    desc="Connects to client model endpoints. Manages model variant deployment, temperature/sampling configs, response pair generation, and latency optimization. Tracks which model version generated each response for full provenance."
                    pain="Addresses pain: 3.1 (infra), 4.4 (latency)" />
                  <ModuleCard color="#D85A30" name="Prompt engine" num="M5"
                    desc="Manages prompt sourcing and diversity: human-written prompts, model-generated synthetic prompts, adversarial seed prompts. Tracks topic/category coverage, detects distribution gaps, and ensures diversity targets are met per batch."
                    pain="Addresses pain: 3.2 (diversity), 3.3 (quality gate)" />
                </div>
              </ModuleSection>

              <FlowArrow label="Prompts + model responses flow into annotation" />

              {/* Core execution layer */}
              <ModuleSection label="Core execution layer">
                <ModuleCard color="#378ADD" name="Annotation workbench" num="M6"
                  desc="The annotator-facing interface. Supports multiple task modes: SFT demonstration writing, pairwise preference comparison with strength ratings, multi-turn conversational annotation, red-team adversarial probing, and safety labeling. Includes conversation branching, response editing (as Anthropic allowed for Upworkers), and real-time quality signals. This is the heart of the platform."
                  pain="Addresses pain: 4.1 (cognitive load), 4.3 (signal degradation), 4.5 (multi-turn), 4.6 (real-time feedback)" />
              </ModuleSection>

              <FlowArrow label="Raw annotations flow into quality control" />

              {/* Quality & processing layer */}
              <ModuleSection label="Quality &amp; processing layer">
                <div className="grid grid-cols-2 gap-3">
                  <ModuleCard color="#BA7517" name="Quality control center" num="M7"
                    desc="QA review workflows (approve/edit/reject), inter-annotator agreement monitoring, automated quality scoring using client reward models, drift detection over time, and calibration checks. Feeds quality signals back to Workforce Hub and Task Studio."
                    pain="Addresses pain: 5.1 (QA bottleneck), 5.2 (rejection cost), 2.2 (ambiguity detection)" />
                  <ModuleCard color="#D4537E" name="Data engine" num="M8"
                    desc="Data processing pipeline: formatting for training, train/test splitting, cross-batch mixing with configurable ratios, deduplication, distribution analysis, coverage reporting. Exports to client training infrastructure in their required format."
                    pain="Addresses pain: 5.3 (ad-hoc mixing), 5.4 (distribution analysis)" />
                </div>
              </ModuleSection>

              <FlowArrow label="Processed data exports to client + results feed back" up />

              {/* Intelligence layer */}
              <ModuleSection label="Intelligence layer">
                <ModuleCard color="#7F77DD" name="Analytics &amp; insights" num="M9"
                  desc="Cross-iteration analytics: reward model accuracy trends, data quality over time, annotator performance, coverage gaps, false refusal rates, cost-per-annotation, throughput metrics. Generates actionable recommendations for next iteration strategy. Closes the loop back to Project Hub."
                  pain="Addresses pain: 6.1 (RM accuracy visibility), 6.2 (slow feedback), 6.3 (eval cost)" />
              </ModuleSection>
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
            Three modules represent the core differentiation &mdash; where the
            platform wins or loses against manual processes. Together they address
            15 of the 19 pain points identified.
          </p>

          {/* ── M2: Task Studio ── */}
          <DeepDiveModule color="#1D9E75" id="M2" name="Task Studio" subtitle="The translation layer">
            <DeepDiveGroup title="Task type builder" rationale="Both papers used multiple distinct task types. Rather than hard-coding these, the Task Studio provides composable building blocks that task designers assemble into task configurations.">
              <Feat color="#1D9E75" name="Task templates" desc="Pre-built templates for four core RLHF task types: SFT demonstration writing, pairwise preference comparison, adversarial red-teaming, and model-comparison ranking. Each template includes default UX layout, required fields, and suggested rubrics." />
              <Feat color="#1D9E75" name="Evaluation dimensions" desc="Configurable dimensions annotators evaluate on. Both papers used helpfulness and safety as primary dimensions. The designer defines each with: name, definition, examples, and a scale (binary, 4-point as Meta used, or continuous). Dimensions can be combined." tags={[{ label: "pain 2.2", type: "pain" }]} />
              <Feat color="#1D9E75" name="Preference scale config" desc="Configure preference strength options. Meta used a 4-point scale and used it to add margin to their RM loss function. Anthropic filtered out weak preferences. The designer sets the scale, labels, and minimum threshold for inclusion." tags={[{ label: "differentiator", type: "new" }]} />
              <Feat color="#1D9E75" name="Safety taxonomy builder" desc="Structured definition of risk categories (illicit activities, hateful content, unqualified advice) and attack vectors (psychological manipulation, logic manipulation, role-playing, non-English). Creates a coverage matrix the Prompt Engine uses to ensure all cells are represented." />
            </DeepDiveGroup>

            <DeepDiveGroup title="Guideline management" rationale="Anthropic amended guidelines via Slack. Meta had formal guidelines but no clear versioning story. This is where the platform adds structure to what was previously ad-hoc.">
              <Feat color="#1D9E75" name="Version-controlled guidelines" desc={'Every guideline change creates a new version with a diff view, change rationale, and author. Annotations are tagged with the guideline version they were collected under. Enables: "did guideline v3 actually improve agreement?"'} tags={[{ label: "pain 2.1", type: "pain" }]} />
              <Feat color="#1D9E75" name="Edge case library" desc="A living knowledge base of ambiguous examples with canonical decisions. When an annotator or QA reviewer flags a borderline case, it enters the library. Task designer adjudicates and adds the resolution. These automatically become calibration tasks AND guideline examples." tags={[{ label: "differentiator", type: "new" }, { label: "pain 2.2", type: "pain" }]} />
              <Feat color="#1D9E75" name="Context-sensitive rubric delivery" desc='Instead of showing annotators a 10-page guideline document, the relevant rubric section is surfaced inline within the Annotation Workbench based on task type and context. If the annotator is evaluating medical advice, the "unqualified advice" rubric section appears automatically.' tags={[{ label: "pain 4.1", type: "pain" }]} />
              <Feat color="#1D9E75" name="Guideline A/B testing" desc='Run two guideline variants simultaneously on comparable annotator pools. Measures: agreement rates, PM score alignment, annotation speed, and annotator-reported difficulty. Resolves debates like "should red-teamers choose the more harmful or least harmful response?" with data.' tags={[{ label: "pain 2.3", type: "pain" }]} />
            </DeepDiveGroup>

            <DeepDiveGroup title="Calibration & golden task system" rationale="Neither paper had a robust calibration system. Anthropic noted that standard gold-label approaches didn't work for open-ended conversations. We need a different model.">
              <Feat color="#1D9E75" name="Golden task generator" desc="Task designers create golden comparison pairs with canonical preferences and detailed justifications. Mixed into annotator queues at a configurable rate (e.g., 5%). Annotator performance on golden tasks is tracked but invisible to them." />
              <Feat color="#1D9E75" name="Consensus-based calibration" desc="For open-ended tasks where researcher-defined gold labels are impractical, the system uses consensus: a subset of tasks are shown to multiple annotators, and the majority preference becomes the soft calibration target." tags={[{ label: "differentiator", type: "new" }]} />
            </DeepDiveGroup>

            <DeepDiveConnections connections={[
              { label: "Task Studio \u2192 Annotation Workbench", desc: "Task configs, guidelines, rubrics, and calibration tasks are pushed to the workbench. Changes propagate immediately." },
              { label: "Quality Control Center \u2192 Task Studio", desc: 'QCC surfaces patterns: "Annotators disagree 40% of the time on medical advice safety tasks." This triggers rubric review. Edge cases flagged by QA flow into the edge case library.' },
              { label: "Task Studio \u2192 Prompt Engine", desc: "The safety taxonomy (risk categories \u00d7 attack vectors) defines a coverage matrix. The Prompt Engine uses this to ensure prompt distribution hits all cells." },
            ]} />
          </DeepDiveModule>

          {/* ── M6: Annotation Workbench ── */}
          <DeepDiveModule color="#378ADD" id="M6" name="Annotation Workbench" subtitle="The heart">
            <DeepDiveGroup title="Task modes" rationale="The workbench isn't a single interface — it's four distinct UX modes, each optimized for a different annotation type. The mode is determined by the task config from Task Studio.">
              <div className="mb-2 grid grid-cols-2 gap-2.5">
                {[
                  { name: "SFT demonstration", desc: "Annotator writes prompt + ideal response. Rich text editor with tone/style guides inline. Auto-checks for guideline compliance before submission." },
                  { name: "Preference comparison", desc: "Side-by-side response display. Preference selection + strength rating. Optional rationale field. Diff highlighting between responses." },
                  { name: "Red-team / adversarial", desc: 'Prompt crafting with attack vector suggestions. Response evaluation with safety category labeling. Reframed as "which response better follows safety guidelines."' },
                  { name: "Multi-turn conversation", desc: "Full conversation threading. Branching support. Per-turn preference comparison. Conversation-level quality rating." },
                ].map((m) => (
                  <div key={m.name} className="rounded-md border border-level-2 px-3 py-2.5">
                    <p className="mb-1 font-inter text-[13px] font-medium text-ink">{m.name}</p>
                    <p className="font-inter text-[12px] leading-snug text-secondary-text">{m.desc}</p>
                  </div>
                ))}
              </div>
            </DeepDiveGroup>

            <DeepDiveGroup title="Response comparison engine" rationale="This is the core UX for preference annotation — the task that produces 90%+ of RLHF training data. Every friction point here multiplies across millions of comparisons.">
              <Feat color="#378ADD" name="Intelligent diff highlighting" desc="Automatically highlight key differences between response A and B — factual claims, tonal differences, structural differences. Not a character-level diff — a semantic one." tags={[{ label: "differentiator", type: "new" }]} />
              <Feat color="#378ADD" name="Difficulty indicator" desc='Show the annotator a signal of how similar the two responses are (derived from embedding distance or PM score delta). A "these are very similar — take your time" indicator prepares for hard comparisons. Meta showed accuracy drops from 94% to 55% as similarity increases.' tags={[{ label: "pain 4.3", type: "pain" }, { label: "differentiator", type: "new" }]} />
              <Feat color="#378ADD" name="Preference strength with anchor examples" desc='When an annotator selects "slightly better," show a tooltip with an example of what "slightly better" vs "significantly better" looks like from the calibration library. Reduces scale interpretation drift.' tags={[{ label: "pain 2.2", type: "pain" }]} />
              <Feat color="#378ADD" name="Optional rationale capture" desc='An optional free-text field: "Why did you prefer this response?" Not required (would kill throughput), but incentivized. Rationales help QA understand disagreements, train better reward models, and improve guidelines. Can be made required for low-confidence comparisons only.' />
            </DeepDiveGroup>

            <DeepDiveGroup title="Cognitive load management" rationale="Pain 4.1 (task confusion) and 4.2 (annotator fatigue) are the biggest threats to data quality. The workbench must actively manage cognitive load rather than just displaying tasks.">
              <Feat color="#378ADD" name="Red-team task reframing" desc='Anthropic found annotators got confused when asked to "choose the more harmful response" while trying to elicit harm. The workbench reframes this: instead of "which is more harmful?" it asks "which response better follows our safety guidelines?" — same data outcome, but cognitively coherent.' tags={[{ label: "critical fix", type: "critical" }, { label: "pain 4.1", type: "pain" }]} />
              <Feat color="#378ADD" name="Context-sensitive inline guidelines" desc="Instead of a static guideline sidebar, show the relevant rubric section based on current task context. If the prompt mentions medical advice, surface the unqualified advice criteria. Powered by the safety taxonomy from Task Studio." tags={[{ label: "pain 4.1", type: "pain" }]} />
              <Feat color="#378ADD" name="Fatigue management system" desc="Track session duration, task velocity, and quality signals. After N consecutive tasks or T minutes, suggest breaks. If quality metrics start declining within a session, proactively offer a break or task type switch. Alternate between helpfulness and safety tasks to prevent habituation." tags={[{ label: "pain 4.2", type: "pain" }]} />
              <Feat color="#378ADD" name="Red-team attack vector suggestions" desc={'During adversarial tasks, suggest attack categories the annotator hasn\'t tried recently. "You\'ve done 12 role-playing attacks this session. Try a false-premise or logic-manipulation approach." Prevents prompt repetition and improves coverage.'} tags={[{ label: "pain 3.2", type: "pain" }]} />
            </DeepDiveGroup>

            <DeepDiveGroup title="Multi-turn conversation support" rationale="Meta's data averaged 3.9 turns per dialogue. Multi-turn is harder but more valuable. The workbench needs specific tooling for it.">
              <Feat color="#378ADD" name="Conversation branching" desc='At any turn, the annotator can "branch" — go back to a previous turn and explore an alternative path. This creates a conversation tree rather than a single linear thread. Bad choices at turn 2 no longer ruin the entire trajectory. Both branches produce usable training data.' tags={[{ label: "pain 4.5", type: "pain" }, { label: "differentiator", type: "new" }]} />
              <Feat color="#378ADD" name="Turn-level annotation" desc="Each turn gets its own preference annotation rather than only annotating at the conversation level. Anthropic collected per-turn preferences. This produces denser training signal from each conversation." />
              <Feat color="#378ADD" name="Response editing" desc="Annotators can edit model responses before proceeding, as Anthropic allowed for Upworkers. The edit + original creates an additional high-quality comparison pair. Edited responses are flagged as human-modified." />
            </DeepDiveGroup>

            <DeepDiveGroup title="Real-time quality feedback">
              <Feat color="#378ADD" name="Personal quality dashboard" desc={"Visible to the annotator: calibration score, agreement rate with peers, tasks completed, and quality trend. Not punitive \u2014 framed as a learning tool. \"You're at 78% alignment on safety tasks, up from 72% last week.\""} tags={[{ label: "pain 4.6", type: "pain" }]} />
              <Feat color="#378ADD" name="Calibration nudges" desc="When an annotator's recent preferences diverge from consensus on a specific dimension, surface a calibration micro-task: a golden pair from the edge case library with a brief explanation. Not interruptive — offered between tasks." tags={[{ label: "pain 4.6", type: "pain" }, { label: "differentiator", type: "new" }]} />
            </DeepDiveGroup>

            <DeepDiveGroup title="Throughput optimization">
              <Feat color="#378ADD" name="Response pre-generation" desc="While the annotator works on the current task, pre-generate response pairs for their next task via the Model Gateway. For multi-turn conversations, pre-generate for the most likely next turns." tags={[{ label: "pain 4.4", type: "pain" }]} />
              <Feat color="#378ADD" name="Keyboard-first interaction" desc="Keyboard shortcuts for all common actions: select response A/B, set preference strength, submit, flag for QA review. Power annotators should never need the mouse for preference tasks." />
            </DeepDiveGroup>

            <DeepDiveConnections connections={[
              { label: "Task Studio \u2192 Annotation Workbench", desc: "Task configs determine which mode loads, which guidelines appear, what preference scales are shown, and what calibration tasks are mixed in." },
              { label: "Model Gateway \u2192 Annotation Workbench", desc: "Response pairs arrive with model provenance metadata (variant, temperature, version). The annotator never sees this, but it's stored for analysis." },
              { label: "Annotation Workbench \u2192 Quality Control Center", desc: "Every annotation flows to QCC with metadata: annotator ID, time taken, guideline version, preference strength, difficulty signal, and optional rationale." },
              { label: "Quality Control Center \u2192 Annotation Workbench", desc: "Real-time quality signals flow back: calibration scores, agreement alerts, and calibration nudge tasks. This is the inner feedback loop." },
            ]} />

            {/* Design note */}
            <div className="mt-4 rounded-md border border-[#378ADD]/30 bg-[#378ADD]/5 px-4 py-3">
              <p className="mb-1 font-inter text-[12px] font-medium text-[#378ADD]">Key design decision: the red-team reframing</p>
              <p className="font-inter text-[13px] leading-relaxed text-secondary-text">
                Anthropic&apos;s paper explicitly states that annotators got confused
                choosing &ldquo;the more harmful response&rdquo; &mdash; it&apos;s
                cognitively contradictory to simultaneously try to provoke harm AND
                select for it. Our workbench reframes ALL preference tasks as
                &ldquo;choose the better response according to the relevant
                guidelines.&rdquo; For safety tasks, the &ldquo;better&rdquo;
                response is the one that follows safety guidelines. One mental model,
                four task types.
              </p>
            </div>
          </DeepDiveModule>

          {/* ── M7: Quality Control Center ── */}
          <DeepDiveModule color="#BA7517" id="M7" name="Quality Control Center" subtitle="The intelligence layer">
            <DeepDiveGroup title="Review workflows" rationale="Meta had content managers manually review annotations. Anthropic did spot-checks. The platform needs a tiered approach: automated screening catches obvious issues, human review focuses on ambiguous cases.">
              <Feat color="#BA7517" name="Tiered review pipeline" desc="Three tiers: (1) Auto-approve — annotations where the annotator's choice aligns with the client's RM AND other annotators. (2) Spot-check — random sample from auto-approved for human QA. (3) Mandatory review — where the RM disagrees with the annotator, or annotators disagree with each other. Concentrates human QA effort where it matters most." tags={[{ label: "pain 5.1", type: "pain" }, { label: "differentiator", type: "new" }]} />
              <Feat color="#BA7517" name="Structured rejection feedback" desc="When a QA reviewer rejects an annotation, they select a reason from a predefined taxonomy (guideline misapplication, insufficient evidence, safety label error, prompt quality issue) and optionally add a note. Feedback flows back to the annotator, creating a learning loop. Rejection patterns inform guideline improvements in Task Studio." tags={[{ label: "pain 5.2", type: "pain" }]} />
              <Feat color="#BA7517" name="Reviewer calibration" desc='QA reviewers themselves get calibration tasks. A small percentage of their review queue contains "golden reviews" — annotations with known-correct quality judgments. Answers "who checks the checkers?" and prevents reviewer drift.' />
            </DeepDiveGroup>

            <DeepDiveGroup title="Automated quality signals" rationale="Quality can be estimated from multiple independent signals. No single signal is definitive, but their combination is powerful.">
              <Feat color="#BA7517" name="Reward model alignment scoring" desc="Score each annotated pair using the client's current RM. Flag annotations where the annotator's preference disagrees with the RM. These disagreements aren't necessarily errors — the RM might be wrong — but they're high-value for review. The pattern of RM-annotator disagreements reveals where the RM has blind spots." tags={[{ label: "differentiator", type: "new" }]} />
              <Feat color="#BA7517" name="Composite quality score" desc="For each annotation, compute a confidence score combining: golden task accuracy, agreement with other annotators, RM alignment, preference strength (higher = more decisive = typically higher quality), and time spent (too fast = not reading, too slow = confused). This score drives the tiered review pipeline." tags={[{ label: "differentiator", type: "new" }]} />
              <Feat color="#BA7517" name="Near-duplicate detection" desc='Embedding-based similarity detection across prompts and responses within and across batches. Flag semantically identical but differently worded prompts. Prevents the dataset from being dominated by a small set of topics. Anthropic noted they "discouraged repetition" — this automates it.' tags={[{ label: "pain 5.4", type: "pain" }]} />
            </DeepDiveGroup>

            <DeepDiveGroup title="Agreement & calibration monitoring">
              <Feat color="#BA7517" name="Overlap scheduling engine" desc="Automatically assign a configurable percentage (default: 10-15%) of tasks to multiple annotators. Smart overlap: higher rate for task types with historically lower agreement. Overlap pairs used for IAA computation but both annotations are potentially usable for training." />
              <Feat color="#BA7517" name="Multi-dimensional agreement tracking" desc="Track agreement broken down by: evaluation dimension, task type, prompt category, preference strength bucket, and guideline version. Surfaces exactly where the rubric needs work. Anthropic's 63% overall agreement likely masked significant variation across categories." tags={[{ label: "pain 2.2", type: "pain" }]} />
              <Feat color="#BA7517" name="Calibration drift detection" desc="Monitor agreement and golden-task accuracy over time within and across batches. Alert when an annotator's quality drops (fatigue), the whole cohort drops (guideline problem or model shift), or a new guideline version changes agreement patterns." tags={[{ label: "pain 4.2", type: "pain" }]} />
            </DeepDiveGroup>

            <DeepDiveGroup title="Distribution & coverage analysis" rationale="Neither paper had systematic coverage analysis. Meta defined a risk category × attack vector matrix, but there's no evidence they tracked coverage against it in real-time.">
              <Feat color="#BA7517" name="Coverage heatmap" desc='Real-time visualization of the risk category × attack vector matrix. Shows annotation count in each cell with color indicating sufficiency. Highlights gaps: "300+ annotations for role-playing + illicit activities, but only 12 for logic manipulation + unqualified advice."' tags={[{ label: "pain 5.4", type: "pain" }, { label: "differentiator", type: "new" }]} />
              <Feat color="#BA7517" name="Difficulty distribution monitor" desc='Track the distribution of comparison difficulty (based on RM score delta). As models improve, the distribution shifts toward harder comparisons. Alert when "negligibly better" comparisons exceed a threshold — a signal that response pair generation needs higher temperature or more diverse model variants. Directly addresses the degradation paradox.' tags={[{ label: "critical", type: "critical" }, { label: "pain 4.3", type: "pain" }]} />
              <Feat color="#BA7517" name="Topic distribution tracker" desc="Cluster prompts by topic using embeddings. Detect when annotators gravitate toward familiar topics and diversity is declining. Feed gaps back to the Prompt Engine to generate targeted prompts in underrepresented areas." tags={[{ label: "pain 3.2", type: "pain" }]} />
            </DeepDiveGroup>

            <DeepDiveConnections connections={[
              { label: "QCC \u2192 Annotation Workbench (real-time)", desc: "Quality scores, calibration nudges, difficulty indicators. The inner loop — latency target: under 1 minute." },
              { label: "QCC \u2192 Workforce Hub (daily)", desc: 'Per-annotator quality reports, skill tier recommendations, retraining triggers, fatigue alerts. "Move annotator X from safety tasks to helpfulness — their safety agreement is declining."' },
              { label: "QCC \u2192 Task Studio (weekly)", desc: 'Rubric ambiguity reports, edge cases, agreement breakdowns by category. "The medical advice rubric needs work — agreement is 20 points below average."' },
              { label: "QCC \u2192 Prompt Engine (continuous)", desc: 'Coverage gap signals, topic distribution drift. "We need more prompts in the finance + psychological-manipulation cell."' },
              { label: "QCC \u2192 Data Engine (batch)", desc: "Approved annotation batches with quality metadata. Each data point carries its composite quality score, enabling quality-weighted filtering during training data preparation." },
              { label: "QCC \u2192 Analytics & Insights (batch)", desc: "Batch quality summary, coverage report, drift analysis. Feeds cross-iteration learning that informs next batch strategy." },
            ]} />

            {/* Insight callout */}
            <div className="mt-4 rounded-md border border-[#BA7517]/30 bg-[#BA7517]/5 px-4 py-3">
              <p className="mb-1 font-inter text-[12px] font-medium text-[#BA7517]">The degradation paradox solution</p>
              <p className="font-inter text-[13px] leading-relaxed text-secondary-text">
                Both papers observed that as models improve, preference data quality
                degrades because responses become harder to distinguish. The QCC&apos;s
                difficulty distribution monitor detects this in real-time. When it
                triggers, the system can automatically: (1)&nbsp;increase response
                generation temperature via the Model Gateway, (2)&nbsp;sample from more
                diverse model variants, (3)&nbsp;route harder comparisons to higher-skill
                annotators via the Workforce Hub, and (4)&nbsp;alert the researcher via
                the Project Hub that the model may have reached a plateau.
              </p>
            </div>
          </DeepDiveModule>
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

      </main>
    </div>
  );
}
