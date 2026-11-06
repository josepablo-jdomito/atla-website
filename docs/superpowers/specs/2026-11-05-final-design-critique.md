# atla.design v2: final design critique

The site is close on the case pages, Services and Contact. Four things still stop it from shipping: the Journal shows one stock image six times, Hospitality has an empty photo slot and runs on a trial font, the home page never says what Atla is, and the rule against mono uppercase eyebrows is broken on almost every page.

Decision: fix the P0 items before JP's pass (they are listed at the end).

- Date: 2026-11-05. Branch `feat/site-v2` (worktree `figma-shell-home`). Read-only review: no code was changed.
- Server: the review started on `localhost:5052`. That server stopped answering partway through, so the rest was reviewed on a fresh server at `localhost:5054`.
- How it was checked: the browser pane at 1440x900 and 390x844, plus headless Chrome through the DevTools protocol for full-page captures at both sizes. In-page JS was used for the DOM, font, alt-text and link checks.
- Screenshots: `final-critique-shots/`. Files named `*-desktop(-full).png` and `*-mobile(-full).png` are static captures. The `.jpg` files are interactive states taken in the browser pane.
- Grey blocks in the full-page captures are lazy images that had not loaded yet, not defects. The exception is Hospitality's Casa Las Tortugas slot, which has no image in the code.

---

## `/` Home: the work wall
**Verdict: fix**

What works: the wall is the brand. Paper-and-ink palette, quiet chrome, the work leads. This is close to Cosmos-level restraint.

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| H1 | The page has no `<h1>` and no statement of what Atla is. The only words are the nav and "Explore". The line "When your brand has to change, start here." sits in the footer, and infinite scroll keeps pushing the footer away. A first-time visitor gets 72 tiles and no thesis. | `main`, no heading | `home-desktop.png` | Add one quiet line in the same ink and size as the nav, top left above the wall or as the first wall cell. Example: "atla, a brand studio for companies at a turning point." Also add a visually hidden `<h1>`. |
| H2 | The footer can never be reached. Every scroll to the bottom loads more tiles: 72 became 216 after one scroll to the end, and the footer top was still about 4,400 px below the viewport. | infinite loader | `home-desktop.png` | Stop after the catalog has looped once and render the footer, or add a "That is the work" end card that links to Services, Why Atla and Contact. |
| H3 | Explore search ranks poorly. "coffee shop" puts Shop Latinx first because of the literal word "shop", then Mundã and The Bridge. Baristio, Pax & Beneficia and Rústico come later. All 72 tiles stay on screen, so the results are a reshuffle, not a filter, and nothing tells the visitor what matched. | Explore → `?q=` | `home-explore-coffee-shop-desktop.jpg` | Show matches only, with a one-line plain result above the wall ("Coffee and hospitality work"). Keep the count out of the copy. Weight industry tags over literal title words. |
| H4 | The Explore panel uses mono uppercase eyebrows (FILTER THE WORK, REGION, INDUSTRY, SERVICE, YEAR). This breaks the founder's rule. | `.site-explore` panel | `home-explore-panel-desktop.jpg` | Set the labels in Libre Franklin 500, sentence case, at the same size as the options. |
| H5 | The text input inside the pill has a hard rectangular focus box that clashes with the pill's round shape. | Explore input | `home-explore-panel-desktop.jpg` | Drop the outline on the input and put the focus ring on the pill (`:focus-within`). |
| H6 | All 72 wall images have empty `alt`. The links have `aria-label`, so screen readers are covered, but image search and AI crawlers get nothing. | `main img` | n/a | Use alt = "Project, short description of the image". |
| H7 | Escape closes the panel and also clears the query, so the visitor loses their search. | Explore | n/a | Escape closes the panel only. Clear the query only with the "Clear" control. |

## `/projects/rustico` and `/projects/tigretigre`: case pages
**Verdict: fix**

What works: the image sequence, the lightbox (Escape, arrow keys, visible Close focus) and the "Building something like this?" close.

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| P1 | There is no story. The story column is one dek line and `story-body` contains only images. A CMO cannot see the problem, the decision or the result. | `.story-body` | `rustico-desktop-full.png` | Add three short paragraphs under the dek (the situation, the call made, what changed), or a short captioned beat every few images. Pull the copy from the case-study drafts in `2026-11-05-case-studies/`. |
| P2 | The two pages are inconsistent. Rústico names its client ("Acre Resort") and has a crafted dek. TigreTigre has no client and a generic dek with an em-dash ("…bold visual energy and editorial detail"). | `.story-head__facts`, `__lead` | `tigretigre-desktop-full.png` | Use one fact line on every project (Client · Year · Disciplines). Rewrite the TigreTigre dek in the Rústico voice. |
| P3 | The `?at=` landing from a wall tile scrolls to the clicked image, and that image can be the last one. The visitor arrives with no title, sees one image, then "Building something like this?" (Pax & Beneficia). | `?at=` scroll | `pax-at-landing-desktop.jpg` | Keep the deep scroll but pin a slim title bar (project name and year) while the head is off screen, or land with the head visible and the target image highlighted. |
| P4 | Font flash on first load: the dek renders in Georgia, then swaps to Instrument Serif. Libre Franklin shifts the nav. | `<head>` fonts | `rustico-fout-desktop.jpg` | Preload the Instrument Serif and Libre Franklin woff2 files, or self-host them with `size-adjust` fallbacks. |
| P5 | Alt text is generic ("Rústico, image 1"). | `.story-media img` | n/a | Describe each image ("Embossed suede menu, Rústico"). |
| P6 | The "Next" card is 14px Libre Franklin under a 40px Instrument Serif CTA. The hand-off is too weak to pull a visitor to the next project. | `.story-next` | `rustico-desktop-full.png` | Make the next project's name the headline and the image larger, the same size as a wall tile. |

## `/services`
**Verdict: fix**

What works: the outcome-led discipline lines and the moment filter (Raise capital narrows the list and adds a contextual line). This is the strongest page for a CMO.

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| S1 | Counts break the founder's rule: "Six disciplines, one team", "Four ways in", "Two weeks inside your brand". "Six" also stays on screen after the filter cuts the list to three. | intro, engagement section | `services-raise-capital-desktop.jpg` | "Every discipline, one team." · "Ways in." · "A short audit inside your brand." |
| S2 | "Start a project" repeats under every discipline (seven times on the page), which adds noise. | discipline rows | `services-desktop-full.png` | Keep "See what is included" per row and one CTA at the end. |
| S3 | The side image (Casa Colora) is the same for every discipline and every moment. | right column | `services-desktop.png` | Swap the image per hovered or open discipline, or drop the column. |
| S4 | "Grow / scale" uses a slash. | moment tab | n/a | "Grow". |

## `/about`: Why Atla
**Verdict: fix**

What works: the headline ("Most brands are built for the launch. We build them for the years after."), "Taste is the job." and the Michelin proof.

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| A1 | Section labels are mono uppercase eyebrows: WHAT WE BELIEVE, HOW WE WORK, PROOF, SELECTED CLIENTS, WAYS TO WORK WITH US, TEAM, WHERE WE ARE. | left rail labels | `about-top-desktop.jpg`, `about-desktop-full.png` | Set them in Libre Franklin 500, sentence case, 16px. Or remove the rail and let the section headlines carry the page. |
| A2 | The page reads like an AI startup. AI is named in the intro, in the "Machines do the legwork" section title and in three of the five steps. For a consumer CMO the takeaway becomes "AI shop", not "taste". | How we work | `about-desktop-full.png` | Say it once ("We use software for the slow parts; a creative director decides what ships."). Retitle the section "How we work" and drop "AI" from the steps. |
| A3 | Proof is buried. Michelin Key and Green Star sit in the third section, after the beliefs. | Proof | `about-desktop-full.png` | Move proof directly under the headline, and add the client list there. |
| A4 | "Ways to work with us" repeats the Services engagement block word for word. | section | `about-desktop-full.png` | Link to Services instead. |
| A5 | Counts: "Three companies we design for are companies we own" (Ventures lists four), "Four ways in", "Two weeks". | Proof, Ways | n/a | "Some of the companies we design for are ours." |
| A6 | The belief titles are about 15px Instrument Serif, which is too small for a display face and reads like a fallback serif. | `.belief h3` | `about-top-desktop.jpg` | Set them at 22px or more, or in Libre Franklin 500. |

## `/contact`
**Verdict: fix**

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| C1 | Filled black pills ("Start a project", "Send message") break the rule against pills. | buttons | `contact-desktop-full.png` | Use an underlined text link in ink, the same treatment as the header "Start a project", or a square-cornered ink button. |
| C2 | Mono uppercase eyebrows: EMAIL, ELSEWHERE, CITIES. | info row | same | Sentence-case Libre Franklin. |
| C3 | Two intake paths compete: the Brief CTA and a full form. The form prompt also differs from the line above it ("what feels off" vs "what feels misaligned"). | form | same | Keep the form as the fallback, use one prompt wording, and keep the brief primary. |
| C4 | "Jose Pablo" is missing the accent; the Team list says "José Pablo". | intro | same | "José Pablo". |
| C5 | The cities appear twice on the page (info row and footer). | info row | same | Drop the row and leave them in the footer. |

## `/ventures`
**Verdict: fix**

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| V1 | Text-only list with an empty right half. Owning brands is the strongest proof on the site, and here it is the weakest page. | list | `ventures-desktop-full.png` | One image per venture, in the same frame as the wall tiles. |
| V2 | "TigreTigre: A restaurant." is weak and the lines are uneven. | descriptions | same | "TigreTigre: sake and Japanese food, Cabo." Match the specificity of "Surrealist gin from Mexico." |

## `/brief`
**Verdict: fix**

What works: one question per screen, chips that advance when clicked, and a working Back.

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| B1 | A "01 / 07" counter and mono uppercase eyebrows (BRIEF, ENTER TO CONTINUE, BACK). This breaks the no-numbers rule and the no-eyebrow rule. | top bar, hint | `brief-desktop.png` | Use a thin progress line with no numbers, and drop the BRIEF label. Show "Press Enter" in sentence case on desktop only, and hide it on touch. |
| B2 | Pressing Continue on an empty field does nothing and shows no message (Nielsen: visibility of system status, error prevention). | Continue | n/a | Keep the button disabled and say why in the helper line ("A sentence is enough to start."). |
| B3 | The Continue pill and the radius-14 chips read as pills. The "←" glyph adds an icon. | buttons | `brief-desktop.png` | Use square ink buttons and text "Back". |
| B4 | Options use slashes ("Consumer / CPG", "Tech / startup", "Real estate / lifestyle"). | Q2 chips | n/a | "Consumer brands", "Technology", "Real estate". |

## `/hospitality`
**Verdict: rethink**

The editorial direction was approved on 2026-10-23, but this page is a different site from v2: a different display face, dark bands, roman numerals, uppercase labels and generic copy.

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| Ho1 | The display font is `'ABC Synt Variable Unlicensed Trial'`. It is installed only on JP's Mac, so JP reviews a trial font that visitors never see; they get Instrument Serif. | `DISPLAY` in `AtlaHospitality.tsx:14` | `hospitality-desktop-full.png` | Remove it from the stack, or license it and self-host it. JP must judge the page in the font visitors get. |
| Ho2 | Casa Las Tortugas, the Michelin Key case, is an empty grey block. The code marks every other photo as "TEMPORARY (design review only)", borrowed from Sanity until JP's photos arrive. | case image slots | same | JP's photos in every slot before merge. Until then, hide any slot without a photo. |
| Ho3 | Template copy: "We believe in a holistic approach to branding…", "Branding goes far beyond visuals, it's the foundation…", "meaningful, long-term relationships that inspire loyalty and trust". This is the Framer-template voice the brand bans. | Services intro, "Our take on branding" | same | Cut the "Our take" section and its floating collage. Replace the services intro with one line in the case voice. |
| Ho4 | Uppercase tracked labels everywhere (RESTAURANTS · WELLNESS…, SCOPE, DISTINCTION, BOOK A CALL), roman numerals I/II/III, and "Three ways", "ten rooms or four restaurants". | labels, numerals | same | Sentence case, no numerals, no counts. |
| Ho5 | Dark full-bleed bands for Services and the form break the paper-and-ink rhythm of the rest of the site. | sections | same | Keep the page on paper; use a hairline and space to separate sections. |

## `/journal`
**Verdict: rethink**

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| J1 | All six cards use the same Tequila Unido photo (one unique `src`). | card images | `journal-desktop-full.png` | A real cover per post, or text-only cards until covers exist. |
| J2 | Filter pills (All, Branding, Insights, Strategy, Web Design) with a yellow dot break the rule against pills. | filter row | same | Text tabs, like the Services moment tabs. |
| J3 | The top row repeats the first three posts listed directly below it. | featured row | same | Remove it. |
| J4 | Mono uppercase category eyebrows and dates. The headline ("Essays, process notes, and studio perspectives") and the intro are filler. | cards, hero | same | "Journal" plus one line. Categories in sentence case, or none. |
| J5 | SEO-bait titles ("What Is a Branding Agency? Definition, Types…") sit next to a founder essay, and "a simple 0 to 2 score" breaks the no-numbers rule. | posts | same | Keep SEO pieces reachable but out of the first screen, and lead with the opinion pieces. |

## `/privacy`
**Verdict: fix** (legal draft, pending JP's approval per commit `e8aea4c`)

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| Pr1 | No "Last updated" date. | head | `privacy-desktop-full.png` | Add "Updated November 2026". |
| Pr2 | Mono uppercase section heads. | h2s | same | Sentence-case Libre Franklin 500. |
| Pr3 | The legal text needs a lawyer's sign-off before it carries legal weight. Agents draft only. | page | same | Gate the merge on JP or counsel. |

## Footer (all pages)
**Verdict: fix**

| # | Defect | Element | Shot | Fix |
|---|---|---|---|---|
| F1 | "Programs" links to a legacy page with a PROGRAMS eyebrow and "01 / 02 / 03" step numbers. Its H1 is the footer's own line, "When your brand has to change, start here." | footer nav | `footer-desktop.jpg` | Remove Programs from the footer, or bring the page to v2 rules. |
| F2 | The cities column has tighter line spacing than the other two columns. | `.site-footer` cities | `footer-desktop.jpg` | Use the same list style in every column. |
| F3 | Unreachable on Home (see H2). | n/a | n/a | n/a |

## Site-wide craft floor
- **Selection colour:** there is no `::selection` rule anywhere in `client/src`, so selected text shows browser blue on paper. Add `::selection { background: ink; color: paper }` or use the accent.
- **Focus rings:** `:focus-visible` uses a 2px accent outline across `.site-root`, the lightbox and Explore. Pass, apart from H5.
- **Reduced motion:** a `prefers-reduced-motion` block exists. Pass.
- **Contrast:** muted text #6f6a61 on paper #f6f3ec is about 4.8:1. Pass. The disabled Continue state is about 2:1, which is allowed for a disabled control, but the button gives no reason why it is disabled (B2).
- **Mobile 390:** no horizontal scroll on Home or Services. The wall uses 2 columns. The case pages are clean.

---

## Top 10 across the site

| Rank | Priority | Item | Page |
|---|---|---|---|
| 1 | P0 | Six journal cards share one stock photo. | /journal (J1) |
| 2 | P0 | The Casa Las Tortugas slot is empty, and the other Hospitality photos are temporary borrows. | /hospitality (Ho2) |
| 3 | P0 | The trial font is in the Hospitality font stack, so JP reviews a different face than visitors see. | /hospitality (Ho1) |
| 4 | P0 | Home has no h1 and no thesis, so a stranger cannot tell what Atla is. | / (H1) |
| 5 | P1 | Mono uppercase eyebrows on Explore, About, Contact, Brief, Journal and Privacy. | site-wide |
| 6 | P1 | Case pages have no story. Images only, so there is no reason to believe the work was strategic. | /projects/* (P1) |
| 7 | P1 | Counts and numbers break the founder's rule: Six, Four, Two weeks, Three, 01 / 07, I II III, 0 to 2. | services, about, brief, hospitality, journal |
| 8 | P1 | The Home footer cannot be reached, and Explore reshuffles the wall instead of filtering it. | / (H2, H3) |
| 9 | P2 | Pills outside Explore: Contact buttons, Brief buttons, Journal filters. | contact, brief, journal |
| 10 | P2 | Hospitality template copy and dark bands; About over-explains AI. | /hospitality (Ho3), /about (A2) |

## CMO test: 60 seconds
**What the site now says:** this studio has taste and range. Hospitality and food-and-beverage work is visibly strong. They think in systems that outlast the launch ("A brand has to survive its third agency"). They have Michelin-recognized clients, and they run their own brands. Services finally speaks in outcomes (launch, raise, reposition), which a CMO can map to a budget line.

**Where a CMO loses confidence:** on the home page, which says nothing for the first 60 seconds. Then on a case page, which shows beautiful images but no problem, decision or result. Nothing proves Atla can carry a large brand across agencies, markets and retail; the client list is mostly independent hospitality and DTC, and none of it is named or framed at scale on Home. If the CMO clicks into the Journal, the same photo six times reads as unfinished. If they reach About, the AI-forward method can read as a cheaper production model rather than senior judgment.

**What the site still fails to say:** who Atla is for (companies at a turning point, as the Programs H1 already says), what changes for the business after working with them, and why a large consumer brand should trust a small senior team over a network agency.
