"use client";

import { useState } from "react";
import { GoalsList } from "./GoalsList";
import { GoalForm } from "./GoalForm";
import { useGoalsStore } from "@/stores/goalsStore";

export function GoalsPanel() {
  const [showNewGoal, setShowNewGoal] = useState(false);
  const { addGoal } = useGoalsStore();

  const handleCreate = async (data: {
    title: string;
    description?: string;
    target_date?: string | null;
  }) => {
    await addGoal(data);
    setShowNewGoal(false);
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Goals & Habits</h2>
        <button
          onClick={() => setShowNewGoal(true)}
          disabled={showNewGoal}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white
                     hover:bg-indigo-700 disabled:opacity-50"
        >
          + New Goal
        </button>
      </header>

      {showNewGoal && (
        <div className="border-b border-gray-200 bg-white">
          <GoalForm onSubmit={handleCreate} onCancel={() => setShowNewGoal(false)} />
        </div>
      )}

      <GoalsList />
    </div>
  );
}
