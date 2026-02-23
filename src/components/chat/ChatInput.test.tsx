import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ChatInput } from "./ChatInput";

afterEach(cleanup);

describe("ChatInput", () => {
  it("renders textarea and send button", () => {
    render(<ChatInput onSend={vi.fn()} disabled={false} />);
    expect(screen.getByPlaceholderText("Ask about habits...")).toBeInTheDocument();
    expect(screen.getByLabelText("Send message")).toBeInTheDocument();
  });

  it("calls onSend with trimmed value on button click", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText("Ask about habits...");
    fireEvent.change(textarea, { target: { value: "  Hello world  " } });
    fireEvent.click(screen.getByLabelText("Send message"));

    expect(onSend).toHaveBeenCalledWith("Hello world");
  });

  it("calls onSend on Enter key", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText("Ask about habits...");
    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(onSend).toHaveBeenCalledWith("Test");
  });

  it("does not call onSend on Shift+Enter", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText("Ask about habits...");
    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not call onSend with empty input", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);

    fireEvent.click(screen.getByLabelText("Send message"));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("disables input and button when disabled prop is true", () => {
    render(<ChatInput onSend={vi.fn()} disabled={true} />);

    expect(screen.getByPlaceholderText("Ask about habits...")).toBeDisabled();
    expect(screen.getByLabelText("Send message")).toBeDisabled();
  });

  it("clears input after sending", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText("Ask about habits...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(screen.getByLabelText("Send message"));

    expect(textarea).toHaveValue("");
  });
});
