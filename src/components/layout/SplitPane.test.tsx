import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

const mockUseMediaQuery = vi.fn<(query: string) => boolean>(() => true);
const mockSetLeftPct = vi.fn();

vi.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

vi.mock("@/hooks/useLocalStorage", () => ({
  useLocalStorage: () => [45, mockSetLeftPct, true],
}));

import { SplitPane } from "./SplitPane";

describe("SplitPane (desktop)", () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders both panes", () => {
    render(
      <SplitPane left={<div>Left Pane</div>} right={<div>Right Pane</div>} />
    );

    expect(screen.getByText("Left Pane")).toBeInTheDocument();
    expect(screen.getByText("Right Pane")).toBeInTheDocument();
  });

  it("renders the divider with correct role", () => {
    render(<SplitPane left={<div>L</div>} right={<div>R</div>} />);

    const divider = screen.getByRole("separator");
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
  });

  it("divider is keyboard accessible", () => {
    render(<SplitPane left={<div>L</div>} right={<div>R</div>} />);

    const divider = screen.getByRole("separator");
    expect(divider).toHaveAttribute("tabIndex", "0");
  });

  it("arrow keys adjust pane width", () => {
    render(<SplitPane left={<div>L</div>} right={<div>R</div>} />);

    const divider = screen.getByRole("separator");
    fireEvent.keyDown(divider, { key: "ArrowLeft" });
    expect(mockSetLeftPct).toHaveBeenCalled();

    mockSetLeftPct.mockClear();
    fireEvent.keyDown(divider, { key: "ArrowRight" });
    expect(mockSetLeftPct).toHaveBeenCalled();
  });
});

describe("SplitPane (mobile)", () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders tab bar on mobile", () => {
    render(
      <SplitPane
        left={<div>Chat Content</div>}
        right={<div>Goals Content</div>}
      />
    );

    expect(screen.getByRole("tab", { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /goals/i })).toBeInTheDocument();
  });

  it("shows chat tab by default", () => {
    render(
      <SplitPane
        left={<div>Chat Content</div>}
        right={<div>Goals Content</div>}
      />
    );

    const chatTab = screen.getByRole("tab", { name: /chat/i });
    expect(chatTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Chat Content")).toBeVisible();
  });

  it("switches to goals tab on click", () => {
    render(
      <SplitPane
        left={<div>Chat Content</div>}
        right={<div>Goals Content</div>}
      />
    );

    const goalsTab = screen.getByRole("tab", { name: /goals/i });
    fireEvent.click(goalsTab);

    expect(goalsTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Goals Content")).toBeVisible();
  });
});
