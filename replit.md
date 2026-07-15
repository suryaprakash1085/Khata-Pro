# KhataPro

A bookkeeping/ledger ("khata") platform admin console — lets platform operators manage businesses, customers, transactions, reminders, subscriptions, and staff from a CRM-style dashboard, backed by an Express API and Postgres.

## Run & Operate

- Workflows (already configured, start automatically): `artifacts/api-server: API Server`, `artifacts/khata-admin: web`, `artifacts/mockup-sandbox: Component Preview Server`
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, mounted at `/api`)
- `pnpm --filter @workspace/khata-admin run dev` — run the admin dashboard (served at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (already provisioned)
- Seeded admin login: `admin@khatapro.in` / `Admin@123` (role: admin) — created manually since the imported project had no seed data.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (`artifacts/api-server`)
- Admin frontend: React + Vite (`artifacts/khata-admin`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`, schema in `lib/db/src/schema`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server` — Express API (routes: auth, admin, businesses, customers, reminders, reports, transactions)
- `artifacts/khata-admin` — admin dashboard frontend (pages: dashboard, businesses, users, subscriptions, reminders, reports, audit-logs, broadcast, settings)
- `artifacts/mockup-sandbox` — canvas/design preview sandbox (not user-facing app functionality)
- `lib/db/src/schema` — Drizzle schema: users, businesses, customers, transactions, reminders, subscriptions, staff, audit_logs
- `lib/api-spec/openapi.yaml` — source of truth for API contracts (drives codegen)

## Architecture decisions

- Project was imported from GitHub already structured as a Replit pnpm-workspace multi-artifact project (api-server + khata-admin + mockup-sandbox), just not yet registered with the platform's artifact/workflow registry on import.

## Product

Admin/operator console for a merchant ledger app: manage businesses (tenants), their customers/transactions/reminders, subscriptions, staff, audit logs, and broadcast messaging.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- No seed data ships with the imported project — the `users` table was empty, so a seed admin user was inserted manually (see credentials above) to verify login end-to-end.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
