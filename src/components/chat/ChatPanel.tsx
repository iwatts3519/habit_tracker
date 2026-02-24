"use client";

import { useEffect, useRef, useMemo } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useChat } from "@/hooks/useChat";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
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
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const shortcuts = useMemo(
    () => [
      {
        key: "/",
        handler: () => chatInputRef.current?.focus(),
        description: "Focus chat input",
      },
      {
        key: "n",
        ctrl: true,
        shift: true,
        handler: () => createConversation(),
        description: "New conversation",
      },
    ],
    [createConversation]
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Habit Research Chat
        </h2>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-mono text-gray-500">
          / to focus
        </kbd>
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

      <ChatInput onSend={sendAndStream} disabled={isSending} textareaRef={chatInputRef} />
    </div>
  );
}
