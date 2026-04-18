// ---------------------------------------------------------------------------
// Prompt Coverage Dashboard — Seed data for prompt sourcing & distribution
// ---------------------------------------------------------------------------

export interface PromptCategory {
  name: string;
  count: number;
  percentage: number;
  target: number;
  meetsTarget: boolean;
}

export interface CoverageGap {
  category: string;
  current: number;
  target: number;
  additional: number;
}

export interface PromptSource {
  name: string;
  count: number;
  percentage: number;
}

export interface QualityGate {
  label: string;
  count: number;
  variant: 'success' | 'caution' | 'error';
}

export interface DiversityTrend {
  iteration: string;
  score: number;
}

// --- KPI data ---
export const promptKpis = {
  totalPrompts: 4280,
  humanWritten: 2640,
  humanPercent: 62,
  synthetic: 1640,
  syntheticPercent: 38,
  coverageScore: 78,
};

// --- Topic distribution (10 categories) ---
export const promptCategories: PromptCategory[] = [
  { name: 'General Knowledge', count: 820, percentage: 19, target: 15, meetsTarget: true },
  { name: 'Mathematics', count: 540, percentage: 13, target: 12, meetsTarget: true },
  { name: 'Coding', count: 680, percentage: 16, target: 15, meetsTarget: true },
  { name: 'Creative Writing', count: 460, percentage: 11, target: 10, meetsTarget: true },
  { name: 'Safety/Ethics', count: 420, percentage: 10, target: 12, meetsTarget: false },
  { name: 'Medical', count: 45, percentage: 1, target: 5, meetsTarget: false },
  { name: 'Legal', count: 65, percentage: 2, target: 5, meetsTarget: false },
  { name: 'Multi-lingual', count: 130, percentage: 3, target: 15, meetsTarget: false },
  { name: 'Multi-turn', count: 520, percentage: 12, target: 10, meetsTarget: true },
  { name: 'Adversarial', count: 340, percentage: 8, target: 12, meetsTarget: false },
];

// --- Coverage gap alerts ---
export const coverageGaps: CoverageGap[] = [
  { category: 'Multi-lingual', current: 3, target: 15, additional: 480 },
  { category: 'Medical', current: 1, target: 5, additional: 170 },
  { category: 'Legal', current: 2, target: 5, additional: 130 },
  { category: 'Adversarial/red-team', current: 8, target: 12, additional: 160 },
];

// --- Source breakdown ---
export const promptSources: PromptSource[] = [
  { name: 'Human MTurk', count: 1680, percentage: 39 },
  { name: 'Human Expert', count: 960, percentage: 22 },
  { name: 'Synthetic GPT-4', count: 1020, percentage: 24 },
  { name: 'Synthetic Few-shot', count: 620, percentage: 15 },
];

// --- Quality gate ---
export const qualityGates: QualityGate[] = [
  { label: 'Approved', count: 3890, variant: 'success' },
  { label: 'Pending Review', count: 240, variant: 'caution' },
  { label: 'Rejected', count: 150, variant: 'error' },
];

// --- Diversity score trend ---
export const diversityTrend: DiversityTrend[] = [
  { iteration: 'Iter 1', score: 62 },
  { iteration: 'Iter 2', score: 68 },
  { iteration: 'Iter 3', score: 71 },
  { iteration: 'Iter 4', score: 75 },
  { iteration: 'Iter 5', score: 78 },
];
