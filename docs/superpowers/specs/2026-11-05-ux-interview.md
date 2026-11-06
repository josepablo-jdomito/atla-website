# atla.design v2: UX interview, JP's answers (2026-11-05)

JP: "USA Askuser para pulir el UX, pregúntame al menos 30 cosas". 33 questions, 8 rounds, all via
AskUserQuestion. These answers are decisions. Where JP said "No estoy seguro" the CTO rules and shows.

## Work wall (home)
1. Columns at 1440: **5**.
2. Gutter: **24px**.
3. Tile corners: **like Cosmos (3px)**.
4. Hover: **nothing** (no dim, no caption, no lift).
5. Captions: **none**.
6. Click: **opens the project at that image** (`/projects/<slug>?at=<asset>`).
7. Order: **shuffled on every load**.
8. End of the wall: **loops forever; no footer needed on the home**.
9. Filters: **inside the Explore pill**.
10. Typing in the pill **narrows the wall live**.
11. Facets: **Sector / Discipline / Place / Year** (the tags branch).
12. Pill on the phone: **bottom center**.
32. Phone first screen: **header + wall, two columns**.

## Chrome
13. Header: **Work · Services · Why Atla**.
14. Header CTA: **"Start a project"**.
15. Footer: **paper, one line, links, cities** (on the inner pages; the home has none, see 8).
16. Logo band: **yes, two rows drifting** (the logos branch, 16 approved marks).
25. Tile motion on load: **quick fade**.
26. Route change: **soft fade, 200ms**.
27. Dark mode: **follows the system, no switch**.
28. Display face: **ABC Synt**.

## Project page
17. Opening: JP: "No sé pero unifica todo, hoy en día es un desmadre, cada proyecto hace lo que quiere."
    Ruling: one template for every project: title (Synt) + one line + facet line, then the first image
    full width, then the story. No per-project variation in the opening.
18. Column: **880px centered**.
19. Story text placement: JP: "No estoy seguro." Ruling: body paragraphs sit between image groups as
    now, but only where the project has body; a project without body shows images only, no filler.
20. Ending: JP: "No estoy seguro." Ruling: "Start a project" link + next project, same on every page.

## Why Atla / Services
21. Why Atla order: **as built** (thesis, how we work, proof, clients, ways in, team).
22. Team: **names + roles, no photos**.
23. Services: **disciplines + sticky photo** (tbp.studio layout).
24. Prices: **never**.

## Brief / contact
29. Brief: **the same as start.atla.design/waitlist** (`atla-start/src/lib/quiz/definitions/waitlist.ts`):
    five single-selects (brand cost, stage, differentiation, budget, timeline) + contact gate. One
    question per screen, as today.
33. Budget question: **keep it, same dollar ranges**. It is a question, not a price list. The welcome
    note "Most engagements start at $15K" does not come over.
30. After sending: **thank-you + Calendly link**.
31. Contact page: **email, cities, socials, the form** (as built).

## What this changes in code (the detail pass)
- WorkWall: 5 columns at ≥1440, 24px gap, 3px radius, no hover rule, no pass cap / no "More work"
  sentinel: the sequence repeats forever. Phone: two columns; pill bottom center.
- Merge `claude/site-v2-tags-ca8c28` (facets) and `claude/site-v2-logos-146245` (logo band) into
  `feat/site-v2`. Logo band: two rows drifting in opposite directions, paused on hover and under
  `prefers-reduced-motion`.
- Project.tsx: one opening for every project; images only where there is no body; same ending.
- shared/brief.ts + Brief.tsx + siteCopy.brief: the waitlist's five questions and contact gate, same
  wording and option values (ids q1..q5 kept for Attio/GA continuity).
