"""Draw the /hospitality hero word as SVG outlines, so visitors without PP Playground still see it.

Same approach as build_audits.py: the font is read on the build machine and never published.
Needs: pip install uharfbuzz fonttools

    python3 script/build_hospitality_wordmark.py

Font path: PP_PLAYGROUND_PATH, default ~/Library/Fonts/PPPlayground-Medium.otf.
Writes client/public/hospitality/hospitality-wordmark.svg.
"""

import os
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

TEXT = "Hospitality"
INK = "#111111"
OUT = Path(__file__).resolve().parent.parent / "client/public/hospitality/hospitality-wordmark.svg"


def main() -> int:
    font_path = Path(os.environ.get("PP_PLAYGROUND_PATH", "~/Library/Fonts/PPPlayground-Medium.otf")).expanduser()
    if not font_path.exists():
        print(f"error: font not found at {font_path} (set PP_PLAYGROUND_PATH)", file=sys.stderr)
        return 1

    blob = hb.Blob.from_file_path(str(font_path))
    hb_font = hb.Font(hb.Face(blob))
    buf = hb.Buffer()
    buf.add_str(TEXT)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": True, "calt": True})

    tt = TTFont(str(font_path))
    glyph_set = tt.getGlyphSet()
    order = tt.getGlyphOrder()

    svg_pen = SVGPathPen(glyph_set)
    bounds_pen = BoundsPen(glyph_set)
    x = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        # Font units are y-up; SVG is y-down.
        transform = (1, 0, 0, -1, x + pos.x_offset, -pos.y_offset)
        glyph_set[name].draw(TransformPen(svg_pen, transform))
        glyph_set[name].draw(TransformPen(bounds_pen, transform))
        x += pos.x_advance

    if bounds_pen.bounds is None:
        print("error: nothing was drawn", file=sys.stderr)
        return 1
    x0, y0, x1, y1 = bounds_pen.bounds
    pad = 10
    view = f"{x0 - pad:.0f} {y0 - pad:.0f} {x1 - x0 + 2 * pad:.0f} {y1 - y0 + 2 * pad:.0f}"
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}">'
        f'<path fill="{INK}" d="{svg_pen.getCommands()}"/></svg>'
    )
    OUT.write_text(svg)
    print(f"wrote {OUT} ({len(svg)} bytes, viewBox {view})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
