import { NextRequest } from "next/server";
import { getAllGoals, createGoal } from "@/lib/queries/goals";
import { createGoalSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";

export async function GET() {
  const goals = getAllGoals();
  return jsonResponse(goals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = parseBody(createGoalSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const goal = createGoal(parsed.data);
  return jsonResponse(goal, 201);
}
