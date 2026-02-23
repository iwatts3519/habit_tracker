import { NextRequest } from "next/server";
import { getHabitById } from "@/lib/queries/habits";
import {
  getCompletionsByHabitId,
  toggleCompletion,
  calculateStreak,
} from "@/lib/queries/completions";
import { jsonResponse, errorResponse } from "@/lib/apiResponse";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const habit = getHabitById(id);
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
  const { id } = await params;
  const habit = getHabitById(id);
  if (!habit) return errorResponse("Habit not found", 404);

  const body = await request.json();
  const date = (body as { date?: string }).date;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return errorResponse("Valid date (YYYY-MM-DD) is required", 400);
  }

  try {
    const result = toggleCompletion(id, date);
    const streak = calculateStreak(id);
    return jsonResponse({ ...result, streak });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Failed to toggle completion",
      400
    );
  }
}
