# Phase 6: Claude AI Integration

**Status**: ✅ Done
**Completion**: 100%

## Goal
Connect the chat interface to the Anthropic Claude API via a server-side API route. Implement streaming responses, error handling, and a habit-research-focused system prompt.

## Sub-Phases

### Phase 6A: API Route & Streaming
- Create `/api/chat` POST endpoint
- Integrate with Anthropic SDK (`@anthropic-ai/sdk`)
- Stream responses back to the client using Server-Sent Events or ReadableStream
- Handle API errors gracefully (rate limits, network failures, invalid key)

### Phase 6B: System Prompt & Persona
- Craft a system prompt that positions Claude as a habit research assistant
- Include guidance on evidence-based habit formation (e.g., Atomic Habits, BJ Fogg)
- Prompt should encourage structured, actionable advice

### Phase 6C: Client-Side Streaming
- Update chat store to handle streamed tokens
- Render partial messages as they arrive
- Handle stream interruptions gracefully

## Files to Create
- `src/app/api/chat/route.ts` - Chat API endpoint with Claude integration
- `src/lib/claude.ts` - Claude client configuration and helpers
- `src/lib/systemPrompt.ts` - System prompt definition
- `src/hooks/useChat.ts` - Updated to handle streaming responses

## Success Criteria
- [x] Messages sent to Claude and responses streamed back
- [x] Streaming renders tokens progressively in the UI
- [x] API key stored securely in environment variables (.env.local)
- [x] Graceful error messages for API failures
- [x] System prompt produces relevant, habit-focused responses
- [x] Stream interruptions handled gracefully with error recovery
