import { NextRequest } from "next/server";
import { getAllHabits, createHabit } from "@/lib/queries/habits";
import { getGoalById } from "@/lib/queries/goals";
import { createHabitSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";
import { getAuthUserId } from "@/lib/authHelpers";

export async function GET(request: NextRequest) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const goalId = request.nextUrl.searchParams.get("goal_id");

  if (goalId) {
    const goal = getGoalById(goalId, result.userId);
    if (!goal) return errorResponse("Goal not found", 404);

    const { getHabitsByGoalId } = await import("@/lib/queries/habits");
    const habits = getHabitsByGoalId(goalId);
    return jsonResponse(habits);
  }

  const habits = getAllHabits(result.userId);
  return jsonResponse(habits);
}

export async function POST(request: NextRequest) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const body = await request.json();
  const parsed = parseBody(createHabitSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const goal = getGoalById(parsed.data.goal_id, result.userId);
  if (!goal) {
    return errorResponse("Goal not found", 404);
  }

  const habit = createHabit(parsed.data);
  return jsonResponse(habit, 201);
}
