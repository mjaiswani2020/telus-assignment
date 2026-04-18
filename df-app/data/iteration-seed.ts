export type IterationStatus = "Complete" | "Active" | "Planned";

export interface IterationStrategy {
  label: string;
  mix: { label: string; pct: number; color: string }[];
}

export interface IterationModel {
  name: string;
  health: "Up" | "Down" | "Degraded";
  temperature: number;
  topP: number;
}

export interface IterationCohort {
  total: number;
  avgTier: number;
  returning: number;
  new: number;
}

export interface IterationCollection {
  current: number;
  target: number;
  iaa: number;
  goldAcc: number;
}

export interface IterationTraining {
  rmAccuracy: number;
  policyImprovement: number;
}

export interface IterationEvaluation {
  elo: number;
  eloDelta: number | null;
  falseRefusal: number;
  regression: string;
}

export interface Iteration {
  id: string;
  round: number;
  status: IterationStatus;
  strategy: IterationStrategy;
  model: IterationModel;
  cohort: IterationCohort;
  collection: IterationCollection;
  training: IterationTraining;
  evaluation: IterationEvaluation;
  duration: string | null;
  cost: number | null;
  keyChange: string;
  notes: string[];
}

export const seedIterations: Iteration[] = [
  {
    id: "iter-1",
    round: 1,
    status: "Complete",
    strategy: {
      label: "Initial baseline collection",
      mix: [
        { label: "Helpfulness", pct: 70, color: "#005151" },
        { label: "Safety", pct: 20, color: "#D97706" },
        { label: "SFT", pct: 10, color: "#9CA3AF" },
      ],
    },
    model: {
      name: "claude-3-sonnet v1",
      health: "Up",
      temperature: 0.7,
      topP: 0.9,
    },
    cohort: { total: 18, avgTier: 1.8, returning: 0, new: 18 },
    collection: { current: 2400, target: 2400, iaa: 0.63, goldAcc: 71.2 },
    training: { rmAccuracy: 68.2, policyImprovement: 0 },
    evaluation: { elo: 1180, eloDelta: null, falseRefusal: 6.8, regression: "N/A" },
    duration: "2 weeks",
    cost: 1152,
    keyChange: "Initial baseline",
    notes: [],
  },
  {
    id: "iter-2",
    round: 2,
    status: "Complete",
    strategy: {
      label: "Added preference strength signal",
      mix: [
        { label: "Helpfulness", pct: 65, color: "#005151" },
        { label: "Safety", pct: 25, color: "#D97706" },
        { label: "SFT", pct: 10, color: "#9CA3AF" },
      ],
    },
    model: {
      name: "claude-3-sonnet v1.1",
      health: "Up",
      temperature: 0.75,
      topP: 0.92,
    },
    cohort: { total: 20, avgTier: 2.0, returning: 14, new: 6 },
    collection: { current: 3100, target: 3100, iaa: 0.67, goldAcc: 74.1 },
    training: { rmAccuracy: 72.1, policyImprovement: 2.1 },
    evaluation: { elo: 1192, eloDelta: 12, falseRefusal: 5.9, regression: "None detected" },
    duration: "2 weeks",
    cost: 1581,
    keyChange: "Added preference strength",
    notes: [],
  },
  {
    id: "iter-3",
    round: 3,
    status: "Complete",
    strategy: {
      label: "Separate helpfulness/safety reward models",
      mix: [
        { label: "Helpfulness", pct: 55, color: "#005151" },
        { label: "Safety", pct: 35, color: "#D97706" },
        { label: "SFT", pct: 10, color: "#9CA3AF" },
      ],
    },
    model: {
      name: "claude-3.5-sonnet v1",
      health: "Up",
      temperature: 0.8,
      topP: 0.95,
    },
    cohort: { total: 22, avgTier: 2.1, returning: 16, new: 6 },
    collection: { current: 2800, target: 2800, iaa: 0.71, goldAcc: 76.8 },
    training: { rmAccuracy: 75.4, policyImprovement: 3.1 },
    evaluation: { elo: 1213, eloDelta: 22, falseRefusal: 5.1, regression: "None detected" },
    duration: "10 days",
    cost: 1456,
    keyChange: "Separate helpfulness/safety RMs",
    notes: [
      "Adding preference strength signal improved RM accuracy by 4%",
    ],
  },
  {
    id: "iter-4",
    round: 4,
    status: "Active",
    strategy: {
      label: "Balanced helpfulness/safety collection",
      mix: [
        { label: "Helpfulness", pct: 60, color: "#005151" },
        { label: "Safety", pct: 30, color: "#D97706" },
        { label: "SFT", pct: 10, color: "#9CA3AF" },
      ],
    },
    model: {
      name: "claude-3.5-sonnet v2",
      health: "Up",
      temperature: 0.8,
      topP: 0.95,
    },
    cohort: { total: 24, avgTier: 2.3, returning: 18, new: 6 },
    collection: { current: 3000, target: 3500, iaa: 0.72, goldAcc: 79.5 },
    training: { rmAccuracy: 78.3, policyImprovement: 4.2 },
    evaluation: { elo: 1247, eloDelta: 34, falseRefusal: 4.2, regression: "None detected" },
    duration: "2 weeks",
    cost: 1680,
    keyChange: "Coverage-driven prompts",
    notes: [
      "Rotating 30% of annotator cohort increased prompt diversity but temporarily dropped IAA by 0.02",
      "Coverage-driven prompt allocation eliminated blind spots in math and safety",
    ],
  },
  {
    id: "iter-5",
    round: 5,
    status: "Planned",
    strategy: {
      label: "Planned: targeted weakness collection",
      mix: [
        { label: "Helpfulness", pct: 50, color: "#005151" },
        { label: "Safety", pct: 35, color: "#D97706" },
        { label: "SFT", pct: 15, color: "#9CA3AF" },
      ],
    },
    model: {
      name: "claude-3.5-sonnet v2",
      health: "Up",
      temperature: 0.8,
      topP: 0.95,
    },
    cohort: { total: 0, avgTier: 0, returning: 0, new: 0 },
    collection: { current: 0, target: 0, iaa: 0, goldAcc: 0 },
    training: { rmAccuracy: 0, policyImprovement: 0 },
    evaluation: { elo: 0, eloDelta: null, falseRefusal: 0, regression: "N/A" },
    duration: null,
    cost: null,
    keyChange: "Planned",
    notes: [],
  },
];
