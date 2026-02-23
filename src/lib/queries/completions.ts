import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import type { HabitCompletion, HabitStreak } from "@/types";

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

export function calculateStreak(habitId: string): HabitStreak {
  const db = getDb();

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

  // Calculate current streak (working backwards from today)
  let checkDate = today;
  while (dateSet.has(checkDate)) {
    current++;
    checkDate = dateOffset(checkDate, -1);
  }

  // Calculate longest streak
  if (completions.length > 0) {
    const sorted = [...dateSet].sort();
    streak = 1;
    longest = 1;
    for (let i = 1; i < sorted.length; i++) {
      if (dateOffset(sorted[i - 1], 1) === sorted[i]) {
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
