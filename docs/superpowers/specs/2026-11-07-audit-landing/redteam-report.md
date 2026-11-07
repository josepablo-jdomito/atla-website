# /audit red team report (2026-11-07)

**Verdict: not ready to launch. Three P0s: the page promises "next week's five" to an unlimited queue, one script can fill the week for everyone in one burst, and the privacy line is false now that the email may join Atla's and WeLoveDaily's lists.**

Counts: P0 3 · P1 10 · P2 16.

Target: `feat/site-v2` at 197b6ff, preview `https://atla-website-git-feat-site-v2-josepablo-jdomitos-projects.vercel.app`, tested 2026-11-07 16:00 to 16:20 UTC. Production `www.atla.design/audit` answers 404 (not launched).

What this test left behind (all under example.com, names start with RedTeam):
- One delivered request: Attio Person "RedTeam Zoë 测试" `redteam-audit@example.com`, note "Free audit: RedTeam Zoë 测试", one studio email through Resend. It took slot one of week 2026-W45 on the preview's counter (`/api/audit/status` now answers `taken: 1`).
- One feedback note on the same Person, for a submissionId that never existed.
- Nothing else was delivered. The done screen was exercised with `fetch` mocked inside the browser tab, so no request left it.

---

## P0: must fix before launch

### P0-1. "You're in next week's five" is promised to every request past five, without limit

- **What.** Every accepted request past the fifth is told it is in next week's five, and the widget tells everyone "you're first for next week". Nothing carries the overflow into next week: next Monday the counter starts at zero and the page says "This week's five are open" while the queue from last week is still waiting.
- **Evidence.** `server/audit/route.ts:164-170`: the counter is `audit:week:<isoWeek>` and `full` is simply `count > 5`; there is no next-week key. `client/src/content/siteCopy.ts:465` `done.full.title: "You're in next week's five."` and `:428` `week.full: "...Send yours now and you're first for next week."` Request twelve gets the same screen as request six. The Attio note says "request 12 of 5, this week is full, queued for next week" (`server/audit/deliver.ts:15-18`), so JP sees the overflow but the page has already promised.
- **Why it matters.** It is a false promise to the exact people the page is trying to win, from a founder who says he records every one himself. A reel that lands well can produce thirty requests in a day; twenty five of them are told they are in a five.
- **Smallest fix.** Copy only, today: `week.full` "This week's five are taken. Send yours anyway and I'll get to it after them, in the order it came in." and `done.full` title "You're on the list." line "This week's five are taken, so yours comes after them. The video comes by email as soon as it's ready." Proper fix later: INCR next week's key for overflow so next week's widget starts with the queue already taken.

### P0-2. One person or one script fills the week's five in a single burst

- **What.** The weekly counter takes a slot for every request that passes the schema. The only brakes are five posts per hashed address per ten minutes and three per email per day. Five posts with five different emails from one address fill the week in about a second; the page then says "taken" to every visitor until Monday 00:00 UTC, and every real lead is told "next week".
- **Evidence.** Limits verified live on the preview (shared store, consistent across instances): requests 1 to 5 from one address were accepted, the sixth answered `HTTP 429 {"error":"Too many requests from this address. Try again in a few minutes."}` (request 9 in the log below). Distinct emails bypass the per-email cap (`route.ts:150`, the hash is of `email.toLowerCase()`, so `a+1@`, `a+2@` are all different). The honeypot (`route.ts:122-127`) only catches a bot that fills `_gotcha`; a script that omits it is never seen. No dedupe on the brand: the same site sent five times is five slots. The Origin check is not bot protection: a script sets `origin:` itself (every test below did). There is no way for JP to give a junk slot back.
- **Why it matters.** It is the cheapest possible attack on the page's central device, it needs no skill, and it also happens by accident (a founder sends twice with two addresses, a teammate tests the form, someone types "asdf.com").
- **Smallest fix.** Count a slot once per normalized brand per week (`SET NX audit:week:<w>:brand:<brandFromSite>` before the INCR; a repeat delivers but does not take a slot) and at most one slot per hashed address per week (`SET NX audit:week:<w>:ip:<hash>`; later ones deliver as queued). Add a one-line admin release (`DECR`) JP can call after he discards a junk request.

### P0-3. The privacy line is false if the email joins a list, and the privacy policy does not cover the audit at all

- **What.** Under the button: "We use this to reply and to run your audit." JP confirmed today the email may be added to Atla's or WeLoveDaily's lists. So the line is incomplete in the one way a reader cares about. `/privacy` (fetched from the preview, "Last updated: November 6, 2026") names the brief, the brand check and the hospitality form, and never the free audit, never a marketing list, never WeLoveDaily as a recipient of a form's email.
- **Evidence.** `siteCopy.ts:453`. Privacy page sections "What we collect", "How we use information" ("to respond to inquiries, manage studio communications, and evaluate potential project opportunities"), "Third parties". Also missing from the policy: the audit's per-email hash count (`route.ts:150`), the attribution kept in session storage (`auditApi.ts:63-88`, the policy lists only the hospitality page's), the Meta Lead event on the audit (`client/src/lib/ga.ts:228-232`; the policy says the pixel records "when you finish the brief").
- **Why it matters.** Visitors from the EU and the UK need consent before marketing email; a lead form that says "to reply and run your audit" and then mails a newsletter is the textbook complaint. It also breaks the trust the assurances just built ("Am I joining a list?" was O/CO row eleven in the CRO review).
- **Smallest fix.** Line: "We use this to reply, to run your audit and, now and then, to send you news from Atla and WeLoveDaily. You can unsubscribe any time." Add a "Free audit" paragraph to `/privacy` (what is collected, Attio, Resend, the list, the counters, session storage, the Meta Lead event) and bump the date. For EEA, UK and Swiss addresses, add to a list only with an unticked opt-in, or not at all.

---

## P1: fix this week

### P1-1. The meta title is cut mid-word, and the browser and the prerender disagree on it
- **Evidence.** Prerender: `<title>Send me your brand and I'll tell you what works and what do…</title>`, same in `og:title` and `twitter:title`. Hydrated tab: "Send me your brand and I'll tell you what works and what do… \| Atla" (`SeoHead.tsx:77` appends the suffix because the truncated string no longer contains "Atla"). `formatMetaTitle` (`shared/siteSeo.ts:44-64`) drops the suffix and slices at the cap.
- **Why.** The share card in an Instagram DM or iMessage reads "what do…". It is the first line a reel viewer sees when the link is shared.
- **Fix.** `metaTitle: "Free brand audit from José Pablo"` (or any line under the cap), keep the long sentence as the H1.

### P1-2. The fifth request is told it is in next week's five on a retry
- **Evidence.** `route.ts:72` `weekOf = count >= 5 ? "full"` is used for the replay answer (`:142-143`), but a fresh request is full only when `count > 5` (`:169`). The fifth request gets "open"; if its response is lost and the client retries with the same submissionId, the replay answers "full". The client gives up after 20 s (`auditApi.ts:5`) while the server can take longer: Attio is two or three calls at 8 s each (`contact.ts`, `brief/deliver.ts`) run in parallel with Resend at 8 s, and the function is allowed 30 s (`vercel.json:7`). The existing test (`route.test.ts:139`) only checks the replay of the first request.
- **Fix.** `weekOf = count > AUDITS_PER_WEEK`, and keep the status mapping separate. Raise the client timeout to 30 s.

### P1-3. The fifth sender sees "Got it, you're in this week's five" and "This week's five are taken, send yours now" on the same screen
- **Evidence.** Reproduced in the browser with `fetch` mocked to `taken: 4` and `{ok:true, week:"open"}`: done heading "Got it." and the widget line "This week's five are taken. Send yours now and you're first for next week." (`Audit.tsx:141-145` sets the client's own +1 and the widget then shows the `full` line to the person who just sent). On desktop the widget sits in the sticky column beside the done screen.
- **Fix.** After `done`, the widget shows a sender line ("You took one of this week's five." / "You're on the list.") instead of the call to send.

### P1-4. A Upstash outage or quota burn turns every guard off and tells everyone "open"
- **Evidence.** Status failure answers `200 {"week":"open","taken":0,"cap":5}` (`route.ts:91-95`); rate limits allow on store errors (`guards.ts:62-64`); idempotency and the email cap are skipped on errors (`route.ts:145-147, 156-158`); the week INCR failure delivers with `count: 0` (`:166-169`, note reads "request 0 of 5, in this week's five"). The status endpoint has no limit at all: six rapid reads all answered 200 (log below), each one an Upstash `GET`. A loop on `/api/audit/status` spends the Upstash command budget; when Upstash starts refusing, rate limits fall open and the form takes unlimited posts, all told "this week's five".
- **Why.** "Live" plus "Updated just now" is then a fabricated reading, and the overbooking from P0-1 has no ceiling.
- **Fix.** Cache the count for five seconds in the function (or `s-maxage=5` at the edge), limit status reads per address, and on a store error answer 503 so the widget keeps its neutral line instead of "open".

### P1-5. Without JavaScript, or before hydration, the form sends the visitor's email into the URL and nothing to JP
- **Evidence.** Prerendered HTML: `<form class="audit-form" novalidate="">` with no `action` and no `method`, inputs named `site`, `name`, `email`. A browser submits it as `GET /audit?site=...&name=...&email=...`: the email lands in the address bar, history, Vercel request logs and, once the page hydrates with consent granted, in the URL Meta and Clarity read. Nothing is delivered and nothing tells the visitor.
- **Fix.** `method="post" action="/api/audit/form"` with a urlencoded handler that answers a 303 to a small result page, like `/api/contact` does (`contact.ts`, "Two request shapes"); or at minimum `method="post"` to a route that refuses, so the data never goes in a URL.

### P1-6. A feedback note can be written on any Person in Attio
- **What.** `/api/audit/feedback` accepts any `submissionId` that matches the pattern, plus any name, email and 600 characters of multi-line text, and writes a note on the Person found by that email, creating one if missing. Tested: `submissionId: "redteam-never-existed-0001"` answered `200 {"ok":true}` (log F3).
- **Why.** Anyone can attach "Audit feedback: <brand>" notes with arbitrary text (including a forged "Request: <id>" line) to a real client's record, five per address per ten minutes. The "email not verified" footer helps, but the note still sits on a client's timeline.
- **Fix.** On a delivered request, store `audit:fb:<submissionId> = sha256(email)` for 24 h; feedback is accepted only when the key exists and the email hash matches. Use `singleLine` for the text, or prefix every line with "> ".

### P1-7. The Bevel and Park Tool analyses are public one level under the new landing
- **Evidence.** `https://www.atla.design/audit/bevel/` answers 200 in production today, title "Bevel Branding Analysis · Atla" (`noindex,nofollow`); the preview serves `/audit/parktool/` the same way (`client/public/audit/bevel`, `client/public/audit/parktool`).
- **Why.** The landing promises "The video is only for you. I don't post it, and your brand doesn't end up in a reel", and the site rule is never to name Bevel or Park Tool. Anyone who edits the URL from `/audit` finds two named brand audits published.
- **Fix.** Move them to an unguessable path (or behind the branding-analysis host) and redirect the old ones to `/audit`.

### P1-8. The live region re-announces "Updated..." about twice every thirty seconds, forever
- **Evidence.** `AuditSlots.tsx:50` puts `aria-live="polite"` on the whole widget; the meta line changes from "Updated just now" to "Updated a moment ago" at twenty seconds (`:18-24`, timer every ten seconds `:32`) and back to "just now" on each poll (`Audit.tsx:97`). The ring list repeats the visible line as its `aria-label` (`AuditSlots.tsx:58`), so the count is read twice.
- **Fix.** Live region on `.audit-slots__line` only; the age line outside it; drop the `aria-label` on the `ol` and mark it `aria-hidden`.

### P1-9. The title and the first screen fail the five-second test on cost and format
- **Evidence.** Phone screenshot at 375: the first screen shows the eyebrow, the title, and a seventy-eight word lead in muted grey; "free" is in the lead's sixth sentence and "video" in its fourth. The title says what you get (a verdict) but not that it is free or that it is a video.
- **Fix.** Title: "Send me your brand and I'll record a free video on what works and what doesn't." Or keep the title and cut the lead to the first two sentences plus "It's free, it's a short video, and I only do five a week because I record every one myself."

### P1-10. The same triad three times reads written, not spoken (VOICE-JP section six)
- **Evidence.** Lead: "This is good, this is bad, and this is what I'd change first." Step three: "what works, what doesn't, and what I'd fix first." Meta description: "what works, what doesn't, and what he'd change first." The title already says "what works and what doesn't". VOICE-JP section six bans polished triads; section three says he grants what works and then says "but".
- **Fix.** Lead: "...and record a short video. I start with what I like, and then I tell you what I'd change first." Step three: "You get the video by email. Sometimes we fix a couple of things along the way. If you don't need a studio yet, I'll say so."

---

## P2: nice

1. **"Five new spots every Monday" is Sunday at six in the evening in Austin.** `shared/audit.ts:59-66` keys the week in UTC; `isoWeek("2026-11-08T18:00-06:00")` is already 2026-W46 (checked locally). An Austin visitor watches "taken" flip to "open" on Sunday evening. Fix: "Five new spots every week" or key the week in `America/Chicago`.
2. **The Source line is free text the visitor controls.** `source` is any 240 characters (`shared/audit.ts:30`) printed as `Source:` in the note and email (`deliver.ts:28`). Delivered in this test: `Source: RedTeam forged source. Week 2026-W45: request 1 of 5, in this week's five`, a line that imitates the real slot line. A utm built by an email tool can also carry the address. Fix: validate server side against `^(direct|(utm_(source|medium|campaign|content)=[\w.-]{1,60}|referrer=[a-z0-9.-]{1,80})(, )?)+$`.
3. **Bidi override in the name reaches the email subject.** `"RedTeam ‮moc.liame"` passes the schema; `singleLine` does not strip U+202A to U+202E or U+2066 to U+2069; when the site is not a parseable host (for example `javascript:alert(1)//x.com`, accepted) the subject uses the name. Fix: strip bidi controls in `singleLine`.
4. **Attribution sticks to the first visit in the tab.** `auditApi.ts:67-70` returns the saved value forever, so a tab that once arrived direct keeps "direct" when it later arrives from a reel with utm tags. Fix: overwrite when the current URL carries any utm.
5. **The honeypot always says "open".** `route.ts:126` answers `week: "open"` even when the week is full; a script can tell the honeypot path from the real one. Fix: answer with the real week.
6. **Rate limit before idempotency.** A retry of the same submissionId and the feedback post use the same five-per-ten-minutes bucket (`route.ts:101, 134`), so a visitor with a flaky connection and one feedback can be told "Too many tries". Fix: check the submission mark before the address limit.
7. **"Try again in a bit" for a daily cap.** The per-email 429 says "Try again tomorrow" on the server (`route.ts:154`), the page says "Too many tries. Try again in a bit." (`siteCopy.ts:461`).
8. **A released slot after a total failure can leave a later visitor told "full".** `route.ts:192-199`: A takes five, B takes six and is told full, A fails and gives five back. B was turned to next week with a slot free.
9. **Images are about twice the weight they need.** `step-1.webp` 245 KB, `step-2.webp` 239 KB, `step-3.webp` 125 KB (609 KB) at 800 px for slots of 280 px (phone) and 219 px (tablet), measured in the browser. Re-encoded at 560 px, q80: 116, 111 and 62 KB (289 KB). Fix: ship 560 px or a `srcset` of 400 and 560.
10. **Proof marks are eight to eleven pixels tall on a phone.** Measured at 375: Bond&Bloom 62x8, Temakase 62x10, Persona 62x11, Brick 62x11. Fix: two columns on phones, or a minimum height per mark.
11. **The client marks appear twice and the footer brings the whole site back.** The proof strip (eight marks) is followed by the `ClientLogos` band (twenty four, the same eight first) and the full footer nav (Work, Services, Brand check, Free audit linking to itself...). `PageShell.tsx:49-50`. The header was cut to one door; the footer undoes it. Fix: `PageShell logos={false}` on /audit and a slim footer on landing routes.
12. **Design system breaks in the new CSS** (`client/src/styles/site.css:1141-1233`): the pulse is an infinite ambient loop that DESIGN.md section five does not list (reduced motion is handled, `:1207`); `.audit-ask` opens with a 1px ink rule (`:1222`) where DESIGN.md allows ink only under a field and above the footer base; ring border 1.5px (`:1200`) where borders are 1px; logo opacity 0.6 (`:1149`) where only disabled controls drop opacity; a 640px breakpoint (`:1219`) outside the system's; raw sizes 8px, 22px, 88px, 64px, 120px, 280px. No hex values and no uppercase eyebrows were found. `.audit-rows` and `.audit-row` (`:1210-1212`) are unused.
13. **Three identical actions in the first screen.** "Send me your brand" is the header action, the hero action and the form title, and the submit is a fourth `site-action`; DESIGN.md section six says one action per page or form. After the send, the header still says "Send me your brand".
14. **The sticky column is taller than a laptop screen.** At 1024x768 the intro measures 825 px against 704 px of room under the header, so the hero action and the "Updated" line stay below the fold for the whole scroll.
15. **Small copy.** The skip link says "Skip to the work" on a page with no work. "It's free" appears in the lead and again in the assurances. "Thanks. That helps more than you'd think." is a cute closer JP would not say. `goToForm`'s comment says the address bar keeps the hash, but `preventDefault` stops it (`Audit.tsx:48-52`).
16. **Dark mode drawings read as negatives.** `filter: invert(1) hue-rotate(180deg)` (`site.css:1217`) works on the line art, but the eye's white and the halftone fills turn dark. Acceptable; a dark set of the three drawings would be better.

---

## Requests and responses (preview, 2026-11-07 ~16:01 to 16:06 UTC)

`U=https://atla-website-git-feat-site-v2-josepablo-jdomitos-projects.vercel.app`, every POST with `content-type: application/json`.

| # | Request | Response |
|---|---|---|
| S1-S6 | `GET $U/api/audit/status` six times in two seconds | `200`, `cache-control: no-store`, `x-vercel-cache: MISS`, `{"week":"open","taken":0,"cap":5}` each, no limit |
| 1 | `POST /api/audit`, no Origin, no Referer | `403 {"error":"Forbidden"}` |
| 2 | `POST /api/audit`, `origin: https://evil.example` | `403 {"error":"Forbidden"}` |
| 3 | `POST /api/audit`, `origin: $U`, 200 KB `source` | `413 {"message":"Bad request"}` (express default 100 KB) |
| 4 | `{"request":"x","submissionId":12}` | `400 {"error":"Invalid request"}` |
| 5 | `name` of 10 KB | `400 {"error":"Invalid request"}` |
| 6 | `{"_gotcha":"x"}` only | `200 {"ok":true,"week":"open"}` |
| 7 | RedTeam request: name `RedTeam Zoë 测试`, email `redteam-audit@example.com`, site `javascript:alert(1)//redteam.example.com`, forged `source`, id `redteam-20261107-0001` | `200 {"ok":true,"week":"open"}` in 2.1 s; status then `taken: 1` |
| 8 | Same body again | `200 {"ok":true,"week":"open"}` in 0.28 s; status still `taken: 1` (no second slot, no second delivery) |
| F1 | `POST /api/audit/feedback`, `origin: https://evil.example` | `403 {"error":"Forbidden"}` |
| F2 | Feedback `{"submissionId":"x","text":""}` | `400 {"error":"Invalid request"}` |
| F3 | Feedback for `redteam-never-existed-0001`, multi-line text with a forged `Request:` line | `200 {"ok":true}` in 1.5 s (delivered) |
| F4 | Same feedback again | `200 {"ok":true}` (deduped) |
| 9 | Sixth counted post from the address (new RedTeam id) | `429 {"error":"Too many requests from this address. Try again in a few minutes."}` |
| 10 | Honeypot while over the limit | `200 {"ok":true,"week":"open"}` |
| F5 | Feedback while over the limit | `429 {"error":"Too many requests."}` |
| F6 | Feedback with `origin: null` and `referer: $U/audit` | `400` (passes the same-site check) |

Schema checks run locally against `shared/audit.ts` (no network): `javascript:alert(1)` rejected; `javascript:alert(1)//x.com` accepted (brand falls back to the name); `@../../x` rejected; `@../../x.com` accepted (brand `@../../x.com`); `аpple.com` with a Cyrillic а accepted (brand `xn--pple-43d.com`); `https://evil.example/login?x=1` accepted; a name with U+202E accepted; `a+1@example.com` accepted as a separate address.

Page checks: prerender carries the landing header, `id="send"`, the neutral widget line (no stale count), `robots index,follow`, canonical `https://www.atla.design/audit`; `/audit` is in the sitemap; the preview's `x-robots-tag: noindex` is Vercel's preview default, nothing in `vercel.json` sets it. No digits, en or em dashes, or banned words in the rendered main content. No horizontal scroll at 375, 768, 1024 or 1280. Empty submit puts focus on the first invalid field with its error linked; the done heading takes focus after a send. Three steps sit in one row from 640. The widget never shows more than five taken: the server clamps (`route.ts:73`), the client clamps (`auditApi.ts:40`, `Audit.tsx:143`). GA4 events (`audit_view`, `audit_form_start`, `audit_submit_error`, `generate_lead`) carry only fixed strings and the submissionId, and `page_location` drops the query (`ga.ts:139-150`).

---

## Could not verify

- **Whether the preview and production share one Upstash store.** If they do, the RedTeam request already holds slot one of 2026-W45 in production. W45 ends Sunday 2026-11-08 18:00 in Austin, and production `/audit` is 404, so the effect is nil unless the page launches before then.
- **The Upstash plan and its command budget**, so how many status reads it takes to push the store into errors (P1-4) is unmeasured; the test stayed at six reads.
- **Whether the Meta Pixel has automatic advanced matching on**, which would read the email field from the form. That lives in Meta Events Manager.
- **What Clarity records from the URL** in the no-JavaScript case (P1-5); the policy says form fields are masked, not URLs.
- **The no-JavaScript submit in a real browser.** Inferred from the prerendered `<form>` (no action, no method); the pane cannot turn JavaScript off.
- **Screen reader output.** The live region finding comes from the code and the DOM, not from VoiceOver.
- **The Attio note and the studio email as JP sees them** (subject line, how the forged Source line renders); this session has no read of JP's inbox or the note.
- **The list policy in practice**: which lists, which tool, and whether EU addresses are filtered. JP's confirmation today covers that the email may join; how it joins is not in the code.

Decision: approve the P0-1 copy change and the P0-3 privacy line as written above, then fix P0-2 before launch.
