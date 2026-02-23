"use client";

import type { HabitCompletion } from "@/types";

interface CalendarHeatmapProps {
  completions: HabitCompletion[];
  weeks?: number;
}

export function CalendarHeatmap({
  completions,
  weeks = 12,
}: CalendarHeatmapProps) {
  const completedDates = new Set(completions.map((c) => c.completed_date));

  const today = new Date();
  const days: { date: string; completed: boolean; dayOfWeek: number }[] = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({
      date: dateStr,
      completed: completedDates.has(dateStr),
      dayOfWeek: d.getDay(),
    });
  }

  // Group into weeks (columns)
  const weekColumns: typeof days[] = [];
  let currentWeek: typeof days = [];

  for (const day of days) {
    if (day.dayOfWeek === 0 && currentWeek.length > 0) {
      weekColumns.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) {
    weekColumns.push(currentWeek);
  }

  // Pad first week
  if (weekColumns.length > 0) {
    const firstWeek = weekColumns[0];
    while (firstWeek.length < 7) {
      firstWeek.unshift({ date: "", completed: false, dayOfWeek: -1 });
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-[3px]">
        {weekColumns.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.date ? `${day.date}${day.completed ? " - Completed" : ""}` : ""}
                className={`h-3 w-3 rounded-sm ${
                  !day.date
                    ? "bg-transparent"
                    : day.completed
                      ? "bg-emerald-500"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
