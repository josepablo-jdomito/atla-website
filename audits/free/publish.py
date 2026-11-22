"""Copy free-audit screenshots into the public path the page already references.

Captures land in audits/free/shots/<content-slug>/ (gitignored). The built page
asks for /audit/<private-path>/img/<file>. Nothing else moved those files, so
the HTML and og.png shipped and the screenshots 404'd.
"""
from __future__ import annotations

import shutil
from pathlib import Path

_IMAGE_KEYS = ("image", "image2", "img")
_LIST_KEYS = ("items", "logos", "photos", "points")


def _safe_filename(name: str) -> bool:
    """A bare file name. Rejects paths so a JSON value cannot write outside img/."""
    if not name or name in (".", "..") or "/" in name or "\\" in name or "\x00" in name:
        return False
    return Path(name).name == name


def referenced_shot_names(audit: dict) -> list[str]:
    """File names the page will request under /audit/<slug>/img/."""
    names: list[str] = []

    def add(value) -> None:
        if not isinstance(value, str):
            return
        name = value.strip()
        if not _safe_filename(name) or name.startswith(("/", "http://", "https://")):
            return
        if name not in names:
            names.append(name)

    add(audit.get("markImg"))
    for section in audit.get("sections") or []:
        if not isinstance(section, dict):
            continue
        for key in _IMAGE_KEYS:
            add(section.get(key))
        for key in _LIST_KEYS:
            for item in section.get(key) or []:
                if isinstance(item, dict):
                    add(item.get("src"))
    return names


def publish_free_shots(
    content_slug: str,
    public_slug: str,
    audit: dict,
    shots_root: Path,
    out_root: Path,
) -> tuple[list[str], list[str]]:
    """Copy referenced screenshots into client/public/audit/<public_slug>/img/.

    Returns (copied, missing). A file already published, whose shot is gone
    because shots/ is gitignored, is left in place and is not missing.
    """
    copied: list[str] = []
    missing: list[str] = []
    src_dir = Path(shots_root) / content_slug
    dest_dir = Path(out_root) / public_slug / "img"
    for name in referenced_shot_names(audit):
        src = src_dir / name
        dest = dest_dir / name
        if src.is_file():
            dest_dir.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dest)
            copied.append(name)
        elif not dest.is_file():
            missing.append(name)
    return copied, missing
