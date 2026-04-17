import { create } from 'zustand';
import {
  type ReviewItem,
  type ReviewItemSource,
  type ReviewItemStatus,
  seedReviewItems,
} from '@/data/seed';

interface ReviewStore {
  items: ReviewItem[];
  selectedItemId: string | null;

  // Selectors
  getItem: (id: string) => ReviewItem | undefined;
  getItemsByStatus: (status: ReviewItemStatus) => ReviewItem[];
  getItemsBySource: (source: ReviewItemSource) => ReviewItem[];
  getFlaggedByAnnotator: () => ReviewItem[];
  getAutoFlagged: () => ReviewItem[];
  getEscalated: () => ReviewItem[];
  getResolvedToday: () => ReviewItem[];
  getQueueCounts: () => {
    total: number;
    flaggedByAnnotator: number;
    autoFlagged: number;
    escalated: number;
    resolvedToday: number;
  };

  // Actions
  selectItem: (id: string | null) => void;
  approve: (id: string) => void;
  reject: (id: string) => void;
  reassign: (id: string, annotatorName: string) => void;
  escalate: (id: string) => void;
  addItem: (item: ReviewItem) => void;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  items: [...seedReviewItems],
  selectedItemId: null,

  // Selectors
  getItem: (id) => get().items.find((i) => i.id === id),

  getItemsByStatus: (status) => get().items.filter((i) => i.status === status),

  getItemsBySource: (source) => get().items.filter((i) => i.source === source),

  getFlaggedByAnnotator: () =>
    get().items.filter((i) => i.source === 'Annotator' && i.status === 'Flagged'),

  getAutoFlagged: () =>
    get().items.filter((i) => i.source === 'Auto' && i.status === 'Flagged'),

  getEscalated: () => get().items.filter((i) => i.status === 'Escalated'),

  getResolvedToday: () => {
    const todayPrefix = '2026-04-17'; // mock "today"
    const yesterday = '2026-04-16';
    return get().items.filter(
      (i) =>
        i.status === 'Resolved' &&
        (i.flaggedAt.startsWith(todayPrefix) || i.flaggedAt.startsWith(yesterday)),
    );
  },

  getQueueCounts: () => {
    const state = get();
    return {
      total: state.items.filter((i) => i.status === 'Flagged').length,
      flaggedByAnnotator: state.getFlaggedByAnnotator().length,
      autoFlagged: state.getAutoFlagged().length,
      escalated: state.getEscalated().length,
      resolvedToday: state.getResolvedToday().length,
    };
  },

  // Actions
  selectItem: (id) => set({ selectedItemId: id }),

  approve: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, status: 'Resolved' as ReviewItemStatus } : i,
      ),
    })),

  reject: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, status: 'Resolved' as ReviewItemStatus } : i,
      ),
    })),

  reassign: (id, annotatorName) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? {
              ...i,
              description: `${i.description}\n[Reassigned to ${annotatorName}]`,
            }
          : i,
      ),
    })),

  escalate: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? { ...i, status: 'Escalated' as ReviewItemStatus, priority: 'High' as const }
          : i,
      ),
    })),

  addItem: (item) =>
    set((state) => ({ items: [item, ...state.items] })),
}));
