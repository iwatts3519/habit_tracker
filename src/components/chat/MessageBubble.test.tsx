import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/types";

afterEach(cleanup);

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  id: "m1",
  conversation_id: "c1",
  role: "user",
  content: "Hello",
  created_at: "2026-02-23T12:00:00.000Z",
  ...overrides,
});

describe("MessageBubble", () => {
  it("renders user message content", () => {
    render(<MessageBubble message={makeMessage({ content: "How do I build a habit?" })} />);
    expect(screen.getByText("How do I build a habit?")).toBeInTheDocument();
  });

  it("renders assistant message with markdown", () => {
    render(
      <MessageBubble
        message={makeMessage({
          role: "assistant",
          content: "Here is a **bold** tip.",
        })}
      />
    );
    const bold = screen.getByText("bold");
    expect(bold.tagName).toBe("STRONG");
  });

  it("applies different styling for user vs assistant", () => {
    const { container: userContainer } = render(
      <MessageBubble message={makeMessage({ role: "user" })} />
    );
    const userBubble = userContainer.querySelector(".bg-indigo-600");
    expect(userBubble).not.toBeNull();

    cleanup();

    const { container: assistantContainer } = render(
      <MessageBubble message={makeMessage({ role: "assistant" })} />
    );
    const assistantBubble = assistantContainer.querySelector(".bg-gray-100");
    expect(assistantBubble).not.toBeNull();
  });

  it("renders a timestamp", () => {
    render(<MessageBubble message={makeMessage()} />);
    const time = screen.getByRole("time");
    expect(time).toBeInTheDocument();
  });
});
