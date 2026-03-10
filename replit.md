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

## Project Structure
```
src/
  app/          Next.js App Router pages
  components/   Shared UI components
  lib/          Sanity client, utilities
  types/        TypeScript types
sanity/         Sanity schema definitions
public/         Static assets
```
