import { create } from 'zustand';
import { type Project, type ProjectStatus, seedProjects } from '@/data/seed';

interface ProjectStore {
  projects: Project[];
  selectedProjectId: string | null;

  // Selectors
  getProject: (id: string) => Project | undefined;
  getProjectsByStatus: (status: ProjectStatus) => Project[];

  // Actions
  selectProject: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [...seedProjects],
  selectedProjectId: null,

  getProject: (id) => get().projects.find((p) => p.id === id),
  getProjectsByStatus: (status) => get().projects.filter((p) => p.status === status),

  selectProject: (id) => set({ selectedProjectId: id }),

  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProjectId:
        state.selectedProjectId === id ? null : state.selectedProjectId,
    })),
}));
