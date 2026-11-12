import copy
import importlib.util
import json
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = Path(__file__).parent / "fixtures" / "pins.json"

spec = importlib.util.spec_from_file_location("build_audits", ROOT / "script" / "build_audits.py")
ba = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ba)

pytestmark = pytest.mark.skipif(
    not Path(ba.FONT_PATH).exists(), reason=f"ABC Synt font not found at {ba.FONT_PATH}; set ABC_SYNT_PATH"
)


@pytest.fixture(scope="module")
def outliner():
    return ba.Outliner(ba.FONT_PATH)


def render(outliner, mutate=None):
    d = json.loads(FIXTURE.read_text())
    if mutate:
        mutate(d)
    return ba.page(outliner, ba.with_shared(d))


def test_renders_three_numbered_pins(outliner):
    page = render(outliner)
    pins = re.findall(r'<span class="pin"[^>]*style="left:([\d.]+)%;top:([\d.]+)%"[^>]*>(\d)</span>', page)
    assert pins == [("25", "40", "1"), ("50", "50", "2"), ("75", "10", "3")]
    assert page.count('class="pin"') == 3


def test_quote_is_escaped_verbatim(outliner):
    page = render(outliner)
    assert "We &lt;3 &quot;craft&quot; &amp; care" in page
    assert 'We <3 "craft"' not in page


def test_single_image_when_no_image2(outliner):
    page = render(outliner)
    assert page.count('class="pin-img"') == 1
    assert "/audit/zz-pins-fixture/img/pixel.png" in page
    assert "pins-two" not in page


def test_side_by_side_when_image2(outliner):
    def two(d):
        p = d["sections"][1]
        p["image2"] = "pixel.png"
        p["pins"][2]["on"] = 2

    page = render(outliner, two)
    assert page.count('class="pin-img"') == 2
    assert "pins-two" in page
    first, second = page.split('class="pin-img"')[1:3]
    assert first.count('class="pin"') == 2
    assert second.count('class="pin"') == 1


def test_callouts_carry_what_why_how(outliner):
    page = render(outliner)
    for t in ("What one.", "Why two.", "How three."):
        assert t in page
    assert page.count('class="callout"') == 3


def test_cta_button(outliner):
    page = render(outliner)
    assert 'href="https://calendly.com/josepablo-atla/30min"' in page
    assert ">Book a 25-minute conversation<" in page
    assert ba.CALENDLY_URL == "https://calendly.com/josepablo-atla/30min"


def test_page_has_no_word_call(outliner):
    page = render(outliner)
    assert not re.search(r"\bcall\b", page, re.I)


def test_page_is_noindex(outliner):
    assert '<meta name="robots" content="noindex,nofollow">' in render(outliner)


def test_template_renders(outliner):
    d = json.loads((ROOT / "audits" / "free" / "template.json").read_text())
    page = ba.page(outliner, ba.with_shared(d))
    assert page.count('class="fd-zoom') == 3
    assert not re.search(r"\bcall\b", page, re.I)
