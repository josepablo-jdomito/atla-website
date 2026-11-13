"""Privacy for free audit pages: unguessable addresses and requester-owns-brand check."""
from __future__ import annotations

import secrets
import string
from urllib.parse import urlparse

FREE_MAIL = {"gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "yahoo.com",
             "icloud.com", "me.com", "proton.me", "protonmail.com", "aol.com", "gmx.com"}
_ALPHABET = string.ascii_lowercase + string.digits


def private_path(audit: dict) -> str:
    """The page folder: '<slug>-<12 random chars>'. Generated once and stored in audit['path']."""
    if not audit.get("path"):
        audit["path"] = f'{audit["slug"]}-' + "".join(secrets.choice(_ALPHABET) for _ in range(12))
    return audit["path"]


def _root(host: str) -> str:
    parts = host.lower().strip(".").split(".")
    return ".".join(parts[-2:]) if len(parts) >= 2 else host.lower()


def owner_verified(r) -> bool:
    """True only when the requester's email domain matches the brand's own site domain."""
    if r.kind == "instagram" or "@" not in (r.email or ""):
        return False
    mail = r.email.rsplit("@", 1)[1].lower()
    if mail in FREE_MAIL:
        return False
    site = r.url or r.site or ""
    host = urlparse(site if "://" in site else f"https://{site}").hostname or ""
    return bool(host) and _root(mail) == _root(host)
