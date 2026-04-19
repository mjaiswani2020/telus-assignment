import { create } from 'zustand';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

interface SessionStore {
  sessionAnnotations: number;
  goldCorrect: number;
  goldTotal: number;
  avgTimeSeconds: number;
  streak: number;
  teamAvgGoldAccuracy: number;
  teamAvgIAA: number;
  showCalibrationNudge: boolean;
  calibrationMessage: string;
  currentDifficulty: Difficulty;

  // Computed selectors
  getGoldAccuracy: () => number;
  getGoldAccuracyPercent: () => number;

  // Actions
  recordAnnotation: () => void;
  recordGoldResult: (correct: boolean) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  dismissCalibrationNudge: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessionAnnotations: 47,
  goldCorrect: 8,
  goldTotal: 10,
  avgTimeSeconds: 94,
  streak: 5,
  teamAvgGoldAccuracy: 0.78,
  teamAvgIAA: 0.72,
  showCalibrationNudge: true,
  calibrationMessage:
    'Your safety task accuracy dropped to 65%. Review the guidelines for borderline cases.',
  currentDifficulty: 'Medium',

  getGoldAccuracy: () => {
    const { goldCorrect, goldTotal } = get();
    if (goldTotal === 0) return 0;
    return goldCorrect / goldTotal;
  },

  getGoldAccuracyPercent: () => {
    const { goldCorrect, goldTotal } = get();
    if (goldTotal === 0) return 0;
    return Math.round((goldCorrect / goldTotal) * 100);
  },

  recordAnnotation: () =>
    set((state) => ({
      sessionAnnotations: state.sessionAnnotations + 1,
      streak: state.streak + 1,
    })),

  recordGoldResult: (correct) =>
    set((state) => {
      const newCorrect = state.goldCorrect + (correct ? 1 : 0);
      const newTotal = state.goldTotal + 1;
      const accuracy = newTotal > 0 ? newCorrect / newTotal : 0;

      return {
        goldCorrect: newCorrect,
        goldTotal: newTotal,
        showCalibrationNudge: accuracy < 0.7,
        calibrationMessage:
          accuracy < 0.7
            ? `Your accuracy dropped to ${Math.round(accuracy * 100)}%. Review the guidelines for borderline cases.`
            : state.calibrationMessage,
      };
    }),

  setDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),

  dismissCalibrationNudge: () => set({ showCalibrationNudge: false }),

  resetSession: () =>
    set({
      sessionAnnotations: 0,
      goldCorrect: 0,
      goldTotal: 0,
      avgTimeSeconds: 0,
      streak: 0,
      showCalibrationNudge: false,
      calibrationMessage: '',
    }),
}));

export type { Difficulty };
