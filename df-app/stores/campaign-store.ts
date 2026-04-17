import { create } from 'zustand';
import {
  type Campaign,
  type CampaignStatus,
  type Round,
  type RoundStatus,
  type PreferenceDistribution,
  type CrossRoundComparison,
  seedCampaigns,
  seedPreferenceDistribution,
  seedCrossRoundComparisons,
} from '@/data/seed';

interface CampaignStore {
  campaigns: Campaign[];
  preferenceDistribution: PreferenceDistribution;
  crossRoundComparisons: CrossRoundComparison[];
  selectedCampaignId: string | null;
  selectedRoundId: string | null;

  // Selectors
  getCampaign: (id: string) => Campaign | undefined;
  getCampaignsByProject: (projectId: string) => Campaign[];
  getCampaignsByStatus: (status: CampaignStatus) => Campaign[];
  getRound: (campaignId: string, roundId: string) => Round | undefined;
  getActiveRounds: (campaignId: string) => Round[];
  getRoundsByStatus: (campaignId: string, status: RoundStatus) => Round[];
  getRoundProgress: (campaignId: string, roundId: string) => number; // 0-100

  // Actions
  selectCampaign: (id: string | null) => void;
  selectRound: (id: string | null) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  addRound: (campaignId: string, round: Round) => void;
  updateRound: (campaignId: string, roundId: string, updates: Partial<Round>) => void;
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: [...seedCampaigns],
  preferenceDistribution: { ...seedPreferenceDistribution },
  crossRoundComparisons: [...seedCrossRoundComparisons],
  selectedCampaignId: null,
  selectedRoundId: null,

  // Selectors
  getCampaign: (id) => get().campaigns.find((c) => c.id === id),

  getCampaignsByProject: (projectId) =>
    get().campaigns.filter((c) => c.projectId === projectId),

  getCampaignsByStatus: (status) =>
    get().campaigns.filter((c) => c.status === status),

  getRound: (campaignId, roundId) => {
    const campaign = get().campaigns.find((c) => c.id === campaignId);
    return campaign?.rounds.find((r) => r.id === roundId);
  },

  getActiveRounds: (campaignId) => {
    const campaign = get().campaigns.find((c) => c.id === campaignId);
    return campaign?.rounds.filter((r) => r.status === 'Active') ?? [];
  },

  getRoundsByStatus: (campaignId, status) => {
    const campaign = get().campaigns.find((c) => c.id === campaignId);
    return campaign?.rounds.filter((r) => r.status === status) ?? [];
  },

  getRoundProgress: (campaignId, roundId) => {
    const round = get().getRound(campaignId, roundId);
    if (!round || round.target === 0) return 0;
    return Math.round((round.progress / round.target) * 100);
  },

  // Actions
  selectCampaign: (id) => set({ selectedCampaignId: id }),
  selectRound: (id) => set({ selectedRoundId: id }),

  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [...state.campaigns, campaign] })),

  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    })),

  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
      selectedCampaignId:
        state.selectedCampaignId === id ? null : state.selectedCampaignId,
    })),

  addRound: (campaignId, round) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === campaignId
          ? { ...c, rounds: [...c.rounds, round] }
          : c,
      ),
    })),

  updateRound: (campaignId, roundId, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              rounds: c.rounds.map((r) =>
                r.id === roundId ? { ...r, ...updates } : r,
              ),
            }
          : c,
      ),
    })),
}));
