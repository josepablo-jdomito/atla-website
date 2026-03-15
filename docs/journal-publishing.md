# Journal Publishing Workflow

This repo is now prepared so the Atla Journal can publish from Sanity and build correctly on Vercel.

## What Is Ready

- The runtime journal API reads articles from Sanity.
- The Vercel build now prerenders journal article HTML, metadata, and sitemap entries from Sanity content when articles are published.
- `SANITY_JOURNAL_*` environment variables are configured in Vercel for `Development`, `Preview`, and `Production`.
- Preview deployments now have the same Sanity configuration as Production.
- If Sanity has zero published journal articles, the site keeps the existing local journal seed content as the current fallback until the first article is published.

## Current Content Status

Checked against `https://atla-website.vercel.app/api/journal` on March 13, 2026:

- Live published Sanity journal articles: `0`

That means the journal pipeline is ready, but no published journal entries are currently coming from Sanity yet.
Once at least one article is published in Sanity, the journal switches to the Sanity-backed collection.

## Sanity Requirements

The journal schema lives in:

- [journalArticle.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/sanity/schemaTypes/journalArticle.ts)
- [author.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/sanity/schemaTypes/author.ts)
- [category.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/sanity/schemaTypes/category.ts)
- [seoSettings.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/sanity/schemaTypes/seoSettings.ts)

For a journal article to appear on the site, it should have:

- `title`
- `slug`
- `primaryCategory`
- `publishedAt`
- `excerpt`
- `heroImage`
- `coverImage`
- enough editorial text in `introParagraphs` or `bodySections` to avoid thin-content noindex behavior

Important behavior:

- The site only publishes articles with `publishedAt` set and not in the future.
- Draft documents are excluded from the live journal query.

You can audit the currently published or scheduled journal content with:

```bash
npm run audit:journal
```

Or audit the public API output directly with:

```bash
npm run audit:journal -- --url https://atla-website.vercel.app/api/journal
```

## Optional Seed Script

If you want to load the existing local demo journal content into Sanity as a starting point:

```bash
npm run seed:journal:sanity
```

This script reads from `.env.vercel.local`, uploads the local journal seed content, and creates:

- one `author`
- one `category` per journal category
- one `journalArticle` per local article entry

Do not run it if your Sanity dataset already contains the intended production journal content.

## Vercel Publish Setup

The repo build now pulls journal content from Sanity during `npm run build`. That means a Vercel redeploy refreshes:

- prerendered article routes
- article and journal SEO metadata
- sitemap entries

## Recommended Sanity -> Vercel Automation

Create a Vercel Deploy Hook in the `atla-website` project:

1. Open Vercel project settings for `atla-website`
2. Go to `Git`
3. Create a Deploy Hook for branch `main`
4. Name it something like `sanity-journal-publish`

Then create a Sanity webhook in `sanity.io/manage`:

1. Go to `API`
2. Open `Webhooks`
3. Add a webhook that `POST`s to the Vercel Deploy Hook URL
4. Use a filter like:

```text
_type in ["journalArticle", "category", "seoSettings"]
```

This keeps the journal metadata and sitemap in sync after each publish.
The hook and webhook still need to be created in their dashboards; they are not provisioned from this repo.

## Publish Checklist

1. Create or edit the article in Sanity.
2. Fill the required editorial and media fields.
3. Set `publishedAt` to the intended publish time.
4. Publish the document in Sanity.
5. Let the Sanity webhook trigger a Vercel rebuild.
6. Verify:
   - `/journal`
   - `/journal/<slug>`
   - `/sitemap.xml`

## Relevant Files

- [journalService.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/server/sanity/journalService.ts)
- [build.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/script/build.ts)
- [auditJournalContent.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/script/auditJournalContent.ts)
- [seedJournalSanity.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/script/seedJournalSanity.ts)
