import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { dateToDayOfWeek } from "@/types";
import type { HabitCompletion, HabitStreak, Habit, DayOfWeek } from "@/types";

export function getCompletionsByHabitId(
  habitId: string,
  days?: number
): HabitCompletion[] {
  const db = getDb();
  if (days) {
    return db
      .prepare(
        `SELECT * FROM habit_completions
         WHERE habit_id = ? AND completed_date >= date('now', ?)
         ORDER BY completed_date DESC`
      )
      .all(habitId, `-${days} days`) as HabitCompletion[];
  }
  return db
    .prepare(
      "SELECT * FROM habit_completions WHERE habit_id = ? ORDER BY completed_date DESC"
    )
    .all(habitId) as HabitCompletion[];
}

export function getCompletionsForDate(date: string): HabitCompletion[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM habit_completions WHERE completed_date = ?")
    .all(date) as HabitCompletion[];
}

export function toggleCompletion(
  habitId: string,
  date: string
): { completed: boolean } {
  const db = getDb();

  const today = new Date().toISOString().split("T")[0];
  if (date > today) {
    throw new Error("Cannot complete habits for future dates");
  }

  const existing = db
    .prepare(
      "SELECT id FROM habit_completions WHERE habit_id = ? AND completed_date = ?"
    )
    .get(habitId, date) as { id: string } | undefined;

  if (existing) {
    db.prepare("DELETE FROM habit_completions WHERE id = ?").run(existing.id);
    return { completed: false };
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO habit_completions (id, habit_id, completed_date, created_at) VALUES (?, ?, ?, ?)"
  ).run(id, habitId, date, now);

  return { completed: true };
}

function isScheduledDay(
  dateStr: string,
  frequency: string,
  scheduledDays: DayOfWeek[]
): boolean {
  if (frequency !== "specific_days" || scheduledDays.length === 0) return true;
  return scheduledDays.includes(dateToDayOfWeek(dateStr));
}

function getHabitFrequencyInfo(habitId: string): {
  frequency: string;
  scheduledDays: DayOfWeek[];
} {
  const db = getDb();
  const habit = db
    .prepare("SELECT frequency, frequency_days FROM habits WHERE id = ?")
    .get(habitId) as Pick<Habit, "frequency" | "frequency_days"> | undefined;

  if (!habit) return { frequency: "daily", scheduledDays: [] };

  let scheduledDays: DayOfWeek[] = [];
  if (habit.frequency_days) {
    try {
      scheduledDays = JSON.parse(habit.frequency_days) as DayOfWeek[];
    } catch {
      scheduledDays = [];
    }
  }
  return { frequency: habit.frequency, scheduledDays };
}

export function calculateStreak(habitId: string): HabitStreak {
  const db = getDb();
  const { frequency, scheduledDays } = getHabitFrequencyInfo(habitId);

  const completions = db
    .prepare(
      "SELECT completed_date FROM habit_completions WHERE habit_id = ? ORDER BY completed_date DESC"
    )
    .all(habitId) as { completed_date: string }[];

  const dateSet = new Set(completions.map((c) => c.completed_date));

  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = dateOffset(today, -7);
  const thirtyDaysAgo = dateOffset(today, -30);

  let current = 0;
  let longest = 0;
  let streak = 0;

  let checkDate = today;
  // Skip today if it's not a scheduled day and not completed
  if (!isScheduledDay(checkDate, frequency, scheduledDays) && !dateSet.has(checkDate)) {
    checkDate = dateOffset(checkDate, -1);
  }

  // Walk backwards, only counting scheduled days
  let safety = 400;
  while (safety-- > 0) {
    if (isScheduledDay(checkDate, frequency, scheduledDays)) {
      if (dateSet.has(checkDate)) {
        current++;
      } else {
        break;
      }
    }
    checkDate = dateOffset(checkDate, -1);
  }

  // Longest streak: walk forward through all sorted dates, skipping non-scheduled gaps
  if (completions.length > 0) {
    const sorted = [...dateSet].sort();
    streak = 1;
    longest = 1;
    for (let i = 1; i < sorted.length; i++) {
      let nextExpected = dateOffset(sorted[i - 1], 1);
      // Skip unscheduled days between two completions
      while (
        nextExpected < sorted[i] &&
        !isScheduledDay(nextExpected, frequency, scheduledDays)
      ) {
        nextExpected = dateOffset(nextExpected, 1);
      }
      if (nextExpected === sorted[i]) {
        streak++;
        longest = Math.max(longest, streak);
      } else {
        streak = 1;
      }
    }
  }

  const last7Days = completions.filter(
    (c) => c.completed_date >= sevenDaysAgo
  ).length;
  const last30Days = completions.filter(
    (c) => c.completed_date >= thirtyDaysAgo
  ).length;

  return {
    current,
    longest: Math.max(longest, current),
    totalCompletions: completions.length,
    last7Days,
    last30Days,
  };
}

function dateOffset(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}
