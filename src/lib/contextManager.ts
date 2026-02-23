import type { Message } from "@/types";
import type { Goal, Habit } from "@/types";

interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

const CHARS_PER_TOKEN = 4;
const MAX_CONTEXT_TOKENS = 100_000;
const RESERVED_FOR_RESPONSE = 4_096;
const RESERVED_FOR_SYSTEM = 4_000;
const MAX_MESSAGE_TOKENS =
  MAX_CONTEXT_TOKENS - RESERVED_FOR_RESPONSE - RESERVED_FOR_SYSTEM;

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export function buildContextMessages(
  messages: Message[]
): ClaudeMessage[] {
  const claudeMessages: ClaudeMessage[] = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  let totalTokens = claudeMessages.reduce(
    (sum, m) => sum + estimateTokens(m.content),
    0
  );

  if (totalTokens <= MAX_MESSAGE_TOKENS) {
    return claudeMessages;
  }

  const result: ClaudeMessage[] = [];
  const summaryMessages: ClaudeMessage[] = [];

  // Keep the most recent messages that fit within the budget,
  // summarise everything older
  const reversed = [...claudeMessages].reverse();
  let recentTokens = 0;
  let splitIndex = claudeMessages.length;

  for (let i = 0; i < reversed.length; i++) {
    const msgTokens = estimateTokens(reversed[i].content);
    if (recentTokens + msgTokens > MAX_MESSAGE_TOKENS * 0.75) {
      splitIndex = claudeMessages.length - i;
      break;
    }
    recentTokens += msgTokens;
  }

  const olderMessages = claudeMessages.slice(0, splitIndex);
  const recentMessages = claudeMessages.slice(splitIndex);

  if (olderMessages.length > 0) {
    const summary = summariseMessages(olderMessages);
    summaryMessages.push({
      role: "user",
      content: `[Previous conversation summary: ${summary}]`,
    });
    summaryMessages.push({
      role: "assistant",
      content:
        "I understand. I have context from our previous conversation. How can I help you now?",
    });
  }

  result.push(...summaryMessages, ...recentMessages);

  // Final safety check: if still over budget, trim from the start
  totalTokens = result.reduce(
    (sum, m) => sum + estimateTokens(m.content),
    0
  );

  while (totalTokens > MAX_MESSAGE_TOKENS && result.length > 2) {
    const removed = result.shift();
    if (removed) {
      totalTokens -= estimateTokens(removed.content);
    }
    // Ensure we always start with a user message
    if (result.length > 0 && result[0].role === "assistant") {
      const removedAssistant = result.shift();
      if (removedAssistant) {
        totalTokens -= estimateTokens(removedAssistant.content);
      }
    }
  }

  return result;
}

function summariseMessages(messages: ClaudeMessage[]): string {
  const topics: string[] = [];

  for (const msg of messages) {
    if (msg.role === "user") {
      const trimmed = msg.content.trim();
      if (trimmed.length > 150) {
        topics.push(trimmed.slice(0, 150) + "...");
      } else {
        topics.push(trimmed);
      }
    }
  }

  if (topics.length === 0) {
    return "General discussion about habits.";
  }

  const uniqueTopics = [...new Set(topics)];
  if (uniqueTopics.length <= 5) {
    return `The user asked about: ${uniqueTopics.join("; ")}`;
  }

  return `The user discussed ${uniqueTopics.length} topics including: ${uniqueTopics
    .slice(0, 5)
    .join("; ")}; and more.`;
}

export function buildGoalHabitContext(
  goals: Goal[],
  habits: Habit[]
): string {
  if (goals.length === 0) return "";

  const lines: string[] = [
    "\n\n## User's Current Goals & Habits",
    "The user has the following goals and habits. Reference these when giving advice:\n",
  ];

  for (const goal of goals) {
    lines.push(`### Goal: ${goal.title}`);
    if (goal.description) {
      lines.push(`${goal.description}`);
    }
    if (goal.target_date) {
      lines.push(`Target date: ${goal.target_date}`);
    }

    const goalHabits = habits.filter((h) => h.goal_id === goal.id);
    if (goalHabits.length > 0) {
      lines.push("Habits:");
      for (const habit of goalHabits) {
        let habitLine = `- **${habit.name}** (${habit.frequency})`;
        if (habit.cue) habitLine += ` | Cue: ${habit.cue}`;
        if (habit.reward) habitLine += ` | Reward: ${habit.reward}`;
        lines.push(habitLine);
        if (habit.description) {
          lines.push(`  ${habit.description}`);
        }
      }
    } else {
      lines.push("_No habits defined yet for this goal._");
    }
    lines.push("");
  }

  return lines.join("\n");
}
