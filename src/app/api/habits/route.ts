import { NextRequest } from "next/server";
import { getAllHabits, createHabit } from "@/lib/queries/habits";
import { getGoalById } from "@/lib/queries/goals";
import { createHabitSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get("goal_id");

  if (goalId) {
    const { getHabitsByGoalId } = await import("@/lib/queries/habits");
    const habits = getHabitsByGoalId(goalId);
    return jsonResponse(habits);
  }

  const habits = getAllHabits();
  return jsonResponse(habits);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = parseBody(createHabitSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const goal = getGoalById(parsed.data.goal_id);
  if (!goal) {
    return errorResponse("Goal not found", 404);
  }

  const habit = createHabit(parsed.data);
  return jsonResponse(habit, 201);
}
