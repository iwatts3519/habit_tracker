# Habit Tracker - Project Plan

## Progress Tracker

| Phase | Name | Status | Completion |
|-------|------|--------|------------|
| 1 | Project Setup | 📋 Planned | 0% |
| 2 | Database Schema & API | 📋 Planned | 0% |
| 3 | Split-Pane Layout | 📋 Planned | 0% |
| 4 | Goals & Habits Panel | 📋 Planned | 0% |
| 5 | Chat Interface | 📋 Planned | 0% |
| 6 | Claude AI Integration | 📋 Planned | 0% |
| 7 | Chat Memory & Context | 📋 Planned | 0% |
| 8 | Habit Tracking & Progress | 📋 Planned | 0% |
| 9 | Polish & UX | 📋 Planned | 0% |
| 10 | Auth & Deployment | 📋 Planned | 0% |

## Phase Summaries

### Phase 1: Project Setup
Scaffold the Next.js 14+ project with TypeScript, Tailwind CSS, ESLint, Vitest, and SQLite. Establish the folder structure, tooling, and dev scripts defined in Agents.md.

### Phase 2: Database Schema & API
Design and implement the SQLite schema for goals, habits, chat conversations, and messages. Create Next.js API routes for all CRUD operations with Zod validation.

### Phase 3: Split-Pane Layout
Build the core split-pane layout with a resizable divider. Left pane for the chat experience, right pane for goals and habits. Responsive design that stacks on mobile.

### Phase 4: Goals & Habits Panel
Implement the right-hand panel with full CRUD for long-term goals and the habits that contribute to each goal. Support goal-habit relationships and ordering.

### Phase 5: Chat Interface
Build the left-hand chat UI with message bubbles, input area, typing indicators, and conversation management. Client-side state with Zustand.

### Phase 6: Claude AI Integration
Connect the chat interface to the Claude API via a server-side API route. Stream responses, handle errors, and provide habit-focused system prompts.

### Phase 7: Chat Memory & Context
Persist chat history to SQLite. Implement conversation threads, context windowing, and the ability to reference goals/habits within the chat for tailored advice.

### Phase 8: Habit Tracking & Progress
Add daily habit check-ins, streak tracking, and progress visualisation. Calendar heatmaps, streak counters, and completion statistics.

### Phase 9: Polish & UX
Loading states, error boundaries, animations/transitions, keyboard shortcuts, accessibility audit, and responsive refinements.

### Phase 10: Auth & Deployment
Implement authentication (strategy TBD), protect routes and API, and prepare for production deployment.

---

*Details for each phase are in `docs/phases/`.*
