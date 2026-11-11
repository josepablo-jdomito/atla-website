import copy

from audits.free.qa import check

SOURCE = "We love craft and care.  Built for\neveryone. Since 1999. It’s ours."


def clean():
    return {
        "description": "A short look at Fixture Co, prepared by Atla.",
        "sections": [
            {"type": "cover", "id": "cover", "title": [["Fixture Co", "Review"]]},
            {"type": "pins", "id": "front-door", "label": "Front door",
             "title": [["Where Fixture Co", "meets people."]],
             "pins": [
                 {"n": 1, "quote": "WE LOVE CRAFT AND CARE", "what": "What one.", "why": "Why one.", "how": "How one."},
                 {"n": 2, "quote": "Built for everyone", "what": "What two.", "why": "Why two.", "how": "How two."},
                 {"n": 3, "quote": "It's ours", "what": "What three.", "why": "Why three.", "how": "How three."},
             ]},
            {"type": "cta", "id": "next", "text": "Want to talk it through?", "button": "Book a 25-minute conversation", "href": "https://x.test"},
        ],
    }


def pins(a):
    return a["sections"][1]["pins"]


def test_clean_audit_passes():
    assert check(clean(), SOURCE) == []


def test_quote_must_appear_in_source():
    a = clean()
    pins(a)[1]["quote"] = "Not on the site"
    errs = check(a, SOURCE)
    assert errs == ["pin 2: quote not found in source"]


def test_empty_quote_fails():
    a = clean()
    pins(a)[0]["quote"] = "  "
    assert any(e.startswith("pin 1:") and "quote" in e for e in check(a, SOURCE))


def test_exactly_three_pins():
    a = clean()
    pins(a).pop()
    assert any("exactly 3 pins" in e for e in check(a, SOURCE))
    a = clean()
    pins(a).append(copy.deepcopy(pins(a)[0]))
    assert any("exactly 3 pins" in e for e in check(a, SOURCE))


def test_no_dashes():
    for dash in ("—", "–"):
        a = clean()
        pins(a)[2]["why"] = f"Why {dash} three."
        errs = check(a, SOURCE)
        assert any(e.startswith("pin 3:") and "dash" in e for e in errs)


def test_no_emoji():
    a = clean()
    pins(a)[0]["what"] = "What \U0001F680 one."
    assert any(e.startswith("pin 1:") and "emoji" in e for e in check(a, SOURCE))


def test_banned_words():
    for word in ("a game-changer", "to elevate", "authentic voice", "next level", "synergy",
                 "leverage it", "robust", "brand audit", "a call", "conversion rate", "the CRO"):
        a = clean()
        pins(a)[0]["how"] = word
        errs = check(a, SOURCE)
        assert any(e.startswith("pin 1:") and "banned" in e for e in errs), word


def test_banned_words_whole_word_only():
    a = clean()
    pins(a)[0]["how"] = "Calling it a callback is not elevated by accident"
    errs = check(a, SOURCE)
    assert not any("call" in e and "banned" in e for e in errs)


def test_no_scarcity_claims():
    for phrase in ("One of five brands", "one of 5", "Selected for you", "five brands", "5 brands"):
        a = clean()
        a["sections"][2]["text"] = phrase
        errs = check(a, SOURCE)
        assert any("next" in e and "scarcity" in e for e in errs), phrase


def test_top_level_title_mailsubject_gate_privacy_kicker():
    a = clean()
    a["title"] = "Fixture Co Brand Audit"
    a["mailSubject"] = "Fixture Co brand audit"
    a["gate"] = {"text": "Book a call", "button": "View", "privacy": "We use conversion data"}
    a["privacy"] = "We never leverage it"
    a["sections"][0]["kicker"] = "Selected for Fixture Co"
    a["sections"][0]["readTime"] = "2 minute read"
    errs = check(a, SOURCE)
    assert "title: banned word 'Brand Audit'" in errs
    assert "mailSubject: banned word 'brand audit'" in errs
    assert "gate.text: banned word 'call'" in errs
    assert "gate.privacy: banned word 'conversion'" in errs
    assert "privacy: banned word 'leverage'" in errs
    assert "cover kicker: scarcity claim 'selected'" in errs


def test_split_title_lines_are_joined():
    a = clean()
    a["sections"][0]["title"] = [["Fixture Co", "Brand", "Audit"]]
    assert check(a, SOURCE) == ["cover title: banned word 'Brand Audit'"]


def test_skips_urls_and_ids():
    a = clean()
    a["slug"] = "selected-brand-audit"
    a["email"] = "call@x.test"
    a["sections"][2]["href"] = "https://x.test/call-synergy"
    a["sections"][1]["image"] = "call.png"
    assert check(a, SOURCE) == []


def test_labels_titles_description_and_cta_exact():
    a = clean()
    a["description"] = "Brand audit \u2014 done"
    a["sections"][1]["label"] = "Selected"
    a["sections"][1]["title"][0][1] = "synergy."
    a["sections"][2]["button"] = "Book a call"
    assert check(a, SOURCE) == [
        "description: dash found",
        "description: banned word 'Brand audit'",
        "front-door label: scarcity claim 'selected'",
        "front-door title: banned word 'synergy'",
        "next button: banned word 'call'",
    ]


def test_template_copy_is_clean():
    import json
    from pathlib import Path
    raw = (Path(__file__).parent / "template.json").read_text()
    audit = json.loads(raw.replace("{brand}", "Acme").replace("{month year}", "November 2026"))
    source = "{verbatim quote from the brand}"
    assert check(audit, source) == []


def _area_audit(area, quote=None):
    import copy, json
    from pathlib import Path
    a = json.loads((Path(__file__).parent / "fixtures" / "pins.json").read_text())
    sec = next(s for s in a["sections"] if s["type"] == "pins")
    sec["pins"][0]["quote"] = quote
    sec["pins"][0]["area"] = area
    return a


def test_area_pin_without_quote_passes():
    import json
    from pathlib import Path
    from audits.free.qa import check
    a = _area_audit("The logo sits in a stock sans serif")
    src = " ".join(p.get("quote") or "" for s in a["sections"] if s["type"] == "pins" for p in s["pins"])
    assert not [e for e in check(a, src) if "pin 1" in e]


def test_pin_with_neither_quote_nor_area_fails():
    from audits.free.qa import check
    a = _area_audit("")
    assert any("needs a quote or an area" in e for e in check(a, ""))
