"use client";

import { useChatStore } from "@/stores/chatStore";
import type { Message } from "@/types";

export function useChat() {
  const store = useChatStore();

  const sendAndStream = async (content: string) => {
    let convId = store.activeConversationId;
    if (!convId) {
      const conv = await store.createConversation();
      convId = conv.id;
    }

    await store.sendMessage(content);

    store.addAssistantMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: convId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Chat request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          const json = trimmed.slice(6);
          try {
            const parsed = JSON.parse(json) as
              | { token: string }
              | { done: true; message: Message }
              | { error: string };

            if ("error" in parsed) {
              throw new Error(parsed.error);
            }

            if ("token" in parsed) {
              store.appendToLastAssistant(parsed.token);
            }

            if ("done" in parsed && "message" in parsed) {
              useChatStore.setState((state) => {
                const msgs = [...state.messages];
                msgs[msgs.length - 1] = parsed.message;
                return { messages: msgs };
              });
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== json) {
              throw parseErr;
            }
          }
        }
      }
    } catch (err) {
      useChatStore.setState((state) => {
        const msgs = [...state.messages];
        const last = msgs[msgs.length - 1];
        if (last?.role === "assistant" && !last.content) {
          msgs.pop();
        }
        return {
          messages: msgs,
          error: err instanceof Error ? err.message : "Failed to get response",
        };
      });
    } finally {
      store.setIsSending(false);
    }
  };

  return { sendAndStream };
}
