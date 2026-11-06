# DESIGN.md (proposal, 2026-11-06, not adopted)

Status: PROPOSAL, derived from what atla.design v2 ships at 8e060bb (feat/site-v2). Nothing here is applied. Each value below is either (a) already the dominant value in `client/src/styles/site.css`, or (b) the nearest step for a value that is off-scale today. Items marked JP need his call. Deviation list with measurements: `.superpowers/sdd/2026-11-04-atla-site-v2/preship-design.md`.

Register: premium editorial, paper and ink, one serif display voice, one grotesque working voice, almost no chrome. Image-first. The one accent (yellow) is a mark, never a surface.

## 1. Color tokens

Light is the default; dark follows `prefers-color-scheme`. Ratios are measured (WCAG 2.x relative luminance).

| Token | Light | Dark | Use | Contrast (light / dark) |
|---|---|---|---|---|
| `--site-bg` | #f6f3ec | #151412 | page canvas | n/a |
| `--site-surface` | #fcfaf5 | #1d1b18 | raised: explore pill and panel, dialogs, sheet (dark), input fill (new) | n/a |
| `--site-ink` | #1b1a17 | #efeae0 | all primary text, strong rules, focus ring, filled primary button | 15.70 / 15.36 on bg |
| `--site-muted` | #6f6a61 | #9c968a | secondary text, labels, placeholders | 4.85 / 6.26 on bg; 5.15 / 5.84 on surface |
| `--site-line` | rgba(27,26,23,.12) | rgba(239,234,224,.14) | hairlines and image placeholders. Never text, never a field edge | 1.27 on bg (decorative only) |
| `--site-accent` | #f6c428 | #f6c428 | active/current underline, hover underline, one 2px bar. Never text, never alone | 1.48 / 11.26 on bg |
| `--site-error` | #b3261e | #f2b8b5 | error text and field error rule | 5.90 / 10.78 |
| `--site-sheet` (new, JP 2026-11-06) | #ffffff | = surface | phone menu card only | n/a |
| `--site-sheet-tint` (new, JP 2026-11-06) | #eaeaea | = line | phone menu close button and current row | n/a |

Rules
- No hex outside this table in components. Today `#222`, `#fafafa`, `#fff`, `#111` appear in `AnalyticsConsent.tsx`, `input` fills and `.hospitality-award`.
- Text is `ink` or `muted`. Nothing is set below full opacity (a faded `muted` at .8 gives 3.29:1 light, 4.44:1 dark: fails).
- Disabled controls may drop to .4 to .45 opacity (exempt from contrast).
- Accent never carries meaning alone: the current item is also ink while the rest are muted.

## 2. Type

Families
- Display: `ABC Synt` 400 (variable 400 to 900 is loaded; only 400 is used at display sizes). For H1, H2 and display statements.
- Working: `Libre Franklin` 400 / 500 / 600 / 700, Google Fonts, `display=swap`. Everything else.
- Fallback stack `Helvetica, Arial, sans-serif` everywhere (the consent dialog drops Arial today).
- Measured on /services at 1440: all five faces report `loaded`, no fallback in use.

Scale (9 steps, desktop 1440 value; fluid ones clamp to the phone value)

| Token | Phone | Desktop | Line | Tracking | Face / weight | Use |
|---|---|---|---|---|---|---|
| `--t-caption` | 12 | 12 | 1.4 | +0.04em, uppercase | Franklin 600 | footer base, legal. Never below 12 (phone footer is 10 today) |
| `--t-ui` | 14 | 14 | 1.4 | 0 | Franklin 400 / 500 | nav, labels, links, buttons, footer links, chips |
| `--t-body` | 16 | 16 | 1.5 | 0 | Franklin 400 | default text, descriptions, form values |
| `--t-lead` | 18 | 18 | 1.5 | 0 | Franklin 400 | intro leads, form inputs, brief options, long-form prose (replaces 17) |
| `--t-h4` | 20 | 24 | 1.3 | -0.01em | Franklin 500 | item titles (journal cards, index rows, venture names; replaces 20/22/24/26) |
| `--t-h3` | 28 | 32 | 1.2 | -0.015em | Franklin 500 | block titles (discipline, engagement step; replaces 28/34/36) |
| `--t-h2` | 32 | 44 | 1.1 | -0.015em | Synt 400 | section titles (replaces 36/44/45.92) |
| `--t-h1` | 36 | 56 | 1.06 | -0.01em | Synt 400 | page title, one per page, 4 pages use a different size today (replaces 54/55.44/46/43.92) |
| `--t-display` | 32 | 60 | 1.05 | -0.02em | Synt 400 | services moments, the two "doors", 404 only if it needs one. Max one per section |

Fluid: `--t-h1: clamp(36px, 2.4vw + 21px, 56px)`, `--t-h2: clamp(32px, 1.1vw + 28px, 44px)`, `--t-display: clamp(32px, 4.2vw, 60px)`.

Section label (the small heading above a block, `.site-label`): `--t-ui`, Franklin 500, muted, no uppercase. One look. (Today 14/500, 15/500, 16/500 and 17/600 all exist.)

## 3. Spacing

4px grid, 10 steps: `4 8 12 16 24 32 40 56 72 112`.

| Use | Step |
|---|---|
| inline gap, icon gap | 4 / 8 |
| control padding, list row gap | 12 / 16 |
| between related blocks | 24 / 32 |
| block to block inside a section | 40 |
| section top margin | 72 |
| page band (client logos, footer top) | 112 |
| sub-section | 56 |

Gutter `--site-gutter` 16 / 24 (>=768) / 40 (>=1280), unchanged. Reading measure: body 40 to 48ch, lead 34 to 38ch.
Off-scale values to retire (counts from computed styles across 22 states): 6 (82), 10 (66), 14 (69), 18 (12), 26 (8), 28 (16), 36 (6), 2, -1, and the section paddings 26/28/48/64/88/96/120.
Map: 6 to 4 or 8; 10 to 8 or 12; 14 to 12 or 16; 18 to 16; 20 stays only as 16 or 24; 26 and 28 to 24 or 32; 36 to 32 or 40; 48 to 40 or 56; 64 to 56 or 72; 88 and 96 to 72 or 112; 120 to 112.

## 4. Shape

Radius: `0` (fields, rules, image-free blocks), `3` (every image, tile, frame, thumbnail), `8` (controls: close, filled button, menu row), `16` (floating panels), `999` (the Explore pill only), `50%` (radio dots). Retire 2, 4 and 6.
Borders: always 1px. `--site-line` inside a section; `--site-ink` only as the single opening rule of a major section or the footer base. Field edge = ink underline 1px (`.brief-input`), unchanged.
Focus: 2px ink outline, offset 3px, radius follows the element (unchanged, 15.7:1).
Shadow: one, `--shadow-float: 0 10px 30px rgba(27,26,23,.12)` for the Explore pill/panel, phone sheet and consent dialog. (Three variants today: 10/30, 16/40, -10/30.)
Blur: backdrop blur 8px on the sheet backdrop only.
Opacity: only for hover (.55 to .6) and disabled (.4 to .45). Never on text at rest.

## 5. Motion

Single easing: `--site-ease: cubic-bezier(0.23, 1, 0.32, 1)`. Retire `cubic-bezier(0.4, 0, 0.2, 1)` (phone sheet), `ease`, `ease-out`. Ambient loops (marquee 60s linear, pending dots 1.2s ease-in-out) are exempt.

| Token | ms | Use |
|---|---|---|
| `--d-press` | 120 | pressed |
| `--d-hover` | 160 | color, opacity, underline color |
| `--d-enter` | 200 | page fade, panel, step change, sheet open and close |
| `--d-move` | 300 | progress width, transform, image fade-in (320 today) |

Reduced motion: all durations to ~0 (already global). Exits at 160 or less.

## 6. Components (one look each)

- Text link (nav, footer, meta): `--t-ui` 400 ink, no underline, hover opacity .55. Target height 44 on phone (padding-block, not visual change).
- CTA link ("Start a project" in header and menu): `--t-ui` 500 ink, no underline.
- Inline link (in prose): ink, 1px underline at offset 3, underline color ink; hover underline turns accent. Never yellow at rest (1.48:1).
- Door link (display link, services doors, 404 return): `--t-h2` Synt, 1px ink underline, hover accent. Not larger than `--t-display`.
- Primary action (JP decision): ink fill, paper text, `--t-ui` 500, 44px high, radius 8, padding 0 24, hover opacity .85. Used once per form or page: Send the brief, Send message, Send brand-check request, consent Accept.
- Secondary action: text link with ink 1px underline. Back, Decline, Reset.
- Chip / filter option: `--t-ui` 400 muted; current = ink with 2px accent underline. Height 44 on phone.
- Field: underline only, 44px, `--t-lead` 400, label above `--t-ui` 400 muted (13 today), helper `--t-ui` muted, "optional" in the label with no opacity. Select and textarea identical.
- Section label: see Type. Section opener: margin-top 72, padding-top 32, 1px `--site-line` top border; an ink rule only for the first opener on a page.
- Card (journal, project): image radius 3, title `--t-h4` Franklin 500, category and date `--t-ui` muted, excerpt `--t-body` muted.
- Floating surface (Explore pill and panel, consent): `--site-surface`, 1px line, `--shadow-float`, radius 16 (panel, dialog) or 999 (pill).
- Phone sheet: `--site-sheet`, rows 80px, 64px thumbs radius 3, close radius 8.
- Footer: columns `--t-ui` 500, base row `--t-caption`.
- Dialog (consent, lightbox): same surface as above; lightbox controls sit below the header layer or the header is hidden while open.

## 7. Open decisions for JP

1. Filled primary button: yes or no. The site has no filled button; the form submit and the consent Accept are the only places the eye needs one.
2. Synt for H2: services, brand-check and about mix Synt H1 with Franklin H2. Proposal moves H2 to Synt, item titles stay Franklin.
3. Phone sheet white and #eaeaea stay (his 2026-11-06 reference). Only tokenised.
