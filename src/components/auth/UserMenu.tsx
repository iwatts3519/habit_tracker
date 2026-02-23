"use client";

import { signOut, useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
        {(session.user.name?.[0] ?? session.user.email?.[0] ?? "U").toUpperCase()}
      </div>
      <span className="flex-1 truncate text-sm text-gray-700">
        {session.user.name || session.user.email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
