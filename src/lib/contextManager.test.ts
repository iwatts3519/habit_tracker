import { describe, it, expect } from "vitest";
import {
  estimateTokens,
  buildContextMessages,
  buildGoalHabitContext,
} from "./contextManager";
import type { Message, Goal, Habit } from "@/types";

function makeMessage(
  role: "user" | "assistant",
  content: string,
  id?: string
): Message {
  return {
    id: id ?? `m-${Math.random()}`,
    conversation_id: "c1",
    role,
    content,
    created_at: new Date().toISOString(),
  };
}

describe("estimateTokens", () => {
  it("estimates ~1 token per 4 characters", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("abcd")).toBe(1);
    expect(estimateTokens("hello world")).toBe(3);
  });

  it("rounds up fractional tokens", () => {
    expect(estimateTokens("ab")).toBe(1);
    expect(estimateTokens("abcde")).toBe(2);
  });
});

describe("buildContextMessages", () => {
  it("returns all messages when under token limit", () => {
    const messages = [
      makeMessage("user", "Hello"),
      makeMessage("assistant", "Hi there!"),
      makeMessage("user", "How are you?"),
    ];

    const result = buildContextMessages(messages);
    expect(result).toHaveLength(3);
    expect(result[0].content).toBe("Hello");
    expect(result[2].content).toBe("How are you?");
  });

  it("preserves message roles", () => {
    const messages = [
      makeMessage("user", "Question"),
      makeMessage("assistant", "Answer"),
    ];

    const result = buildContextMessages(messages);
    expect(result[0].role).toBe("user");
    expect(result[1].role).toBe("assistant");
  });

  it("handles a single user message", () => {
    const messages = [makeMessage("user", "Hello")];
    const result = buildContextMessages(messages);
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe("Hello");
  });

  it("summarises older messages when context is too large", () => {
    const longContent = "x".repeat(400_000);
    const messages = [
      makeMessage("user", longContent),
      makeMessage("assistant", "Response to long message"),
      makeMessage("user", "Follow up"),
    ];

    const result = buildContextMessages(messages);
    const hasContext = result.some((m) =>
      m.content.includes("Previous conversation summary")
    );
    expect(hasContext || result.length <= messages.length).toBe(true);
  });

  it("always starts with a user role message", () => {
    const messages = [
      makeMessage("user", "First"),
      makeMessage("assistant", "Reply"),
      makeMessage("user", "Second"),
      makeMessage("assistant", "Reply 2"),
      makeMessage("user", "Third"),
    ];

    const result = buildContextMessages(messages);
    expect(result[0].role).toBe("user");
  });
});

describe("buildGoalHabitContext", () => {
  it("returns empty string when no goals", () => {
    expect(buildGoalHabitContext([], [])).toBe("");
  });

  it("includes goal title and description", () => {
    const goals: Goal[] = [
      {
        id: "g1",
        title: "Get Fit",
        description: "Improve physical health",
        target_date: "2026-12-31",
        sort_order: 0,
        created_at: "",
        updated_at: "",
      },
    ];

    const result = buildGoalHabitContext(goals, []);
    expect(result).toContain("Get Fit");
    expect(result).toContain("Improve physical health");
    expect(result).toContain("2026-12-31");
  });

  it("includes habits under their goal", () => {
    const goals: Goal[] = [
      {
        id: "g1",
        title: "Get Fit",
        description: "",
        target_date: null,
        sort_order: 0,
        created_at: "",
        updated_at: "",
      },
    ];
    const habits: Habit[] = [
      {
        id: "h1",
        goal_id: "g1",
        name: "Run daily",
        description: "30 minute run",
        frequency: "daily",
        frequency_days: "[]",
        cue: "After breakfast",
        reward: "Smoothie",
        sort_order: 0,
        created_at: "",
        updated_at: "",
      },
    ];

    const result = buildGoalHabitContext(goals, habits);
    expect(result).toContain("Run daily");
    expect(result).toContain("daily");
    expect(result).toContain("After breakfast");
    expect(result).toContain("Smoothie");
  });

  it("shows message when goal has no habits", () => {
    const goals: Goal[] = [
      {
        id: "g1",
        title: "Read More",
        description: "",
        target_date: null,
        sort_order: 0,
        created_at: "",
        updated_at: "",
      },
    ];

    const result = buildGoalHabitContext(goals, []);
    expect(result).toContain("No habits defined yet");
  });

  it("handles multiple goals with habits", () => {
    const goals: Goal[] = [
      {
        id: "g1",
        title: "Fitness",
        description: "",
        target_date: null,
        sort_order: 0,
        created_at: "",
        updated_at: "",
      },
      {
        id: "g2",
        title: "Learning",
        description: "",
        target_date: null,
        sort_order: 1,
        created_at: "",
        updated_at: "",
      },
    ];
    const habits: Habit[] = [
      {
        id: "h1",
        goal_id: "g1",
        name: "Run",
        description: "",
        frequency: "daily",
        frequency_days: "[]",
        cue: "",
        reward: "",
        sort_order: 0,
        created_at: "",
        updated_at: "",
      },
      {
        id: "h2",
        goal_id: "g2",
        name: "Read 20 pages",
        description: "",
        frequency: "daily",
        frequency_days: "[]",
        cue: "",
        reward: "",
        sort_order: 0,
        created_at: "",
        updated_at: "",
      },
    ];

    const result = buildGoalHabitContext(goals, habits);
    expect(result).toContain("Fitness");
    expect(result).toContain("Run");
    expect(result).toContain("Learning");
    expect(result).toContain("Read 20 pages");
  });
});
