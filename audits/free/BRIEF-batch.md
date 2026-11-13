# Free audit batch brief (2026-11-12)
Repo worktree: /Users/josepablo/Projects/atla-website/.claude/worktrees/free-audit. Python venv: .venv-audit/bin/python.
Binding rules: ~/.claude/skills/free-audit/SKILL.md (sections 2 to 4 and 3b). Reference outputs: audits/free/kiimento.json and audits/free/drinkgeist.json (copy their structure exactly; start from audits/free/template.json).

For EACH brand in your list:
1. Slug: lowercase brand without @ / TLD, non-alnum -> "-".
2. Capture into audits/free/shots/<slug>/:
   - Instagram: get bio, followers and recent captions with the vidiq_ig_profile / vidiq_ig_profile_reels tools (load via ToolSearch "vidiq ig"); save as ig-text.txt. Screenshot the profile with Playwright (.venv-audit, 1440x900, https://www.instagram.com/<handle>/) to front-ig.png; if a login wall covers it, still save it and describe only what is visible. If the bio links an own website (not linktree), also capture it with audits.free.capture.capture_site(url, dir) -> front-site.png + site-text.txt.
   - Site: capture already exists (front-site.png, site-text.txt) unless noted; also look up the brand's Instagram via vidiq if findable.
3. Write audits/free/<slug>.json with exactly 3 pins. Quotes must be VERBATIM from the saved text files. Lens: positioning + visual identity, "why them and not the one next door". Never pin conversion (buttons, checkout, speed, popups) or discounts. Banned words: generic, consistent, elevate, cohesive, modern, clean, premium. No em/en dashes, no emojis, no "call", no scarcity. "Branding Analysis", never "Brand Audit". CTA href = https://www.atla.design/waitlist?utm_source=free-audit&utm_campaign=<slug>.
4. QA: .venv-audit/bin/python -c "import json;from audits.free import qa;print(qa.check(json.load(open('audits/free/<slug>.json')),open(<all text files joined>).read()))". Fix and retry once; if still failing, status qa_failed.
5. If unusable (dead site, private/empty IG, link-in-bio only, no real finding with a real quote): no JSON; status unusable/no_finding with reason.
6. Build ready ones: .venv-audit/bin/python script/build_audits.py <slug>.
7. Triage hot lead = 2 of 3: own site selling product/service; >10k followers or physical store/press; (answers not available, ignore c).
Do NOT git commit, push, email, or touch other brands' files. Do not spawn subagents.
Append one JSON line per brand to audits/free/batch-results.jsonl: {"marca","slug","status":"ready|unusable|no_finding|qa_failed","reason","hot":bool,"followers"}.
Return only counts and any failures.
