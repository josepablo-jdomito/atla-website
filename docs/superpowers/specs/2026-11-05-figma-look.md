# atla.design: the Figma look, measured (2026-11-05)

JP's decision, 2026-11-05: the site feels like AI slop; the look is rebuilt to his Figma as drawn
(file `U5QZmCKgSrT1W21pYYwTRe`, page "Web", sections Index 4423:2308, Project 4423:5596, About 4423:3581).
The mechanics stay (work wall data, search, brief, lightbox, wall-to-image landing, URL filters). The yellow
footer with the Atlas figure, the bracketed labels, the script section titles and the Masonry / Grid / List
switch come back. Fonts: ABC Synt Variable and PP Playground, from JP's Mac ("USE THEM"); licensing is JP's.

## Tokens (Figma variables)
- `01` Marble White `#fafafa` page background. `02` Black Night `#222222` ink. Stone Grey `#8e8e8e` muted.
  Celestial Yellow `#ffc629` footer and the one filled button. Item spacing 10 / 20 / 40 / 60. Dark mode:
  the navbar has a sun/moon toggle (`figmaAssets/v2/toggle-sun.svg`, `toggle-moon.svg`); dark = `#222` page,
  `#fafafa` ink, same yellow. The toggle sets `data-theme`; default follows the system.
- Container 1200, outer padding 20 (1160 inner). Tablet frame 810, padding 10. Phone 390, padding 10.
- Navbar height 50 (40 on tablet and phone): left `Work About Services`, center wordmark SVG 68×28
  (`figmaAssets/v2/wordmark.svg`), right `Journal Contact` + toggle. Items end-aligned. Nav text: Libre
  Franklin Medium 14 / 1.1, tracking 0.28px, color `02`.

## Type
- Body and UI: Libre Franklin Medium 14px, line-height 1.1, letter-spacing 0.28px (`02`); muted `#8e8e8e`.
- Bracket labels: Libre Franklin SemiBold 12px, line-height 1.2, letter-spacing 0.48px, uppercase, written
  with spaced parentheses: `( REGION )`, `( CLIENTS )`, `( THE BRAND )`, `( OTHER WORKS )`. Color `02` on
  index and project-about; `#8e8e8e` in the project hero.
- Footer bottom line: Libre Franklin SemiBold 12 (10 on phone), tracking 0.48px, uppercase.
- Display: ABC Synt Variable (`/fonts/ABCSyntVariable.ttf`, axes wght 400–900, slnt -32–0), Regular 400:
  project title 82px / 1.1 (desktop), 70px tablet, 46px phone; About headline 64px / 1.1, width 548px.
- Script: PP Playground Medium (`/fonts/PPPlayground-Medium.otf`; Light and Thin also available):
  About section titles 140px / 1.1, color `02`, one word (About, Team, Services, Clients, Honors, Press, Contact).
- About body paragraph: Libre Franklin Regular 18px / 1.1, width 456px.

## Index (home) 4423:2308
- Navbar, then at y=200 the filter index: four columns of 275 (gap 20, inner 1160): `( REGION )`
  All / America / Europe / Asia / Middle East; `( INDUSTRY )` All / Hospitality / Food & Beverage / Consumer
  Goods / SAAS / Digital; `( SERVICE )` All / Branding / Art Direction / Packaging / Website; `( VIEW )`
  Masonry / Grid / List. Title → 16px gap → options 14px Medium with 4px gaps; active option `02`, the rest
  `#8e8e8e`. When the tags facets ship, the columns become Sector / Discipline / Place / View, same chrome.
- Cards (Masonry and Grid): square media (aspect 1:1, object-fit cover, no radius), 10px gap, then the
  project title 14px Medium `#8e8e8e`, left aligned. Desktop: 4 columns of 278.75 with 15px gutters, rows 80px
  apart (303.75 card + 80). Masonry = the same grid with cells left empty at random so rows read loose
  (Figma: row 1 has 2 cards, row 2 has 3, row 3 has 3, row 4 has 2, row 5 has 2); Grid = every cell filled.
  Tablet (810): 3 columns of 260, 5px gutters, rows 347 apart. Phone: 1 column, 370 square, rows 433 apart.
- List view: one row per project, 1160 wide: a 200×200 thumbnail placed at a varying x (0, 190, 390, 576,
  773…, i.e. drifting across the row), then a text line 12px under it with three equal columns: project name
  (`02`), service (`#8e8e8e`), `( JAN 2026 )` right aligned (`#8e8e8e`). Rows 263 apart.
- No hero, no H1, no counts. The typed search keeps the floating pill as a search field only (JP kept it);
  the filter columns replace the pill's panel.
- Footer, then nothing else. The client logo band (JP approved 16 marks) sits above the footer.

## Footer 4546:2280 (desktop 1200×750), 4546:2795 (phone 390×780)
- Background `#ffc629`, content bottom-aligned, padding 20. Three columns, 72px apart: `Atla` (Work, About,
  Services, Careers, Journal, Contact), `Socials` (Instagram, Behance, Linkedin, Facebook), `Offices` (140
  wide: city bold left, local time right: Austin US, CDMX MX, Caracas VZ, Lima PE, Tijuana MX). Heads bold
  14, items 14 Medium, 12px between items, 24px under the head. A 320px paragraph 240px below the columns
  (the footer line goes here). Right: the Atlas symbol SVG (`figmaAssets/v2/atlas-symbol.svg`, 180×312
  ratio, full height of the block). Bottom: 1px `#222` rule, 12px gap, `BACK TO TOP ↑` left and
  `2026 ATLA® ALL RIGHTS RESERVED.` right, SemiBold 12 uppercase tracking 0.48. Phone: symbol on top right,
  then the three columns at 12px, paragraph, rule, bottom line at 10px.
- The city clocks are JP's design; they stay (times, not counts).

## Project 4423:5596
- Hero 1200×750: media (image or video) fills the frame; an info panel 660 wide sits over the right side
  (`#fafafa`), inner column 580 wide starting at x=566, content bottom-aligned 23px from the bottom:
  title (Synt 82) → 140px gap → row of two 286.5 columns: `( CLIENTS )` + client name; `( SERVICE )` +
  services as 14px words 10px apart → 95px gap → row: intro paragraph (14px Medium, 229px wide, the
  Sanity description) left; right column: location (120 wide) and `Oct 2025` (month and year).
  Tablet: media 810×354 on top, then the same info stacked (title 70px). Phone: media 390×468, title 46px.
- About section 1200×843: background photo full bleed (a project image) with a `#fafafa` panel 1080 wide
  (padding 20, top 40, bottom 200) holding two columns: left 553px with `( THE BRAND )`, `( THE CHALLENGE )`,
  `( THE RESULT )`, each label then 8px then a 14px paragraph (36px between blocks); right `( CREDITS )`
  list: role `#8e8e8e` left (127–200 wide), names right-aligned `02`, 16px between rows. Data: the three
  paragraphs come from Sanity `body` (first three blocks; while empty, render only the blocks that exist);
  credits from the project's `credits` when present, else the Atla team line "Creative Direction: José Pablo
  Domínguez".
- Media: full-width blocks, no gaps, in this rhythm: pair 600×800 + 600×800, single 1200×750, pair 600×600,
  single 1200×750, pair 600×600, pair 600×600, single 1200×750. Map the project's images in order:
  portraits pair up (600 wide, height by ratio capped at 800), landscapes run 1200 wide. Tablet halves,
  phone stacks at 390 square-ish.
- Other works 1200×647: padding 200 top/bottom, 20 sides; left a 150px-tall thumbnail strip (the next
  project's cover, flex 1), right a 570 column: `( OTHER WORKS )` then 11 rows name left `#8e8e8e`, month
  year right, 4px apart. Keep the wall-to-image landing (`?at=`) and the lightbox.
- Footer.

## About (Why Atla) 4423:3581, URL /about
- Hero 635×350 at y=200: headline Synt 64 / 1.1, width 548: the thesis line (copy: siteCopy.about.title).
- Then sections 120px below, each a row: script title left (545 wide, Playground 140) and content right
  (615 wide): About (18px Regular paragraph, 456 wide: the lead + thesis text), Team (names and roles only,
  no photos: JP's rule; 14px rows), Services (the disciplines as a 14px list), Clients (two columns 14px),
  Honors (MICHELIN Key, Casa Las Tortugas; MICHELIN Green Star, Acre), Press (omit until JP gives items),
  Contact (615×410 card: `#222` with a 60% opacity astronomical image, "Book a Call" 48px Regular `#fafafa`,
  a 20px line, a `#ffc629` button `GET IN TOUCH` SemiBold 14 uppercase tracking 0.56, radius 4: ours reads
  `START A PROJECT` and links to /brief). Row gap about 440px between section tops; phone stacks with the
  script title above the content.
- Services, Contact, Ventures, Brief and the longform pages take the same language: bracket labels, 14px
  Medium body, script titles for page sections, no pills, no icons.

## Assets
- `client/public/figmaAssets/v2/wordmark.svg`, `toggle-sun.svg`, `toggle-moon.svg`, `atlas-symbol.svg`
  (downloaded from the Figma 2026-11-05). Fonts in `client/public/fonts/`.
