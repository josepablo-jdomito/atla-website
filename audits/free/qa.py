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


SKIP_KEYS = {"slug", "email", "href", "image", "image2", "date", "id", "type"}


def _walk(value, label, errs):
    """Apply the text rules to every user-visible string under value."""
    if isinstance(value, str):
        if not value.startswith("http"):
            errs += _text_rules(label, value)
    elif isinstance(value, list):
        if value and all(isinstance(v, str) for v in value):
            # lines of one title: also check them joined as the reader sees them
            errs += _text_rules(label, " ".join(value))
        for v in value:
            _walk(v, label, errs)
    elif isinstance(value, dict):
        for k, v in value.items():
            if k not in SKIP_KEYS:
                _walk(v, f"{label}.{k}" if label else k, errs)


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
    top = {k: v for k, v in audit.items() if k != "sections"}
    _walk(top, "", errs)

    source = _norm(source_text or "")
    for sec in audit.get("sections", []):
        kind = sec.get("type", "section")
        name = sec.get("id") or kind
        for key, v in sec.items():
            if key in SKIP_KEYS or key == "pins":
                continue
            _walk(v, f"{name} {key}", errs)
        if kind == "pins":
            pins = sec.get("pins", [])
            if len(pins) != 3:
                errs.append(f"pins: exactly 3 pins required, found {len(pins)}")
            for i, pin in enumerate(pins, 1):
                n = pin.get("n", i)
                q = _norm(pin.get("quote", "") or "")
                area = (pin.get("area") or "").strip()
                if q and q not in source:
                    errs.append(f"pin {n}: quote not found in source")
                elif not q and len(area.split()) < 4:
                    errs.append(f"pin {n}: needs a quote or an area of at least 4 words")
                for k, v in pin.items():
                    if k not in SKIP_KEYS:
                        _walk(v, f"pin {n}", errs)
    # drop duplicates, keep order
    return list(dict.fromkeys(errs))
