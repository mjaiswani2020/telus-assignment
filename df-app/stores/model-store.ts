import { create } from 'zustand';
import {
  type ModelEndpoint,
  type ModelHealth,
  seedModelEndpoints,
} from '@/data/seed';

export interface DeploymentConfig {
  temperature: number;
  topP: number;
  maxTokens: number;
  responsePairs: 2 | 4 | 6;
  gpuAllocation: string;
  gpuUtilization: number;
  systemPrompt: string;
}

export interface ABTest {
  name: string;
  status: 'Active' | 'Paused' | 'Complete';
  modelA: string;
  modelB: string;
  splitA: number;
  splitB: number;
  metrics: { label: string; modelA: string; modelB: string }[];
  runningDays: number;
}

export interface SwapHistoryEntry {
  date: string;
  from: string;
  to: string;
  type: 'scheduled' | 'manual';
}

export interface ScheduledSwap {
  from: string;
  to: string;
  scheduledAt: string;
  activeSessions: number;
}

export interface LatencyPercentiles {
  endpointName: string;
  p50: number;
  p95: number;
  p99: number;
}

export interface CacheMetrics {
  hitRate: number;
  avgWaitTime: number;
  preGenerated: number;
  pendingQueue: number;
}

interface ModelStore {
  endpoints: ModelEndpoint[];
  selectedEndpointId: string | null;

  // Deployment config (per first endpoint)
  deploymentConfig: DeploymentConfig;

  // A/B Testing
  abTest: ABTest;

  // Hot-Swap
  scheduledSwap: ScheduledSwap;
  swapHistory: SwapHistoryEntry[];

  // Latency & Caching
  latencyPercentiles: LatencyPercentiles[];
  cacheMetrics: CacheMetrics;

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
  updateDeploymentConfig: (updates: Partial<DeploymentConfig>) => void;
}

export const useModelStore = create<ModelStore>((set, get) => ({
  endpoints: [...seedModelEndpoints],
  selectedEndpointId: null,

  deploymentConfig: {
    temperature: 0.8,
    topP: 0.95,
    maxTokens: 4096,
    responsePairs: 2,
    gpuAllocation: '2x A100',
    gpuUtilization: 73,
    systemPrompt: 'You are a helpful assistant. Follow the user instructions carefully and provide accurate, well-structured responses.',
  },

  abTest: {
    name: 'claude-3.5-sonnet vs. llama-3-70b',
    status: 'Active',
    modelA: 'claude-3.5-sonnet',
    modelB: 'llama-3-70b',
    splitA: 50,
    splitB: 50,
    metrics: [
      { label: 'Avg Latency', modelA: '3.2s', modelB: '4.8s' },
      { label: 'Preference Rate', modelA: '62%', modelB: '38%' },
      { label: 'Error Rate', modelA: '0.1%', modelB: '0.3%' },
    ],
    runningDays: 5,
  },

  scheduledSwap: {
    from: 'claude-3.5-sonnet-v1',
    to: 'v2',
    scheduledAt: 'Apr 20 at 02:00 UTC',
    activeSessions: 3,
  },

  swapHistory: [
    { date: 'Apr 15', from: 'v0.9', to: 'v1.0', type: 'scheduled' },
    { date: 'Apr 8', from: 'v0.8', to: 'v0.9', type: 'manual' },
    { date: 'Apr 1', from: 'v0.7', to: 'v0.8', type: 'scheduled' },
  ],

  latencyPercentiles: [
    { endpointName: 'Llama-3-70B', p50: 2.1, p95: 3.8, p99: 6.2 },
    { endpointName: 'GPT-4-Turbo', p50: 3.4, p95: 5.1, p99: 8.7 },
    { endpointName: 'Llama-3-13B', p50: 1.8, p95: 2.9, p99: 4.1 },
  ],

  cacheMetrics: {
    hitRate: 67,
    avgWaitTime: 4.2,
    preGenerated: 248,
    pendingQueue: 52,
  },

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

  updateDeploymentConfig: (updates) =>
    set((state) => ({
      deploymentConfig: { ...state.deploymentConfig, ...updates },
    })),
}));
