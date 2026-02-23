import { NextRequest } from "next/server";
import {
  getAllConversations,
  createConversation,
} from "@/lib/queries/conversations";
import { createConversationSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";
import { getAuthUserId } from "@/lib/authHelpers";

export async function GET() {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const conversations = getAllConversations(result.userId);
  return jsonResponse(conversations);
}

export async function POST(request: NextRequest) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const body = await request.json();
  const parsed = parseBody(createConversationSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const conversation = createConversation(parsed.data, result.userId);
  return jsonResponse(conversation, 201);
}
