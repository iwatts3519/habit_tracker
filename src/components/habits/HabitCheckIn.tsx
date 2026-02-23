"use client";

import { useGoalsStore } from "@/stores/goalsStore";

interface HabitCheckInProps {
  habitId: string;
  date: string;
}

export function HabitCheckIn({ habitId, date }: HabitCheckInProps) {
  const { completions, toggleCompletion } = useGoalsStore();
  const habitCompletions = completions[habitId] ?? [];
  const isCompleted = habitCompletions.some(
    (c) => c.completed_date === date
  );

  const handleToggle = async () => {
    await toggleCompletion(habitId, date);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all
        ${isCompleted ? "border-emerald-500 bg-emerald-500 text-white animate-check-pop" : "border-gray-300 bg-white hover:border-emerald-400"}`}
    >
      {isCompleted && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
