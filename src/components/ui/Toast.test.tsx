import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { ToastProvider, useToast } from "./Toast";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function ToastTrigger({ message, type }: { message: string; type?: "success" | "error" | "info" }) {
  const { toast } = useToast();
  return (
    <button onClick={() => toast(message, type)}>
      Show Toast
    </button>
  );
}

describe("Toast", () => {
  it("shows a toast message", () => {
    render(
      <ToastProvider>
        <ToastTrigger message="Hello world" />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Show Toast").click();
    });

    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("shows toast with correct type styling", () => {
    render(
      <ToastProvider>
        <ToastTrigger message="Success!" type="success" />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Show Toast").click();
    });

    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("emerald");
  });

  it("auto-dismisses after timeout", () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ToastTrigger message="Temporary" />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Show Toast").click();
    });

    expect(screen.getByText("Temporary")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.queryByText("Temporary")).not.toBeInTheDocument();
  });
});
