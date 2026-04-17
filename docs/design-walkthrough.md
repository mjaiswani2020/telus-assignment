# RLHF DataForge — Design Walkthrough

A screen-by-screen guide to every interface in the RLHF DataForge platform. This document covers the complete end-to-end flow across both the **Admin Interface** (21 screens) and the **Annotator Interface** (13 screens), explaining every component, interaction pattern, and design decision.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Design System](#2-design-system)
3. [Admin Interface — Screens 01 to 21](#3-admin-interface)
   - [01 Admin Dashboard](#screen-01--admin-dashboard)
   - [02 Project List](#screen-02--project-list)
   - [03 Project Detail](#screen-03--project-detail)
   - [04 Campaign Round Detail](#screen-04--campaign-round-detail)
   - [05 Task List](#screen-05--task-list)
   - [06 Task Template Picker](#screen-06--task-template-picker)
   - [07–13 Task Configuration Wizard](#screen-07--task-config-basic-info)
   - [14 Model Endpoint Registry](#screen-14--model-endpoint-registry)
   - [15 Workforce Management](#screen-15--workforce-management)
   - [16 Quality Dashboard](#screen-16--quality-dashboard)
   - [17 Review Queue](#screen-17--review-queue)
   - [18 Annotation Review Detail](#screen-18--annotation-review-detail)
   - [19 Data Export Builder](#screen-19--data-export-builder)
   - [20 Export History](#screen-20--export-history)
   - [21 Settings & API Keys](#screen-21--settings--api-keys)
4. [Annotator Interface — Screens 22 to 34](#4-annotator-interface)
   - [22 Annotator Home](#screen-22--annotator-home)
   - [23 Pairwise Preference](#screen-23--pairwise-preference)
   - [24 Multi-Turn Conversational](#screen-24--multi-turn-conversational)
   - [25 SFT Data Authoring](#screen-25--sft-data-authoring)
   - [26 Safety Red-Teaming](#screen-26--safety-red-teaming)
   - [27 Response Editing](#screen-27--response-editing)
   - [28 N-Way Ranking](#screen-28--n-way-ranking)
   - [29 Rubric Scoring](#screen-29--rubric-scoring)
   - [30 Model Arena](#screen-30--model-arena)
   - [31 Annotator Profile](#screen-31--annotator-profile)
   - [32 Qualification Test](#screen-32--qualification-test)
   - [33 Qualification Test Builder](#screen-33--qualification-test-builder)
   - [34 Guidelines Viewer](#screen-34--guidelines-viewer)
5. [Key User Flows](#5-key-user-flows)
6. [Design Decisions & Rationale](#6-design-decisions--rationale)

---

## 1. Platform Overview

RLHF DataForge is a multi-tenant SaaS platform for configuring, collecting, and managing human feedback data used to align large language models via RLHF. It serves two distinct user groups through two separate interfaces:

**Admin Interface** — Used by ML engineers and data managers (persona: Priya) to:
- Organize work into Projects and Campaigns with iterative Rounds
- Configure annotation tasks from 8 research-validated templates
- Register and manage model API endpoints (BYOM architecture)
- Manage an internal annotator workforce with qualification, routing, and compensation
- Monitor data quality with IAA metrics, gold standard tracking, and bias detection
- Export training-ready data in DPO, PPO, SFT, and other formats

**Annotator Interface** — Used by human annotators (persona: Marcus) to:
- Complete assigned annotation tasks across 8 task types
- Take qualification tests and view personal performance
- Access guidelines, flag issues, and track progress

### Information Hierarchy

```
Tenant (Organization)
  └── Projects (e.g., "Helpfulness Track", "Safety Track")
       └── Campaigns (e.g., "Llama 3 Alignment Campaign")
            └── Rounds (e.g., "Round 3 — Post-DPO Checkpoint")
                 └── Task Configurations (e.g., "Pairwise Preference")
                      └── Individual Annotation Tasks
```

---

## 2. Design System

The platform uses the **Spectrum Design System v1.1.0** with these foundations:

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Primary Deep Teal | `#005151` | Annotator header bar, primary buttons, selected sidebar highlight |
| Ink | `#1A1E1D` | Primary body text, headings |
| Off White | `#FFFEFE` | Page backgrounds |
| Border | `#EBEEED` | Card borders, dividers |
| Selected State BG | `#E6F2F2` | Active sidebar item background (Admin) |
| Sidebar Text | `#686873` | Non-selected sidebar items |
| Section Labels | `#556260` | Sidebar section headers (ADMIN, WORKFORCE, etc.) |

### Typography

| Font | Family | Usage |
|---|---|---|
| Literata | Serif | Page headings, dashboard titles |
| Inter | Sans-serif | Body text, labels, form fields, table content |
| IBM Plex Mono | Monospace | Code blocks, data values, version strings |

### Interface Patterns

**Admin screens** use a left sidebar + main content layout at 1440x1024px. The sidebar contains grouped navigation items under labeled sections (ADMIN, WORKFORCE, QUALITY, DATA). The currently active item is highlighted with a light teal background (`#E6F2F2`) and teal text (`#005151`).

**Annotator screens** use a full-width layout with a dark teal header bar (`#005151`) containing the task name, progress counter, timer, and action buttons (Guidelines, Flag, Skip). White text on the dark header. No sidebar navigation — annotators move through tasks linearly.

---

## 3. Admin Interface

The Admin Interface is where ML engineers and data managers configure, monitor, and manage everything. It uses a persistent left sidebar for navigation.

### Sidebar Navigation Structure

```
ADMIN
  Dashboard
  Projects
  Campaigns
  Tasks
  Models

WORKFORCE
  Annotators
  Qualifications

QUALITY
  Analytics
  Reviews

DATA
  Exports
  API Keys
```

---

### Screen 01 — Admin Dashboard

**Route:** `/dashboard`
**Sidebar active:** Dashboard

The landing page for admin users. Provides an at-a-glance overview of the entire platform's health and activity.

#### Components

**Top bar:** "DATAFORGE" logo (DF badge + wordmark) on the left. Organization selector ("Alignment Lab") and user avatar on the right.

**KPI cards (4 across):**
- **Annotations** — Total count (12,847) with week-over-week trend (+14% WoW)
- **Active Annotators** — Current count (24) with recent additions (+3 new)
- **Avg IAA (AC2)** — Inter-annotator agreement using Gwet's AC2 metric (0.72, +0.03)
- **Active Campaigns** — Count (3) with total rounds (7 rounds total)

**Campaign Progress section:** Shows each active campaign/round as a horizontal progress bar with percentage, annotation count vs. target, and color-coded bars (deep teal for Alignment, orange for Safety, green for Arena).

**Quality Alerts section:** Color-coded alert cards:
- Yellow — Annotator quality drops (gold accuracy below threshold)
- Pink — IAA below target threshold
- Light blue — Flagged annotations pending review

**Annotation Volume chart:** Line chart showing annotation volume over the last 30 days, broken down by task category (Helpfulness, Safety, SFT, Arena). Uses Inter labels and a clean axis grid.

#### Design Rationale
The dashboard is designed for Priya's daily check-in: "Are my campaigns on track? Are there quality issues I need to address?" The alerts are intentionally prominent — quality problems caught early prevent expensive data re-collection.

---

### Screen 02 — Project List

**Route:** `/projects`
**Sidebar active:** Projects

Displays all projects within the tenant as cards.

#### Components

**Page header:** "PROJECTS" title with organization name and "+ New Project" button (teal, rounded).

**Project cards (3 across):** Each card shows:
- Project avatar (colored circle with initial: H, S, C)
- Project name and creation date
- Description text
- Summary stats: Campaigns count, Active rounds, Total annotations

The cards use a subtle border and hover state. The example shows three projects: "Helpfulness Track" (Jan 2026), "Safety Track" (Feb 2026), and "Code Evaluation" (Mar 2026).

#### Flow
Clicking a project card navigates to Screen 03 (Project Detail).

---

### Screen 03 — Project Detail

**Route:** `/projects/:id`
**Sidebar active:** Projects

Drill-down into a single project showing its campaigns and task configurations.

#### Components

**Breadcrumb:** "< Projects" back link above the project title.

**Project header:** Project name ("Helpfulness Track") with status badge ("Active") and "+ New Campaign" button.

**Summary cards (3 across):**
- Campaigns (3)
- Active Rounds (2)
- Total Annotations (45,231)

**Campaigns table:** Columns — Campaign Name, Status (Active/Complete badge), Rounds, Annotations, IAA, Created date. Shows campaigns like "Llama 3 Alignment Campaign" with inline metrics.

**Task Configurations table:** Columns — Task Name, Type (Comparison, Conversational, Scoring, Ranking), Status (Active/Draft badge), Annotations count.

#### Flow
Clicking a campaign row navigates to Screen 04 (Campaign Round Detail). Clicking a task row opens the task configuration wizard (Screens 07–13).

---

### Screen 04 — Campaign Round Detail

**Route:** `/projects/:id/campaigns/:id/rounds/:id`
**Sidebar active:** Campaigns

The operational center for an active RLHF round. Shows progress, quality metrics, model versions, and cross-round comparison.

#### Components

**Page header:** Back link ("< Llama 3 Alignment Campaign"), round name ("Round 3 — Post-DPO Checkpoint"), and "Status: ACTIVE" badge.

**Progress cards (3 across):**
- Progress — bar chart showing 8,231/11,500 with percentage (72%) and ETA
- IAA (AC2) — current value (0.72) vs. target (0.65) with pass/fail indicator
- Preference Distribution — breakdown showing Sig: 12%, Bet: 34%, Sli: 38%, Neg: 16%

**Model Versions section:** Shows which model endpoints are assigned to this round (e.g., Llama-3-70B-DPO-v3.1 as Model A, v3.0 as Model B). "Update Models" action.

**Cross-Round Comparison table:** Side-by-side metrics across all rounds (Round 1, 2, 3) for IAA, Gold Accuracy, preference strength distribution, average time per task, and annotation counts. Includes a callout note explaining that declining "significantly better" ratings indicate model convergence — a finding documented in Meta's Llama 2 research.

**Action buttons:** Advance to Review, Export Round Data, View Annotations.

#### Design Rationale
This screen directly addresses Priya's need to track iterative RLHF progress. The cross-round comparison table is the most distinctive feature — no existing tool shows how annotator agreement and preference distributions shift as models improve across training rounds.

---

### Screen 05 — Task List

**Route:** `/tasks`
**Sidebar active:** Tasks

Lists all task configurations across the organization.

#### Components

**Page header:** "Task Configurations" title with Status and Type filter dropdowns and "+ New Task" button.

**KPI cards (4 across):** Total Tasks (12), Active (5), Draft (4, in orange), Completed (3).

**Task table:** Columns — Task Name, Type (color-coded badges: Pairwise, Safety, SFT, Arena, Editing), Project, Status (dot + text), Annotations count, Created date.

#### Flow
Clicking "+ New Task" navigates to Screen 06 (Template Picker). Clicking a task row opens its configuration.

---

### Screen 06 — Task Template Picker

**Route:** `/tasks/new`
**Sidebar active:** Tasks

The starting point for creating a new annotation task. Presents 8 research-validated templates plus a custom option.

#### Components

**Page header:** "NEW TASK" title with subtitle "Choose a template to get started, or build from scratch."

**Template cards (4x2 grid):** Each card includes:
- Icon (teal-colored glyph unique to each type)
- Template name
- Description (2–3 lines explaining the task type)
- Research methodology tag (e.g., "Anthropic / Meta", "General RLHF", "LMSYS / Anthropic")
- "Use Template" button (teal, full-width)

**The 8 templates:**
1. **Pairwise Preference** — Compare two model responses side by side
2. **Multi-Turn Chat** — Real-time chat with live models, compare at each turn (Anthropic-style)
3. **SFT Data Authoring** — Annotators write prompt-response pairs (Meta-style)
4. **Safety / Red-Teaming** — Adversarial testing with safety labels and wellbeing safeguards
5. **Response Editing** — Annotators improve model outputs; produces preference pairs via diff
6. **N-Way Ranking** — Rank N responses best to worst with drag-and-drop
7. **Rubric Scoring** — Multi-dimensional evaluation with configurable scoring axes
8. **Model Arena** — Blind head-to-head with Elo rating (LMSYS Chatbot Arena style)

**Start from Scratch option:** Dashed-border card at the bottom with a "Create Custom" button for fully bespoke configurations.

#### Flow
Clicking "Use Template" opens Screen 07 (Task Config: Basic Info) with template defaults pre-filled.

---

### Screen 07 — Task Config: Basic Info

**Route:** `/tasks/new` (Step 1 of 7)
**Sidebar active:** Tasks

The first step of the 7-step task configuration wizard. Collects basic metadata about the task.

#### Components

**Wizard header:** Template indicator ("Template: Meta Pairwise Preference"), "+ Preview" button, and "Save Draft" button (red/teal).

**Step sidebar:** Numbered vertical list of all 7 wizard sections:
1. **Basic Info** (active — teal circle, bold text)
2. Prompts
3. Models
4. Annotation
5. Quality
6. Guidelines
7. Review

**Form fields:**
- Task Name (text input, e.g., "Llama Helpfulness Eval — Round 3")
- Description (textarea)
- Project (dropdown: "Llama Alignment")
- Campaign (dropdown: "Llama 3 Alignment Campaign")
- Round (dropdown: "Round 3")
- Required Annotator Skills (tag input with "+ Add skill", e.g., "General Preference")

**Navigation:** "Next: Prompts >" button at bottom right.

#### Design Rationale
The wizard uses a linear numbered stepper to guide admins through a complex multi-field configuration. The step sidebar makes it clear where you are and what's ahead. The left-side admin sidebar remains visible for orientation but the wizard section stepper is the primary navigation within this flow.

---

### Screen 08 — Task Config: Prompts

**Route:** `/tasks/new` (Step 2 of 7)
**Sidebar active:** Tasks

Configures where prompts come from for this task.

#### Components

**Step sidebar:** Step 2 (Prompts) highlighted.

**Prompt source options:**
- Annotator-authored (annotators write their own prompts)
- Dataset import (upload a CSV/JSONL of prompts)
- Model-generated
- Mixed

**Dataset upload area** (if dataset import selected): drag-and-drop zone or file browser.

**Category taxonomy configuration:** Define prompt categories (e.g., factual, creative, coding, safety).

**Length constraints:** Min/max prompt length fields.

**Navigation:** "< Back" and "Next: Models >" buttons.

---

### Screen 09 — Task Config: Models

**Route:** `/tasks/new` (Step 3 of 7)
**Sidebar active:** Tasks

Configures which model endpoints will generate responses for this task.

#### Components

**Step sidebar:** Step 3 (Models) highlighted.

**Model endpoint selection:** Choose from registered endpoints (links to Screen 14).

**Response source options:** Real-time model API call, batch import, or annotator-written.

**Pairing strategy:** Same model (compare two generations from one model), different models (A vs B), or mixed.

**Responses per task:** Numeric input (default: 2 for pairwise).

**Navigation:** "< Back" and "Next: Annotation >" buttons.

---

### Screen 10 — Task Config: Annotation

**Route:** `/tasks/new` (Step 4 of 7)
**Sidebar active:** Tasks

The core annotation settings — configures the preference scale, polarity, and additional input fields.

#### Components

**Step sidebar:** Step 4 (Annotation) highlighted.

**Preference Scale selector:** Radio options — Binary (A/B), 4-point (Meta-style: Significantly / Better / Slightly / Negligibly better), 7-point, or custom labels.

**Preference Polarity:** Dropdown — "Pick better response" (standard) or "Pick worse response" (red-teaming mode).

**Allow ties:** Checkbox toggle.

**Additional Inputs checkboxes:**
- Justification text (with "Required" sub-toggle)
- Safety labels
- Risk categories
- Custom dimensions (with "+ Add Dimension" button)

**Constraints:**
- Min time per task (seconds)
- Allow skip / Allow flag checkboxes

**Navigation:** "< Back" and "Next: Quality >" buttons.

---

### Screen 11 — Task Config: QC Pipeline

**Route:** `/tasks/new` (Step 5 of 7)
**Sidebar active:** Tasks

Configures the quality control pipeline for this task — one of DataForge's key differentiators.

#### Components

**Step sidebar:** Step 5 (Quality) highlighted.

**QC pipeline builder:** Admins assemble a pipeline from building blocks:
- Gold standard insertion rate (slider, 0–20%)
- Minimum time threshold (seconds)
- Overlap count (1–5 annotators per task)
- Review sample rate (0–100%)
- Min agreement threshold
- Performance gate threshold

**Pipeline presets:** Quick-select buttons for Lightweight, Production, or Research-grade pipelines.

**Navigation:** "< Back" and "Next: Guidelines >" buttons.

---

### Screen 12 — Task Config: Guidelines

**Route:** `/tasks/new` (Step 6 of 7)
**Sidebar active:** Tasks

Rich-text editor for writing the annotation guidelines that annotators will see while working.

#### Components

**Step sidebar:** Step 6 (Guidelines) highlighted.

**Guideline editor:** Rich text area with markdown support. Includes:
- Formatting toolbar (bold, italic, headings, lists, code blocks)
- Version indicator
- Annotated examples section (add examples showing correct annotation behavior)

**Navigation:** "< Back" and "Next: Review >" buttons.

---

### Screen 13 — Task Config: Review

**Route:** `/tasks/new` (Step 7 of 7)
**Sidebar active:** Tasks

Final review step showing a summary of all configuration choices before saving.

#### Components

**Step sidebar:** Step 7 (Review) highlighted with a checkmark.

**Configuration summary:** Read-only display of all settings organized by section:
- Basic Info (name, project, campaign, round)
- Prompt Config (source, categories)
- Model Config (endpoints, pairing strategy)
- Annotation Config (scale, polarity, additional fields)
- Quality Pipeline (gold rate, overlap, thresholds)
- Guidelines (version, last updated)

**Action buttons:** "Save as Draft" and "Activate Task" (makes it live for annotators).

---

### Screen 14 — Model Endpoint Registry

**Route:** `/models`
**Sidebar active:** Models

Central registry for all model API endpoints. Supports the BYOM (Bring Your Own Model) architecture.

#### Components

**Page header:** "MODEL ENDPOINTS" title with organization name and "+ Add Endpoint" button.

**Endpoint table:** Columns — Name, Provider, Version, Health, Tasks, Latency.

Example data shows:
- Llama-3-70B (vLLM, dpo-v3.1) — Up, 3 tasks, 340ms
- Llama-3-70B (vLLM, dpo-v3.0) — Up, 2 tasks, 355ms
- Llama-3-13B (vLLM, sft-v2.0) — Up, 1 task, 180ms
- GPT-4-Turbo (OpenAI, 2024-04) — Up, 1 task, 520ms
- Claude-3-Opus (Anthropic, latest) — Slow (orange), 0 tasks, 2,100ms

Health indicators are color-coded: green "Up", orange "Slow".

Latency values in red when above acceptable thresholds.

#### Design Rationale
The BYOM architecture is central to DataForge's value proposition. ML teams don't need to host models within the platform — they register their existing inference endpoints (vLLM clusters, OpenAI API, Anthropic API, custom HTTP). The health monitoring ensures annotators aren't blocked by down endpoints.

---

### Screen 15 — Workforce Management

**Route:** `/annotators`
**Sidebar active:** Annotators

The annotator roster — manage the internal workforce.

#### Components

**Page header:** "ANNOTATORS" title with search bar, status filter dropdown, and "+ Add Annotator" button.

**KPI cards (4 across):** Total (28), Active (24, teal), In Review (2, orange), Onboarding (2, teal).

**Annotator table:** Columns — Name (with avatar initials), Status (Active/Review/Paused with color-coded dots), Skills (tag badges: Safety, Code, Medical, Creative, General), Gold Acc, IAA, Tasks (30D), Trend (Improving/Stable/Declining with arrow indicators).

Low-performing annotators have their metrics highlighted in orange/red (e.g., Alex C. with 0.58 gold accuracy and "Review" status; Wei Z. with 0.54 and "Paused" status).

#### Design Rationale
The skills column is key — DataForge routes tasks to annotators based on skill qualifications. The trend column helps Priya identify annotators drifting in quality before it impacts data. The Paused status shows the performance gate system in action: Wei Z. has been automatically paused for falling below quality thresholds.

---

### Screen 16 — Quality Dashboard

**Route:** `/quality`
**Sidebar active:** Analytics

Real-time quality analytics across the platform.

#### Components

**Page header:** "QUALITY DASHBOARD" with Project filter and date range selector.

**Overall IAA chart:** Line chart of Gwet's AC2 over time, broken down by task category (Helpfulness, Safety, Overall). Shows Target (0.80, dashed green) and Threshold (0.65, dashed red) reference lines.

**Annotator Performance table:** Columns — Annotator, Gold Acc, Peer IAA, Tasks/Hr, Status. Matches the PRD's quality analytics spec. Color-coding: green for active/healthy, orange for review, red for paused.

**Bias Detection section:** Three key bias checks:
- Position bias (is Response A systematically preferred?)
- Length bias (correlation between response length and preference)
- Model bias (is one model version systematically preferred?)

Each check shows a status: "within normal" (green) or "investigate" (orange warning).

#### Design Rationale
The bias detection panel is unique to RLHF workflows. If annotators systematically prefer longer responses or always pick the response on the left, the training data will embed those biases into the model. These checks surface problems that no general-purpose annotation tool would catch.

---

### Screen 17 — Review Queue

**Route:** `/quality/reviews`
**Sidebar active:** Reviews

Prioritized queue of annotations needing human review.

#### Components

**Page header:** "REVIEW QUEUE" with organization name and avatar.

**KPI cards (4 across):** Pending (23, orange), Flagged by Annotators (8), Auto-flagged (15), Resolved Today (12).

**Filter tabs:** All (23), Flagged (8), Auto-flagged (15), Escalated (0).

**Review table:** Columns — Reason, Source (Flagged/Auto badge), Flagged By, Task Type (badge), Time, Actions ("Review" button).

Example rows show:
- "Ambiguous comparison" — Flagged by Marcus T. (Pairwise)
- "Low time (12s)" — Auto-flagged by System (Pairwise)
- "IAA disagreement" — Auto-flagged by System (Safety)
- "Content concern" — Flagged by Sarah K. (Red-team)
- "Guidelines unclear" — Flagged by James L. (Rubric)

#### Flow
Clicking "Review" opens Screen 18 (Annotation Review Detail).

---

### Screen 18 — Annotation Review Detail

**Route:** `/quality/reviews/:id`
**Sidebar active:** Reviews

Detailed view for reviewing a single flagged or auto-flagged annotation.

#### Components

Shows the original annotation in context: the prompt, both responses, the annotator's choice, and their justification. The reviewer can:
- **Approve** — Accept the annotation as valid
- **Reject** — Mark as incorrect (with feedback to the annotator)
- **Reassign** — Send to another annotator for re-evaluation
- **Escalate** — Flag for senior review

---

### Screen 19 — Data Export Builder

**Route:** `/exports/new`
**Sidebar active:** Exports

The interface between annotation data and model training pipelines. Highly configurable export builder.

#### Components

**Page header:** "EXPORT DATA" with "Cancel" and "Export — Create Snapshot" buttons.

**Format selector:** Horizontal button group — DPO (chosen/rejected), Reward Model (+ margin), PPO Prompts, SFT, Rubric Scores, Raw Annotations. Active format is filled teal.

**Output format:** Toggle between JSONL, Parquet (filled teal), CSV.

**Source Data section:**
- Campaign dropdown
- Round checkboxes (Rnd 1, Rnd 2, Rnd 3)
- Weights per round (R1: 0.2, R2: 0.3, R3: 0.5) — for Meta-style data mixing

**Filters section:**
- Min agreement threshold (0.65)
- Exclude "negligibly better" preferences (checkbox)
- Approved annotations only (checkbox)
- Train/test split 95/5 (checkbox)

**Destination section:** Button group — Download (filled teal), S3, GCS, Hugging Face Hub.

**Quality Gates section:** Checkboxes — Min 10,000 annotations, Min IAA 0.65, Max 30% negligible preferences.

**Preview bar (bottom):** Light green banner showing "28,531 annotations match filters", Train/Test split counts, and "All quality gates passing" with green checkmark.

#### Design Rationale
This screen addresses Kai's (Training Engineer) core need: pull data in the exact format their training framework expects. The round weights feature directly supports Meta's published approach of accumulating and mixing data across RLHF rounds. Quality gates prevent bad data from reaching the training pipeline — they act as automated pre-export validation.

---

### Screen 20 — Export History

**Route:** `/exports`
**Sidebar active:** Exports

Versioned history of all dataset exports.

#### Components

**Page header:** "EXPORT HISTORY" with organization name and "+ New Export" button.

**Export table:** Columns — Version (e.g., v2026.04.16.001), Format (color-coded badge: DPO, Reward Model, SFT, Raw), Records, Created, By (user name), Dest (badge: S3, Download, HF Hub, GCS), Status.

Each export is an immutable snapshot with a unique version ID, supporting full reproducibility.

#### Design Rationale
Training engineers need to reproduce any historical dataset exactly. The version-stamped snapshots with destination tracking provide the lineage Kai needs to trace training data back to its source.

---

### Screen 21 — Settings & API Keys

**Route:** `/settings`
**Sidebar active:** API Keys

Organization-level settings with tab navigation.

#### Components

**Tab bar:** General, API Keys (active, blue underline), Billing, Security.

**API Keys section:** Header with "+ Create Key" button.

**API key table:** Columns — Name, Key (truncated, e.g., `df_live_sk...7x4m`), Created, Last Used, Status (Active/Revoked), Actions (Revoke link).

Example keys: Training Pipeline, Export Automation, Webhook Integration, Legacy v1 Access (Revoked, grayed out).

**API Usage section:** Cards showing — Requests (142,531), Avg Latency (230ms), Error Rate (0.02%, green).

---

## 4. Annotator Interface

The Annotator Interface is a completely separate experience designed for Marcus and the annotator workforce. Instead of a sidebar, it uses a full-width layout optimized for focused task completion.

### Header Bar Pattern

All annotator task screens share a consistent dark teal (`#005151`) header bar containing:
- **Left:** "DF DATAFORGE" branding + task name + campaign/round info
- **Center/Right:** Progress counter (e.g., "47 / 200"), timer, Guidelines button, Flag button (outlined with star icon), Skip button

Text colors on the dark header:
- Titles: `#FFFFFF`
- Subtitles: `#FFFFFF99` (60% opacity white)
- Counters: `#FFFFFFB3` (70% opacity white)

---

### Screen 22 — Annotator Home

**Route:** `/annotate`
**Header:** "DATAFORGE ANNOTATOR" badge + "My Profile" button + user avatar + name

The annotator's landing page — their task queue and personal dashboard.

#### Components

**Performance cards (3 across):**
- Today: 47 tasks completed (progress bar toward target of 60)
- This Week: 186 tasks (progress bar toward target of 300)
- Quality: Gold accuracy 82%, Peer IAA 0.76

**Your Task Queue section:** List of assigned task batches, each showing:
- Task name and round (e.g., "Llama Helpfulness Eval — Round 3")
- Type badge (Pairwise, Safety, Arena)
- Tasks remaining and time estimate
- Content warning for safety tasks (triangle icon + "Adversarial testing")
- "Start" button

**Qualification Tests section:** Available tests to unlock new task types (e.g., "Code Evaluation Certification", ~30 min, "Take Test" button).

**Recent Activity section:** Bullet list of recent events (completed tasks, passed certifications, guideline updates).

#### Flow
Clicking "Start" on a task batch opens the corresponding task-type screen (23–30). Clicking "Take Test" opens Screen 32.

---

### Screen 23 — Pairwise Preference

**Route:** `/annotate/task/:id`
**Header:** Task name, round, progress (47/200), timer (1:23), Guidelines, Flag, Skip

The foundational RLHF task type. Annotators compare two model responses side by side.

#### Components

**Prompt section:** Light gray bar displaying the user prompt in full. Label: "PROMPT".

**Response panels (2 side-by-side):**
- Each panel has a header: "A Response A" / "B Response B" with token count (235 tokens / 189 tokens)
- Code responses render in monospace (`IBM Plex Mono`) within code blocks
- Panels are equal-width for unbiased comparison

**Preference bar (bottom center):** Horizontal button group — "A is better" (teal filled when selected), "Slightly", "Tie", "Slightly", "B is better". The scale shows "Sig. better" labels at the extremes for the 4-point Meta-style scale.

**Justification field:** Text input labeled "Justification (required)" with placeholder text.

**Submit button:** "Submit Enter" — teal, with keyboard shortcut hint.

#### Keyboard Shortcuts
- `A`/`1` — Select Response A
- `B`/`2` — Select Response B
- `Enter` — Submit
- `F` — Flag
- `S` — Skip

#### Design Rationale
This is the most-used screen in the platform. The side-by-side layout with full markdown rendering (including code blocks with syntax highlighting) directly addresses the annotator pain point of comparing raw text in tools like Label Studio. Token counts help annotators notice length differences (a known source of bias).

---

### Screen 24 — Multi-Turn Conversational

**Route:** `/annotate/task/:id`
**Header:** "Conversational RLHF" + "Anthropic Helpfulness — Multi-Turn", Turn 3/6, timer (4:12)

Based on Anthropic's real-time conversational RLHF methodology.

#### Components

**Conversation history (top half):** Threaded display of the conversation so far:
- Each turn shows "You" (yellow circle) and "Assistant" (green circle) messages
- Past assistant responses have inline badges: "A chosen at Turn 1", "B chosen at Turn 2"
- Messages display in a clear chronological thread

**Response comparison panels (bottom half):**
- Response A with streaming indicator ("Streaming..." with blue progress bar)
- Response B with completion indicator ("Complete" in green)
- Both panels show the current turn's competing responses

**Preference buttons:** "A is better" / "B is better" centered below the panels.

**Message input (bottom):** "Type your next message..." with "Send Shift+Enter" button.

#### Flow
1. Annotator types a message → platform sends to two model endpoints simultaneously
2. Responses stream in real-time (one may finish before the other)
3. Annotator selects preferred response → chosen response becomes canonical history
4. Repeat for configurable min/max turns

#### Design Rationale
The streaming indicators show annotators that both models are actively generating, and the completion badges make it clear which response won at each previous turn. This is critical for multi-turn context — the annotator needs to know which conversation path they're continuing.

---

### Screen 25 — SFT Data Authoring

**Route:** `/annotate/task/:id`
**Header:** "SFT Data Authoring" + "Llama Safety SFT — Round 2", 8/50, timer (5:30)

Based on Meta's SFT data collection methodology. Annotators write both the prompt and the ideal response.

#### Components

**Three-column layout:**
1. **Write Your Prompt (left):** Large text editor for the user prompt. Category and difficulty badges above (e.g., "Safety — Medical advice", "Medium"). Character count with minimum validation (Min 20 chars, "247 chars" in green with checkmark).

2. **Write the Ideal Response — Raw Input (center):** Text editor for the assistant response. Shows raw markdown input. Character count with minimum validation (Min 100 chars, "584 chars" in green).

3. **Markdown Preview (right):** Live-rendered preview of the response. Label: "MARKDOWN PREVIEW" with green "Live preview" indicator. Shows formatted text with bold headings and bullet lists.

**Reference panel (bottom):** Collapsible section — "Show reference response" toggle to view model-generated responses for inspiration.

**Footer:** Category and Difficulty dropdowns + Submit button.

#### Design Rationale
The three-column layout lets annotators see their raw input and formatted output simultaneously. The live markdown preview catches formatting issues before submission. The reference response panel is optional — annotators can start from scratch or use model output as a starting point.

---

### Screen 26 — Safety Red-Teaming

**Route:** `/annotate/task/:id`
**Header:** "Safety Red-Teaming" + "Llama Safety Track — Round 5", 12/50, timer (2:45)

Extended pairwise comparison with safety-specific inputs and wellbeing safeguards.

#### Components

**Content warning banner:** Yellow bar spanning full width — "Content Warning: This task involves adversarial testing. You may encounter disturbing content." with "Report Disturbing Content" button and break timer countdown ("Break in: 18 min").

**Adversarial prompt section:** Displays the red-teaming prompt (e.g., a request using role-playing fiction to extract dangerous information).

**Response panels:** Same side-by-side layout as pairwise, but responses may include harmful content. Response A might comply with the adversarial request while Response B demonstrates appropriate refusal.

**Red/warning callouts:** Response A has an orange warning banner: "Contains specific technical details about bypassing security".

**Safety-specific inputs (bottom bar):**
- **Which response is safer?** — "A is safer" / "B is safer" buttons
- **Safety Classification:** Radio group — "Preferred is safe, other is not" / "Both safe" / "Both unsafe"
- **Risk Category:** Dropdown (e.g., "Illicit activities")
- **Attack Vector:** Dropdown (e.g., "Role-playing / fiction")

#### Design Rationale
The content warning, break timer, and "Report Disturbing Content" button are safety-first features for annotator wellbeing. Red-teaming and safety evaluation can involve exposure to disturbing content — the platform acknowledges this explicitly rather than treating safety tasks identically to standard preference annotation. The break timer is configurable (e.g., reminder every 20 minutes) and non-blocking.

---

### Screen 27 — Response Editing

**Route:** `/annotate/task/:id`
**Header:** "Response Editing" + "Minimal Correction Mode", 5/30, timer (3:42)

Annotators improve model outputs. Produces preference pairs automatically (edited > original).

#### Components

**Two-panel layout:**
- **Original (left):** Read-only panel with "Read-only" label. Shows the model's original response.
- **Your Edit (right):** Editable panel with green "Editable" indicator. Pre-populated with the original text. Annotator makes corrections inline.

**Diff View (bottom):** Toggleable section with "Inline" and "Side-by-side" view options. Shows changes using strikethrough for deletions and the modified text inline. Displays "Edit distance: 47 chars changed | 2 sentences modified".

**Footer:** "Preview changes before submitting" link + Submit button.

#### Design Rationale
The diff view serves two purposes: it helps annotators verify their edits are correct, and it provides the platform with structured edit data (edit distance, modification count) useful for training. The "Minimal Correction Mode" label in the header tells annotators to fix errors rather than rewrite — this is configurable per task.

---

### Screen 28 — N-Way Ranking

**Route:** `/annotate/task/:id`
**Header:** "Response Ranking" + "Rank 4 responses best to worst", 8/40, timer (3:01)

Rank multiple responses from best to worst using drag-and-drop.

#### Components

**Prompt section:** Full-width prompt display.

**Instructions:** "Drag responses to rank them (1 = best, 4 = worst):"

**Ranking list:** Vertical stack of response cards, each showing:
- Rank number (1–4) on the left
- Up/down drag handles (chevron arrows)
- Response card with label (e.g., "Response C"), preview text (truncated), and token count
- The top-ranked card has a teal left border accent

**Submit button:** "Submit Ranking Enter" at bottom right.

#### Design Rationale
The vertical list with drag handles is more natural than a grid for ranking tasks. The platform automatically decomposes rankings into all (N choose 2) pairwise preferences for training data — a rank of [C, A, D, B] produces 6 preference pairs: C>A, C>D, C>B, A>D, A>B, D>B.

---

### Screen 29 — Rubric Scoring

**Route:** `/annotate/task/:id`
**Header:** "Rubric Evaluation" + "Multi-Dimensional Scoring", 15/80, timer (2:15)

Multi-dimensional evaluation of a single response on configurable axes.

#### Components

**Prompt section:** Full-width prompt display.

**Response section:** Large card showing the model response with token count.

**Scoring Rubric section:** Each dimension is a row containing:
- **Helpfulness** (1–5 slider with teal fill, score badge showing "4")
  - Subtitle: "How well does it answer?"
- **Factual Accuracy** (1–5 slider, score badge showing "5")
  - Subtitle: "Are claims correct?"
- **Safety** (button group: Safe / Borderline / Unsafe, "Safe" selected in teal)
  - Subtitle: "Could this cause harm?"
- **Verbosity** (button group: Too short / Appropriate / Too verbose, "Appropriate" selected in teal)
  - Subtitle: "Response length appropriate?"
- **Tone / Style** (1–5 slider, score badge showing "3")
  - Subtitle: "Natural, clear, appropriate?"

**Submit button:** Bottom right.

#### Design Rationale
The mix of sliders (for ordinal scores) and button groups (for categorical labels) matches the dimension type to the most natural input method. Each dimension includes a helper question so annotators don't need to constantly reference guidelines. The configurable axes make this template reusable across very different evaluation criteria.

---

### Screen 30 — Model Arena

**Route:** `/annotate/task/:id`
**Header:** "Model Arena" + "Blind Evaluation — GPT-4 vs Llama 70B", "Blind — model identities hidden" badge, 12/100, timer (0:48)

Blind head-to-head model comparison with Elo-style rating.

#### Components

**Blind indicator:** Prominent badge in the header bar — "Blind — model identities hidden" (gold/amber background).

**Prompt section:** Full-width prompt display.

**Response panels (side-by-side):** Labeled "Model A" and "Model B" (not actual model names). Token counts shown. Responses render in an elegant serif/italic font for creative content.

**Preference buttons:** "A is better" / "Tie" / "B is better" centered below panels. "B is better" uses a gold/amber accent color to match the blind evaluation theme.

**Footer note:** "Models revealed after submit" — model identities are shown only after the annotator commits their preference, preventing bias.

#### Design Rationale
This implements the LMSYS Chatbot Arena methodology. The gold/amber color scheme visually distinguishes Arena mode from standard pairwise comparison. The blind evaluation with post-submit reveal prevents the annotator from favoring known model names. The platform maintains Elo ratings per model, updated after each comparison.

---

### Screen 31 — Annotator Profile

**Route:** `/annotate/profile`
**Header:** "DATAFORGE ANNOTATOR" badge, "Back to Tasks" button, user avatar + name

The annotator's personal performance dashboard.

#### Components

**Profile header:** Large avatar circle (gold "MT" initials), name "Marcus Thompson", status badge ("Active"), membership info ("Member since January 2026 · 6 qualifications · 4,102 total annotations").

**KPI cards (4 across):**
- Gold Accuracy: 82% (up from 79%)
- Peer IAA: 0.76 (Stable)
- Tasks (30 Days): 847 (up 12% MoM)
- Quality Trend: Improving (green up arrow)

**Skills & Qualifications section:** Checklist showing qualification status:
- General Preference Annotation — Jan 15, 2026 (green check)
- Safety / Red-Teaming — Feb 1, 2026 (green check)
- Creative Writing Evaluation — Mar 10, 2026 (green check)
- Code Evaluation — Not taken (gray X)
- Medical Domain — Recert due Apr 30 (hourglass icon, orange date)

**Task Breakdown (30 Days) table:** Columns — Task Type, Count, Avg Time, IAA. Shows performance by category (e.g., Pairwise Preference: 512 tasks, 42s avg, 0.78 IAA).

**Earnings section:** Pay model (Per-task), Base rate ($0.45/task), April earnings ($423.50), YTD earnings ($4,102.80).

#### Design Rationale
This screen addresses Marcus's need for feedback and transparency. Existing annotation platforms typically provide no quality feedback — annotators don't know if they're good at their job. The qualifications list with recertification dates keeps annotators aware of upcoming requirements.

---

### Screen 32 — Qualification Test

**Route:** `/annotate/qualifications/:id`
**Header:** "Qualification Test" + "Code Evaluation Certification", Stage 2 of 4 — Calibration, 8/12 questions

Multi-stage qualification test that annotators take to unlock task types.

#### Components

**Progress bar:** Segmented bar spanning the header, showing progression through 4 stages.

**Question type label:** "CALIBRATION QUESTION" badge (teal).

**Instructions:** "Compare the two code responses and select the better one. Your answer will be checked against an expert gold standard."

**Prompt card:** Shows the coding prompt.

**Response panels:** Two code blocks side by side (Response A and Response B) showing different algorithm implementations (e.g., merge sort vs. bubble sort approach).

**Answer buttons:** "A is better" (teal filled when selected) / "B is better".

**Footer navigation:** "< Previous" and "Next Question >" buttons with progress text: "Stage 2: 8 of 12 questions completed".

#### Design Rationale
The 4-stage qualification mirrors Meta's published annotator assessment process: comprehension → calibration → trial → full qualification. The calibration stage presents real annotation tasks graded against expert gold standards, ensuring annotators can actually do the work before being assigned real tasks.

---

### Screen 33 — Qualification Test Builder

**Route:** `/qualifications/:id/builder`
**Sidebar active:** Qualifications (Admin Interface)

Admin tool for creating and editing qualification tests.

#### Components

Uses the admin sidebar layout (this is an admin-facing screen). Provides a form builder interface for constructing multi-stage qualification tests with:
- Question type selection (multiple choice, annotation task, free-text, ranking)
- Gold standard answers for auto-grading
- Stage configuration (pass thresholds, time limits, gating)
- Recertification interval settings

---

### Screen 34 — Guidelines Viewer

**Route:** `/annotate/guidelines`
**Header:** Annotator interface header

Read-only display of the annotation guidelines accessible from any task screen.

#### Components

Full-width rendered markdown view of the task-specific guidelines, including:
- General annotation principles
- Task-specific instructions with examples
- Rubric definitions and anchoring examples
- Edge case handling guidance
- Version indicator and last-updated timestamp

Accessible via the "Guidelines" button in every annotator task screen header.

---

## 5. Key User Flows

### Flow A — Creating an RLHF Campaign (Admin: Priya)

```
02 Project List → 03 Project Detail → Click "+ New Campaign"
→ 06 Task Template Picker → Select "Pairwise Preference"
→ 07 Basic Info → 08 Prompts → 09 Models → 10 Annotation
→ 11 QC Pipeline → 12 Guidelines → 13 Review → Activate
```

Priya starts a new RLHF round by navigating to her project, creating a campaign, then configuring a task through the 7-step wizard. Once activated, tasks appear in annotators' queues.

### Flow B — Completing Annotation Tasks (Annotator: Marcus)

```
22 Annotator Home → Click "Start" on a task batch
→ 23–30 (task-type-specific screen, repeats for each task)
→ 22 Annotator Home (return after batch)
```

Marcus logs in, sees his task queue, starts a batch, and works through tasks one at a time. Progress counter and timer are always visible. He can flag problematic tasks or access guidelines at any point.

### Flow C — Quality Monitoring (Admin: Priya)

```
01 Dashboard (Quality Alerts) → 16 Quality Dashboard
→ 17 Review Queue → 18 Annotation Review Detail
→ Approve/Reject/Reassign
```

Priya notices a quality alert on the dashboard, drills into the quality dashboard for the full picture, then reviews flagged annotations and takes action.

### Flow D — Exporting Training Data (Training Engineer: Kai)

```
19 Data Export Builder → Configure format, filters, gates
→ 20 Export History (verify snapshot created)
→ 21 Settings & API Keys (get API key for programmatic access)
```

Kai configures an export with DPO format, selects rounds with weights, sets quality gates, and exports to S3. He can also set up automated exports via the API.

### Flow E — Annotator Qualification (Admin → Annotator)

```
Admin: 33 Qualification Test Builder → Create test
Annotator: 22 Home → "Take Test" → 32 Qualification Test
→ Pass → New tasks appear in 22 Home queue
```

Priya builds a qualification test for code evaluation tasks. Marcus takes the test through 4 stages. Upon passing, code-related tasks appear in his queue.

### Flow F — Model Version Update Across Rounds

```
14 Model Endpoint Registry → Register new version
→ 04 Campaign Round Detail → "Update Models"
→ New round with updated model checkpoints
```

When a new model checkpoint is trained, Priya registers the endpoint and creates a new round pointing to the updated model. Cross-round comparison shows the impact.

---

## 6. Design Decisions & Rationale

### Two Distinct Interface Paradigms

The Admin and Annotator interfaces are intentionally different:
- **Admin:** Complex, navigation-rich, data-dense. Admins need to jump between screens, compare metrics, and configure detailed settings. A persistent sidebar provides constant orientation.
- **Annotator:** Focused, linear, distraction-free. Annotators work through tasks one at a time. The full-width layout maximizes the response reading area. No sidebar — the header contains everything needed.

### Consistent Data Card Pattern

Throughout the Admin Interface, summary KPI cards appear at the top of every screen (Dashboard, Projects, Tasks, Annotators, Review Queue, Export History, Settings). This creates a predictable pattern: enter any screen and immediately see the high-level numbers before diving into details.

### 7-Step Wizard vs. Single Form

The task configuration wizard (Screens 07–13) could have been a single long form. The wizard approach was chosen because:
1. Each step maps to a distinct concept (prompts, models, annotation, quality, guidelines)
2. It reduces cognitive load — admins focus on one concern at a time
3. The step sidebar provides a persistent mental model of the configuration
4. Preview and save draft are available at every step

### Research-Validated Templates

The 8 task templates aren't arbitrary — each maps to a documented RLHF methodology from Anthropic (multi-turn, response editing, red-teaming), Meta/Llama 2 (pairwise preference, SFT authoring, safety annotation), or established industry practice (rubric scoring, model arena/Elo). The template cards include methodology citations so admins know the research basis.

### Quality as a First-Class Concern

Quality monitoring surfaces in 4 separate screens (Dashboard alerts, Quality Dashboard, Review Queue, Review Detail) and is configurable per-task (QC Pipeline step in the wizard). This reflects the reality that RLHF data quality directly impacts model alignment — bad preference data produces misaligned models.

### Annotator Wellbeing

The Safety Red-Teaming screen (26) includes content warnings, break timers, and a disturbing content reporting button. These aren't just UX niceties — they're ethical requirements when asking humans to interact with harmful content for hours per day.

---

*This walkthrough covers 34 screens across 2 interfaces, representing the complete end-to-end RLHF data lifecycle from task configuration through annotation to training data export.*
