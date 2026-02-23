import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { touchConversation } from "./conversations";
import type { Message } from "@/types";

export function getMessagesByConversationId(
  conversationId: string,
  limit?: number,
  offset?: number
): Message[] {
  const db = getDb();
  let query = "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC";
  const params: (string | number)[] = [conversationId];

  if (limit !== undefined) {
    query += " LIMIT ?";
    params.push(limit);
    if (offset !== undefined) {
      query += " OFFSET ?";
      params.push(offset);
    }
  }

  return db.prepare(query).all(...params) as Message[];
}

export function createMessage(data: {
  conversation_id: string;
  role: string;
  content: string;
}): Message {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO messages (id, conversation_id, role, content, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, data.conversation_id, data.role, data.content, now);

  touchConversation(data.conversation_id);

  return db.prepare("SELECT * FROM messages WHERE id = ?").get(id) as Message;
}

export function getMessageCount(conversationId: string): number {
  const db = getDb();
  const row = db
    .prepare("SELECT COUNT(*) as count FROM messages WHERE conversation_id = ?")
    .get(conversationId) as { count: number };
  return row.count;
}
