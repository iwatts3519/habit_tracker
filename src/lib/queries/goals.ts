import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import type { Goal } from "@/types";

export function getAllGoals(): Goal[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM goals ORDER BY sort_order ASC, created_at DESC")
    .all() as Goal[];
}

export function getGoalById(id: string): Goal | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM goals WHERE id = ?").get(id) as
    | Goal
    | undefined;
}

export function createGoal(data: {
  title: string;
  description?: string;
  target_date?: string | null;
}): Goal {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO goals (id, title, description, target_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, data.title, data.description ?? "", data.target_date ?? null, now, now);

  return getGoalById(id)!;
}

export function updateGoal(
  id: string,
  data: {
    title?: string;
    description?: string;
    target_date?: string | null;
    sort_order?: number;
  }
): Goal | undefined {
  const db = getDb();
  const existing = getGoalById(id);
  if (!existing) return undefined;

  const updated = {
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    target_date:
      data.target_date !== undefined ? data.target_date : existing.target_date,
    sort_order: data.sort_order ?? existing.sort_order,
    updated_at: new Date().toISOString(),
  };

  db.prepare(
    `UPDATE goals SET title = ?, description = ?, target_date = ?, sort_order = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    updated.title,
    updated.description,
    updated.target_date,
    updated.sort_order,
    updated.updated_at,
    id
  );

  return getGoalById(id);
}

export function deleteGoal(id: string): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM goals WHERE id = ?").run(id);
  return result.changes > 0;
}
