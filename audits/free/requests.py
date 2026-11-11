"""Free-audit requests: parsed from Attio notes, one Request per Attio person."""
from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Literal

FREE_PREFIX = "Free audit:"
ANSWERS_PREFIX = "Audit answers:"

QUESTION_KEYS = (
    ("What's bugging you", "frustration"),
    ("Where do you want it", "outcome"),
    ("What have you already tried", "tried"),
    ("Anything else", "anything"),
)


@dataclass
class Request:
    id: str
    name: str
    email: str
    site: str
    kind: Literal["instagram", "site", "both"]
    handle: str | None
    url: str | None
    answers: dict[str, str] = field(default_factory=dict)
    note_ids: list[str] = field(default_factory=list)
    person_id: str = ""
    created_at: str = ""


def _field(body: str, label: str) -> str:
    m = re.search(rf"^{re.escape(label)}:[ \t]*(.*)$", body, re.M)
    return m.group(1).strip() if m else ""


def classify(site: str) -> tuple[Literal["instagram", "site"], str | None, str | None]:
    """Return (kind, handle without '@', normalized https url) for a bare domain, URL or @handle."""
    s = site.strip()
    if s.startswith("@"):
        return "instagram", s[1:].strip().lower() or None, None
    m = re.match(r"(?i)^(?:https?://)?(?:www\.)?instagram\.com/@?([^/?#\s]+)", s)
    if m:
        return "instagram", m.group(1).lower(), None
    url = s if re.match(r"(?i)^https?://", s) else f"https://{s}" if s else None
    return "site", None, url


def _parse_answers(body: str) -> dict[str, str]:
    out: dict[str, list[str]] = {}
    key: str | None = None
    for line in body.splitlines():
        if line.startswith(">"):
            if key:
                out[key].append(line[1:].lstrip())
            continue
        key = None
        for prefix, k in QUESTION_KEYS:
            if line.startswith(prefix):
                key = k
                out.setdefault(k, [])
                break
    return {k: "\n".join(v).strip() for k, v in out.items() if "\n".join(v).strip()}


def parse_notes(notes: list[dict]) -> list[Request]:
    free = sorted(
        (n for n in notes if n.get("title", "").startswith(FREE_PREFIX)),
        key=lambda n: n.get("created_at", ""),
    )
    by_person: dict[str, Request] = {}
    for n in free:
        body = n.get("body", "")
        pid = n.get("record_id") or n["note_id"]
        kind, handle, url = classify(_field(body, "Website or Instagram"))
        site = _field(body, "Website or Instagram")
        r = by_person.get(pid)
        if r is None:
            by_person[pid] = Request(
                id=n["note_id"], name=_field(body, "Name"), email=_field(body, "Email"),
                site=site, kind=kind, handle=handle, url=url, note_ids=[n["note_id"]],
                person_id=pid, created_at=n.get("created_at", ""),
            )
            continue
        r.note_ids.append(n["note_id"])
        r.name = r.name or _field(body, "Name")
        r.email = r.email or _field(body, "Email")
        r.handle = r.handle or handle
        r.url = r.url or url
        r.site = r.site or site
        if r.handle and r.url:
            r.kind = "both"
    answers = sorted(
        (n for n in notes if n.get("title", "").startswith(ANSWERS_PREFIX)),
        key=lambda n: n.get("created_at", ""),
    )
    for n in answers:
        r = by_person.get(n.get("record_id", ""))
        if r:
            r.answers.update(_parse_answers(n.get("body", "")))
    return list(by_person.values())


def slug_for(r: Request) -> str:
    if r.url:
        base = re.sub(r"(?i)^https?://(www\.)?", "", r.url).split("/")[0]
    else:
        base = r.handle or r.site
    return re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-")


def load(path) -> list[Request]:
    p = Path(path)
    if not p.exists():
        return []
    return [Request(**json.loads(line)) for line in p.read_text().splitlines() if line.strip()]


def save(path, requests: list[Request]) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text("".join(json.dumps(asdict(r), ensure_ascii=False) + "\n" for r in requests))
