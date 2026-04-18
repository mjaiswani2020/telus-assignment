import type { TaskType } from "@/data/seed";
import {
  GitCompare,
  MessageSquare,
  PenTool,
  Shield,
  Edit3,
  List,
  BarChart,
  Swords,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Template slug → TaskType mapping
// ---------------------------------------------------------------------------

export const TEMPLATE_TO_TYPE: Record<string, TaskType | null> = {
  "pairwise-preference": "Pairwise",
  "multi-turn-chat": "Conversational",
  "sft-data-authoring": "SFT",
  "safety-red-teaming": "Safety",
  "response-editing": "Editing",
  "n-way-ranking": "Ranking",
  "rubric-scoring": "Rubric",
  "model-arena": "Arena",
  scratch: null, // user picks in wizard
};

// ---------------------------------------------------------------------------
// Template metadata (for header badge in wizard)
// ---------------------------------------------------------------------------

export const TEMPLATE_METADATA: Record<
  string,
  { name: string; icon: typeof GitCompare; methodology: string }
> = {
  "pairwise-preference": {
    name: "Pairwise Preference",
    icon: GitCompare,
    methodology: "DPO / Reward Modeling",
  },
  "multi-turn-chat": {
    name: "Multi-Turn Chat",
    icon: MessageSquare,
    methodology: "Conversational RLHF",
  },
  "sft-data-authoring": {
    name: "SFT Data Authoring",
    icon: PenTool,
    methodology: "Supervised Fine-Tuning",
  },
  "safety-red-teaming": {
    name: "Safety / Red-Teaming",
    icon: Shield,
    methodology: "Safety Alignment",
  },
  "response-editing": {
    name: "Response Editing",
    icon: Edit3,
    methodology: "SFT / RLHF Hybrid",
  },
  "n-way-ranking": {
    name: "N-Way Ranking",
    icon: List,
    methodology: "Reward Model Training",
  },
  "rubric-scoring": {
    name: "Rubric Scoring",
    icon: BarChart,
    methodology: "Multi-Dimensional Eval",
  },
  "model-arena": {
    name: "Model Arena",
    icon: Swords,
    methodology: "Arena / Elo Ranking",
  },
};

// ---------------------------------------------------------------------------
// Feature flags per task type — controls which wizard sections render
// ---------------------------------------------------------------------------

export interface TypeFeatures {
  showPreferenceScale: boolean;
  showMultiTurnConfig: boolean;
  showSafetyConfig: boolean;
  showGenerationParams: boolean;
  showModels: boolean;
  showPairing: boolean;
  showRubricDimensions: boolean;
  showEditingConfig: boolean;
}

const BASE_FEATURES: TypeFeatures = {
  showPreferenceScale: true,
  showMultiTurnConfig: false,
  showSafetyConfig: false,
  showGenerationParams: true,
  showModels: true,
  showPairing: true,
  showRubricDimensions: false,
  showEditingConfig: false,
};

export const TYPE_FEATURES: Record<TaskType, TypeFeatures> = {
  Pairwise: { ...BASE_FEATURES },
  Conversational: {
    ...BASE_FEATURES,
    showMultiTurnConfig: true,
  },
  SFT: {
    ...BASE_FEATURES,
    showPreferenceScale: false,
    showModels: false,
    showPairing: false,
    showGenerationParams: false,
  },
  Safety: {
    ...BASE_FEATURES,
    showSafetyConfig: true,
  },
  Editing: {
    ...BASE_FEATURES,
    showEditingConfig: true,
    showPairing: false,
  },
  Ranking: {
    ...BASE_FEATURES,
  },
  Rubric: {
    ...BASE_FEATURES,
    showRubricDimensions: true,
    showPairing: false,
  },
  Arena: {
    ...BASE_FEATURES,
  },
};

// ---------------------------------------------------------------------------
// Default values per task type — applied when template is selected
// ---------------------------------------------------------------------------

export interface MultiTurnConfig {
  minTurns: string;
  maxTurns: string;
  perTurnPreference: boolean;
  allowUndo: boolean;
}

export interface SafetyConfig {
  contentWarnings: boolean;
  breakTimerInterval: string;
  escalationButton: boolean;
  wellbeingChecks: boolean;
}

export interface GenerationParams {
  temperature: string;
  topP: string;
  maxTokens: string;
  systemPrompt: string;
}

export interface CustomDimension {
  name: string;
  description: string;
}

export const DEFAULT_MULTI_TURN: MultiTurnConfig = {
  minTurns: "3",
  maxTurns: "8",
  perTurnPreference: true,
  allowUndo: true,
};

export const DEFAULT_SAFETY: SafetyConfig = {
  contentWarnings: true,
  breakTimerInterval: "30",
  escalationButton: true,
  wellbeingChecks: true,
};

export const DEFAULT_GENERATION_PARAMS: GenerationParams = {
  temperature: "",
  topP: "",
  maxTokens: "",
  systemPrompt: "",
};

// Partial overrides applied to wizard state when a template is selected
export interface TypeDefaults {
  annotation?: {
    preferenceScale?: string;
    preferencePolarity?: string;
    allowTies?: boolean;
    justification?: boolean;
    safetyLabels?: boolean;
    riskCategories?: boolean;
    customDimensions?: boolean;
    minTime?: string;
  };
  prompts?: {
    source?: string;
  };
  models?: {
    pairingStrategy?: string;
    responsesPerTask?: string;
    responseSource?: string;
  };
  quality?: {
    preset?: string;
  };
}

export const TYPE_DEFAULTS: Record<TaskType, TypeDefaults> = {
  Pairwise: {
    annotation: { preferenceScale: "4-point", preferencePolarity: "pick-better" },
    models: { pairingStrategy: "different", responsesPerTask: "2" },
  },
  Conversational: {
    annotation: { preferenceScale: "binary", preferencePolarity: "pick-better" },
    models: { pairingStrategy: "same", responsesPerTask: "2", responseSource: "live" },
  },
  SFT: {
    annotation: { preferencePolarity: "pick-better", justification: false },
    prompts: { source: "annotator" },
  },
  Safety: {
    annotation: {
      preferenceScale: "binary",
      preferencePolarity: "pick-worse",
      safetyLabels: true,
      riskCategories: true,
    },
    models: { pairingStrategy: "same", responsesPerTask: "2" },
    quality: { preset: "production" },
  },
  Editing: {
    annotation: { preferencePolarity: "pick-better" },
    models: { pairingStrategy: "same", responsesPerTask: "1" },
  },
  Ranking: {
    annotation: { preferenceScale: "binary", preferencePolarity: "pick-better", allowTies: true },
    models: { pairingStrategy: "different", responsesPerTask: "4" },
  },
  Rubric: {
    annotation: { preferencePolarity: "pick-better", customDimensions: true },
    models: { responsesPerTask: "1" },
  },
  Arena: {
    annotation: { preferenceScale: "binary", preferencePolarity: "pick-better", allowTies: true },
    models: { pairingStrategy: "different", responsesPerTask: "2" },
  },
};

// ---------------------------------------------------------------------------
// Task type icons (for the type selector in scratch mode)
// ---------------------------------------------------------------------------

export const TASK_TYPE_INFO: Record<
  TaskType,
  { icon: typeof GitCompare; label: string; description: string }
> = {
  Pairwise: {
    icon: GitCompare,
    label: "Pairwise Preference",
    description: "Compare two responses side-by-side",
  },
  Conversational: {
    icon: MessageSquare,
    label: "Multi-Turn Chat",
    description: "Real-time chat with per-turn comparison",
  },
  SFT: {
    icon: PenTool,
    label: "SFT Data Authoring",
    description: "Write prompt-response pairs for fine-tuning",
  },
  Safety: {
    icon: Shield,
    label: "Safety / Red-Teaming",
    description: "Adversarial testing with safety labels",
  },
  Editing: {
    icon: Edit3,
    label: "Response Editing",
    description: "Edit and improve model responses",
  },
  Ranking: {
    icon: List,
    label: "N-Way Ranking",
    description: "Rank multiple responses best to worst",
  },
  Rubric: {
    icon: BarChart,
    label: "Rubric Scoring",
    description: "Score on multiple evaluation dimensions",
  },
  Arena: {
    icon: Swords,
    label: "Model Arena",
    description: "Blind head-to-head with Elo rating",
  },
};
