import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Skeleton,
  GoalCardSkeleton,
  HabitCardSkeleton,
  MessageSkeleton,
  ConversationListSkeleton,
} from "./Skeleton";

describe("Skeleton", () => {
  it("renders with custom className", () => {
    const { container } = render(<Skeleton className="h-10 w-10" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("animate-pulse");
    expect(el.className).toContain("h-10");
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("GoalCardSkeleton", () => {
  it("renders skeleton layout", () => {
    const { container } = render(<GoalCardSkeleton />);
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(3);
  });
});

describe("HabitCardSkeleton", () => {
  it("renders skeleton layout", () => {
    const { container } = render(<HabitCardSkeleton />);
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThanOrEqual(2);
  });
});

describe("MessageSkeleton", () => {
  it("renders message placeholders", () => {
    const { container } = render(<MessageSkeleton />);
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBe(3);
  });
});

describe("ConversationListSkeleton", () => {
  it("renders three skeleton items", () => {
    const { container } = render(<ConversationListSkeleton />);
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBe(3);
  });
});
