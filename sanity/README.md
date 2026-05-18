# Atla Sanity Notes

The live site now reads both the portfolio and the journal from Sanity.

The journal schema lives in this repo. The portfolio bridge is implemented in
[projectService.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/server/sanity/projectService.ts),
and the required portfolio field contract is documented in
[docs/portfolio-sanity-fields.md](/Users/josepablo/.codex/worktrees/74cd/New%20project/docs/portfolio-sanity-fields.md).
The journal publishing workflow is documented in
[docs/journal-publishing.md](/Users/josepablo/.codex/worktrees/74cd/New%20project/docs/journal-publishing.md).
Published or scheduled journal entries can be audited locally with
`npm run audit:journal`.

The legacy `/admin/projects` CMS has been retired to avoid conflicts with the approved production workflow.

Environment variables used by the app:

- `SANITY_JOURNAL_PROJECT_ID`
- `SANITY_JOURNAL_DATASET`
- `SANITY_JOURNAL_API_VERSION`
- `SANITY_JOURNAL_READ_TOKEN` (optional for private datasets or draft reads)

Register [`schemaTypes`](/Users/josepablo/.codex/worktrees/74cd/New%20project/sanity/schemaTypes/index.ts) in your Sanity Studio to create the SEO-ready journal model.

Document types included:

- `project`
- `journalArticle`
- `author`
- `category`
- `servicePage`
- `seoSettings`

Reusable object types:

- `seo`
- `socialLink`

Recommended editorial setup:

- one `project` per portfolio case study
- one `journalArticle` per published article
- one `servicePage` per long-form services landing page
- one `seoSettings` singleton document for site-wide defaults
- one `author` per writer/editor
- one `category` per journal taxonomy term

Service page migration:

- schema file: [servicePage.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/sanity/schemaTypes/servicePage.ts)
- migration script: [migrateServicePages.mjs](/Users/josepablo/.codex/worktrees/74cd/New%20project/script/migrateServicePages.mjs)
- run with: `SANITY_TOKEN=... npm run migrate:service-pages:sanity`
- the script creates 13 `servicePage` documents as drafts in the `dvufm78f/production` dataset

Important SEO fields now supported on `journalArticle`:

- `slug`
- `publishedAt`
- `updatedAt`
- `excerpt`
- `primaryCategory`
- `tags`
- `author`
- `sourceName`
- `relatedArticles`
- `heroImage`
- `coverImage`
- `seo.title`
- `seo.description`
- `seo.canonicalUrl`
- `seo.ogImage`
- `seo.noindex`

Important site-wide SEO fields on `seoSettings`:

- `siteUrl`
- `defaultTitle`
- `titleTemplate`
- `defaultDescription`
- `defaultOgImage`
- `organizationName`
- `organizationLogo`
- `contactEmail`
- `twitterHandle`
- `socialProfiles`
- `robotsDefault`

## Studio runtime (Dashboard-compatible)

This repo now includes a dedicated Studio workspace at [`/studio`](/Users/josepablo/Documents/Local%20Dev%20Projects/Atla/studio) using:

- `sanity@5.1.0`
- `react@19.2.2`
- `react-dom@19.2.2`

This is intentionally isolated from the main web app (React 18) to avoid dependency conflicts.

Run commands:

- `npm run studio:dev`
- `npm run studio:build`
- `npm run studio:deploy`

Environment variables for Studio:

- `SANITY_STUDIO_PROJECT_ID` (or fallback `SANITY_PROJECT_ID`)
- `SANITY_STUDIO_DATASET` (or fallback `SANITY_DATASET`)

If Studio is embedded in an iframe (e.g. Dashboard), the host serving Studio cannot use:

- `X-Frame-Options: DENY`
- `Content-Security-Policy: frame-ancestors 'none'`

Allow Sanity parents instead (on the Studio host route).
