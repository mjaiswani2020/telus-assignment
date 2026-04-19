# DataForge: RLHF Data Collection Platform

---

## Table of Contents

1. [Opening: The Problem Space (5 min)](#1-opening-the-problem-space)
2. [Act I: The Admin Command Center (15 min)](#2-act-i-the-admin-command-center)
3. [Act II: The Annotator Experience (15 min)](#3-act-ii-the-annotator-experience)
4. [Act III: Quality Intelligence Layer (10 min)](#4-act-iii-quality-intelligence-layer)
5. [Act IV: Data Pipeline & Export (5 min)](#5-act-iv-data-pipeline--export)
6. [Closing: Vision & Roadmap (5 min)](#6-closing-vision--roadmap)
7. [Appendix: Quick Reference for Q&A](#7-appendix-quick-reference-for-qa)

---

## 1. Opening: The Problem Space

### Talking Points

Start by framing the problem using the two research papers:

> "We studied how the two most influential RLHF pipelines actually work in practice -- Anthropic's 'Training a Helpful and Harmless Assistant' (Bai et al., 2022) and Meta's 'Llama 2' (Touvron et al., 2023). These aren't theoretical papers -- they describe the operational reality of collecting millions of human preference comparisons to align LLMs."

#### The RLHF Pipeline in 60 Seconds

Explain the end-to-end flow that both papers describe:

1. **Pretrain** a large language model on internet text
2. **Supervised Fine-Tuning (SFT)** -- human annotators write ideal prompt-response pairs to teach the model the right format and style. Meta found that just 27,540 high-quality SFT examples were sufficient, beating millions of lower-quality third-party examples.
3. **Preference Data Collection** -- the core of RLHF. Annotators see two model responses side-by-side and choose which is better. Anthropic collected ~120K comparisons across helpfulness and harmlessness tracks. Meta collected over 1.4 million binary comparisons across 14 batch stages.
4. **Reward Model Training** -- a model learns to predict human preferences. Meta trained two separate reward models (helpfulness and safety) because a single model struggles to optimize for both simultaneously.
5. **RLHF Policy Optimization** -- the LLM is fine-tuned using the reward model scores as the training signal, via PPO (Proximal Policy Optimization).
6. **Iterate** -- deploy the improved model, collect fresh data against it, retrain. Both teams ran weekly batch cycles.

#### The 19 Pain Points We Identified

> "When you read these papers carefully, you find 19 specific pain points across 6 phases of the pipeline. These aren't hypothetical -- they're problems Anthropic and Meta explicitly documented. Our platform, DataForge, is designed to solve them."

Highlight the top 3 pain points to set the stage:

- **Pain Point 4.3 -- Signal Degradation**: As models improve, the two responses shown to annotators become more similar, making it harder to distinguish quality. Meta showed reward model accuracy drops from ~94% on clearly different pairs to ~55% on similar pairs. This is the degradation paradox: success makes the next round of data collection harder.
- **Pain Point 4.6 -- No Real-Time Quality Signal**: Anthropic's annotators had no feedback on whether they were doing a good job. They had a Slack channel for discussing edge cases, but no systematic calibration loop. Their inter-annotator agreement was only 63%.
- **Pain Point 2.1 -- Guidelines Drift as Living Documents**: Meta defined detailed risk categories and attack vectors, but guidelines evolve as models improve and new failure modes emerge. Anthropic was amending guidelines via Slack messages -- unversioned, unsystematic, not validated against prior annotations.

> "DataForge operationalizes the entire RLHF data collection lifecycle -- from strategy definition to training-ready data export -- with intelligence at every stage. Let me show you."

---

## 2. Act I: The Admin Command Center

### 2.1 Login Screen

**Screen:** `/login` ([http://localhost:3000/login](http://localhost:3000/login))

**What to show:**

- The dual-mode login toggle (Admin / Annotator)
- The animated feature cards on the right side
- Log in as **Admin** to enter the admin dashboard

**Talking point:**

> "DataForge serves two distinct user archetypes with completely different interfaces. Admins -- the ML researchers and project managers -- get a command center. Annotators get a focused, distraction-free workspace. Let's start with the admin view."

---

### 2.2 Admin Dashboard

**Screen:** `/dashboard` ([http://localhost:3000/dashboard](http://localhost:3000/dashboard))

**What to show:**

- **4 KPI stat cards** at the top: Total Annotations, Active Annotators, Average IAA (Inter-Annotator Agreement), Gold Accuracy
- **Campaign progress cards** with progress bars showing completion
- **Alert boxes** flagging quality issues, IAA drops, and flagged annotations
- **Feedback Loop Health cards** (3 cards -- explained in detail below)

**Research context -- IAA metric:**

> "Inter-Annotator Agreement is the critical quality metric for preference data. Anthropic measured only 63% agreement on their helpfulness data, which is strikingly low compared to other NLP tasks. This isn't because their annotators were bad -- it's because 'which response is more helpful' is genuinely subjective. Meta addressed this by introducing a 4-point preference strength scale (significantly better, better, slightly better, negligibly better). Our dashboard tracks IAA in real-time so you can intervene before data quality degrades."

**Research context -- Gold Accuracy:** 

> "Gold tasks are pre-labeled comparisons with known correct answers. They're injected into the annotation stream to continuously measure whether annotators are calibrated. Neither paper describes a systematic gold-task pipeline -- Anthropic relied on spot-checks, Meta used formal QA reviewers. Our system automates this."

**Feedback Loop Health -- Card-by-Card Breakdown:**

These three cards represent the automated feedback loops that run continuously, creating a self-correcting system. Each has a colored status dot (green = healthy, amber = needs attention, red = broken).

**Card 1: Annotator Quality Loop** (green dot = healthy)

This is the seconds-to-minutes feedback loop between the Quality Control Center and annotators.

- "Active -- 24 annotators receiving real-time feedback" means all active annotators are connected to the quality feedback side panel showing their gold accuracy, peer comparison, and performance ring.
- "3 calibration nudges triggered today" means the system detected 3 annotators whose accuracy or IAA drifted below threshold and automatically pushed a calibration nudge (a banner in their annotation interface prompting a calibration task).
- "Avg response to nudge: 12 min" means annotators get back on track in about 12 minutes.

> **Research link:** Anthropic had zero real-time feedback -- annotators only learned they were off-track via a Slack channel after the fact. Their 63% inter-annotator agreement was partly because nobody caught drift in real time.

**Card 2: Routing & Calibration Loop** (amber dot = needs attention)

This is the daily feedback loop between Quality Control, the Workforce Hub, and task assignment.

- "2 routing adjustments this week" means the system made 2 changes to which annotators get which task types, based on performance data.
- "4 annotators reassigned: safety -> helpfulness" means 4 annotators struggling on safety/red-team tasks were moved to helpfulness tasks where their accuracy is stronger.
- "Avg calibration score: 87%" is the cohort-wide calibration metric after adjustments.

> **Why amber:** The system had to make active interventions, meaning something was drifting. Not broken (red), but not running hands-off either (green).
>
> **Research link:** Neither paper had intelligent routing. Anthropic randomly assigned tasks. Meta had annotators self-select. When an annotator is struggling with safety but great at helpfulness, manually detecting and fixing that takes days. This loop does it automatically.

**Card 3: Guideline Evolution Loop** (green dot = healthy)

This is the weekly feedback loop between Quality Control, the Task Studio (guidelines), and the annotation interface.

- "Guidelines v2.3 deployed 3 days ago" means the latest rubric version went live 3 days ago.
- "Triggered by: 23% disagreement on borderline safety" explains why v2.3 was created -- the system detected annotators disagreeing 23% of the time on borderline safety cases, which is a rubric ambiguity signal.
- "Impact: disagreement dropped to 14%" shows the guideline update worked -- disagreement on that category dropped from 23% to 14%.

> **Research link:** Anthropic was amending guidelines via Slack messages -- unversioned, not validated against impact. This loop measures the actual effect of guideline changes on agreement. If a rubric update doesn't improve agreement, you know the problem is deeper than wording.

---

### 2.3 Projects & Campaigns

**Screen:** `/projects` then click into a project ([http://localhost:3000/projects](http://localhost:3000/projects))

**What to show:**

- Project grid cards with campaign counts and active rounds
- Click into a project to see its campaigns and tasks

**Screen:** `/campaigns` then click into a round ([http://localhost:3000/campaigns](http://localhost:3000/campaigns))

**What to show:**

- Campaign list with status badges (Active, Draft, Complete)
- Click into a campaign's round to show the **cross-round comparison table** with metrics across Round 1/2/3

**Research context -- Iterative Training:**

> "Both Anthropic and Meta ran iterative training cycles. Meta went through 14 batch stages, evolving their data mix ratios. They found that including top-performing samples from all prior iterations prevented capability regression. Anthropic updated models on a roughly weekly cadence. Our Project/Campaign/Round hierarchy mirrors this iterative structure -- each round is a discrete data collection cycle with its own model versions, annotator cohort, and quality metrics."

**Talking point on cross-round comparison:**

> "This cross-round comparison view is critical. Meta discovered that RLHF V3 actually regressed in some capabilities -- it struggled with rhyming in poems compared to V2. Without a systematic cross-round comparison, you wouldn't catch this until much later. Our platform surfaces these regressions immediately."

---

### 2.4 Task Creation Wizard

**Screen:** `/tasks/new` ([http://localhost:3000/tasks/new](http://localhost:3000/tasks/new))

**What to show:**

- **8 task template cards** in a gallery view:
  - Pairwise Comparison
  - Multi-Turn Chat
  - SFT Demonstration
  - Safety / Red-Team
  - Editing / Correction
  - N-Way Ranking
  - Rubric Scoring
  - Arena (Blind)

**Click into "Pairwise Comparison"** to enter the 7-step wizard:

**Screen:** `/tasks/new/configure` ([http://localhost:3000/tasks/new/configure](http://localhost:3000/tasks/new/configure))

**Walk through the wizard steps** (click sidebar items to show each):

1. **Basic Info** -- name, description, task type
2. **Prompts** -- prompt sourcing configuration
3. **Models** -- which model endpoints to deploy
4. **Annotation** -- the annotation interface configuration
5. **Quality** -- gold accuracy thresholds, IAA targets, quality-check rules
6. **Guidelines** -- the rubric and edge case definitions
7. **Review** -- summary with annotator preview

**Research context -- Task Types Map to Paper Methodologies:**

> "Each of these 8 task types directly corresponds to a data collection methodology described in the papers:
>
> - **Pairwise Comparison** -- This is the core RLHF task. Both Anthropic and Meta used this: show two model responses, pick the better one. Anthropic's entire helpfulness dataset uses this format. Meta collected 1.4M+ of these comparisons.
> - **Multi-Turn Chat** -- Anthropic's annotators had open-ended multi-turn conversations with models, choosing the better response at each turn. This creates richer data but compounds complexity -- a bad choice at turn 2 affects the entire trajectory.
> - **SFT Demonstration** -- Meta found that 27,540 high-quality SFT annotations outperformed millions of third-party examples. The annotator writes both the prompt and the ideal response.
> - **Safety / Red-Team** -- Both papers had dedicated red-teaming tracks. Annotators try to provoke harmful responses, then classify safety categories and attack vectors. Meta defined specific risk categories (illicit activities, hateful content, unqualified advice) and attack vectors (psychological manipulation, logic manipulation, role-playing).
> - **Rubric Scoring** -- Meta used a 4-point preference strength scale. Our rubric scoring supports multi-dimensional evaluation with custom rubric dimensions."

**Key talking point on the wizard:**

> "The wizard is designed to solve Pain Point 1.1 -- the research-to-task translation gap. Anthropic discovered after collecting significant data that their red-teaming task design was structurally flawed -- having annotators choose 'the more harmful response' made it impossible for models to learn good responses to harmful queries. They called this the 'hostage negotiator problem.' Our wizard forces you to think through the annotation flow, quality gates, and guideline structure before any data is collected."

---

### 2.5 Annotator Management

**Screen:** `/annotators` ([http://localhost:3000/annotators](http://localhost:3000/annotators))

**What to show:**

- **Stat cards**: Total Annotators, Active Now, Avg Gold Accuracy, At-Risk (Fatigue)
- **Annotator table** with columns: Name, Status, Gold Accuracy, Peer IAA, Tasks/Day, 30D Volume, Routing
- **Fatigue/drift badges** on individual annotators (amber "FATIGUE" / red "DRIFT" badges)
- **Session Health section** with a bar chart showing session hours vs. fatigue risk
- **Routing Rules section** at the bottom with 3 rule cards and auto-route toggle

**Click the "Configure" button on a routing rule** to show:

**Component:** Routing Config Modal

**What to show:**

- Task type checkboxes
- Skill tag filters
- Accuracy/IAA threshold sliders
- Tier dropdown (Junior/Standard/Expert)
- "Test Rule" button

**Research context -- Annotator Quality:**

> "Anthropic used approximately 30 vetted crowdworkers across MTurk and Upwork. They spot-checked writing quality rather than measuring systematic agreement. Their quality control was notably lightweight.
>
> Meta took the opposite approach: a rigorous 4-stage selection process -- grammar tests, sensitive-topic alignment, answer ranking, and prompt-response writing. They had formal QA with content managers reviewing annotations.
>
> Our platform supports both operating models but adds something neither had: continuous performance monitoring. The fatigue detection flags when an annotator has been working too long and their quality is drifting. The routing rules intelligently assign tasks based on demonstrated skills and accuracy -- a Senior safety annotator with high gold accuracy gets routed to the hardest safety tasks, while a newer annotator gets easier helpfulness comparisons."

**Screen:** `/annotators/onboarding` ([http://localhost:3000/annotators/onboarding](http://localhost:3000/annotators/onboarding))

**What to show:**

- **Kanban board** with 5 vetting stages: Applied, Grammar Test, Topic Alignment, Interview Ready, Rejected
- Candidate cards with name, status badge, and details
- Conversion rates between stages
- Funnel visualization

**Talking point:**

> "This systematizes Meta's 4-stage vetting process. Instead of running it as a one-time gate, it's a continuous pipeline. And because it's integrated with the qualification system, re-certification happens automatically."

**Screen:** `/annotators/marketplace` ([http://localhost:3000/annotators/marketplace](http://localhost:3000/annotators/marketplace))

**What to show:**

- Expert browse interface with filter options
- 6 expert cards showing domain badges (safety, SFT, pairwise), languages, hourly rate, rating, project count, availability

**Talking point:**

> "As RLHF expands to specialized domains -- medical, legal, financial -- you need expert annotators. This marketplace lets you discover and onboard domain specialists. Anthropic noted that they hired crowdworkers on Upwork specifically because Upwork allows hourly compensation, which incentivizes higher-quality interactions. Our marketplace builds that into the platform."

---

### 2.6 Iteration Lifecycle

**Screen:** `/iterations` ([http://localhost:3000/iterations](http://localhost:3000/iterations))

**What to show:**

- **Horizontal timeline** with 5 iteration nodes (some completed, one active, some planned)
- Click an iteration node to show its **6-dimension detail card**:
  - Strategy (what data to collect)
  - Model (which models were deployed)
  - Cohort (which annotators participated)
  - Collection (volumes and quality metrics)
  - Training (RM accuracy, RLHF results)
  - Evaluation (Elo scores, human eval results)
- **Comparison table** across iterations
- **"What Worked" notes** from each iteration

**Research context -- The Iteration as a First-Class Entity:**

> "This is one of our key architectural decisions. Both papers describe iterations as the heartbeat of the RLHF pipeline:
>
> - Anthropic ran iterated online training, updating models on a roughly weekly cadence and collecting fresh data against improved models. They observed that this significantly improved model quality.
> - Meta went through RLHF-V1 through RLHF-V5, each time training better reward models and using rejection sampling plus PPO. They found that incorporating top-performing samples from all prior iterations prevented capability regression.
>
> In our platform, an iteration is a first-class data object -- not a calendar concept. It has a strategy, task configs, model versions, annotator cohort, data batch, and training results. Everything is indexed by iteration. This solves Pain Point 1.3 -- cross-iteration memory loss."

---

### 2.7 Model Configuration

**Screen:** `/models` ([http://localhost:3000/models](http://localhost:3000/models))

**What to show:**

- **Model endpoints table** at the top -- this is the primary view. Show the status badges (UP/SLOW), latency, and active task counts.
- **Scroll down** to briefly show the deployment configuration, A/B testing, and latency sections.

**Demo framing note:** The current prototype lays out model config sections as a flat page. In the production version, clicking a model row would open its detail panel with deployment config, A/B test participation, swap history, and latency -- all scoped to that specific model. For the demo, focus on the **table** and **A/B testing concept**, and keep the scroll brief.

**Research context -- Model Serving Complexity:**

> "Both papers deployed multiple model variants simultaneously. Anthropic served 52-billion parameter models -- enormous GPU cost. They deployed RLHF models, rejection sampling models, and context-distilled models simultaneously to enable model comparison and increase data diversity.
>
> Meta sampled responses from two different model variants at varying temperatures to maximize response diversity. They also found that the optimal temperature changes with each RLHF iteration -- what works for V3 doesn't work for V4.
>
> Our Model Gateway handles this complexity: hot-swapping models without disrupting active annotation sessions, A/B testing different model variants, and monitoring latency so annotators aren't waiting 10+ seconds per response -- which Anthropic noted killed throughput and required compensating with higher pay."

---

## 3. Act II: The Annotator Experience

> "Now let's switch personas. Let me log out and log back in as an annotator."

### 3.1 Annotator Home

**Screen:** `/annotate` ([http://localhost:3000/annotate](http://localhost:3000/annotate)) -- log in as annotator first via `/login`

**What to show:**

- **Performance cards**: Today's tasks, This Week's tasks, Quality Score with progress bars
- **Overdue Calibration banner** (amber) if calibration is due
- **Calibration task cards** -- triggered calibration (amber border) and scheduled calibration
- **Task queue section** with available tasks

**Research context -- Annotator Self-Awareness:**

> "Neither Anthropic nor Meta gave annotators real-time feedback on their performance. Anthropic communicated via a Slack channel, which is ad-hoc and retrospective. Our annotator home gives every annotator a clear view of their performance, their calibration status, and their task queue. This directly addresses Pain Point 4.6 -- no real-time quality signal."

---

### 3.2 Pairwise Comparison Task (THE Core RLHF Screen)

**Screen:** `/annotate/1/pairwise` ([http://localhost:3000/annotate/1/pairwise](http://localhost:3000/annotate/1/pairwise))

**This is the most important demo screen -- spend time here.**

**What to show:**

- **Task header** with progress indicator and timing
- **The Prompt** displayed at the top
- **Response A and Response B** side-by-side in response panels
- **Latency indicators** (amber if response took >8s)
- **Guideline Update banner** (blue) if guidelines were recently updated
- **Justification textarea** for explaining the choice
- **Submit / Skip / Flag buttons**

**Now open the side panels:**

- **Click the guidelines icon** to open the **Guidelines Drawer** on the left:
  - Show **4 tabs**: Guidelines, Changelog, Edge Cases, Effectiveness
  - Show the **version selector** at the top (v2.0, v2.1, v2.2, v2.3)
  - Click **Changelog** to show versioned guideline history with diffs
  - Click **Edge Cases** to show adjudicated ambiguous examples
  - Click **Effectiveness** tab to show IAA impact and disagreement data
- **Look for the Quality Feedback Panel** on the right side:
  - **Difficulty indicator** (Easy/Medium/Hard) for the current comparison
  - **Session performance ring** (SVG donut chart) showing gold accuracy
  - **Cohort comparison bars** showing how this annotator compares to peers
  - **Calibration nudge banner** if performance is drifting
  - **Session stats**: annotations done, time spent, streak

**Research context -- This Screen Addresses 6 Pain Points:**

> "This single screen addresses more pain points than any other:
>
> **Pain Point 4.1 -- Cognitive Load**: Anthropic found annotators got confused simultaneously trying to provoke harmful behavior AND choosing the more harmful response. Our interface separates concerns -- the prompt is clear, the responses are side-by-side, and the guidelines are one click away.
>
> **Pain Point 4.3 -- Signal Degradation**: The difficulty indicator tells the annotator how similar the two responses are. When responses are nearly identical (the degradation paradox), the annotator knows to be extra careful. Meta showed accuracy drops from 94% on clearly different pairs to 55% on similar ones -- our difficulty indicator helps annotators maintain focus on the hard cases.
>
> **Pain Point 4.6 -- No Real-Time Feedback**: The Quality Feedback Panel on the right gives continuous performance data -- gold accuracy, peer comparison, calibration nudges. Anthropic's annotators had zero feedback during annotation.
>
> **Pain Point 2.1 -- Guidelines Drift**: The versioned guidelines drawer with changelog means annotators always see the latest rubric. No more Slack-channel amendments.
>
> **Pain Point 4.4 -- Latency**: The latency indicator flags when model response times are slow, so the operations team can investigate before throughput tanks.
>
> **Pain Point 2.2 -- Rubric Ambiguity**: The Edge Cases tab shows previously adjudicated borderline cases, giving annotators concrete examples for the toughest decisions."

---

### 3.3 Multi-Turn Chat Annotation

**Screen:** `/chat` ([http://localhost:3000/chat](http://localhost:3000/chat))

**What to show:**

- **Conversation history** showing multi-turn dialogue (messages flowing down)
- **Conversation branching** -- Path A / Path B tabs showing alternative conversation trajectories
- **Response panel** showing model alternatives at the current branch point
- **Edge case flag enhancement** for marking unusual conversations
- **Latency indicators** on response times

**Research context -- Multi-Turn Complexity:**

> "Both papers collected multi-turn conversation data. Anthropic's annotators had open-ended conversations with models, choosing the better response at each turn. But multi-turn conversations compound errors -- a bad choice at turn 2 affects the entire trajectory.
>
> Our conversation branching feature addresses Pain Point 4.5. Instead of starting over when a conversation goes wrong, annotators can explore alternative paths from any branch point. This is something neither paper describes having."

---

### 3.4 Safety / Red-Team Annotation

**Screen:** `/red-team` ([http://localhost:3000/red-team](http://localhost:3000/red-team))

**What to show:**

- **Task header** for safety task
- **Prompt + Response A/B** panels
- **Safety choice buttons**: A Safer / B Safer / Equal
- **Classification dropdown**: Safe / Borderline / Unsafe
- **Risk Category dropdown** (matches Meta's taxonomy: illicit activities, hateful content, unqualified advice, etc.)
- **Attack Vector dropdown** (psychological manipulation, logic manipulation, syntactic tricks, role-playing)
- **Skip / Flag buttons** for problematic content

**Research context -- Red-Teaming Data:**

> "Red-teaming is where both papers encountered the most structural problems:
>
> Anthropic discovered what they called the 'hostage negotiator problem.' They had annotators choose 'the more harmful response' during red-teaming, but this meant their data only taught models what NOT to do -- never what a good response to a harmful query looks like. The data was partially unusable for their actual training objective.
>
> Meta addressed this more carefully with structured safety categories. They collected safety labels into three bins: 1) the preferred response is safe and the other is not (18%), 2) both responses are safe (47%), and 3) both responses are unsafe (35%). They trained a separate Safety Reward Model because a single model couldn't optimize for both helpfulness and safety.
>
> Our red-team interface gives annotators the structured classification Meta used -- risk categories and attack vectors -- while keeping the cognitive flow simple. The annotator isn't asked to simultaneously provoke harmful behavior AND classify it. The interface separates these concerns."

---

### 3.5 Other Task Types (Quick Tour)

Walk through these quickly to show breadth:

**Screen:** `/sft` ([http://localhost:3000/sft](http://localhost:3000/sft))

- SFT annotation: annotator writes both prompt and ideal response
- Category and difficulty selectors
- Reference response (collapsible) for calibration
  > "Meta found 27,540 high-quality SFT annotations outperformed millions of lower-quality examples. Quality over quantity -- our SFT interface enforces structure to maintain that quality bar."

**Screen:** `/rank` ([http://localhost:3000/rank](http://localhost:3000/rank))

- N-way ranking with drag-reorderable response list
- Each response shows token count
  > "N-way ranking provides richer signal than pairwise comparisons. Instead of 'A is better than B,' you get a full ordering -- useful for training more nuanced reward models."

**Screen:** `/rubric` ([http://localhost:3000/rubric](http://localhost:3000/rubric))

- Multi-dimensional scoring: Helpfulness (1-5), Accuracy (1-5), Safety, Verbosity, Tone
- Justification textarea
  > "Meta used a 4-point preference strength scale. Our rubric scoring generalizes this to any number of dimensions with custom scales -- letting researchers capture exactly the signal they need."

**Screen:** `/arena` ([http://localhost:3000/arena](http://localhost:3000/arena))

- Blind comparison: A better / Tie / B better
- No model identity revealed
  > "The arena format mirrors how Elo scores are computed. Both Anthropic and Meta used Elo evaluations as their gold standard for comparing models."

**Screen:** `/edit` ([http://localhost:3000/edit](http://localhost:3000/edit))

- Original text + editable text
- Inline / Side-by-side diff view
- Edit quality metrics
  > "Editing tasks are used for post-hoc improvement of model responses. The annotator corrects the model's output, generating SFT-style training pairs."

---

### 3.6 Annotator Profile & Qualifications

**Screen:** `/annotate/profile` ([http://localhost:3000/annotate/profile](http://localhost:3000/annotate/profile))

**What to show:**

- Profile header with avatar, tier, languages
- **Stat cards**: Gold Accuracy, Peer IAA, Tasks (30 Days), Quality Trend
- **Qualifications table**: passed, pending, failed tests
- **Task breakdown by type** showing what kinds of annotations this person does

**Screen:** `/annotate/qualification/1` ([http://localhost:3000/annotate/qualification/1](http://localhost:3000/annotate/qualification/1))

**What to show:**

- **4-stage qualification process**: Instructions, Calibration, Solo, Results
- Sample task with response panels
- Feedback after choices
- Comparison with peer annotations

**Research context -- Annotator Vetting:**

> "Meta's 4-stage vetting process (grammar tests, sensitive-topic alignment, answer ranking, prompt-response writing) was rigorous but was a one-time gate. Our qualification system is continuous -- annotators can be re-tested, and their performance is tracked over time. If accuracy drops, they're routed to recalibration tasks automatically."

---

## 4. Act III: Quality Intelligence Layer

> "Now let me switch back to the admin view and show you the intelligence layer -- this is what makes DataForge a platform rather than just a form builder."

### 4.1 Quality Review Center

**Screen:** `/reviews` ([http://localhost:3000/reviews](http://localhost:3000/reviews))

**What to show:**

- **Stat cards**: Pending Reviews, Quality Score, Review Speed, Flagged Items
- **Tabs**: All / Flagged / Quality Checks Passed / Escalated
- **Pipeline overview** showing the 3-tier review flow:
  - Tier 1: Auto-Screening (automated checks)
  - Tier 2: Sampling Review (statistical sample reviewed by human)
  - Tier 3: Expert Adjudication (borderline cases escalated to senior reviewers)
- **Quality Checks summary card** with pass/fail counts
- **Enhanced table** with tier, auto-check results (green/red dots), confidence scores
- **Reviewer calibration table** showing reviewer performance
- **Rejection cost dashboard** showing the cost of rejected annotations

**Click into a specific review** to show the detail view:

**Screen:** `/reviews/[id]` ([http://localhost:3000/reviews/1](http://localhost:3000/reviews/1))

**What to show:**

- **Prompt display** and **Response A/B comparison** panels
- **Annotator's choice and justification**
- **Automated Analysis section**:
  - Auto-check results: Gold accuracy check, Time-spent check, IAA consistency check, Pattern check
  - Each shows pass/fail with reasoning
- **Peer annotations comparison** -- what other annotators chose for the same comparison
- **Provenance Panel** -- a vertical timeline showing the 5-step lifecycle:
  1. Prompt sourced (when, from where)
  2. Model responses generated (which model, which temperature)
  3. Annotated by (who, when, how long)
  4. QA reviewed by (who, verdict)
  5. Exported to (which dataset, when)
- **Auto-classification card** for safety items showing predicted risk category

**Research context -- Tiered QA Pipeline:**

> "Meta had content managers manually reviewing annotations. This creates a bottleneck -- Pain Point 5.1. If annotation throughput is 1,000 comparisons/day but QA can only process 500/day, the pipeline stalls.
>
> Our 3-tier system inverts this:
>
> - Tier 1 runs rule-based quality checks on every annotation with rule-based checks (was it too fast? Does it match gold? Is the pattern consistent with their history?). This catches ~60% of issues automatically.
> - Tier 2 statistically samples from passing annotations for human review -- you don't need to review everything.
> - Tier 3 escalates only genuinely ambiguous cases to expert adjudicators.
>
> The provenance panel is the audit trail that both papers lacked. Every data point is traceable back to: which annotator, which model version, which guideline version, which prompt source, which QA reviewer approved it."

---

### 4.2 Analytics & Cross-Iteration Intelligence

**Screen:** `/analytics` ([http://localhost:3000/analytics](http://localhost:3000/analytics))

**What to show:**

**Section 1: IAA Trend Charts**

- Line chart showing IAA trends over time for helpfulness, safety, and overall
- Point out any drops or spikes

**Section 2: Signal Degradation Patterns**

- Stacked area chart showing preference margin distribution over iterations
- Show how the "significantly better" category shrinks while "negligibly better" grows

**Section 3: Annotator Performance Table**

- Ranked list of annotators with their metrics

**Section 4: Rubric Ambiguity Analysis**

- Show which rubric dimensions have the highest disagreement rates
- Suggestions for guideline improvements

**Section 5: Training Results**

- RM (Reward Model) accuracy gauges
- Trend chart showing RM accuracy over batches

**Section 6: Elo Rankings**

- Model comparison Elo scores

**Section 7: Cost Metrics**

- Cost per annotation, quality-adjusted cost
- Hourly rates and efficiency metrics

**Research context -- Signal Degradation (THE Critical Insight):**

> "This is the most important analytics view. Both papers document what I call the 'degradation paradox':
>
> As the RLHF pipeline succeeds and models get better, the two response options become more similar, making it harder for annotators to distinguish between them. Meta's data shows this precisely -- reward model accuracy is 94.3% when the preferred response is 'significantly better,' but drops to only 55.3% when the difference is 'negligibly better.'
>
> This stacked area chart visualizes this degradation in real-time. As you move from Iteration 1 to Iteration 5, the blue area ('significantly better' comparisons) shrinks while the red area ('negligibly better') grows. This is the leading indicator that your data quality is about to drop.
>
> Neither paper had a real-time way to detect this. They discovered it retrospectively during training evaluation. We surface it during collection."

**Research context -- RM Accuracy:**

> "Meta explicitly stated that reward model accuracy is the most important proxy for final model quality. But traditionally it's evaluated after training, not during data collection. Our analytics dashboard connects these -- you can see whether the data you're collecting right now will meaningfully improve the reward model."

---

### 4.3 Prompt Coverage Engine

**Screen:** `/prompts` ([http://localhost:3000/prompts](http://localhost:3000/prompts))

**What to show:**

- **KPI cards**: Total Prompts, Human-Written %, Synthetic %, Coverage Score
- **Topic distribution grid** with 10 categories showing coverage percentages
- **Coverage gap alerts** highlighting under-represented categories
- **Source breakdown** (Human / Synthetic / Seeded / Curated)
- **Diversity trend chart** over time

**Research context -- Prompt Diversity:**

> "Anthropic explicitly noted that they 'discouraged repetition' among crowdworkers, but as workers do more tasks, they drift toward familiar patterns. Meta tried to maximize diversity by sampling from different model variants.
>
> But neither team had a systematic way to measure or enforce prompt distribution coverage. Are we getting enough math prompts? Enough multi-turn conversations? Enough adversarial prompts in non-English languages? Nobody knew until after the fact.
>
> Our Prompt Engine solves Pain Point 3.2. The coverage score tells you at a glance whether your prompt distribution is balanced. The gap alerts proactively flag under-represented categories so you can source more prompts in those areas before the batch closes."

---

### 4.4 Task Experiments

**Screen:** `/tasks/experiments` ([http://localhost:3000/tasks/experiments](http://localhost:3000/tasks/experiments))

**What to show:**

- **Active experiments table**: experiment name, variants A/B, annotations collected, collection-time metrics (IAA, confusion rate), statistical significance
- **Completed experiments table**: winner, result summary, completion date

**Important nuance to explain during the demo:**

The experiments screen currently shows **collection-time metrics** (IAA, confusion rate, review rejection rate) -- these are leading indicators that tell you about the annotation process. But the real question an experiment should answer is: **which task design produces data that trains a better reward model?**

> "There are two tiers of experiment metrics:
>
> **Tier 1 -- Collection-time (what you see here):** IAA, annotator confusion, annotation speed, gold accuracy. These are available immediately as data is collected and help us compare variants quickly.
>
> **Tier 2 -- Outcome-based (the ultimate test):** Does the reward model trained on Variant A's data outperform the one trained on Variant B's data? What about the resulting RLHF policy's Elo scores? These require actually training models on each variant's data -- expensive but definitive.
>
> Meta proved why Tier 2 matters. They used a 4-point preference strength scale and added a margin component to the ranking loss. The proof wasn't that annotators agreed more -- it was that the trained reward model got more accurate on the pairs that matter most. The real evaluation happened downstream, not at the annotation level.
>
> Similarly, Anthropic's 'choose the more harmful response' vs. 'choose the safer response' -- the right metric isn't annotator confusion (12% vs 34%). It's whether the resulting model can do 'hostage negotiation' -- respond helpfully to harmful queries rather than just refusing everything. That's only measurable after training.
>
> In the current prototype, we measure Tier 1 live. Tier 2 results would be fed back into the platform once the ML team trains models on each variant's exported data -- closing the loop between experiment design and model outcome."

**Research context -- A/B Testing Task Design:**

> "Pain Point 2.3 -- task design can't be easily A/B tested. If you want to compare 'choose the more harmful response' vs. 'choose the least harmful response' as red-teaming approaches, you need to run both in parallel, with comparable annotator pools, against comparable models. There's no infrastructure for this in any existing tool.
>
> Our experiments feature lets you run controlled A/B tests on task design itself -- different rubric wordings, different interface layouts, different instruction framings. Collection-time metrics give fast signal, but the definitive answer comes from downstream model performance."

---

## 5. Act IV: Data Pipeline & Export

### 5.1 Data Export

**Screen:** `/exports` ([http://localhost:3000/exports](http://localhost:3000/exports))

**What to show:**

- **Export history table** with version, format (DPO/Reward/SFT/Raw), record count, destination (S3/HuggingFace/GCS)

**Click "New Export":**

**Screen:** `/exports/new` ([http://localhost:3000/exports/new](http://localhost:3000/exports/new))

**What to show:**

- **Data format selector**: DPO pairs, Reward Model format, SFT format, Raw
- **Campaign/Round selection** checkboxes
- **Quality gates**: minimum agreement threshold, gold accuracy filter, flagged annotation filter
- **Batch mixing section** with 3 strategies:
  - Latest Only -- use only the current batch
  - Custom Mix -- manually set weights per round
  - Smart Mix -- algorithmically optimized mixing (our recommendation)
- **Weight sliders** for each round
- **Composition preview** showing the resulting data mix
- **Data Provenance summary** (collapsible) with mixed-provenance warning

**Research context -- Batch Mixing:**

> "Meta found that incorporating top-performing samples from all prior iterations prevented capability regression. But how do you decide what to include? What ratio? This was done by experimentation -- not by a principled system. Every new batch required researchers to manually decide the mixing recipe.
>
> Our 'Smart Mix' strategy automates this. It uses RM accuracy trends and capability coverage analysis to recommend optimal mixing ratios -- solving Pain Point 5.3 (ad-hoc data mixing)."

---

### 5.2 Data Analysis

**Screen:** `/exports/analysis` ([http://localhost:3000/exports/analysis](http://localhost:3000/exports/analysis))

**What to show:**

- **Near-duplicate detection table** with similarity scores and status
- **Cross-batch distribution chart** (stacked bar) showing topic distribution across batches
- **Data valuation section** with diminishing returns curves

**Research context -- Data Quality at Scale:**

> "Over 14 batches, Meta collected 1.4M+ comparisons. How many are near-duplicates? What's the topic distribution? Are there blind spots? This analysis was done retrospectively, if at all.
>
> Our data analysis tools run proactively. The deduplication engine catches near-duplicate annotations before they pollute training data. The distribution analysis ensures balanced topic coverage. And the data valuation curves answer the question: 'Should we collect more safety data or more helpfulness data?' -- which both papers danced around but never formally answered."

---

## 6. Closing: Vision & Roadmap

**No specific screen -- return to the dashboard or show a slide.**

### Summary: What We Built

> "DataForge addresses 17 of the 19 pain points we identified from the Anthropic and Meta papers:
>
> - **Real-time quality intelligence** -- continuous IAA monitoring, gold-task calibration, signal degradation detection (vs. Anthropic's Slack channel and spot-checks)
> - **Versioned guidelines with effectiveness tracking** -- every rubric change is tracked, A/B tested, and its impact on agreement measured (vs. Meta's static PDFs)
> - **Intelligent task routing** -- annotators get tasks matched to their demonstrated skills and current performance (vs. random assignment in both papers)
> - **3-tier automated QA pipeline** -- quality-check catches 60% of issues before human review (vs. Meta's manual content manager bottleneck)
> - **Iteration as a first-class entity** -- cross-iteration comparison, regression detection, strategy playbooks (vs. both papers' ad-hoc batch management)
> - **Full data provenance** -- every annotation traceable to annotator, model version, guideline version, QA reviewer, export dataset
> - **8 annotation task types** covering the full spectrum of RLHF data collection methodologies

### The 7 Platform Differentiators

These are capabilities neither Anthropic nor Meta had -- and that represent genuine platform intelligence:

1. **Tiered Review Pipeline** -- Quality Checks + sampling + expert adjudication
2. **Coverage-Driven Prompt Allocation** -- Ensuring balanced topic distribution
3. **Intelligent Task Routing** -- Skill-based annotator-to-task matching
4. **Difficulty Indicator** -- Real-time signal degradation awareness for annotators
5. **Iteration Playbook** -- Data-driven recommendations for next iteration strategy
6. **Guideline Effectiveness Tracking** -- Measuring which rubric changes actually improve agreement
7. **Real-Time Calibration Loop** -- Continuous annotator performance feedback during annotation

### What's Next (Future Roadmap)

> "Beyond what you see today, our roadmap targets three horizons:
>
> **Near-term**: Active learning comparison selection -- using reward model uncertainty to present annotators with pairs where their feedback is maximally informative. This could reduce required annotation volume by 30-50%.
>
> **Mid-term**: AI pre-labeling with human review -- for clear-cut comparisons, AI labels and humans audit. Meta showed GPT-4 already performs at 58.6% on their preference test set. For unambiguous cases, AI can handle the volume while humans focus on genuinely difficult comparisons.
>
> **Long-term**: Multi-modal RLHF -- as LLMs become multi-modal, data collection expands to images, code execution, tool use, and specialized domains. The platform architecture supports this extension."

---

## 7. Appendix: Quick Reference for Q&A

### Key Numbers from the Papers


| Metric                    | Anthropic                                       | Meta                                                           |
| ------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| Annotator pool            | ~30 vetted workers (MTurk + Upwork)             | Multi-stage vetting, formal QA team                            |
| Total comparisons         | ~120K (44K helpful + 42K red-team + 22K online) | 1.4M+ binary comparisons                                       |
| SFT annotations           | N/A (context distillation instead)              | 27,540                                                         |
| Iteration cycles          | ~5 weeks of online training                     | 14 batch stages (RLHF-V1 to V5)                                |
| Inter-annotator agreement | ~63%                                            | Not reported (but accuracy by preference strength: 94% to 55%) |
| Model size                | 52B parameters                                  | 7B to 70B parameters                                           |
| Reward models             | Single PM (helpfulness + harmlessness mix)      | Two separate RMs (helpfulness + safety)                        |
| RL algorithm              | PPO                                             | Rejection Sampling + PPO (combined from V4)                    |
| Preference scale          | Binary (A is better / B is better)              | 4-point (significantly/better/slightly/negligibly better)      |


### Pain Point to Screen Mapping


| Pain Point | Description                                    | Screen(s)                                                                       |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| 1.1        | Research-to-task translation gap               | Task Wizard (`/tasks/new/configure`)                                            |
| 1.2        | No visibility into strategy-quality connection | Iterations (`/iterations`), Analytics (`/analytics`)                            |
| 1.3        | Cross-iteration memory loss                    | Iterations (`/iterations`)                                                      |
| 2.1        | Guidelines are living but treated as static    | Guidelines Drawer (in any annotator screen)                                     |
| 2.2        | Rubric ambiguity causes disagreement           | Guidelines Effectiveness tab, Analytics rubric section                          |
| 2.3        | Task design can't be A/B tested                | Experiments (`/tasks/experiments`)                                              |
| 3.1        | Model serving complexity                       | Models (`/models`)                                                              |
| 3.2        | Prompt diversity hard to control               | Prompts (`/prompts`)                                                            |
| 4.1        | Cognitive load / task confusion                | All 8 annotator task interfaces                                                 |
| 4.2        | Annotator fatigue and quality drift            | Annotators (`/annotators`) fatigue badges                                       |
| 4.3        | Preference signal degrades as models improve   | Analytics signal degradation chart, Quality Feedback Panel difficulty indicator |
| 4.4        | Latency kills throughput                       | Response panels (latency indicator), Models (`/models`)                         |
| 4.5        | Multi-turn is vastly more complex              | Chat (`/chat`) conversation branching                                           |
| 4.6        | No real-time quality signal                    | Quality Feedback Panel (all annotator screens), Annotator Home (`/annotate`)    |
| 5.1        | QA is a bottleneck                             | Reviews (`/reviews`) 3-tier pipeline                                            |
| 5.2        | Rejection is expensive                         | Reviews rejection cost dashboard                                                |
| 5.3        | Data mixing across iterations is ad-hoc        | Exports (`/exports/new`) batch mixing section                                   |
| 5.4        | No deduplication or distribution analysis      | Data Analysis (`/exports/analysis`)                                             |
| 6.1        | RM accuracy is bottleneck                      | Analytics RM gauges                                                             |
| 6.2        | Eval-to-strategy feedback loop is slow         | Dashboard feedback loop cards, Iterations                                       |


### Module Architecture Quick Reference


| Module                     | Primary Screen(s)                                                  | Owner Role                   |
| -------------------------- | ------------------------------------------------------------------ | ---------------------------- |
| M1: Project Hub            | `/projects`, `/campaigns`, `/dashboard`                            | ML Researcher                |
| M2: Task Studio            | `/tasks`, `/tasks/new/configure`, `/tasks/experiments`             | Task Designer                |
| M3: Workforce Hub          | `/annotators`, `/annotators/onboarding`, `/annotators/marketplace` | Project Manager              |
| M4: Model Gateway          | `/models`                                                          | Infrastructure / ML Engineer |
| M5: Prompt Engine          | `/prompts`                                                         | Task Designer / Researcher   |
| M6: Annotation Workbench   | All annotator screens (`/annotate/`*, `/chat`, `/red-team`, etc.)  | Annotator                    |
| M7: Quality Control Center | `/reviews`, `/reviews/[id]`, Quality Feedback Panel                | QA Reviewer                  |
| M8: Data Engine            | `/exports`, `/exports/new`, `/exports/analysis`                    | ML Engineer                  |
| M9: Analytics & Insights   | `/analytics`, `/iterations`                                        | ML Researcher                |


### Anticipated Questions & Answers

**Q: How does this compare to existing tools like Label Studio or Scale AI?**

> "Label Studio and Scale AI are general-purpose annotation tools. They handle images, text, NER, and classification -- but they weren't designed for the specific demands of RLHF. They don't have multi-turn conversation support, iterative model deployment, preference signal degradation monitoring, or the intelligence feedback loops that make RLHF data collection work at scale. We're purpose-built for the RLHF pipeline."

**Q: How do you handle the helpfulness vs. safety tension?**

> "Both papers call this out as a fundamental challenge. Anthropic found their models over-optimized for safety, refusing everything. Meta trained separate reward models. Our platform supports both approaches: you can run separate helpfulness and safety annotation tracks (like Anthropic), or collect both dimensions on the same comparisons with separate scoring rubrics. The analytics dashboard tracks the balance between these dimensions across iterations."

**Q: What about multi-lingual RLHF?**

> "This is on our roadmap. The Workforce Hub already supports language tags on annotators, and the Prompt Engine can track coverage by language. The core architecture -- preference comparisons, quality monitoring, iteration management -- is language-agnostic."

**Q: How does the qualification system prevent annotation quality from degrading over time?**

> "Three mechanisms: (1) continuous gold-task monitoring -- every annotator's accuracy is tracked in real-time; (2) scheduled re-certification -- qualification tests expire and must be retaken; (3) automatic routing adjustment -- when an annotator's metrics drop, they're routed to easier tasks or triggered for re-calibration. This addresses Pain Point 4.2 (annotator fatigue and quality drift) which both papers struggled with."

**Q: What's the tech stack?**

> "Next.js 14 with App Router, React, Tailwind CSS, Zustand for state management, Recharts for data visualization, and Framer Motion for animations. The prototype uses mock data stores that mirror the shape of real API responses -- ready to be swapped for actual backend integration."

---

### Demo Navigation Cheat Sheet

Use this for quick navigation during the live demo:

```
ADMIN FLOW:
/login              --> Log in as Admin
/dashboard           --> Command center overview
/projects            --> Project list
/campaigns           --> Campaign management
/tasks/new           --> Task template gallery (8 types)
/tasks/new/configure --> 7-step wizard
/annotators          --> Team management + fatigue monitoring
/annotators/onboarding --> Vetting pipeline (Kanban)
/annotators/marketplace --> Expert discovery
/iterations          --> Cross-iteration timeline
/models              --> Model gateway + A/B testing
/prompts             --> Prompt coverage engine
/reviews             --> 3-tier QA pipeline
/reviews/1           --> Individual review with provenance
/analytics           --> Signal degradation + RM accuracy
/tasks/experiments   --> A/B test task designs
/exports             --> Export history
/exports/new         --> Export builder with batch mixing
/exports/analysis    --> Dedup + distribution + data valuation
/settings/api-keys   --> API reference
/settings/sso        --> SSO configuration
/settings/webhooks   --> Webhook management
/settings/workflows  --> Custom pipeline builder
/settings/compliance --> Data residency + PII + audit

ANNOTATOR FLOW:
/login               --> Log in as Annotator
/annotate            --> Home: performance + task queue
/annotate/1/pairwise --> Core RLHF pairwise comparison
/chat                --> Multi-turn chat annotation
/red-team            --> Safety / red-team annotation
/sft                 --> SFT demonstration writing
/rank                --> N-way ranking
/rubric              --> Multi-dimensional rubric scoring
/arena               --> Blind arena comparison
/edit                --> Editing / correction
/annotate/profile    --> Annotator profile + qualifications
/annotate/qualification/1 --> Qualification test flow
```

---

*Document prepared for DataForge product demonstration.*
*Research references: Bai et al. (2022) "Training a Helpful and Harmless Assistant with RLHF" and Touvron et al. (2023) "Llama 2: Open Foundation and Fine-Tuned Chat Models."*