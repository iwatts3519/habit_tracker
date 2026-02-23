"use client";

import type { HabitStreak } from "@/types";

interface StreakBadgeProps {
  streak: HabitStreak | undefined;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (!streak || streak.current === 0) return null;

  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700"
      title={`Current streak: ${streak.current} days | Longest: ${streak.longest} days`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-3 w-3"
      >
        <path
          fillRule="evenodd"
          d="M8.074.945A4.993 4.993 0 0 0 6 5v.032c.004.6.114 1.176.311 1.709.16.428-.204.91-.61.7a2.441 2.441 0 0 1-.312-.207 4.985 4.985 0 0 1-1.147-1.331c-.015.07-.028.14-.04.21A7.015 7.015 0 0 0 4 7.5c0 3.866 3.134 7 7 7a6.98 6.98 0 0 0 3.684-1.047c.15-.09.286-.196.4-.326.156-.178.126-.47-.098-.542a5.08 5.08 0 0 1-1.07-.543 4.99 4.99 0 0 1-2.07-3.542H12a.75.75 0 0 0 .728-.932L11.596 3.39A4.994 4.994 0 0 0 8.074.945Z"
          clipRule="evenodd"
        />
      </svg>
      {streak.current}
    </span>
  );
}
