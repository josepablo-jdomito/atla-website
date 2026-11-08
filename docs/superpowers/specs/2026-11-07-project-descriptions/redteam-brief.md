# Red team: the 30 project descriptions (2026-11-07)

Worktree: /Users/josepablo/Projects/atla-website/.claude/worktrees/figma-shell-home. Read only. No subagents. Do not edit any file except the report.

What to attack: `docs/superpowers/specs/2026-11-07-project-descriptions/card.md` (the full descriptions at the bottom; the table on top is the same text split). These replace the `description` field of 30 Sanity projects; the first sentence becomes the line under the title on atla.design/projects/<slug>, the first whole sentences within 155 characters become the meta description, the rest opens the story. The case study body (`caseStudy`) is unchanged.

Evidence to check against (every claim must trace to one of these; anything else is invented):
- `sanity-before.json`: the current Sanity description per project (the approved openers of 2026-11-06).
- `sanity-full.json`: client, sector, year, stage, place, disciplines and the case study body per project.
- `docs/superpowers/specs/2026-11-05-case-studies/*.md`: fact sheets with sources for 16 projects.
- `docs/superpowers/specs/2026-11-06-sanity-copy-fix/*.md`: the 11-06 copy, with holds.
- The Internet Empires: Gmail threads 2025-07-21 (brief), 08-01 (moodboards), 08-15 and 08-20 (graphic path), 09-05 (final assets, Ish: "Love how it all came out"), 09-24 (templates, Beehiiv). You cannot read Gmail; flag any claim about it that the card makes and that those dates do not cover.

Rules the text must obey (binding, from JP):
1. Nothing invented about clients. Names, places, dates, products, quotes: only what the evidence says. A plausible guess is a finding.
2. No numbers or counts in site copy (digits or spelled out: "two partners", "five million"). Years are allowed. Prices never.
3. No em dashes or en dashes. No banned words: elevate, authentic, game-changer, next level, synergy, leverage, robust, seamless, journey, vibrant, delve, landscape, tapestry, testament, unlock.
4. The studio is Atla, always. Never MK+2. WeLoveDaily is not mentioned.
5. Brand voice: premium, direct, founder to founder, no clichés, no corporate filler, no hedging. One idea per sentence.
6. Structure: sentence 1 says who the client is and where; sentence 2 the moment and the ask to Atla. Sentence 1 must stand alone under the title and read as a line, not a label. Sentence 1 and 2 together must be true as a meta description.
7. Consistency with Sanity facets: place and stage in `sanity-full.json` must agree with the text (flag conflicts, as the card already does for Anything AI).
8. The rest must not repeat what the case study body's first paragraph says (read `caseStudy` in sanity-full.json); repetition is a finding.
9. Legal or reputational risk: anything a client could object to, anything that reveals a private person, any claim about a client's business results.

Report: `docs/superpowers/specs/2026-11-07-project-descriptions/redteam-report.md`. Format: one line per finding, grouped by project, each with severity (P0 blocks publishing, P1 fix before publishing, P2 nice to fix), the exact phrase, the rule broken, the evidence line, and the proposed replacement phrase. End with a one-line verdict per project: PASS / FIX / HOLD. Return only: counts of P0/P1/P2 and the list of projects that are not PASS.
