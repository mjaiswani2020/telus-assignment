import { create } from 'zustand';
import {
  type ExportRecord,
  type ExportFormat,
  type ExportDestination,
  type ExportStatus,
  seedExports,
} from '@/data/seed';

interface ExportStore {
  exports: ExportRecord[];
  selectedExportId: string | null;

  // Selectors
  getExport: (id: string) => ExportRecord | undefined;
  getExportsByFormat: (format: ExportFormat) => ExportRecord[];
  getExportsByDestination: (dest: ExportDestination) => ExportRecord[];
  getExportsByCampaign: (campaignId: string) => ExportRecord[];
  getExportsByStatus: (status: ExportStatus) => ExportRecord[];
  getLatestExport: () => ExportRecord | undefined;

  // Actions
  selectExport: (id: string | null) => void;
  createExport: (params: {
    format: ExportFormat;
    destination: ExportDestination;
    campaignId: string;
    campaignName: string;
    recordCount: number;
    createdBy: string;
  }) => void;
  deleteExport: (id: string) => void;
}

export const useExportStore = create<ExportStore>((set, get) => ({
  exports: [...seedExports],
  selectedExportId: null,

  // Selectors
  getExport: (id) => get().exports.find((e) => e.id === id),

  getExportsByFormat: (format) =>
    get().exports.filter((e) => e.format === format),

  getExportsByDestination: (dest) =>
    get().exports.filter((e) => e.destination === dest),

  getExportsByCampaign: (campaignId) =>
    get().exports.filter((e) => e.campaignId === campaignId),

  getExportsByStatus: (status) =>
    get().exports.filter((e) => e.status === status),

  getLatestExport: () => {
    const sorted = [...get().exports].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sorted[0];
  },

  // Actions
  selectExport: (id) => set({ selectedExportId: id }),

  createExport: (params) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '.');
    const existing = get().exports.filter((e) =>
      e.version.startsWith(`v${dateStr}`),
    );
    const seq = String(existing.length + 1).padStart(3, '0');

    const newExport: ExportRecord = {
      id: `exp-${Date.now()}`,
      version: `v${dateStr}.${seq}`,
      format: params.format,
      destination: params.destination,
      status: 'In Progress',
      recordCount: params.recordCount,
      fileSize: 'Calculating...',
      campaignId: params.campaignId,
      campaignName: params.campaignName,
      createdAt: now.toISOString(),
      createdBy: params.createdBy,
    };

    set((state) => ({ exports: [newExport, ...state.exports] }));
  },

  deleteExport: (id) =>
    set((state) => ({
      exports: state.exports.filter((e) => e.id !== id),
      selectedExportId:
        state.selectedExportId === id ? null : state.selectedExportId,
    })),
}));
