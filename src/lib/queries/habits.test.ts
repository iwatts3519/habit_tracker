import { describe, it, expect, beforeEach, vi } from "vitest";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

let db: Database.Database;

vi.mock("@/lib/db", () => ({
  getDb: () => db,
}));

const { createGoal } = await import("@/lib/queries/goals");
const {
  getAllHabits,
  getHabitsByGoalId,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
} = await import("@/lib/queries/habits");

function setupDb() {
  db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  const schema = fs.readFileSync(
    path.join(process.cwd(), "src", "lib", "schema.sql"),
    "utf-8"
  );
  db.exec(schema);
  db.prepare(
    "INSERT INTO users (id, email, name, password_hash) VALUES ('default', 'test@test.com', 'Test', 'hash')"
  ).run();
}

describe("habits queries", () => {
  beforeEach(() => {
    setupDb();
  });

  it("returns empty array when no habits exist", () => {
    expect(getAllHabits()).toEqual([]);
  });

  it("creates a habit under a goal", () => {
    const goal = createGoal({ title: "Fitness" });
    const habit = createHabit({ goal_id: goal.id, name: "Run daily" });

    expect(habit.name).toBe("Run daily");
    expect(habit.goal_id).toBe(goal.id);
    expect(habit.frequency).toBe("daily");
  });

  it("lists habits by goal", () => {
    const goal1 = createGoal({ title: "Goal 1" });
    const goal2 = createGoal({ title: "Goal 2" });
    createHabit({ goal_id: goal1.id, name: "Habit A" });
    createHabit({ goal_id: goal1.id, name: "Habit B" });
    createHabit({ goal_id: goal2.id, name: "Habit C" });

    expect(getHabitsByGoalId(goal1.id)).toHaveLength(2);
    expect(getHabitsByGoalId(goal2.id)).toHaveLength(1);
    expect(getAllHabits()).toHaveLength(3);
  });

  it("updates a habit", () => {
    const goal = createGoal({ title: "Goal" });
    const habit = createHabit({ goal_id: goal.id, name: "Original" });
    const updated = updateHabit(habit.id, {
      name: "Updated",
      frequency: "weekly",
    });

    expect(updated?.name).toBe("Updated");
    expect(updated?.frequency).toBe("weekly");
  });

  it("returns undefined when updating nonexistent habit", () => {
    expect(updateHabit("nope", { name: "X" })).toBeUndefined();
  });

  it("deletes a habit", () => {
    const goal = createGoal({ title: "Goal" });
    const habit = createHabit({ goal_id: goal.id, name: "Delete Me" });
    expect(deleteHabit(habit.id)).toBe(true);
    expect(getHabitById(habit.id)).toBeUndefined();
  });

  it("cascades delete when goal is deleted", () => {
    const goal = createGoal({ title: "Goal" });
    createHabit({ goal_id: goal.id, name: "Habit" });
    db.prepare("DELETE FROM goals WHERE id = ?").run(goal.id);
    expect(getAllHabits()).toHaveLength(0);
  });
});
