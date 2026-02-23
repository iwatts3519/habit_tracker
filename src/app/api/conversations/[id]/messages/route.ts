import { NextRequest } from "next/server";
import { getConversationById } from "@/lib/queries/conversations";
import {
  getMessagesByConversationId,
  createMessage,
  getMessageCount,
} from "@/lib/queries/messages";
import { createMessageSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";
import { getAuthUserId } from "@/lib/authHelpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const { id } = await params;
  const conversation = getConversationById(id, result.userId);

  if (!conversation) {
    return errorResponse("Conversation not found", 404);
  }

  const limit = request.nextUrl.searchParams.get("limit");
  const offset = request.nextUrl.searchParams.get("offset");

  const messages = getMessagesByConversationId(
    id,
    limit ? parseInt(limit, 10) : undefined,
    offset ? parseInt(offset, 10) : undefined
  );

  const total = getMessageCount(id);

  return jsonResponse({ messages, total });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const result = await getAuthUserId();
  if ("error" in result) return result.error;

  const { id } = await params;
  const conversation = getConversationById(id, result.userId);

  if (!conversation) {
    return errorResponse("Conversation not found", 404);
  }

  const body = await request.json();
  const parsed = parseBody(createMessageSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const message = createMessage({
    conversation_id: id,
    ...parsed.data,
  });

  return jsonResponse(message, 201);
}
