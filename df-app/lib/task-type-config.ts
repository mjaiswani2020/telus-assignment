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
  scratch: null,
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
  // Annotation step sections
  showPreferenceScale: boolean;
  showPolarity: boolean;
  showTies: boolean;
  showAdditionalInputs: boolean;
  showMultiTurnConfig: boolean;
  showSafetyConfig: boolean;
  showEditingConfig: boolean;
  showRankingConfig: boolean;
  showRubricConfig: boolean;
  showArenaConfig: boolean;
  showSftConfig: boolean;
  // Models step sections
  showGenerationParams: boolean;
  showModels: boolean;
  showPairing: boolean;
}

const BASE_FEATURES: TypeFeatures = {
  showPreferenceScale: true,
  showPolarity: true,
  showTies: true,
  showAdditionalInputs: true,
  showMultiTurnConfig: false,
  showSafetyConfig: false,
  showEditingConfig: false,
  showRankingConfig: false,
  showRubricConfig: false,
  showArenaConfig: false,
  showSftConfig: false,
  showGenerationParams: true,
  showModels: true,
  showPairing: true,
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
    showPolarity: false,
    showTies: false,
    showAdditionalInputs: false,
    showSftConfig: true,
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
    showPreferenceScale: false,
    showPolarity: false,
    showTies: false,
    showAdditionalInputs: false,
    showEditingConfig: true,
    showPairing: false,
  },
  Ranking: {
    ...BASE_FEATURES,
    showPreferenceScale: false,
    showPolarity: false,
    showTies: false,
    showAdditionalInputs: true,
    showRankingConfig: true,
  },
  Rubric: {
    ...BASE_FEATURES,
    showPreferenceScale: false,
    showPolarity: false,
    showTies: false,
    showAdditionalInputs: false,
    showRubricConfig: true,
    showPairing: false,
  },
  Arena: {
    ...BASE_FEATURES,
    showArenaConfig: true,
  },
};

// ---------------------------------------------------------------------------
// Config sub-types
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
  riskCategories: string[];
  attackVectors: string[];
  classificationLabels: string[];
}

export interface EditingConfig {
  editingMode: "minimal" | "substantial";
  showDiffView: boolean;
}

export interface RankingConfig {
  responsesToRank: string;
  allowTiedRanks: boolean;
  rankingMethod: "full" | "top-k";
  topK: string;
}

export interface RubricDimension {
  name: string;
  description: string;
  scaleType: "slider" | "categorical";
  scaleMin: string;
  scaleMax: string;
  categoricalOptions: string[];
}

export interface ArenaConfig {
  blindEvaluation: boolean;
  revealModelsAfterSubmit: boolean;
  matchmaking: "random" | "swiss" | "round-robin";
  initialElo: string;
  kFactor: string;
}

export interface SftConfig {
  promptCharLimit: string;
  responseCharLimit: string;
  showReferenceResponse: boolean;
  difficultyLevels: string[];
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

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

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
  riskCategories: [
    "Violence & Physical Harm",
    "Cybersecurity Exploits",
    "Privacy Violation",
    "Deception & Manipulation",
    "Bias & Discrimination",
    "Illegal Activity",
    "Self-Harm",
    "Other",
  ],
  attackVectors: [
    "Jailbreak",
    "Roleplay / Fiction Framing",
    "Encoding / Obfuscation",
    "Multi-Step Escalation",
    "Authority Impersonation",
    "Context Shifting",
    "Direct Request",
  ],
  classificationLabels: ["Safe", "Borderline", "Unsafe"],
};

export const DEFAULT_EDITING: EditingConfig = {
  editingMode: "minimal",
  showDiffView: true,
};

export const DEFAULT_RANKING: RankingConfig = {
  responsesToRank: "4",
  allowTiedRanks: false,
  rankingMethod: "full",
  topK: "3",
};

export const DEFAULT_RUBRIC_DIMENSIONS: RubricDimension[] = [
  { name: "Helpfulness", description: "Does the response address the user's needs?", scaleType: "slider", scaleMin: "1", scaleMax: "5", categoricalOptions: [] },
  { name: "Factual Accuracy", description: "Are all claims factually correct?", scaleType: "slider", scaleMin: "1", scaleMax: "5", categoricalOptions: [] },
  { name: "Safety", description: "Does the response avoid harmful content?", scaleType: "categorical", scaleMin: "", scaleMax: "", categoricalOptions: ["Safe", "Borderline", "Unsafe"] },
];

export const DEFAULT_ARENA: ArenaConfig = {
  blindEvaluation: true,
  revealModelsAfterSubmit: true,
  matchmaking: "random",
  initialElo: "1500",
  kFactor: "32",
};

export const DEFAULT_SFT: SftConfig = {
  promptCharLimit: "2000",
  responseCharLimit: "4000",
  showReferenceResponse: true,
  difficultyLevels: ["Easy", "Medium", "Hard", "Adversarial"],
};

export const DEFAULT_GENERATION_PARAMS: GenerationParams = {
  temperature: "",
  topP: "",
  maxTokens: "",
  systemPrompt: "",
};

// ---------------------------------------------------------------------------
// Type defaults applied to wizard state when template is selected
// ---------------------------------------------------------------------------

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
    models: { pairingStrategy: "same", responsesPerTask: "1" },
  },
  Ranking: {
    models: { pairingStrategy: "different", responsesPerTask: "4" },
  },
  Rubric: {
    annotation: { customDimensions: true },
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
