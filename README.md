# WeLoveDaily

Production-ready Next.js 14 + Sanity CMS codebase for [welovedaily.com](https://welovedaily.com).

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript, Server Components)
- **CMS:** Sanity v3 (GROQ queries, Studio embedded at `/studio`)
- **Styling:** Tailwind CSS with custom design tokens
- **Forms:** Typeform (lazy-loaded embeds)
- **Newsletter:** Substack (external link)
- **Analytics:** Google Analytics 4
- **Hosting:** Vercel

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd welovedaily
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — Usually `production`
- `SANITY_API_TOKEN` — Read token for preview/revalidation
- `SANITY_REVALIDATE_SECRET` — Webhook secret for on-demand ISR
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement ID
- `NEXT_PUBLIC_SITE_URL` — Production URL (e.g. `https://welovedaily.com`)
- `NEXT_PUBLIC_TYPEFORM_SUBMIT_ID` — Typeform form ID for submissions
- `NEXT_PUBLIC_TYPEFORM_ADVERTISE_ID` — Typeform form ID for advertising
- `NEXT_PUBLIC_TYPEFORM_CONTACT_ID` — Typeform form ID for contact
- `NEXT_PUBLIC_SUBSTACK_URL` — Substack newsletter URL

### 3. Fonts

Place font files in `public/fonts/` with these exact names:
- `parabolica-regular.woff2`
- `parabolica-medium.woff2`
- `times-now-regular.woff2`
- `times-now-semibold.woff2`

These are referenced in `src/app/globals.css` via `@font-face`.

### 4. Run dev server

```bash
npm run dev
```

App runs on `http://localhost:3000`. Sanity Studio at `http://localhost:3000/studio`.

### 5. Sanity setup

The Sanity schemas are in `sanity/schemas/`. Deploy the Studio:

```bash
npx sanity deploy
```

Create a webhook in [sanity.io/manage](https://sanity.io/manage) → API → Webhooks:
- **URL:** `https://welovedaily.com/api/revalidate`
- **Secret:** Same as `SANITY_REVALIDATE_SECRET`
- **Trigger on:** Create, Update, Delete
- **Filter:** `_type in ["post", "category", "brand", "homepageConfig"]`

## Layout architecture

The app uses an **Instagram-style sidebar navigation** on desktop and a **bottom tab bar** on mobile.

### Desktop (≥ 1024px)
- Fixed left sidebar (220px) with logo, main nav, and bottom links
- Content area fills remaining width to the right
- Footer sits inside the content area

### Mobile (< 1024px)
- Sidebar is hidden
- Fixed bottom tab bar (56px) with 5 tabs: Home, Search, Submit, Newsletter, More
- Safe area padding for iPhone notch/home indicator
- Content gets `pb-[72px]` to clear the tab bar

### Key components
- `Sidebar.tsx` — Desktop left nav with active state detection via `usePathname()`
- `BottomTabBar.tsx` — Mobile bottom nav with filled/outlined icon states
- `FeedControls.tsx` — Sort (Recent/Relevance) + View (Grid/List) toggle
- `PostCardRow.tsx` — Horizontal card variant for list view

## Content model

### Post
The primary content type. Features a brand, belongs to a category, supports sponsored labeling, SEO overrides, credits, and rich body content (Portable Text with inline images).

### Brand
First-class entity representing a featured brand. Includes logo, cover image, tagline, description, metadata (headquarters, founded, founders, industry), social links, and category associations. Posts reference brands, creating brand profile pages that aggregate all related content.

### Category
Taxonomy for organizing posts. Ordered, with optional description. Used for navigation chips and filtered feeds.

### HomepageConfig
Singleton document controlling the homepage: featured post, editor's picks, newsletter copy, and in-feed CTA frequency.

## Project structure

```
src/
├── app/
│   ├── [slug]/           # Article pages (dynamic)
│   ├── brand/[slug]/     # Brand profile pages (dynamic)
│   ├── category/[slug]/  # Category pages (dynamic)
│   ├── categories/       # All categories
│   ├── search/           # Search
│   ├── submit/           # Submit a project (+ /thanks)
│   ├── advertise/        # Advertise (+ /thanks)
│   ├── newsletter/       # Newsletter (+ /thanks)
│   ├── contact/          # Contact (+ /thanks)
│   ├── about/            # About
│   ├── privacy/          # Privacy policy
│   ├── terms/            # Terms of use
│   ├── api/revalidate/   # On-demand ISR webhook
│   ├── rss.xml/          # RSS feed
│   ├── sitemap.ts        # Dynamic sitemap
│   ├── robots.ts         # Robots.txt
│   ├── layout.tsx        # Root layout (sidebar + tab bar)
│   ├── page.tsx          # Homepage
│   ├── globals.css       # Fonts + base styles
│   └── not-found.tsx     # 404
├── components/
│   ├── cards/            # PostCard, PostCardLarge, PostCardRow, CtaCard
│   ├── feed/             # FeaturedStrip, PostFeed, CategoryChips, FeedControls
│   ├── layout/           # Sidebar, BottomTabBar, Footer, GoogleAnalytics
│   └── modules/          # TypeformEmbed, NewsletterModule, FaqAccordion, PortableTextBody
├── data/
│   └── faq.ts            # FAQ content arrays
├── lib/
│   ├── sanity/           # Client + GROQ queries
│   └── utils/            # analytics.ts, metadata.ts
└── types/
    └── index.ts          # All TypeScript interfaces

sanity/
├── schemas/              # post, category, brand, homepageConfig
├── lib/
│   └── desk.ts           # Studio desk structure
└── sanity.config.ts      # Studio config
```

## Design tokens

| Token | Value |
|-------|-------|
| `wld-paper` | `#FFF9EF` (warm cream background) |
| `wld-white` | `#FFFFFF` |
| `wld-ink` | `#1D1D1D` (primary text) |
| `wld-blue` | `#160FCF` (accent) |
| `border` | `#E8E4DE` |
| `muted` | `#8A8580` |
| `card` radius | `16px` |
| Container max | `1180px` |
| Article max | `720px` |

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Set all environment variables in Vercel dashboard. The `next.config.mjs` already includes Sanity CDN image domain configuration.

## Content workflow

1. Editor creates/edits post in Sanity Studio
2. Optionally links a Brand (creates brand profile page automatically)
3. Sets status to "Published" and adds publish date
4. Sanity fires webhook → `/api/revalidate` → ISR revalidates affected pages
5. Background: ISR also revalidates every 60 seconds as fallback

## What's NOT included (requires JP)

- [ ] SVG wordmark logo
- [ ] WOFF2 font files (Parabolica, Times Now)
- [ ] Sanity project creation and ID
- [ ] GA4 property and measurement ID
- [ ] Typeform forms (3 total: submit, advertise, contact)
- [ ] Substack account and URL
- [ ] Vercel project + DNS configuration
- [ ] Favicon and OG default image (`public/og-default.jpg`)
