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
        assert any("cta" in e and "scarcity" in e for e in errs), phrase


def test_checks_labels_titles_description_and_cta():
    a = clean()
    a["description"] = "Brand audit — done"
    a["sections"][1]["label"] = "Selected"
    a["sections"][1]["title"][0][1] = "synergy."
    a["sections"][2]["button"] = "Book a call"
    errs = check(a, SOURCE)
    assert len(errs) >= 5
