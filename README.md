# Yellow Jackets Coaching

Mobile-first coaching app foundation for the Yellow Jackets youth tackle football program. The MVP supports the program dashboard, protected app shell, roster management, attendance, 90-minute practice plans, sideline practice mode, Gold vs. Black E.A.T. points with undo, coaching notes, PWA installation, and IndexedDB sync queue infrastructure.

## Stack

React Router Framework Mode, TypeScript, Vite, Tailwind CSS, Supabase, Supabase Auth, PostgreSQL, Dexie, Zod, React Hook Form, Vitest, Playwright, and Netlify.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` when a Supabase project exists.
4. Run locally: `npm run dev`

The MVP includes a development sign-in shortcut with fictional coaches. Use `head.coach@example.com` on `/login`. When Supabase env vars are present, sign-in also calls Supabase Auth.

## Supabase

Apply `supabase/migrations/0001_initial_schema.sql`, then use `supabase/seed/seed.sql` as a development starting point. Create Supabase Auth users separately and link them to `profiles` and `program_members`. Do not put the service-role key in browser env vars.

Required browser variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Commands

- `npm run dev`: start development server.
- `npm run typecheck`: generate React Router types and run TypeScript.
- `npm run lint`: run ESLint.
- `npm run test`: run unit tests.
- `npm run test:e2e`: run Playwright MVP flow.
- `npm run build`: production build.
- `npm run start`: serve the built React Router app.

## Netlify

`netlify.toml` uses `npm run build` and publishes `build/client`. Configure Supabase redirect URLs for the Netlify production URL and local development URL. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify environment variables.

## PWA Testing

Run a production build and serve it, then open the app in Chrome or Safari. Confirm the manifest name is Yellow Jackets Coaching, the short name is Jackets, and install is offered without repeated prompts. Reload once, go offline, and confirm `/app` still opens from the service worker app shell.

## Offline Testing

Open DevTools and switch Network to offline. Record attendance, award an E.A.T. point, or add a note. The UI updates immediately and the sync status shows local or pending work. Return online and use Sync Status to retry. Supabase sync requires valid env vars and applied migrations.

## Current Limitations

Data is seeded in app code for the first usable MVP. Supabase schema, RLS, and client plumbing are present, but full cloud-backed CRUD and invite/password-reset flows need the Supabase project configured. Game-day snap counting is intentionally a Phase 3 foundation only.

## Recommended Phase 2

Connect route loaders/actions to Supabase, finish role-specific route guards, build depth chart and package editors, add coach assignment workflows, expand sync conflict handling, and add captain history screens.
