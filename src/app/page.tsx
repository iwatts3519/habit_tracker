"use client";

import { SplitPane } from "@/components/layout/SplitPane";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { GoalsPanel } from "@/components/goals/GoalsPanel";

export default function Home() {
  return <SplitPane left={<ChatPanel />} right={<GoalsPanel />} />;
}
