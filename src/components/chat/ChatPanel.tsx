"use client";

import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useChat } from "@/hooks/useChat";
import { ConversationList } from "./ConversationList";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatPanel() {
  const {
    conversations,
    activeConversationId,
    messages,
    isSending,
    error,
    fetchConversations,
    selectConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    clearError,
  } = useChatStore();

  const { sendAndStream } = useChat();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Habit Research Chat
        </h2>
      </header>

      <ConversationList
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={selectConversation}
        onCreate={() => createConversation()}
        onDelete={deleteConversation}
        onRename={renameConversation}
      />

      {error && (
        <div className="flex items-center justify-between bg-red-50 px-4 py-2 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="ml-2 font-medium text-red-800 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <MessageList messages={messages} isTyping={isSending} />

      <ChatInput onSend={sendAndStream} disabled={isSending} />
    </div>
  );
}
