"use client";

import { useGoalsStore } from "@/stores/goalsStore";
import type { Habit } from "@/types";

interface GoalProgressProps {
  goalId: string;
  habits: Habit[];
}

export function GoalProgress({ goalId: _goalId, habits }: GoalProgressProps) {
  const { streaks } = useGoalsStore();

  if (habits.length === 0) return null;

  const today = new Date().toISOString().split("T")[0];
  let completedToday = 0;

  for (const habit of habits) {
    const streak = streaks[habit.id];
    if (streak && streak.current > 0) {
      const habitCompletions = useGoalsStore.getState().completions[habit.id] ?? [];
      if (habitCompletions.some((c) => c.completed_date === today)) {
        completedToday++;
      }
    }
  }

  const pct = Math.round((completedToday / habits.length) * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 tabular-nums">
        {completedToday}/{habits.length}
      </span>
    </div>
  );
}
