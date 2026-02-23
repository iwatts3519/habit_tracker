import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { GoalForm } from "./GoalForm";

afterEach(cleanup);

describe("GoalForm", () => {
  it("renders create form with empty fields", () => {
    render(<GoalForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(screen.getByText("Create Goal")).toBeInTheDocument();
  });

  it("renders edit form with pre-filled fields", () => {
    const goal = {
      id: "1",
      title: "Get Fit",
      description: "Be healthier",
      target_date: "2026-12-31",
      sort_order: 0,
      created_at: "",
      updated_at: "",
    };

    render(<GoalForm goal={goal} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue("Get Fit");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Be healthier");
    expect(screen.getByText("Update Goal")).toBeInTheDocument();
  });

  it("shows validation error for empty title", async () => {
    const onSubmit = vi.fn();
    render(<GoalForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with form data", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<GoalForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Goal" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "My description" },
    });
    fireEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "New Goal",
        description: "My description",
        target_date: null,
      });
    });
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = vi.fn();
    render(<GoalForm onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });
});
