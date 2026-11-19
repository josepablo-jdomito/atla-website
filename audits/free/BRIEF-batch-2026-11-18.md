# Free audit batch brief (2026-11-18)
Same rules as BRIEF-batch.md (read it first; it is binding), with these changes:
- Results go to audits/free/batch-results-2026-11-18.jsonl (one JSON line per brand, same keys plus "answers":bool).
- Answers ARE available now: in Attio (load with ToolSearch "select:mcp__ad6eb7ab-b93b-44eb-9903-b26d4d802909__search-notes-by-metadata,mcp__ad6eb7ab-b93b-44eb-9903-b26d4d802909__get-note-body"), the note titled "Audit answers: <brand>" on the same person record as "Free audit: <brand>" (notes since 2026-11-12). If answers exist, one pin must answer their stated frustration (SKILL.md section 3), and triage criterion (c) applies.
- Fill cover fields thesis, lead, keep, per-pin cost, and the audit-level reference, exactly like the 2026-11-12 batch outputs (kiimento.json, drinkgeist.json).
- Do not apply the South Asia exclusion yourself; just set "pais" in the result line if you can tell the country.
- Read-only in Attio. No email, no git, no subagents, no other brands' files.
