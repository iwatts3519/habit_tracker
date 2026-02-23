# Phase 2: Database Schema & API

**Status**: 📋 Planned
**Completion**: 0%

## Goal
Design and implement the SQLite database schema for goals, habits, chat conversations, and messages. Build Next.js API routes with Zod-validated request/response handling.

## Sub-Phases

### Phase 2A: Schema Design & Migrations
- Define tables: `goals`, `habits`, `conversations`, `messages`
- Create a migration system (simple SQL scripts run on startup)
- Seed data for development

### Phase 2B: Data Access Layer
- Create typed helper functions for each table (CRUD)
- Use Zod schemas for input validation and type inference
- Handle SQLite-specific concerns (WAL mode, foreign keys)

### Phase 2C: API Routes
- `GET/POST /api/goals` - List and create goals
- `GET/PUT/DELETE /api/goals/[id]` - Single goal operations
- `GET/POST /api/habits` - List and create habits
- `GET/PUT/DELETE /api/habits/[id]` - Single habit operations
- `GET/POST /api/conversations` - List and create conversations
- `GET/POST /api/conversations/[id]/messages` - Messages within a conversation

## Files to Create
- `src/lib/db.ts` - Database connection and initialisation (update from Phase 1)
- `src/lib/schema.sql` - SQL schema definitions
- `src/lib/queries/goals.ts` - Goal data access functions
- `src/lib/queries/habits.ts` - Habit data access functions
- `src/lib/queries/conversations.ts` - Conversation data access functions
- `src/lib/queries/messages.ts` - Message data access functions
- `src/types/index.ts` - Zod schemas and inferred TypeScript types
- `src/app/api/goals/route.ts` - Goals collection endpoint
- `src/app/api/goals/[id]/route.ts` - Single goal endpoint
- `src/app/api/habits/route.ts` - Habits collection endpoint
- `src/app/api/habits/[id]/route.ts` - Single habit endpoint
- `src/app/api/conversations/route.ts` - Conversations endpoint
- `src/app/api/conversations/[id]/messages/route.ts` - Messages endpoint

## Success Criteria
- [ ] Database tables are created automatically on first run
- [ ] All API routes return proper JSON responses
- [ ] Zod validation rejects invalid input with 400 errors
- [ ] Foreign key constraints enforced (habits belong to goals)
- [ ] All queries are parameterised (no SQL injection)
- [ ] API routes have co-located tests
