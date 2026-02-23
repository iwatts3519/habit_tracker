import { describe, it, expect, beforeEach, vi } from "vitest";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

let db: Database.Database;

vi.mock("@/lib/db", () => ({
  getDb: () => db,
}));

const {
  getAllConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation,
} = await import("@/lib/queries/conversations");
const { createMessage, getMessagesByConversationId } = await import(
  "@/lib/queries/messages"
);

function setupDb() {
  db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  const schema = fs.readFileSync(
    path.join(process.cwd(), "src", "lib", "schema.sql"),
    "utf-8"
  );
  db.exec(schema);
}

describe("conversations queries", () => {
  beforeEach(() => {
    setupDb();
  });

  it("returns empty array when no conversations exist", () => {
    expect(getAllConversations()).toEqual([]);
  });

  it("creates a conversation with default title", () => {
    const conv = createConversation();
    expect(conv.title).toBe("New Conversation");
    expect(conv.id).toBeDefined();
  });

  it("creates a conversation with custom title", () => {
    const conv = createConversation({ title: "About Exercise" });
    expect(conv.title).toBe("About Exercise");
  });

  it("updates a conversation title", () => {
    const conv = createConversation();
    const updated = updateConversation(conv.id, { title: "Renamed" });
    expect(updated?.title).toBe("Renamed");
  });

  it("deletes a conversation", () => {
    const conv = createConversation();
    expect(deleteConversation(conv.id)).toBe(true);
    expect(getConversationById(conv.id)).toBeUndefined();
  });

  it("cascades delete to messages", () => {
    const conv = createConversation();
    createMessage({
      conversation_id: conv.id,
      role: "user",
      content: "Hello",
    });
    deleteConversation(conv.id);
    expect(getMessagesByConversationId(conv.id)).toHaveLength(0);
  });
});

describe("messages queries", () => {
  beforeEach(() => {
    setupDb();
  });

  it("creates and retrieves messages", () => {
    const conv = createConversation();
    const msg = createMessage({
      conversation_id: conv.id,
      role: "user",
      content: "How do I build a habit?",
    });

    expect(msg.role).toBe("user");
    expect(msg.content).toBe("How do I build a habit?");
    expect(msg.conversation_id).toBe(conv.id);
  });

  it("returns messages in chronological order", () => {
    const conv = createConversation();
    createMessage({
      conversation_id: conv.id,
      role: "user",
      content: "First",
    });
    createMessage({
      conversation_id: conv.id,
      role: "assistant",
      content: "Second",
    });

    const messages = getMessagesByConversationId(conv.id);
    expect(messages).toHaveLength(2);
    expect(messages[0].content).toBe("First");
    expect(messages[1].content).toBe("Second");
  });

  it("supports pagination with limit and offset", () => {
    const conv = createConversation();
    for (let i = 0; i < 5; i++) {
      createMessage({
        conversation_id: conv.id,
        role: "user",
        content: `Message ${i}`,
      });
    }

    const page = getMessagesByConversationId(conv.id, 2, 1);
    expect(page).toHaveLength(2);
    expect(page[0].content).toBe("Message 1");
    expect(page[1].content).toBe("Message 2");
  });
});
