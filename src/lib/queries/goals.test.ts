import { describe, it, expect, beforeEach, vi } from "vitest";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

let db: Database.Database;

vi.mock("@/lib/db", () => ({
  getDb: () => db,
}));

const { getAllGoals, getGoalById, createGoal, updateGoal, deleteGoal } =
  await import("@/lib/queries/goals");

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

describe("goals queries", () => {
  beforeEach(() => {
    setupDb();
  });

  it("returns empty array when no goals exist", () => {
    expect(getAllGoals()).toEqual([]);
  });

  it("creates a goal and retrieves it", () => {
    const goal = createGoal({ title: "Get Fit" });
    expect(goal.title).toBe("Get Fit");
    expect(goal.id).toBeDefined();
    expect(goal.description).toBe("");

    const fetched = getGoalById(goal.id);
    expect(fetched).toEqual(goal);
  });

  it("creates a goal with all fields", () => {
    const goal = createGoal({
      title: "Read More",
      description: "Read 20 books this year",
      target_date: "2026-12-31",
    });
    expect(goal.title).toBe("Read More");
    expect(goal.description).toBe("Read 20 books this year");
    expect(goal.target_date).toBe("2026-12-31");
  });

  it("lists all goals", () => {
    createGoal({ title: "Goal A" });
    createGoal({ title: "Goal B" });
    const all = getAllGoals();
    expect(all).toHaveLength(2);
  });

  it("updates a goal", () => {
    const goal = createGoal({ title: "Original" });
    const updated = updateGoal(goal.id, { title: "Updated" });
    expect(updated?.title).toBe("Updated");
    expect(updated?.description).toBe("");
  });

  it("returns undefined when updating nonexistent goal", () => {
    const result = updateGoal("nonexistent", { title: "X" });
    expect(result).toBeUndefined();
  });

  it("deletes a goal", () => {
    const goal = createGoal({ title: "To Delete" });
    expect(deleteGoal(goal.id)).toBe(true);
    expect(getGoalById(goal.id)).toBeUndefined();
  });

  it("returns false when deleting nonexistent goal", () => {
    expect(deleteGoal("nonexistent")).toBe(false);
  });
});
