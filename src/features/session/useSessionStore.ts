import { create } from 'zustand';
import type { Exercise } from '../../types';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,

  startSession: (exercises, startIndex) => {
    set({
      queue: exercises,
      currentIndex: startIndex >= 0 && startIndex < exercises.length ? startIndex : 0,
      isRunning: true,
      elapsed: 0,
    });
  },

  toggleRun: () => {
    const { currentIndex, queue } = get();
    if (currentIndex >= 0 && currentIndex < queue.length) {
      set((state) => ({ isRunning: !state.isRunning }));
    }
  },

  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex >= queue.length - 1) {
      set({ isRunning: false });
    } else {
      set({
        currentIndex: currentIndex + 1,
        elapsed: 0,
      });
    }
  },

  prev: () => {
    const { elapsed, currentIndex } = get();
    if (elapsed > 3) {
      set({ elapsed: 0 });
    } else if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        elapsed: 0,
      });
    } else {
      set({ elapsed: 0 });
    }
  },

  addToSession: (exercise) => {
    const { queue } = get();
    if (!queue.some((item) => item.id === exercise.id)) {
      set({ queue: [...queue, exercise] });
    }
  },

  tick: () => {
    const { currentIndex, queue, elapsed } = get();
    if (currentIndex < 0 || currentIndex >= queue.length) return;

    const currentExercise = queue[currentIndex];
    const nextElapsed = elapsed + 1;

    if (nextElapsed >= currentExercise.duration) {
      get().next();
    } else {
      set({ elapsed: nextElapsed });
    }
  },
}));