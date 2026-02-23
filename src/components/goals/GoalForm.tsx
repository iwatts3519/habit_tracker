"use client";

import { useState } from "react";
import { createGoalSchema, updateGoalSchema } from "@/types";
import type { Goal } from "@/types";

interface GoalFormProps {
  goal?: Goal;
  onSubmit: (data: {
    title: string;
    description?: string;
    target_date?: string | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(goal?.title ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [targetDate, setTargetDate] = useState(goal?.target_date ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!goal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = {
      title: title.trim(),
      description: description.trim(),
      target_date: targetDate || null,
    };

    const schema = isEditing ? updateGoalSchema : createGoalSchema;
    const result = schema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="goal-title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="goal-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Get physically fit"
          maxLength={200}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="goal-desc" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="goal-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why is this goal important to you?"
          rows={3}
          maxLength={2000}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="goal-date" className="block text-sm font-medium text-gray-700">
          Target date
        </label>
        <input
          id="goal-date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
                     hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                     hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Goal" : "Create Goal"}
        </button>
      </div>
    </form>
  );
}
