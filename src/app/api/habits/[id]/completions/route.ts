import { NextRequest } from "next/server";
import { getHabitById } from "@/lib/queries/habits";
import { getGoalById } from "@/lib/queries/goals";
import {
  getCompletionsByHabitId,
  toggleCompletion,
  calculateStreak,
} from "@/lib/queries/completions";
import { jsonResponse, errorResponse } from "@/lib/apiResponse";
import { getAuthUserId } from "@/lib/authHelpers";

type RouteParams = { params: Promise<{ id: string }> };

async function verifyHabitOwnership(habitId: string, userId: string) {
  const habit = getHabitById(habitId);
  if (!habit) return null;
  const goal = getGoalById(habit.goal_id, userId);
  if (!goal) return null;
  return habit;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const { id } = await params;
  const habit = await verifyHabitOwnership(id, result.userId);
  if (!habit) return errorResponse("Habit not found", 404);

  const days = request.nextUrl.searchParams.get("days");
  const completions = getCompletionsByHabitId(
    id,
    days ? parseInt(days, 10) : undefined
  );
  const streak = calculateStreak(id);

  return jsonResponse({ completions, streak });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const { id } = await params;
  const habit = await verifyHabitOwnership(id, result.userId);
  if (!habit) return errorResponse("Habit not found", 404);

  const body = await request.json();
  const date = (body as { date?: string }).date;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return errorResponse("Valid date (YYYY-MM-DD) is required", 400);
  }

  try {
    const toggleResult = toggleCompletion(id, date);
    const streak = calculateStreak(id);
    return jsonResponse({ ...toggleResult, streak });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Failed to toggle completion",
      400
    );
  }
}
