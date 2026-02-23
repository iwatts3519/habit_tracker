import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import type { Habit } from "@/types";

export function getAllHabits(): Habit[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM habits ORDER BY sort_order ASC, created_at DESC")
    .all() as Habit[];
}

export function getHabitsByGoalId(goalId: string): Habit[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT * FROM habits WHERE goal_id = ? ORDER BY sort_order ASC, created_at DESC"
    )
    .all(goalId) as Habit[];
}

export function getHabitById(id: string): Habit | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM habits WHERE id = ?").get(id) as
    | Habit
    | undefined;
}

export function createHabit(data: {
  goal_id: string;
  name: string;
  description?: string;
  frequency?: string;
  cue?: string;
  reward?: string;
}): Habit {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO habits (id, goal_id, name, description, frequency, cue, reward, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    data.goal_id,
    data.name,
    data.description ?? "",
    data.frequency ?? "daily",
    data.cue ?? "",
    data.reward ?? "",
    now,
    now
  );

  return getHabitById(id)!;
}

export function updateHabit(
  id: string,
  data: {
    name?: string;
    description?: string;
    frequency?: string;
    cue?: string;
    reward?: string;
    sort_order?: number;
  }
): Habit | undefined {
  const db = getDb();
  const existing = getHabitById(id);
  if (!existing) return undefined;

  const updated = {
    name: data.name ?? existing.name,
    description: data.description ?? existing.description,
    frequency: data.frequency ?? existing.frequency,
    cue: data.cue ?? existing.cue,
    reward: data.reward ?? existing.reward,
    sort_order: data.sort_order ?? existing.sort_order,
    updated_at: new Date().toISOString(),
  };

  db.prepare(
    `UPDATE habits SET name = ?, description = ?, frequency = ?, cue = ?, reward = ?, sort_order = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    updated.name,
    updated.description,
    updated.frequency,
    updated.cue,
    updated.reward,
    updated.sort_order,
    updated.updated_at,
    id
  );

  return getHabitById(id);
}

export function deleteHabit(id: string): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM habits WHERE id = ?").run(id);
  return result.changes > 0;
}
