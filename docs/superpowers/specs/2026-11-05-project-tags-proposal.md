# Project tags and discovery model for atla.design

**Recommendation: replace the five derived facets (industry, service, region, tags, year) with four controlled facets set by hand in Sanity: Sector (8 values), Discipline (8), Place (5) and Stage (3). Keep Year. Keep the Explore panel at four groups, swapping Industry for Sector, Service for Discipline and Region for Place. Add a hidden `searchTerms` list per project for the AI search only. No free text reaches the site.**

Date: 2026-11-05. Author: Claude (side session of the site-v2 build). Status: facet model **approved by JP on 2026-11-05** ("Approve as proposed"). Nothing written to Sanity, no code changed. Open: the "?" rows in section 4, then the rollout in section 5.

Sources: public Sanity API for project `dvufm78f`, dataset `production`, read 2026-11-05 (34 project documents); live `https://www.atla.design/api/projects` read the same day; the schema in `sanity/schemaTypes/project.ts`; the search in `shared/rankProjects.ts` and `server/ask/route.ts`; the Explore panel in `client/src/components/site/workFilters.tsx`; cosmos.so, pentagram.com and koto.com visited 2026-11-05 (screenshots in `docs/superpowers/specs/tags-refs/`).

---

## 1. What exists today, and the holes

### How the fields flow

```
Sanity project
  industry (list of 5)  ─ set on 4 of 34 projects
  region (list of 4)    ─ "America" on 29 of 34
  country, locationName ─ set on all 34
  category (free text)  ─ a sector word on most ("Liquor", "Wellness", "Finance")
  services[] (free)     ─ 11 different labels ("Brand Identity", "Web", "Renders Support" ...)
  service (free, legacy)─ "Brand Identity · Packaging" (field is not in the schema)
  tags[] (free)         ─ two styles, see below
        │
        ▼
server/sanity/projectService.ts  deriveFacetValues()
  industry = keyword score over tags + category  → one of 5, else "Unspecified"
  services = keyword score over tags + services  → subset of 4
  tags     = tags + industry + services, case-fixed
        │
        ▼
/api/projects → Explore filters (region, industry, service, year)
             → rankProjects (title 3, industry 3, services 2, tags 2, region 1)
```

The site never shows what the editor typed. It shows what a keyword scorer guessed from it. That is the root hole: the same tag list produces a different industry depending on which words happen to be present.

### Per-project audit (Sanity values, with what the live site derives from them)

| slug | industry (Sanity → live) | region · country | services (Sanity) | tags style | year | status |
|---|---|---|---|---|---|---|
| alma-brava | · → Food & Beverage | America · Mexico | Brand Identity, Packaging | rich (14) | 2025 | published |
| ando | · → Consumer Goods | America · US | Brand Identity | rich (13) | 2025 | published |
| angeles-wellness | · → Consumer Goods | America · US | · | 3 mixed ("Brand Identity", "America", "United States") | 2025 | none → published |
| anything-ai | · → Digital | America · US | · | legacy (4) | 2026 | published |
| arc-studio | · → **Consumer Goods** (a pilates studio) | Middle East · UAE | Brand Identity | rich (10) | 2025 | none → published |
| atla | · → **SaaS** (own studio identity) | America · US | Brand Identity | rich (9) | 2026 | published |
| baristio | Hospitality | America · US | Brand Identity, Packaging | 2 | 2025 | draft |
| bond-and-bloom | · → Consumer Goods | America · US & Mexico | Brand Identity, Copywriting System | rich (12) | 2025 | draft |
| bovi-health | · → Consumer Goods | America · US | Brand Identity | rich (9) | 2025 | published |
| casa-colora | · → Hospitality | America · Mexico | Brand Strategy, Brand Identity | rich (13) | 2025 | none → published |
| castro-capital | · → **SaaS** (an investment firm) | America · Mexico | Brand Identity | rich (11) | 2025 | published |
| conscious-care-co | · → Consumer Goods (slug override) | America · Canada | · | legacy (4) | 2024 | published |
| hanks-leather | · → Consumer Goods | America · US | Brand Identity, Web | rich (11) | 2025 | published |
| huemac | · → Hospitality | America · Mexico | Brand Identity | rich (10) | 2025 | published |
| munda | · → Hospitality | America · Mexico | Brand Identity, Renders Support | rich (13) | 2025 | draft |
| oxylife | · → Food & Beverage | Middle East · UAE | Brand Identity | rich (12) | 2025 | published |
| pathize-health | · → Digital | America · US | · | legacy (4) | 2024 | published |
| pax-and-beneficia | · → Food & Beverage (slug override) | America · US | · | legacy (4) | 2025 | published |
| peachy-patients | · → Digital | America · US | · | legacy (4) | 2023 | published |
| persona | Consumer Goods | America · US | · | legacy (5) | 2025 | published |
| puppypy | · → Digital | America · US | · | legacy (4) | 2023 | published |
| reggie | Consumer Goods | America · US | · | legacy (4) | 2025 | published |
| rustico (Acre Resort) | Hospitality | America · Mexico | Brand Identity | rich (10) | 2026 | published |
| sexto-abismo | · → Food & Beverage | America · Mexico | Brand Identity | rich (13) | 2025 | draft |
| shop-latinx | · → Digital | America · US | · | legacy (4) | 2024 | published |
| tequila-unido | · → Food & Beverage | America · US & Mexico | Brand Identity, Packaging | rich (13) | 2025 | published |
| the-brand-academy (JosePablo) | · → **Digital** (an education brand) | America · US | Brand Identity | rich (9) | 2026 | draft |
| the-bridge | · → Hospitality (slug override) | Asia · Indonesia | · | legacy (4) | 2024 | published |
| the-curated-outfit | · → Consumer Goods | Europe · Netherlands | Brand Identity | rich (10) | 2025 | none → published |
| the-internet-empires | · → **SaaS** (a marketing course) | America · US | Brand Identity (Rebrand) | rich (12) | 2025 | published |
| tigretigre | · → Hospitality | America · Mexico | Brand Identity, Signage | rich (13) | 2025 | published |
| torre-avancer | · → **SaaS** (a building) | America · Mexico | Brand Identity, Signage | rich (13) | 2025 | draft |
| vyv | · → Consumer Goods | America · US | Brand Strategy, Identity, Packaging, Web | rich (13) | 2025 | none → published |
| welove | · → **Consumer Goods** (a media brand, in-house) | America · US | Editorial Brand, Brand Identity | rich (11) | 2025 | draft |

"rich" = Title Case list of 9 to 14 words written by the content pass (sector, product, audience, tone, place all mixed in one list). "legacy" = lowercase list of four from the first import (`branding`, `identity system`, `digital product`, `strategy`).

### The holes, ranked by damage

1. **Industry is guessed, and wrong on six projects.** Sanity has `industry` on 4 of 34. The scorer in `projectService.ts` fills the rest from tag words. "Modern", "B2B" and "Digital" in a tag list push Castro Capital, Torre Avancer, The Internet Empires and Atla into **SaaS**; Arc Studio and WeLove land in **Consumer Goods**. A visitor filtering SaaS sees a real estate tower.
2. **"Unspecified" is a real value on the site.** It appears inside `tags` for Pax & Beneficia, Angeles Wellness, The Bridge and Conscious Care Co (the industry fallback is written back into the tag list). It ranks in search and would be printed if tags were shown.
3. **Region is one bucket.** "America" covers 29 of 34 projects. The filter cannot separate United States from Mexico, which is the one distinction a prospect from either side would use. `country` is filled on every project and is never read by the filters.
4. **Two tag vocabularies.** Nine older projects carry four lowercase process words; twenty-three carry ten to fourteen Title Case words mixing sector ("Liquor"), audience ("B2C"), tone ("Warm", "Bold"), place ("LATAM", "US") and deliverable ("Bottle Design"). Case fixes in code hide the split, but the search weighs "B2C" the same as "Mezcal".
5. **Composite strings leak.** `service` holds "Brand Identity · Packaging" and `services` holds "Brand Identity (Rebrand)". Both get copied into `tags` as single tokens and show up as such in the live API.
6. **Year is not a filter.** 24 of 34 projects are 2025. The group has four buttons and one of them is almost everything.
7. **Description contradicts tags on four projects** (flagged "?" in the table in section 4): Castro Capital (description says real estate development, tags say wealth management); Huémac (description says hiking and adventure company, tags say tour operator); Bovi Health (description says dairy wellness, tags say functional health); TigreTigre (description says restaurant and menu, tags say signage and wayfinding). Eight descriptions are the placeholder "X is an Atla case study focused on brand identity execution" and four are empty.
8. **Five documents have no `status`** (Angeles Wellness, The Curated Outfit, Vyv, Casa Colora, Arc Studio). The server treats missing as published. That is probably right, but it is not a decision anyone made.

### How search reads the fields today

`rankProjects` scores query words against title (3), industry (3), services (2), tags (2), region (1). With no hit it falls back to "closest work" by overlap on industry, services and tags, widened by a 16-entry synonym map that targets the old five industries ("hotel" → hospitality, "fintech" → saas). Everything in that map points at values the new model replaces, so the map is rewritten, not patched (section 3.4).

---

## 2. Reference sites

| Site | Facets | Values per facet | Tags on project page | "Related" block | Screenshot |
|---|---|---|---|---|---|
| **cosmos.so** (Explore) | 1 category rail + free search | 18 categories (Fashion, Interiors, Graphic Design, Art, Branding, Typography, Architecture, Weddings, Interfaces, Nature, Cinema, Motion, Technology, Portraiture, Quotes, Emotion, Symbol & Myth, Featured). Inside Branding, "Trending searches" are long-tail phrases ("Wine bar branding", "Restaurant signage", "Boutique hotel keycards") | None. The element shows source, saver count and the clusters it is saved in | Yes: "You may also like", a full wall under the element, gated behind sign-up after a few rows | `cosmos-explore-categories.jpg`, `cosmos-branding-trending-searches.jpg`, `cosmos-element-you-may-also-like.jpg` |
| **pentagram.com/work** | 2: "We design [discipline] for [sector]" | 15 disciplines (Books, Brand Identity, Brand Strategy, Campaigns, Data Driven Experiences, Digital Experiences, Exhibitions, Industrial/Product Design, Motion Graphics & Film, Naming, Packaging, Publications, Signage & Environmental Graphics, Typefaces, Verbal Identity) × 18 sectors (Arts & Culture, Civic & Public, Climate & Sustainability, Consumer Brands, Education, Entertainment, Fashion & Beauty, Finance, Food & Drink, Health, Hospitality & Travel, Manufacturing & Industrials, Non-profits, Professional Services, Publishing, Real Estate, Technology, Transport) | Yes: chips under the title (e.g. "Brand Identity · Brand Strategy · Arts & Culture"), each a link to the filtered work page. Sector also printed on every card in the list | No "related". Only "Next Project" with its chips | `pentagram-work-we-design-for.jpg`, `pentagram-project-tag-chips.jpg` |
| **koto.com/work** | 1: "I'm curious about..." | 6 curated values that mix discipline and sector (Strategy and brand systems · Branding for entertainment · Digital experiences · Motion systems · Campaign · Branding scale ups), each with a count | Sector and year only, as a small line under the title ("TRAVEL · 2025") | No "related". "Next up" plus "View all projects" | `koto-work-filter-button.jpg`, `koto-project-sector-year.jpg`, `koto-project-next-up.jpg` |

What carries over to Atla:

- **Two axes are enough.** Pentagram's whole system is discipline × sector. Koto compresses it further. Neither shows a region or a year filter, and neither needs one at their size. Atla's four groups are already one more than the best reference uses, so this proposal adds no fifth group to Explore.
- **Tags are chips that link to the filtered wall** (Pentagram), not labels. That is the project-page pattern to copy: a quiet line, every word clickable, lands on Explore with that value set.
- **"More like this" is a Cosmos feature, not an agency one.** Pentagram and Koto only offer "next". Atla's wall is Cosmos-shaped, so a related block fits, but it should be three to six items, not a second wall.
- **Long-tail phrases live in search, not in filters** (Cosmos "Trending searches"). "Mezcal bottle", "pilates studio", "boutique hotel" are what a prospect types; they belong in the hidden search terms, not in a button.

---

## 3. The model

### 3.1 Facets

Five facets stored per project. Four of them are controlled lists; every value below is true of at least two projects in the current set (counts in section 4). No value is free text.

**Sector** (single value, required): who the brand serves. Replaces `industry` and `category`.

| Value | Projects |
|---|---|
| Hospitality & Travel | 6 |
| Food & Drink | 5 |
| Health & Wellness | 8 |
| Fashion & Lifestyle | 2 |
| Real Estate & Finance | 2 |
| Technology & Digital | 3 |
| Media & Education | 4 |
| Family & Pets | 4 |

**Discipline** (one or more, required, first one is the lead): what Atla delivered, as it shows in the images. Replaces `services`, `service`, and the "format" idea from the brief (packaging, signage, digital, motion, print are deliverables, so they belong here rather than in a fifth facet).

| Value | Projects |
|---|---|
| Brand Strategy | 7 (one ?) |
| Brand Identity | 34 |
| Packaging | 10 (one ?) |
| Website | 10 (two ?) |
| Art Direction | 6 |
| Signage & Spaces | 2 |
| Illustration | 4 (one ?) |
| Motion | 3 (?) |

Brand Identity is on every project, so it never filters anything and the ranking treats it as a stopword (it already drops "brand" and "branding"). It stays in the list because a visitor expects to see it on the project line and in `llms.txt`.

**Place** (single, derived from `country`, no new field): where the client is. Replaces `region`.

| Value | Rule | Projects |
|---|---|---|
| United States | country = United States | 18 |
| Mexico | country = Mexico | 10 |
| United States & Mexico | country = United States & Mexico | 2 |
| Middle East | country = United Arab Emirates | 2 |
| International | any other country | 3 (Canada, Netherlands, Indonesia) |

Place is computed in code from `country`, which is already filled on all 34 documents, so no migration touches it. The old `region` list (America, Europe, Asia, Middle East) is dropped; "Europe" and "Asia" each held one project.

**Stage** (single, required): why the client came. New.

| Value | Projects |
|---|---|
| New brand | 28 |
| Rebrand | 3 (one ?) |
| In-house | 3 |

Stage has three values, below the six-to-twelve band in the brief. Three is what the work supports; "Brand extension" was considered and dropped because only Vyv would carry it today. It joins the list the day a second sub-brand project ships. For that reason Stage is **not** an Explore group. It feeds search ("I need a rebrand"), the project line, "more like this" as a tie-breaker, and `llms.txt`.

**Year**: unchanged, already required in the schema.

**searchTerms** (hidden, free text, at most 8 per project): product and category nouns a prospect types and that the facet values do not contain: "mezcal", "gin", "tequila", "water", "coffee", "pilates", "leather", "dog food", "supplements", "gummies", "hotel", "resort", "tower", "marketplace". Never shown on the site. Rule: a term must name something visible in the project images or stated in its description.

Everything else goes: `tags`, `service`, `category`, `region`, `industry` are deprecated (section 5).

### 3.2 Why the Explore panel keeps four groups

Explore today: Region · Industry · Service · Year. Proposed: **Place · Sector · Discipline · Year**, in that order (where, for whom, what, when).

- The research says fewer groups, not more. Pentagram uses two, Koto one. Four is already generous; a fifth (Stage) would be a row of three buttons where one holds 28 projects.
- Region becomes Place because "America" split into United States and Mexico is the one filter a prospect on either side of the border uses. Europe and Asia had one project each and vanish into International.
- Year stays, reluctantly. It costs nothing, it is honest, and when the 2026 projects land it starts to mean something. If JP wants Explore tighter, Year is the group to cut, not Place.

### 3.3 Where each facet shows up

```
                 Explore   search rank   "closest"   project line   more like this   llms.txt / schema.org
Sector             ●          3 pts         ●            ●  link        1st key          about, keywords
Discipline         ●          2 pts         ●            ●  link        2nd key          keywords, genre
Place              ●          1 pt          ·            ●  link        3rd key          keywords, contentLocation
Stage              ·          2 pts         ·            ●  link        tie-break        keywords
Year               ●          ·             ·            ●              tie-break        dateCreated
searchTerms        ·          2 pts         ●            ·              ·                keywords
title              ·          3 pts         ·            ·              ·                name
```

**Project page line.** One quiet line under the title, each word a link to Explore with that value preselected (URL `/?sector=food-drink`, `/?discipline=packaging`, `/?place=mexico`):

> Food & Drink · Packaging, Brand Identity · Mexico · New brand · 2025

Stage reads oddly when it is "New brand", which is 28 of 34 projects. Print Stage only when it is Rebrand or In-house.

**"More like this"** at the end of a project, three items (six on wide screens), rule in order:

1. Same Sector, excluding the project itself.
2. Among those, prefer any shared Discipline other than Brand Identity.
3. Then same Place, then same Stage, then newest year.
4. If Sector alone yields fewer than three, fill with same lead Discipline, then newest.

Deterministic, no AI, computed from the same `/api/projects` payload the wall already holds. Worked example: Alma Brava (Food & Drink · Packaging, Art Direction · Mexico) → Sexto Abismo (same sector, Packaging, Art Direction, Mexico), Tequila Unido (same sector, Packaging), Oxylife (same sector, Packaging). Pax & Beneficia is fourth (same sector, no Packaging).

**`llms.txt`.** Today it links four industry pages and the home. Add a "Work" section, one line per published project: `- [Alma Brava](https://www.atla.design/work/alma-brava): Food & Drink · Packaging, Brand Identity, Art Direction · Mexico · 2025. Mezcal brand, bottle and label system.` The sentence is the first line of `description`, so placeholder descriptions must be rewritten first (eight of them, section 1).

**schema.org** on the project page (`client/src/lib/projectSeo.ts` today emits `CreativeWork` with only the description): add `about` = Sector, `genre` = lead Discipline, `keywords` = Sector + Disciplines + Place + Stage + searchTerms joined by commas, `contentLocation` = `locationName`, `dateCreated` = Year.

### 3.4 Search: the new ranking and synonym map

`rankProjects` weights become: title 3, sector 3, disciplines 2, stage 2, searchTerms 2, place 1. `tags` is removed from `ProjectLite`.

The synonym map is keyed to the new values so the "closest work" fallback lands on a sector, not an old industry word:

| Visitor types | Widened to |
|---|---|
| hotel, resort, restaurant, cafe, bar, travel, tour | Hospitality & Travel |
| drink, spirits, mezcal, tequila, gin, wine, beer, water, coffee, snack, cpg | Food & Drink |
| health, wellness, clinic, supplement, vitamin, fitness, gym, pilates, beauty, skincare | Health & Wellness |
| fashion, apparel, clothing, leather, accessories, lifestyle | Fashion & Lifestyle |
| real estate, building, tower, development, finance, fintech, investment, bank | Real Estate & Finance |
| ai, app, software, saas, platform, marketplace, startup | Technology & Digital |
| media, magazine, newsletter, course, academy, education, school | Media & Education |
| pet, dog, baby, kids, family, parenting | Family & Pets |
| rebrand, refresh, relaunch | Stage: Rebrand |
| launch, new brand, starting, sub-brand | Stage: New brand |
| label, bottle, box, pack | Discipline: Packaging |
| web, site, landing, app | Discipline: Website |
| sign, signage, wayfinding, space, interior | Discipline: Signage & Spaces |

The map lives in `shared/rankProjects.ts` as now, so the client ranks offline the same way.

---

## 4. Per-project tagging

Every value below is read from the project's description, its current tag list, its `category`, its country and the deliverables named in `services`. "?" marks a value JP should confirm; the reason follows the table. In-house projects are included and marked.

| slug | Sector | Disciplines (lead first) | Place | Stage | searchTerms |
|---|---|---|---|---|---|
| alma-brava | Food & Drink | Packaging, Brand Identity, Art Direction | Mexico | New brand | mezcal, spirits, bottle, label |
| ando | Health & Wellness | Packaging, Brand Identity | United States | New brand | gummies, supplements, vitamins, beauty |
| angeles-wellness | Health & Wellness | Brand Identity, Motion ? | United States | New brand | wellness |
| anything-ai | Technology & Digital | Website, Brand Identity, Motion ? | United States | New brand | ai, creative platform, app |
| arc-studio | Health & Wellness | Brand Identity | Middle East | New brand | pilates, fitness studio, movement |
| atla (in-house) | Media & Education ? | Brand Identity | United States | In-house | branding studio, agency |
| baristio | Hospitality & Travel | Brand Identity, Packaging, Motion ? | United States | New brand | cafe, coffee, specialty coffee |
| bond-and-bloom | Family & Pets | Brand Identity, Brand Strategy ? | United States & Mexico | New brand | postpartum, parenting, babies, wellness |
| bovi-health | Health & Wellness | Brand Identity, Packaging ? | United States | New brand | functional health ?, dairy ? |
| casa-colora | Family & Pets ? | Brand Strategy, Brand Identity | Mexico | New brand | kids, family, lifestyle |
| castro-capital | Real Estate & Finance | Brand Identity | Mexico | New brand | investment ?, real estate ?, capital |
| conscious-care-co | Health & Wellness | Brand Identity, Brand Strategy | International | New brand | wellness, mindful care |
| hanks-leather | Fashion & Lifestyle | Website, Brand Identity | United States | Rebrand ? | leather goods, accessories, e-commerce, heritage |
| huemac | Hospitality & Travel | Brand Identity, Illustration ? | Mexico | New brand | tour operator ?, hiking ?, adventure, travel |
| munda | Hospitality & Travel ? | Brand Identity, Art Direction | Mexico | New brand | vacation homes, long stay, surf |
| oxylife | Food & Drink | Packaging, Brand Identity | Middle East | New brand | water, premium water, bottle |
| pathize-health | Technology & Digital ? | Brand Identity, Website, Brand Strategy | United States | New brand | health tech, saas, patient platform |
| pax-and-beneficia | Food & Drink | Brand Identity, Illustration | United States | New brand | coffee, specialty coffee |
| peachy-patients | Health & Wellness | Brand Identity, Website, Brand Strategy | United States | New brand | healthcare, patient platform |
| persona | Health & Wellness | Packaging, Brand Identity | United States | Rebrand | vitamins, personalized nutrition, subscription |
| puppypy | Family & Pets | Brand Identity, Illustration, Website | United States | New brand | pet care, dog |
| reggie | Family & Pets | Packaging, Brand Identity, Illustration | United States | New brand | dog food, pet |
| rustico (Acre Resort) | Hospitality & Travel | Brand Identity, Website ? | Mexico | New brand | resort, boutique hotel, los cabos |
| sexto-abismo | Food & Drink | Packaging, Brand Identity, Art Direction | Mexico | New brand | gin, craft gin, bottle |
| shop-latinx | Technology & Digital | Brand Identity, Website, Brand Strategy | United States | New brand | marketplace, e-commerce, latin |
| tequila-unido | Food & Drink | Packaging, Brand Identity, Website ? | United States & Mexico | New brand | tequila, spirits, bottle |
| the-brand-academy (in-house) | Media & Education | Brand Identity | United States | In-house | branding course, education |
| the-bridge | Hospitality & Travel | Brand Identity, Art Direction | International | New brand | hotel, restaurant, bali |
| the-curated-outfit | Fashion & Lifestyle | Brand Identity, Website, Art Direction | International | New brand | apparel, curation, e-commerce |
| the-internet-empires | Media & Education | Brand Identity | United States | Rebrand | marketing course, coaching, growth marketing |
| tigretigre | Hospitality & Travel | Brand Identity, Signage & Spaces | Mexico | New brand | restaurant, fine dining, menu |
| torre-avancer | Real Estate & Finance | Brand Identity, Signage & Spaces | Mexico | New brand | tower, mixed use, wayfinding |
| vyv | Health & Wellness | Packaging, Brand Strategy, Brand Identity, Website | United States | New brand ? | supplements, vitamins, subscription |
| welove (in-house) | Media & Education | Art Direction, Brand Identity | United States | In-house ? | editorial, newsletter, magazine |

Counts check: Sector 6 + 5 + 8 + 2 + 2 + 3 + 4 + 4 = 34. Discipline: Brand Strategy 7 (one "?"), Packaging 10 (one "?"), Website 10 (two "?"), Art Direction 6, Signage & Spaces 2, Illustration 4 (one "?"), Motion 3 (all "?"). Stage: New brand 28, Rebrand 3 (one "?"), In-house 3.

The "?" cases, one line each:

- **Motion** on Angeles Wellness, Anything AI, Baristio: each has one video in Sanity. A video on the page is not the same as a motion deliverable. If JP says Motion was not sold, the value goes and the Discipline list has seven values.
- **atla** sector: a studio identity has no client sector. Media & Education is the closest honest bucket. Alternative: leave Sector empty for in-house work and exclude it from the Sector filter.
- **bovi-health**: description says "dairy wellness brand", tags say "functional health, clinical-forward". One of them is wrong. Packaging "?" because the description mentions packaging but `services` does not.
- **casa-colora**: tags say kids, family, babies and also hospitality and multi-vertical. Family & Pets if it is a children's brand, Hospitality & Travel if it is a place.
- **castro-capital**: description says "real estate development firm", tags say "investment, wealth management". Both fit Real Estate & Finance, but the search terms need the right one.
- **hanks-leather** stage: description "rebuilt for the way it sells today" reads as a rebrand of an existing house.
- **huemac**: description says hiking and adventure, tags say tour operator and cultural heritage. Illustration "?" because the description names an iconography system.
- **munda**: vacation homes with long stays sits between Hospitality & Travel and Real Estate & Finance. Chose Hospitality because the audience is a guest, not a buyer.
- **pathize-health**: health-tech SaaS. Technology & Digital because the product is software; Health & Wellness is the alternative.
- **rustico, tequila-unido** Website: the live API derives Website for both, Sanity `services` does not list it. Confirm whether a site shipped.
- **vyv** stage: tags say "sub-brand". It is the only extension in the set, so it is filed as New brand until a second one exists; confirm the parent brand is real.
- **welove**: in-house, draft, and the site never names the media company. Stage In-house is fine; whether it is published at all is JP's call and outside this proposal.
- **bond-and-bloom** Brand Strategy: `services` says Copywriting System. No Verbal Identity value exists because only this project would carry it; Brand Strategy is the nearest honest value, or drop it and keep Brand Identity alone.

---

## 5. Sanity schema change (schema and code on branch `claude/site-v2-tags-ca8c28`, 2026-11-05; schema not deployed)

### Fields

| Field | Type | Change | Validation |
|---|---|---|---|
| `sector` | string | new, list of the 8 values in 3.1 | required |
| `disciplines` | array of string | new, list of the 8 values in 3.1, `layout: "grid"` | required, min 1, unique, first item is the lead |
| `stage` | string | new, list of 3, radio | required, initial "New brand" |
| `searchTerms` | array of string | new, tag layout | max 8, each lowercase, 2 to 30 characters |
| `country` | string | unchanged | becomes required (Place derives from it) |
| `year` | number | unchanged | unchanged |
| `status` | string | unchanged | becomes required (five documents have none) |
| `industry` | string | deprecated: hidden, read-only | · |
| `region` | string | deprecated: hidden | · |
| `category` | string | deprecated: hidden | · |
| `services` | array | deprecated: hidden | · |
| `tags` | array | deprecated: hidden | · |
| `service` | (not in schema) | removed from documents by the migration | · |

Studio: the Taxonomy group shows Sector, Disciplines, Stage, Country, Location, Coordinates, Search terms, in that order. Deprecated fields stay hidden for one release so nothing breaks while the code moves, then get deleted with a second, trivial migration.

### Code that reads the new fields (written 2026-11-05, branch `claude/site-v2-tags-ca8c28`)

- `server/sanity/projectService.ts`: read `sector`, `disciplines`, `stage`, `searchTerms`, compute `place` from `country`; delete `deriveFacetValues`, `INDUSTRY_KEYWORDS`, `SERVICE_KEYWORDS`, `INDUSTRY_OVERRIDES_BY_SLUG`, `TAG_CASE_OVERRIDES`.
- `shared/schema.ts` and `shared/rankProjects.ts`: `ProjectLite` gains `sector`, `disciplines`, `place`, `stage`, `searchTerms`; loses `industry`, `services`, `tags`, `region`. New weights and synonym map (3.4).
- `client/src/components/site/workFilters.tsx`: four groups become Place · Sector · Discipline · Year; `matchesFilters` checks `disciplines.includes(...)`; options read from the controlled lists in one shared constants file, not from the data, so an empty value never appears and the order is fixed.
- `client/src/components/site/siteProjects.ts`: new fields on `SiteProject`; URL query params for preselected filters.
- Project page: the facet line and the "more like this" block (3.3).
- `client/src/lib/projectSeo.ts` and `client/public/llms.txt`: 3.3.
- The four industry landing pages (`/hospitality-branding`, `/cpg-branding`, `/wellness-branding`, `/saas-branding`) select projects by sector: Hospitality & Travel; Food & Drink plus any project with Packaging; Health & Wellness; Technology & Digital. The CPG page is the only one that needs two facets.

### Migration script (runs only after JP's «mándalo»)

Implemented 2026-11-05 on branch `claude/site-v2-tags-ca8c28` as `script/migrate-project-facets.ts`, reading `script/project-facets.json` (the table in section 4 with the section 6 answers applied, generated from `FACETS_BY_SLUG` in `shared/projectFacets.ts`; the two must stay identical).

1. Validates every row against the controlled lists before touching the network and refuses a row that still holds a "?" or a value outside the lists.
2. Default mode is a dry run: one block per document, before → after for `sector`, `disciplines`, `stage`, `searchTerms`, plus `service` → (unset). Writes nothing.
3. `--write` with `SANITY_WRITE_TOKEN` patches the **draft** of each document (`drafts.<id>`): when the project has no draft, the draft is created as a copy of the published document first, then patched. Published documents are never written; JP reviews each draft in the Studio and publishes it. The deprecated fields stay.
4. Project `dvufm78f`, dataset `production`, API version 2023-10-01, `@sanity/client` from the repo. The Sanity MCP on this Mac is not used.
5. Verification: after the commit the script re-reads every draft and exits non-zero listing any slug whose stored values differ from the JSON. The run is done only when it prints `✓ 34 drafts match the table`.

Dry run against the live dataset on 2026-11-05 (no token, so compared with the published documents): all 34 slugs found, 34 documents to change, none missing, none untouched. Nothing written.

Write run on 2026-11-05 after JP's «mándalo» (KB-596): 34 drafts patched (22 created from their published documents, 12 already existed), `service` unset on all 34, published documents untouched. The first run copied the projected string slug into the 22 new drafts; those slugs were restored from the published documents the same day and the script now projects `slug.current` as `slugCurrent` beside the raw document and verifies the slug object. Dry run after the write: 0 documents to change, 34 already set.

```bash
npx tsx script/migrate-project-facets.ts                                   # dry run
SANITY_WRITE_TOKEN=<token> npx tsx script/migrate-project-facets.ts --write   # after «mándalo»
```

Before the migration runs the site is already correct: `resolveProjectFacets` (`shared/projectFacets.ts`) falls back to the same table by slug whenever a document carries no `sector` or `disciplines`, on the server (`/api/projects`, `/api/ask`), in the client and in the build (`llms.txt`, JSON-LD). Place is derived from `country` everywhere and is never stored.

### Rollout, in order

1. JP answers the "?" rows (section 4) and the question at the end of this doc. Done 2026-11-05 (section 6).
2. Schema change in `sanity/schemaTypes/project.ts`: new fields with validation, old fields marked deprecated, `country` and `status` required. Written; the Studio is not deployed from this branch.
3. Dry run of the migration; JP reads the diff; «mándalo»; `--write`; verification prints the ✓ line. Done 2026-11-05 (see the write run above). Remaining: JP publishes each draft in the Studio.
4. Code: server mapping, ranking, Explore groups, project line, more like this, `llms.txt`, schema.org. Written on the same branch; with the slug fallback the site never shows empty facets, before or after step 3.
5. Rewrite the eight placeholder descriptions and four empty ones (separate content task; they feed `llms.txt`).
6. One release later: delete the deprecated fields and the second migration unsets them.

Later, not now: image-level tags (Cosmos "elements") so the wall can filter by what a picture shows (bottle, signage, app screen). It needs per-image metadata the schema does not have, and 34 projects do not justify it yet.

---

Decision: approve the facet model (Sector 8 · Discipline 8 · Place 5 · Stage 3 · Year, Explore stays at four groups), change the facets, or keep today's four groups and only fill the empty values.

## 6. JP's answers to the "?" rows (2026-11-05)

- Motion: Angeles Wellness, Anything AI and Baristio all had motion work. Motion stays as a facet value on the three.
- Bovi Health: dairy wellness. The clinical tags go; the description stays.
- Sectors confirmed: Casa Colora = Family & Pets, Mundã = Hospitality & Travel, Pathize Health = Technology & Digital, Atla = Media & Education.
- Stage confirmed: Hanks Leather = Rebrand, Vyv = New brand, WeLove = In-house.
- Every other "?" in section 4 takes the value as proposed.

Decision: the facet model and the per-project table are final. Next: the rollout in section 5, after Task 13 lands, with the Sanity migration waiting for JP's «mándalo».
