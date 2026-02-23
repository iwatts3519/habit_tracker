"use client";

import { create } from "zustand";
import type { Conversation, Message } from "@/types";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;

  fetchConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  createConversation: (title?: string) => Promise<Conversation>;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;

  sendMessage: (content: string) => Promise<void>;
  addAssistantMessage: (content: string) => void;
  appendToLastAssistant: (token: string) => void;
  setIsSending: (value: boolean) => void;

  clearError: () => void;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const conversations = await apiFetch<Conversation[]>("/api/conversations");
      set({ conversations, isLoadingConversations: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load conversations",
        isLoadingConversations: false,
      });
    }
  },

  selectConversation: async (id) => {
    set({ activeConversationId: id, isLoadingMessages: true, error: null });
    try {
      const data = await apiFetch<{ messages: Message[] }>(
        `/api/conversations/${id}/messages`
      );
      set({ messages: data.messages, isLoadingMessages: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load messages",
        isLoadingMessages: false,
      });
    }
  },

  createConversation: async (title) => {
    const conversation = await apiFetch<Conversation>("/api/conversations", {
      method: "POST",
      body: JSON.stringify({ title: title || "New Conversation" }),
    });
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: conversation.id,
      messages: [],
    }));
    return conversation;
  },

  deleteConversation: async (id) => {
    const prev = get().conversations;
    const wasActive = get().activeConversationId === id;
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      ...(wasActive ? { activeConversationId: null, messages: [] } : {}),
    }));
    try {
      await apiFetch(`/api/conversations/${id}`, { method: "DELETE" });
    } catch (err) {
      set({
        conversations: prev,
        error: err instanceof Error ? err.message : "Failed to delete conversation",
      });
    }
  },

  renameConversation: async (id, title) => {
    const prev = get().conversations;
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title } : c
      ),
    }));
    try {
      await apiFetch(`/api/conversations/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title }),
      });
    } catch (err) {
      set({
        conversations: prev,
        error: err instanceof Error ? err.message : "Failed to rename conversation",
      });
    }
  },

  sendMessage: async (content) => {
    const conversationId = get().activeConversationId;
    if (!conversationId) return;

    set({ isSending: true, error: null });
    try {
      const message = await apiFetch<Message>(
        `/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ role: "user", content }),
        }
      );
      set((state) => ({ messages: [...state.messages, message] }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to send message",
        isSending: false,
      });
    }
  },

  addAssistantMessage: (content) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `temp-${Date.now()}`,
          conversation_id: state.activeConversationId ?? "",
          role: "assistant",
          content,
          created_at: new Date().toISOString(),
        },
      ],
    }));
  },

  appendToLastAssistant: (token) => {
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last?.role === "assistant") {
        msgs[msgs.length - 1] = { ...last, content: last.content + token };
      }
      return { messages: msgs };
    });
  },

  setIsSending: (value) => set({ isSending: value }),

  clearError: () => set({ error: null }),
}));
