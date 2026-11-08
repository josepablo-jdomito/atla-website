# atla.design v2: launch checklist (2026-11-08)

Decision for JP: v2 is ready to go to `main` once the "Needs JP" rows below are answered or accepted as post-launch. Launch is «mándalo» only; nothing here merges or deploys.

Source: feat/site-v2 at commit 649c42e (2026-11-07), the CTO session of 2026-11-07. Pages were rendered at 390 and 1440 on localhost:5052 (browser pane) and the Vercel preview was read with curl, page by page. Copy was scanned on the rendered DOM of every page for digits, em and en dashes, banned words and AI tics.

## 1. Pages

| Page | Status | What was checked | Open |
|---|---|---|---|
| `/` (work wall) | done | v2 wall, no overflow at 390, loops play on eleven projects, one h1 | none |
| `/projects/<slug>` (Rústico, TigreTigre) | done | filmstrip page, no overflow, no digits, descriptions from Sanity (27 applied) | KB-614 (patches-3: Arc body, Persona figure, years) and KB-607 (publish the seven drafts) are JP's |
| `/services` | done | moments, disciplines, engagements, index; copy clean | none |
| `/about` (Why Atla) | done | thesis, how, proof, clients, ways in, team; copy clean | none |
| `/hospitality` | done (commit 9a31d65) | rebuilt on the v2 classes; no ink bands, no empty photo slot; form on underline fields | needs JP: his photos (KB-439). Casa Las Tortugas shows no picture until then |
| `/ventures` | done | four rows, covers load | none |
| `/journal` | done (code) | text cards, tabs, no repeated row | needs JP: «mándalo KB-616» writes the thirteen Sanity patches (the index still shows "0 to 2 score" and the article "Stage 1/2/3" until then) |
| `/journal/<slug>` | done (code) | reading column, author, more from the journal | same as above |
| `/audit` | live | not touched (serves atla.design/audit through production rewrites) | none |
| `/brief` | done | one choice per screen, underline fields | none |
| `/brand-check` | done | fields, choices, one action | none |
| `/privacy` | done (commit 649c42e) | numbers in words, date without a digit | needs JP: KB-608 (Spanish notice, consent for GA) |
| `/terms` | done | no digits, Texas law, Austin venue | none |
| 404 | done | real 404 status on the preview, "That page is not here. See the work." | none |
| seven old landings (`/how-we-work`, `/programs`, `/*-branding`, `/brand-strategy`) | done | already on the v2 longform system, copy clean | none |

Headless Chrome captures at 390 were discarded: that tool lays pages out wider than the window, so the phone pass used the browser pane only.

## 2. Vercel preview, page by page

Preview: https://atla-website-git-feat-site-v2-josepablo-jdomitos-projects.vercel.app (deployment serving commit 9a31d65 at the time of the check; the 649c42e build had not finished and was not polled).

| Path | Result |
|---|---|
| `/`, `/about`, `/services`, `/hospitality`, `/projects/rustico`, `/projects/tigretigre`, `/journal`, `/journal/why-most-startups-rebrand-too-late`, `/brief`, `/brand-check`, `/ventures`, `/audit`, `/privacy`, `/terms` | HTTP 200, the right `<title>` on each |
| `/no-such-page` | HTTP 404, "Page not found" |
| `/robots.txt` | 200 |
| `/sitemap.xml` | 200, sixty-five URLs |
| `/blog/branding-questionnaire-guide` | one redirect to `/journal/how-to-brief-a-branding-agency` |
| `/work`, `/portfolio/x` | one redirect to `/` |
| `/contact` | one redirect to `/brief` |
| `/audit/` | 200 (the trailing-slash redirect lands with 649c42e) |
| `/hospitality` markup | carries the v2 classes (`hcase__text` present) |

Not verified on the preview: a form submission end to end (no test entries were sent), dark mode by eye, Lighthouse.

## 3. Redirects from old URLs

Compared `origin/main:vercel.json` against the branch with a script: every one of main's redirects exists on the branch with the same destination. The only gap was `/audit/` → `/audit`, added in 649c42e. The branch adds `/contact` and `/contact/` → `/brief`, the four hidden project URLs (`/projects/welove`, `/projects/atla`, `/projects/the-bridge`, `/projects/conscious-care-co`) and the `audit.atla.design` host rules. `server/routes.ts` mirrors the blog and portfolio table for the Express path, so the dev server redirects too.

Checked live on production: `/blog/branding-questionnaire-guide` answers 308 to the journal URL today; the branch keeps it.

## 4. Sitemap and robots

- `robots.txt`: allows everything, disallows `/admin/`, points at `https://www.atla.design/sitemap.xml`.
- `sitemap.xml` is written at build time by `script/build.ts` (sixty-five URLs on the preview: static routes, projects, journal articles and categories). The five-URL file in `client/public/` is a dev placeholder that the build overwrites. Limit: an article published in Sanity after a deploy enters the sitemap on the next deploy, not before. `/api/sitemap.xml` is the live equivalent if Sergio wants it submitted instead.

## 5. Analytics

- GA4: measurement id in `client/src/lib/ga.ts`, loaded after the page, consent mode defaults to denied in the EU regions and to granted elsewhere, page views sent by the app. JP's clicks remain (KB-604): enhanced measurement, fourteen-month retention, `generate_lead` as key event, Search Console link.
- Clarity: `VITE_CLARITY_ID` is set on Vercel production; the tag loads only on an explicit consent "granted" (test in `consent-tags.test.ts`). JP's click remains (KB-603): Masking → Strict.
- Meta pixel: `VITE_META_PIXEL_ID` is set on Vercel production; same consent rule.
- Both ids are Production-scoped environment variables; the preview may not carry them, so tag loading was verified by the unit tests, not on the preview.

## 6. Environment on Vercel (production)

Present: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_JOURNAL_*`, `ANTHROPIC_API_KEY`, `ATLA_ASK_MODEL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `ATTIO_API_KEY`, `RATE_LIMIT_SALT`, `CALENDLY_URL`, `AUDIT_ADMIN_KEY`, `BRIEF_FROM_EMAIL`, `VITE_CLARITY_ID`, `VITE_META_PIXEL_ID`.
Missing: `RESEND_API_KEY` (KB-602). Without it the brief and brand-check emails do not send; the Attio note still lands. JP's sign-in on resend.com is the blocker.

## 7. vercel.json when main becomes v2

Merging feat/site-v2 replaces `vercel.json` whole. What that means, line by line against `origin/main:vercel.json`:

- Rewrites to drop (they exist only to serve the audit landing from the branch deployment; v2 production serves it itself). Lines 58 to 65 of main's file:
  - 58 `{ "source": "/audit", "destination": "https://audit.atla.design/audit" }`
  - 59 `{ "source": "/audit/landing/:path*", "destination": "https://audit.atla.design/audit/landing/:path*" }`
  - 60 `{ "source": "/api/audit", "destination": "https://audit.atla.design/api/audit" }`
  - 61 `{ "source": "/api/audit/:path*", "destination": "https://audit.atla.design/api/audit/:path*" }`
  - 62 `{ "source": "/assets/:path*", "destination": "https://audit.atla.design/assets/:path*" }`
  - 63 `{ "source": "/logos-v2/:path*", "destination": "https://audit.atla.design/logos-v2/:path*" }`
  - 64 `{ "source": "/hospitality/:path*", "destination": "https://audit.atla.design/hospitality/:path*" }`
  - 65 `{ "source": "/fonts/:path*", "destination": "https://audit.atla.design/fonts/:path*" }`
  The branch file already has none of these: its rewrites are the eight start.atla.design ones plus `/api/:path*` → `/api/index`. Nothing to edit at merge time.
- Rewrites to keep (both files have them): `/waitlist`, `/waitlist/:path*`, `/_next/:path*`, `/api/quiz/:path*`, `/api/collect`, `/images/logos/:path*`, `/images/carousel/:path*` to start.atla.design, and `/api/:path*`.
- Redirects: the branch carries all of main's plus the new ones (section 3). The three `audit.atla.design` host redirects at the top of the branch's list stay valid after launch (they send that host to www); they only become dead weight if the domain is removed.
- `functions.api/index.ts.includeFiles` on the branch adds `client/src/content/**`; keep it, the API reads siteCopy.
- CSP on the branch adds `form-action 'self'`, `media-src` for Sanity files and the Facebook and Google connect hosts; keep it.
- Domain: `audit.atla.design` is bound to the feat/site-v2 branch deployment. After the merge, either leave it bound to the branch (it keeps answering as long as the branch exists) or move it to production in the Vercel project's Domains tab. Deleting the branch without moving the domain breaks `audit.atla.design` itself, not `atla.design/audit`.

## 8. Needs JP before or right after launch

| Item | Card | What JP says |
|---|---|---|
| Hospitality photos (Casa Las Tortugas vertical, Christophe's, Temakase) | KB-439 | sends the photos, «cambia las fotos de hospitality» |
| Journal: thirteen Sanity patches, pricing article rewritten | KB-616 | «mándalo KB-616» |
| Project descriptions patches-3 (Arc, Persona, years, Casa Colora, Mundã) | KB-614 | «mándalo KB-614» |
| Publish the seven draft projects visible on the site | KB-607 | Publish in the Studio |
| Seven case studies marked needs JP | KB-597 | per file, va / no va |
| Resend key | KB-602 | signs in on resend.com, «ya entré» |
| Clarity masking | KB-603 | one click, «KB-603 listo» |
| GA4 settings | KB-604 | four clicks |
| Privacy in Spanish, GA behind consent | KB-608 | «privacidad sí» or «no» |
| Launch | code:figma-shell-home:launch-v2 | «mándalo: lanza v2» |

## 9. Launch steps (after «mándalo»)

1. Open the PR feat/site-v2 → main and merge it (no squash needed; the branch history is the record).
2. Vercel builds production from main. Run the section 2 curl list against https://www.atla.design.
3. Submit `https://www.atla.design/sitemap.xml` in Search Console (Sergio owns SEO; tell him the sitemap is build-time).
4. Decide the `audit.atla.design` domain (section 7, last point).
5. Watch the brief, brand check and hospitality forms for one real entry each in Attio.

Decision: none beyond JP's «mándalo».
