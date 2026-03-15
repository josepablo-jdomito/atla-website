# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Main App (client + server)

The root-level `client/` + `server/` form the main Atla design studio web app:

- **Frontend**: React + Vite + TanStack Query + Wouter router + Tailwind CSS (v4)
- **Backend**: Express at `server/` — REST API routes at `/api/*`
- **Database**: PostgreSQL + Drizzle ORM (schema at `shared/schema.ts`)
- **CMS**: Portfolio and journal content are read from Sanity
- **Admin UI**: `/admin/projects` is retired and only shows a legacy notice
- **Journal publishing**: published Sanity journal entries drive the API, prerendered SEO pages, and sitemap
- **API routes**:
  - `GET /api/projects` — list all portfolio projects from Sanity (add `?featured=true` for homepage projects)
  - `GET /api/projects/:slugOrId` — single portfolio project from Sanity by slug or ID
  - `POST /api/projects` — legacy write route, retired when Sanity is active
  - `PATCH /api/projects/:id` — legacy write route, retired when Sanity is active
  - `DELETE /api/projects/:id` — legacy write route, retired when Sanity is active
  - `GET /api/journal` — list published journal articles from Sanity
  - `GET /api/journal/:slug` — single published journal article from Sanity
- **Figma assets**: served from `client/public/figmaAssets/` (logo `p-framer-text.png`, toggle icons, media, photos, hero, symbol)
- **Mockup sandbox**: live component previews at `/__mockup/preview/atla/*`
- **Shared layout modules**: `client/src/components/atla/AtlaNav.tsx` (navbar + mobile menu overlay) and `client/src/components/atla/AtlaFooter.tsx` — import and drop into any page
- **Pages**:
  - `/` → `client/src/pages/ElementDefault.tsx` — Home (1200×750px gallery + bottom strip)
  - `/about` → `client/src/pages/AtlaAbout.tsx` — About (hero + About/Team/Services/Clients/Honors sections)
  - `/admin/projects` → `client/src/pages/ProjectsAdmin.tsx` — retired legacy admin notice
- **Fonts**: Libre Franklin + Roboto Mono (Google Fonts via `<link>` in index.html), ABC Synt Variable Unlicensed Trial + PP Playground (local fallback via `@font-face`)

## Vercel Deployment

- **`vercel.json`** at root — builds with `npm run build`, serves static SPA from `dist/public`, routes `/api/*` to a serverless function
- **`api/index.ts`** — Vercel serverless entry point; imports the Express app from `server/app.ts`
- **`server/app.ts`** — shared Express app setup (middleware + routes) used by both local `server/index.ts` and the Vercel serverless function; does NOT call `.listen()`
- Requires `DATABASE_URL` environment variable set in Vercel project settings
- Requires `SANITY_JOURNAL_*` environment variables in Vercel so journal routes, prerendered SEO pages, and the sitemap can build from Sanity content
- `npm run audit:journal` audits published or scheduled journal entries straight from Sanity

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
