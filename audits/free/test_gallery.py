import re
from pathlib import Path

from audits.free.gallery import build_gallery
from audits.free.requests import Request

PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489"
    "0000000d49444154789c6360000002000001e221bc330000000049454e44ae426082"
)


def audit(brand="Fixture Co"):
    return {"brand": brand, "sections": [
        {"type": "cover", "id": "cover"},
        {"type": "pins", "id": "front-door", "image": "site.png", "image2": None, "pins": [
            {"n": i, "on": 1, "x": 0.2 * i, "y": 0.3, "quote": f"Quote <{i}>", "what": f"What {i}",
             "why": f"Why {i}", "how": f"How {i}"} for i in (1, 2, 3)]},
    ]}


def item(tmp_path, rid, name, created, status="ready", hot=False, qa=None, reason=None, has_audit=True, answers=None):
    (tmp_path / "site.png").write_bytes(PNG)
    r = Request(id=rid, name=name, email=f"{rid}@secret.test", site=f"{rid}.com", kind="site", handle=None,
                url=f"https://{rid}.com", answers=answers or {}, created_at=created)
    return {"request": r, "slug": rid, "audit": audit(name) if has_audit else None, "qa": qa or [],
            "hot": hot, "status": status, "reason": reason, "image_dir": str(tmp_path)}


def build(tmp_path, items):
    out = build_gallery(items, tmp_path / "out" / "review.html", date="2026-11-11")
    return Path(out).read_text()


def test_hot_leads_first(tmp_path):
    html = build(tmp_path, [item(tmp_path, "old", "Old", "2026-01-01"),
                            item(tmp_path, "hot", "Hot", "2026-03-01", hot=True),
                            item(tmp_path, "new", "New", "2026-02-01")])
    ready = html.split('id="ready"')[1]
    assert ready.index('data-slug="hot"') < ready.index('data-slug="old"') < ready.index('data-slug="new"')


def test_qa_failed_not_in_ready(tmp_path):
    html = build(tmp_path, [item(tmp_path, "ok", "Ok", "2026-01-01"),
                            item(tmp_path, "bad", "Bad", "2026-01-02", status="qa_failed", qa=["quote not found"])])
    ready, notsent = html.split('id="notsent"')
    assert 'data-slug="bad"' not in ready and 'data-slug="bad"' in notsent
    # status ready but qa non-empty also not ready
    html = build(tmp_path, [item(tmp_path, "x", "X", "2026-01-01", qa=["em dash"])])
    assert 'data-slug="x"' in html.split('id="notsent"')[1]


def test_unusable_listed_with_reason(tmp_path):
    html = build(tmp_path, [item(tmp_path, "u", "U", "2026-01-01", status="unusable", reason="Link in bio page", has_audit=False)])
    assert "Link in bio page" in html.split('id="notsent"')[1]


def test_every_request_appears_once(tmp_path):
    items = [item(tmp_path, "a", "A", "1"), item(tmp_path, "b", "B", "2", status="unusable", reason="r", has_audit=False),
             item(tmp_path, "c", "C", "3", status="no_finding", reason="nothing", has_audit=False),
             item(tmp_path, "d", "D", "4", status="qa_failed", qa=["x"])]
    html = build(tmp_path, items)
    assert len(re.findall(r'<article[^>]*data-slug=', html)) == 4
    for i in "abcd":
        assert html.count(f'data-slug="{i}"') == 1


def test_escapes_embeds_and_hides_email(tmp_path):
    html = build(tmp_path, [item(tmp_path, "a", "A", "1", answers={"frustration": "<script>x</script> hate it"})])
    assert "<script>x</script>" not in html and "&lt;script&gt;x" in html
    assert "Quote &lt;1&gt;" in html
    assert "data:image/png;base64," in html
    assert "secret.test" not in html
    assert "left:20.0%" in html
    assert 'const D="2026-11-11"' in html and "'decisions-'+D" in html


def _notsent_reason(tmp_path, it, reason):
    html = build(tmp_path, [it])
    ready, notsent = html.split('id="notsent"')
    assert 'data-slug="' + it["slug"] + '"' not in ready
    assert reason in notsent


def test_ready_without_audit_or_pins_goes_not_sent(tmp_path):
    _notsent_reason(tmp_path, item(tmp_path, "n", "N", "1", has_audit=False), "sin pines")
    it = item(tmp_path, "p", "P", "1")
    it["audit"]["sections"] = [{"type": "cover", "id": "cover"}]
    _notsent_reason(tmp_path, it, "sin pines")


def test_ready_without_screenshot_goes_not_sent(tmp_path):
    it = item(tmp_path, "s", "S", "1")
    (tmp_path / "site.png").unlink()
    _notsent_reason(tmp_path, it, "sin captura")
    it = item(tmp_path, "t", "T", "1")
    it["audit"]["sections"][1]["image"] = None
    _notsent_reason(tmp_path, it, "sin captura")


def test_invalid_pins_do_not_crash_gallery(tmp_path):
    good = item(tmp_path, "g", "G", "1")
    bad = item(tmp_path, "b", "B", "2")
    del bad["audit"]["sections"][1]["pins"][0]["x"]
    bad2 = item(tmp_path, "b2", "B2", "3")
    bad2["audit"]["sections"][1]["pins"][0]["on"] = "zzz"
    html = build(tmp_path, [good, bad, bad2])
    ready, notsent = html.split('id="notsent"')
    assert 'data-slug="g"' in ready
    assert notsent.count("pines inválidos") == 2


def test_decisions_persist_and_warn(tmp_path):
    html = build(tmp_path, [item(tmp_path, "a", "A", "1")])
    assert "localStorage" in html and "'decisions-'+D" in html
    assert "beforeunload" in html
    assert "Decisiones guardadas en este navegador" in html
    assert "No se pueden guardar: exporta antes de cerrar" in html
