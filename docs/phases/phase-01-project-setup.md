# Phase 1: Project Setup

**Status**: ✅ Done
**Completion**: 100%

## Goal
Scaffold the Next.js 14+ application with all required tooling: TypeScript (strict), Tailwind CSS, ESLint, Vitest, and SQLite (via better-sqlite3). Establish the project structure and dev scripts from Agents.md.

## Sub-Phases

### Phase 1A: Next.js Scaffold
- Initialise Next.js 14+ with App Router and TypeScript
- Configure `tsconfig.json` with strict mode and path aliases (`@/`)
- Set up Tailwind CSS with a base theme

### Phase 1B: Tooling & Scripts
- Configure ESLint with Next.js and TypeScript rules
- Set up Vitest with React Testing Library
- Add npm scripts: `dev`, `build`, `typecheck`, `lint`, `test`

### Phase 1C: Project Structure & Dependencies
- Create the `src/` folder structure (app, components, lib, hooks, stores, types)
- Install core dependencies: `zustand`, `zod`, `better-sqlite3`
- Create a `.gitignore` with appropriate entries
- Add a base layout and placeholder home page

## Files to Create
- `package.json` - Project config and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind configuration
- `vitest.config.ts` - Vitest configuration
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Home page placeholder
- `src/app/globals.css` - Global styles with Tailwind directives
- `src/types/index.ts` - Shared type definitions (initially empty)
- `src/lib/db.ts` - SQLite database initialisation

## Success Criteria
- [x] `npm run dev` starts the app at localhost:3000
- [x] `npm run typecheck` passes with zero errors
- [x] `npm run lint` passes with zero errors
- [x] `npm run test` runs (even if no tests yet)
- [x] Folder structure matches Agents.md specification
- [ ] SQLite database file is created on first run (db module ready, triggered in Phase 2)
