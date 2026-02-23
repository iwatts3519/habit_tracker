import { z } from "zod";

// --- Goals ---

export const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().default(""),
  target_date: z.string().nullable().optional().default(null),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  target_date: z.string().nullable().optional(),
  sort_order: z.number().int().optional(),
});

export interface Goal {
  id: string;
  title: string;
  description: string;
  target_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// --- Habits ---

export const habitFrequencySchema = z.enum(["daily", "weekly", "custom"]);

export const createHabitSchema = z.object({
  goal_id: z.string().min(1, "Goal ID is required"),
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional().default(""),
  frequency: habitFrequencySchema.optional().default("daily"),
  cue: z.string().max(500).optional().default(""),
  reward: z.string().max(500).optional().default(""),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  frequency: habitFrequencySchema.optional(),
  cue: z.string().max(500).optional(),
  reward: z.string().max(500).optional(),
  sort_order: z.number().int().optional(),
});

export interface Habit {
  id: string;
  goal_id: string;
  name: string;
  description: string;
  frequency: string;
  cue: string;
  reward: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// --- Habit Completions ---

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
  created_at: string;
}

export interface HabitStreak {
  current: number;
  longest: number;
  totalCompletions: number;
  last7Days: number;
  last30Days: number;
}

// --- Conversations ---

export const createConversationSchema = z.object({
  title: z.string().min(1).max(200).optional().default("New Conversation"),
});

export const updateConversationSchema = z.object({
  title: z.string().min(1).max(200),
});

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// --- Messages ---

export const messageRoleSchema = z.enum(["user", "assistant"]);

export const createMessageSchema = z.object({
  role: messageRoleSchema,
  content: z.string().min(1, "Content is required"),
});

export interface Message {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}
