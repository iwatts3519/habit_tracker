"use client";

import { useState } from "react";
import { createHabitSchema } from "@/types";
import { useGoalsStore } from "@/stores/goalsStore";
import type { Habit } from "@/types";

interface HabitFormProps {
  goalId: string;
  habit?: Habit;
  onCancel: () => void;
  onSuccess: () => void;
}

export function HabitForm({ goalId, habit, onCancel, onSuccess }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? "");
  const [description, setDescription] = useState(habit?.description ?? "");
  const [frequency, setFrequency] = useState(habit?.frequency ?? "daily");
  const [cue, setCue] = useState(habit?.cue ?? "");
  const [reward, setReward] = useState(habit?.reward ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addHabit, updateHabit } = useGoalsStore();
  const isEditing = !!habit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = {
      goal_id: goalId,
      name: name.trim(),
      description: description.trim(),
      frequency,
      cue: cue.trim(),
      reward: reward.trim(),
    };

    if (!isEditing) {
      const result = createHabitSchema.safeParse(data);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
    } else if (!data.name) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateHabit(habit.id, {
          name: data.name,
          description: data.description,
          frequency: data.frequency,
          cue: data.cue,
          reward: data.reward,
        });
      } else {
        await addHabit(data);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div>
        <label htmlFor="habit-name" className="block text-xs font-medium text-gray-600">
          Habit name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Run for 20 minutes"
          maxLength={200}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="habit-desc" className="block text-xs font-medium text-gray-600">
          Description
        </label>
        <input
          id="habit-desc"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
          maxLength={2000}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label htmlFor="habit-freq" className="block text-xs font-medium text-gray-600">
            Frequency
          </label>
          <select
            id="habit-freq"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm
                       focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label htmlFor="habit-cue" className="block text-xs font-medium text-gray-600">
            Cue
          </label>
          <input
            id="habit-cue"
            type="text"
            value={cue}
            onChange={(e) => setCue(e.target.value)}
            placeholder="Trigger"
            maxLength={500}
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm
                       focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="habit-reward" className="block text-xs font-medium text-gray-600">
            Reward
          </label>
          <input
            id="habit-reward"
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="Reward"
            maxLength={500}
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm
                       focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700
                     hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white
                     hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add Habit"}
        </button>
      </div>
    </form>
  );
}
