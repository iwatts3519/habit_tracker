# Phase 3: Split-Pane Layout

**Status**: 📋 Planned
**Completion**: 0%

## Goal
Build the core application layout: a horizontally split view with a resizable divider. The left pane hosts the chat interface; the right pane hosts the goals and habits panel. On mobile, the panes stack vertically with tab-based navigation.

## Sub-Phases

### Phase 3A: Desktop Split Pane
- Create a `SplitPane` component with a draggable divider
- Persist pane width ratio to localStorage
- Set sensible min/max widths for each pane

### Phase 3B: Mobile Responsive Layout
- Stack panes vertically on screens below `md` breakpoint
- Add a tab bar or toggle to switch between Chat and Goals views
- Ensure smooth transitions between layouts

### Phase 3C: Shell Components
- Create placeholder `ChatPanel` component (left)
- Create placeholder `GoalsPanel` component (right)
- Add a minimal header/toolbar if needed

## Files to Create
- `src/components/layout/SplitPane.tsx` - Resizable split pane container
- `src/components/layout/SplitPane.test.tsx` - Split pane tests
- `src/components/layout/MobileNav.tsx` - Mobile tab navigation
- `src/components/chat/ChatPanel.tsx` - Chat panel shell
- `src/components/goals/GoalsPanel.tsx` - Goals panel shell
- `src/app/page.tsx` - Updated to use split layout

## Success Criteria
- [ ] Desktop shows side-by-side panes with draggable divider
- [ ] Divider position persists across page reloads
- [ ] Mobile shows single pane with tab switching
- [ ] Layout transitions smoothly between breakpoints
- [ ] Pane min/max widths prevent unusable states
