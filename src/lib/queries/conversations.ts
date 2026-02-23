import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import type { Conversation } from "@/types";

export function getAllConversations(): Conversation[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM conversations ORDER BY updated_at DESC")
    .all() as Conversation[];
}

export function getConversationById(id: string): Conversation | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM conversations WHERE id = ?").get(id) as
    | Conversation
    | undefined;
}

export function createConversation(data?: { title?: string }): Conversation {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const title = data?.title ?? "New Conversation";

  db.prepare(
    `INSERT INTO conversations (id, title, created_at, updated_at)
     VALUES (?, ?, ?, ?)`
  ).run(id, title, now, now);

  return getConversationById(id)!;
}

export function updateConversation(
  id: string,
  data: { title: string }
): Conversation | undefined {
  const db = getDb();
  const existing = getConversationById(id);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  db.prepare(
    "UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?"
  ).run(data.title, now, id);

  return getConversationById(id);
}

export function deleteConversation(id: string): boolean {
  const db = getDb();
  const result = db
    .prepare("DELETE FROM conversations WHERE id = ?")
    .run(id);
  return result.changes > 0;
}

export function touchConversation(id: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare("UPDATE conversations SET updated_at = ? WHERE id = ?").run(
    now,
    id
  );
}
