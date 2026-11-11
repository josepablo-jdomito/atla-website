from audits.free.requests import Request, load, parse_notes, save, slug_for


def free_note(note_id, brand, record_id, site, created="2026-11-11T02:12:40.754Z", name="Jane Doe", email="jane@example.com"):
    body = "\n".join([
        "New free audit request from atla.design/audit",
        "",
        f"Name: {name}",
        f"Email: {email}",
        f"Website or Instagram: {site}",
        "Source: utm_source=instagram, utm_medium=story, referrer=instagram.com",
        "Week 2026-W46: this week's 5 are taken, queued as request 85 of next week",
        f"Received: {created}",
        "Sender: new record created from the free audit. Email address not verified.",
    ])
    return {"note_id": note_id, "title": f"Free audit: {brand}", "body": body, "record_id": record_id, "created_at": created}


def answers_note(note_id, record_id, body=None):
    body = body or "\n".join([
        "What's bugging you about your brand right now?",
        "> It looks like everyone else",
        "> and it is dated",
        "Where do you want it to be a year from now?",
        "> More sales",
        "What have you already tried that didn't work?",
        "> Nothing yet",
        "Anything else you want me to know?",
        "> Hello",
        f"Request: {record_id}",
        "Received: 2026-11-11T02:13:47.317Z",
        "Sender: matched an existing record by email.",
    ])
    return {"note_id": note_id, "title": "Audit answers: Example", "body": body, "record_id": record_id, "created_at": "2026-11-11T02:13:47.317Z"}


def test_parses_free_audit_note():
    [r] = parse_notes([free_note("n1", "Example", "p1", "example.com")])
    assert (r.id, r.name, r.email, r.site) == ("n1", "Jane Doe", "jane@example.com", "example.com")
    assert r.kind == "site" and r.url == "https://example.com" and r.handle is None
    assert r.person_id == "p1" and r.note_ids == ["n1"] and r.created_at == "2026-11-11T02:12:40.754Z"


def test_attaches_answers_by_person():
    [r] = parse_notes([free_note("n1", "Example", "p1", "example.com"), answers_note("a1", "p1")])
    assert r.answers == {
        "frustration": "It looks like everyone else\nand it is dated",
        "outcome": "More sales",
        "tried": "Nothing yet",
        "anything": "Hello",
    }


def test_dedupes_same_person():
    notes = [
        free_note("n2", "Casa", "p1", "casacicheti.com", created="2026-11-12T00:00:00.000Z"),
        free_note("n1", "Cicheti", "p1", "cicheti.com", created="2026-11-11T00:00:00.000Z"),
        free_note("n3", "Other", "p2", "other.com", email="o@example.com"),
    ]
    out = parse_notes(notes)
    assert len(out) == 2
    r = next(x for x in out if x.person_id == "p1")
    assert r.note_ids == ["n1", "n2"] and r.id == "n1" and r.site == "cicheti.com"
    assert r.created_at == "2026-11-11T00:00:00.000Z" and r.kind == "site"


def test_merges_site_and_handle_into_both():
    [r] = parse_notes([free_note("n1", "A", "p1", "example.com"), free_note("n2", "B", "p1", "@my.klyr")])
    assert r.kind == "both" and r.url == "https://example.com" and r.handle == "my.klyr"


def test_no_answers_note():
    [r] = parse_notes([free_note("n1", "Example", "p1", "example.com")])
    assert r.answers == {}


def test_partial_answers_and_ignored_titles():
    body = "What have you already tried that didn't work?\n> Ads"
    notes = [free_note("n1", "E", "p1", "example.com"), answers_note("a1", "p1", body),
             {"note_id": "x", "title": "Call notes", "body": "Name: Zed", "record_id": "p9", "created_at": "2026-11-11T00:00:00Z"}]
    out = parse_notes(notes)
    assert len(out) == 1 and out[0].answers == {"tried": "Ads"}


def test_kind_detection():
    a, b, c = parse_notes([
        free_note("n1", "A", "p1", "@larebelde_coleccion"),
        free_note("n2", "B", "p2", "kiimento.com"),
        free_note("n3", "C", "p3", "https://www.instagram.com/foo/"),
    ])
    assert (a.kind, a.handle, a.url) == ("instagram", "larebelde_coleccion", None)
    assert (b.kind, b.url, b.handle) == ("site", "https://kiimento.com", None)
    assert (c.kind, c.handle) == ("instagram", "foo")


def test_slug_for():
    mk = lambda s: parse_notes([free_note("n1", "A", "p1", s)])[0]
    assert slug_for(mk("@my.klyr")) == "my-klyr"
    assert slug_for(mk("https://www.Kiimento.com/")) == "kiimento-com"


def test_save_load_roundtrip(tmp_path):
    rs = parse_notes([free_note("n1", "Example", "p1", "example.com"), answers_note("a1", "p1")])
    p = tmp_path / "requests.jsonl"
    save(p, rs)
    assert load(p) == rs
    assert load(tmp_path / "missing.jsonl") == []
