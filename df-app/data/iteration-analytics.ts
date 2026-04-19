// ---------------------------------------------------------------------------
// Cross-Iteration Analytics — Seed data for iteration metrics & signal degradation
// ---------------------------------------------------------------------------

export interface IterationMetric {
  round: string;
  duration: string;
  annotations: number;
  iaa: number;
  rmAccuracy: number;
  goldAccuracy: number;
  costPerAnnotation: number;
  keyChange: string;
}

export interface SignalDegradationPoint {
  round: string;
  significantlyBetter: number;
  better: number;
  slightlyBetter: number;
  negligible: number;
}

export const iterationMetrics: IterationMetric[] = [
  { round: 'Round 1', duration: '2 weeks', annotations: 2400, iaa: 0.63, rmAccuracy: 68.2, goldAccuracy: 71.5, costPerAnnotation: 0.48, keyChange: 'Initial baseline' },
  { round: 'Round 2', duration: '2 weeks', annotations: 3100, iaa: 0.67, rmAccuracy: 72.1, goldAccuracy: 74.8, costPerAnnotation: 0.51, keyChange: 'Added preference strength signal' },
  { round: 'Round 3', duration: '10 days', annotations: 2800, iaa: 0.71, rmAccuracy: 75.4, goldAccuracy: 78.2, costPerAnnotation: 0.52, keyChange: 'Separate helpfulness/safety RMs' },
  { round: 'Round 4', duration: '2 weeks', annotations: 3400, iaa: 0.69, rmAccuracy: 76.8, goldAccuracy: 76.1, costPerAnnotation: 0.54, keyChange: 'Rotated annotator cohort' },
  { round: 'Round 5', duration: '12 days', annotations: 3000, iaa: 0.72, rmAccuracy: 78.3, goldAccuracy: 79.5, costPerAnnotation: 0.56, keyChange: 'Coverage-driven prompt allocation' },
];

export const signalDegradation: SignalDegradationPoint[] = [
  { round: 'Round 1', significantlyBetter: 42, better: 30, slightlyBetter: 16, negligible: 12 },
  { round: 'Round 2', significantlyBetter: 35, better: 28, slightlyBetter: 20, negligible: 17 },
  { round: 'Round 3', significantlyBetter: 28, better: 27, slightlyBetter: 23, negligible: 22 },
  { round: 'Round 4', significantlyBetter: 22, better: 25, slightlyBetter: 25, negligible: 28 },
  { round: 'Round 5', significantlyBetter: 18, better: 23, slightlyBetter: 25, negligible: 34 },
];

// Metric key union for the toggle buttons
export type IterationMetricKey = 'rmAccuracy' | 'iaa' | 'goldAccuracy' | 'annotations' | 'costPerAnnotation';

export const metricToggleOptions: { key: IterationMetricKey; label: string }[] = [
  { key: 'rmAccuracy', label: 'RM Accuracy' },
  { key: 'iaa', label: 'IAA' },
  { key: 'goldAccuracy', label: 'Gold Accuracy' },
  { key: 'annotations', label: 'Volume' },
  { key: 'costPerAnnotation', label: 'Cost/Annotation' },
];

// Playbook recommendations for Round 6
export const playbookRecommendations: string[] = [
  'Increase safety prompt ratio from 20% to 35% — safety RM accuracy lags helpfulness by 8 points',
  'Rotate 30% of annotator cohort — fatigue signals detected in 4 annotators with >2000 annotations',
  'Include top 15% annotations from Rounds 3-5 in training mix — prevents capability regression',
  'Deploy model v3.2 alongside v3.1 at temperature 0.9 — increase response diversity',
];

// ---------------------------------------------------------------------------
// Unit 19: Training Results & Cost Analytics
// ---------------------------------------------------------------------------

export interface RegressionItem {
  area: string;
  status: 'passed' | 'regressed';
  delta?: number;
}

export const trainingResults = {
  helpfulnessRM: 78.3,
  helpfulnessTarget: 82,
  safetyRM: 74.1,
  safetyTarget: 80,
  falseRefusalRate: 4.2,
  priorFalseRefusalRate: 7.8,
  regressions: [
    { area: 'Math reasoning', status: 'passed' as const },
    { area: 'Code generation', status: 'passed' as const },
    { area: 'Creative writing', status: 'regressed' as const, delta: -2.1 },
  ] satisfies RegressionItem[],
};

export const rmAccuracyTrend = [
  { round: 'R1', helpfulness: 65.2, safety: 58.4 },
  { round: 'R2', helpfulness: 69.8, safety: 63.1 },
  { round: 'R3', helpfulness: 73.5, safety: 67.9 },
  { round: 'R4', helpfulness: 76.1, safety: 71.2 },
  { round: 'R5', helpfulness: 78.3, safety: 74.1 },
];

export interface EloRankingRow {
  model: string;
  elo: number;
  delta: number;
  winRate: number;
  matches: number;
}

export const eloRankings: EloRankingRow[] = [
  { model: 'Round 5 Model', elo: 1247, delta: 34, winRate: 64, matches: 420 },
  { model: 'Round 4 Model', elo: 1213, delta: 22, winRate: 58, matches: 380 },
  { model: 'Round 3 Model', elo: 1191, delta: 18, winRate: 55, matches: 350 },
  { model: 'Baseline', elo: 1100, delta: 0, winRate: 42, matches: 520 },
];

export const costMetrics = {
  costPerAnnotation: 0.52,
  costPerRMPercent: 4200,
  totalIterationCost: 28400,
  roiScore: 2.3,
  trend: [
    { round: 'Round 1', costPerPercent: 1800 },
    { round: 'Round 2', costPerPercent: 2400 },
    { round: 'Round 3', costPerPercent: 3100 },
    { round: 'Round 4', costPerPercent: 3600 },
    { round: 'Round 5', costPerPercent: 4200 },
  ],
};
