import { NextRequest } from "next/server";
import { getHabitById, updateHabit, deleteHabit } from "@/lib/queries/habits";
import { updateHabitSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const habit = getHabitById(id);

  if (!habit) {
    return errorResponse("Habit not found", 404);
  }

  return jsonResponse(habit);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(updateHabitSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const habit = updateHabit(id, parsed.data);

  if (!habit) {
    return errorResponse("Habit not found", 404);
  }

  return jsonResponse(habit);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const deleted = deleteHabit(id);

  if (!deleted) {
    return errorResponse("Habit not found", 404);
  }

  return jsonResponse({ success: true });
}
