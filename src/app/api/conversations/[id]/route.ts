import { NextRequest } from "next/server";
import {
  getConversationById,
  updateConversation,
  deleteConversation,
} from "@/lib/queries/conversations";
import { updateConversationSchema } from "@/types";
import { jsonResponse, errorResponse, parseBody } from "@/lib/apiResponse";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const conversation = getConversationById(id);

  if (!conversation) {
    return errorResponse("Conversation not found", 404);
  }

  return jsonResponse(conversation);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(updateConversationSchema, body);

  if (!parsed.success) {
    return errorResponse(parsed.error, 400);
  }

  const conversation = updateConversation(id, parsed.data);

  if (!conversation) {
    return errorResponse("Conversation not found", 404);
  }

  return jsonResponse(conversation);
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const deleted = deleteConversation(id);

  if (!deleted) {
    return errorResponse("Conversation not found", 404);
  }

  return jsonResponse({ success: true });
}
