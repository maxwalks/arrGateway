# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build (Turbopack)
npm run lint     # ESLint
npx tsc --noEmit # type-check without building

# Seed the first admin user (requires env vars set)
ADMIN_EMAIL=x@x.com ADMIN_PASSWORD=secret ADMIN_NAME=Admin npx tsx scripts/seed-admin.ts
```

No test suite configured yet.

## Architecture

**Next.js 15 App Router** with two route groups sharing a single `app/layout.tsx` (Geist font, globals):

- `app/(auth)/` — unauthenticated pages (login). Minimal centered layout, no sidebar.
- `app/(dashboard)/` — authenticated pages. Layout fetches the user's `Profile` server-side and renders `Shell` (Sidebar + main slot). All dashboard pages receive the shell automatically.
- `app/api/` — Route Handlers that proxy to Radarr/Sonarr/qBittorrent. Never expose API keys to the client — all external service calls happen here or in Server Components via `lib/api/`.

**Auth flow (Supabase + `@supabase/ssr`):**

Three Supabase clients serve different contexts:
- `lib/supabase/client.ts` — browser client (anon key), used in `"use client"` components
- `lib/supabase/server.ts` — server client (cookie-based), used in Server Components and Route Handlers
- `lib/supabase/admin.ts` — service role client, used **only** in `/api/admin/*` routes for privileged ops

`middleware.ts` protects all routes except `/login`. For `/admin/*` it additionally queries `profiles.is_admin`. The `(dashboard)/layout.tsx` re-checks auth and fetches the full profile, passing it down via `Shell`.

**Permission system (`lib/permissions.ts`):**

Permissions live in `profiles.permissions` (JSONB). `hasPermission(profile, key)` returns `true` for admins unconditionally. Permission keys: `view_movies`, `delete_movies`, `view_series`, `delete_series`, `view_downloads`, `view_storage`. All mutating API routes enforce the relevant permission server-side — UI visibility is a secondary convenience.

**External API clients (`lib/api/`):**

- `radarr.ts` / `sonarr.ts` — typed `fetch` wrappers, `X-Api-Key` header, `cache: "no-store"`. Env vars: `RADARR_URL`, `RADARR_API`, `SONARR_URL`, `SONARR_API`.
- `qbittorrent.ts` (Phase 3) — cookie-session auth, module-level `SID` cache with expiry. Env vars: `QBITTORRENT_URL`, `QBITTORRENT_USERNAME`, `QBITTORRENT_PASSWORD`.

**Supabase schema** is in `supabase/schema.sql`. The `is_admin()` SQL function is a `security definer` helper used in RLS policies to avoid recursion. There is no INSERT RLS policy on `profiles` — all inserts go through the service role client in `/api/admin/invite`.

**Type cast pattern:** `@supabase/supabase-js` v2.98 has stricter generic constraints that break with hand-written `Database` types. `createAdminClient()` is intentionally untyped. All Supabase query results in `/api/admin/*` files use explicit casts: `as { data: Profile | null; error: unknown }`. Do not add the `<Database>` generic back to `createAdminClient`. Also: do not use partial selects (e.g. `.select("is_admin")`) in any new code — always use `.select("*")` and access the field from the full row.

**Design system:**

Tailwind v4 (CSS-first, no `tailwind.config.ts`). Custom properties defined in `app/globals.css` under `@theme inline`: `--color-background` (#050505), `--color-surface` (#0f0f0f), `--color-accent-purple` (movies), `--color-accent-lime` (series), `--color-accent-amber` (downloads). Use `cn()` from `lib/cn.ts` for conditional classes. UI primitives in `components/ui/`: `Card` (accent prop: purple/lime/amber/none), `Badge`, `Button` (primary/ghost/danger), `Modal` (Radix Dialog), `Spinner`.

**Env vars** (see `.env.example`):
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Media server at `192.168.0.149`: Radarr `:7878`, Sonarr `:8989`, qBittorrent `:8080`

**Docker:** `output: 'standalone'` in `next.config.ts`. Multi-stage Dockerfile (Phase 5). Image remotePatterns for `192.168.0.149` are pre-configured in `next.config.ts` — poster images from Radarr/Sonarr don't need a proxy.

## Implementation Status

- **Phase 1 ✅** — project init, Supabase clients, middleware, login page, seed script
- **Phase 2 ✅** — Shell layout, UI primitives, movies + series pages with delete
- **Phase 3 ✅** — qBittorrent downloads page, storage widget, dashboard home
- **Phase 4 ✅** — admin section (invite, user table, permissions form), permission guards
- **Phase 5** — Dockerfile, docker-compose
