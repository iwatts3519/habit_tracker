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

export const habitFrequencySchema = z.enum([
  "daily",
  "weekly",
  "specific_days",
  "custom",
]);

export type HabitFrequency = z.infer<typeof habitFrequencySchema>;

export const dayOfWeekSchema = z.enum([
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]);

export type DayOfWeek = z.infer<typeof dayOfWeekSchema>;

export const ALL_DAYS: DayOfWeek[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const frequencyDaysSchema = z.array(dayOfWeekSchema).max(7);

export const createHabitSchema = z
  .object({
    goal_id: z.string().min(1, "Goal ID is required"),
    name: z.string().min(1, "Name is required").max(200),
    description: z.string().max(2000).optional().default(""),
    frequency: habitFrequencySchema.optional().default("daily"),
    frequency_days: frequencyDaysSchema.optional().default([]),
    cue: z.string().max(500).optional().default(""),
    reward: z.string().max(500).optional().default(""),
  })
  .refine(
    (data) =>
      data.frequency !== "specific_days" || data.frequency_days.length > 0,
    { message: "Select at least one day", path: ["frequency_days"] }
  );

export const updateHabitSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    frequency: habitFrequencySchema.optional(),
    frequency_days: frequencyDaysSchema.optional(),
    cue: z.string().max(500).optional(),
    reward: z.string().max(500).optional(),
    sort_order: z.number().int().optional(),
  })
  .refine(
    (data) =>
      data.frequency !== "specific_days" ||
      !data.frequency_days ||
      data.frequency_days.length > 0,
    { message: "Select at least one day", path: ["frequency_days"] }
  );

export interface Habit {
  id: string;
  goal_id: string;
  name: string;
  description: string;
  frequency: string;
  frequency_days: string;
  cue: string;
  reward: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function parseFrequencyDays(habit: Habit): DayOfWeek[] {
  if (!habit.frequency_days) return [];
  try {
    return JSON.parse(habit.frequency_days) as DayOfWeek[];
  } catch {
    return [];
  }
}

export function dateToDayOfWeek(dateStr: string): DayOfWeek {
  const d = new Date(dateStr + "T00:00:00Z");
  const jsDay = d.getUTCDay();
  const map: DayOfWeek[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[jsDay];
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
