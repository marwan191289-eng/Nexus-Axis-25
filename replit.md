# Nexus Axis Legal

A professional legal services web platform for Nexus Axis Consultants — a boutique law firm established in 2009 with offices in Ajman, UAE and Cairo, Egypt. Clients can explore practice areas, book consultations, read legal insights, and manage their matters through a client portal.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/nexus-axis run dev` — run the frontend (port 18274)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, shadcn/ui, Wouter, TanStack Query, Framer Motion
- API: Express 5 + express-session (cookie sessions)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/` — Drizzle table definitions (users, practiceAreas, consultations, blogPosts, contactMessages)
- `artifacts/api-server/src/routes/` — Express route handlers (auth, practiceAreas, consultations, blog, contact, stats)
- `artifacts/nexus-axis/src/pages/` — All frontend pages
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit manually)
- `lib/api-zod/src/generated/` — Generated Zod validation schemas (do not edit manually)

## Architecture decisions

- Cookie-based sessions via `express-session` for auth (no JWT) — simpler for a law firm portal
- Password hashing with SHA-256 + salt (adequate for this use case, no bcrypt dependency needed)
- Dark-only UI (`.dark` class forced on `<html>`) — matches the authoritative brand identity
- All colors defined as HSL CSS custom properties in `index.css` for easy theming
- Stats endpoint returns hardcoded firm history numbers (clientsServed, casesWon) plus live DB counts

## Product

- **Homepage** — Hero, firm stats, practice areas overview, recent blog posts, consultation CTA
- **Practice Areas** — 6 areas: Commercial Litigation, Corporate Tax, Business Setup, HR Compliance, International Advisory, Real Estate
- **Consultation Booking** — 30/60/90 min sessions (AED 500/800/1100), form with practice area selection
- **Blog/Insights** — Legal articles with category filtering
- **Client Portal** — Protected page showing user's consultation history and statuses
- **Auth** — Register, login, logout with cookie sessions
- **Contact** — Contact form + UAE and Egypt office location cards
- **Pricing** — Consultation tier breakdown

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run codegen after every OpenAPI spec change: `pnpm --filter @workspace/api-spec run codegen`
- The `dark` class on `<html>` is forced via `useEffect` in `App.tsx` — the app is dark-mode only
- Blog posts and practice areas are seeded via `executeSql` in the agent session — re-seed after DB wipes
- `@apply dark` is invalid in Tailwind v4 — use class-based dark mode toggling via JS instead

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
