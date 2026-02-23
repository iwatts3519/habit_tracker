import { NextRequest } from "next/server";
import { getHabitById, updateHabit, deleteHabit } from "@/lib/queries/habits";
import { getGoalById } from "@/lib/queries/goals";
import { updateHabitSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";
import { getAuthUserId } from "@/lib/authHelpers";

type RouteParams = { params: Promise<{ id: string }> };

async function verifyHabitOwnership(habitId: string, userId: string) {
  const habit = getHabitById(habitId);
  if (!habit) return null;
  const goal = getGoalById(habit.goal_id, userId);
  if (!goal) return null;
  return habit;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const { id } = await params;
  const habit = await verifyHabitOwnership(id, result.userId);

  if (!habit) {
    return errorResponse("Habit not found", 404);
  }

  return jsonResponse(habit);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const { id } = await params;
  const habit = await verifyHabitOwnership(id, result.userId);

  if (!habit) {
    return errorResponse("Habit not found", 404);
  }

  const body = await request.json();
  const parsed = parseBody(updateHabitSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const updated = updateHabit(id, parsed.data);
  return jsonResponse(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const { id } = await params;
  const habit = await verifyHabitOwnership(id, result.userId);

  if (!habit) {
    return errorResponse("Habit not found", 404);
  }

  const deleted = deleteHabit(id);

  if (!deleted) {
    return errorResponse("Habit not found", 404);
  }

  return jsonResponse({ success: true });
}
