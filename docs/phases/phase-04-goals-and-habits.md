# Phase 4: Goals & Habits Panel

**Status**: ✅ Done
**Completion**: 100%

## Goal
Implement the right-hand panel with full CRUD for long-term goals and the habits that contribute to each goal. Users can create goals, add habits under them, reorder items, and edit/delete as needed.

## Sub-Phases

### Phase 4A: Goals Management
- List all goals with expandable sections
- Create new goal form (title, description, target date)
- Edit goal inline or via modal
- Delete goal with confirmation (cascades to habits)

### Phase 4B: Habits Management
- Add habits under a specific goal
- Habit fields: name, description, frequency (daily/weekly/custom), cue, reward
- Edit and delete habits
- Visual grouping under parent goal

### Phase 4C: State Management
- Zustand store for goals and habits
- Optimistic updates with rollback on API failure
- Loading and error states

## Files to Create
- `src/components/goals/GoalsList.tsx` - Goals list with expand/collapse
- `src/components/goals/GoalCard.tsx` - Individual goal display
- `src/components/goals/GoalForm.tsx` - Create/edit goal form
- `src/components/goals/GoalForm.test.tsx` - Goal form tests
- `src/components/habits/HabitCard.tsx` - Individual habit display
- `src/components/habits/HabitForm.tsx` - Create/edit habit form
- `src/components/habits/HabitForm.test.tsx` - Habit form tests
- `src/stores/goalsStore.ts` - Zustand store for goals and habits
- `src/stores/goalsStore.test.ts` - Store tests
- `src/hooks/useGoals.ts` - Hook for goal operations
- `src/hooks/useHabits.ts` - Hook for habit operations

## Success Criteria
- [x] Users can create, read, update, and delete goals
- [x] Users can create, read, update, and delete habits under goals
- [x] Habits visually nest under their parent goal
- [x] Optimistic UI updates with error rollback
- [x] Form validation via Zod schemas
- [x] Empty states with helpful prompts
