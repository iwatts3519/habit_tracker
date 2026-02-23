import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { HabitForm } from "./HabitForm";

const mockAddHabit = vi.fn().mockResolvedValue({
  id: "h1",
  goal_id: "g1",
  name: "Test",
  description: "",
  frequency: "daily",
  cue: "",
  reward: "",
  sort_order: 0,
  created_at: "",
  updated_at: "",
});
const mockUpdateHabit = vi.fn().mockResolvedValue(undefined);

vi.mock("@/stores/goalsStore", () => ({
  useGoalsStore: () => ({
    addHabit: mockAddHabit,
    updateHabit: mockUpdateHabit,
  }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("HabitForm", () => {
  it("renders create form with empty fields", () => {
    render(
      <HabitForm goalId="g1" onCancel={vi.fn()} onSuccess={vi.fn()} />
    );

    expect(screen.getByLabelText(/habit name/i)).toHaveValue("");
    expect(screen.getByText("Add Habit")).toBeInTheDocument();
  });

  it("renders edit form with pre-filled fields", () => {
    const habit = {
      id: "h1",
      goal_id: "g1",
      name: "Run",
      description: "Morning run",
      frequency: "daily",
      cue: "Alarm",
      reward: "Smoothie",
      sort_order: 0,
      created_at: "",
      updated_at: "",
    };

    render(
      <HabitForm
        goalId="g1"
        habit={habit}
        onCancel={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/habit name/i)).toHaveValue("Run");
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("shows validation error for empty name", async () => {
    render(
      <HabitForm goalId="g1" onCancel={vi.fn()} onSuccess={vi.fn()} />
    );

    fireEvent.click(screen.getByText("Add Habit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(mockAddHabit).not.toHaveBeenCalled();
  });

  it("calls addHabit on create submit", async () => {
    const onSuccess = vi.fn();
    render(
      <HabitForm goalId="g1" onCancel={vi.fn()} onSuccess={onSuccess} />
    );

    fireEvent.change(screen.getByLabelText(/habit name/i), {
      target: { value: "Meditate" },
    });
    fireEvent.click(screen.getByText("Add Habit"));

    await waitFor(() => {
      expect(mockAddHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          goal_id: "g1",
          name: "Meditate",
        })
      );
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = vi.fn();
    render(
      <HabitForm goalId="g1" onCancel={onCancel} onSuccess={vi.fn()} />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });
});
