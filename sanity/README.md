# Atla Journal Sanity Model

This repo keeps portfolio/projects in Postgres and the journal in Sanity.

Environment variables used by the app:

- `SANITY_JOURNAL_PROJECT_ID`
- `SANITY_JOURNAL_DATASET`
- `SANITY_JOURNAL_API_VERSION`
- `SANITY_JOURNAL_READ_TOKEN` (optional for private datasets or draft reads)

Register [`schemaTypes`](/Users/josepablo/.codex/worktrees/74cd/New%20project/sanity/schemaTypes/index.ts) in your Sanity Studio to create the SEO-ready journal model.

Document types included:

- `journalArticle`
- `author`
- `category`
- `seoSettings`

Reusable object types:

- `seo`
- `socialLink`

Recommended editorial setup:

- one `journalArticle` per published article
- one `seoSettings` singleton document for site-wide defaults
- one `author` per writer/editor
- one `category` per journal taxonomy term

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
