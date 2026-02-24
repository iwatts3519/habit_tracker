"use client";

import { create } from "zustand";
import type { Goal, Habit, HabitCompletion, HabitStreak } from "@/types";

interface GoalsState {
  goals: Goal[];
  habits: Habit[];
  completions: Record<string, HabitCompletion[]>;
  streaks: Record<string, HabitStreak>;
  isLoading: boolean;
  error: string | null;

  fetchGoals: () => Promise<void>;
  fetchHabits: () => Promise<void>;
  fetchCompletions: (habitId: string) => Promise<void>;
  toggleCompletion: (habitId: string, date: string) => Promise<void>;

  addGoal: (data: {
    title: string;
    description?: string;
    target_date?: string | null;
  }) => Promise<Goal>;
  updateGoal: (
    id: string,
    data: { title?: string; description?: string; target_date?: string | null }
  ) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  addHabit: (data: {
    goal_id: string;
    name: string;
    description?: string;
    frequency?: string;
    frequency_days?: string[];
    cue?: string;
    reward?: string;
  }) => Promise<Habit>;
  updateHabit: (
    id: string,
    data: {
      name?: string;
      description?: string;
      frequency?: string;
      frequency_days?: string[];
      cue?: string;
      reward?: string;
    }
  ) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;

  clearError: () => void;
}

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  habits: [],
  completions: {},
  streaks: {},
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await apiFetch<Goal[]>("/api/goals");
      set({ goals, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch goals",
        isLoading: false,
      });
    }
  },

  fetchHabits: async () => {
    try {
      const habits = await apiFetch<Habit[]>("/api/habits");
      set({ habits });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch habits",
      });
    }
  },

  addGoal: async (data) => {
    const goal = await apiFetch<Goal>("/api/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
    set((state) => ({ goals: [...state.goals, goal] }));
    return goal;
  },

  updateGoal: async (id, data) => {
    const prev = get().goals;
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
    }));
    try {
      const updated = await apiFetch<Goal>(`/api/goals/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updated : g)),
      }));
    } catch (err) {
      set({
        goals: prev,
        error: err instanceof Error ? err.message : "Failed to update goal",
      });
    }
  },

  deleteGoal: async (id) => {
    const prev = get().goals;
    const prevHabits = get().habits;
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
      habits: state.habits.filter((h) => h.goal_id !== id),
    }));
    try {
      await apiFetch(`/api/goals/${id}`, { method: "DELETE" });
    } catch (err) {
      set({
        goals: prev,
        habits: prevHabits,
        error: err instanceof Error ? err.message : "Failed to delete goal",
      });
    }
  },

  addHabit: async (data) => {
    const habit = await apiFetch<Habit>("/api/habits", {
      method: "POST",
      body: JSON.stringify(data),
    });
    set((state) => ({ habits: [...state.habits, habit] }));
    return habit;
  },

  updateHabit: async (id, data) => {
    const prev = get().habits;
    const { frequency_days, ...rest } = data;
    const optimistic: Partial<Habit> = {
      ...rest,
      ...(frequency_days !== undefined
        ? { frequency_days: JSON.stringify(frequency_days) }
        : {}),
    };
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, ...optimistic } : h
      ),
    }));
    try {
      const updated = await apiFetch<Habit>(`/api/habits/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? updated : h)),
      }));
    } catch (err) {
      set({
        habits: prev,
        error: err instanceof Error ? err.message : "Failed to update habit",
      });
    }
  },

  deleteHabit: async (id) => {
    const prev = get().habits;
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    }));
    try {
      await apiFetch(`/api/habits/${id}`, { method: "DELETE" });
    } catch (err) {
      set({
        habits: prev,
        error: err instanceof Error ? err.message : "Failed to delete habit",
      });
    }
  },

  fetchCompletions: async (habitId) => {
    try {
      const data = await apiFetch<{
        completions: HabitCompletion[];
        streak: HabitStreak;
      }>(`/api/habits/${habitId}/completions?days=90`);
      set((state) => ({
        completions: { ...state.completions, [habitId]: data.completions },
        streaks: { ...state.streaks, [habitId]: data.streak },
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to fetch completions",
      });
    }
  },

  toggleCompletion: async (habitId, date) => {
    try {
      const data = await apiFetch<{
        completed: boolean;
        streak: HabitStreak;
      }>(`/api/habits/${habitId}/completions`, {
        method: "POST",
        body: JSON.stringify({ date }),
      });

      set((state) => {
        const prev = state.completions[habitId] ?? [];
        const newCompletions = data.completed
          ? [
              ...prev,
              {
                id: `temp-${Date.now()}`,
                habit_id: habitId,
                completed_date: date,
                created_at: new Date().toISOString(),
              },
            ]
          : prev.filter((c) => c.completed_date !== date);

        return {
          completions: { ...state.completions, [habitId]: newCompletions },
          streaks: { ...state.streaks, [habitId]: data.streak },
        };
      });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to toggle completion",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
