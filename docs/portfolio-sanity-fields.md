# Portfolio Sanity Field Contract

The portfolio source of truth is now Sanity. The legacy `/admin/projects` CMS has been retired and should not be used for portfolio edits.

## Required Editor Contract

Every published portfolio entry should include these fields:

- `title`
- `slug.current`
- `client`
- `year`
- `category` or `category->title`
- `description`
- `body` or `content` with real text content
- `coverImage` or one of the supported image aliases
- `gallery`, `images`, or `galleryImages` with at least one image
- `tags` or `keywords` with at least one value
- `status` set to `published` when the entry should appear on the site

## Supported Field Aliases

The current bridge in [projectService.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/server/sanity/projectService.ts) accepts these aliases so the site can read the approved production dataset without changing visual output:

- Title: `title`, `name`
- Client: `client`, `clientName`, `brand`
- Year: `year`
- Category: `category->title`, `category`, `projectType`, `discipline`
- Tags: `tags`, `keywords`
- Description: `description`, `excerpt`, `summary`
- Body: `body`, `content`
- Featured flag: `featured`, `featuredOnHomepage`
- Cover image: `coverImage`, `mainImage`, `heroImage`, `thumbnail`
- Gallery images: `gallery`, `images`, `galleryImages`

## Why These Fields Matter

- `/work` depends on `title`, `slug`, `client`, `year`, `category`, `description`, and `coverImage`.
- `/projects/:slug` depends on `title`, `client`, `year`, `description`, `body`, `coverImage`, and gallery images.
- Missing `body` is especially risky. The current project detail page falls back to the static showcase copy in [atlaContent.ts](/Users/josepablo/.codex/worktrees/74cd/New%20project/client/src/data/atlaContent.ts), which can leak unrelated approved copy into another project page.

## Current Production Audit

Checked against [https://atla-website.vercel.app/api/projects](https://atla-website.vercel.app/api/projects) on March 13, 2026:

- Missing cover images: `0`
- Missing gallery images: `0`
- Missing body text: `17`
- Missing tags: `0`
- Missing year values: `0`
- Missing category values: `0`
- Missing client values: `0`

## Audit Commands

Use the repo audit helper before publishing major content changes:

```bash
npm run audit:portfolio
```

If you want to audit a deployed API response instead of the raw Sanity source:

```bash
npm run audit:portfolio -- --url https://atla-website.vercel.app/api/projects
```
