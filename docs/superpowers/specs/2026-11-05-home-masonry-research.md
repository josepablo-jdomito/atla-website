# atla.design home: masonry research and scheme

**Recommendation: build the home as a Cosmos-style masonry of 4 fixed columns at 1440 and 2 at 390, native cover ratios with no crop and no spans, shortest-column placement, portraits spread one every three or four tiles, the pool looping for the infinite scroll. Scheme: `2026-11-05-home-masonry-scheme.html` (A is this direction, B and C are the alternatives).**

Date: 2026-11-05. Author: research session for the v2 home (branch feat/site-v2). Read-only: no code touched.

Decision for JP: pick A, B or C (asked in the session).

---

## 1. Skills that apply (checked 2026-11-05 in `~/.claude/skills`)

| Skill | Applies | How |
|---|---|---|
| `superpowers:brainstorming` | yes, process | Any build step after JP's answer starts here: one direction, then a spec, then code. |
| `impeccable` (`layout`, `quieter`, `critique`) | yes | Its `layout` mode sets grid, rhythm and spacing; `quieter` strips chrome; `critique` is the gate before showing JP. Reads `.impeccable.md` first. |
| `frontend-design` | yes, for the build | Production CSS and React once the scheme is approved. Not for this research. |
| `better-layout` | yes, for the build | Resize and stress test of the masonry (reflow at 768, 1024, 1920; RTL irrelevant). |
| `emil-design-eng` | partly | Only the image fade-in and the hover decision. No motion beyond that. |
| `web-design-guidelines`, `better-accessibility` | yes, at review | Keyboard order through tiles, alt text, touch targets at 390. |
| `taste-distillation`, `taste-application` | no | Video style packs. Name sounds relevant, content is not. |
| `superpowers:writing-plans`, `superpowers:test-driven-development` | yes, after approval | The parent session's plan step 13 owns this. |

## 2. References, measured live (browser pane, 1440x900 and 390x844)

Screenshots in `masonry-refs/`. Numbers come from `getBoundingClientRect` on the rendered images; a value marked "about" was read from a screenshot.

| Site | Columns 1440 | Column width / gutter / outer | Columns 390 | Ratios | Crop | Placement and order | Take | Leave |
|---|---|---|---|---|---|---|---|---|
| cosmos.so/explore | 5 | 250 / 32 / 32 (container 1376) | 2 at 166 / 17 / 21 | native, 0.66 to 1.98 | none (`object-fit: cover` inside a box sized to the native ratio) | JS masonry, tiles `position: absolute` with `translateY`; next tile goes to the shortest column; batches of ~60 appended on scroll (60 → 135 images after one scroll to the bottom) | fixed column width, native ratio, shortest-column placement, 32 gutter, fade-in on load, no caption on the tile | 3px radius, hover "Save" pill, search bar, category pills, section headings, counts ("66 elements") |
| savee.com (home grid) | 5 | 262 / 16 / 33 | not measured (marketing page) | native, 0.55 to 1.75 | none | column fill, shortest column | the tighter 16 gutter reads denser and more "wall"; good comparison point for gutter | full-bleed hero and app pills |
| are.na/explore | 4 | 316 square cells / about 58 / 65 | not measured | native image inside a fixed 316x316 cell (`object-fit: fill`, letterboxed) | none, letterboxed | plain grid, fixed row height | nothing for the home; the square cell kills rhythm | square cells, captions under each cell |
| pentagram.com/work | 3 | 456 / 12 / 24 | 1 at 366 / 12 | all cropped to 3:2 (and 1:1 thumbs) | yes, every cover | fixed grid; feature tiles span 2 columns (924 wide); title and one-line description under each | the span-2 feature as an option (direction B); 12px gutter is too tight for Atla | the "Showing the latest 40 projects" count (banned by VIGENTE), the crop |
| koto.com/work | 2 | 551 to 574 / 32 / sidebar 331 | 1 at 358 / 16 | 3 fixed crops: 0.83, 1.41, 1.8 | yes | 2 columns, staggered start, title and one line under each | the staggered column start (second column begins lower) | sidebar with filters, dark theme, crops |
| wearecollins.com/case-studies | 4 | 340 / 16 / 16 | 2 at 163 / 16 / 24 | 3 fixed crops: 0.67, 0.75, 0.8 (all portrait) | yes | 4 columns, each column starts at a different y (460, 517, 545, 460), columns are offset left and right in alternating rows (x 16, 202, 372, 558...) | the stagger of column starts is the closest "editorial" rhythm among studio sites | pill toggle (Shelf / Spines), dark theme, the all-portrait crop |
| motherdesign.com | carousel, not a grid | | | | | | nothing | |

Cosmos facts not in the table: outer margin 32 each side (33 measured, 1 px rounding); vertical gap 32 (tile at y 511 with height 250 ends at 761, next starts 793); container height set by JS (18751px for 70 tiles at 5 columns); the first row is five tiles of 0.76, 1, 0.75, 0.8, 0.8; square and 4:3 tiles are the rhythm breakers.

## 3. The Cosmos algorithm, inferred

1. **Columns**: fixed count per breakpoint, fixed width. 1440 → 5 at 250. 390 → 2 at 166. Column width = (container − (n − 1) · gutter) / n.
2. **Gutter**: 32 at desktop, 17 at phone, the same horizontally and vertically. Outer margin equals the gutter.
3. **Ratio**: native. Tile height = column width / image aspect ratio. Nothing is cropped or normalised. Tiles range from 0.55 to 2.0; no clamp was observed.
4. **Placement**: shortest-column-first. Each new tile goes to the column whose bottom is highest on the page. Ties go left to right. This is why the first row is five tiles across and the second row is ragged.
5. **Order**: the feed order (editorial for "Selected", recency for "Explore"). No visible re-ordering to avoid runs: on the explore page, column 1 shows 0.76, 1.73, 0.8, 0.8, 0.8 in sequence. The rhythm comes from the variety of the content, not from a rule. Three portraits in a row do happen.
6. **Spans**: none. Every tile is one column wide. Featured pieces get no extra width.
7. **Seed**: the first viewport is simply the first n items of the feed. No special seeding.
8. **Hover**: a "Save" pill fades in at the top right of the tile. No zoom, no caption, no darken.
9. **Load**: infinite scroll, batches appended; tiles fade in (`animate-fade-in`).
10. **Tile anatomy**: image only. No title, no client, no year on the tile.

## 4. What the Atla pool looks like (Sanity, project dvufm78f, 2026-11-05)

34 projects with a cover. Two ratio families only: 10 portraits, all 3:4 (0.75), and 24 landscapes between 1.5 and 1.82 (mostly 16:9 and 1.81). No squares, no 4:3, no 2:1.

- The native-ratio masonry therefore cannot produce Cosmos's variety from covers alone. It produces a two-note rhythm: tall and wide. That is still better than a crop, but the order has to do the work the content does on Cosmos.
- Galleries hold 5 to 15 images per project with ratios from 0.51 to 3.87. Many galleries share the same first four ratios (0.78, 0.67, 1.97, 1.56): a mockup template reused across projects. If the loop ever pulls gallery images into the home (the repeat rule allows the same project more than once), those four would repeat visibly. Covers only, for now.
- `homeOrder` is unset on every project, so the "featured first" sort falls through to year descending. Any seeding of the first viewport needs homeOrder filled in Sanity (content task, not code).

## 5. Where Cosmos and the atla.design rules conflict (rules win)

| Cosmos does | Rule | What the home does |
|---|---|---|
| Search bar, category pills, section headings | VIGENTE: home opens with the work, no H1, no hero; `.impeccable.md`: chrome stays quiet | Header line, masonry, footer line. Nothing between header and first tile. |
| "66 elements", "34 projects" | VIGENTE: no counts anywhere | No count. The v2 "34 PROJECTS" label goes. |
| "Save" pill on hover | hospitality decision: no pills, no chips, no icons | Hover shows nothing, or one quiet text line (client, year) below the tile. The scheme assumes nothing. |
| 3px radius | editorial direction: cream paper, ink | Square corners. |
| Tiles of random web images | VIGENTE: repeated projects are intentional, infinite scroll | The 34 covers loop; pass two starts one column over so the same cover never lands in the same column twice in a row. |
| Order by recency, runs of portraits allowed | `.impeccable.md`: keep rhythm consistent | Order rule below spreads portraits. |
| Any tile can be any ratio | the pool is 0.75 or ~1.78 | Accept the two-note rhythm (A) or crop to it on purpose (C). Do not fake variety with decorative blocks. |

## 6. The ordering rule applied in the scheme (direction A)

1. Pool = the 34 covers in API order (featured by `homeOrder`, then year descending).
2. Split into portraits (10) and landscapes (24), each keeping API order.
3. Build the reading sequence: one portrait every 34/10 ≈ 3.4 slots (a running accumulator), never two portraits adjacent in the sequence. Result: the first row at 1440 is landscape, landscape, landscape, portrait; the first viewport holds 14 tiles at 1440 and 12 at 390, and at least one portrait in each.
4. Place with shortest-column-first, 4 columns at 1440 (320 wide, gutter 32, outer 32), 2 columns at 390 (167 wide, gutter 16, outer 20).
5. When the pool ends, start again with the sequence rotated by one, so the second pass shifts every cover one column to the right.
6. No spans, no crop, no caption at rest.

Why 4 columns and not Cosmos's 5: at 250px a branding cover becomes a thumbnail; at 320 a 3:4 cover is 427px tall and a 16:9 cover is 180px tall, both readable. Pentagram's 456 (3 columns) makes the page a list of three; Collins's 340 (4 columns) is the closest studio precedent.

## 7. The three directions for JP

| | A. Cosmos-faithful | B. Editorial spans | C. Uniform rhythm |
|---|---|---|---|
| What | 4 fixed columns, native ratios, no spans | Same as A, but the first three featured covers span two columns | Same placement as A, every cover cropped to 3:4 or 3:2 |
| First viewport at 1440 | 14 covers | 7 covers (three of them 672 wide) | 14 covers |
| Needs from content | nothing | `homeOrder` set on three projects in Sanity; those three covers must survive at 672 wide | crop decisions on 34 covers (where the focal point is) |
| Risk | the two-note rhythm can read as "tall, wide, tall, wide"; if it does, the fix is in the order, not in decoration | the spans read as a hero, which VIGENTE rejected three times; one span is a hero with a different name | crops hide the work; `.impeccable.md` says the work is the hero |
| Verdict | recommended | only if JP wants a curated front | not recommended |

## 8. Sources

- cosmos.so/explore, savee.com, are.na/explore, pentagram.com/work, koto.com/work, wearecollins.com/case-studies, motherdesign.com: measured live on 2026-11-05 in the Claude browser pane at 1440x900 and 390x844. Screenshots in `masonry-refs/`.
- Atla projects: Sanity CDN query on project dvufm78f, dataset production, 2026-11-05, same GROQ order as `server/sanity/projectService.ts`.
- Rules: `Obsidian-Vault/Memory/VIGENTE.md`, section atla.design (entries dated 10-04, 10-23, 10-25, 10-26); repo `.impeccable.md`.
- Firecrawl screenshots were attempted for Collins and Savee and failed (no credits); the pane captured both after a longer wait.
