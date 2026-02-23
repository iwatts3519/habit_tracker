# Phase 5: Chat Interface

**Status**: 📋 Planned
**Completion**: 0%

## Goal
Build the left-hand chat UI with message bubbles, a text input area, typing indicators, and conversation management. This phase focuses on the UI only -- the AI integration comes in Phase 6.

## Sub-Phases

### Phase 5A: Message Display
- Scrollable message list with auto-scroll to latest
- User and assistant message bubbles with distinct styling
- Timestamps and message grouping
- Markdown rendering in assistant messages

### Phase 5B: Message Input
- Multi-line text input with send button
- Send on Enter, new line on Shift+Enter
- Character limit indicator
- Disabled state while awaiting response

### Phase 5C: Conversation Management
- Conversation list/selector in a sidebar or dropdown
- Create new conversation
- Delete conversation
- Conversation titles (auto-generated or user-defined)

## Files to Create
- `src/components/chat/ChatPanel.tsx` - Updated chat panel with all sub-components
- `src/components/chat/MessageList.tsx` - Scrollable message display
- `src/components/chat/MessageBubble.tsx` - Individual message bubble
- `src/components/chat/MessageBubble.test.tsx` - Message bubble tests
- `src/components/chat/ChatInput.tsx` - Text input with send functionality
- `src/components/chat/ChatInput.test.tsx` - Chat input tests
- `src/components/chat/ConversationList.tsx` - Conversation selector
- `src/components/chat/TypingIndicator.tsx` - Animated typing dots
- `src/stores/chatStore.ts` - Zustand store for chat state
- `src/hooks/useChat.ts` - Hook for chat operations

## Success Criteria
- [ ] Messages display with proper user/assistant styling
- [ ] Auto-scrolls to latest message
- [ ] Send on Enter, new line on Shift+Enter
- [ ] Typing indicator shows while awaiting response
- [ ] Users can switch between conversations
- [ ] Empty conversation shows a welcome/prompt message
- [ ] Markdown renders correctly in assistant messages
