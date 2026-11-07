# Review of patches.json against articles.json (read only)

Method: scripted diff of every patched field, plus a full-document scan of the patched result (digits other than four-digit years, spelled counts, em/en dashes, banned words, MK+2, WeLoveDaily) and a structure check.
Structure result (all 12 patched articles): every block keeps _key, _type, style, level, listItem, markDefs, children count, span _keys and marks; no block dropped or reordered; every link markDef is identical and the link target is unchanged. Zero digits (except publishedAt), zero dashes, zero banned words in any patched field.

Severity: B = blocking (ship stopper), M = minor (edit before applying). "(opt)" = optional polish, not counted in the verdict.

## Findings

- B | how-much-does-branding-cost | all blocks, excerpt, seoDescription | still full of prices, ranges, digits and en/em dashes (body 0, 2, 4, 9-11, 18-20, 22, 26-28, 30, 35-37, 39, 42-48, 53-55, 59, 61) | not in patches.json (held for JP's decision) | do not apply the rest as "site clean" until JP decides: unpublish, or rewrite as no-prices piece
- B | pricing links (7 articles) | brand-audit-framework bb19dcacfd54; brand-strategy-vs-brand-identity c7d9e4f80b68; hospitality-branding-guide 368892221102; how-to-brief-a-branding-agency ae38c0f4c1ee; how-to-select-a-branding-agency 8aba036f06f0; what-does-a-branding-agency-do 4ea91112a2a7; why-most-startups-rebrand-too-late 2830aba26c2a; what-is-a-branding-agency 776fe5ee2cc7 | these links point at /blog/how-much-does-branding-cost or /journal/how-much-does-branding-cost | if that article is unpublished they 404; if rewritten, anchor text "pricing guide / full pricing breakdown / breakdown of branding costs / how much branding costs" promises prices | decide with the pricing article: remove the links or retitle anchors (for example "what drives scope") in the same apply step. Note also hrefs mix /blog/ and /journal/ (pre-existing, unchanged)
- M | brand-strategy-vs-brand-identity | 501f3d5fba4e | "you'll see hundreds of these" | spelled-out count left unpatched | "you'll see endless versions of these"
- M | brand-strategy-vs-brand-identity | 21ad534f8212 span1 | "If people on your team describe the company differently" | dropping "five" leaves a flat sentence | "If your team describes the company differently"
- M | brand-audit-framework | f4fe48230415 | heading "The framework: the layers" | stilted | "The framework"
- M | brand-audit-framework | 79346abd3bb3 | "We audit brands across layers." | reads unfinished | "We audit brands across several layers."
- M | brand-audit-framework | 897711a1344a | "The scorecard does a few things." | exactly two items follow; "a few" overstates | "The scorecard does more than rank." (the two items below it stay)
- M | brand-audit-framework | 68 (intro of lightweight audit, unchanged) | "internally in a week" | a duration count survives while the Day 1-7 steps were removed | "internally in a short sprint" (opt)
- M | how-to-select-a-branding-agency | 4c3b4ef79d53 | heading "Filter: Process, not just portfolio" | only filter heading that kept a label; the other four lost "Filter N" | "Process, not just portfolio"
- M | how-to-select-a-branding-agency | 00898515cd78 span1 | "Typical timelines run months, depending on scope." | "run months" is not idiomatic | "Typical timelines are measured in months, depending on scope."
- M | how-to-select-a-branding-agency | b1b4d3349044 | "Once you have a short list of agencies" | heading above says "shortlist" | "Once you have a shortlist"
- M | hospitality-branding-guide | acb88c89a59e | "within the first seconds" | ungrammatical | "within seconds"
- M | hospitality-branding-guide | 9f7b03735586 | "erodes within the first months" | awkward, loses the point | "erodes within months"
- M | hospitality-branding-guide | 504b5f79d117 | "a shared team, or at minimum a lead creative director" | original said one team / one creative director; "shared team" shifts meaning | "a unified team, or at minimum a lead creative director"
- M | hospitality-branding-guide | 368892221102 | "what drives each phase, see our branding pricing guide" | anchor says pricing while the sentence no longer talks price | covered by pricing-links finding; retitle anchor
- M | hospitality-branding-guide | 928877e3254c | "This phase needs patience." | replaced a fact with filler; weaker than the sibling "Give this phase real time." and nearly repeats it | "This phase is detailed work." or merge with the next sentence (opt)
- M | how-to-brief-a-branding-agency | 91ed82eeabe5 | "Most marketers admit they change the brief after handing it off." | original statistic (nine in ten) downgraded to an unsourced "most"; claim is vaguer but still a claim the original supported with a number | "Marketers routinely change the brief after handing it off." or keep "Most" and accept
- M | what-does-a-branding-agency-do | e61ca0586a0f span2 | "than a cheap one" | off-voice and slightly pejorative versus "$3K one" | "than a thin one" or "than a rushed one"
- M | success-addiction | c22a34780c9c | "No checklist for overcoming success addiction." | loses the "5 steps" listicle joke, which carried the voice | "No numbered steps for overcoming success addiction."
- M | success-addiction | 49097866ff4d span1 | "Not everything. Start small." | original "Just one thing" set up three single examples; "Start small" is fine but "Not everything." now reads clipped | "Not everything. Pick a small thing." (opt)
- M | art-direction-vs-creative-direction | e980105b7e92 | "use the titles as if" | referent is weaker without "two" | "use these titles as if" (opt)
- M | repeated phrasing across articles | brand-audit-framework 77, brand-strategy 56, how-to-select 6, what-does 51 | "a serious budget / a serious investment" used in four articles | repetition reads templated | vary: "real money", "a significant commitment", "a considered investment"
- M | residual idioms (opt) | brand-strategy f1c3fb81efd0 "half a palette", hospitality f165afeb820d "half a brand", brand-strategy 4b6eaa220a0f "starting from zero" | idioms, not counts | leave (opt)

## No-issue checks (summary)
- Meaning: removed numbers were replaced with qualitative phrasing in every case checked; no reversed claim found. "takes 3-6 weeks" to "Give this phase real time" is fine. Budget ranges to "modest / generous / tight" keep the original contrast.
- Link anchors whose text changed: brand-audit-framework bb19dcacfd54 ("a serious budget on branding"), what-does-a-branding-agency-do e61ca0586a0f ("Strategy is what separates them"). Both keep the same href.
- Heading renumbering ("Layer 1:", "Phase 2:", "Step 3:", "Day 4:") was stripped consistently; no remaining cross-reference to a removed number was found (for example "layer three" became "comes after strategy and words"; "Phase 1" became "the strategy phase").

## Verdicts

| Article | Verdict | Findings |
|---|---|---|
| art-direction-vs-creative-direction | PASS | 1 optional |
| art-direction-vs-graphic-design | PASS | none |
| brand-audit-framework | FIX | 3 minor (+1 opt), pricing link |
| brand-audit-template | PASS | none |
| brand-strategy-vs-brand-identity | FIX | 2 minor, pricing link |
| hospitality-branding-guide | FIX | 3 minor (+1 opt), pricing link |
| how-to-brief-a-branding-agency | FIX | 1 minor, pricing link |
| how-to-select-a-branding-agency | FIX | 3 minor, pricing link |
| success-addiction | FIX | 1 minor (+1 opt) |
| what-does-a-branding-agency-do | FIX | 1 minor, pricing link |
| what-is-a-branding-agency | PASS | pricing link only (follows the pricing decision) |
| why-most-startups-rebrand-too-late | PASS | pricing link only (follows the pricing decision) |
| how-much-does-branding-cost | FIX | not patched; blocked on JP's decision |

## Counts
Blocking: 2 (pricing article unpatched; links into the pricing article across 8 articles).
Minor: 17 counted (plus 5 optional).
