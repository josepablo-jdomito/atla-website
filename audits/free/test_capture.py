import functools
import http.server
import threading
import time
from pathlib import Path

import pytest

from audits.free import capture
from audits.free.capture import capture_site, is_link_in_bio

FIXTURES = Path(__file__).parent / "fixtures"


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/go-password":
            self.send_response(302)
            self.send_header("Location", "/password")
            self.end_headers()
        elif self.path == "/password":
            self.path = "/password.html"
            super().do_GET()
        elif self.path == "/slow":
            time.sleep(6)
            self.path = "/site.html"
            super().do_GET()
        else:
            self.path = "/site.html"
            super().do_GET()

    def log_message(self, *a):
        pass


@pytest.fixture(scope="module")
def base():
    handler = functools.partial(Handler, directory=str(FIXTURES))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{srv.server_address[1]}"
    srv.shutdown()


def test_capture_ok_returns_text_and_png(base, tmp_path):
    c = capture_site(base + "/", tmp_path)
    assert c["status"] == "ok" and c["reason"] is None
    assert c["image"] == str(tmp_path / "front-site.png")
    assert Path(c["image"]).read_bytes()[:8] == b"\x89PNG\r\n\x1a\n"
    assert "Quiet furniture for loud lives" in c["text"]
    assert "Handmade in Austin since 2014." in c["text"]
    assert "Footer secret" not in c["text"]  # below the first screen
    assert "We use cookies" not in c["text"]  # banner dismissed


def test_link_in_bio_is_unusable(base, tmp_path, monkeypatch):
    assert is_link_in_bio("https://linktr.ee/brand")
    assert is_link_in_bio("https://www.beacons.ai/brand")
    assert is_link_in_bio("https://lnk.bio/brand")
    assert not is_link_in_bio("https://example.com")
    # final URL after redirects is what is checked: treat the local host as a link-in-bio host
    monkeypatch.setattr(capture, "LINK_IN_BIO_HOSTS", capture.LINK_IN_BIO_HOSTS | {"127.0.0.1"})
    c = capture_site(base + "/", tmp_path)
    assert c["status"] == "unusable" and c["reason"] == "link-in-bio"
    assert c["image"] is None


def test_password_page_is_unusable(base, tmp_path):
    c = capture_site(base + "/go-password", tmp_path)
    assert c["status"] == "unusable" and c["reason"] == "password"


def test_timeout_is_unusable(base, tmp_path):
    c = capture_site(base + "/slow", tmp_path, timeout_s=2)
    assert c["status"] == "unusable" and c["reason"] == "timeout"
