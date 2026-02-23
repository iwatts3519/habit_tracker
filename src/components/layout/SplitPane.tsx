"use client";

import { useRef, useCallback, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MobileNav } from "./MobileNav";

const MIN_PANE_PCT = 25;
const MAX_PANE_PCT = 75;
const DEFAULT_PCT = 45;
const STORAGE_KEY = "habit-tracker-split-pane";

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function SplitPane({ left, right }: SplitPaneProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [leftPct, setLeftPct, isHydrated] = useLocalStorage(
    STORAGE_KEY,
    DEFAULT_PCT
  );
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const clamp = (value: number) =>
    Math.min(MAX_PANE_PCT, Math.max(MIN_PANE_PCT, value));

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftPct(clamp(pct));
    },
    [setLeftPct]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!isDesktop) {
    return <MobileNav left={left} right={right} />;
  }

  const pct = isHydrated ? leftPct : DEFAULT_PCT;

  return (
    <div ref={containerRef} className="flex h-screen w-full overflow-hidden">
      <div
        className="h-full overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        {left}
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panes"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setLeftPct(clamp(leftPct - 2));
          if (e.key === "ArrowRight") setLeftPct(clamp(leftPct + 2));
        }}
        className="group relative z-10 flex h-full w-2 flex-shrink-0 cursor-col-resize items-center justify-center
                   bg-gray-200 transition-colors hover:bg-indigo-300 focus-visible:bg-indigo-400 focus-visible:outline-none"
      >
        <div className="h-8 w-0.5 rounded-full bg-gray-400 transition-colors group-hover:bg-indigo-600" />
      </div>

      <div className="h-full flex-1 overflow-hidden">
        {right}
      </div>
    </div>
  );
}
