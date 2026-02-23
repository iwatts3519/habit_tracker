# Phase 7: Chat Memory & Context

**Status**: ✅ Done
**Completion**: 100%

## Goal
Persist chat history to the SQLite database and implement context management so Claude can reference previous conversations and the user's goals/habits for personalised advice.

## Sub-Phases

### Phase 7A: Message Persistence
- Save all messages (user and assistant) to SQLite on send/receive
- Load conversation history from database on conversation select
- Paginate old messages for long conversations

### Phase 7B: Context Windowing
- Implement a token-aware context window (stay within Claude's limits)
- Summarise older messages when the window is exceeded
- Include recent messages + summary in each API call

### Phase 7C: Goal/Habit Context Injection
- Optionally include the user's current goals and habits in the system prompt
- Allow users to reference a specific goal or habit in chat ("Help me with my exercise goal")
- Claude can suggest creating new habits based on conversation

## Files to Create
- `src/lib/contextManager.ts` - Context windowing and token management
- `src/lib/contextManager.test.ts` - Context manager tests
- `src/lib/systemPrompt.ts` - Updated to inject goal/habit context
- `src/app/api/chat/route.ts` - Updated to persist messages and build context

## Success Criteria
- [x] Chat history persists across page reloads
- [x] Conversations load from database correctly
- [x] Context window stays within Claude's token limits
- [x] Claude can reference the user's goals and habits
- [x] Old conversations can be continued with context intact
- [x] No duplicate messages on reload or reconnection
