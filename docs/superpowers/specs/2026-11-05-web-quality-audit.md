# atla.design v2: web quality audit (2026-11-05)

Scope: commit 70cd1b7 (feat/site-v2), built from a clean `git archive` snapshot because another session was mid-merge in this worktree (PageShell.tsx had conflict markers during my run, and a second `npm run build` there failed with "Unexpected <<"; the merge has since been resolved). No source edited. JSON reports: `.superpowers/sdd/2026-11-04-atla-site-v2/lh-<page>[-desktop].json`.

Method notes: static host `npx serve -s` (gzip on) on :5055, Lighthouse with Chrome headless, one run per cell (no median; expect +/-5 points on Performance). `/api/*` does not exist in the static build and returns index.html, so the two "SyntaxError: Unexpected token '<'" console errors on every page are an artefact, not a site bug. Manual interaction tests ran against a second server that proxied GET /api to www.atla.design. The prerender itself pulled projects from the production API ("Falling back to remote prerender API: https://www.atla.design"), so the build is not reproducible offline.

## 1. Lighthouse

Mobile (default throttling) / Desktop preset. P = Performance, A = Accessibility, BP = Best Practices, SEO.

| Page | P | A | BP | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| / mobile | 79 | 95 | 96 | 100 | 5.5 s | 40 ms | 0 |
| / desktop | 97 | 95 | 96 | 100 | 1.2 s | 0 | 0 |
| /projects/rustico mobile | 92 | 100 | 96 | 100 | 3.3 s | 10 ms | 0 |
| /projects/rustico desktop | 100 | 100 | 96 | 100 | 0.4 s | 0 | 0 |
| /services mobile | 78 | 100 | 96 | 100 | 6.0 s | 10 ms | 0 |
| /services desktop | 97 | 100 | 96 | 100 | 1.2 s | 0 | 0 |
| /about mobile | 89 | 100 | 96 | 100 | 3.6 s | 10 ms | 0 |
| /about desktop | 100 | 100 | 96 | 100 | 0.4 s | 0 | 0 |
| /brief mobile | 90 | 100 | 96 | 100 | 3.6 s | 10 ms | 0 |
| /brief desktop | 100 | 100 | 96 | 100 | 0.4 s | 0 | 0 |
| /contact mobile | 89 | 100 | 96 | 100 | 3.7 s | 10 ms | 0 |
| /contact desktop | 100 | 100 | 96 | 100 | 0.4 s | 0 | 0 |

Failed audits worth acting on:
- Home A 95: `aria-allowed-attr` on `input.site-explore__input` (`type="search"` with `aria-expanded`; not allowed on that role).
- BP 96 everywhere: the console-error artefact above.
- Mobile LCP: render-blocking Google Fonts CSS (795 ms est. on / and 780 ms elsewhere; the app CSS adds 155 ms). Home LCP breakdown: element render delay 747 ms of ~825 ms after request, so the image arrives fast and is held back (see 4.1). `lcp-discovery`: preload exists but without `fetchpriority=high`.
- Unused JS ~125 KiB on every page (the 193 KB gtag script is the largest single script); cache-insight 170-260 KiB (static `serve` sends no long-cache headers; check Vercel headers separately).
- Home total weight 3.6 MB mobile / 3.1 MB desktop (see 4.2).

## 2. Static checks on dist/public (74 HTML files)

| Check | Result |
|---|---|
| Exactly one h1, title, description, canonical on /, /services, /about, /contact, /brief | FAIL on / and /brief: zero h1 in the prerendered HTML. Both pages have no h1/h2/h3 at all in the home source (`Home.tsx`, `WorkWall.tsx`); /brief renders its h1 ("What are you building?") only after JS. /services, /about, /contact pass. |
| Same check, all 74 files | Also missing description + canonical: `/audit/bevel/questionnaire`, `/audit/parktool/questionnaire` (probably intended noindex; verify they carry `noindex`). |
| JSON-LD parses (JSON.parse) | PASS on every page that has any (0 parse errors). No JSON-LD on: /brief, /how-we-work, /hospitality, /brand-strategy, /programs, /privacy, /terms, /audit/*, 404, admin. /brief is the only one of the five key pages without it. |
| sitemap.xml lists /, /services, /about, /contact, /brief, /ventures, /projects/*, six landings | PASS: 72 URLs incl. 31 projects, 13 journal articles, 4 journal categories, hospitality, hospitality-branding, cpg-branding, wellness-branding, saas-branding, brand-strategy, how-we-work, programs, privacy, terms. Every listed path has a prerendered `index.html` (no 404). |
| robots.txt | Allows the site (`Disallow: /admin/` only). Its Sitemap line points to `/api/sitemap.xml`, not the static `/sitemap.xml`; the static file is also shipped. Make sure both agree or point to one. |
| llms.txt | PASS: six disciplines (Strategy, Naming and voice, Identity, Packaging, Website and decks, Motion and campaigns), moments, industries, 14+ selected projects. |
| Local assets referenced exist (/figmaAssets, /hospitality, /assets, /fonts, /images) | PASS, 0 missing. `/logos-v2/` does not exist in the build: `ClientLogos` renders nothing when empty, so the logo band is absent until the SVGs ship. |
| Images carry width and height | PASS on home (72/72). FAIL on `/hospitality` 14 of 16 imgs and `/audit/bevel` 32 of 35, `/audit/parktool` 23 of 26 have no width+height. |
| `http://` mixed content | None. |
| Home wall markup | PASS: 72 `.wall-tile` links with 72 imgs, prerendered as 2 columns (phone layout). |
| Other | `dist/public/font-loader.js` is shipped but referenced by no HTML (dead file; `id="atla-fonts-stylesheet"` appears nowhere). |

## 3. Accessibility (hand test, keyboard only)

Passes: one `<main>` per page; landmarks header, nav[Primary], footer, nav[Footer]; skip link "Skip to the work" is the first tab stop and visible; 72 wall imgs `alt=""` inside links that carry `aria-label` (correct decorative pattern, 72/72 labelled); project page imgs all have alt (17/17), story images open through buttons labelled "Rústico, image 2. Open larger"; lightbox is `role="dialog" aria-modal="true"` with label "Rústico, image 2 of 16", Close receives focus, ArrowRight advances (label becomes "image 3 of 16"), Escape closes; /brief textarea is labelled by the h1 and autofocuses; /contact has real labels, `autocomplete` tokens, a polite status region and a labelled honeypot; muted text #6f6a61 on #f6f3ec = 4.85:1 (passes AA; the footer base line is the same token at 13px, also 4.85:1; dark mode #9c968a on #151412 is higher); reduced motion is honored globally (`@media (prefers-reduced-motion: reduce)` zeroes transition and animation durations in site.css line 47, and the client-logos marquee stops).

Findings, by element:

1. Focus ring colour fails non-text contrast. `.site-root a:focus-visible, .site-root button:focus-visible` use `outline: 2px solid var(--site-accent)` = #f6c428 on #f6f3ec = 1.48:1 (needs 3:1, WCAG 1.4.11 / 2.4.11). Seen on Skip link, Work, Services, Menu, Close, wall tiles. The explore input already uses ink (#1b1a17, 15.7:1); the rest should too.
2. `input.site-explore__input`: `aria-expanded` is invalid on `type="search"` (the Lighthouse failure) and there is no `aria-controls` to the `div.site-explore__panel[role=dialog]`. Escape clears the query and leaves focus on `<body>` (focus is lost; it should stay on the input). ArrowDown does not move into the panel.
3. Lightbox (`[role=dialog]`, aria-modal): no focus trap. After opening, 6 Tab presses moved focus to the header link "Ventures" behind the dialog. On Escape, focus drops to `<body>` instead of returning to the `.story-media__button` that opened it. No `aria-live`, so slide changes are announced only through the dialog label if at all.
4. `#site-menu-sheet` (opened by `button.site-header__menu`): no `role="dialog"`/`aria-modal`, `main` is not inert, Tab from Close walks into the page links "Work"; Escape does restore focus to Menu (good).
5. Tab order: Skip, Work, Services, Menu, then the logo "Atla, home", then "Start a project". The logo is visually first and comes fifth in the tab order.
6. No h1 on `/` and in the prerender of `/brief` (see 2). Screen-reader users landing on the home hear no page heading.
7. Wall search: typing "coffee" doubled the DOM to 144 `.wall-tile` (72 -> 144) while the result transitions; verify the old set is removed from the accessibility tree.

## 4. Performance hot spots

4.1 Wall tile images start at `opacity: 0` (site.css `.wall-tile img`) and become visible only on React `onLoad`. In the prerender, nothing sets `data-loaded`, so the above-the-fold images stay invisible until hydration (index-DLBZUvDB.js 183 KB + PageShell 132 KB). Home mobile LCP 5.5 s with 747 ms element render delay. Also the prerender wraps `#root` in `[data-prerender-gate]` which is `visibility:hidden` until hydration or 3 s.
4.2 Eager images: 20 `loading="eager"` tiles and 20 matching `<link rel="preload" as="image">` in the head, all `w=640`, zero `fetchpriority`. At 390 px only 9 tiles are in the first viewport, so 11 eager preloads are below the fold (about 20 KB each); at 1440 px 18 are in view and 2 are below. 20 preloads compete with CSS/JS on mobile.
4.3 First-viewport image bytes (Sanity `auto=format`, Accept avif/webp, measured by curl): 1440x900 @2x, 5 columns of 259 css px, srcset picks w=640: 18 images = 421 KB. 390x844 @2x, 2 columns of 171 css px, picks w=480: 9 images = 178 KB, plus about 230 KB of eager below-fold. Sizing is right (no oversize waste on desktop: Lighthouse image-delivery savings 4 KiB desktop, 287 KiB mobile).
4.4 Column mismatch: the prerender is the 2-column phone layout; desktop hydrates to 5 columns. The first 20 preloaded images are therefore ordered for 2 columns. CLS is 0 because of the gate, but the first paint is a full re-layout.
4.5 Fonts: one Google Fonts CSS request (Libre Franklin, Roboto Mono, Instrument Serif; `display=optional`) is render-blocking (795 ms est. on mobile). `display=optional` means a slow connection keeps the fallback for the whole visit (no shift, but the brand type may not show). 2 font files, 44 KB, load on /.
4.6 JS (dist/public/assets, raw / gzip): index 183 KB / 60 KB, PageShell 132 KB / 45 KB (shell chunk, loaded on every page), Brief 67 KB / 17 KB, AtlaHospitality 31 KB, Project 16 KB, Home 12 KB; CSS 54 KB / 11 KB. gtag.js 193 KB is the heaviest script on the page and loads async. Lighthouse flags about 125 KiB unused JS.
4.7 Page weight, mobile: home 80 image requests, 3.2 MB images, 3.6 MB total. Non-home pages are 1.2-1.3 MB.
4.8 `/services` mobile P 78 / LCP 6.0 s: no image LCP, so it is the render-blocking fonts plus hydration of the 132 KB shell. It is the worst non-home page and the cheapest to fix.

## 5. Ranked fix list

1. Add an h1 to `/` (visually hidden is fine) and prerender the h1 on `/brief`. Currently zero h1 in the shipped HTML of two of the five key pages. Hours: under 1.
2. Change the keyboard focus ring from `--site-accent` (1.48:1) to ink (`--site-ink`, 15.7:1), or ink with an accent halo. One selector group in site.css.
3. Make the wall tiles visible without waiting for hydration: remove the `opacity:0` until `data-loaded` for prerendered tiles (or set `data-loaded` server-side for the eager set), add `fetchpriority="high"` to the first 4-6 tiles/preloads and cut the preloads/eager count to about 6-8 on narrow viewports. Target: home mobile LCP 5.5 s to under 3 s.
4. Make the Google Fonts stylesheet non-blocking (`media="print" onload`, which `font-loader.js` already tries to do but is never loaded) or self-host the two woff2 files with `preload`. Removes about 780 ms of render blocking on every page; `/services` mobile should move from 78 to the high 80s.
5. Fix dialog semantics: lightbox focus trap plus focus return to the opener; Explore input: drop `aria-expanded` from `type="search"` (use `role="combobox"` with `aria-controls` or remove it), keep focus on the input on Escape; give `#site-menu-sheet` a dialog role and inert background.
6. Add width/height to images on `/hospitality`, `/audit/bevel`, `/audit/parktool`; give `/brief` JSON-LD; point robots.txt `Sitemap:` at the same file the build ships; confirm the questionnaire pages are `noindex`; delete unused `font-loader.js` or wire it.
7. Move the logo to the first tab stop after the skip link (DOM order) and mark the removal of the duplicated 144-tile DOM during search transitions.
8. Defer or consent-gate gtag (193 KB) and re-check cache headers on Vercel (static `serve` shows 170-260 KiB cache savings that production headers may already cover).
