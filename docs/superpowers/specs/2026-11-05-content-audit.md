# Content audit: atla.design v2 copy, voice and rules

Date: 2026-11-05 · Read-only audit, nothing edited · Status: for JP's decision

**Finding:** the v2 core (header, brief, ventures, footer, most of Services) is clean, but older pages kept inside v2 still break the founder's rules: two hard number violations in `siteCopy.ts`, banned words and AI filler on `/hospitality`, em dashes in meta, WeLoveDaily named outside `/ventures`, and meta descriptions in `script/build.ts` that no longer match the pages.

**Decision:** approve the defect list as one follow-up commit, or tell me which rows to leave. Rows marked LEGAL and POLICY need JP's ruling, not a rewrite.

Method: every string dumped from `siteCopy.ts`, `serviceSchema.ts`, `shared/brief.ts`, `llms.txt`, the `Atla*.tsx` pages, `not-found.tsx`, `ContactForm.tsx`, `AnalyticsConsent.tsx` and the route table in `script/build.ts`. `filtro-calidad.py --tipo texto` ran on four dumps (copy, misc, pages, llms). It flagged one em dash (`AtlaJournal.tsx:103`) and two word warnings; everything else came from reading plus targeted greps (banned words, digits and number words, dashes, `not just`, CTA labels, WeLoveDaily, name spellings). The script cannot catch AI tells or unsourced claims, so those are manual.

Severity: **H** breaks a binding rule or states something unverified. **M** AI tell, filler or inconsistency. **L** polish.

## 1. Defects

### 1a. Hard rule breaks (numbers, dashes, banned words, WeLoveDaily)

| # | Where | String | Rule or tell | Suggested rewrite | Sev |
|---|---|---|---|---|---|
| 1 | `siteCopy.ts:152` | "Two weeks inside your brand. Findings ranked by what to fix first, and a roadmap." | Duration, week number | "A look inside your brand. Findings ranked by what to fix first, and a roadmap." | H |
| 2 | `siteCopy.ts:155` | "A creative director on your team by the month." | Cadence as duration | "A creative director on your team. Decisions, reviews, standards." | H |
| 3 | `siteCopy.ts:286` | "Three companies we design for are companies we own." | Count; "own" conflicts with Ventures ("involved in", four items) | "We run brands of our own too." (see C3) | H |
| 4 | `AtlaHospitality.tsx:970-971` | "We believe in a holistic approach to branding, guided by defined creative processes and the understanding that great brands are built day by day." | Banned word "holistic"; filler; "day by day" | Delete. Or: "One team does strategy, identity and the rollout, so the brand stays one brand." | H |
| 5 | `AtlaHospitality.tsx:1033-1034` | "The ultimate goal of branding is to foster meaningful, long-term relationships that inspire loyalty and trust, turning every interaction into an opportunity to connect with your audience on a deeper level." | Banned word "foster"; -ing tail; triple; no information | Delete the paragraph. If kept: "A brand is what a guest remembers on the way home." | H |
| 6 | `AtlaHospitality.tsx:1026` | "Branding goes far beyond visuals, it's the foundation of building a complete and memorable identity." | "Goes far beyond X" is not-just-X; comma splice; generic | "Branding starts before the logo." | H |
| 7 | `AtlaHospitality.tsx:1029-1030` | "While the visual elements are the starting point, a true brand is shaped by a cohesive strategy that aligns tone, voice, and objectives." | Corporate filler; contradicts line 1026 (starting point vs foundation) | "Strategy decides the tone, the voice and what the place is for. Design follows." | M |
| 8 | `AtlaHospitality.tsx:920` | "We design hospitality experiences people love, win awards, and make sure your guests keep coming back." | Rule of three; "win awards" claims client awards as Atla's; outcome promise | "Brands for hotels and restaurants, from the booking page to the room." | H |
| 9 | `AtlaHospitality.tsx:1007-1008` | "After launch, we can keep a weekly seat at the table ... We work with Acre and Temakase this way today." | "Weekly" cadence; unsourced retainer claim | "After launch we can stay on, so new outlets and rooms come out of the same system." (C6) | H |
| 10 | `AtlaHospitality.tsx:147` | "We still work with Acre every week." | Cadence; claim | "We still work with Acre." (C6) | H |
| 11 | `AtlaHospitality.tsx:1045` | "One brand, whether you have ten rooms or four restaurants." | Counts | "One brand, whether you have a few rooms or several restaurants." | M |
| 12 | `AtlaPrograms.tsx:45` | "Six to eight interviews across leadership, sales, product and service." | Range of counts | "Interviews across leadership, sales, product and service." | H |
| 13 | `AtlaPrograms.tsx:41` | "...about your brand and two competitors..." | Count | "...about your brand and its closest competitors..." | M |
| 14 | `AtlaPrograms.tsx:52-54` | "The 20/5 workshop ... Twenty things the brand could be, reduced to the five it will be." | Numbers as copy (offer name from `oferta-A.md`, outside this repo) | POLICY: keep if JP rules offer names exempt; else "The shortlist workshop. Everything the brand could be, reduced to what it will be." | M |
| 15 | `AtlaPrograms.tsx:226` | "A monthly engagement after launch." | Cadence | "An engagement after launch." | M |
| 16 | `AtlaPrograms.tsx:29,155,192,218`, `AtlaHospitality.tsx:967`, `siteCopy.ts:150` | "one of three levels", "Three levels", "One sequence, three steps", "Three ways to work with us", "Four ways in" | Counts of offer parts (low risk) | Name the parts, drop the number | L |
| 17 | `AtlaHowWeWork.tsx:160` | "we show two or three options grounded in the strategy" | Count promise | "we show options grounded in the strategy, with a recommendation" | M |
| 18 | `AtlaHowWeWork.tsx:139` | "Limited capacity. We cap how many projects each team runs at once" | Unsourced claim (C8) | Confirm or cut | M |
| 19 | `siteCopy.ts:271` | "You and we choose one, in a room, in one session." | "One session" is a duration promise | "You and we choose one, in a room." | M |
| 20 | `siteCopy.ts:234` | metaSuffix "A Senior-Led Branding Studio for the Next Few Years" | Vague duration; title case | "Senior-led branding for the years after launch" | M |
| 21 | `shared/brief.ts:32`, `ContactForm.tsx:113-114` | options "1–3 months", "3–6 months" | En dash and digits. JP allows the timing options, not the en dash | "One to three months", "Three to six months" | M |
| 22 | `AtlaPrivacy.tsx:29,34,88` | "Atla & WeLoveDaily, LLC" | WeLoveDaily named outside /ventures | LEGAL: JP rules whether the legal entity name is exempt. Else "Atla, a Texas company" | H |
| 23 | `llms.txt:3` | "The legal entity is Atla & WeLoveDaily, LLC (Austin, Texas)." | Same | Drop the sentence or "The studio is based in Austin, Texas." | H |
| 24 | `AtlaPrivacy.tsx:40,46,82` | "ten minutes", "two years", "30 days", "two years" | Durations (retention facts) | LEGAL: the disclosure needs the numbers; JP rules them exempt in writing | M |
| 25 | `AtlaBrandStrategy.tsx:78`, `build.ts:626` | "How brand strategy actually works — positioning, ..." | Em dash, "actually" | "How brand strategy works: positioning, messaging, audience and competitive framing, decided before design starts." | H |
| 26 | `build.ts:633` | "How Atla runs branding engagements — from discovery to launch." | Em dash; differs from the page (D2) | Use the page's text (`AtlaHowWeWork.tsx:38`) | H |
| 27 | `build.ts:832`, `build.ts:681` | `<title>` "Page Not Found — Atla", "Projects Admin Retired — Atla" | Em dash, title case | "Page not found | Atla" | M |
| 28 | `AtlaJournal.tsx:103` | schema name `${title} — Atla Journal` | Em dash (JSON-LD, not visible) | `${title} | Atla Journal` | L |

### 1b. AI tells, filler and generic lines

| # | Where | String | Tell | Suggested rewrite | Sev |
|---|---|---|---|---|---|
| 29 | `AtlaJournal.tsx:28` | "The goal is not abstract theory. It is to make positioning, audience clarity, and business decisions legible enough that the creative work can move faster and hold together under pressure." | Not X, it is Y; filler | "Positioning and audience, written so the design work moves faster." | M |
| 30 | `AtlaJournal.tsx:38` | "websites as business tools, not just visual containers" | Not just X | "A website has to explain the business as well as it looks." | M |
| 31 | `AtlaJournal.tsx:196` | "Category pages are designed to be useful on their own, not just as filters. Each one brings together essays that solve a related problem..." | Not just X; describes the page | Delete paragraph | M |
| 32 | `AtlaJournal.tsx:199,202` | "...why the change matters operationally." / "Use this archive as a decision aid ... without losing coherence." | Corporate filler | Delete both | M |
| 33 | `AtlaJournal.tsx:33` | "Think of this category as field notes from ongoing brand work. It is where smaller lessons live before they become larger systems..." | Padding, abstraction | "Short notes from client work." | M |
| 34 | `AtlaJournal.tsx:23-24,27,31-32,36-40,96-97` | Category support copy (about 14 sentences) | Generic, "legible", "strategic choices", "practical" x4 | One line per category, or delete (cards already say it) | M |
| 35 | `AtlaJournal.tsx:92` | "How we think about brands, design, and the work behind the work." | Cliche, triple | "Notes on brands, design and how we work." | L |
| 36 | `AtlaJournal.tsx:146-148` | "Use the journal as both an archive and a working reference. ... before teams commit time, budget, or attention in the wrong direction." | Filler, triple | Delete | M |
| 37 | `AtlaJournal.tsx:20` | meta "...for modern brands." | Filler | "Essays and notes on branding, strategy and design from Atla." | L |
| 38 | `AtlaArticle.tsx:162-170` | heading "Other news"; "Keep reading through related journal pieces, or jump into the broader archive to see how strategy, identity, digital craft, and category-specific thinking connect across the studio's writing." | Journal has no news; filler | Heading "More from the journal"; delete the paragraph | M |
| 39 | `AtlaWellnessBranding.tsx:22` (meta) | "Systems built for trust, regulatory clarity, and emotional connection." | "Emotional connection" filler; "regulatory clarity" overpromises vs FAQ ("final regulatory approval stays with your legal team") | "Brand strategy and identity for wellness and health companies. Credible, warm, inside the rules." | M |
| 40 | `AtlaWellnessBranding.tsx:94` | "We design brands that earn credibility before they ask for a sale." | Generic, any agency | "Trust is the first thing we design." | L |
| 41 | `AtlaSaasBranding.tsx:27`, `serviceSchema.ts:142`, `AtlaWellnessBranding.tsx:41` | "SaaS branding for software that needs to stand apart"; "Positioning that stands apart" | "Stand apart" cliche | "SaaS branding that does not look like everyone else's" | L |
| 42 | `AtlaSaasBranding.tsx:136`, `AtlaHospitalityBranding.tsx:149`, `AtlaCpgBranding.tsx:148`, `AtlaWellnessBranding.tsx:144` | "We will tell you honestly if we are the right fit." / "quickly" / "what we see" | "Honestly" filler, "quickly" time promise; same CTA sentence on 4 pages | "Tell us about the product. We will say if we are the right fit." | L |
| 43 | `AtlaHowWeWork.tsx:147` | "A full branding engagement takes longer than strategy, identity or packaging on its own." | Tautology | Delete; keep the second paragraph | L |
| 44 | `AtlaHowWeWork.tsx:164` | "Less rework: strategy before design means fewer surprises later." | Generic benefit | Delete | L |
| 45 | `AtlaHowWeWork.tsx:46`, `AtlaBrandStrategy.tsx:87` | "This page answers them." / "This page lays out how Atla does strategy: what it includes, what it leaves out and what you get at the end." | Describes the page; triple | Delete both | L |
| 46 | `AtlaBrandStrategy.tsx:114` | "Strategic choices tied to business results you can measure." | Generic claim, no result | "Choices you can check against sales, not taste." or cut | L |
| 47 | `AtlaHospitalityBranding.tsx:63` | "Identity for a hotel and restaurant concept in Bali, with an editorial eye." | "With an editorial eye" filler; only 1 of 4 projects has a line | Plain line for all four, or none | L |
| 48 | `AtlaHospitalityBranding.tsx:91` | "Most agencies design for screens or for spaces." | Generic swipe, no source | Keep only "We build one system that works on a phone and on the side of a building." | L |
| 49 | `siteCopy.ts:138` | "More products, more markets, more people touching the brand." | Rule of three | "More products, more markets. Every new person touches the brand. We keep it one brand." | M |
| 50 | `siteCopy.ts:200`, `llms.txt:19` | "Packaging that is recognized at arm's length, in a thumbnail, and across the whole range." | Rule of three | "Packaging you recognize at arm's length and in a thumbnail, across the whole range." | L |
| 51 | `siteCopy.ts:222`, `llms.txt:21` | "The brand in movement, from the logo to the feed to the product, without a second system." | from-to-to triple | "The brand in movement, without a second system." | L |
| 52 | `siteCopy.ts:243` | "Research, options and production are getting cheap. Choosing well is not." | List of three, general claim | "Options are cheap now. Choosing well is not." | L |
| 53 | `siteCopy.ts:247` | "Assistants and agents now compare, book and buy. We build identities that read clearly to people and to the machines in between." | Triple; "machines in between" unclear; general claim | "Assistants now compare and book for people. We build identities they can read too." | M |
| 54 | `siteCopy.ts:255` | "We know what a system has to take once the launch is over." | Vague ("take") | "We know what a system has to survive after launch." | L |
| 55 | `siteCopy.ts:275` | "AI does first passes, variations and production work." | Triple | "AI does first passes and production work." | L |
| 56 | `siteCopy.ts:132` | "...We make sure the brand holds up to that look." | "That look" unclear | "...We make sure the brand survives that first look." | L |
| 57 | `siteCopy.ts:150` | "All of them senior from day one, and none of them a layer between you and the work." | "From day one" time claim; wordy | "All four are senior-led. Nobody sits between you and the work." | L |
| 58 | `siteCopy.ts:100` | "Give it a few minutes." | Vague duration in an error | "Try again soon." | L |
| 59 | `siteCopy.ts:322` | logos.line "Brands we have built with." | Odd grammar (hidden, list empty) | "Brands we have worked with." | L |
| 60 | `AtlaHospitality.tsx:381` | Eyebrow "Restaurants · Wellness · Coffee Shops · Hotels" | Title case | "Restaurants, wellness, coffee shops, hotels" | L |
| 61 | `build.ts:578` | "Explore Atla services in ... for ambitious companies." | "Explore", "ambitious companies"; stale (D1) | Use `siteCopy.services.metaDescription` | M |
| 62 | `build.ts:553` | "Meet Atla, a senior-led branding studio helping founders and teams build ..." | "Meet", "helping ... build"; stale (D1) | Use `siteCopy.about.metaDescription` | M |
| 63 | `build.ts:562` | "Contact Atla to discuss branding, ... for your next launch, reposition, or growth stage." | Filler; stale | Use `siteCopy.contact.metaDescription` | M |
| 64 | Title tags: `build.ts:537,552,561,577,593,601,609,617,625,632,639`, `siteCopy.ts:114,234,306` | "Strategy-Led Branding Studio", "Brand Strategy, Identity, and Digital Design Services", "Hospitality Branding Agency" | Title case in `<title>` | POLICY: JP rules whether the no-title-case rule covers title tags | L |
| 65 | `AtlaPrograms.tsx:81-93` | Section "Proof" holds two lines that say what the companies are, not a result | Heading promises proof, delivers a label | Rename "Companies we run" | L |
| 66 | `AtlaHospitality.tsx:405` | Label "Recent client awards" | Awards are the clients', not Atla's; "recent" is a time claim | "Awards our clients hold" | L |
| 67 | `AnalyticsConsent.tsx:70` | "Nothing is used for ads." | Contradicts `AtlaPrivacy.tsx:46,49` (Meta Pixel on /waitlist) | "Nothing on this site is used for ads." | M |
| 68 | `AtlaPrograms.tsx:236` | "Atla*. Senior team, founder at the table, no handoff chain." | "Atla*" spelled with the asterisk here only | Pick one spelling | L |

## 2. Claims that need a source or JP's approval

None of these has a source file in the repo unless stated.

| # | Where | Claim | Source found | Needed |
|---|---|---|---|---|
| C1 | `siteCopy.ts:284-285`, `AtlaHospitality.tsx:56-61,150,163`, `build.ts:587` | MICHELIN Key (Casa Las Tortugas) and MICHELIN Green Star (Acre's restaurant) | Only the code; nothing in `docs/` | JP confirms both awards and that "a brand we built / rebuilt" is accurate. The awards belong to the hotel and restaurant. Casa Las Tortugas: Hospitality says "audited ... set the brand architecture" (`:160`), About says "built". Acre: Hospitality says audit, architecture, brand book, website (`:147`), About says "rebuilt". Align the verbs |
| C2 | `siteCopy.ts:289` | Selected clients "Aimee Kestenberg", "PrettyBoy", "Brick" (not in the Sanity list in `2026-11-04-team-and-logos-for-approval.md`) | A code comment: "JP's 2026-10-04 list" | JP confirms the three are clients and may be shown |
| C3 | `siteCopy.ts:254-255,286` vs `:330-335` | "We run brands too" / "companies we own" (Sexto Abismo, TigreTigre, Persona) vs Ventures "involved in" with four items | None | JP picks "own", "run" or "involved in". Persona's parent company is not named anywhere in the repo (checked) |
| C4 | `siteCopy.ts:236,238,258-281` | "We use AI for the slow parts"; "machines that now shop for them"; the five-step AI process | Spec comment only (PENDING JP APPROVAL, `siteCopy.ts:229`) | JP approves the public AI claim |
| C5 | `siteCopy.ts:75,105,309`, `llms.txt:47` | "Jose Pablo reads every brief himself and replies by email." | None | JP confirms he keeps doing this |
| C6 | `AtlaHospitality.tsx:147,1007-1008` | "We still work with Acre", "We work with Acre and Temakase this way today" (ongoing seat) | None | JP confirms both are current and on a standing arrangement |
| C7 | `AtlaHospitality.tsx:145-160,1045` | Casa Las Tortugas "four restaurants and a spa", "family-owned", "Holbox's main beach"; Acre "treehouses, villas, a restaurant, a mezcal bar and weddings" | None | JP confirms the facts |
| C8 | `AtlaHowWeWork.tsx:135-140,157` | "Limited capacity ... we cap how many projects each team runs"; "specialists we vet ourselves"; "a milestone tracker" | None | Confirm or cut |
| C9 | `AtlaHowWeWork.tsx:132`, `AtlaSaasBranding.tsx:99`, `AtlaHospitalityBranding.tsx:113` | "The people at kickoff are the people doing the work"; "No account managers" (the team lists a Project Manager) | None | Confirm wording |
| C10 | `AtlaCpgBranding.tsx:94-95` | "We test hierarchy, legibility and how the pack stands apart before we lock a direction." | None | Confirm Atla runs a test, or soften to "We check" |
| C11 | `serviceSchema.ts:121` | "We have built brand systems for health-tech teams where the identity has to hold across the app, the marketing site and investor materials." | Pathize Health and Peachy Patients exist as projects | Confirm "investor materials" was in scope |
| C12 | `siteCopy.ts:178`, `llms.txt:17` | "A name that clears legal" | None; reads as a legal-clearance promise, which the Wellness FAQ says stays with the client | Rewrite ("A name checked against the register") and confirm what Atla checks |
| C13 | `AtlaPrograms.tsx:71,77,209-213` | Core/Complete/Integral contents, Diagnostic "credited in full", "rollout across multiple US markets", Stewardship included | `oferta-A.md` (header comment, approved 2026-10-13, not in this repo) | Confirm the file still matches |
| C14 | `AtlaPrograms.tsx:85,91`, `siteCopy.ts:333` | Persona "The personalized vitamin company" vs Ventures "Nutrition, made personal."; Anything "The vibe-coding company" | Project slugs `persona`, `anything-ai` exist | Confirm one-liners; two different lines for Persona |
| C15 | `AtlaHospitality.tsx:184` | "Mako is drawn after Ebisu, the Japanese god of fishermen and luck" | None | Confirm |
| C16 | `siteCopy.ts:331-334`, `AtlaCpgBranding.tsx:66` | TigreTigre "A restaurant." vs the CPG page listing it as CPG work | None | Confirm both are true |
| C17 | `AtlaHospitality.tsx:109-125` | "Where we have worked" city list: Austin, Dallas, Denver, Los Angeles, San Diego, Bellevue, Charlotte, Upstate New York, Toronto, Amsterdam, Abu Dhabi, Dubai | Comment: Sanity coordinates read 2026-10-23 | Confirm each is a client location |
| C18 | `AtlaPrivacy.tsx:54,80` | Storage paragraph and Anthropic paragraph | Both carry PENDING JP APPROVAL comments | Still needs JP |
| C19 | `llms.txt:52` | "Guided start ... Branding Analysis" | `start.atla.design`, external | Confirm the name and that the link is live |
| C20 | `llms.txt:41` | Journal link "How much does branding cost" | The article exists; its body is outside this audit | Read it for prices; the no-price rule may apply |

## 3. Consistency findings

| # | Finding | Where | Fix |
|---|---|---|---|
| D1 | **Meta does not match the pages.** `/about`: build says "About Atla | Senior-Led Branding Studio, US and LatAm" + "Meet Atla ...", page says "Why Atla | A Senior-Led Branding Studio for the Next Few Years" + "Atla builds brands for the years after...". `/contact` and `/services` also differ. Search and social show the old text | `build.ts:552-553`, `:561-562`, `:577-578` vs `siteCopy.ts:233-236`, `:305-307`, `:114-116` | Import `siteCopy` in the route table, as `/brief` already does (`build.ts:570-571`) |
| D2 | `/how-we-work` meta in build has an em dash and different words from the page | `build.ts:633` vs `AtlaHowWeWork.tsx:38` | One source |
| D3 | **CTA label is not "Start a project" everywhere.** Landings, How we work and Brand strategy use "Start a project →" (arrow); Programs "Start a project"; Hospitality "Book a call" and "Send the details"; contact form "Send message"; brief "Send". Targets differ too: header, Ask bar, project page and Services go to `/brief`; landings, Programs, How we work and Brand strategy go to `/contact` | `AtlaHospitalityBranding.tsx:34,151` (same in Cpg:33,150, Saas:34,138, Wellness:34,146), `AtlaHowWeWork.tsx:179`, `AtlaBrandStrategy.tsx:245`, `AtlaPrograms.tsx:240`, `AtlaHospitality.tsx:373`, `ContactForm.tsx:148` | One label, no arrow, target `/brief`. Hospitality keeps its form but "Book a call" is the odd label out |
| D4 | Header link is "Why Atla"; the page is called "About" elsewhere | `AtlaHowWeWork.tsx:180` "About Atla →", `build.ts:552` "About Atla", `llms.txt:7` "[About]: who Atla is, the team, services and selected clients" (the page is now an argument; services are not on it) | Rename to "Why Atla"; fix the llms.txt gloss |
| D5 | Founder name: "Jose Pablo" in site copy, "José Pablo" in team, llms.txt | `siteCopy.ts:75,105,309` vs `:293`, `llms.txt:3,47` | Use the accented form everywhere |
| D6 | Two different processes. Why Atla: five steps with AI roles. How we work: four phases, no AI | `siteCopy.ts:258-281` vs `AtlaHowWeWork.tsx:57-128` | Same steps, or state how they map |
| D7 | Four offer vocabularies: Services (Audit, Brand system, Full build, Fractional brand director), Programs (Loved or Lost Diagnostic, Core/Complete/Integral, Stewardship), Hospitality (Audit, Rebranding, Branding), llms.txt (Branding Analysis, full identity engagement) | `siteCopy.ts:151-156`, `AtlaPrograms.tsx:20-79`, `AtlaHospitality.tsx:194-231`, `llms.txt:52` | JP picks the names; one list |
| D8 | Discipline names drift. Services has six (Strategy, Naming and voice, Identity, Packaging, Website and decks, Motion and campaigns). llms.txt line 8 lists others (identity design, digital design, art direction, copywriting and tone of voice); `build.ts:578` another list; brief deliverables (Naming, Identity, Packaging, Website, Motion, Campaign); work filters (Branding, Art Direction, Packaging, Website); `AtlaBrandStrategy.tsx:136` links "identity design, verbal identity, and digital design" to /services | `llms.txt:8`, `build.ts:578`, `shared/brief.ts:30`, `workFilters.tsx:12` | llms.txt line 8 and build.ts use the six names; brief and filters can stay if mapped |
| D9 | Moments are named the same in `siteCopy.ts:128-146`, `shared/brief.ts:24` and `llms.txt:25-28`. Drift only in prose: Contact meta "a launch, a raise, a growth stage or a reposition" | `siteCopy.ts:307` | Use the four names |
| D10 | Industry names differ: landings and llms.txt (Hospitality, CPG, Wellness, SaaS); brief (Hospitality, Consumer / CPG, Tech / startup, Real estate / lifestyle); filters (Hospitality, Food & Beverage, Consumer Goods, SaaS, Digital). Wellness is a landing but not a brief or filter option | `shared/brief.ts:17`, `workFilters.tsx:10` | Align or accept; add Wellness to the brief |
| D11 | Positioning words: "strategy-led" (home meta `siteSeo.ts:30`, landing metas) vs "senior-led" (About, llms.txt, Contact and About meta) | | Choose one |
| D12 | Cadence words differ: "by the month" (Services), "monthly" (Programs), "weekly seat" and "every week" (Hospitality) | rows 2, 9, 10, 15 | Remove all four |
| D13 | Counts of ways in: Hospitality "Three ways", Services "Four ways in", Programs three levels | row 16 | Remove the counts |
| D14 | WeLoveDaily outside /ventures: Privacy x3, llms.txt line 3. Allowed: `llms.txt:43`, `siteCopy.ts:334` | rows 22, 23 | |
| D15 | The CTA sentence repeats on four landings with small edits | row 42 | Say something specific per page |
| D16 | Privacy says no ad pixels except /waitlist; cookie notice says "Nothing is used for ads" | `AtlaPrivacy.tsx:46`, `AnalyticsConsent.tsx:70` | Row 67 |
| D17 | llms.txt omits live pages: Programs, Hospitality, Privacy, Terms | `llms.txt` | Add Programs and Hospitality under Studio |
| D18 | Landings point at `/contact` with "Start a project" while `/contact` itself offers "Start a project" to `/brief` (`siteCopy.ts:310`): a loop through two pages | `AtlaHospitalityBranding.tsx:34` | Point at `/brief` |

## 4. Counts and clean areas

- Defects: 68 rows (H: 14, M: 27, L: 27). Hard rule breaks (1a): 28 rows.
- Claims needing a source or JP: 20 (C1 to C20).
- Consistency findings: 18 (D1 to D18).
- Banned words found: "holistic" (`AtlaHospitality.tsx:970`), "foster" (`:1033`). None of the other 24 banned words appear in the scanned files.
- Dollar signs, price words, follower or user counts: none found.
- Em or en dashes in visible copy: none in `siteCopy.ts`, `serviceSchema.ts`, `llms.txt` or the page bodies. They sit in meta (`build.ts:626,633,681,832`, `AtlaBrandStrategy.tsx:78`, `AtlaJournal.tsx:103`) and in the brief timing options (en dash).
- Clean: header, footer, home search strings, project strings, brief prompts and options (except the en dash), done state, ventures, Services moments and discipline lines (except rows 1, 2, 49 to 51), Contact copy, 404 page.

Not in scope and not read: Journal article bodies and project case-study text, which come from Sanity.
