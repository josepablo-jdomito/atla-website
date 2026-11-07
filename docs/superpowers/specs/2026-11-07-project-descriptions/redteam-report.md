# Red team report: the 30 project descriptions (2026-11-07)

Verdict first: 7 projects are HOLD (4 of them blocked by a P0), 16 need fixes before publishing, 7 pass. Nothing in the card breaks the dash or banned-word rules, and no text names MK+2 or WeLoveDaily. The recurring problems are: the Sanity `stage` facet says "New brand" on nine projects the text calls a rebrand or renewal; present tense for businesses with no proof they exist or still run; sentence 1 or 2 repeating the first paragraph of `caseStudy`; and private details lifted from sales calls and internal decks.

Reviewed: `card.md` (full descriptions), `patches.json` (matches the card for all 30 slugs), `sanity-before.json`, `sanity-full.json` (facets and `caseStudy` first paragraphs), every file in `2026-11-05-case-studies/` and `2026-11-06-sanity-copy-fix/`. Gmail was not readable; The Internet Empires is checked against the thread dates in the brief only.

Format: severity | exact phrase | rule broken | evidence | proposed replacement.

## Cross-cutting (not counted per project)

- P2 | year facets | rule 7 (spirit) | `sanity-full.json` year 2025 for castro-capital, huemac, oxylife, munda, puppypy (2023), shop-latinx (2024), peachy-patients (2023), pathize-health (2024), ando, alma-brava, torre-avancer, tigretigre, sexto-abismo; the text gives 2021, 2022 or 2023 | fix `year` in the tags session so the facet and the text agree.
- P2 | "came to Atla in 2021" and similar on work from 2020 to 2023 | rule 9 | 11-06 README: all of these are MK+2 work; rule 4 is obeyed, but anyone who checks when Atla started can contest the dates; the Peachy testimonial in Gmail names MK+2 | JP accepts the risk or drops the years from sentence 2.
- P2 | ", from Charlotte." / ", from San Diego." / ", from Los Angeles." tacked on at the end of sentence 1 (bovi, puppypy, reggie, bond-and-bloom, peachy, shop-latinx) | rule 6 (reads as a label) | style | move the place next to the name: "X, from Y, makes ...".

## 1. Alma Brava: FIX
- P1 | "renewed from a brand called Xantolo" / "a complete renewal" | rule 7 | `sanity-full.json` stage "New brand"; 11-05 sheet: client "asked us to renew his brand's identity completely" | set stage to "Rebrand".
- P2 | "renewed from a brand called Xantolo. Its producer came to Atla for a complete renewal" | rule 5 (renewed / renewal twice) | style | "Alma Brava is a mezcal from San Luis Potosí that began life as Xantolo. Its producer came to Atla for a complete renewal: a name, an identity and a seal."
- P2 | "The brand looked childish and cheap" | rule 9 | 11-05 sheet: Atla's own portfolio words (Textos Portafolio 2024-07-26), not the client's; it calls the client's former brand cheap in public | "The old brand dressed the mezcal in the Day of the Dead the way a movie would."

## 2. Ando: FIX
- P1 | "Ray is Indonesian and had lived with the flush, also known as Asian flush, his whole adult life." | rule 9 (private person, ethnicity and health) | 11-06 ando fact sheet: source is Gmail 187c525cd2c66039, a private email; andogummy.com/about is cited only for "met as freshmen" | cut the sentence, or keep only what the founders publish: "Peter Czepiga and Ray Margono met as college freshmen and wanted a brand that made health feel joyful."

## 3. Angeles Wellness: FIX
- P1 | "He came to Atla with a large audience that no longer answered." (sentence 2, and it sits in the meta description) | rule 9 (claim about the client's business results) | 11-05 sheet: "lost a lot of the customer base", Granola kickoff 2025-07-03, a private sales call | "In 2025 he came to Atla for the messaging, the branding and the cohesiveness of the brand." (his words, same call)
- P1 | "after a long stretch of stomach pain no doctor could explain" / "burned him out, and lost its customers" | rule 9 (private health and business detail) | same Granola call; not found on angelesco.com in the sheet | cut, or confirm Fernando tells this story publicly; if not: "He started Angeles after herbal cleansing worked for him."
- P1 | "renamed it away from an extreme niche" / "full reins on the rebrand" (11-06) | rule 7 | stage "New brand"; 11-05 sheet: formerly Alkaline Organics, scope "complete rebrand" | set stage to "Rebrand".
- P2 | "His one ask: "It isn't performing well..."" | rules 2 and 9 | "one" counts; the quote states poor performance | cut the sentence.

## 4. Anything AI: HOLD
- P0 | whole page | rule 9 | 11-06 anything-ai: "Written portfolio approval (contract clause 5.1): none found. Ask Zaria." The card carries no hold | add the hold the card gives Baristio; publish after Zaria's written yes.
- P1 | sentence 1 names no place | rule 6 and 7 | facet New York City; 11-05 sheet "Where: San Francisco, CA" | JP confirms; then "Anything is an AI app builder from San Francisco, launched as Create: ..." and fix the facet.
- P1 | "a brand to rebuild before it" | rule 7 | stage "New brand" | set stage to "Rebrand", or "a brand to build before it".
- P1 | "Some early users had a bad experience" | rule 9 | 11-05 sheet: the client's private brief ("some users had a negative experience with our early product") | "The company had been underestimated, and bigger rivals took the attention."
- P2 | "launched as Create" | rule 8 | `caseStudy` P1 tells the rename ("they chose a new name for the product, Anything") | "Anything, first called Create, is an AI app builder: ..."

## 5. Arc Studio: HOLD
- P1 | "Arc Studio is a boutique Pilates and recovery studio in Abu Dhabi" | rule 1 | 11-05 sheet: "No evidence the studio has opened" (web search 2026-11-05) | "Arc Studio was planned as a boutique Pilates and recovery studio in Abu Dhabi, built around calm."
- P1 | "Two partners were opening" | rule 2 | count | "The founders were opening".
- P1 | "The studio would be the first in the city to offer heated sculpt and mat Pilates." | rules 1 and 9 | 11-05 sheet: the guidelines' claim from the client brief, "Not verified independently" | cut.
- P2 | "with a name and no identity" then "the name was chosen, Arc" | rule 8 (repeats itself) | style | "Its founders came to Atla before opening, with no identity yet."
- P2 | old `caseStudy` P1 ("quiet luxury... flow together") still renders under the new text | out of card scope | 11-06 README lists arc-studio as needing the old body cleared | replace the body with the 11-05 draft.

## 6. Baristio: HOLD
- P0 | whole page | rule 9 | 11-06 baristio: contract clause 6 needs prior written authorization; none in Gmail | keep the card's hold.
- P2 | "Emilio Orozco, a co-founder" | rule 1 | no source line in the 11-06 fact sheet gives his title | "Emilio Orozco, who leads the company," only once confirmed, else "Emilio Orozco came to Atla in 2025".
- P2 | "Baristio is a coffee company" | rule 1 | "before anything had launched"; no proof it trades | "Baristio is a coffee company in the making, built around the person behind the bar."

## 7. Bond&Bloom: HOLD
- P1 | "no founding story she believed in" | rule 9 | 11-05 sheet: internal Project Context 2026-03-14, "Paola doesn't feel she has a strong founding story"; she is on the Atla team | "Paola Díaz, a developmental specialist, came to Atla with no name and no logo."
- P2 | "to read their child, from Austin" | rules 1 and 6 | 11-05 sheet: brief says "USA/Mx", newsletter footer Seattle, only atla.design says Austin; the trailing phrase reads as if the child is from Austin | "Bond & Bloom, from Austin, teaches parents of babies and toddlers to read their child." once the city is confirmed.
- P2 | title "Bond&Bloom", text "Bond & Bloom" | consistency | Sanity title | pick one spelling for title and text.

## 8. Bovi Health: FIX
- P1 | "from Charlotte" | rules 1 and 7 | 11-06 bovi: "Sanity says Charlotte, NC; the packaging says Nashville, TN. The copy names no city." | "Bovi Health sells grass-fed beef colostrum and beef organ capsules, made in the USA."
- P2 | "Bovi Health sells" | rule 1 | 11-06: bovihealth.com is parked; brand status unconfirmed | keep only if JP confirms it trades.

## 9. Casa Colora: FIX
- P1 | "Two industrial designers" | rule 2 | count | "Its founders".
- P1 | "came to Atla for a name and a brand before the space existed" | rule 8 | `caseStudy` P1 ends "They needed a name and a brand before the space existed." and already says they are industrial designers | "Its founders came to Atla in 2025 for the name and the brand."
- P1 | "Casa Colora is a creative space" | rule 1 | 11-05 sheet: "Did Casa Colora open... web search found nothing. Settle: ask Laura." | "Casa Colora was planned as a creative space for children and families in Monterrey."

## 10. Castro Capital: PASS
- P2 | "Castro Capital invests" | rule 1 | 11-06: castrocapital.com is parked | keep if JP knows it still trades, else "invested".

## 11. Hanks Leather: FIX
- P1 | "The company came to Atla to be known for women's accessories too, without losing the men." | rule 8 | `caseStudy` P1: "The company wanted to be known for women's accessories too"; P2: "make room for another without losing the first" | "In 2025 its director, Mia Calleo, came to Atla for a new identity and a website."
- P2 | "making belts since 1949" | rule 8 | `caseStudy` P1 opens "Hanks has made full-grain leather belts in Endicott, New York since 1949" | "Hanks Leather is a heritage leather house from Upstate New York."

## 12. Huémac: FIX
- P1 | "Huémac is a platform for outdoor experiences from Querétaro, booking adventures with trusted guides." | rule 1 | 11-06 huemac: "no evidence the platform launched"; the approved opener said "set out to be" | "Huémac, from Querétaro, set out to be a platform for outdoor experiences, booking adventures with trusted guides."

## 13. Mundã: FIX
- P1 | "Mundã is a village of vacation and long-stay homes" | rule 1 | 11-06 munda: "Whether the homes were built: the signage exists only as renders"; the approved opener said "a project of" | "Mundã is a project of vacation and long-stay homes in La Saladita, on the coast of Guerrero."

## 14. Oxylife: FIX
- P1 | "Oxylife is oxygenated water in a can, produced in Prague and sold in the United Arab Emirates." | rule 1 | 11-06 oxylife: JP, Granola 2026-03-02, "They already closed. They were in Dubai."; label says imported by Foundful General Trading | "Oxylife was oxygenated water in a can, produced in Prague for the United Arab Emirates."
- P2 | "Suhail Alameri brought it to Atla in 2021, before the brand had a settled name." | rule 6 (no ask) | style | "In 2021 Suhail Alameri came to Atla for the brand and the can label, before the name was settled."

## 15. Pathize Health: PASS
- P2 | "in Los Angeles" | rule 1 | 11-06 pathize: "Sanity's 'Los Angeles' has no source" | keep only once a source is found.
- P2 | "Pathize Health builds an app" | rule 1 | 11-06: pathizehealth.com did not load on 2026-11-06 | confirm it runs, else "built".

## 16. Pax & Beneficia: FIX
- P1 | "A brand existed and had fallen behind the mission; the company came to Atla to catch it up." | rule 7 | stage "New brand" | set stage to "Rebrand".
- P2 | "had fallen behind the mission" | rule 9 | 11-06 pax: the judgement comes from Atla's own deck, not the client; JP still to decide | "The company came to Atla to bring its brand up to the mission."

## 17. Peachy Patients: PASS
- P2 | "from Los Angeles" | rule 1 | 11-06 peachy: "Sanity's 'Los Angeles' has no source" | keep only once sourced.
- P2 | "Peachy is a healthcare startup" | rule 1 | 11-06: peachypatients.com did not load; the sheet notes a later pivot | "Peachy was a healthcare startup built for patients" unless JP confirms it runs.

## 18. Persona: FIX
- P1 | "Persona Nutrition is the personalized vitamin pioneer, with daily packs that carry each customer's name." | rule 8 | `caseStudy` P1 opens "Persona is a pioneer in personalized vitamins"; P2 "the daily pack with your name on it" | "Persona Nutrition builds a vitamin plan for each customer."
- P2 | "the personalized vitamin pioneer" | rule 1 | the body says "a pioneer"; "the" is an overclaim | "a pioneer", if the line stays.
- P2 | sentence 1 names no place | rule 6 | facet `locationName` null; Attio has Snoqualmie, atla.design Bellevue (vyv sheet) | add the place once confirmed.
- P2 | no fact sheet exists for Persona | rule 1 | only the old Sanity line and the vyv sheet ("Atla hired for the Persona rebrand, Dec 2025 to Apr 2026") back it; `caseStudy` P1 carries "More than five million people", a count (rule 2), outside this card | write a fact sheet; clear the count from the body.

## 19. PuppyPy: FIX
- P1 | "to rename and rebuild the company, then called Huan" | rule 7 | stage "New brand" | set stage to "Rebrand".
- P2 | "We took it on that spring, as the studio was starting to work with clients in the United States." | rule 5 (voice switches from "Atla" to "we") | style | "Atla took it on that spring, as it began working with clients in the United States."

## 20. Reggie: HOLD
- P0 | whole page | rule 9 | 11-05 sheet: Reggie's team said Atla had no permission (Armin Vit, 2026-02-07); Brand New post removed | keep the card's hold.
- P1 | "New owners came to Atla in 2025" | rule 1 | 11-05 sheet: "Atla was subcontracted by Ricardo Camargo, Vapor Studio"; the Doigs are "el cliente del cliente" | "In 2025 its new owners rebuilt the brand with Atla, through the studio Vapor, while moving from direct sales into retail."
- P1 | "from San Diego" | rules 1 and 7 | 11-05 sheet: "atla.design lists 'San Diego' (Vapor's area, not the brand's)"; US brand in Greenville DE / NY, owners in New Zealand | "Reggie is an American brand of calming chews, supplements and feeder mats for dogs." and fix the facet.
- P1 | "the watered-down version the old team had actually shipped, white jars and all" | rule 9 | owners' private Branding Deck, April 2025, criticising former management | "The owners, from New Zealand, inherited a brand caught between its original look and a refresh from the year before."
- P1 | "to rebuild the brand" | rule 7 | stage "New brand" | set stage to "Rebrand".

## 21. Rústico: PASS
- P2 | "The season was starting and it needed a brand; the owner wrote the brief himself." | rule 6 (sentence 2 never names Atla) | style | "With the season starting, its owner wrote Atla the brief himself."
- P2 | "the owners were running the dinner as a pop-up: private buyouts, winemaker dinners" | rule 1 | Cam's brief 2025-11-06: "we hope to keep it busy 50% of the time with private buyouts and wine pairing dinners" (a plan) | "the owners were running the dinner as a pop-up, planned for private buyouts and winemaker dinners".

## 22. Sexto Abismo: HOLD
- P1 | "and branded it at his studio before Atla" | rule 4 | the studio is Atla, always; "his studio before Atla" is MK+2 by another name | JP decides the framing; if it stays: "José Pablo started it in 2021 and built its brand himself."
- P1 | "with Oscar Gómez and Rodrigo Espinosa" | rule 9 | 11-05 sheet: names come from the internal Plan Financiero (2021-10-13); no public role for either | "with partners from San Luis Potosí".
- P2 | "named after one of the deepest abysses on earth" | rules 1 and 2 | Libro Bartender: "sexto abismo más grande del mundo" (the sixth largest), so "deepest" is a paraphrase, and the name itself is a rank | "named after the Sótano de las Golondrinas, one of the largest abysses on earth" and cut the repeat in the next paragraph.

## 23. Shop Latinx: FIX
- P1 | "came to Atla to rebrand it" | rule 7 | stage "New brand" | set stage to "Rebrand".
- P2 | "as we wrote at the time" | rule 5 (voice switches to "we") | style | "as Atla wrote at the time".

## 24. Tequila Unido: HOLD
- P0 | whole page | rule 9 | 11-06 tequila-unido: "Written portfolio approval required by the agreement: not found. Ask Carlos." The page is live and the card carries no hold | add a hold; publish after Carlos's written yes.
- P1 | "Born in Eagle Pass, with grandparents from Guadalajara and a father who sang mariachi" | rule 9 | `caseStudy` P1: Carlos's condition was that "the story could not be about him", and the work took the mariachi "without naming the family" | "Carlos calls himself "tejano jalisciense." He registered the name, partnered with a family distillery in Arandas founded in 1915, and carried samples by bus to Dallas distributors."
- P1 | "the brand had to be clarified and kept" | rule 7 | stage "New brand"; brief: "Yes but it needs to be clarified and improved" | set stage to "Rebrand".

## 25. The Brand Academy: FIX
- P1 | "Atla gave it the identity of a school" | rule 1 | 11-06 the-brand-academy: "Who designed the identity is not on record." | "Its identity treats it as a school."
- P1 | "A seal, and a row of bound books in pastel cloth." | rules 5 and 8 | a fragment; `caseStudy` P1 opens on the seal and the cloth book spines | cut.
- P2 | title "The Brand Academy", text "The Branding Academy" | consistency | 11-06: every image says "The Branding Academy" | fix the Sanity title.

## 26. The Curated Outfit: FIX
- P1 | "asking for quiet luxury" | rule 1 | 11-05 sheet: "quiet luxury" is Atla's Direction 02 language; her words were "Luxury but not Dubai-Loro Piana-luxury... It should feel personal. And a bit fun." | "She came to Atla for a first brand, luxurious but personal."
- P1 | "She came to Atla with no logo and a website she barely used" / "styles male founders and executives" | rule 8 | `caseStudy` P1: "Rinske Fris styles male founders and executives... She had no logo, a website she barely used" | sentence 1: "The Curated Outfit is a personal styling service for men who run companies, from Amsterdam." sentence 2: "In 2025 its founder, Rinske Fris, came to Atla for a first brand, luxurious but personal."
- P2 | "run from Amsterdam" | rule 1 | 11-05 sheet: based in Bali at kickoff; brief says "Bali, Indonesia / Amsterdam, NL" | "from Amsterdam" only if JP confirms.

## 27. The Internet Empires: PASS
- P2 | every claim | rule 1 | no fact sheet with thread ids exists; all claims (audience and channels, the globe mark, globe with a crown, Blinker, community photography, flyer and quote-card templates, the 09-05 quote) fall inside the brief's dates (07-21 brief, 08-15/08-20 graphic path, 09-05 final assets, 09-24 templates), so none is flagged as uncovered | add thread ids to a fact sheet before publishing, especially for "Ish Verduzco" and "founder".
- P2 | title "The Internet Empires", text "Internet Empires" | consistency | Sanity title and client | use one name.

## 28. TigreTigre: PASS
- P2 | "José Pablo and his partners opened it in 2023, and the brand was made before the doors opened." | rule 6 (sentence 2 never names Atla) | rule 4 framing; brand book headed MK+2 | JP decides how to credit it; the passive is the safe form today.

## 29. Torre Avancer: PASS
- P2 | "it had already won awards" | rule 1 | only source is JP's internal kickoff email 2022-01-11, "La Torre a obtenido buenos premios y reconocimientos"; no award is named | name the award, or "the tower was already recognised when the owners asked Atla for its identity".

## 30. Vyv: FIX
- P1 | "Jason Brown, Persona's CEO, came to Atla with no name he liked and a launch date set for the end of the year." | rule 8 | `caseStudy` P1: "Jason Brown, its co-founder and CEO, wanted a second brand for younger women... There was no name he liked... and a launch date set for the end of the year." | "In 2025 Persona came to Atla to name it, draw it and pack it before its first order." (from the old Sanity line)
- P2 | "in Bellevue, Washington" | rule 1 | vyv sheet: Attio says Snoqualmie WA, atla.design says Bellevue WA, unsettled | keep Bellevue only once confirmed.

## Verdicts

| # | Project | Verdict |
|---|---|---|
| 1 | Alma Brava | FIX |
| 2 | Ando | FIX |
| 3 | Angeles Wellness | FIX |
| 4 | Anything AI | HOLD |
| 5 | Arc Studio | HOLD |
| 6 | Baristio | HOLD |
| 7 | Bond&Bloom | HOLD |
| 8 | Bovi Health | FIX |
| 9 | Casa Colora | FIX |
| 10 | Castro Capital | PASS |
| 11 | Hanks Leather | FIX |
| 12 | Huémac | FIX |
| 13 | Mundã | FIX |
| 14 | Oxylife | FIX |
| 15 | Pathize Health | PASS |
| 16 | Pax & Beneficia | FIX |
| 17 | Peachy Patients | PASS |
| 18 | Persona | FIX |
| 19 | PuppyPy | FIX |
| 20 | Reggie | HOLD |
| 21 | Rústico | PASS |
| 22 | Sexto Abismo | HOLD |
| 23 | Shop Latinx | FIX |
| 24 | Tequila Unido | HOLD |
| 25 | The Brand Academy | FIX |
| 26 | The Curated Outfit | FIX |
| 27 | The Internet Empires | PASS |
| 28 | TigreTigre | PASS |
| 29 | Torre Avancer | PASS |
| 30 | Vyv | FIX |

Counts (per-project findings, cross-cutting lines excluded): P0 4, P1 37, P2 34.

Decision: none here. The four P0 holds go to JP with the card.
