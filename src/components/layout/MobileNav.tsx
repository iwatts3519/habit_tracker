"use client";

import { useState, useRef, useCallback } from "react";

interface MobileNavProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function MobileNav({ left, right }: MobileNavProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "goals">("chat");
  const touchStart = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStart.current;
      const threshold = 80;

      if (delta > threshold && activeTab === "goals") {
        setActiveTab("chat");
      } else if (delta < -threshold && activeTab === "chat") {
        setActiveTab("goals");
      }
      touchStart.current = null;
    },
    [activeTab]
  );

  return (
    <div
      className="flex h-screen flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-1 overflow-hidden">
        <div
          className={activeTab === "chat" ? "h-full animate-fade-in" : "hidden"}
          role="tabpanel"
          aria-labelledby="tab-chat"
          id="panel-chat"
        >
          {left}
        </div>
        <div
          className={activeTab === "goals" ? "h-full animate-fade-in" : "hidden"}
          role="tabpanel"
          aria-labelledby="tab-goals"
          id="panel-goals"
        >
          {right}
        </div>
      </div>

      <nav
        role="tablist"
        aria-label="Main navigation"
        className="flex border-t border-gray-200 bg-white safe-area-bottom"
      >
        <button
          id="tab-chat"
          role="tab"
          aria-selected={activeTab === "chat"}
          aria-controls="panel-chat"
          onClick={() => setActiveTab("chat")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-sm font-medium transition-colors
            min-h-[48px]
            ${activeTab === "chat" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <ChatIcon active={activeTab === "chat"} />
          Chat
        </button>
        <button
          id="tab-goals"
          role="tab"
          aria-selected={activeTab === "goals"}
          aria-controls="panel-goals"
          onClick={() => setActiveTab("goals")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-sm font-medium transition-colors
            min-h-[48px]
            ${activeTab === "goals" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <GoalsIcon active={activeTab === "goals"} />
          Goals
        </button>
      </nav>
    </div>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
      />
    </svg>
  );
}

function GoalsIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
      />
    </svg>
  );
}
