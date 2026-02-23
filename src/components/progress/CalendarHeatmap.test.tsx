import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CalendarHeatmap } from "./CalendarHeatmap";
import type { HabitCompletion } from "@/types";

describe("CalendarHeatmap", () => {
  it("renders without completions", () => {
    const { container } = render(<CalendarHeatmap completions={[]} />);
    const cells = container.querySelectorAll(".rounded-sm");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("highlights completed dates", () => {
    const today = new Date().toISOString().split("T")[0];
    const completions: HabitCompletion[] = [
      {
        id: "c1",
        habit_id: "h1",
        completed_date: today,
        created_at: new Date().toISOString(),
      },
    ];
    const { container } = render(
      <CalendarHeatmap completions={completions} />
    );
    const greenCells = container.querySelectorAll(".bg-emerald-500");
    expect(greenCells.length).toBeGreaterThanOrEqual(1);
  });

  it("respects weeks prop", () => {
    const { container: short } = render(
      <CalendarHeatmap completions={[]} weeks={4} />
    );
    const { container: long } = render(
      <CalendarHeatmap completions={[]} weeks={12} />
    );
    const shortCells = short.querySelectorAll(".rounded-sm");
    const longCells = long.querySelectorAll(".rounded-sm");
    expect(longCells.length).toBeGreaterThan(shortCells.length);
  });
});
