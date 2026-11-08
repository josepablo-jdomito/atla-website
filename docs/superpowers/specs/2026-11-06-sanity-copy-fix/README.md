# Sanity copy fix (2026-11-06)

Recommendation: before any text goes in, decide where the paragraphs live. Today the project page shows `description` as one intro block and renders the old `caseStudy` underneath, so pasting these descriptions alone would stack new copy on top of old copy with banned words in it.

Decision for JP: store each case as a short intro in `description` plus the rest as `caseStudy` blocks (the `ifCodeUnchanged` path in `patches.json`), sí/no.

Nothing was written to Sanity. No code was touched. Every file in this folder passed `filtro-calidad.py --tipo texto`.

## What is here

| file | what it is |
|---|---|
| one `<slug>.md` per project (26) | the description between `<!-- description:start -->` and `<!-- description:end -->`, then the fact sheet with source and date for every claim, then what JP decides |
| `rustico-opener.md` | the new Rústico opener and the other openers with placeholders |
| `patches.json` | 27 draft patches by Sanity `_id`: 26 copy patches and the Rústico opener swap. Not applied. |

## How the patches are shaped

Each copy entry carries two options:
- `set.description`: the full text, for when the code splits `description` on blank lines into body sections (the 11-05 brief's assumption).
- `ifCodeUnchanged`: the first paragraph as `description`, the rest as portable text in `caseStudy`, for the code as it runs today (`server/sanity/projectService.ts` reads `body ?? content ?? caseStudy`).

Three entries also `unset` the old `caseStudy`, because it still renders and fails the voice rules: angeles-wellness, anything-ai, tequila-unido. Two projects outside this batch have the same problem and were covered by the 11-05 drafts: arc-studio and hanks-leather.

Eight entries carry a `hold` note. Do not apply them until JP decides: atla, baristio, bond-and-bloom, conscious-care-co, reggie, sexto-abismo, the-bridge, welove.

## Per project

Status is the Sanity `status` field read on 2026-11-06.

| slug | status today | sources | what JP decides first |
|---|---|---|---|
| alma-brava | published | 11-05 draft, Gmail, Drive | Year and credit: MK+2, 2020 to 2021 (Sanity says 2025) |
| ando | published | Gmail, Drive | Year and credit: MK+2, 2023 (Sanity says 2025) |
| angeles-wellness | empty (year 2025) | 11-05 draft | Approve the edited text; old `caseStudy` is cleared |
| anything-ai | published | 11-05 draft | Funding figures stay out; old `caseStudy` is cleared |
| atla | published | images only | Recommended: off the wall and "More like this" |
| baristio | draft | Gmail, Drive contract | Blocked: contract clause 6 needs Emilio Orozco's written portfolio permission |
| bond-and-bloom | draft | 11-05 draft, Gmail | How to present a client who is on the Atla team (Paola) |
| bovi-health | published | Gmail, Granola | bovihealth.com is parked; confirm the brand is live |
| castro-capital | published | Gmail, Drive | Year and credit: MK+2, 2021 (Sanity says 2025) |
| conscious-care-co | published | MK+2 PDF only | Recommended: unpublish until the client is named |
| huemac | published | Gmail, Drive | Year and credit: MK+2, 2021 (Sanity says 2025) |
| munda | draft | Gmail, Drive, Granola | Credit and year: MK+2, 2022 (Sanity says 2025) |
| oxylife | published | Gmail, Drive | Year and credit: MK+2, 2021; the brand has closed |
| pathize-health | published | Gmail, Drive brand book | Year and credit: MK+2, 2023; drop the "John Doe" letterhead |
| pax-and-beneficia | published | 11-05 draft | Keep or cut the paragraph from Atla's own deck |
| peachy-patients | published | Gmail, Drive | Year and credit: MK+2, 2022 (Sanity says 2023) |
| puppypy | published | Gmail, Drive | Year and credit: MK+2, 2022; thin, two images |
| reggie | published | 11-05 draft, Gmail | Publication rights contested since February 2026 |
| sexto-abismo | draft | Gmail, Drive | Framing: JP's own gin, identity by MK+2 in 2021 |
| shop-latinx | published | Gmail, Drive | Year and credit: MK+2, 2022; flagged to redo |
| tequila-unido | published | 11-05 draft | Written portfolio approval not found; old `caseStudy` is cleared |
| the-brand-academy | draft | Gmail, Granola | Recommended: off the wall; real title is "The Branding Academy" |
| the-bridge | published | images, Granola | Recommended: unpublish |
| tigretigre | published | 11-05 draft, Gmail | Framing: JP's own restaurant, identity by MK+2 |
| torre-avancer | draft | Gmail, Drive | Credit and year: MK+2, 2022 (Sanity says 2025) |
| welove | draft | Granola, Sanity | Recommended: delete the project page; WeLoveDaily lives on /ventures |

## Wrong years in Sanity

munda 2022, torre-avancer 2022, ando 2023, castro-capital 2021, huemac 2021, oxylife 2021, peachy-patients 2022, pathize-health 2023, puppypy 2022, shop-latinx 2022. The patches do not change `year`; JP confirms first.

## Placeholders in galleries

| slug | image | issue |
|---|---|---|
| pathize-health | g03 | "Hello, John Doe" and lorem ipsum |
| the-bridge | g2, g4 | lorem ipsum |
| peachy-patients | g03 | "PJ SANTORO Founder" with an invalid phone |
| huemac | g3 | "Fernando Alvarado" card, likely a placeholder |
| baristio | g03 | fake phone; @BARISTA.COFFEE handle does not match the brand |
| the-brand-academy | g03 | placeholder phone; josepablo@tba.com |
| welove | g01 | invented review card "Hannah R. Designer" |
| puppypy | g1 | letterhead filler copy |
| bovi-health | g02 | "177 D" typo |
| rustico | 3, 5, 8, 11 | "EVERY NIGTH!" typo |

Real people's cards (not placeholders, JP decides if they stay): torre-avancer g00 and g04 (Rodrigo), munda g04 (Fernando Díaz), pathize-health cover (Alex Bahram).

## Could not be sourced beyond the images

- atla: images only.
- the-bridge: images plus JP's two sentences in Granola.
- conscious-care-co: the MK+2 PDF only; no client named.

Decision: approve the `description` plus `caseStudy` storage path.
