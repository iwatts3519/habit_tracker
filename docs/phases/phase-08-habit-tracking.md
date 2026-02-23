# Phase 8: Habit Tracking & Progress

**Status**: 📋 Planned
**Completion**: 0%

## Goal
Add daily habit check-ins, streak tracking, and progress visualisation so users can track their consistency and see their progress over time.

## Sub-Phases

### Phase 8A: Daily Check-In
- Toggle habits as complete/incomplete for today
- Quick check-in UI integrated into the habits panel
- Prevent future-dating completions

### Phase 8B: Streak & Statistics
- Calculate current streak and longest streak per habit
- Overall completion rate (last 7 days, 30 days, all time)
- Store completion records in SQLite (`habit_completions` table)

### Phase 8C: Progress Visualisation
- Calendar heatmap showing completion history (GitHub-style)
- Streak counter badges on habit cards
- Simple bar/line charts for weekly/monthly trends
- Goal progress indicators (percentage of contributing habits on track)

## Files to Create
- `src/lib/queries/completions.ts` - Completion data access functions
- `src/app/api/habits/[id]/completions/route.ts` - Completions API endpoint
- `src/components/habits/HabitCheckIn.tsx` - Daily check-in toggle
- `src/components/habits/StreakBadge.tsx` - Streak counter display
- `src/components/progress/CalendarHeatmap.tsx` - Completion heatmap
- `src/components/progress/ProgressChart.tsx` - Trend charts
- `src/components/progress/GoalProgress.tsx` - Goal completion indicator
- `src/hooks/useCompletions.ts` - Hook for completion operations
- `src/stores/goalsStore.ts` - Updated with completion state

## Success Criteria
- [ ] Users can mark habits as complete for today
- [ ] Streaks calculated correctly (including broken streaks)
- [ ] Calendar heatmap displays past completions
- [ ] Statistics update in real-time on check-in
- [ ] Completion data persists in SQLite
- [ ] Goal progress reflects contributing habit performance
