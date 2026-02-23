"use client";

import { SplitPane } from "@/components/layout/SplitPane";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { UserMenu } from "@/components/auth/UserMenu";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";

export default function Home() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <div className="flex h-screen flex-col">
          <UserMenu />
          <div className="flex-1 overflow-hidden">
            <SplitPane
              left={
                <ErrorBoundary>
                  <ChatPanel />
                </ErrorBoundary>
              }
              right={
                <ErrorBoundary>
                  <GoalsPanel />
                </ErrorBoundary>
              }
            />
          </div>
        </div>
      </ErrorBoundary>
    </ToastProvider>
  );
}
