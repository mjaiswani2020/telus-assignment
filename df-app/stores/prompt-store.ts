import { create } from 'zustand';
import {
  type PromptCategory,
  type CoverageGap,
  type PromptSource,
  type QualityGate,
  type DiversityTrend,
  promptKpis,
  promptCategories,
  coverageGaps,
  promptSources,
  qualityGates,
  diversityTrend,
} from '@/data/prompt-seed';

interface PromptStore {
  // KPIs
  totalPrompts: number;
  humanWritten: number;
  humanPercent: number;
  synthetic: number;
  syntheticPercent: number;
  coverageScore: number;

  // Data
  categories: PromptCategory[];
  gaps: CoverageGap[];
  sources: PromptSource[];
  quality: QualityGate[];
  trend: DiversityTrend[];

  // Selectors
  getCategoriesAboveTarget: () => PromptCategory[];
  getCategoriesBelowTarget: () => PromptCategory[];
  getTotalGapCount: () => number;
}

export const usePromptStore = create<PromptStore>((set, get) => ({
  // KPIs
  totalPrompts: promptKpis.totalPrompts,
  humanWritten: promptKpis.humanWritten,
  humanPercent: promptKpis.humanPercent,
  synthetic: promptKpis.synthetic,
  syntheticPercent: promptKpis.syntheticPercent,
  coverageScore: promptKpis.coverageScore,

  // Data
  categories: [...promptCategories],
  gaps: [...coverageGaps],
  sources: [...promptSources],
  quality: [...qualityGates],
  trend: [...diversityTrend],

  // Selectors
  getCategoriesAboveTarget: () =>
    get().categories.filter((c) => c.meetsTarget),

  getCategoriesBelowTarget: () =>
    get().categories.filter((c) => !c.meetsTarget),

  getTotalGapCount: () =>
    get().gaps.reduce((sum, g) => sum + g.additional, 0),
}));
