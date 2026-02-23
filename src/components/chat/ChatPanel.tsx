"use client";

export function ChatPanel() {
  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Habit Research Chat
        </h2>
      </header>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-indigo-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900">
            Start a conversation
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Ask about habit formation, research, or get personalised advice.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about habits..."
            disabled
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-400
                       placeholder-gray-400"
          />
          <button
            disabled
            className="rounded-lg bg-indigo-400 px-4 py-2.5 text-sm font-medium text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
