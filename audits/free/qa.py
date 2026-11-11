"""QA gate for free audits. check() returns a list of failures; empty means pass."""
import re

BANNED = [
    r"game[- ]changer", r"\belevate[sd]?\b", r"\bauthentic\b", r"next level",
    r"\bsynergy\b", r"\bleverag(e|ing)\b", r"\brobust\b", r"i'?m excited to share",
    r"in today'?s landscape", r"brand audit", r"\bcall\b", r"\bconversions?\b", r"\bCRO\b",
]
SCARCITY = ["one of five", "one of 5", "selected", "five brands", "5 brands"]
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]")
_BANNED = [re.compile(p, re.I) for p in BANNED]


def _norm(s: str) -> str:
    s = s.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).strip().lower()


def _strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for v in value:
            yield from _strings(v)


def _text_rules(label: str, text: str) -> list[str]:
    errs = []
    if "—" in text or "–" in text:
        errs.append(f"{label}: dash found")
    if EMOJI.search(text):
        errs.append(f"{label}: emoji found")
    for rx in _BANNED:
        m = rx.search(text)
        if m:
            errs.append(f"{label}: banned word '{m.group(0)}'")
    low = text.lower()
    for phrase in SCARCITY:
        if phrase in low:
            errs.append(f"{label}: scarcity claim '{phrase}'")
    return errs


def check(audit: dict, source_text: str) -> list[str]:
    errs: list[str] = []
    for s in _strings(audit.get("description", "")):
        errs += _text_rules("description", s)

    source = _norm(source_text or "")
    for sec in audit.get("sections", []):
        kind = sec.get("type", "section")
        name = sec.get("id") or kind
        for key in ("label", "title"):
            for s in _strings(sec.get(key, [])):
                errs += _text_rules(f"{name} {key}", s)
        if kind == "cta":
            for key in ("text", "button"):
                for s in _strings(sec.get(key, "")):
                    errs += _text_rules(f"cta {key}", s)
        if kind == "pins":
            pins = sec.get("pins", [])
            if len(pins) != 3:
                errs.append(f"pins: exactly 3 pins required, found {len(pins)}")
            for i, pin in enumerate(pins, 1):
                n = pin.get("n", i)
                q = _norm(pin.get("quote", "") or "")
                if not q:
                    errs.append(f"pin {n}: quote is empty")
                elif q not in source:
                    errs.append(f"pin {n}: quote not found in source")
                for key in ("quote", "what", "why", "how"):
                    errs += _text_rules(f"pin {n}", pin.get(key, "") or "")
    return errs
