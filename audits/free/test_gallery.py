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
