# Journal cleanup card (2026-11-07)

Decision: nothing here is applied. Waiting for JP's «mándalo».

Source: Sanity dvufm78f / production, 13 published `journalArticle` documents (`articles.json`). Patches: `patches.json` (12 articles, full new value per changed field, every `_key`, mark and `_type` kept; verified key-for-key against the export). Rescanned after the edits: zero digits (other than years), counts, dashes, banned words, MK+2 or WeLoveDaily left in the 12 patched articles.

Hits found, all 13 articles: 392 (digits 225, spelled-out counts 119, em/en dashes 36, banned words 12, MK+2 0, WeLoveDaily 0).
Banned words that appeared: landscape or landscapes 8, journey 3, robust 1. No other banned word appears.

| Article | Hits | What changed | Before / after |
|---|---|---|---|
| art-direction-vs-creative-direction | 11 (spelled 10, banned 1) | Counts removed ("two titles", "three stages", "one person"); "landscapes" to "terrain" | "the work moves through three stages" / "the work moves through stages" |
| art-direction-vs-graphic-design | 8 (spelled 7, banned 1) | Counts and "one brand" idiom reworked | "a hundred pieces from ten people still look like one brand" / "a large body of work from many hands still looks like it belongs together" |
| brand-audit-framework | 77 (digit 53, spelled 16, banned 5, dash 3) | Layer and day numbering dropped from headings; 0-2 scale became Missing / Partial / Solid; stats (72%, 48 seconds), durations, "six layers" removed; the price range in "When to audit" removed; journey and landscape reworded | "Score (0-2): 1" / "Score: Partial" |
| brand-audit-template | 51 (digit 31, spelled 20) | Section numbers and "0 to 2" removed (score words instead); counts of people, assets, competitors, touchpoints generalized; excerpt and seoDescription fixed | "one score from 0 to 2 per section" / "a score per section" |
| brand-strategy-vs-brand-identity | 20 (spelled 12, digit 5, dash 2, banned 1) | Counts, pixel sizes, dash, price range removed | "$25K-$80K+ investment depending on scope" / "a serious investment, sized to scope" |
| hospitality-branding-guide | 30 (digit 21, spelled 8, banned 1) | Numbered mistakes and phases de-numbered; week and month ranges removed; "guest journey" to "guest experience" | "This phase takes 3-6 weeks." / "Give this phase real time." |
| how-much-does-branding-cost | 85 (digit 53, dash 31, spelled 1) | NOT patched, see recommendation | n/a |
| how-to-brief-a-branding-agency | 42 (digit 21, spelled 20, banned 1) | Headings de-numbered; budgets, ages, page counts, "three to five" removed; title loses "Three Months" | "Nine out of ten marketers admit" / "Most marketers admit" |
| how-to-select-a-branding-agency | 28 (digit 25, spelled 3) | Step and filter numbers dropped; price and timeline ranges removed; B2B/B2C spelled out | "runs $25,000-$150,000+ depending on scope" / "is a serious investment" |
| success-addiction | 4 (digit 2, spelled 2) | "5 steps", "four hours", "by 40", "just one thing" reworked | "No \"5 steps to overcoming success addiction.\"" / "No checklist for overcoming success addiction." |
| what-does-a-branding-agency-do | 15 (digit 11, banned 2, spelled 2) | Phase numbers dropped; two price figures and "18 months" removed; "robust" and "landscape" replaced | "a $30K branding engagement ... than a $3K one" / "a well-led branding engagement ... than a cheap one" |
| what-is-a-branding-agency | 12 (spelled 12) | Counts reworded ("ten-person studio", "three people", "fifty") | "a ten-person studio" / "a small studio" |
| why-most-startups-rebrand-too-late | 9 (spelled 6, digit 3) | Stage numbers dropped; "four fonts", "four layers", "Two examples" generalized | "Stage 1: Foundation" / "Foundation" |

Kept on purpose: years (2012, 2019, 2026) in text, titles and seoTitles; Series A and B and PMF (funding terms, not counts).

Watch-outs for JP
- Several articles link to `how-much-does-branding-cost` ("branding pricing guide", "complete pricing guide", "our breakdown of branding costs", and the "$30K-$100K+" link in the audit framework). The link text was reworded to match, but the targets still work only if that article stays published. Another reason to rewrite it rather than unpublish it.
- Internal SEO notes (`competitorGap`, `targetQuery`) had no hits and were not touched. `readingTime` is a number field, not public copy, and was not touched.

## Pricing article: how-much-does-branding-cost

Recommendation: rewrite it as a no-prices piece on the same slug. It keeps the URL, the search intent ("how much does branding cost") and the inbound links from three other articles; unpublishing loses all three, and keeping it breaks the site rule on every table row.

Why not keep: 53 digit hits and 31 dash hits, nearly all of them price tables and ranges, so no edit short of a rewrite removes them.

Working title: How Much Does Branding Cost in 2026? What Drives the Number

Outline
1. The honest answer: branding is priced by scope and seniority, and we do not publish numbers because a number without a brief misleads.
2. What moves the cost: the depth of strategy, the size of the identity system, naming and its legal screening, web design and build, the seniority of the people deciding.
3. What each service includes: strategy, identity, naming, web. For each: what is in it, what is often missing, the question to ask in a proposal.
4. Why a cheap quote is expensive: a logo sold as "branding", skipped screening, templates dressed as systems.
5. How to read a proposal: deliverables against hours, who is in the room, what "web design" actually covers.
6. How to frame the budget: against the business outcome, not the line item. Three questions before you talk to any agency (the problem, the assets you need, the impact).
7. Close: what to bring to a first conversation, with a link to the contact page.

First paragraph
Most agencies keep their pricing vague until you are on a discovery call. We do not publish numbers either, and here is the reason: branding is priced by scope and by the people in the room, and a figure without your brief attached tells you nothing. What we can do is show you what moves the cost, what each service should include, and how to read a proposal so you know what you are paying for.

(Checked against the site rules: no digits, no spelled-out counts, no dashes, no banned words, no prices.)
