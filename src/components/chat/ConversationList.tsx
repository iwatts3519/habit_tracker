"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Conversation } from "@/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onRename,
}: ConversationListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startRename = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const commitRename = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      <div className="flex flex-col border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Conversations
          </span>
          <button
            onClick={onCreate}
            aria-label="New conversation"
            className="rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </button>
        </div>

        <div className="max-h-48 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="px-3 pb-3 text-xs text-gray-400">No conversations yet</p>
          ) : (
            <ul className="space-y-0.5 px-1 pb-2">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  {editingId === conv.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="w-full rounded-md border border-indigo-300 px-2 py-1.5 text-sm
                                 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => onSelect(conv.id)}
                      className={`group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm
                        transition-colors ${
                          activeId === conv.id
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <span className="flex-1 truncate">{conv.title}</span>
                      <span
                        className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => startRename(conv)}
                          aria-label="Rename conversation"
                          className="rounded p-0.5 text-gray-400 hover:text-gray-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                            <path d="m3.433 10.917.892-2.232a4 4 0 0 1 .874-1.276l4.92-4.918a1.621 1.621 0 0 1 2.293 2.293l-4.92 4.918a4 4 0 0 1-1.276.874l-2.232.893a.375.375 0 0 1-.49-.49Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(conv)}
                          aria-label="Delete conversation"
                          className="rounded p-0.5 text-gray-400 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                            <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5Z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete conversation?"
        message={`This will permanently delete "${deleteTarget?.title}" and all its messages.`}
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
