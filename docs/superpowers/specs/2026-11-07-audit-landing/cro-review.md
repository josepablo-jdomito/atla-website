# /audit landing: CRO review (CRE Methodology)

**Finding: the page scores 3/10. A visitor from a reel can't tell in five seconds that this is JP or what he gets. Nothing answers the two fears his own audience has: "my brand ends up in a reel" and "free means a catch".** Every fix that matters can be pasted today. None of them needs a new asset.

Sources read on 2026-11-07: `client/src/content/siteCopy.ts` (`audit` block), `client/src/pages/Audit.tsx`, `client/src/components/audit/AuditSlots.tsx`, `client/src/components/site/PageShell.tsx` + `ClientLogos.tsx`, `VOICE-JP.md` sections 3 to 6, and the live preview (`curl` of `atla-website-git-feat-site-v2-...vercel.app/audit`, HTTP 200, 22.6 KB).

What the live page says, in reading order: nav with a **"Start a project"** button, then the title "We all need an extra pair of eyes.", then the lead, then the widget ("Five spots a week, in the order they come in." / "Five new spots every Monday"), then three drawn steps, then the form (three fields), then "It's free. I only do five a week.", the privacy line and "Send it". The client logo band comes after that, just above the footer.

---

## 1. Score: 3/10 (2.8)

| Quick Diagnostic row | Pass? | Why |
|---|---|---|
| One action visitors should take | **Yes** (1.4) | One form, three fields. Caveat: the header "Start a project" button is a second CTA to a much bigger commitment. |
| Researched why visitors don't convert | **No** | The offer is new. No exit survey, no post-submit question, no DM log mined. |
| O/CO table | **No** | Two counters exist by accident ("I record every one myself", "If you don't need a studio yet, I'll say so"). The second is buried in step three. |
| Value prop clear in five seconds | **No** | The title is a feeling, not an offer. The page body never says who "me" is: JP's name appears only in the meta description. The offer (video, free, five a week) starts in sentence two of the lead. |
| Persuasion assets visible | **No** | No face, no sample, no testimonial. The one asset that exists, the client logo band, renders *below* the form, after the decision. |
| Funnel mapped | **No** | GA4 fires only `audit_complete`. There's no event for page view to form start to submit, and no reel UTM, so the drop-off point can't be found. |
| Path free of UX blockers | **Yes** (1.4) | Three fields, prerendered, a polite live region, errors that keep the draft. |

Failing rows: **research, O/CO, five-second clarity, proof, funnel.**

---

## 2. O/CO table

Visitor: a founder or CMO with a live brand who just watched JP break down a brand he doesn't work for.

| # | Objection (the visitor's words) | Counter (true, specific) | CO-only? | Where |
|---|---|---|---|---|
| 1 | **Trust:** "Who is 'me'? Is this the guy from the reels?" | Name and role before the title, and a lead that ties the page to the reels. | No, say it plainly | **Above the title** (eyebrow) + **in the lead** |
| 2 | **Trust:** "Does he know what he's doing?" | Real client marks, moved up from the footer. Later: a sample clip. | Yes, show it, don't claim it | **Above the form** (a short logo strip) |
| 3 | **Price:** "Free sounds like a funnel. Where's the catch?" (JP's audience) | Say why he does it and what happens if you don't hire Atla. "If you don't need a studio yet, I'll say so" moves to the decision point. | Yes, never write "no catch" | **Under the submit button** |
| 4 | **"My brand becomes content."** (JP's audience; the strongest one, since the visitor just watched a roast) | The video is private and never posted. **JP must confirm this is the policy before it ships.** | Half: state the promise, not the fear | **Under the submit button** + **step two caption** |
| 5 | **Fit:** "Is my brand big enough, or the right kind?" | Any brand that's live counts. The imagined founder says "hey, something is off". | No | **Above the form** (under "Send me your brand") |
| 6 | **Timing:** "When do I get it? Why now?" | The week's cap is real, and it resets Monday. Say when the video arrives. **JP must confirm the delivery window.** | No | **Beside the widget** + done screen |
| 7 | **Effort:** "Do I need a call, a deck, a brief?" | Nothing to prepare, no call. | No | **Under the submit button** |
| 8 | **Tone:** "Will he be harsh with me?" | He starts with what works, then the "but". That's how he already talks (VOICE-JP section 3.9). | Yes | **Step two caption** |
| 9 | **Vagueness:** "What are 'a couple of the fixes'?" | Name one or two kinds of fix the team actually does. **JP confirms which.** | No | **Step three caption** |
| 10 | **Is the counter real?** "Live" + rings can read as theater. | The reason sits next to the number ("I record every one myself"), and the count is never faked. | Yes | **Beside the widget** |
| 11 | **Spam:** "Am I joining a list?" | The email is used for the video only. **JP must confirm WLD and Atla lists don't pull from it.** | No | **Under the submit button** (replaces the privacy line, keeps the link) |

---

## 3. Ranked changes (ICE: Impact, Confidence, Ease, 1 to 10, average)

### (a) No new asset needed

| Rank | Change | I | C | E | ICE |
|---|---|---|---|---|---|
| 1 | New title that states the offer; JP's line moves to the start of the lead (test vs current) | 9 | 7 | 9 | **8.3** |
| 2 | Name JP above the title, and a lead that bridges from the reels | 8 | 8 | 9 | **8.3** |
| 3 | Private-video promise under the submit button (O/CO 4) | 8 | 7 | 10 | **8.3** |
| 4 | Replace the duplicate "It's free. I only do five a week." with the catch, effort and privacy lines (O/CO 3, 7, 11) | 7 | 7 | 10 | **8.0** |
| 5 | Exit survey + post-submit question (fixes the research row) | 6 | 9 | 7 | **7.3** |
| 6 | Fit line above the form with the imagined founder (O/CO 5) | 5 | 6 | 10 | **7.0** |
| 7 | Short strip of existing client marks above the form, not only above the footer (O/CO 2) | 6 | 7 | 8 | **7.0** |
| 8 | Step captions: tone (step two), concrete fixes (step three) (O/CO 8, 9) | 6 | 6 | 9 | **7.0** |
| 9 | Delivery window beside the widget and on the done screen (O/CO 6) | 5 | 6 | 10 | **7.0** |
| 10 | Funnel events: `audit_view`, `audit_form_start`, `audit_submit_error` + `utm_source=ig&utm_content=<reel>` on the bio link | 5 | 8 | 7 | **6.7** |
| 11 | Empty-state copy for the counter (section 5) | 5 | 6 | 9 | **6.7** |
| 12 | On /audit only, the header button points to `#send` with "Send me your brand" instead of "Start a project" | 4 | 6 | 7 | **5.7** |

Ship 1 to 4 together as one variant and A/B them against the current page. That bold change is the one worth the traffic; a single swapped line isn't.

### (b) Needs an asset from JP

| Rank | Asset | Exact ask | Where it goes | I | C | E | ICE |
|---|---|---|---|---|---|---|---|
| 1 | **Sample clip** | "Record the audit on Sexto Abismo or TigreTigre, a brand we own, so nobody's permission is needed. Thirty to forty five seconds, the first 'what I'd change' point, vertical, same setup as the real ones." | Replaces the step two drawing, or sits beside the lead on wide screens | 9 | 8 | 6 | **7.7** |
| 2 | **Photo of JP** | "One vertical photo, or a still from a reel, of you looking at a phone or laptop with a brand on screen. Same light as the reels, so the visitor recognizes you." | Beside the title (wide), above the title under the eyebrow (mobile) | 8 | 7 | 7 | **7.3** |
| 3 | **First testimonials** | After each of the first five videos ships, one email from JP: "What did you change after the video? Can I put your name, your brand and that line on the page?" Use only the yeses. | Above the form, and one directly under the submit button against O/CO 3 | 8 | 7 | 4 | **6.3** |
| 4 | **Before/after of one fix** | "Two screenshots of one fix the team did, before and after, from an owned brand or a founder who said yes in writing." | Step three, replacing the drawing | 7 | 7 | 5 | **6.3** |

The sample clip comes first. It counters trust (1, 2), tone (8), vagueness (9) and "is it really him" all at once, and the owned-brand version removes the permission problem.

---

## 4. Copy, ready to paste

Every line below: English, JP's first person, no digits, no em or en dashes, none of the banned words. Lines marked **[confirm]** state a policy JP has to approve as true before they ship.

### Five-second test: the current title fails

"We all need an extra pair of eyes." is JP's own line and it's true, but it tells a cold eye three things are missing: who is offering, what you get, and that it costs nothing. A visitor from a reel decides in the first screen whether this is "the guy from the reels doing that to my brand". Keep JP's line, but move it to where it works, as the first sentence of the lead.

**Eyebrow (above the title)**
> José Pablo, founder of Atla

**Title (variant B; current stays as control)**
> Send me your brand and I'll tell you what I'd change.

**Lead**
> We all need an extra pair of eyes. You're too close to your brand, and attached to it. On Instagram I break down brands I don't work for. This one I do for you: I look at it the way a customer does, record a short video with what I'd change, in order, and my team does a couple of the fixes. It's free. I only do five a week because I record every one myself.

### Beside the widget (timing) [confirm the window]
> You get your video the same week you send it.

### Step captions
Step two (tone, O/CO 8):
> I look at it the way a customer does. I start with what I like, but then I tell you what I'd change, in order.

Step three (vagueness, O/CO 9) [confirm which fixes the team does]:
> You get the video and my team does a couple of the fixes, like the first line of your homepage or your Instagram bio. If you don't need a studio yet, I'll say so.

### Above the form, under "Send me your brand" (fit, O/CO 5)
> Any brand that's live works: a shop, a restaurant, a product, an app. If you look at it and say, hey, something is off but I don't know what, send it.

### Under the submit button (replaces `terms` and `privacyNotice`)
Line one (O/CO 4) [confirm]:
> The video is only for you. I don't post it, and your brand doesn't end up in a reel.

Line two (O/CO 3, CO-only):
> I think a few of you will want to work with Atla later. Most won't, and that's all right.

Line three (O/CO 7 + 11) [confirm the list policy]:
> No call, nothing to prepare. I only use your email to send you the video. Privacy

### Done screen
Open week [confirm the window]:
> **Got it.** You're in this week's five. The video comes by email this week, from me.

Full week (unchanged in substance):
> **You're in next week's five.** This week's are taken. The video comes by email next week.

### Header on /audit only
> Send me your brand

---

## 5. The live counter on launch day

CRE allows scarcity only when it's genuine, and it treats social proof as a number you can show. Five empty rings with a pulsing "Live" fail on both counts. The cap is real, but the widget's visual weight puts the zero on display, and to a skeptic "Live" plus nothing taken reads as no demand or as theater. The methodology says don't fake a count. Change what the empty state *says* instead: frame zero as availability and tie it to the reason for the cap. Draw the rings filled-to-taken only once at least one spot is taken. Once a full week has shipped, add the one piece of real proof the counter can carry, last week's five done. Empty-state copy (taken = zero), replacing "Five of five spots left this week.":

> This week's five are open. I record them in the order they come in.

From the second week, when it's true, as the meta line:

> Last week's five got their videos.

---

## 6. Surveys, verbatim

**Exit survey** (one open field. Desktop: on exit intent. Mobile: after forty five seconds on the page with no field touched. Once per visitor):
> What stopped you from sending me your brand today?

**Post-submit survey** (one optional field on the done screen, under the line):
> What almost stopped you from sending it?

Read the first fifty answers of each before the next round of copy. Those answers replace the guessed rows 5 to 11 in the O/CO table.

---

Decision for JP: approve the private-video promise as policy ("I don't post it, and your brand doesn't end up in a reel"). Changes 1 to 4 ship as one test variant once it's a yes.
