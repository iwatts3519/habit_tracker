import { NextRequest } from "next/server";
import { getGoalById, updateGoal, deleteGoal } from "@/lib/queries/goals";
import { updateGoalSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const goal = getGoalById(id);

  if (!goal) {
    return errorResponse("Goal not found", 404);
  }

  return jsonResponse(goal);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(updateGoalSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const goal = updateGoal(id, parsed.data);

  if (!goal) {
    return errorResponse("Goal not found", 404);
  }

  return jsonResponse(goal);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const deleted = deleteGoal(id);

  if (!deleted) {
    return errorResponse("Goal not found", 404);
  }

  return jsonResponse({ success: true });
}
