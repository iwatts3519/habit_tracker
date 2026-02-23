import { NextRequest } from "next/server";
import {
  getAllConversations,
  createConversation,
} from "@/lib/queries/conversations";
import { createConversationSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";

export async function GET() {
  const conversations = getAllConversations();
  return jsonResponse(conversations);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = parseBody(createConversationSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const conversation = createConversation(parsed.data);
  return jsonResponse(conversation, 201);
}
