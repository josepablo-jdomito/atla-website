import importlib.util
from pathlib import Path

import pytest

from audits.free.publish import publish_free_shots, referenced_shot_names

ROOT = Path(__file__).resolve().parents[2]


def _build_audits():
    spec = importlib.util.spec_from_file_location("build_audits", ROOT / "script" / "build_audits.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_build_stops_before_rewriting_html_when_a_shot_is_missing(tmp_path, monkeypatch):
    pytest.importorskip("uharfbuzz")
    ba = _build_audits()
    monkeypatch.setattr(ba, "OUT", tmp_path / "public")
    monkeypatch.setattr(ba, "SHOTS", tmp_path / "shots")
    with pytest.raises(SystemExit, match="front-ig.png"):
        ba.build("balsa-mx", None)
    assert not (tmp_path / "public" / "balsa-mx-ct8mscbl5wlv" / "index.html").exists()


def _audit():
    return {
        "markImg": "logo.png",
        "sections": [
            {"type": "memo", "image": "front-site.png", "image2": "front-ig.png"},
            {"type": "gallery", "items": [{"src": "extra.png"}, {"src": "/audit/landing/x.webp"}]},
            {"type": "memo", "image": "../secrets.png", "image2": "front-site.png"},
        ],
    }


def test_referenced_names_are_bare_files_only():
    assert referenced_shot_names(_audit()) == ["logo.png", "front-site.png", "front-ig.png", "extra.png"]


def test_publish_copies_only_referenced_shots(tmp_path):
    shots = tmp_path / "shots" / "brand"
    shots.mkdir(parents=True)
    (shots / "front-site.png").write_bytes(b"site")
    (shots / "front-ig.png").write_bytes(b"ig")
    (shots / "not-used.png").write_bytes(b"nope")
    out = tmp_path / "public"
    copied, missing = publish_free_shots(
        "brand", "brand-abc", {"sections": [{"image": "front-site.png", "image2": "front-ig.png"}]}, shots.parent, out
    )
    assert copied == ["front-site.png", "front-ig.png"]
    assert missing == []
    assert (out / "brand-abc" / "img" / "front-site.png").read_bytes() == b"site"
    assert (out / "brand-abc" / "img" / "front-ig.png").read_bytes() == b"ig"
    assert not (out / "brand-abc" / "img" / "not-used.png").exists()


def test_missing_shot_is_reported_and_existing_public_file_is_kept(tmp_path):
    shots = tmp_path / "shots" / "brand"
    shots.mkdir(parents=True)
    (shots / "front-site.png").write_bytes(b"new")
    dest = tmp_path / "public" / "brand-abc" / "img"
    dest.mkdir(parents=True)
    (dest / "front-ig.png").write_bytes(b"already")
    copied, missing = publish_free_shots(
        "brand",
        "brand-abc",
        {"sections": [{"image": "front-site.png", "image2": "front-ig.png"}, {"image": "gone.png"}]},
        shots.parent,
        tmp_path / "public",
    )
    assert copied == ["front-site.png"]
    assert missing == ["gone.png"]
    assert (dest / "front-ig.png").read_bytes() == b"already"
    assert (dest / "front-site.png").read_bytes() == b"new"


def test_unsafe_names_are_not_copied(tmp_path):
    shots = tmp_path / "shots" / "brand"
    shots.mkdir(parents=True)
    outside = tmp_path / "secret.png"
    outside.write_bytes(b"secret")
    copied, missing = publish_free_shots(
        "brand", "brand-abc", {"sections": [{"image": "../secret.png"}]}, shots.parent, tmp_path / "public"
    )
    assert copied == []
    assert missing == []
    assert not (tmp_path / "public").exists()
    assert outside.read_bytes() == b"secret"
