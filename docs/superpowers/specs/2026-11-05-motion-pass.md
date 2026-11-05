# Motion pass, atla.design v2 (2026-11-05)

Recommendation: the site is already close to right. Six small moves, all CSS, no new library, and five deliberate skips. Nothing new is added that a visitor would call "an animation"; the work is trimming, de-blinking and moving the one JS fade off the main thread.

Method: `find-animation-opportunities` over `client/src`, then `emil-design-eng` and `choreograph` as the judges (frequency, purpose, easing, one moment per page, transform/opacity only, CSS over JS under load). Judged on the real pages at `http://localhost:5053` on 2026-11-05 at 1440 and 390 (home, Explore open and typing "coffee", /brief step 1 to 2, /services, footer, Menu sheet). Source of every "today" value: `client/src/styles/site.css` and the components named below, at commit 88bc273.

## 1. Inventory of what moves today

| Moment | File | Today |
| --- | --- | --- |
| Wall tile appears as its image loads | `site.css` 220 to 227, `WorkWall.tsx` Tile | opacity 0 to 1, 480 ms, `--site-ease`, per image on `load` |
| Wall tile hover | `site.css` 230 to 233 | `filter: brightness(0.94)`, 320 ms, hover-gated |
| Typed search narrows the wall | `WorkWall.tsx` 150 to 230 | 220 ms debounce, then the whole wall rebuilds: every tile remounts, blinks to the placeholder grey and fades in again over 480 ms |
| Explore panel opens | `site.css` 981 to 1014 | keyframe `site-explore-in`, 200 ms, translateY(8px) scale(0.98), origin bottom center. No exit: the panel is unmounted on close |
| Explore pill widens on focus | `site.css` 945 to 961 | `width` 7ch to 32ch, 200 ms |
| Route change | `PageShell.tsx` | framer-motion opacity 0 to 1, 200 ms, `[0.23, 1, 0.32, 1]`, no exit, no fade on the landing page |
| Brief, question to question | `site.css` 307 to 316 | keyframe, 200 ms, 8 px lift, direction-aware (back lifts from above). Progress bar scaleX 300 ms; pending pulse 1.2 s |
| Buttons (brief, pill) | `site.css` 304, 368, 484 | `:active` scale(0.97), 160 ms |
| Text links | `site.css` 77 to 79 | opacity 0.55 on hover, 160 ms |
| Mobile Menu sheet | `SiteHeader.tsx`, `site.css` 129 to 136 | `hidden` attribute: appears and vanishes instantly |
| Header on scroll | `SiteHeader.tsx` | nothing |
| Footer line | `SiteFooter.tsx` | nothing |
| Reduced motion | `site.css` 47 to 53 | global: every transition and animation to 0.01 ms, plus per-component `transition: none` and `transform: none` |

## 2. Proposal

| # | Moment | Page | What moves | Duration | Easing | Trigger | Reduced motion | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Wall tile fade-in | Home | opacity only, as today | 480 ms to **320 ms** | `--site-ease` | image `load` | instant (global rule) | **Do.** 480 ms reads as slow on cached images: a scroll into an already-loaded pass shows a visible lag. 320 ms keeps the soft arrival. No stagger: the network already staggers the first paint, and an authored stagger on 72 tiles per pass is the Framer-template tell. |
| 2 | Wall tile hover | Home | `brightness(0.94)`, as today | 320 ms to **160 ms** | `ease` | pointer, hover-gated | none (filter is not motion) | **Do.** Hover is tens of times per visit, so it gets the shortest budget. The dip stays: with no caption or chrome it is the only sign the tile is a link. Cosmos shows nothing on the image, which is also defensible, but a cursor change alone is weak on a wall of images. |
| 3 | Typed search narrows the wall | Home | nothing new; remove the blink | 0 | n/a | keystroke (220 ms debounce) | same | **Do.** Keyboard-driven results must land instantly, so the snap is right. What is wrong is the blink: tiles whose image is already decoded remount at opacity 0 and fade in again. Fix: a tile mounts as loaded when `img.complete` and `naturalWidth > 0`. Rejected: FLIP or `layout` animation of 72 tiles, which runs on the main thread while images decode and is exactly the case Emil's Vercel example drops frames on. |
| 4 | Explore panel open and close | Home | opacity, translateY(8px) scale(0.98), origin bottom center, as today | open 200 ms, **close 120 ms** | `--site-ease` | pointer open; pointer close via Close or click outside | opacity only, 0.01 ms (global) | **Do.** Origin is already right (it grows from the pill). Two gaps: it is a keyframe, so a blur and refocus restarts from zero, and it has no exit, so Close makes the panel vanish while the pill stays. Move to a transition driven by `data-state`, keep the panel mounted 120 ms on a pointer close, unmount on `transitionend`. Escape and Enter close instantly: keyboard never animates. |
| 5 | Route change | All | opacity 0 to 1, as today | 200 ms | `--site-ease` | navigation | none (`data-landed` skips the keyframe) | **Do.** Same look, different engine: a CSS keyframe on `.site-page` instead of framer-motion. The fade runs exactly when the browser is busiest (new page, new images), where JS fades drop frames and CSS does not. Removes framer-motion from the shell; the landing page still paints without a fade. |
| 6 | Mobile Menu sheet | All, under 768 | opacity 0 to 1 | 160 ms | `--site-ease` | Menu button (pointer) | instant | **Do, lowest priority.** Opened once per phone visit. `@starting-style` plus `transition-behavior: allow-discrete`, so the `hidden` attribute keeps working and older browsers simply get today's instant sheet. Opacity only: a sheet that slides is a drawer, and this is a page of links. |
| 7 | Brief, question to question | /brief | as today | 200 ms | `--site-ease` | answer or Back | already `animation: none` | **Skip, keep as is.** One entrance per screen, direction follows the action, 8 px is the right distance, exit is instant. Nothing to add; a crossfade of two screens would mean two mounted forms. |
| 8 | Header on scroll | All | nothing | | | scroll | | **Skip.** A header that shrinks, hides or blurs on scroll is the AI-startup page. The bar is 64 px of text; it stays. |
| 9 | Footer line on arrival | All | nothing | | | scroll into view | | **Skip.** "Fade up when it scrolls in" is the Framer default and the footer is seen at the end of every page. Copy does not perform. |
| 10 | Wall tile press | Home | nothing | | | pointer down | | **Skip.** Images do not deform. The tile is a link pressed once. |
| 11 | New wall pass stagger | Home | nothing | | | infinite scroll | | **Skip.** Choreograph rule: never let item 20 wait 20 times the delay. Loading already staggers. |
| 12 | Explore pill width on focus | Home | `width`, as today | 200 ms | `--site-ease` | focus | | **Keep.** Width is layout, not transform, but it is one fixed 48 px element with nothing around it to reflow. Not worth a transform trick. |
| 13 | Services, About, Ventures sections | pages | nothing | | | scroll | | **Skip.** Reading pages. Text that arrives on scroll is decoration on content the visitor is trying to read. |

Top three by effect: rows 1 and 2 (the wall is the site), row 3 (the blink JP noticed), row 4 (the only popover). Row 5 is invisible when it works and is a performance change; row 6 is the smallest.

## 3. Choreography check (the only event with more than one moving part)

Explore open: the pill widens (200 ms) and the panel rises (200 ms) together, same easing family, same start. That is one gesture, not a queue. Filter options inside the panel do not stagger: one entrance per container, the panel carries them. No change.

## 4. Decision and result

JP chose "All six" on 2026-11-05 (AskUserQuestion in the motion-pass session). Implemented in commit d35672c on branch `claude/site-v2-motion-50b980`, this doc in the commit after it. Not pushed, not merged: the parent session merges.

Files: `client/src/styles/site.css`, `client/src/components/site/PageShell.tsx` (framer-motion removed from the shell), `WorkExplore.tsx` (open, closing, closed states), `WorkWall.tsx` (a cached image mounts as loaded), new `motionPass.test.ts` (8 tests).

Checks, all read back on 2026-11-05:

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | clean |
| `npx vitest run` | 126 passed, 19 files (118 before, 8 new) |
| Home at 1440, computed style of a tile image | `opacity 0.32s cubic-bezier(0.23, 1, 0.32, 1), filter 0.16s` |
| Explore panel right after open | `data-state="open"`, opacity 0 at frame zero, transition 200 ms on opacity and transform, origin bottom center |
| Close button | `data-state="closing"`, transition-duration 0.12 s, unmounted by 300 ms |
| Query change to `?q=hotel`, read 30 ms later | 32 of 58 tiles already `data-loaded="true"`: the cached ones no longer re-fade |
| Navigate Home to About, 600 ms later | `.site-page` animation `site-page-in`, 0.2 s, no `data-first-paint`, no inline style |
| Landing paint | `data-first-paint` present, animation none |
| Phone (390) Menu sheet | opacity 0 at open, 1 at 250 ms, transition `opacity 0.16s` |
| Reduced motion | jsdom: a pointer close unmounts at once; CSS block switches `.site-explore__panel`, `.site-page`, `.site-sheet` off |

No GIF: the browser pane does not record video. Screenshots of the states are in this session's transcript; the computed values above are the proof.

Skipped, by design: header on scroll, footer line on arrival, brief transition (already right), tile press, stagger on new passes, scroll reveals on the reading pages, layout animation of the wall on search (main thread under image decoding).

Left as found, for the parent session: the Explore pill draws over the open phone Menu sheet (z-index 60 above the sheet); not motion, not touched.

Decision: none. Next action for the parent: merge `claude/site-v2-motion-50b980` into `feat/site-v2`.
