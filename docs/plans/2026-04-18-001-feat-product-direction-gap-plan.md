---
title: "feat: Product Direction Gap Incorporation — Elevate Prototype to Vision"
type: feat
status: active
date: 2026-04-18
origin: product-direction.md
---

# feat: Product Direction Gap Incorporation — Elevate Prototype to Vision

## Overview

The product direction document envisions 9 modules, 78 features, and 7 explicit differentiators across a comprehensive RLHF data collection platform. The current prototype covers the execution core well (annotation workbench, task wizard, review queue) but is missing the **intelligence layer** — the real-time feedback loops, cross-iteration analytics, and platform smarts that differentiate this from "a spreadsheet and Slack." This plan identifies 12 concrete improvements that bring the prototype closer to the product vision, organized by impact tier.

## Problem Frame

The prototype was built screen-by-screen from Paper designs to be pixel-perfect. It excels at demonstrating the *mechanics* of annotation (8 task types, wizard, review queue, exports). What it doesn't demonstrate is the *intelligence* — the three feedback loops the product direction calls the platform's biggest value:

1. **Inner loop (seconds-minutes):** QCC → Annotation Workbench — real-time quality signals during annotation
2. **Calibration loop (daily):** QCC → Workforce Hub → Annotation Workbench — routing adjustments and calibration exercises
3. **Evolution loop (weekly):** QCC → Task Studio → Annotation Workbench — guideline refinement from disagreement data

These feedback loops are what the product doc says "a competitor can't easily replicate." But the prototype currently shows none of them. An evaluator looking at the prototype sees a good annotation tool; they should see an *intelligent annotation platform*.

## Requirements Trace

From the product direction document:

- R1. Real-time annotator quality feedback during annotation (Pain Points 4.2, 4.3, 4.6; Differentiator #4, #7) → Unit 1
- R2. Tiered review pipeline with automated pre-screening (Pain Point 5.1; Differentiator #1) → Unit 2
- R3. Guideline versioning and evolution tracking (Pain Point 2.1) → Unit 3
- R4. Cross-iteration analytics and iteration playbook (Pain Points 1.2, 1.3, 6.2; Differentiator #5) → Unit 4
- R5. Coverage-driven prompt dashboard (Pain Points 3.2, 3.3; Differentiator #2) → Unit 5
- R6. Intelligent task routing and annotator matching (Pain Points 4.1, 4.2; Differentiator #3) → Unit 6
- R7. Iteration as a first-class entity with lifecycle view (Pain Point 1.3) → Unit 7
- R8. Data lineage and provenance tracking (Cross-cutting concern) → Unit 8
- R9. Preference signal degradation detection (Pain Point 4.3) → Unit 4
- R10. Annotator fatigue and drift detection (Pain Point 4.2) → Unit 9
- R11. Continuous calibration exercise flow (Pain Points 4.6, 2.2) → Unit 10
- R12. Data mixing configuration for batch composition (Pain Point 5.3) → Unit 11
- R13. Model Gateway — deployment config, A/B testing, hot-swap, latency management (Pain Points 3.1, 4.4) → Unit 13
- R14. Task design A/B testing and guideline effectiveness measurement (Pain Point 2.3) → Unit 14
- R15. Annotator onboarding pipeline, compensation, expert marketplace (M3 remaining) → Unit 15
- R16. Multi-turn conversation branching and edge case propagation (Pain Point 4.5) → Unit 16
- R17. QCC intelligence — ambiguity detection, reviewer calibration, rejection costs (Pain Points 2.2, 5.2) → Unit 17
- R18. Data deduplication, distribution analysis, data valuation (Pain Point 5.4) → Unit 18
- R19. Training results import, RM accuracy tracking, cost-per-improvement (Pain Points 6.1, 6.2, 6.3) → Unit 19
- R20. Enterprise settings — SSO, API, webhooks, workflows, compliance (Theme 5) → Unit 20

## Scope Boundaries

- All additions are UI mockups with mock data (Zustand stores) — no backend changes
- Existing 34 screens are NOT redesigned — we add to them or add new screens alongside
- No responsive/mobile work
- No new task types — the 8 existing types are comprehensive
- No real AI/ML integration — intelligence features use mock data to demonstrate the concept

### Deferred to Separate Tasks

- Real API integration for quality metrics: future iteration
- Actual active learning algorithm integration: future iteration
- Multi-lingual support: future iteration
- Expert annotator marketplace: future iteration

## Context & Research

### What the Prototype Already Covers Well

| Module | Product Direction Coverage | Notes |
|--------|---------------------------|-------|
| M6: Annotation Workbench | ~70% | All 8 task types, submit/skip/flag, guidelines drawer. Missing: quality feedback, difficulty indicator |
| M2: Task Studio | ~65% | 7-step wizard, type-specific configs, guideline editor. Missing: versioning, A/B testing, edge case library |
| M1: Project Hub | ~50% | Projects/campaigns/rounds hierarchy. Missing: iteration as first-class entity, strategy config |
| M3: Workforce Hub | ~45% | Annotator list, qualifications, status tracking. Missing: routing config, fatigue detection, calibration |
| M7: Quality Control Center | ~40% | Review queue, auto-flagging, gold accuracy. Missing: tiered pipeline, real-time feedback, drift detection |
| M9: Analytics & Insights | ~35% | IAA trends, bias detection, performance table. Missing: cross-iteration, playbook, signal degradation |
| M4: Model Gateway | ~30% | Endpoint list with health. Missing: deployment config, hot-swap, A/B testing |
| M8: Data Engine | ~30% | Export builder with formats/gates. Missing: data lineage, mixing config, distribution analysis |
| M5: Prompt Engine | ~5% | Prompt config in wizard only. Missing: coverage dashboard, diversity tracking, sourcing management |

### The 7 Differentiators — Current Status

| # | Differentiator | In Prototype? | Gap |
|---|---------------|--------------|-----|
| 1 | Tiered review pipeline | No | Review queue is flat, no automated pre-screening tier |
| 2 | Coverage-driven prompt allocation | No | No prompt management screen at all |
| 3 | Intelligent task routing | No | Annotator list exists but no routing config |
| 4 | Difficulty indicator | No | Annotation screens show no task difficulty signal |
| 5 | Iteration playbook generator | No | Analytics has no cross-iteration or recommendation view |
| 6 | Active learning comparison selection | No | Not feasible without backend — defer |
| 7 | Real-time annotator calibration loop | No | No quality feedback during annotation |

## Key Technical Decisions

- **Enhance existing screens, don't rebuild:** Most improvements add panels, sections, or modals to existing pages rather than creating entirely new routes
- **New admin screens limited to 2:** Prompt Coverage dashboard and Iteration Overview — these fill genuine navigation gaps
- **Shared quality feedback component:** Build one `QualityFeedbackPanel` component used across all 8 annotation screens
- **New Zustand stores:** Add `iteration-store.ts` and `prompt-store.ts` for new data domains
- **Mock intelligence with realistic data:** Pre-compute "AI recommendations" in seed data — the prototype demonstrates the UX of intelligence, not the algorithm

## Open Questions

### Resolved During Planning

- **Should we add new sidebar nav items?** Yes — "Prompts" under DATA section, and "Iterations" under ADMIN section
- **How to show quality feedback without cluttering annotation screens?** Collapsible right sidebar panel (similar to guidelines drawer pattern) that annotators can toggle
- **Where does iteration overview live?** New screen at `/iterations` showing the cross-cutting iteration view, linked from campaign rounds

### Deferred to Implementation

- Exact mock data values for cross-iteration charts (will tune visually)
- Whether the quality feedback panel should auto-collapse after calibration nudge is acknowledged
- Specific color treatment for signal degradation visualizations

## Implementation Units

### Tier 1: Core Differentiators (Highest Impact)

- [ ] **Unit 1: Real-Time Quality Feedback Panel for Annotation Screens**

**Goal:** Add a collapsible quality feedback sidebar to all 8 annotation task screens, showing real-time performance signals during annotation. This is the "inner loop" that the product direction calls the platform's biggest differentiator.

**Requirements:** R1

**Dependencies:** None — enhances existing screens

**Files:**
- Create: `components/annotator/quality-feedback-panel.tsx`
- Create: `stores/session-store.ts`
- Modify: `app/(annotator)/annotate/[id]/pairwise/page.tsx`
- Modify: `app/(annotator)/chat/page.tsx`
- Modify: `app/(annotator)/sft/page.tsx`
- Modify: `app/(annotator)/red-team/page.tsx`
- Modify: `app/(annotator)/edit/page.tsx`
- Modify: `app/(annotator)/rank/page.tsx`
- Modify: `app/(annotator)/rubric/page.tsx`
- Modify: `app/(annotator)/arena/page.tsx`

**Approach:**
The quality feedback panel is a right-side collapsible sidebar (similar to the guidelines drawer but always lightly visible). It contains:

1. **Difficulty indicator** — A badge on the current task showing estimated difficulty (Easy / Medium / Hard / Expert) based on response similarity. Color-coded: green/amber/orange/red
2. **Session performance ring** — Circular progress showing gold accuracy for current session (e.g., "8/10 correct" with ring fill)
3. **Cohort comparison** — Small bar chart comparing "You" vs. "Team Avg" on gold accuracy and IAA
4. **Calibration nudge banner** — Conditionally shown yellow banner: "Your safety task accuracy dropped to 65%. Review the guidelines for borderline cases." with "Review Guidelines" link
5. **Session stats footer** — Annotations completed today, avg time per annotation, current streak

The panel is toggled via a small "Quality" tab on the right edge of the screen. When collapsed, only the difficulty badge and a mini performance indicator remain visible as a thin strip.

Add a `session-store.ts` to track session-level annotation state (count, accuracy, time per annotation, streak).

**Patterns to follow:**
- `components/guidelines-drawer.tsx` for the slide-in pattern
- `components/ui/stat-card.tsx` for metric display
- The task header already has a consistent pattern across all 8 screens — the quality panel follows the same integration approach

**Test expectation:** none — visual component with mock data

**Verification:**
- Quality panel renders on all 8 annotation screens
- Difficulty badge shows appropriate level
- Session performance ring updates (mock)
- Calibration nudge appears conditionally
- Panel collapses/expands smoothly

---

- [ ] **Unit 2: Tiered Review Pipeline**

**Goal:** Transform the flat review queue into a tiered pipeline visualization showing automated pre-screening, human review, and escalation tiers. This demonstrates the QCC's intelligence — the product direction's Differentiator #1.

**Requirements:** R2

**Dependencies:** None — enhances existing screen

**Files:**
- Modify: `app/(admin)/reviews/page.tsx`
- Modify: `app/(admin)/reviews/[id]/page.tsx`
- Modify: `stores/review-store.ts`
- Modify: `data/seed.ts`

**Approach:**
Restructure the review queue page into three visual tiers:

1. **Pipeline overview** — Horizontal flow diagram at top of page showing:
   - "Auto-Screened" (green): Count of annotations that passed all automated checks (e.g., 847 today)
   - "Human Review" (amber): Items routed to manual review (23 pending)
   - "Escalated" (red): Items requiring senior reviewer (3 items)
   - Arrows between tiers with throughput numbers

2. **Auto-screening summary card** — Below pipeline, show what the automated tier caught:
   - Gold standard failures: 12
   - Time threshold violations: 8 (< 45s)
   - IAA outliers: 3
   - "Auto-approved" metric showing efficiency gain

3. **Review table restructured** — Group items by tier with visual tier indicators. Add columns:
   - "Auto-checks" column showing which automated checks passed/failed (green/red dots)
   - "Confidence" column showing automated confidence score
   - "Routing reason" column explaining why this item needs human review

4. **Review detail enhancement** — On the `[id]` page, add an "Automated Analysis" section above the human review area showing:
   - Which auto-checks ran and their results
   - Similar annotations from the cohort for reference
   - Suggested action based on patterns

Update seed data to include tier classification, auto-check results, and confidence scores per review item.

**Patterns to follow:**
- Existing review queue page layout for table structure
- `components/ui/stat-card.tsx` for pipeline overview metrics
- `components/ui/badge.tsx` for tier indicators

**Test expectation:** none — visual restructuring

**Verification:**
- Pipeline visualization renders with tier counts
- Auto-screening summary shows captured issues
- Review table shows tier grouping and auto-check results
- Review detail shows automated analysis section

---

- [ ] **Unit 3: Guideline Versioning & Evolution in Drawer**

**Goal:** Transform the static guidelines drawer into a versioned, living document viewer that shows version history, changelogs, and edge case evolution. This addresses Pain Point 2.1 — "guidelines are living documents but treated as static artifacts."

**Requirements:** R3

**Dependencies:** None — enhances existing component

**Files:**
- Modify: `components/guidelines-drawer.tsx`
- Create: `data/guideline-versions.ts`

**Approach:**
Enhance the guidelines drawer with three additions:

1. **Version selector header** — At top of drawer, add:
   - Version dropdown: "v2.3 — Updated Apr 15, 2026" with history
   - "What's new" indicator badge (teal dot) when viewing outdated version
   - Author/approver attribution: "Updated by Sarah Chen, approved by Dr. Kim"

2. **Tabs within drawer** — Add tab navigation:
   - "Guidelines" (default) — current guideline content
   - "Changelog" — Diff view showing what changed between versions with red/green highlighting
   - "Edge Cases" — Curated edge case examples with adjudicated answers and rationale

3. **Version history panel** — Expandable section showing:
   - Timeline of versions with dates, change summaries, and authors
   - "Revert context" notes explaining why changes were made
   - Link to related disagreement patterns that triggered the change

Create `guideline-versions.ts` with 3-4 mock versions showing realistic evolution (e.g., v2.0 initial, v2.1 added borderline safety cases, v2.2 refined preference scale wording, v2.3 added code evaluation examples).

**Patterns to follow:**
- `components/guidelines-drawer.tsx` existing structure
- `components/ui/tabs.tsx` for tab navigation

**Test expectation:** none — visual enhancement

**Verification:**
- Version selector shows available versions
- Switching versions updates content
- Changelog tab shows diffs
- Edge cases tab shows curated examples
- "What's new" badge appears correctly

---

- [ ] **Unit 4: Cross-Iteration Analytics & Iteration Playbook**

**Goal:** Add cross-iteration comparison, signal degradation tracking, and AI-generated iteration playbook recommendations to the analytics dashboard. This is Differentiator #5 and addresses Pain Points 1.2, 1.3, and 6.2.

**Requirements:** R4, R9

**Dependencies:** None — enhances existing screen

**Files:**
- Modify: `app/(admin)/analytics/page.tsx`
- Create: `data/iteration-analytics.ts`

**Approach:**
Add three new sections to the analytics page (below existing IAA trends and annotator performance):

1. **Cross-Iteration Comparison** — New section with:
   - Line chart showing key metrics across iterations (Rounds 1-5): RM accuracy, annotation volume, cost per annotation, IAA, gold accuracy
   - Toggle between metrics
   - Highlight iteration where each metric peaked
   - Table view alternative showing all metrics per iteration side-by-side

2. **Preference Signal Degradation Monitor** — New card section:
   - Stacked area chart showing preference margin distribution over time:
     - "Significantly better" (dark teal) — shrinking over iterations as models improve
     - "Better" (medium teal) — relatively stable
     - "Slightly better" (light teal) — growing
     - "Negligible" (gray) — growing ← this is the degradation signal
   - Alert card: "Signal strength declining — 34% of comparisons now rated 'negligibly better', up from 12% in Round 1. Consider: increasing response temperature diversity, adding harder prompts, or switching to rubric scoring for subtle distinctions."

3. **Iteration Playbook Recommendation** — Card at bottom styled as an "AI Insight":
   - Header: "Recommended Strategy for Round 6" with sparkle/brain icon
   - Bullet list of mock recommendations:
     - "Increase safety prompt ratio from 20% to 35% — safety RM accuracy lags helpfulness by 8 points"
     - "Rotate 30% of annotator cohort — fatigue signals detected in 4 annotators with >2000 annotations"
     - "Include top 15% annotations from Rounds 3-5 in training mix — prevents capability regression"
     - "Deploy model v3.2 alongside v3.1 at temperature 0.9 — increase response diversity"
   - "Apply to Next Iteration" button (mock action)

Create `iteration-analytics.ts` with seed data for 5 iterations of metrics plus preference margin distributions.

**Patterns to follow:**
- Existing `app/(admin)/analytics/page.tsx` layout and chart patterns
- `components/charts/annotation-volume-chart.tsx` for Recharts patterns
- `components/ui/stat-card.tsx` for metric display

**Test expectation:** none — visual/data display

**Verification:**
- Cross-iteration chart renders with toggleable metrics
- Signal degradation stacked area chart shows realistic distribution shift
- Playbook recommendation card renders with actionable items

---

### Tier 2: Key Pain Point Solutions (High Impact)

- [ ] **Unit 5: Prompt Coverage Dashboard (New Admin Screen)**

**Goal:** Create a new admin screen showing prompt topic distribution, coverage gaps, diversity scoring, and source breakdown. This is Differentiator #2 and the only module (M5: Prompt Engine) with essentially zero current representation.

**Requirements:** R5

**Dependencies:** None — new screen

**Files:**
- Create: `app/(admin)/prompts/page.tsx`
- Create: `stores/prompt-store.ts`
- Create: `data/prompt-seed.ts`
- Modify: `components/admin/sidebar.tsx`

**Approach:**
New admin screen at `/prompts` with sidebar nav item under DATA section (between Exports and Settings).

Screen layout:

1. **KPI cards** (top row):
   - Total Prompts: 4,280
   - Human-Written: 2,640 (62%)
   - Synthetic: 1,640 (38%)
   - Coverage Score: 78% (amber — gaps exist)

2. **Topic Distribution Heat Map** — Grid/treemap visualization showing prompt categories:
   - Categories: General Knowledge, Mathematics, Coding, Creative Writing, Safety/Ethics, Medical, Legal, Multi-lingual, Multi-turn, Adversarial
   - Cell size = prompt count, color intensity = coverage vs. target
   - Red cells for categories below target threshold
   - Green cells for categories meeting target

3. **Coverage Gap Alerts** — Card list of underrepresented categories:
   - "Multi-lingual prompts at 3% (target: 15%) — 480 additional prompts needed"
   - "Adversarial/red-team at 8% (target: 12%) — 160 additional prompts needed"
   - "Medical domain at 1% (target: 5%) — 170 additional prompts needed"

4. **Source & Quality Breakdown** — Two-column section:
   - Left: Pie chart of prompt sources (Human MTurk, Human Expert, Synthetic GPT-4, Synthetic Few-shot)
   - Right: Quality gate results — "Approved: 3,890 | Pending Review: 240 | Rejected: 150"

5. **Diversity Score Trend** — Small line chart showing diversity score across last 5 iterations

Create `prompt-store.ts` with mock prompt category data and `prompt-seed.ts` with seed data.

Add "Prompts" nav item to sidebar under DATA section with a database/grid icon.

**Patterns to follow:**
- Existing admin page layout pattern (PageHeader + KPI cards + content sections)
- `components/ui/stat-card.tsx` for KPI cards
- Recharts for visualizations
- `components/admin/sidebar.tsx` for nav item pattern

**Test expectation:** none — new visual screen

**Verification:**
- Prompt coverage page accessible from sidebar navigation
- Heat map/treemap renders with category data
- Coverage gap alerts highlight underrepresented areas
- Source breakdown chart renders correctly

---

- [ ] **Unit 6: Annotator Routing & Matching Configuration**

**Goal:** Add intelligent task routing configuration to the workforce management screen, showing how annotators are matched to tasks based on skills, performance, and difficulty level. This is Differentiator #3.

**Requirements:** R6

**Dependencies:** None — enhances existing screen

**Files:**
- Modify: `app/(admin)/annotators/page.tsx`
- Create: `components/admin/routing-config-modal.tsx`

**Approach:**
Add two enhancements to the annotators page:

1. **Routing Configuration Panel** — New section below the annotator table:
   - Header: "TASK ROUTING" with "Configure" button
   - Current routing rules shown as cards:
     - "Safety tasks → Annotators with safety certification + gold accuracy > 80%"
     - "Expert-level coding tasks → Annotators with coding skill + tasks(30d) > 50"
     - "New annotators → Easy difficulty tasks only for first 100 annotations"
   - Each rule shows how many annotators match and current assignment count
   - "Auto-route" toggle (on/off) with status indicator

2. **Routing Config Modal** — Triggered by "Configure" button:
   - Task type selector (multi-select)
   - Required skills filter (tags)
   - Minimum gold accuracy slider
   - Minimum IAA slider
   - Maximum difficulty level dropdown
   - Annotator tier requirement (All / Tier 2+ / Tier 3 only)
   - "Test Rule" button showing how many annotators would match
   - Save / Cancel

3. **Annotator table enhancement** — Add a "Routing" column showing each annotator's current assignments:
   - Task type icons for assigned types
   - Difficulty level badge (Easy/Medium/Hard)
   - "At capacity" indicator when assignment slots full

**Patterns to follow:**
- Existing `app/(admin)/annotators/page.tsx` layout
- `components/ui/modal.tsx` for modal pattern
- `components/ui/badge.tsx` for routing indicators

**Test expectation:** none — visual enhancement

**Verification:**
- Routing rules section renders below annotator table
- Configure modal opens with filter controls
- Annotator table shows routing column

---

- [ ] **Unit 7: Iteration Lifecycle Overview (New Admin Screen)**

**Goal:** Create a new admin screen treating iterations as first-class entities, showing the full lifecycle (strategy → collection → training → evaluation) with cross-cutting links to model versions, annotator cohorts, and data batches. This addresses Pain Point 1.3 and the product direction's core concept of "iteration as a first-class entity."

**Requirements:** R7

**Dependencies:** None — new screen

**Files:**
- Create: `app/(admin)/iterations/page.tsx`
- Create: `stores/iteration-store.ts`
- Create: `data/iteration-seed.ts`
- Modify: `components/admin/sidebar.tsx`

**Approach:**
New admin screen at `/iterations` with sidebar nav item under ADMIN section (below Campaigns).

Screen layout:

1. **Iteration Timeline** — Horizontal timeline at top showing 5 iterations:
   - Each iteration as a node with status (Complete/Active/Planned)
   - Active iteration highlighted with teal accent
   - Click to select and view details below

2. **Selected Iteration Detail Card** — Large card showing all dimensions:
   - **Strategy:** Objective text, data type mix (Helpfulness 60%, Safety 30%, SFT 10%)
   - **Model:** Deployed model version(s) with health indicators
   - **Cohort:** Annotator count, avg skill level, new vs. returning ratio
   - **Collection:** Annotations collected vs. target, completion %, IAA
   - **Training:** RM accuracy achieved, policy improvement metric
   - **Evaluation:** Human Elo delta, false refusal rate, capability regression check

3. **Iteration Comparison Table** — Below the detail card:
   - Rows: Iterations 1-5
   - Columns: Duration, Annotations, IAA, RM Accuracy, Elo Delta, Cost, Key Change
   - Color-coded cells showing improvement/regression vs. prior iteration

4. **"What Worked" Notes** — Editable notes section per iteration:
   - Mock entries: "Round 3: Adding preference strength signal improved RM accuracy by 4%", "Round 4: Rotating annotator cohort increased diversity but temporarily dropped IAA"

Add "Iterations" nav item to sidebar under ADMIN section with a cycle/refresh icon.

Create `iteration-store.ts` and `iteration-seed.ts` with 5 mock iterations of cross-cutting data.

**Patterns to follow:**
- Existing admin page layout pattern
- `app/(admin)/campaigns/[id]/rounds/[roundId]/page.tsx` for metric card patterns
- `components/ui/data-table.tsx` for comparison table

**Test expectation:** none — new visual screen

**Verification:**
- Iterations page accessible from sidebar navigation
- Timeline renders with selectable iterations
- Detail card shows all 6 dimensions
- Comparison table highlights improvements/regressions

---

- [ ] **Unit 8: Data Lineage & Provenance View**

**Goal:** Add data lineage visualization to the export and review systems, showing the full provenance chain for individual annotations. This addresses the product direction's cross-cutting concern that "every data point should be traceable."

**Requirements:** R8

**Dependencies:** None — enhances existing screens

**Files:**
- Create: `components/admin/provenance-panel.tsx`
- Modify: `app/(admin)/reviews/[id]/page.tsx`
- Modify: `app/(admin)/exports/new/page.tsx`

**Approach:**
Two additions:

1. **Provenance Panel on Review Detail** — New section on the review detail page showing the full lineage of the annotation under review:
   - Vertical timeline/tree showing:
     - Prompt source: "Human-written by Annotator Pool A, Batch 3" or "Synthetic, GPT-4 generated"
     - Model version: "claude-3.5-sonnet @ temp 0.8, deployed Apr 10"
     - Guideline version: "v2.3 (updated Apr 15)" with link to changelog
     - Annotator: "Marcus T., Tier 2, Gold Accuracy 82%"
     - QA Reviewer: "Automated pre-screen passed, Human review by Sarah C."
     - Timestamp chain: prompt generated → assigned → started → completed → reviewed

2. **Lineage Summary in Export Builder** — New expandable section in the export builder showing:
   - "Data Provenance Summary" card with:
     - Model versions included: list of model versions in selected rounds
     - Guideline versions spanned: e.g., "v2.1 through v2.3"
     - Annotator count: unique annotators in selection
     - QA coverage: "87% human-reviewed, 13% auto-approved only"
   - Warning callout if provenance is mixed: "Selected data spans 2 model versions and 3 guideline versions. This may introduce distribution inconsistencies in training."

**Patterns to follow:**
- `app/(admin)/reviews/[id]/page.tsx` existing layout
- `app/(admin)/exports/new/page.tsx` existing sections pattern
- Card/panel patterns from the design system

**Test expectation:** none — visual additions

**Verification:**
- Review detail shows provenance timeline for the annotation
- Export builder shows lineage summary for selected data
- Mixed-provenance warning appears when applicable

---

### Tier 3: Polish & Depth (Medium Impact)

- [ ] **Unit 9: Annotator Fatigue & Drift Detection**

**Goal:** Add fatigue risk indicators and drift detection to the workforce management screen, giving admins visibility into annotator quality degradation. This addresses Pain Point 4.2.

**Requirements:** R10

**Dependencies:** None — enhances existing screen

**Files:**
- Modify: `app/(admin)/annotators/page.tsx`
- Modify: `data/seed.ts`

**Approach:**
Add to the annotators page:

1. **Fatigue Risk KPI** — Add a 5th stat card: "At-Risk (Fatigue)" showing count of annotators with fatigue signals (e.g., 4)

2. **Fatigue indicators in table** — Add visual indicators to annotator rows:
   - "Fatigue" warning badge (amber) for annotators showing: declining accuracy over last 50 tasks + high task count (>100/day) + session duration >6 hours
   - "Drift" warning badge (orange) for annotators showing: systematic bias shift (e.g., consistently choosing Response A)
   - Tooltip on badges explaining the specific signal

3. **Session Health Panel** — New expandable section showing:
   - Chart: quality score vs. session duration for the workforce (scatter plot showing quality drops after ~4 hours)
   - "Recommended breaks" summary: "3 annotators have been active >5 hours without a break"
   - "Pattern alerts": "Annotator J. Lee shows 78% A-preference in last 50 tasks (expected: ~50%)"

Update seed data to include fatigue and drift indicators for 3-4 annotators.

**Patterns to follow:**
- Existing annotator table layout
- `components/ui/badge.tsx` for warning badges
- Existing stat card row pattern

**Test expectation:** none — visual enhancement

**Verification:**
- Fatigue risk stat card shows count
- Fatigue/drift badges appear on relevant annotator rows
- Session health panel renders with scatter chart

---

- [ ] **Unit 10: Continuous Calibration Exercise Flow**

**Goal:** Add calibration exercises as a distinct task type on the annotator home screen, separate from production annotations. This addresses Pain Points 4.6 and 2.2 — annotators should receive targeted practice on areas where they struggle.

**Requirements:** R11

**Dependencies:** Unit 1 (quality feedback panel)

**Files:**
- Modify: `app/(annotator)/annotate/page.tsx`

**Approach:**
Add a new section to the annotator home page between the performance cards and the task queue:

1. **Calibration Card** — Distinct card styled differently from regular tasks (amber/gold border instead of teal):
   - Header: "Calibration Exercise" with a target/bullseye icon
   - Reason: "Your safety task accuracy dropped below 70%. Complete this calibration to continue safety assignments."
   - Format: "5 pre-adjudicated safety comparisons with expert feedback"
   - "Start Calibration" button
   - "Due: Before next safety task assignment"

2. **Regular calibration indicator** — Smaller card for scheduled calibrations (not triggered by performance drop):
   - "Weekly Calibration — 3 tasks" with timer icon
   - Shows last calibration date and next due date
   - "Streak" indicator: "12 weeks calibrated"

3. **Integration note** — When calibration is overdue, show amber banner at top of task queue: "Complete your safety calibration to unlock safety task assignments"

Use existing mock data patterns — no new store needed, just conditional rendering on the annotator home page.

**Patterns to follow:**
- Existing task queue card pattern on `app/(annotator)/annotate/page.tsx`
- `components/ui/badge.tsx` for calibration badges
- Amber/gold color scheme to distinguish from regular teal tasks

**Test expectation:** none — visual addition

**Verification:**
- Calibration card renders with distinct styling
- Scheduled calibration indicator shows dates
- Amber banner appears for overdue calibrations

---

- [ ] **Unit 11: Data Mixing Configuration in Export Builder**

**Goal:** Enhance the export builder with batch mixing ratio configuration, allowing researchers to compose training datasets from multiple iterations with specified ratios. This addresses Pain Point 5.3.

**Requirements:** R12

**Dependencies:** None — enhances existing screen

**Files:**
- Modify: `app/(admin)/exports/new/page.tsx`

**Approach:**
Add a "Batch Mixing" section to the export builder (between source selection and quality gates):

1. **Mixing Strategy Selector** — Radio group:
   - "Latest round only" (current default)
   - "Custom mix from multiple rounds" (new)
   - "Smart mix — include top performers from all prior rounds" (new, with AI sparkle icon)

2. **Round Weight Configuration** (visible when "Custom mix" selected):
   - List of available rounds with weight sliders (0-100%)
   - Weights must sum to 100%
   - Each round shows annotation count and quality score
   - Visual bar chart preview showing final composition

3. **Smart Mix Preview** (visible when "Smart mix" selected):
   - Auto-calculated weights shown as read-only
   - Explanation: "Includes top 15% annotations from Rounds 1-4 based on gold accuracy and IAA scores"
   - "Prevents capability regression by maintaining representation of earlier training signal"
   - Distribution preview chart showing topic/type breakdown of mixed dataset

4. **Mixed Dataset Summary** — Below mixing config:
   - Total annotations after mixing
   - Topic distribution comparison (original vs. mixed)
   - Warning if any category is underrepresented after mixing

**Patterns to follow:**
- Existing export builder section layout
- Radio group and slider patterns from the task wizard
- `components/ui/progress-bar.tsx` for weight visualization

**Test expectation:** none — visual enhancement

**Verification:**
- Mixing strategy selector renders with 3 options
- Custom mix shows weight sliders per round
- Smart mix shows auto-calculated preview
- Mixed dataset summary updates based on selection

---

- [ ] **Unit 12: Admin Dashboard Enhancement — Feedback Loop Indicators**

**Goal:** Add visual indicators of the three feedback loops to the admin dashboard, giving researchers visibility into the platform's intelligence layer. This ties together all the improvements and makes the "intelligence" visible from the first screen an admin sees.

**Requirements:** R1, R2, R4

**Dependencies:** Units 1-4 (conceptually, but can be built independently)

**Files:**
- Modify: `app/(admin)/dashboard/page.tsx`

**Approach:**
Add two new sections to the admin dashboard (below existing campaign progress and quality alerts):

1. **Feedback Loop Health** — Three horizontal cards showing loop status:
   - **Inner Loop** (Annotator Quality): "Active — 24 annotators receiving real-time feedback" + avg response time to calibration nudges + "3 nudges triggered today"
   - **Calibration Loop** (Routing): "Active — 2 routing adjustments made this week" + "4 annotators reassigned from safety to helpfulness" + "Avg calibration score: 87%"
   - **Evolution Loop** (Guidelines): "Guidelines v2.3 deployed 3 days ago" + "Triggered by: 23% disagreement rate on borderline safety cases" + "Impact: disagreement dropped to 14%"
   - Each card has a green/amber/red health indicator

2. **Platform Intelligence Summary** — Single card at bottom:
   - "Signal Strength: 72% (declining — 34% negligible comparisons)"
   - "Data Efficiency: 2.3x improvement vs. random assignment" (mock)
   - "Iteration 5 Readiness: 78% — See playbook" with link to analytics

**Patterns to follow:**
- Existing dashboard section layout
- `components/ui/stat-card.tsx` patterns
- Alert card patterns already on the dashboard

**Test expectation:** none — visual addition

**Verification:**
- Feedback loop health cards render with status indicators
- Platform intelligence summary shows key metrics
- Links to relevant detail screens work

---

### Tier 4: Remaining Coverage — MVP Depth

These units close the remaining gaps between the prototype and the product direction document. Each is scoped to demonstrate the core concept with mock data — enough that an evaluator sees the capability exists, without deep interaction polish.

- [ ] **Unit 13: Model Gateway Enhancement (M4)**

**Goal:** Upgrade the model endpoints page from a simple health table into a proper Model Gateway showing deployment configuration, A/B testing, hot-swap workflow, and latency/caching dashboards. M4 currently has zero plan attention and sits at ~30% coverage.

**Requirements:** Pain Points 3.1 (infrastructure), 4.4 (latency)

**Dependencies:** None — enhances existing screen

**Files:**
- Modify: `app/(admin)/models/page.tsx`
- Modify: `stores/model-store.ts`
- Modify: `data/seed.ts`

**Approach:**
Expand the models page with four new sections below the existing endpoint table:

1. **Deployment Configuration Panel** — Per-endpoint expandable row or detail section:
   - Temperature slider (0.0–2.0), Top-P slider, Max Tokens input
   - System prompt text area (read-only display of current prompt)
   - "Response Pairs" config: how many responses to generate per prompt (2, 4, 6)
   - GPU allocation indicator: "2x A100" with utilization bar

2. **A/B Testing Toggle** — Card showing:
   - "Active A/B Test: claude-3.5-sonnet vs. llama-3-70b" with split ratio slider (50/50, 70/30, etc.)
   - Metrics comparison mini-table: avg latency, annotator preference rate, error rate per variant
   - Start/Stop test button, duration selector

3. **Hot-Swap Workflow** — Status card:
   - "Scheduled: Swap claude-3.5-sonnet-v1 → v2 on Apr 20 at 02:00 UTC"
   - "Active sessions at swap time: ~3 annotators — sessions will complete on current model"
   - Swap history timeline: 3-4 prior swaps with dates and versions
   - "Schedule Swap" button opening a simple form

4. **Latency & Caching Dashboard** — Metrics section:
   - Latency distribution histogram (p50/p95/p99 bars per endpoint)
   - Cache hit rate: "67% of response pairs served from cache"
   - "Avg annotator wait time: 4.2s" with trend indicator
   - Response pre-generation queue: "248 pairs pre-generated, 52 pending"

**Verification:**
- Deployment config renders per endpoint
- A/B test card shows variant comparison
- Hot-swap timeline shows swap history
- Latency histogram renders with distribution data

---

- [ ] **Unit 14: Task Design A/B Testing & Guideline Effectiveness (M2)**

**Goal:** Add a task design experimentation framework and guideline effectiveness measurement to the Task Studio. Addresses Pain Point 2.3 (no A/B testing for task design) and closes remaining M2 gaps.

**Requirements:** Pain Point 2.3

**Dependencies:** None — new section on existing screen or new sub-route

**Files:**
- Create: `app/(admin)/tasks/experiments/page.tsx`
- Modify: `components/admin/sidebar.tsx`
- Modify: `components/guidelines-drawer.tsx`

**Approach:**

1. **Task Experiments Page** (`/tasks/experiments`) — New admin screen under ADMIN section:
   - Page header: "TASK EXPERIMENTS" with "+ New Experiment" button
   - Active experiments table:
     - "Binary vs. 4-point preference scale": 2 task configs running in parallel, 120 vs. 118 annotations collected, IAA 0.71 vs. 0.68
     - "Choose safer vs. choose more harmful (red-team)": 80 vs. 75 annotations, annotator confusion rate 12% vs. 34%
   - Each row shows: experiment name, variant A config, variant B config, annotations per variant, primary metric per variant, statistical significance indicator (green check or gray "insufficient data")
   - Completed experiments section with winner highlighted

2. **Guideline Effectiveness Metrics** — Add to the guidelines drawer (new tab alongside Guidelines/Changelog/Edge Cases from Unit 3):
   - "Effectiveness" tab showing:
     - IAA before vs. after last guideline update (e.g., 0.63 → 0.71)
     - "Sections with highest disagreement" — ranked list of guideline sections with disagreement rates
     - "Clarity score" per section: computed from how often annotators reference that section in justifications vs. how often they flag confusion
     - "Suggested improvements" card: "Section 3.2 'Borderline Safety' has 28% disagreement — consider adding 2-3 more worked examples"

3. **Live Guideline Push Indicator** — Small enhancement to annotator task screens:
   - When a new guideline version is published, show a blue banner on active annotation screens: "Guidelines updated to v2.4 — 2 new edge cases added to Safety section. Review changes →"
   - Banner links to changelog tab in guidelines drawer

Add "Experiments" nav item under ADMIN section (below Tasks).

**Verification:**
- Experiments page renders with active and completed experiments
- Guideline effectiveness tab shows before/after IAA and clarity scores
- Live push banner appears on annotator screens (mock trigger)

---

- [ ] **Unit 15: Annotator Onboarding Pipeline, Compensation & Marketplace (M3)**

**Goal:** Add the recruitment/onboarding pipeline visualization, compensation configuration, and expert marketplace browse to the Workforce Hub. Closes M3's remaining ~40% gap.

**Requirements:** M3 features from product direction

**Dependencies:** None — enhances existing screen + new sub-route

**Files:**
- Create: `app/(admin)/annotators/onboarding/page.tsx`
- Create: `app/(admin)/annotators/marketplace/page.tsx`
- Modify: `app/(admin)/annotators/page.tsx`
- Modify: `components/admin/sidebar.tsx`

**Approach:**

1. **Onboarding Pipeline** (`/annotators/onboarding`) — Kanban-style board showing Meta's 4-stage vetting process:
   - Columns: Applied (14) → Grammar Test (8) → Topic Alignment (5) → Ranking Assessment (3) → Active (2 this week)
   - Each card: name, application date, current stage score, time in stage
   - Conversion rate shown between columns: "57% → 63% → 60% → 67%"
   - Funnel chart below showing dropout at each stage

2. **Compensation Configuration** — New section on the main annotators page:
   - "COMPENSATION" section with current pay model summary:
     - Base rate: $18/hr
     - Safety premium: +$4/hr (hazard pay for red-teaming)
     - Quality bonus: +15% for gold accuracy > 90%
     - Volume bonus: +10% for > 80 annotations/day
   - "Pay by Task Type" mini-table: Pairwise $0.45, Safety $0.62, SFT $0.85, etc.
   - Monthly spend indicator: "$42,300 (budget: $50,000)"

3. **Expert Marketplace** (`/annotators/marketplace`) — Browse screen for specialist annotators:
   - Filter bar: domain (Medical, Legal, Financial, Code), language, availability, hourly rate range
   - Card grid of available experts:
     - Profile: name, domain badges, languages, hourly rate, rating (4.8/5), past projects (12)
     - Availability indicator: "Available now" / "Available May 1"
     - "Invite to Project" button
   - 6-8 mock expert cards

Add "Onboarding" and "Marketplace" as sub-items under WORKFORCE section in sidebar.

**Verification:**
- Onboarding pipeline renders kanban columns with conversion rates
- Compensation section shows pay model breakdown
- Marketplace renders filterable expert cards

---

- [ ] **Unit 16: Multi-Turn Branching & Response Latency Indicator (M6)**

**Goal:** Add conversation branching to the multi-turn chat screen and a response latency indicator to all annotation screens. Addresses Pain Points 4.5 (multi-turn complexity) and 4.4 (latency kills throughput).

**Requirements:** Pain Points 4.4, 4.5

**Dependencies:** None — enhances existing screens

**Files:**
- Modify: `app/(annotator)/chat/page.tsx`
- Modify: `components/annotator/response-panel.tsx`

**Approach:**

1. **Conversation Branching** — Enhance the chat screen:
   - At each completed turn in the conversation history, show a small "Branch" button (fork icon)
   - Clicking "Branch" creates a visual fork point — the conversation splits into two paths displayed as tabs: "Path A (current)" and "Path B (branch)"
   - Branched path starts from that turn with new model responses generated
   - Branch indicator in conversation thread: vertical line splits into two with color coding
   - "Compare Paths" button at bottom showing side-by-side path summaries (turns taken, overall preference choices, conversation quality)
   - Mock: pre-populate 1 branch point at turn 2 with an alternative path already filled in

2. **Edge Case Flag Propagation** — When annotator clicks "Flag" on any task screen, enhance the flag modal:
   - Add "Flag as Edge Case" checkbox (in addition to regular flag)
   - When checked, show: "This will be reviewed and potentially added to the guidelines edge case library"
   - Category dropdown: "Ambiguous preference", "Guideline gap", "Unsafe but borderline", "Other"
   - This connects to the edge case library in the guidelines drawer (Unit 3)

3. **Response Latency Indicator** — On response panels across all task screens:
   - Small text below each response: "Generated in 3.2s" (subtle gray)
   - When latency is high (>8s), show amber indicator: "Generated in 12.1s — longer than usual"
   - On the chat screen, show a "Waiting for response..." skeleton with elapsed timer during mock generation

**Verification:**
- Chat screen shows branch buttons at completed turns
- Branching creates alternative path tabs
- Flag modal includes edge case option
- Latency indicator shows on response panels

---

- [ ] **Unit 17: QCC Intelligence — Ambiguity Detection, Reviewer Calibration & Auto-Classification (M7)**

**Goal:** Add rubric ambiguity detection, QA reviewer calibration tracking, rejection cost dashboard, and automated safety classification display to the Quality Control Center. Closes M7's remaining ~35% gap.

**Requirements:** Pain Points 2.2, 5.2; M7 features

**Dependencies:** None — enhances existing screens

**Files:**
- Modify: `app/(admin)/analytics/page.tsx`
- Modify: `app/(admin)/reviews/page.tsx`

**Approach:**

1. **Rubric Ambiguity Detection** — New section on analytics page:
   - "RUBRIC AMBIGUITY" section header
   - Heat map or table showing disagreement rate per rubric dimension/category:
     - "Borderline safety cases": 34% disagreement (red)
     - "Code quality vs. correctness": 28% disagreement (orange)
     - "Tone appropriateness": 22% disagreement (amber)
     - "Factual accuracy": 8% disagreement (green)
   - Each row links to example disagreements and suggests action: "Add 3+ worked examples" or "Refine scoring criteria"
   - "Auto-detected guideline gap" alert card: "12 annotators flagged confusion about 'partially correct' responses — consider adding a scoring rubric for partial credit"

2. **QA Reviewer Calibration** — New section on review queue page:
   - "REVIEWER PERFORMANCE" card showing reviewer consistency:
     - Reviewer table: Name, Reviews/Day, Agreement with Cohort, Overturn Rate, Avg Review Time
     - "Sarah C." — 45/day, 91% agreement, 3% overturned, 2.1 min avg
     - "James K." — 32/day, 84% agreement, 8% overturned, 3.4 min avg
   - Highlighted rows for reviewers below agreement threshold
   - "Calibration needed" badge for underperforming reviewers

3. **Rejection Cost Dashboard** — Card on review queue page:
   - "REJECTION COSTS (30D)" header
   - Metrics: Rejection rate 12%, Estimated wasted cost $3,840, Avg rejections per annotator 4.2
   - Top rejection reasons: "Insufficient justification" (34%), "Gold standard failure" (28%), "Time violation" (22%), "Off-topic" (16%)
   - Trend mini-chart showing rejection rate over time

4. **Auto-Classification Display** — On review detail page:
   - For safety/red-team annotations, show "Automated Safety Classification" card:
     - AI-predicted risk category with confidence: "Hate Speech (87% confidence)"
     - AI-predicted severity: "High"
     - Match indicator: "Agrees with annotator classification" (green check) or "Disagrees — annotator said Medium" (amber warning)

**Verification:**
- Ambiguity heat map renders with per-dimension disagreement rates
- Reviewer performance table shows calibration metrics
- Rejection cost card shows financial impact
- Auto-classification appears on safety review details

---

- [ ] **Unit 18: Data Engine — Deduplication, Distribution Analysis & Data Valuation (M8)**

**Goal:** Add near-duplicate detection, cross-batch distribution analysis, and data valuation display to the Data Engine. Addresses Pain Point 5.4 and closes M8's remaining ~50% gap.

**Requirements:** Pain Point 5.4; M8 features

**Dependencies:** None — new section or sub-route

**Files:**
- Create: `app/(admin)/exports/analysis/page.tsx`
- Modify: `components/admin/sidebar.tsx`

**Approach:**
New admin screen at `/exports/analysis` ("Data Analysis" under DATA section in sidebar):

1. **Near-Duplicate Detection** — Section showing:
   - "Potential Duplicates Found: 127 pairs (0.9% of dataset)"
   - Sample duplicates table: Prompt A text (truncated), Prompt B text (truncated), Similarity Score (0.92–0.99), Status (Keep Both / Merge / Remove)
   - "Auto-deduplicate" button with threshold slider (0.90–0.99)
   - Impact preview: "Removing duplicates above 0.95 similarity would reduce dataset by 89 items (0.6%)"

2. **Cross-Batch Distribution Analysis** — Visualizations:
   - Stacked bar chart showing topic distribution per batch/round:
     - Each bar = one round, segments = topic categories
     - Visual indicator where distributions shift significantly between rounds
   - "Distribution Drift" alert: "Round 4 has 45% coding prompts vs. 20% in Rounds 1-3 — intentional shift or prompt sourcing bias?"
   - Language distribution pie chart: English 82%, Spanish 8%, Mandarin 5%, Other 5%
   - Prompt length distribution histogram per round

3. **Data Valuation Dashboard** — Card section:
   - "Estimated Marginal Value by Category" table:
     - Safety: High value (RM accuracy gap: 8 points below target)
     - Helpfulness: Medium value (RM accuracy gap: 3 points below target)
     - Coding: Low value (RM accuracy at target)
     - Creative writing: Medium value (limited training samples)
   - Recommendation card: "Collect 500 more safety annotations — estimated +2.4% RM accuracy improvement"
   - "Diminishing Returns" curve showing estimated RM accuracy vs. additional annotations per category

Add "Data Analysis" nav item under DATA section in sidebar.

**Verification:**
- Duplicate detection table renders with similarity scores
- Distribution chart shows per-round topic breakdown
- Data valuation table shows marginal value estimates
- Diminishing returns curve renders

---

- [ ] **Unit 19: Training Results Import & Cost Analytics (M9)**

**Goal:** Add training results visualization, RM accuracy tracking, human Elo evaluation display, and cost-per-improvement analysis to close M9's remaining gaps. These represent the "outer loop" — connecting model training back to data collection strategy.

**Requirements:** Pain Points 6.1, 6.2, 6.3; M9 features

**Dependencies:** Unit 4 (cross-iteration analytics provides the container)

**Files:**
- Modify: `app/(admin)/analytics/page.tsx`
- Modify: `data/iteration-analytics.ts`

**Approach:**
Add three new sections to the analytics page (extending Unit 4's additions):

1. **Training Results Dashboard** — Section with:
   - "TRAINING RESULTS" header with iteration selector dropdown
   - RM Accuracy tracker: dual gauge charts for Helpfulness RM (78.3%) and Safety RM (74.1%) with targets
   - Accuracy trend line across iterations (Recharts line chart)
   - "False Refusal Rate: 4.2% (down from 7.8% in Round 3)" with trend arrow
   - Capability regression checklist: "Math reasoning: passed, Code generation: passed, Creative writing: regressed (-2.1%)" with pass/fail indicators

2. **Human Elo Evaluation** — Section with:
   - "ELO RANKINGS" header
   - Model Elo table: Model name, Current Elo, Delta (vs. prior round), Win Rate, Matches
   - "Round 5 model: 1247 Elo (+34 from Round 4)"
   - Bar chart showing Elo progression across rounds
   - "Evaluation confidence: 94% (based on 420 head-to-head matches)"

3. **Cost-Per-Improvement Analysis** — Section with:
   - "COST EFFICIENCY" header
   - Key metrics: Cost per annotation $0.52, Cost per 1% RM improvement $4,200, Total iteration cost $28,400
   - Efficiency trend chart: cost per 1% RM improvement over iterations (should be increasing as gains get harder)
   - Breakdown by data type: "Safety annotations cost $0.62 each but yield 2.1x the RM improvement per dollar vs. helpfulness"
   - "Budget Recommendation" card: "At current efficiency, reaching 82% safety RM accuracy requires ~$8,400 additional spend (est. 2,000 more safety annotations)"

**Verification:**
- RM accuracy gauges render with current values
- Elo table shows model rankings with deltas
- Cost efficiency charts show per-iteration trends
- Budget recommendation card shows specific estimates

---

- [ ] **Unit 20: Enterprise Settings — SSO, API, Webhooks & Custom Workflows (Theme 5)**

**Goal:** Expand the settings page with SSO configuration, API documentation, webhook management, and a custom workflow builder concept. This addresses Theme 5 (Enterprise & Ecosystem) which currently sits at ~14% coverage.

**Requirements:** Theme 5 features from product direction

**Dependencies:** None — enhances existing settings page

**Files:**
- Modify: `app/(admin)/settings/api-keys/page.tsx`
- Create: `app/(admin)/settings/sso/page.tsx`
- Create: `app/(admin)/settings/webhooks/page.tsx`
- Create: `app/(admin)/settings/workflows/page.tsx`
- Create: `app/(admin)/settings/compliance/page.tsx`

**Approach:**
The existing settings page has tab navigation (General, API Keys, Billing, Security). Expand to full sub-routes:

1. **SSO Configuration** (`/settings/sso`):
   - Provider selector: SAML 2.0 / OIDC / Google Workspace / Okta
   - Configuration fields: Entity ID, SSO URL, Certificate (upload), Attribute Mapping table
   - "Test Connection" button with status indicator
   - "Enforce SSO for all users" toggle
   - Current status: "SSO Active — Okta, 28 users synced, last sync 2 hours ago"

2. **API Documentation** — Enhance the existing API Keys tab:
   - Add "API Reference" section below the key table:
     - Endpoint list: `POST /api/v1/annotations`, `GET /api/v1/tasks`, `POST /api/v1/exports`, etc.
     - Each with method badge (GET/POST/PUT), description, auth requirement
     - Rate limit display: "1000 req/min per key"
     - "View Full Docs" button (mock external link)

3. **Webhooks** (`/settings/webhooks`):
   - Webhook table: URL, events subscribed, status (Active/Failed), last triggered, failure count
   - "+ Add Webhook" form: URL input, event multi-select (annotation.completed, review.approved, export.ready, task.updated, calibration.triggered), secret token display
   - Recent deliveries log: timestamp, event, status code, response time
   - 3 mock webhooks configured

4. **Custom Workflow Builder** (`/settings/workflows`):
   - Concept-level visual: flowchart showing the current pipeline stages
   - Default workflow displayed as connected nodes: Prompt → Model Response → Annotation → QA Review → Export
   - "Customizable" toggle points highlighted:
     - After Annotation: "Add peer review step?" toggle
     - After QA Review: "Add senior adjudication step?" toggle
     - After Export: "Auto-trigger training pipeline?" toggle
   - 2 saved workflow templates: "Standard (Anthropic-style)" and "Rigorous (Meta-style)" with comparison
   - This is conceptual/visual — demonstrates the customizability without a full drag-and-drop builder

5. **Data Governance & Compliance** (`/settings/compliance`):
   - Data residency selector: "US-East" / "EU-West" / "Asia-Pacific" with current selection
   - Retention policy: "Annotations retained for 365 days, then archived"
   - PII detection: "Auto-scan enabled — 3 annotations flagged for potential PII this month"
   - Export audit log: table showing who exported what, when, with what quality gates
   - Compliance checklist: SOC 2 (in progress), GDPR (compliant), HIPAA (not applicable)

Update sidebar settings section or use the existing tab pattern to expose these sub-routes.

**Verification:**
- SSO config page renders with provider options
- API reference section shows endpoint list
- Webhooks page shows configured hooks with event subscriptions
- Workflow builder shows customizable pipeline visualization
- Compliance page shows governance controls

---

## System-Wide Impact

- **Interaction graph:** The quality feedback panel (Unit 1) is the most cross-cutting change — it touches all 8 annotator screens. Sidebar gains 6 new nav items (Units 5, 7, 14, 15, 18 + settings sub-routes in Unit 20). The analytics page grows significantly (Units 4, 17, 19) — consider whether it should split into sub-routes. The review queue (Units 2, 17) gets the most structural changes. Dashboard (Unit 12) links to screens created in other units.
- **Error propagation:** No real error states — all mock data. New stores follow existing Zustand patterns.
- **State lifecycle risks:** New stores (`session-store`, `prompt-store`, `iteration-store`) follow the same in-memory pattern as existing stores — reset on refresh, which is acceptable for the prototype.
- **API surface parity:** N/A — no real API.
- **Integration coverage:** Quality feedback panel must render consistently across all 8 task types. New sidebar items must highlight correctly based on current route. Analytics page needs section anchors or sub-navigation to manage 6+ sections. Settings sub-routes need consistent tab/nav pattern.
- **Unchanged invariants:** All existing 34 screens remain functional. No existing navigation paths are broken. Design system tokens and component library remain unchanged.
- **New screen count:** Tier 4 adds ~7 new routes (experiments, onboarding, marketplace, data analysis, sso, webhooks, workflows, compliance). Total prototype grows from 34 screens to ~47 screens.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Quality feedback panel clutters annotation screens on smaller viewports | Make it collapsible with a thin edge-tab; default to collapsed on narrow screens |
| Analytics page becomes overwhelming with Units 4 + 17 + 19 | Split analytics into sub-tabs or sub-routes: Quality / Iterations / Training / Cost |
| Too many new sidebar items (6 additions) | Group carefully under existing sections; consider collapsible sub-navs |
| New sidebar items may not match Paper design system | Follow exact same patterns as existing nav items; use consistent Lucide icons |
| Mock data for "AI recommendations" may look unrealistic | Use specific, quantitative language grounded in the product direction's examples |
| 20 units is ambitious scope | Tier structure allows stopping at any tier boundary with increasing value captured |
| Settings page complexity explosion (5 sub-routes) | Use consistent sub-route pattern with sidebar or tab navigation within settings |
| Custom workflow builder scope creep | Keep it conceptual — visual flowchart with toggles, not a drag-and-drop builder |

## Sequencing Recommendation

The tiers are designed for independent execution:

- **Tier 1 (Units 1-4):** Core differentiators. ~70% of differentiation value. Execute first.
- **Tier 2 (Units 5-8):** Key pain point solutions. Can be parallelized.
- **Tier 3 (Units 9-12):** Polish and depth. Unit 10 depends on Unit 1.
- **Tier 4 (Units 13-20):** Remaining coverage for full product direction alignment. All independent of each other, all depend on Tiers 1-3 conceptually but not technically.

Within each tier, recommended order:
- Tier 1: Unit 1 → Unit 2 → Unit 3 → Unit 4
- Tier 2: Unit 5 and Unit 7 in parallel (new screens), then Unit 6 and Unit 8 (enhancements)
- Tier 3: Unit 12 → Unit 9 → Unit 10 → Unit 11
- Tier 4: Unit 13 → Unit 14 → Unit 15 → Unit 16 → Unit 17 → Unit 18 → Unit 19 → Unit 20 (or parallelize: 13+14, 15+16, 17+18, 19+20)

## Sources & References

- **Origin document:** [product-direction.md](../../product-direction.md)
- **Existing plan:** [docs/plans/2026-04-17-001-feat-dataforge-mvp-plan.md](2026-04-17-001-feat-dataforge-mvp-plan.md)
- **Current prototype:** 34 screens across `app/(admin)/` and `app/(annotator)/` route groups
- **Product direction pain points:** 19 pain points across 6 RLHF pipeline phases
- **Product direction differentiators:** 7 features neither Anthropic nor Meta had
