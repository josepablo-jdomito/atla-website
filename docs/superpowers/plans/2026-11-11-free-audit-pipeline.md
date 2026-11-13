# Free Audit Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every free audit request from atla.design/audit becomes a private, Oddit-style page (real screenshot of the brand's front door with 3 numbered pins). JP approves each page in a review gallery before any email is drafted.

**Architecture:** An agent-run daily pipeline (a skill, not unattended code) with five stages: intake from Attio, capture, pin drafting, QA, and the review gallery. The deterministic pieces are scripts in the `atla-website` repo: the request model and dedupe, the `pins` section renderer in `script/build_audits.py`, the QA checker and the gallery builder. The judgment pieces live in the skill: choosing pins and triage. Pages reuse the existing `audits/<slug>.json` → `client/public/audit/<slug>/` build, which is already `noindex,nofollow`.

**Tech Stack:** Python 3 (stdlib + Pillow, already used by `build_audits.py`), pytest, Playwright (Python) for site captures, Aside browser for Instagram captures, Attio / vidIQ / Superhuman / Calendly MCP for I/O inside the skill.

**Spec:** `docs/superpowers/specs/2026-11-11-free-audit-spec.md` ( decisions 1 to 10, JP 2026-11-11).

## Global Constraints

- Every pin quotes something real and specific from the brand (copy, a post, a price, a highlight name). No specific finding means no audit for that brand (spec 4).
- Front door = what they submitted. Instagram → profile (bio, highlights, first 9 posts). Site → first screen at 1440×900, no scroll. Both → side by side (spec 3).
- Lens is brand positioning, never conversion or CRO language (spec 2).
- No copy may say or imply "one of five" or "you were selected" (spec 6). Public page copy stays «five a week».
- Pages are private: `noindex,nofollow`, reached only by `?r=<code>`, codes are 5-char `secrets` tokens, and the code→person map lives in the vault `Memory/STATE-pipeline.md`, never in GA (spec 8).
- CTA v1: one button, "Book a 20-minute conversation", linking to JP's Calendly. The word "call" never appears (spec 9).
- Copy rules from the branding-analysis skill: JP's voice, no clichés, no em or en dashes, no emojis, no claims without a source, no insults.
- Nothing is sent. The pipeline stops at Superhuman drafts; sending needs «mándalo KB-n» (spec 10, CLAUDE.md Always-Ask-Never).
- Hot lead = 2 of 3: (a) own site selling a product or service; (b) budget signal: >10k followers, physical store, funding or press; (c) answers ask for a brand change, not "more followers" (spec 7).

## Review Focus

1. Same brand submitted twice under two identifiers (`cicheti.com` and `casacicheti.com`, or a site and its @handle): expect one request, both notes linked. Test: Task 1 `test_dedupes_same_person`.
2. Submission with no "Audit answers" note (e.g. `@tierradefrutos`): expect the request to proceed with `answers = {}`, and triage criterion (c) counts as false. Test: Task 1 `test_no_answers_note`.
3. Site that blocks capture, redirects to a password page, or is a link-in-bio (linktr.ee, beacons): expect `status = "unusable"` with a reason; the request is never silently dropped. Tests: Task 2, plus Task 5 `test_every_request_appears_once`.
4. Private, deleted or misspelled Instagram handle: same as 3. Test: Task 6 dry run includes one.
5. A pin quote that does not appear in the captured text: QA fails that page, and it never reaches the gallery as "ready". Tests: Task 4 `test_quote_must_appear_in_source`, Task 5 `test_qa_failed_not_in_ready`.

---

### Task 1: Request model, Attio intake, dedupe

**Files:**
- Create: `audits/free/requests.py`
- Test: `audits/free/test_requests.py`

**Interfaces:**
- Produces: `Request` dataclass `{id: str, name: str, email: str, site: str, kind: Literal["instagram","site","both"], handle: str|None, url: str|None, answers: dict[str,str], note_ids: list[str], person_id: str, created_at: str}`; `parse_notes(notes: list[dict]) -> list[Request]` where each input is `{note_id, title, body, record_id, created_at}`; `slug_for(r: Request) -> str`; `load(path) -> list[Request]` and `save(path, list[Request])` over `audits/free/requests.jsonl`.

- [ ] Step 1: Write failing tests: `test_parses_free_audit_note` (body as produced by `formatAuditSummary` in `server/audit/deliver.ts`: lines Name, Email, Website or Instagram), `test_attaches_answers_by_person` (an "Audit answers: X" note on the same record fills keys frustration/outcome/tried/anything), `test_dedupes_same_person` (cicheti.com + casacicheti.com on one record_id → 1 Request with 2 entries in `note_ids`), `test_no_answers_note` (answers == {}), `test_kind_detection` ("@larebelde_coleccion" → instagram; "kiimento.com" → site), `test_slug_for` ("@my.klyr" → "my-klyr").
- [ ] Step 2: `pytest audits/free/test_requests.py -v` → FAIL (module missing).
- [ ] Step 3: Implement. The dedupe key is the Attio person record_id: the same person is one request, and its site/handle values merge into `kind="both"` when they differ in kind.
- [ ] Step 4: Tests pass.
- [ ] Step 5: Commit `feat(free-audit): request model and Attio note parsing`.

### Task 2: Site capture

**Files:**
- Create: `audits/free/capture.py`
- Test: `audits/free/test_capture.py`

**Interfaces:**
- Consumes: `Request.url`.
- Produces: `capture_site(url: str, out_dir: Path) -> Capture`, where `Capture = {status: Literal["ok","unusable"], reason: str|None, image: str|None, text: str}`. Playwright screenshot at 1440×900, cookie banners dismissed by a selector list, `text` = visible text of the first screen. Writes `<out_dir>/front-site.png`. Instagram capture runs in the skill via Aside (Task 6) and writes `front-ig.png` + `ig.json` (`{bio, highlights[], captions[9], followers}`) to the same folder.
- [ ] Step 1: Failing tests against a local `http.server` fixture: `test_capture_ok_returns_text_and_png`, `test_link_in_bio_is_unusable` (host in `{"linktr.ee","beacons.ai","lnk.bio"}`), `test_password_page_is_unusable` (redirect to `/password`), `test_timeout_is_unusable` (reason "timeout" after 20 s).
- [ ] Step 2: Run → FAIL.
- [ ] Step 3: Implement.
- [ ] Step 4: Pass.
- [ ] Step 5: Commit `feat(free-audit): first-screen site capture`.

### Task 3: `pins` and `cta` section renderers

**Files:**
- Modify: `script/build_audits.py` (add `r_pins`, `r_cta`, register both in `RENDER`)
- Modify: `client/public/audit/audit.css` (pin markers, callouts, mobile stacking)
- Create: `audits/free/template.json` (cover + pins + cta)
- Test: `audits/free/test_render_pins.py`

**Interfaces:**
- Produces: section `{"type":"pins","id":"front-door","label":str,"title":[[...]],"image":str,"image2":str|None,"pins":[{"n":1,"on":1,"x":0..1,"y":0..1,"quote":str,"what":str,"why":str,"how":str}]}`, and section `{"type":"cta","id":"next","text":str,"button":"Book a 20-minute conversation","href":CALENDLY_URL}`. With `image2`, both screenshots render side by side and `on` picks the image.
- [ ] Step 1: Failing tests: `test_renders_three_numbered_pins` (3 `.pin` elements at the given left/top percentages), `test_quote_is_escaped_verbatim`, `test_side_by_side_when_image2`, `test_page_has_no_word_call` (`\bcall\b`, case-insensitive, absent from the whole page), `test_page_is_noindex`.
- [ ] Step 2: Run → FAIL.
- [ ] Step 3: Implement. Read `CALENDLY_URL` from JP's live Calendly event type via the Calendly MCP; never guess it.
- [ ] Step 4: Pass, then `python3 script/build_audits.py <test-slug>` and preview with the `atla-audit` launch config on desktop and on the mobile preset.
- [ ] Step 5: Commit `feat(audit): pins and cta sections for free audits`.

### Task 4: QA checker

**Files:**
- Create: `audits/free/qa.py`
- Test: `audits/free/test_qa.py`

**Interfaces:**
- Consumes: an audit JSON (Task 3 shape) and the capture text (`Capture.text` + `ig.json`, joined).
- Produces: `check(audit: dict, source_text: str) -> list[str]` (empty = pass). Rules: exactly 3 pins; each `quote` appears in `source_text` (whitespace- and case-normalized); no `—` or `–`; no emoji; no banned words (the list in the vault's `Memory/FILTRO-CALIDAD.md` plus "game-changer, elevate, authentic, next level, synergy, leverage, robust, conversion, CRO"); no "one of five", "selected" or "five brands" anywhere.
- [ ] Step 1: Failing tests, one per rule (`test_quote_must_appear_in_source`, `test_exactly_three_pins`, `test_no_dashes`, `test_no_emoji`, `test_banned_words`, `test_no_scarcity_claims`) plus `test_clean_audit_passes`.
- [ ] Step 2: Run → FAIL. Step 3: Implement. Step 4: Pass.
- [ ] Step 5: Commit `feat(free-audit): QA checker`.

### Task 5: Review gallery

**Files:**
- Create: `audits/free/gallery.py` (writes `audits/free/out/review-<date>.html`; `out/` is gitignored and never deployed)
- Test: `audits/free/test_gallery.py`

**Interfaces:**
- Consumes: per request: `Request`, its audit JSON or `None`, `qa.check` result, `hot: bool`, `status`/`reason`.
- Produces: `build_gallery(items, out_path) -> Path`. One card per brand, readable in about 30 seconds: screenshot with pins, the 3 pins as text, hot-lead badge, QA status. Hot leads first, then oldest. Unusable, `no_finding` and QA-failed items are listed under "Not sent" with their reason. Each card has Sí/No buttons, plus one "Export decisions" button that downloads `decisions-<date>.json` (`{slug: "si"|"no"}`) for the skill to read back.
- [ ] Step 1: Failing tests: `test_hot_leads_first`, `test_qa_failed_not_in_ready`, `test_unusable_listed_with_reason`, `test_every_request_appears_once` (ready + not sent == input count).
- [ ] Step 2: Run → FAIL. Step 3: Implement. Step 4: Pass.
- [ ] Step 5: Commit `feat(free-audit): review gallery`.

### Task 6: `free-audit` skill (orchestration)

**Files:**
- Create: `~/.claude/skills/free-audit/SKILL.md`

**Interfaces:**
- Consumes: Tasks 1 to 5.
- Trigger: JP says «free audits». Run order: (1) Attio `search-notes-by-metadata` since the last run → `parse_notes` → `requests.jsonl`. (2) Capture: sites with `capture.py`; Instagram with Aside (open the profile in JP's browser, screenshot, read the bio, highlight names and 9 captions) and `vidiq_ig_profile` for the follower count. (3) Draft 3 pins per brand under the Global Constraints; one pin answers their stated frustration when `answers` exist; no specific finding → `no_finding`. (4) `qa.check`; one redraft, then fail. (5) Triage with the 2-of-3 rule. (6) Build the pages and the gallery and show JP the gallery. (7) For each Sí: generate the `?r=` code, append it to STATE-pipeline, write a Superhuman draft (`create_or_update_draft`, `to` taken from the Attio person), add an Attio note "Free audit drafted: <brand>", and create one Kanban card per batch (`code:free-audit:<date>`). Hot leads also get a card for Andrés. (8) Fail loud: report counts for received, captured, unusable, no_finding, QA-failed, ready, Sí and No.
- [ ] Step 1: Write the skill.
- [ ] Step 2: Dry run on 3 real requests from 2026-11-10/11: one site (`kiimento.com`), one Instagram (`@drinkgeist`), and one that should come out unusable or "both". Expect 3 gallery entries (ready or "Not sent" with a reason) and zero emails sent.
- [ ] Step 3: Run `python3 Memory/filtro-calidad.py <pins file> --tipo texto` from the vault on each pin set; fix every NO PASA.
- [ ] Step 4: Commit the skill to the vault and push (vault rule).

### Task 7: Ship

- [ ] Branch from `main`, open a PR with Tasks 1 to 5, wait for the Vercel check. Merge only after JP's «mándalo» on the 3 dry-run pages.
- [ ] Verify live on `https://www.atla.design/audit/<slug>?r=test`: status 200, `noindex` present, 0 broken images, the CTA opens Calendly.
- [ ] Kanban: move `code:free-audit-workflow:1` to Hecho with the PR link as proof.
