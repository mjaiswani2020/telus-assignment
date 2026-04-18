"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Check, Plus, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/cn";
import type {
  TypeFeatures,
  MultiTurnConfig,
  SafetyConfig,
  EditingConfig,
  RankingConfig,
  RubricDimension,
  ArenaConfig,
  SftConfig,
  CustomDimension,
} from "@/lib/task-type-config";

type PreferenceScale = "binary" | "4-point" | "7-point" | "custom";

interface AnnotationData {
  preferenceScale: PreferenceScale;
  preferencePolarity: string;
  allowTies: boolean;
  justification: boolean;
  safetyLabels: boolean;
  riskCategories: boolean;
  customDimensions: boolean;
  minTime: string;
  allowSkip: boolean;
  allowFlag: boolean;
  customScaleLabels: string[];
  customDimensionsList: CustomDimension[];
  multiTurnConfig: MultiTurnConfig;
  safetyConfig: SafetyConfig;
  editingConfig: EditingConfig;
  rankingConfig: RankingConfig;
  rubricDimensions: RubricDimension[];
  arenaConfig: ArenaConfig;
  sftConfig: SftConfig;
}

interface AnnotationProps {
  data: AnnotationData;
  onChange: (data: AnnotationData) => void;
  features: TypeFeatures;
}

const scaleOptions: { value: PreferenceScale; label: string; description: string }[] = [
  { value: "binary", label: "Binary", description: "A or B (no degree)" },
  { value: "4-point", label: "4-Point", description: "Much better, Better, Slightly better, Negligible" },
  { value: "7-point", label: "7-Point", description: "Full Likert scale with neutral midpoint" },
  { value: "custom", label: "Custom", description: "Define your own preference labels" },
];

const polarityOptions = [
  { value: "pick-better", label: "Pick the better response" },
  { value: "pick-worse", label: "Pick the worse response (red-teaming)" },
  { value: "position-blind", label: "Position-blind (randomized labels)" },
];

function Checkbox({
  checked,
  onChange,
  label,
  description,
  highlighted,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "flex w-full items-center gap-3 rounded-standard border p-3.5 text-left transition-colors",
        highlighted && checked
          ? "border-deep-teal bg-selected-bg"
          : checked
          ? "border-deep-teal bg-selected-bg"
          : "border-level-2 bg-white hover:border-level-3"
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-tight border-2 transition-colors",
          checked ? "border-deep-teal bg-deep-teal" : "border-level-2"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </span>
      <div>
        <span className="font-inter text-[14px] font-medium text-ink">{label}</span>
        {description && (
          <p className="font-inter text-[12px] text-tertiary-text">{description}</p>
        )}
      </div>
    </button>
  );
}

function SimpleCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-2.5 mt-2">
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-tight border-2 transition-colors",
          checked ? "border-deep-teal bg-deep-teal" : "border-level-2"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </span>
      <span className="font-inter text-body-md text-ink">{label}</span>
    </button>
  );
}

function TagEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-tight bg-selected-bg px-2 py-0.5 font-inter text-[12px] font-medium text-deep-teal"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="ml-0.5 hover:text-error"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === ",") && input.trim()) {
              e.preventDefault();
              onChange([...items, input.trim()]);
              setInput("");
            }
          }}
          className="flex-1 rounded-standard border border-level-2 bg-level-1 px-3 py-1.5 font-inter text-[13px] text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-teal/20"
        />
      </div>
    </div>
  );
}

export function Annotation({ data, onChange, features }: AnnotationProps) {
  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Annotation Setup</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Configure how annotators evaluate and provide feedback.
      </p>

      {/* ================================================================
           PAIRWISE / CONVERSATIONAL / SAFETY: Preference Scale
           ================================================================ */}
      {features.showPreferenceScale && (
        <>
          <div className="mt-8">
            <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
              Preference Scale
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {scaleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...data, preferenceScale: opt.value })}
                  className={cn(
                    "rounded-comfortable border p-4 text-left transition-colors",
                    data.preferenceScale === opt.value
                      ? "border-deep-teal bg-selected-bg"
                      : "border-level-2 bg-white hover:border-level-3"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border-2", data.preferenceScale === opt.value ? "border-deep-teal" : "border-level-2")}>
                      {data.preferenceScale === opt.value && <span className="h-2 w-2 rounded-full bg-deep-teal" />}
                    </span>
                    <span className="font-inter text-[14px] font-medium text-ink">{opt.label}</span>
                  </div>
                  <p className="mt-1 pl-6 font-inter text-[12px] text-tertiary-text">{opt.description}</p>
                </button>
              ))}
            </div>

            {/* Custom Scale Label Editor */}
            {data.preferenceScale === "custom" && (
              <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-4">
                <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Custom Scale Labels</label>
                <p className="mt-1 font-inter text-[12px] text-tertiary-text">Define labels from strongest to weakest preference.</p>
                <div className="mt-3 space-y-2">
                  {(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""]).map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 shrink-0 text-center font-inter text-[12px] text-tertiary-text">{i + 1}.</span>
                      <input
                        type="text"
                        value={label}
                        placeholder={`Label ${i + 1} (e.g., "Much better")`}
                        onChange={(e) => {
                          const next = [...(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""])];
                          next[i] = e.target.value;
                          onChange({ ...data, customScaleLabels: next });
                        }}
                        className="flex-1 rounded-standard border border-level-2 bg-level-1 px-3 py-2 font-inter text-body-md text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-teal/20"
                      />
                      {(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""]).length > 2 && (
                        <button type="button" onClick={() => { const next = [...(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""])]; next.splice(i, 1); onChange({ ...data, customScaleLabels: next }); }} className="text-tertiary-text hover:text-error">&times;</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => onChange({ ...data, customScaleLabels: [...(data.customScaleLabels.length > 0 ? data.customScaleLabels : ["", ""]), ""] })} className="mt-2 font-inter text-[13px] font-medium text-deep-teal hover:underline">+ Add label</button>
              </div>
            )}
          </div>

          {/* Polarity & Ties */}
          {features.showPolarity && (
            <div className="mt-6 grid grid-cols-2 gap-6">
              <Select label="Preference Polarity" options={polarityOptions} value={data.preferencePolarity} onChange={(e) => onChange({ ...data, preferencePolarity: e.target.value })} />
              {features.showTies && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Allow Ties</label>
                  <SimpleCheckbox checked={data.allowTies} onChange={() => onChange({ ...data, allowTies: !data.allowTies })} label="Allow annotators to mark responses as equally good" />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================================================================
           MULTI-TURN CHAT: Conversation config
           ================================================================ */}
      {features.showMultiTurnConfig && (
        <div className="mt-8 rounded-comfortable border border-deep-teal/20 bg-selected-bg p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">Multi-Turn Conversation</h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">Annotators chat with live models and compare responses at each turn.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input label="Min Turns" type="number" placeholder="3" value={data.multiTurnConfig.minTurns} onChange={(e) => onChange({ ...data, multiTurnConfig: { ...data.multiTurnConfig, minTurns: e.target.value } })} helper="Minimum conversation turns" />
            <Input label="Max Turns" type="number" placeholder="8" value={data.multiTurnConfig.maxTurns} onChange={(e) => onChange({ ...data, multiTurnConfig: { ...data.multiTurnConfig, maxTurns: e.target.value } })} helper="Maximum conversation turns" />
          </div>
          <div className="mt-4 space-y-3">
            <SimpleCheckbox checked={data.multiTurnConfig.perTurnPreference} onChange={() => onChange({ ...data, multiTurnConfig: { ...data.multiTurnConfig, perTurnPreference: !data.multiTurnConfig.perTurnPreference } })} label="Collect preference at every turn" />
            <SimpleCheckbox checked={data.multiTurnConfig.allowUndo} onChange={() => onChange({ ...data, multiTurnConfig: { ...data.multiTurnConfig, allowUndo: !data.multiTurnConfig.allowUndo } })} label="Allow annotators to undo previous turns" />
          </div>
        </div>
      )}

      {/* ================================================================
           SAFETY: Safety-specific config
           ================================================================ */}
      {features.showSafetyConfig && (
        <div className="mt-8 rounded-comfortable border border-caution/30 bg-[#FFFBEB] p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">Safety & Red-Teaming</h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">Configure safety-specific features for adversarial annotation tasks.</p>
          <div className="mt-4 space-y-3">
            <Checkbox checked={data.safetyConfig.contentWarnings} onChange={() => onChange({ ...data, safetyConfig: { ...data.safetyConfig, contentWarnings: !data.safetyConfig.contentWarnings } })} label="Content warning before each task" description="Show a warning banner that annotators must acknowledge" />
            <Checkbox checked={data.safetyConfig.escalationButton} onChange={() => onChange({ ...data, safetyConfig: { ...data.safetyConfig, escalationButton: !data.safetyConfig.escalationButton } })} label="Escalation button" description="Show 'Report to Safety Team' button for severe content" />
            <Checkbox checked={data.safetyConfig.wellbeingChecks} onChange={() => onChange({ ...data, safetyConfig: { ...data.safetyConfig, wellbeingChecks: !data.safetyConfig.wellbeingChecks } })} label="Wellbeing check-ins" description="Periodic dialog asking annotators if they want to continue" />
          </div>
          <div className="mt-4">
            <Input label="Break Timer (minutes)" type="number" placeholder="30" value={data.safetyConfig.breakTimerInterval} onChange={(e) => onChange({ ...data, safetyConfig: { ...data.safetyConfig, breakTimerInterval: e.target.value } })} helper="Remind annotators to take breaks" />
          </div>
          <div className="mt-4">
            <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Safety Classification Labels</label>
            <p className="mt-1 font-inter text-[12px] text-tertiary-text">Labels annotators use to classify response safety.</p>
            <div className="mt-2">
              <TagEditor items={data.safetyConfig.classificationLabels} onChange={(labels) => onChange({ ...data, safetyConfig: { ...data.safetyConfig, classificationLabels: labels } })} placeholder="Add label (e.g., Harmful)..." />
            </div>
          </div>
          <div className="mt-4">
            <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Risk Categories</label>
            <p className="mt-1 font-inter text-[12px] text-tertiary-text">Taxonomy of risk types annotators can select.</p>
            <div className="mt-2">
              <TagEditor items={data.safetyConfig.riskCategories} onChange={(cats) => onChange({ ...data, safetyConfig: { ...data.safetyConfig, riskCategories: cats } })} placeholder="Add category (e.g., Violence)..." />
            </div>
          </div>
          <div className="mt-4">
            <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Attack Vectors</label>
            <p className="mt-1 font-inter text-[12px] text-tertiary-text">Adversarial techniques annotators can tag.</p>
            <div className="mt-2">
              <TagEditor items={data.safetyConfig.attackVectors} onChange={(vecs) => onChange({ ...data, safetyConfig: { ...data.safetyConfig, attackVectors: vecs } })} placeholder="Add vector (e.g., Jailbreak)..." />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
           EDITING: Editing-specific config
           ================================================================ */}
      {features.showEditingConfig && (
        <div className="mt-8 rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">Response Editing</h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">Annotators improve model responses. The edited version automatically becomes the &quot;preferred&quot; response for training.</p>
          <div className="mt-4">
            <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Editing Mode</label>
            <div className="mt-2 flex gap-3">
              {[
                { value: "minimal" as const, label: "Minimal Correction", desc: "Fix errors without rewriting — preserve model voice" },
                { value: "substantial" as const, label: "Substantial Rewrite", desc: "Freely improve quality, structure, and completeness" },
              ].map((opt) => (
                <button key={opt.value} type="button" onClick={() => onChange({ ...data, editingConfig: { ...data.editingConfig, editingMode: opt.value } })} className={cn("flex-1 rounded-comfortable border p-4 text-left transition-colors", data.editingConfig.editingMode === opt.value ? "border-deep-teal bg-selected-bg" : "border-level-2 hover:border-level-3")}>
                  <div className="flex items-center gap-2">
                    <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border-2", data.editingConfig.editingMode === opt.value ? "border-deep-teal" : "border-level-2")}>
                      {data.editingConfig.editingMode === opt.value && <span className="h-2 w-2 rounded-full bg-deep-teal" />}
                    </span>
                    <span className="font-inter text-[14px] font-medium text-ink">{opt.label}</span>
                  </div>
                  <p className="mt-1 pl-6 font-inter text-[12px] text-tertiary-text">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <SimpleCheckbox checked={data.editingConfig.showDiffView} onChange={() => onChange({ ...data, editingConfig: { ...data.editingConfig, showDiffView: !data.editingConfig.showDiffView } })} label="Show diff view (inline + side-by-side comparison of changes)" />
          </div>
        </div>
      )}

      {/* ================================================================
           RANKING: Ranking-specific config
           ================================================================ */}
      {features.showRankingConfig && (
        <div className="mt-8 rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">Ranking Configuration</h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">Annotators order N responses from best to worst. The platform decomposes rankings into all pairwise comparisons for training.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input label="Responses to Rank (N)" type="number" placeholder="4" value={data.rankingConfig.responsesToRank} onChange={(e) => onChange({ ...data, rankingConfig: { ...data.rankingConfig, responsesToRank: e.target.value } })} helper="Number of responses shown per ranking task (2–8)" />
            <div>
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Ranking Method</label>
              <div className="mt-2 flex gap-2">
                {[
                  { value: "full" as const, label: "Full Ordering" },
                  { value: "top-k" as const, label: "Top-K Only" },
                ].map((opt) => (
                  <button key={opt.value} type="button" onClick={() => onChange({ ...data, rankingConfig: { ...data.rankingConfig, rankingMethod: opt.value } })} className={cn("rounded-standard border px-4 py-2 font-inter text-[13px] font-medium transition-colors", data.rankingConfig.rankingMethod === opt.value ? "border-deep-teal bg-selected-bg text-deep-teal" : "border-level-2 text-secondary-text hover:border-level-3")}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {data.rankingConfig.rankingMethod === "top-k" && (
            <div className="mt-4">
              <Input label="Top K" type="number" placeholder="3" value={data.rankingConfig.topK} onChange={(e) => onChange({ ...data, rankingConfig: { ...data.rankingConfig, topK: e.target.value } })} helper="Only rank the top K responses (remaining are unranked)" />
            </div>
          )}
          <div className="mt-4">
            <SimpleCheckbox checked={data.rankingConfig.allowTiedRanks} onChange={() => onChange({ ...data, rankingConfig: { ...data.rankingConfig, allowTiedRanks: !data.rankingConfig.allowTiedRanks } })} label="Allow tied ranks (two responses can share the same position)" />
          </div>
        </div>
      )}

      {/* ================================================================
           RUBRIC: Dimension builder
           ================================================================ */}
      {features.showRubricConfig && (
        <div className="mt-8 rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">Scoring Dimensions</h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">Define the evaluation axes annotators will score responses on. Each dimension can use a numeric slider or categorical buttons.</p>
          <div className="mt-4 space-y-3">
            {data.rubricDimensions.map((dim, i) => (
              <div key={i} className="rounded-standard border border-level-2 bg-level-1 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <GripVertical className="h-4 w-4 text-tertiary-text" />
                  <span className="font-inter text-[13px] font-medium text-ink">Dimension {i + 1}</span>
                  {data.rubricDimensions.length > 1 && (
                    <button type="button" onClick={() => onChange({ ...data, rubricDimensions: data.rubricDimensions.filter((_, j) => j !== i) })} className="ml-auto text-tertiary-text hover:text-error">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={dim.name} placeholder="Dimension name (e.g., Helpfulness)" onChange={(e) => { const next = [...data.rubricDimensions]; next[i] = { ...next[i], name: e.target.value }; onChange({ ...data, rubricDimensions: next }); }} className="rounded-standard border border-level-2 bg-white px-3 py-2 font-inter text-body-md text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:outline-none focus:ring-2 focus:ring-deep-teal/20" />
                  <input type="text" value={dim.description} placeholder="Description" onChange={(e) => { const next = [...data.rubricDimensions]; next[i] = { ...next[i], description: e.target.value }; onChange({ ...data, rubricDimensions: next }); }} className="rounded-standard border border-level-2 bg-white px-3 py-2 font-inter text-body-md text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:outline-none focus:ring-2 focus:ring-deep-teal/20" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label className="font-inter text-[12px] text-secondary-text">Scale:</label>
                  <div className="flex gap-2">
                    {[
                      { value: "slider" as const, label: "Numeric (1–5)" },
                      { value: "categorical" as const, label: "Categorical" },
                    ].map((opt) => (
                      <button key={opt.value} type="button" onClick={() => { const next = [...data.rubricDimensions]; next[i] = { ...next[i], scaleType: opt.value }; onChange({ ...data, rubricDimensions: next }); }} className={cn("rounded-tight px-2.5 py-1 font-inter text-[12px] font-medium transition-colors", dim.scaleType === opt.value ? "bg-deep-teal text-white" : "border border-level-2 text-secondary-text hover:border-level-3")}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {dim.scaleType === "slider" && (
                    <div className="ml-2 flex items-center gap-1.5">
                      <input type="number" value={dim.scaleMin || "1"} onChange={(e) => { const next = [...data.rubricDimensions]; next[i] = { ...next[i], scaleMin: e.target.value }; onChange({ ...data, rubricDimensions: next }); }} className="w-14 rounded-tight border border-level-2 bg-white px-2 py-1 text-center font-inter text-[12px]" />
                      <span className="text-tertiary-text">–</span>
                      <input type="number" value={dim.scaleMax || "5"} onChange={(e) => { const next = [...data.rubricDimensions]; next[i] = { ...next[i], scaleMax: e.target.value }; onChange({ ...data, rubricDimensions: next }); }} className="w-14 rounded-tight border border-level-2 bg-white px-2 py-1 text-center font-inter text-[12px]" />
                    </div>
                  )}
                </div>
                {dim.scaleType === "categorical" && (
                  <div className="mt-2">
                    <TagEditor items={dim.categoricalOptions} onChange={(opts) => { const next = [...data.rubricDimensions]; next[i] = { ...next[i], categoricalOptions: opts }; onChange({ ...data, rubricDimensions: next }); }} placeholder="Add option (e.g., Safe)..." />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onChange({ ...data, rubricDimensions: [...data.rubricDimensions, { name: "", description: "", scaleType: "slider", scaleMin: "1", scaleMax: "5", categoricalOptions: [] }] })} className="mt-3 inline-flex items-center gap-1.5 font-inter text-[13px] font-medium text-deep-teal hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add dimension
          </button>
        </div>
      )}

      {/* ================================================================
           ARENA: Arena-specific config
           ================================================================ */}
      {features.showArenaConfig && (
        <div className="mt-8 rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">Arena Configuration</h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">Blind head-to-head model comparison with Elo rating tracking.</p>
          <div className="mt-4 space-y-3">
            <SimpleCheckbox checked={data.arenaConfig.blindEvaluation} onChange={() => onChange({ ...data, arenaConfig: { ...data.arenaConfig, blindEvaluation: !data.arenaConfig.blindEvaluation } })} label="Blind evaluation — hide model identities during annotation" />
            <SimpleCheckbox checked={data.arenaConfig.revealModelsAfterSubmit} onChange={() => onChange({ ...data, arenaConfig: { ...data.arenaConfig, revealModelsAfterSubmit: !data.arenaConfig.revealModelsAfterSubmit } })} label="Reveal model identities after submission" />
          </div>
          <div className="mt-4">
            <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Matchmaking Strategy</label>
            <div className="mt-2 flex gap-2">
              {[
                { value: "random" as const, label: "Random", desc: "Random model pairs" },
                { value: "swiss" as const, label: "Swiss Tournament", desc: "Pair similarly-rated models" },
                { value: "round-robin" as const, label: "Round-Robin", desc: "Every model plays every other" },
              ].map((opt) => (
                <button key={opt.value} type="button" onClick={() => onChange({ ...data, arenaConfig: { ...data.arenaConfig, matchmaking: opt.value } })} className={cn("flex-1 rounded-standard border px-3 py-2.5 text-left transition-colors", data.arenaConfig.matchmaking === opt.value ? "border-deep-teal bg-selected-bg" : "border-level-2 hover:border-level-3")}>
                  <span className="font-inter text-[13px] font-medium text-ink">{opt.label}</span>
                  <p className="font-inter text-[11px] text-tertiary-text">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input label="Initial Elo Rating" type="number" placeholder="1500" value={data.arenaConfig.initialElo} onChange={(e) => onChange({ ...data, arenaConfig: { ...data.arenaConfig, initialElo: e.target.value } })} helper="Starting rating for new models" />
            <Input label="K-Factor" type="number" placeholder="32" value={data.arenaConfig.kFactor} onChange={(e) => onChange({ ...data, arenaConfig: { ...data.arenaConfig, kFactor: e.target.value } })} helper="How quickly ratings change (higher = more volatile)" />
          </div>
        </div>
      )}

      {/* ================================================================
           SFT: Authoring-specific config
           ================================================================ */}
      {features.showSftConfig && (
        <div className="mt-8 rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">SFT Authoring Settings</h3>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">Annotators write both the prompt and the ideal response. Configure limits and reference materials.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input label="Prompt Character Limit" type="number" placeholder="2000" value={data.sftConfig.promptCharLimit} onChange={(e) => onChange({ ...data, sftConfig: { ...data.sftConfig, promptCharLimit: e.target.value } })} helper="Maximum characters for annotator-written prompts" />
            <Input label="Response Character Limit" type="number" placeholder="4000" value={data.sftConfig.responseCharLimit} onChange={(e) => onChange({ ...data, sftConfig: { ...data.sftConfig, responseCharLimit: e.target.value } })} helper="Maximum characters for annotator-written responses" />
          </div>
          <div className="mt-4">
            <SimpleCheckbox checked={data.sftConfig.showReferenceResponse} onChange={() => onChange({ ...data, sftConfig: { ...data.sftConfig, showReferenceResponse: !data.sftConfig.showReferenceResponse } })} label="Show reference response (collapsible model-generated example for guidance)" />
          </div>
          <div className="mt-4">
            <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Difficulty Levels</label>
            <p className="mt-1 font-inter text-[12px] text-tertiary-text">Categories annotators select when tagging their authored prompts.</p>
            <div className="mt-2">
              <TagEditor items={data.sftConfig.difficultyLevels} onChange={(levels) => onChange({ ...data, sftConfig: { ...data.sftConfig, difficultyLevels: levels } })} placeholder="Add level (e.g., Expert)..." />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
           COMMON: Additional Inputs (only for comparison-based types)
           ================================================================ */}
      {features.showAdditionalInputs && (
        <div className="mt-8">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Additional Inputs</label>
          <div className="mt-3 space-y-3">
            <Checkbox checked={data.justification} onChange={() => onChange({ ...data, justification: !data.justification })} label="Justification text" description="Require a written rationale for each preference" />
            {!features.showSafetyConfig && (
              <>
                <Checkbox checked={data.safetyLabels} onChange={() => onChange({ ...data, safetyLabels: !data.safetyLabels })} label="Safety labels" description="Tag responses with safety classification (Safe / Borderline / Unsafe)" />
                <Checkbox checked={data.riskCategories} onChange={() => onChange({ ...data, riskCategories: !data.riskCategories })} label="Risk categories" description="Multi-select risk taxonomy labels" />
              </>
            )}
            <Checkbox checked={data.customDimensions} onChange={() => onChange({ ...data, customDimensions: !data.customDimensions })} label="Custom evaluation dimensions" description="Add extra scoring axes alongside preference" />
          </div>
        </div>
      )}

      {/* Custom Dimensions Editor (for comparison types that enable it) */}
      {features.showAdditionalInputs && data.customDimensions && (
        <div className="mt-4 rounded-comfortable border border-level-2 bg-white p-4">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Evaluation Dimensions</label>
          <div className="mt-3 space-y-2">
            {(data.customDimensionsList.length > 0 ? data.customDimensionsList : [{ name: "Helpfulness", description: "Does the response address the user's needs?" }, { name: "Accuracy", description: "Is the information factually correct?" }]).map((dim, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-2.5 w-6 shrink-0 text-center font-inter text-[12px] text-tertiary-text">{i + 1}.</span>
                <div className="flex flex-1 gap-2">
                  <input type="text" value={dim.name} placeholder="Dimension name" onChange={(e) => { const next = [...(data.customDimensionsList.length > 0 ? data.customDimensionsList : [{ name: "Helpfulness", description: "" }, { name: "Accuracy", description: "" }])]; next[i] = { ...next[i], name: e.target.value }; onChange({ ...data, customDimensionsList: next }); }} className="w-40 rounded-standard border border-level-2 bg-level-1 px-3 py-2 font-inter text-body-md text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-teal/20" />
                  <input type="text" value={dim.description} placeholder="Description" onChange={(e) => { const next = [...(data.customDimensionsList.length > 0 ? data.customDimensionsList : [{ name: "Helpfulness", description: "" }, { name: "Accuracy", description: "" }])]; next[i] = { ...next[i], description: e.target.value }; onChange({ ...data, customDimensionsList: next }); }} className="flex-1 rounded-standard border border-level-2 bg-level-1 px-3 py-2 font-inter text-body-md text-ink placeholder:text-tertiary-text focus:border-deep-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-teal/20" />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onChange({ ...data, customDimensionsList: [...(data.customDimensionsList.length > 0 ? data.customDimensionsList : [{ name: "Helpfulness", description: "" }, { name: "Accuracy", description: "" }]), { name: "", description: "" }] })} className="mt-2 font-inter text-[13px] font-medium text-deep-teal hover:underline">+ Add dimension</button>
        </div>
      )}

      {/* ================================================================
           COMMON: Constraints (min time, skip, flag — all types)
           ================================================================ */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <Input label="Min Time (seconds)" type="number" placeholder="45" value={data.minTime} onChange={(e) => onChange({ ...data, minTime: e.target.value })} helper="Minimum time before submission" />
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Allow Skip</label>
          <SimpleCheckbox checked={data.allowSkip} onChange={() => onChange({ ...data, allowSkip: !data.allowSkip })} label="Annotators may skip items" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">Allow Flag</label>
          <SimpleCheckbox checked={data.allowFlag} onChange={() => onChange({ ...data, allowFlag: !data.allowFlag })} label="Annotators may flag items" />
        </div>
      </div>
    </div>
  );
}

export type { AnnotationData, PreferenceScale };
