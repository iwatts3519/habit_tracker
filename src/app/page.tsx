"use client";

import { SplitPane } from "@/components/layout/SplitPane";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";

export default function Home() {
  return (
    <ToastProvider>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </ToastProvider>
  );
}
