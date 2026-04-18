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
