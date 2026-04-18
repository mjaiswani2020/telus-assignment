import { create } from "zustand";
import { type Iteration, seedIterations } from "@/data/iteration-seed";

interface IterationStore {
  iterations: Iteration[];
  selectedIterationId: string;

  // Selectors
  getIteration: (id: string) => Iteration | undefined;
  getSelectedIteration: () => Iteration | undefined;

  // Actions
  selectIteration: (id: string) => void;
}

export const useIterationStore = create<IterationStore>((set, get) => ({
  iterations: [...seedIterations],
  selectedIterationId: "iter-4", // Default to the active round

  getIteration: (id) => get().iterations.find((i) => i.id === id),

  getSelectedIteration: () =>
    get().iterations.find((i) => i.id === get().selectedIterationId),

  selectIteration: (id) => set({ selectedIterationId: id }),
}));
