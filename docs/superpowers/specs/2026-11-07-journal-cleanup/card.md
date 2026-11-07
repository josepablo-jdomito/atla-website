# Journal cleanup card (2026-11-07)

Round 2 applied the review: all minor findings and four of the five optional ones (the idiom finding was left as the reviewer advised), the repeated "serious budget" phrasing varied across four articles, and every link into the pricing article re-anchored ("guide to branding costs", "what drives the cost of branding") with the same markDef targets. Full rescan of all 13 entries: zero hits; block, span, mark and markDef structure checked key for key.

Decision: nothing here is applied. Waiting for JP's «mándalo».

Source: Sanity dvufm78f / production, 13 published `journalArticle` documents (`articles.json`). Patches: `patches.json` (13 entries, 12 cleanups plus the full pricing rewrite, full new value per changed field, every `_key`, mark and `_type` kept; verified key-for-key against the export). Rescanned after the edits: zero digits (other than years), counts, dashes, banned words, MK+2 or WeLoveDaily left in the 12 patched articles.

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
| how-much-does-branding-cost | 85 (digit 53, dash 31, spelled 1) | REWRITTEN as a no-prices piece on the same slug (JP's decision): new title, seoTitle, seoDescription, excerpt and full body (about 800 words). Covers what drives cost, what each service should include, how to read a proposal; points to Atla's brief page for ranges. Rescanned: zero hits. | "Branding costs anywhere from $5,000 to $150,000+" / "Branding costs what the work requires, and the work depends on your company." |
| how-to-brief-a-branding-agency | 42 (digit 21, spelled 20, banned 1) | Headings de-numbered; budgets, ages, page counts, "three to five" removed; title loses "Three Months" | "Nine out of ten marketers admit" / "Most marketers admit" |
| how-to-select-a-branding-agency | 28 (digit 25, spelled 3) | Step and filter numbers dropped; price and timeline ranges removed; B2B/B2C spelled out | "runs $25,000-$150,000+ depending on scope" / "is a serious investment" |
| success-addiction | 4 (digit 2, spelled 2) | "5 steps", "four hours", "by 40", "just one thing" reworked | "No \"5 steps to overcoming success addiction.\"" / "No checklist for overcoming success addiction." |
| what-does-a-branding-agency-do | 15 (digit 11, banned 2, spelled 2) | Phase numbers dropped; two price figures and "18 months" removed; "robust" and "landscape" replaced | "a $30K branding engagement ... than a $3K one" / "a well-led branding engagement ... than a cheap one" |
| what-is-a-branding-agency | 12 (spelled 12) | Counts reworded ("ten-person studio", "three people", "fifty") | "a ten-person studio" / "a small studio" |
| why-most-startups-rebrand-too-late | 9 (spelled 6, digit 3) | Stage numbers dropped; "four fonts", "four layers", "Two examples" generalized | "Stage 1: Foundation" / "Foundation" |

Kept on purpose: years (2012, 2019, 2026) in text, titles and seoTitles; Series A and B and PMF (funding terms, not counts).

Watch-outs for JP
- The links into the pricing article use /blog/ in some articles and /journal/ in others (pre-existing, unchanged).
- Internal SEO notes (`competitorGap`, `targetQuery`) had no hits and were not touched. `readingTime` is a number field, not public copy, and was not touched.

## Pricing article: how-much-does-branding-cost

JP decided: rewrite on the same slug. The rewrite is entry 13 in `patches.json` (title, seoTitle, seoDescription, excerpt, body). The links into it from the other articles stay and now promise what the article is, not prices.
