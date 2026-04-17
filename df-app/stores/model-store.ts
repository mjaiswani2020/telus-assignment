import { create } from 'zustand';
import {
  type ModelEndpoint,
  type ModelHealth,
  seedModelEndpoints,
} from '@/data/seed';

interface ModelStore {
  endpoints: ModelEndpoint[];
  selectedEndpointId: string | null;

  // Selectors
  getEndpoint: (id: string) => ModelEndpoint | undefined;
  getEndpointsByHealth: (health: ModelHealth) => ModelEndpoint[];
  getEndpointsByProvider: (provider: string) => ModelEndpoint[];
  getHealthySummary: () => {
    total: number;
    up: number;
    slow: number;
    down: number;
  };

  // Actions
  selectEndpoint: (id: string | null) => void;
  addEndpoint: (endpoint: ModelEndpoint) => void;
  updateEndpoint: (id: string, updates: Partial<ModelEndpoint>) => void;
  removeEndpoint: (id: string) => void;
  refreshHealth: (id: string, health: ModelHealth, latencyMs: number) => void;
}

export const useModelStore = create<ModelStore>((set, get) => ({
  endpoints: [...seedModelEndpoints],
  selectedEndpointId: null,

  // Selectors
  getEndpoint: (id) => get().endpoints.find((e) => e.id === id),

  getEndpointsByHealth: (health) =>
    get().endpoints.filter((e) => e.health === health),

  getEndpointsByProvider: (provider) =>
    get().endpoints.filter((e) => e.provider === provider),

  getHealthySummary: () => {
    const endpoints = get().endpoints;
    return {
      total: endpoints.length,
      up: endpoints.filter((e) => e.health === 'Up').length,
      slow: endpoints.filter((e) => e.health === 'Slow').length,
      down: endpoints.filter((e) => e.health === 'Down').length,
    };
  },

  // Actions
  selectEndpoint: (id) => set({ selectedEndpointId: id }),

  addEndpoint: (endpoint) =>
    set((state) => ({ endpoints: [...state.endpoints, endpoint] })),

  updateEndpoint: (id, updates) =>
    set((state) => ({
      endpoints: state.endpoints.map((e) =>
        e.id === id ? { ...e, ...updates } : e,
      ),
    })),

  removeEndpoint: (id) =>
    set((state) => ({
      endpoints: state.endpoints.filter((e) => e.id !== id),
      selectedEndpointId:
        state.selectedEndpointId === id ? null : state.selectedEndpointId,
    })),

  refreshHealth: (id, health, latencyMs) =>
    set((state) => ({
      endpoints: state.endpoints.map((e) =>
        e.id === id
          ? { ...e, health, latencyMs, lastChecked: new Date().toISOString() }
          : e,
      ),
    })),
}));
