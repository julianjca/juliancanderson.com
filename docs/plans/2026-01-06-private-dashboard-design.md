# Private Personal Dashboard (Supabase) — Product + Technical Spec

Date: 2026-01-06  
Status: Draft (internal-first; public sharing deferred)  
Repo context: Next.js **pages** router app (`src/pages/*`) with React Query already set up in `src/pages/_app.tsx`.

## Summary

Build a rich private dashboard at `/dashboard` for organizing Julian’s life (tasks/projects, notes, reading, routines, analytics), gated by Supabase Auth (**email + password**), with **sign-ups disabled** (only the pre-created owner can log in). The system is designed from day 1 to optionally publish a curated “public dashboard” and selective public/unlisted items later, but the near-term focus is internal tooling.

---

## Goals

- **Private, owner-only dashboard** for daily operation (fast, polished UI; charts; keyboard-friendly).
- **Single source of truth** in **Supabase Postgres** (RLS enforced; minimal bespoke backend).
- **Actionable overview**: Today + tasks board + routines + analytics.
- **Future-proof sharing**: data model supports public/unlisted publishing later without rewriting core tables.

## Non-Goals (for early phases)

- Multi-user collaboration / teams.
- Mobile native app (responsive web is enough).
- Perfect “unlisted cannot be enumerated” guarantees (treat unlisted as “link-only”; harden later if needed).
- Dark mode (explicitly deferred).
- MFA (explicitly deferred).

---

## Primary User + Access Control

### Identity

- Single “owner” user (Julian) authenticated via **Supabase Auth (email + password)**.
- **Sign-ups disabled** in Supabase Auth settings.
- Owner user is created manually/admin-seeded; no UI path to create accounts.

### App gating

- All `/dashboard/*` routes require a valid session; unauthenticated requests redirect to `/login`.
- Add a “belt and suspenders” allowlist check (e.g., owner email/user id via env var) to prevent accidental access if sign-up rules change.

---

## Information Architecture

### Private pages

- `/login`
- `/dashboard` (Overview widget grid)
- `/dashboard/today`
- `/dashboard/tasks`
- `/dashboard/projects`
- `/dashboard/notes`
- `/dashboard/reading`
- `/dashboard/analytics`
- `/dashboard/public` (configuration UI; deferred)
- `/dashboard/settings`

### Public pages (later)

- `/public` (curated dashboard)
- `/public/notes/[slug]`, `/public/reading/[slug]`, `/public/tasks/[slug|board]` (exact URLs TBD)
- Existing public pages (e.g., `/now`, `/bookshelf`) may evolve to source from Supabase later.

---

## Core Data Model (Conceptual)

### Shared concepts

- `owner_id` on every private row, referencing `auth.users.id`.
- `tags` as `text[]` for quick filtering (upgrade to normalized table later if needed).
- `visibility` enum on shareable objects: `private | unlisted | public` (default `private`).

### Tasks + Projects

- **Board columns (default):** `Backlog → Next → Doing → Blocked → Done`
- Tasks support:
  - Status/column (`status` string, not hard-coded enum, so you can rename columns later)
  - Priority, due dates, completion timestamps
  - Optional project association
  - Sorting within a column (`sort_order`)
- Projects support:
  - Status (active/archived), color, and summary metrics

### Notes (Knowledge Base)

- Markdown-first notes (`body_md`) with:
  - Tags
  - Pinning
  - Optional linkage to a project
- Note “types” (for routines and structure):
  - `note` (general)
  - `daily` (auto-created on opening Today)
  - `weekly` (auto-created on Sunday evening cadence)

### Reading

- Reading items with a simple pipeline:
  - `to_read → reading → finished` (+ optional `abandoned` later)
- Reading sessions (minutes/pages with timestamps) to power charts and streaks.

---

## Routines

### Daily note

- On entering `/dashboard/today`, auto-create/open today’s `daily` note (timezone aware).
- Template (editable in Settings):
  - Focus / Top 3
  - Schedule blocks (text for now; calendar overlay later)
  - Log / wins / blockers

### Weekly review

- Cadence: **Sunday evening**.
- Auto-create/open a `weekly` note with:
  - Rollups: tasks completed, tasks in Doing/Blocked, overdue risks, notes created, reading minutes/pages
  - Prompts: wins, what didn’t work, lessons, next week focus, backlog grooming decisions
- Start with in-app reminders (no email/push by default). Snooze/disable available.

---

## Workflows (Internal)

### Overview (widget grid)

- A configurable grid of cards that provide:
  - “Top 3 today” (pulled from Today + tasks)
  - Inbox capture (create task/note/reading quickly)
  - Due soon / overdue
  - Project progress summaries
  - Reading progress + streak
  - Recent notes
  - Mini sparklines for key trends
- Click-through from widgets to the underlying view.

### Today

- Combines:
  - Daily note (edit/preview/split)
  - Top tasks for today
  - Calendar timeline (later integration; read-only)
  - Quick capture

### Tasks

- Main board with the five default columns.
- Saved views as filters over the same tasks table (not separate task types), e.g.:
  - Inbox / Untriaged (policy: `Backlog` is the “inbox” unless a dedicated flag is added)
  - Today (due today / manually pinned)
  - Next (status=Next)
  - Blocked (status=Blocked)
  - Done (recently completed)
- Future: recurring tasks, WIP limits, dependencies, cycle time.

### Projects

- Project list with status + progress metrics.
- Project detail:
  - Tasks filtered by project
  - Related notes
  - Lightweight “project summary” markdown section

### Notes

- Markdown textarea + preview (toggle: Edit / Preview / Split).
- Search + tag filtering.
- Pinned notes list.
- Future: backlinks/wikilinks, note graph, version history, attachments.

### Reading

- Reading queue and status pipeline.
- Session logging (minutes/pages) to feed analytics.
- Future: highlights/quotes, reading notes per item, imports/exports.

### Search + navigation

- Global search across tasks/projects/notes/reading (initially simple “starts with” / tag filters).
- Future: Postgres full-text search, fuzzy matching, command palette.

---

## Analytics (Charts)

Charts should feel first-class and consistent with the site’s design tokens.

### Tasks

- Throughput: tasks completed per week
- WIP: count per status (Backlog/Next/Doing/Blocked/Done)
- Backlog size over time
- Due-date risk: overdue and due soon
- Future: cycle time distribution, lead time, aging WIP

### Notes

- Notes created per week
- Daily note streak
- “Active projects” trend (projects with recent activity)

### Reading

- Minutes per week (and pages per week if logged)
- Streaks
- Completion rate

---

## Future Modules (Optional)

These are explicitly **not** required for the initial internal rollout, but the architecture should make them natural additions.

### Goals

- Multi-horizon goals (e.g., year/quarter/month) tied to projects and habits.
- “Goal check-ins” with simple qualitative notes + a quantitative score.

### Habits

- Habit definitions (frequency target) and daily/weekly check-ins.
- Streaks and trend charts; link habits to goals.

### Journal / Prompts

- A dedicated “journal” note type (or prompts attached to daily notes).
- Prompt library + scheduled prompts (e.g., nightly reflection).

### Health / Workouts

- Workout log (type, duration, intensity) and basic metrics over time.
- Links to habits/goals (e.g., strength training goal).

### Money

- Lightweight budgeting (categories + monthly targets) and net worth snapshots.
- Transactions import later (bank sync is out of scope unless explicitly desired).

### Content Pipeline

- Ideas → drafts → published workflow for writing.
- Editorial calendar view (separate from Google Calendar).

---

## Public Sharing (Deferred, Designed-In)

### Visibility model

- Every shareable object supports `visibility`:
  - `private`: only owner
  - `unlisted`: accessible via direct link later (slug-based)
  - `public`: visible on public pages and eligible for “public dashboard” widgets

### Public dashboard

- A curated public page composed of “widgets” (e.g., “What I’m working on”, “Reading now”, charts).
- Only “public-safe” widget types can be published.
- Goal: allow selective transparency (people can see what you’re working on) without exposing private content.

---

## Integrations (Deferred, Spec’d)

### Google Calendar (read-only)

- OAuth with minimal read scopes.
- Private dashboard can show **full event titles/details** in Today.
- Data handling: fetch on demand; avoid long-term storage of event bodies.
- Calendar selection UI: include/exclude specific calendars.
- Failure modes: graceful “not connected / token expired” states.

---

## Deployment + Environments (Vercel)

- Hosting: **Vercel**
- Use Vercel environment variables for Supabase config and owner allowlist.
- Scheduled jobs (later): **Vercel Cron** for weekly review creation, backups, reminders.

---

## Technical Architecture

### Frontend

- Next.js pages router:
  - `/dashboard/*` uses a shared “authenticated shell” layout (sidebar/topbar + main content).
- React Query for client-side data fetching/caching (already present).
- Charting library: TBD (pick one and wrap in house components for consistent styling).

### Supabase

- Supabase Postgres as the system of record.
- Schema managed by migrations (no clickops-only schema).
- **RLS enabled** everywhere; policies restrict by `owner_id` and future `visibility` rules.

### API routes

- Prefer direct Supabase queries from the client for private pages where RLS provides guarantees.
- Use Next API routes when:
  - server-only secrets are needed (service role for public page generation later)
  - derived analytics endpoints are beneficial
  - scheduled jobs run via Vercel Cron

---

## Security Model

- **Sign-ups disabled** in Supabase Auth.
- Owner allowlist check in app (env-based) to prevent unexpected access.
- RLS “deny by default” posture.
- Public sharing uses an explicit “public-safe” projection layer (no accidental leakage of private fields).

---

## UI / Design System

- Keep the existing editorial warmth (fonts, neutral palette, orange accent).
- Dashboard-specific tokens for surfaces/borders/text tiers that map to existing CSS variables.
- Interaction polish:
  - skeleton loaders
  - optimistic updates for capture
  - great empty states
- No dark mode for now; maintain token structure so it can be added later.

---

## Roadmap (Phased)

### Phase 0 — Foundations

- Supabase project + auth config (email/password; sign-ups disabled; owner created)
- DB schema + migrations + RLS
- `/login` + `/dashboard` auth gate + base layout shell

### Phase 1 — Internal Core

- Tasks board (Backlog/Next/Doing/Blocked/Done) + basic filters/tags
- Projects + project detail view
- Notes (markdown editor + search + tags + pinned)
- Reading list + basic status updates
- Overview page with a small set of widgets (non-configurable initially)

### Phase 2 — Routines + Analytics

- Daily note flow + template editor
- Weekly review generation (manual first; cron later)
- Analytics dashboards + sparklines

### Phase 3 — Integrations + Automation

- Google Calendar read-only integration for Today timeline
- Vercel Cron jobs: weekly review auto-create, backups/exports, reminders

### Phase 4 — Public Sharing

- Per-item visibility UI (private/unlisted/public)
- Curated public dashboard builder
- Public-safe widgets (e.g., “What I’m working on”, selected reading, charts)

### Phase 5 — Power Features

- Full-text search + command palette
- Recurring tasks + cycle time analytics
- Backlinks/wikilinks for notes
- Imports/exports with idempotency

### Phase 6 — Life System Expansion

- Goals + habits + streak analytics
- Journal prompts + scheduled reflections
- Health/workouts tracking
- Money/budgeting (if desired)
- Content pipeline management

---

## Open Decisions / TBD

- Charting library choice (and how we theme it via CSS variables).
- Recurring tasks model (simple interval vs RRULE).
- Whether “Inbox” is a dedicated status or a separate `is_inbox` boolean.
- Exact public URLs and which existing public pages should be powered by Supabase (e.g., `/now`).
- Search strategy: simple queries first vs Postgres FTS in early phases.
- Exact scope of “life system” modules (goals/habits/health/money/content) and the order to add them.
