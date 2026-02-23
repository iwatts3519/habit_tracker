"use client";

import { useState } from "react";
import { HabitForm } from "./HabitForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useGoalsStore } from "@/stores/goalsStore";
import type { Habit } from "@/types";

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  custom: "Custom",
};

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteHabit } = useGoalsStore();

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    await deleteHabit(habit.id);
  };

  if (isEditing) {
    return (
      <HabitForm
        goalId={habit.goal_id}
        habit={habit}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="group flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5 transition-colors hover:border-gray-200">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">{habit.name}</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {FREQUENCY_LABELS[habit.frequency] ?? habit.frequency}
            </span>
          </div>
          {habit.description && (
            <p className="mt-0.5 text-xs text-gray-500">{habit.description}</p>
          )}
          {(habit.cue || habit.reward) && (
            <div className="mt-1 flex gap-3 text-xs text-gray-400">
              {habit.cue && <span>Cue: {habit.cue}</span>}
              {habit.reward && <span>Reward: {habit.reward}</span>}
            </div>
          )}
        </div>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit habit"
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Delete habit"
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete habit?"
        message={`This will permanently delete "${habit.name}".`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
