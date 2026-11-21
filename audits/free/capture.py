"""First-screen capture: 1440x900 screenshot plus visible text, for the free-audit front door.

capture_site writes front-site.png. capture_instagram writes front-ig.png, and writes
nothing when Instagram serves a login wall instead of the profile.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import Literal, TypedDict
from urllib.parse import urlparse

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import TimeoutError as PlaywrightTimeout
from playwright.sync_api import sync_playwright

LINK_IN_BIO_HOSTS = {"linktr.ee", "beacons.ai", "lnk.bio"}
VIEWPORT = {"width": 1440, "height": 900}
COOKIE_SELECTORS = (
    "#onetrust-accept-btn-handler",
    'button:has-text("Accept all")',
    'button:has-text("Accept")',
    '[aria-label="Close"]',
)

# Visible text of whatever intersects the first 900px, in DOM order, skipping hidden elements.
_FIRST_SCREEN_JS = """
(vh) => {
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.nodeValue;
    if (!t || !t.trim()) continue;
    const el = n.parentElement;
    if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
    if (typeof el.checkVisibility === 'function') {
      if (!el.checkVisibility({opacityProperty: true, visibilityProperty: true})) continue;
    } else {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    }
    const r = document.createRange();
    r.selectNodeContents(n);
    const b = r.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    if (b.bottom <= 0 || b.top >= vh) continue;
    if (b.right <= 0 || b.left >= window.innerWidth) continue;
    out.push(t);
  }
  return out.join(' ');
}
"""


class Capture(TypedDict):
    status: Literal["ok", "unusable"]
    reason: str | None
    image: str | None
    text: str  # visible first-screen text in source casing (CSS text-transform is not applied)


def is_link_in_bio(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    host = host[4:] if host.startswith("www.") else host
    return host in LINK_IN_BIO_HOSTS


def is_instagram_login_wall(url: str, text: str) -> bool:
    """True when the capture is a login wall rather than the profile.

    A profile page still says "Log in" in the header. It also names its counts.
    A wall does not: it is the login form, or Instagram sent us to /accounts/login.
    """
    path = (urlparse(url).path or "").lower()
    if "/accounts/login" in path or path.rstrip("/").endswith("/login"):
        return True
    low = re.sub(r"\s+", " ", text or "").lower()
    has_profile = "followers" in low and ("following" in low or "posts" in low)
    if has_profile:
        return False
    wall = (
        "log in to instagram",
        "log into instagram",
        "sign up to see photos",
        "see everyday moments",
        "phone number, username, or email",
        "username, phone or email",
    )
    return any(phrase in low for phrase in wall)


def _unusable(reason: str) -> Capture:
    return {"status": "unusable", "reason": reason, "image": None, "text": ""}


def _dismiss_banners(page) -> None:
    for sel in COOKIE_SELECTORS:
        try:
            loc = page.locator(sel).first
            if loc.is_visible():
                loc.click(timeout=1000)
                page.wait_for_timeout(300)
                break
        except Exception:
            continue


def capture_site(url: str, out_dir: Path, timeout_s: float = 20) -> Capture:
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    if is_link_in_bio(url):
        return _unusable("link-in-bio")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            try:
                page = browser.new_context(viewport=VIEWPORT).new_page()
                page.set_default_timeout(timeout_s * 1000)
                resp = page.goto(url, wait_until="load", timeout=timeout_s * 1000)
                if resp is None or resp.status >= 400:
                    return _unusable(f"blocked: HTTP {resp.status if resp else 'no response'}")
                final = page.url
                if is_link_in_bio(final):
                    return _unusable("link-in-bio")
                if re.search(r"/password/?$", urlparse(final).path, re.I):
                    return _unusable("password")
                page.wait_for_timeout(500)
                _dismiss_banners(page)
                text = re.sub(r"\s+", " ", page.evaluate(_FIRST_SCREEN_JS, VIEWPORT["height"])).strip()
                if not text:
                    return _unusable("empty")
                image = out_dir / "front-site.png"
                page.screenshot(path=str(image), full_page=False)
                return {"status": "ok", "reason": None, "image": str(image), "text": text}
            finally:
                browser.close()
    except PlaywrightTimeout:
        return _unusable("timeout")
    except PlaywrightError as e:
        return _unusable(f"error: {str(e).splitlines()[0][:120]}")


def capture_instagram(handle: str, out_dir: Path, timeout_s: float = 20) -> Capture:
    """Profile screenshot at the same 1440x900 viewport as capture_site.

    A login wall is not a picture of the brand: nothing is written, and the
    reason is "login-wall".
    """
    handle = handle.strip().lstrip("@").strip("/")
    if not handle or "/" in handle or handle in (".", ".."):
        return _unusable("bad-handle")
    url = f"https://www.instagram.com/{handle}/"
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    image = out_dir / "front-ig.png"
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            try:
                page = browser.new_context(viewport=VIEWPORT).new_page()
                page.set_default_timeout(timeout_s * 1000)
                resp = page.goto(url, wait_until="load", timeout=timeout_s * 1000)
                page.wait_for_timeout(500)
                _dismiss_banners(page)
                text = re.sub(r"\s+", " ", page.evaluate(_FIRST_SCREEN_JS, VIEWPORT["height"])).strip()
                # A datacenter IP is often sent to /accounts/login (sometimes with HTTP 429).
                # That page is not the profile, so it is not saved.
                if is_instagram_login_wall(page.url, text):
                    if image.exists():
                        image.unlink()
                    return _unusable("login-wall")
                if resp is None or resp.status >= 400:
                    return _unusable(f"blocked: HTTP {resp.status if resp else 'no response'}")
                if not text:
                    return _unusable("empty")
                page.screenshot(path=str(image), full_page=False)
                return {"status": "ok", "reason": None, "image": str(image), "text": text}
            finally:
                browser.close()
    except PlaywrightTimeout:
        return _unusable("timeout")
    except PlaywrightError as e:
        return _unusable(f"error: {str(e).splitlines()[0][:120]}")
