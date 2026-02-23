import { describe, it, expect, beforeEach, vi } from "vitest";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

let db: Database.Database;

vi.mock("@/lib/db", () => ({
  getDb: () => db,
}));

const { createGoal } = await import("@/lib/queries/goals");
const { createHabit } = await import("@/lib/queries/habits");
const {
  toggleCompletion,
  getCompletionsByHabitId,
  getCompletionsForDate,
  calculateStreak,
} = await import("@/lib/queries/completions");

function setupDb() {
  db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  const schema = fs.readFileSync(
    path.join(process.cwd(), "src", "lib", "schema.sql"),
    "utf-8"
  );
  db.exec(schema);
}

describe("completions queries", () => {
  let habitId: string;

  beforeEach(() => {
    setupDb();
    const goal = createGoal({ title: "Fitness" });
    const habit = createHabit({ goal_id: goal.id, name: "Run" });
    habitId = habit.id;
  });

  it("toggles a completion on", () => {
    const result = toggleCompletion(habitId, "2026-02-23");
    expect(result.completed).toBe(true);

    const completions = getCompletionsByHabitId(habitId);
    expect(completions).toHaveLength(1);
    expect(completions[0].completed_date).toBe("2026-02-23");
  });

  it("toggles a completion off", () => {
    toggleCompletion(habitId, "2026-02-23");
    const result = toggleCompletion(habitId, "2026-02-23");
    expect(result.completed).toBe(false);

    const completions = getCompletionsByHabitId(habitId);
    expect(completions).toHaveLength(0);
  });

  it("prevents future date completions", () => {
    expect(() => toggleCompletion(habitId, "2099-01-01")).toThrow(
      "Cannot complete habits for future dates"
    );
  });

  it("gets completions for a specific date", () => {
    toggleCompletion(habitId, "2026-02-23");
    const completions = getCompletionsForDate("2026-02-23");
    expect(completions).toHaveLength(1);
  });

  it("enforces unique habit+date constraint", () => {
    toggleCompletion(habitId, "2026-02-20");
    toggleCompletion(habitId, "2026-02-21");
    const completions = getCompletionsByHabitId(habitId);
    expect(completions).toHaveLength(2);
  });

  it("cascades delete when habit is deleted", () => {
    toggleCompletion(habitId, "2026-02-23");
    db.prepare("DELETE FROM habits WHERE id = ?").run(habitId);
    const completions = getCompletionsByHabitId(habitId);
    expect(completions).toHaveLength(0);
  });
});

describe("calculateStreak", () => {
  let habitId: string;

  beforeEach(() => {
    setupDb();
    const goal = createGoal({ title: "Goal" });
    const habit = createHabit({ goal_id: goal.id, name: "Habit" });
    habitId = habit.id;
  });

  it("returns zeros for no completions", () => {
    const streak = calculateStreak(habitId);
    expect(streak.current).toBe(0);
    expect(streak.longest).toBe(0);
    expect(streak.totalCompletions).toBe(0);
  });

  it("counts current streak from today", () => {
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      toggleCompletion(habitId, d.toISOString().split("T")[0]);
    }
    const streak = calculateStreak(habitId);
    expect(streak.current).toBe(3);
  });

  it("breaks streak on missing day", () => {
    const today = new Date();
    toggleCompletion(habitId, today.toISOString().split("T")[0]);
    // Skip yesterday
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    toggleCompletion(habitId, twoDaysAgo.toISOString().split("T")[0]);

    const streak = calculateStreak(habitId);
    expect(streak.current).toBe(1);
    expect(streak.totalCompletions).toBe(2);
  });

  it("tracks longest streak", () => {
    const today = new Date();
    // 5-day streak ending 10 days ago
    for (let i = 10; i < 15; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      toggleCompletion(habitId, d.toISOString().split("T")[0]);
    }
    // 2-day current streak
    for (let i = 0; i < 2; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      toggleCompletion(habitId, d.toISOString().split("T")[0]);
    }

    const streak = calculateStreak(habitId);
    expect(streak.current).toBe(2);
    expect(streak.longest).toBe(5);
    expect(streak.totalCompletions).toBe(7);
  });

  it("counts last 7 and 30 day completions", () => {
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      toggleCompletion(habitId, d.toISOString().split("T")[0]);
    }

    const streak = calculateStreak(habitId);
    expect(streak.last7Days).toBe(5);
    expect(streak.last30Days).toBe(5);
  });
});
