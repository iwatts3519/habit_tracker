import { NextRequest } from "next/server";
import { getClaudeClient, CLAUDE_MODEL, MAX_TOKENS } from "@/lib/claude";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { getConversationById } from "@/lib/queries/conversations";
import { getMessagesByConversationId, createMessage } from "@/lib/queries/messages";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation_id } = body as { conversation_id: string };

    if (!conversation_id) {
      return Response.json(
        { error: "conversation_id is required" },
        { status: 400 }
      );
    }

    const conversation = getConversationById(conversation_id);
    if (!conversation) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const dbMessages = getMessagesByConversationId(conversation_id);
    const claudeMessages = dbMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    if (claudeMessages.length === 0 || claudeMessages[claudeMessages.length - 1].role !== "user") {
      return Response.json(
        { error: "Conversation must end with a user message" },
        { status: 400 }
      );
    }

    const client = getClaudeClient();

    const stream = await client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    let fullContent = "";

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const token = event.delta.text;
              fullContent += token;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
              );
            }
          }

          const saved = createMessage({
            conversation_id,
            role: "assistant",
            content: fullContent,
          });

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, message: saved })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : "Stream failed";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMsg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = message.includes("ANTHROPIC_API_KEY") ? 500 : 400;
    return Response.json({ error: message }, { status });
  }
}
