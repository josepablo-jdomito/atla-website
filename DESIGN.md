# DESIGN.md: the atla.design v2 system

Status: ADOPTED in fix pass C (2026-11-06, feat/site-v2). The values below are the tokens in `client/src/styles/site.css` (`:root`). A component never sets a colour, a size, a radius or a shadow of its own: it takes a token. Anything that needs a value outside this file changes this file first.

Register: premium editorial, paper and ink, one serif display voice (ABC Synt), one grotesque working voice (Libre Franklin), almost no chrome. Image-first. The accent (yellow) is a mark, never a surface and never text.

## 1. Colour

Light is the default; dark follows `prefers-color-scheme` (no switch). Ratios measured on the page colour.

| Token | Light | Dark | Use | Contrast |
|---|---|---|---|---|
| `--site-bg` | #f6f3ec | #151412 | page canvas | n/a |
| `--site-surface` | #fcfaf5 | #1d1b18 | floating surfaces: Explore pill and panel, consent notice | n/a |
| `--site-ink` | #1b1a17 | #efeae0 | text, field lines, focus ring, the one-action underline | 15.70 / 15.36 |
| `--site-muted` | #6f6a61 | #9c968a | secondary text, labels, placeholders, text buttons | 4.85 / 6.26 |
| `--site-line` | 12% ink | 14% ink | hairlines and image placeholders; never text, never a field edge | decorative |
| `--site-accent` | #f6c428 | #f6c428 | current item and hover underline only; never alone, never text | n/a |
| `--site-error` | #b3261e | #f2b8b5 | field error text and the invalid field's line | 5.90 / 10.78 |
| `--site-sheet` | #ffffff | = surface | phone menu card (JP's reference, 2026-11-06) | n/a |
| `--site-sheet-tint` | #eaeaea | = line | phone menu close button and current row | n/a |
| `--site-paper` | #f6f3ec | #f6f3ec | paper that stays paper in dark (the /hospitality award chips) | n/a |

Rules: no hex in components. Text is `ink`, `muted` or `error`, always at full opacity. Only disabled controls drop opacity (0.4 to 0.45), and hover dims a text link to 0.55.

## 2. Type

Two faces. `--site-display`: ABC Synt 400 (self-hosted subset). `--site-sans`: Libre Franklin (self-hosted, variable). Every size is a rem token, so a visitor's browser text size carries through. Fluid steps run linearly from 375 to 1440 px.

| Token | Value | px (375 to 1440) | Face / weight | Use |
|---|---|---|---|---|
| `--t-caption` | 0.8125rem | 13 | Franklin 400 to 600 | footer base (uppercase, +0.04em), dates, field errors, privacy line |
| `--t-ui` | 0.875rem | 14 | Franklin 400 / 500 | nav, labels, every action and text button, chips, footer |
| `--t-small` | 0.9375rem | 15 | Franklin 400 | secondary lines, lists, card excerpts |
| `--t-body` | 1rem | 16 | Franklin 400 | body, moment lines, the 404's way back |
| `--t-lead` | 1.125rem | 18 | Franklin 400 | leads, field values, long-form prose, choice rows |
| `--t-h3` | clamp | 20 to 24 | Franklin 500 | item titles: a discipline, a step, a card, an index row, a venture, a legal section; brief option rows |
| `--t-h2` | clamp | 28 to 40 | Franklin 600 | section heads, one size on every page; Synt 400 for a page statement (Services "what usually happens") |
| `--t-h1` | clamp | 36 to 56 | Synt 400 | the page title, one per page, one size everywhere (pages, project, brief, journal, 404, load error) |
| `--t-display` | clamp | 36 to 60 | Synt 400 | the four Services moments only |

Line heights: `--lh-tight` 1.06 (H1), `--lh-head` 1.15 (H2), 1.2 (H3), `--lh-ui` 1.4, `--lh-body` 1.5, `--lh-prose` 1.6. Tracking: -0.01em H1 and H3, -0.015em H2 and display, +0.04em the uppercase caption, 0 elsewhere.

Inside a reading column (journal article prose) the levels step down one place so the column never shouts: prose h2 at `--t-h3` 600, h3 at `--t-lead` 600, h4 at `--t-body` 600.

## 3. Space

A 4 px grid, ten steps: `--space-1` 4, `--space-2` 8, `--space-3` 12, `--space-4` 16, `--space-5` 24, `--space-6` 32, `--space-7` 40, `--space-8` 56, `--space-9` 72, `--space-10` 112.

| Use | Step |
|---|---|
| inline gap, label to field | 4 / 8 |
| control padding, list rows | 12 / 16 |
| related blocks, form fields | 24 / 32 |
| block to block in a section | 40 |
| page intro, sub-section | 56 |
| section to section (phone, and inside Services on tablet) | 72 |
| section to section from 1024, page bottom, footer top | 112 |

Gutter `--site-gutter`: 16, 24 from 768, 40 from 1280. Reading measure: body 40 to 48ch, prose 68ch. Two rhythms keep their own measured values and are not on the grid on purpose: the wall's gutter (16 / 20 / 24, UX interview 2) and the footer's link rows (44 px touch, 32 px desktop, JP's Figma).

## 4. Shape

| Token | Value | Use |
|---|---|---|
| `--r-media` | 3px | every image, tile, frame, thumbnail, skeleton block |
| `--r-row` | 4px | rows (phone menu row), focus rings, small chips |
| `--r-card` | 8px | cards and the close button (phone menu card and close) |
| `--r-panel` | 16px | floating panels: Explore panel, consent notice, Ask sheet |
| `--r-pill` | 999px | the Explore pill and the skip link only |

Fields have no radius. Borders are 1px: `--site-line` between rows and to open a section; `--site-ink` only under a field and above the footer base. One shadow, `--shadow-float: 0 10px 30px rgba(27,26,23,.12)`, for floating surfaces (the Ask phone sheet throws it upward). Backdrop blur 8px on the phone menu backdrop only. Focus: a 2px ink outline at 3px offset; an underline field thickens its line to 2px instead.

## 5. Motion

One easing, `--site-ease: cubic-bezier(0.23, 1, 0.32, 1)`. Durations: `--d-hover` 160ms (colour, underline, opacity), `--d-enter` 200ms (page fade, panel, step, route change), `--d-move` 300ms (progress, transforms). Pressed is 100ms. Kept on purpose: the phone menu's measured open (180ms) and close (150ms) on `cubic-bezier(0.4, 0, 0.2, 1)` (JP's reference), the wall tiles' 320ms fade, and the ambient loops (logo band 60s linear, pending dots 1.2s). Reduced motion takes every duration to near zero.

## 6. Components: one look each

- **Text link** `.site-link`: `--t-ui` 400 ink, no underline, hover opacity 0.55. Nav, footer, meta.
- **The one action** `.site-action`: `--t-ui` 500 ink, a 1px ink underline at 4px offset that turns accent on hover, 44px hit area, disabled 0.4. One per page or form, the same look everywhere: "Start a project" in the header, Services and the empty wall; every form submit (Send the brief, Send message, Ask for a brand check); Accept on the consent notice; Book a call; Try again; More in a journal category. The 404's way back is this look at `--t-body`.
- **Text button** `.site-text-button`: `--t-ui` 400 muted, no underline, hover ink, 44px. The quiet second choice: Back, Decline, Clear, Any moment, More work, Start over, See the work on a load error, the brand-check door.
- **Inline link** (prose and privacy links): inherits the text, 1px underline in the text colour, accent on hover. Never yellow at rest.
- **Includes** (`details` summary on Services): `--t-ui` 500 with a 1px underline, accent on hover; muted with no underline when open.
- **Chip / filter option**: `--t-ui` 400 muted; the current one is ink with a 2px accent underline. 44px on touch.
- **Label** `.site-label`: `--t-ui` 500 muted. A card's category, a sub-list name, the picker's question.
- **Section head** `.site-section-title`: `--t-h2` Franklin 600, -0.015em. Every section on every page (What we do, How we work together, Everything we do, the Why Atla sections, the landing sections, More from the journal).
- **Item title** `.site-item-title`: `--t-h3` Franklin 500. The Why Atla beliefs take the display face at the same size.
- **Page title**: `--t-h1` Synt (`.page-intro__title`, `.film-head__title`, `.brief-prompt`, `.site-error__title`).
- **Field** (`.brief-input`, select and textarea alike): no box, a 1px ink underline, `--t-lead` value, 44px; focus thickens the line to 2px; invalid turns the line and the one error line `--site-error`. Label above in `--t-ui` muted. No "Optional" tags: a field that is not required simply is not.
- **Choice row** (brief options, brand-check radios): words in rows, a quiet ring at the end, filled when chosen. Never pills or boxes.
- **Floating surface** (Explore pill and panel, consent notice): `--site-surface`, 1px line, `--shadow-float`, `--r-panel` (`--r-pill` for the pill).
- **Consent notice**: one sentence and the policy link, then Accept (the action) and Decline (a text button).
- **Lightbox**: an ink room at 96%; Close, Previous and Next are text buttons read in paper, 44px.
- **Phone sheet**: `--site-sheet` card at `--r-card`, 80px rows at `--r-row`, 64px thumbs at `--r-media`, close at `--r-card` in `--site-sheet-tint`.
- **Footer**: JP's Figma on paper. Heads `--t-ui` 700, links `--t-ui` 500, the base row `--t-caption` 600 uppercase on an ink rule.
