import { create } from 'zustand';
import {
  type Annotator,
  type AnnotatorStatus,
  type AnnotatorTrend,
  seedAnnotators,
} from '@/data/seed';

interface AnnotatorStore {
  annotators: Annotator[];
  selectedAnnotatorId: string | null;

  // Selectors
  getAnnotator: (id: string) => Annotator | undefined;
  getAnnotatorsByStatus: (status: AnnotatorStatus) => Annotator[];
  getAnnotatorsBySkill: (skill: string) => Annotator[];
  getAnnotatorsByTrend: (trend: AnnotatorTrend) => Annotator[];
  getStatusCounts: () => Record<AnnotatorStatus, number>;
  getAtRiskAnnotators: () => Annotator[];

  // Actions
  selectAnnotator: (id: string | null) => void;
  addAnnotator: (annotator: Annotator) => void;
  updateAnnotator: (id: string, updates: Partial<Annotator>) => void;
  removeAnnotator: (id: string) => void;
  updateStatus: (id: string, status: AnnotatorStatus) => void;
}

export const useAnnotatorStore = create<AnnotatorStore>((set, get) => ({
  annotators: [...seedAnnotators],
  selectedAnnotatorId: null,

  // Selectors
  getAnnotator: (id) => get().annotators.find((a) => a.id === id),

  getAnnotatorsByStatus: (status) =>
    get().annotators.filter((a) => a.status === status),

  getAnnotatorsBySkill: (skill) =>
    get().annotators.filter((a) => a.skills.includes(skill)),

  getAnnotatorsByTrend: (trend) =>
    get().annotators.filter((a) => a.trend === trend),

  getStatusCounts: () => {
    const annotators = get().annotators;
    return {
      Active: annotators.filter((a) => a.status === 'Active').length,
      'In Review': annotators.filter((a) => a.status === 'In Review').length,
      Onboarding: annotators.filter((a) => a.status === 'Onboarding').length,
      Paused: annotators.filter((a) => a.status === 'Paused').length,
    };
  },

  getAtRiskAnnotators: () =>
    get().annotators.filter(
      (a) => a.trend === 'Declining' || a.goldAccuracy < 65 || a.iaa < 0.65,
    ),

  // Actions
  selectAnnotator: (id) => set({ selectedAnnotatorId: id }),

  addAnnotator: (annotator) =>
    set((state) => ({ annotators: [...state.annotators, annotator] })),

  updateAnnotator: (id, updates) =>
    set((state) => ({
      annotators: state.annotators.map((a) =>
        a.id === id ? { ...a, ...updates } : a,
      ),
    })),

  removeAnnotator: (id) =>
    set((state) => ({
      annotators: state.annotators.filter((a) => a.id !== id),
      selectedAnnotatorId:
        state.selectedAnnotatorId === id ? null : state.selectedAnnotatorId,
    })),

  updateStatus: (id, status) =>
    set((state) => ({
      annotators: state.annotators.map((a) =>
        a.id === id ? { ...a, status } : a,
      ),
    })),
}));
