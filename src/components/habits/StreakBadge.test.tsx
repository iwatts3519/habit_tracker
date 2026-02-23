import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreakBadge } from "./StreakBadge";
import type { HabitStreak } from "@/types";

describe("StreakBadge", () => {
  it("renders nothing when streak is undefined", () => {
    const { container } = render(<StreakBadge streak={undefined} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when current streak is 0", () => {
    const streak: HabitStreak = {
      current: 0,
      longest: 5,
      totalCompletions: 10,
      last7Days: 2,
      last30Days: 8,
    };
    const { container } = render(<StreakBadge streak={streak} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders streak count when active", () => {
    const streak: HabitStreak = {
      current: 7,
      longest: 14,
      totalCompletions: 30,
      last7Days: 7,
      last30Days: 20,
    };
    render(<StreakBadge streak={streak} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
