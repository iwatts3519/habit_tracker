# Phase 10: Auth & Deployment

**Status**: 📋 Planned
**Completion**: 0%

## Goal
Implement user authentication (strategy TBD per Agents.md) and prepare the application for production deployment.

## Sub-Phases

### Phase 10A: Authentication
- Choose auth strategy (NextAuth.js, Clerk, or custom)
- Sign up, sign in, sign out flows
- Protected API routes (all data endpoints)
- Protected pages (redirect to login if unauthenticated)

### Phase 10B: Data Isolation
- Scope all database queries to the authenticated user
- Ensure users cannot access other users' data
- Add `user_id` column to all tables (migration)

### Phase 10C: Deployment Preparation
- Environment variable management (`.env.example`)
- Production build optimisation
- Database backup strategy for SQLite
- Health check endpoint
- README with deployment instructions

## Files to Create
- `src/lib/auth.ts` - Auth configuration and helpers
- `src/app/api/auth/[...nextauth]/route.ts` - Auth API routes (if using NextAuth)
- `src/app/login/page.tsx` - Login page
- `src/middleware.ts` - Route protection middleware
- `.env.example` - Environment variable template
- `src/app/api/health/route.ts` - Health check endpoint

## Success Criteria
- [ ] Users can sign up, sign in, and sign out
- [ ] All API routes require authentication
- [ ] Data is scoped to the authenticated user
- [ ] Production build completes without errors
- [ ] Environment variables documented in `.env.example`
- [ ] App can be deployed to a hosting platform
