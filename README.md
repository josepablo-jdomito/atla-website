# Atla Website

Static Vite site wired to Sanity for content and prepared for Vercel deployment.

Use Node 22 for local work. The public site builds on this machine, but the Sanity CLI currently fails under Node 25.

## App

- Public site: React + Vite in `client/`
- CMS: Sanity Studio in `studio/`
- Deployment target: Vercel for the site, Sanity-hosted Studio or local Studio dev

## Environment

Copy `.env.example` to `.env.local` for the site and export the Studio variables when running `studio/`.

- `VITE_SANITY_PROJECT_ID`
- `VITE_SANITY_DATASET`
- `VITE_SANITY_API_VERSION`
- `VITE_SANITY_STUDIO_URL`
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`

## Local development

```bash
npm install
npm run dev
```

For the Studio:

```bash
cd studio
npm install
npm run dev
```

## Sanity setup

1. Create or select a Sanity project.
2. Set the project ID and dataset in `.env.local`.
3. Start the Studio in `studio/` and publish:
   - one `Site Settings` document
   - one or more `Project` documents with `status = published`
4. Mark featured projects with `featured = true` to surface them on the homepage.

## Vercel

The Vercel config builds the Vite app and rewrites all routes to `index.html` for SPA routing.

Before deploying, add these environment variables in Vercel:

- `VITE_SANITY_PROJECT_ID`
- `VITE_SANITY_DATASET`
- `VITE_SANITY_API_VERSION`
- `VITE_SANITY_STUDIO_URL`
