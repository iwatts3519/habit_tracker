"use client";

import { useState } from "react";
import { GoalForm } from "./GoalForm";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { GoalProgress } from "@/components/progress/GoalProgress";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useGoalsStore } from "@/stores/goalsStore";
import type { Goal, Habit } from "@/types";

interface GoalCardProps {
  goal: Goal;
  habits: Habit[];
}

export function GoalCard({ goal, habits }: GoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { updateGoal, deleteGoal } = useGoalsStore();

  const handleUpdate = async (data: {
    title: string;
    description?: string;
    target_date?: string | null;
  }) => {
    await updateGoal(goal.id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    await deleteGoal(goal.id);
  };

  if (isEditing) {
    return (
      <div className="rounded-xl border border-indigo-200 bg-white shadow-sm">
        <GoalForm
          goal={goal}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm animate-fade-in">
        <div
          className="flex cursor-pointer items-start gap-3 px-4 py-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <button
            aria-label={isExpanded ? "Collapse goal" : "Expand goal"}
            className="mt-0.5 text-gray-400 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
            {goal.description && (
              <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                {goal.description}
              </p>
            )}
            {goal.target_date && (
              <p className="mt-1 text-xs text-gray-400">
                Target: {new Date(goal.target_date).toLocaleDateString()}
              </p>
            )}
            {habits.length > 0 && (
              <div className="mt-1.5">
                <GoalProgress goalId={goal.id} habits={habits} />
              </div>
            )}
          </div>

          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsEditing(true)}
              aria-label="Edit goal"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Delete goal"
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-100 px-4 py-3">
            {habits.length === 0 && !showAddHabit ? (
              <p className="text-center text-sm text-gray-400 py-2">
                No habits yet.{" "}
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Add one
                </button>
              </p>
            ) : (
              <div className="space-y-2">
                {habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            )}

            {showAddHabit ? (
              <div className="mt-2">
                <HabitForm
                  goalId={goal.id}
                  onCancel={() => setShowAddHabit(false)}
                  onSuccess={() => setShowAddHabit(false)}
                />
              </div>
            ) : (
              habits.length > 0 && (
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed
                             border-gray-300 py-2 text-sm text-gray-500 hover:border-indigo-300
                             hover:text-indigo-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                  Add habit
                </button>
              )
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete goal?"
        message={`This will permanently delete "${goal.title}" and all its habits.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
