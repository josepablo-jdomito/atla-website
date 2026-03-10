# WeLoveDaily — Replit Setup

## Stack
- **Framework**: Next.js 14 (App Router)
- **CMS**: Sanity v3 (`5g3gom5x` project, `production` dataset)
- **Styling**: Tailwind CSS + styled-components
- **Language**: TypeScript
- **Package manager**: npm

## Running the App
The app runs via the "Start application" workflow:
```
npm run dev   →  next dev -p 5000 -H 0.0.0.0
npm run start →  next start -p 5000 -H 0.0.0.0
```
Port 5000 is required for Replit's webview.

## Environment Variables
Set in Replit shared environment:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `5g3gom5x`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `NEXT_PUBLIC_SITE_URL` = `https://welovedaily.com`
- `NEXT_PUBLIC_SITE_URL_PRODUCTION` = `https://welovedaily.com`
- `NEXT_PUBLIC_SUBSTACK_URL` = `https://welovedaily.substack.com`

Set as Replit secrets:
- `SANITY_API_TOKEN` — read token for Sanity API

Optional secrets (not yet configured):
- `SANITY_WEBHOOK_SECRET`
- `DRAFT_API_SECRET`
- `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_TYPEFORM_SUBMIT_ID` / `NEXT_PUBLIC_TYPEFORM_ADVERTISE_ID` / `NEXT_PUBLIC_TYPEFORM_CONTACT_ID`

## Replit-Specific Changes Made
1. `package.json`: dev/start scripts updated to bind `0.0.0.0:5000`
2. `next.config.mjs`: CSP adds `unsafe-eval` in development mode only (needed for Next.js HMR)

## Authentication
Auth is powered by **Auth.js v5** (next-auth@beta) with a Credentials provider (email + password).

- **Config**: `src/auth.ts` — JWT strategy, bcryptjs for password hashing, `@auth/pg-adapter`
- **API routes**: `src/app/api/auth/[...nextauth]/route.ts` and `src/app/api/auth/signup/route.ts`
- **Pages**: `src/app/login/page.tsx` and `src/app/signup/page.tsx`
- **Navigation**: Sidebar shows "Sign in" / user name + "Sign out". Bottom tab bar has a profile tab.
- **Saved projects**: Authenticated users have saves linked via `auth:<userId>` prefix; anonymous users continue to use cookie-based IDs.

Environment variables set:
- `AUTH_SECRET` — randomly generated, stored in shared env

Database tables (PostgreSQL):
- `users` — id (uuid), email (unique), password (hashed), name, created_at
- `accounts`, `sessions`, `verification_tokens` — Auth.js adapter tables

## SEO & Accessibility
A SquirrelScan audit was run and the following fixes were applied:
- **Structured Data**: `articleJsonLd` now includes `author` (Organization) and uses a plain string URL for `image` (was ImageObject) — Structured Data score: 78 → 100
- **Accessibility**: Search button aria-label fixed to match visible text; honeypot form field moved inside `aria-hidden` wrapper div; footer email input given an explicit `<label>`
- **Core SEO**: Login/signup pages now have unique page titles via layout files (`src/app/login/layout.tsx`, `src/app/signup/layout.tsx`); category page handles null category names gracefully
- **E-E-A-T**: Article pages now show `<time>` element with publish date in the byline row; Contact page exists at `/contact`; Contact linked from sidebar and footer — E-E-A-T score: 77 → 85
- **Performance**: Both featured tiles on homepage now use `priority` prop for LCP optimisation
- **Newsletter form**: Footer subscribe button changed to a Link → Substack (was a form POST, now correctly routes to the external subscription flow)
- **Contact page**: `/contact` now exists and is linked in sidebar and footer
- Squirrel audit tool installed at `~/.local/bin/squirrel`; config at `squirrel.toml`

## Project Structure
```
src/
  app/          Next.js App Router pages
    login/      Login page
    signup/     Signup page
    api/auth/   NextAuth handlers + signup endpoint
  components/   Shared UI components
    layout/     AuthNav.tsx, SessionProviderWrapper.tsx added
  lib/          Sanity client, utilities
    db/         postgres.ts (pg Pool), savedProjects.ts
  auth.ts       Auth.js configuration
  middleware.ts Lightweight Edge middleware
  types/        TypeScript types
sanity/         Sanity schema definitions
public/         Static assets
```
