# Yellow Jackets Coaching Implementation Plan

## Folder Structure

- `app/components`: layout, offline status, and reusable UI.
- `app/features`: domain calculations and permission logic.
- `app/lib`: sample data, Supabase client, validation, Dexie database, sync queue.
- `app/routes`: React Router Framework Mode route modules.
- `app/types`: shared domain types.
- `supabase/migrations`: PostgreSQL schema and RLS.
- `supabase/seed`: development seed helpers.
- `tests/unit` and `tests/e2e`: Vitest and Playwright coverage.

## Phase Checklist

- Phase 1 foundation: auth shell, protected app routes, mobile nav, roster, attendance, practice plan/run, E.A.T. points, notes, PWA, IndexedDB sync queue.
- Phase 1 hardening: replace sample data reads with Supabase queries, complete password reset, add richer forms, expand Playwright browser matrix.
- Phase 2: position groups, station groups, coach assignments, depth charts, packages, captains.
- Phase 3: game-day snap counting, 11-player lineup recording, 8U four-play enforcement, participation reports.

## Migrations Needed

- Initial schema for programs, age groups, profiles, memberships, players, practices, periods, attendance, competition, notes, settings.
- RLS policies based on active program membership and head coach access.
- Future-compatible tables for depth charts, packages, captains, games, snaps, and lineups.

## PWA And Offline Strategy

- `vite-plugin-pwa` generates the service worker and manifest.
- App shell, JS, CSS, and icons are precached; images use stale-while-revalidate.
- Dexie stores football records and a sync queue.
- Attendance, competition events, and notes write locally first, enqueue an operation, then attempt Supabase upserts when possible.
- The UI reports online, offline, pending, syncing, and failed sync states without claiming success before Supabase confirms.
