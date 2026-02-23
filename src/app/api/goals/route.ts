import { NextRequest } from "next/server";
import { getAllGoals, createGoal } from "@/lib/queries/goals";
import { createGoalSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";
import { getAuthUserId } from "@/lib/authHelpers";

export async function GET() {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const goals = getAllGoals(result.userId);
  return jsonResponse(goals);
}

export async function POST(request: NextRequest) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const body = await request.json();
  const parsed = parseBody(createGoalSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const goal = createGoal(parsed.data, result.userId);
  return jsonResponse(goal, 201);
}
