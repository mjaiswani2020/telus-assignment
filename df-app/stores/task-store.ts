import { create } from 'zustand';
import { type Task, type TaskStatus, type TaskType, seedTasks } from '@/data/seed';

interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;

  // Selectors
  getTask: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByType: (type: TaskType) => Task[];
  getTasksByProject: (projectId: string) => Task[];
  getTasksByCampaign: (campaignId: string) => Task[];
  getTaskCounts: () => { total: number; active: number; draft: number; completed: number };

  // Actions
  selectTask: (id: string | null) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [...seedTasks],
  selectedTaskId: null,

  // Selectors
  getTask: (id) => get().tasks.find((t) => t.id === id),

  getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),

  getTasksByType: (type) => get().tasks.filter((t) => t.type === type),

  getTasksByProject: (projectId) =>
    get().tasks.filter((t) => t.projectId === projectId),

  getTasksByCampaign: (campaignId) =>
    get().tasks.filter((t) => t.campaignId === campaignId),

  getTaskCounts: () => {
    const tasks = get().tasks;
    return {
      total: tasks.length,
      active: tasks.filter((t) => t.status === 'Active').length,
      draft: tasks.filter((t) => t.status === 'Draft').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    };
  },

  // Actions
  selectTask: (id) => set({ selectedTaskId: id }),

  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedTaskId:
        state.selectedTaskId === id ? null : state.selectedTaskId,
    })),
}));
