"""Build the Atla analysis pages at atla.design/audit/<slug>.

    python3 script/build_audits.py            # every audits/*.json
    python3 script/build_audits.py bevel      # one brand

Content lives in audits/<slug>.json; copy that is the same for every brand lives in audits/shared.json. This script writes
client/public/audit/<slug>/index.html and og.png. Edit the JSON, never the output.

Titles are set in ABC Synt and drawn as SVG outlines here, at build time. The font
license does not allow serving the font file from a public server, so the file stays
on the build machine (ABC_SYNT_PATH) and only the outlines ship.

Needs: pip install uharfbuzz fonttools pillow
"""

import html
import json
import os
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "audits"
OUT = ROOT / "client" / "public" / "audit"
FONT_PATH = os.environ.get("ABC_SYNT_PATH", str(Path.home() / "Library/Fonts/ABCSyntVariableVF-Trial.ttf"))
SITE = "https://atla.design"

BEVEL_MARK = (
    '<svg class="mark-svg" viewBox="0 0 50 41" aria-hidden="true">'
    '<path d="M35.07 12.62c1.86 0 3.86.38 5.35 1.04C40.33 6.3 34.3 0 26.88 0H4.72l5.23 12.62h25.12z"/>'
    '<path d="M40.62 13.23v.17c0 7.63-5.36 12.74-13.55 12.74H0l5.8 14.24h29.93c7.88 0 14.27-6.17 14.27-14 0-6.13-3.9-11.16-9.38-13.15z"/>'
    "</svg>"
)
MARKS = {"bevel": BEVEL_MARK}


class Outliner:
    """Shapes text with HarfBuzz (kerning, ligatures) and returns SVG outlines."""

    def __init__(self, path):
        data = Path(path).read_bytes()
        self.font = hb.Font(hb.Face(data))
        tt = TTFont(path)
        self.upem = tt["head"].unitsPerEm
        self.glyphs = tt.getGlyphSet(location={"wght": 400, "slnt": 0})
        self.order = tt.getGlyphOrder()
        asc, desc = tt["hhea"].ascent, tt["hhea"].descent
        # Line box = 1em, like line-height: 1. Baseline sits where the browser would put it.
        self.baseline = (self.upem - (asc - desc)) / 2 + asc

    def _shape(self, line):
        buf = hb.Buffer()
        buf.add_str(line)
        buf.guess_segment_properties()
        hb.shape(self.font, buf, {"kern": True, "liga": True})
        return buf

    def svg(self, lines, cls="tv"):
        """One <svg> in font units: width = widest line, height = lines x 1em."""
        shaped = [self._shape(l) for l in lines]
        widths = [sum(p.x_advance for p in b.glyph_positions) for b in shaped]
        width = max(widths)
        paths = []
        for i, buf in enumerate(shaped):
            x, y0 = 0, i * self.upem + self.baseline
            for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
                pen = SVGPathPen(self.glyphs)
                self.glyphs[self.order[info.codepoint]].draw(
                    TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, y0 - pos.y_offset))
                )
                if pen.getCommands():
                    paths.append(pen.getCommands())
                x += pos.x_advance
        h = len(lines) * self.upem
        return (
            f'<svg class="{cls}" viewBox="0 0 {width} {h}" style="--n:{len(lines)};--w:{width / self.upem:.3f}"'
            f' aria-hidden="true" focusable="false"><path d="{" ".join(paths)}"/></svg>'
        )


def esc(s):
    return html.escape(s, quote=True)


def title(o, variants, tag="h2", cls="t", tid=None):
    """variants: [desktop lines] or [desktop lines, phone lines]."""
    text = " ".join(variants[0])
    idattr = f' id="{tid}"' if tid else ""
    if len(variants) == 1:
        art = o.svg(variants[0])
    else:
        art = o.svg(variants[0], "tv d") + o.svg(variants[1], "tv m")
    return f'<{tag} class="{cls}"{idattr}><span class="sr">{esc(text)}</span>{art}</{tag}>'


def note(s):
    return f'<p class="note">{esc(s["note"])}</p>' if s.get("note") else ""


def head(o, s, n):
    return (
        f'<p class="label"><span class="idx">{n:02d}</span>{esc(s["label"])}</p>'
        + title(o, s["title"], tid=f'{s["id"]}-t')
    )


def r_cover(o, s, d, n):
    mark = MARKS.get(d["slug"], "")
    return (
        f'<div class="cover-mark">{mark}</div>'
        + title(o, s["title"], tag="h1", cls="t t-display", tid="cover-t")
        + f'<p class="kicker">{esc(s["kicker"])}<span>{esc(s["readTime"])}</span></p>'
    )


def r_stats(o, s, d, n):
    items = "".join(
        f'<div class="stat"><dt>{o.svg([st["value"]], "tv")}<span class="sr">{esc(st["value"])}</span></dt><dd>{esc(st["text"])}</dd></div>'
        for st in s["stats"]
    )
    statement = f'<p class="statement">{esc(s["statement"])}</p>' if s.get("statement") else ""
    return head(o, s, n) + f'<dl class="stats n{len(s["stats"])}">{items}</dl>' + statement + note(s)


def r_table(o, s, d, n):
    th = "".join(f'<th scope="col">{esc(c)}</th>' for c in s["head"])
    rows = ""
    for i, r in enumerate(s["rows"]):
        hl = ' class="hl"' if i == s.get("highlight") else ""
        rows += f'<tr{hl}><th scope="row">{esc(r[0])}</th>' + "".join(f"<td>{esc(c)}</td>" for c in r[1:]) + "</tr>"
    return (
        head(o, s, n)
        + f'<p class="lead">{esc(s["lead"])}</p>'
        + f'<table class="tbl"><thead><tr>{th}</tr></thead><tbody>{rows}</tbody></table>'
        + note(s)
    )


def r_map(o, s, d, n):
    a = s["axes"]
    logos = ""
    for i, l in enumerate(s["logos"]):
        f = " focus" if l.get("focus") else ""
        logos += (
            f'<span class="pt{f}" style="--x:{l["x"]};--y:{l["y"]};--lw:{l["w"]};--i:{i}">'
            f'<img src="/audit/{d["slug"]}/img/{l["src"]}" alt="{esc(l["alt"])}" title="{esc(l["alt"])}" loading="lazy"></span>'
        )
    return (
        '<div class="split">'
        f'<div class="split-text">{head(o, s, n)}<p class="lead">{esc(s["lead"])}</p>{note(s)}</div>'
        '<figure class="map reveal" data-reveal>'
        f'<p class="sr">{esc(s["description"])}</p>'
        f'<div class="plot"><i class="vx"></i><i class="hx"></i>{logos}'
        f'<span class="ax top">{esc(a["top"])}</span><span class="ax bottom">{esc(a["bottom"])}</span>'
        f'<span class="ax left">{esc(a["left"])}</span><span class="ax right">{esc(a["right"])}</span></div>'
        "</figure></div>"
    )


def r_gallery(o, s, d, n):
    figs = "".join(
        f'<figure><img src="/audit/{d["slug"]}/img/{it["src"]}" alt="{esc(it["alt"])}" loading="lazy" width="800" height="470">'
        f'<figcaption>{esc(it["name"])}<span>“{esc(it["quote"])}”</span></figcaption></figure>'
        for it in s["items"]
    )
    return head(o, s, n) + f'<div class="shots">{figs}</div><p class="statement">{esc(s["statement"])}</p>' + note(s)


def r_cult(o, s, d, n):
    pts = ""
    for i, p in enumerate(s["points"]):
        f = " focus" if p.get("focus") else ""
        pts += (
            f'<li class="cp{f}" style="--v:{p["value"]};--i:{i};--lift:{p.get("lift", 0)}">'
            f'<img src="/audit/{d["slug"]}/img/{p["src"]}" alt="" style="--lw:{p["w"]}"><span class="cv">{esc(p["name"])} {esc(p["label"])}</span></li>'
        )
    z = s["zone"]
    return (
        head(o, s, n)
        + f'<p class="lead">{esc(s["lead"])}</p>'
        + '<figure class="cult reveal" data-reveal>'
        + f'<div class="track"><span class="zone" style="--z:{z["from"]}"><em>{esc(z["label"])}</em></span><ol>{pts}</ol></div>'
        + f'<div class="ends"><span>{esc(s["ends"][0])}</span><span>{esc(s["ends"][1])}</span></div>'
        + "</figure>"
        + note(s)
    )


def r_statement(o, s, d, n):
    return (
        f'<p class="label"><span class="idx">{n:02d}</span>{esc(s["label"])}</p>'
        + f'<h2 class="t t-xl" id="{s["id"]}-t"><span class="sr">{esc(" ".join(s["title"][0]))} {esc(" ".join(s["second"][0]))}</span>'
        + f'<span class="l1">{o.svg(s["title"][0], "tv d")}{o.svg(s["title"][1], "tv m")}</span>'
        + f'<span class="l2 reveal" data-reveal>{o.svg(s["second"][0], "tv d")}{o.svg(s["second"][1], "tv m")}</span></h2>'
        + note(s)
    )


def r_columns(o, s, d, n):
    cols = "".join(
        f'<div class="col"><p class="label">{esc(c["label"])}</p>'
        f'<h3 class="t t-sm"><span class="sr">{esc(" ".join(c["head"][0]))}</span>{o.svg(c["head"][0], "tv d")}{o.svg(c["head"][1], "tv m")}</h3>'
        f'<p>{esc(c["body"])}</p></div>'
        for c in s["columns"]
    )
    return head(o, s, n) + f'<div class="cols-wrap"><p class="label span">{esc(s["span"])}</p><div class="cols n{len(s["columns"])}">{cols}</div></div>'


def r_system(o, s, d, n):
    xs = [83, 250, 417, 583, 750, 917]
    paths_in = "".join(
        f'<path class="fi" pathLength="1" id="fi{i}" d="M{x} 66 V170 Q{x} 200 {440 + i * 24} 222"/>' for i, x in enumerate(xs)
    )
    paths_out = "".join(
        f'<path class="fo" pathLength="1" id="fo{i}" d="M{440 + i * 24} 282 Q{x} 304 {x} 334 V430"/>' for i, x in enumerate(xs)
    )
    dots = "".join(
        f'<circle class="dot" r="3.4"><animateMotion dur="5s" begin="{-i * 0.42:.2f}s" repeatCount="indefinite"><mpath href="#{pid}"/></animateMotion></circle>'
        for i, pid in enumerate([f"fi{k}" for k in range(6)] + [f"fo{k}" for k in range(6)])
    )
    labels_in = "".join(
        f'<circle class="ni" cx="{x}" cy="62" r="5.5"/><text x="{x}" y="38">{esc(t)}</text>' for x, t in zip(xs, s["inputs"])
    )
    labels_out = "".join(
        f'<circle class="no" cx="{x}" cy="436" r="5.5"/><text x="{x}" y="472">{esc(t)}</text>' for x, t in zip(xs, s["outputs"])
    )
    chips_in = "".join(f"<li>{esc(t)}</li>" for t in s["inputs"])
    chips_out = "".join(f"<li>{esc(t)}</li>" for t in s["outputs"])
    return (
        head(o, s, n)
        + f'<p class="lead">{esc(s["lead"])}</p>'
        + '<figure class="system reveal" data-reveal>'
        + '<svg class="flow" viewBox="0 0 1000 490" role="img" aria-label="'
        + esc(f'{", ".join(s["inputs"])} feed one {s["core"]}, used by {s["coreSub"].replace(" · ", ", ")}, which produces {", ".join(s["outputs"])}.')
        + f'">{paths_in}{paths_out}<g class="dots">{dots}</g><g class="lbl">{labels_in}{labels_out}</g>'
        + f'<rect class="core" x="250" y="222" width="500" height="60" rx="30"/>'
        + f'<text class="core-t" x="500" y="249">{esc(s["core"])}</text><text class="core-s" x="500" y="271">{esc(s["coreSub"])}</text></svg>'
        + f'<div class="flow-m" aria-hidden="true"><ul>{chips_in}</ul><p class="core-m">{esc(s["core"])}<span>{esc(s["coreSub"])}</span></p><ul class="out">{chips_out}</ul></div>'
        + "</figure>"
    )


def r_globe(o, s, d, n):
    rings = "".join(f'<ellipse cx="960" cy="540" rx="960" ry="{r}"/>' for r in (75, 190, 320, 460, 630))
    photos = "".join(
        f'<img class="ph" src="/audit/{d["slug"]}/img/{p["src"]}" alt="" loading="lazy" style="--x:{p["x"]};--y:{p["y"] - 60};--pw:{p["w"]};--i:{i}">'
        for i, p in enumerate(sorted(s["photos"], key=lambda p: abs(p["x"] + p["w"] / 2 - 960) + abs(p["y"] - 540)))
    )
    a, b = s["title"][0]
    mark = MARKS.get(d["slug"], "")
    label = f'Part {esc(s["part"])}' if s.get("part") else f"{n:02d}"
    return (
        f'<p class="label"><span class="idx">{label}</span>{esc(s["label"])}</p>'
        + '<div class="globe reveal" data-reveal>'
        + f'<svg class="rings" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">{rings}<line x1="0" y1="540" x2="1920" y2="540"/></svg>'
        + photos
        + f'<h2 class="t t-globe" id="{s["id"]}-t"><span class="sr">{esc(a)} {esc(b)}</span><span class="row">{o.svg([a])}<span class="tile">{mark}</span>{o.svg([b])}</span></h2>'
        + "</div>"
        + note(s)
    )


def r_close(o, s, d, n):
    mail = f'mailto:{d["email"]}?subject={esc(d["mailSubject"]).replace(" ", "%20")}'
    return (
        head(o, s, n)
        + f'<p class="lead">{esc(s["text"])}</p>'
        + f'<p class="contact">{esc(d["author"])}, {esc(d["authorRole"])}<br>'
        + f'<a href="{mail}" data-track="email">{esc(d["email"])}</a></p>'
    )


def r_threats(o, s, d, n):
    rows = "".join(
        f'<li class="th"><span class="th-n">{k + 1:02d}</span>'
        f'<h3 class="t t-sm"><span class="sr">{esc(" ".join(it["head"][0]))}</span>{o.svg(it["head"][0], "tv d")}{o.svg(it["head"][1], "tv m")}</h3>'
        f'<div class="th-b"><p>{esc(it["body"])}</p>'
        + (f'<p class="th-s">{esc(it["source"])}</p>' if it.get("source") else "")
        + "</div></li>"
        for k, it in enumerate(s["items"])
    )
    return head(o, s, n) + f'<p class="lead">{esc(s["lead"])}</p><ol class="threats">{rows}</ol>'


def r_journey(o, s, d, n):
    a, f, t, fo = s["axes"], s["from"], s["to"], s["focus"]
    logos = "".join(
        f'<span class="pt static" style="--x:{l["x"]};--y:{l["y"]};--lw:{l["w"]}"><img src="/audit/{d["slug"]}/img/{l["src"]}" alt="" loading="lazy"></span>'
        for l in s["logos"]
    )
    rows = "".join(
        f'<tr><th scope="row">{esc(r[0])}</th><td>{esc(r[1])}</td><td>{esc(r[2])}</td></tr>' for r in s["rows"]
    )
    th = "".join(f'<th scope="col">{esc(h)}</th>' for h in s["head"])
    x1, y1, x2, y2 = f["x"] * 840, f["y"] * 760, t["x"] * 840, t["y"] * 760
    return (
        head(o, s, n)
        + f'<p class="lead">{esc(s["lead"])}</p>'
        + '<div class="journey">'
        + f'<table class="tbl jt"><thead><tr>{th}</tr></thead><tbody>{rows}</tbody></table>'
        + '<figure class="map jmap reveal" data-reveal>'
        + f'<p class="sr">{esc(s["description"])}</p>'
        + f'<div class="plot"><i class="vx"></i><i class="hx"></i>{logos}'
        + f'<svg class="path" viewBox="0 0 840 760" preserveAspectRatio="none" aria-hidden="true"><line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" pathLength="1"/></svg>'
        + f'<span class="ghost" style="--x:{f["x"]};--y:{f["y"]};--lw:{fo["w"]}"><img src="/audit/{d["slug"]}/img/{fo["src"]}" alt=""><em>Today</em></span>'
        + f'<span class="pt mover" style="--x:{t["x"]};--y:{t["y"]};--fx:{f["x"]};--fy:{f["y"]};--lw:{fo["w"]}"><img src="/audit/{d["slug"]}/img/{fo["src"]}" alt="{esc(fo["alt"])}"><em>With Atla</em></span>'
        + f'<span class="ax top">{esc(a["top"])}</span><span class="ax bottom">{esc(a["bottom"])}</span>'
        + f'<span class="ax left">{esc(a["left"])}</span><span class="ax right">{esc(a["right"])}</span></div>'
        + "</figure></div>"
        + note(s)
    )


def r_process(o, s, d, n):
    steps = "".join(
        f'<li class="step{" here" if st.get("here") else ""}" style="--i:{k}">'
        f'<span class="node" aria-hidden="true"></span>'
        f'<p class="step-n">{k + 1:02d}' + (' <em>You are here</em>' if st.get("here") else "") + "</p>"
        + (f'<h3><a href="/audit/{d["slug"]}/questionnaire/" data-track="questionnaire">{esc(st["name"])} <span aria-hidden="true">→</span></a></h3>'
           if st.get("link") and d.get("questionnaire") else f'<h3>{esc(st["name"])}</h3>')
        + f'<p>{esc(st["body"])}</p><span class="tag">{esc(st["tag"])}</span></li>'
        for k, st in enumerate(s["steps"])
    )
    mail = f'mailto:{d["email"]}?subject={esc(d["mailSubject"]).replace(" ", "%20")}'
    return (
        head(o, s, n)
        + f'<p class="lead">{esc(s["lead"])}</p>'
        + f'<ol class="steps reveal" data-reveal>{steps}</ol>'
        + f'<p class="contact">{esc(d["author"])}, {esc(d["authorRole"])}<br>'
        + f'<a href="{mail}" data-track="email">{esc(d["email"])}</a></p>'
    )


def r_chapter(o, s, d, n):
    return (
        f'<p class="label"><span class="idx">Part {esc(s["part"])}</span></p>'
        + title(o, s["title"], cls="t t-xl", tid=f'{s["id"]}-t')
        + f'<p class="lead">{esc(s["sub"])}</p>'
    )


RENDER = {
    "cover": r_cover, "stats": r_stats, "table": r_table, "map": r_map, "gallery": r_gallery, "cult": r_cult,
    "statement": r_statement, "threats": r_threats, "journey": r_journey, "process": r_process, "chapter": r_chapter, "columns": r_columns, "system": r_system, "globe": r_globe, "close": r_close,
}


def gate(d):
    """Name-and-email gate. The page stays scrollable and blurred until it is submitted."""
    g = d.get("gate")
    if not g:
        return ""
    return f"""<div class="gate" id="gate" hidden>
  <form class="gate-card" role="dialog" aria-modal="true" aria-labelledby="gate-t" novalidate>
    <p class="gate-t" id="gate-t">{esc(g["text"])}</p>
    <label>Name<input name="name" type="text" autocomplete="name" required maxlength="120"></label>
    <label>Email<input name="email" type="email" autocomplete="email" required maxlength="200"></label>
    <input class="hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit">{esc(g["button"])}</button>
    <p class="gate-err" role="alert" hidden></p>
    <p class="gate-p">{esc(g["privacy"])}</p>
  </form>
</div>"""


def page(o, d):
    sections = []
    n = 0
    for s in d["sections"]:
        if s["type"] not in ("cover", "chapter") and not s.get("part"):
            n += 1
        body = RENDER[s["type"]](o, s, d, n)
        sections.append(
            f'<section class="s s-{s["type"]}" id="{s["id"]}" data-name="{s["id"]}" aria-labelledby="{s["id"]}-t">'
            f'<div class="w">{body}</div></section>'
        )
    url = f'{SITE}/audit/{d["slug"]}'
    mail = f'mailto:{d["email"]}?subject={esc(d["mailSubject"]).replace(" ", "%20")}'
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{esc(d["title"])} · Atla</title>
<meta name="description" content="{esc(d["description"])}">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(d["title"])}">
<meta property="og:description" content="{esc(d["description"])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{url}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500&display=swap">
<link rel="stylesheet" href="/audit/audit.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-X4ZD7PGXE3"></script>
<script defer src="/audit/audit.js"></script>
</head>
<body data-audit="{esc(d["slug"])}" data-brand="{esc(d["brand"])}">
<header class="bar">
  <span class="bar-title">{esc(d["title"])}</span>
  <a class="bar-reply" href="{mail}" data-track="bar-reply">Reply</a>
  <span class="progress" aria-hidden="true"><i></i></span>
</header>
{gate(d)}
<main>
{chr(10).join(sections)}
</main>
</body>
</html>
"""


def og_image(d, path):
    from PIL import Image, ImageDraw, ImageFont

    W, H = 1200, 630
    img = Image.new("RGB", (W, H), "#F7F7F9")
    dr = ImageDraw.Draw(img)
    big = ImageFont.truetype(FONT_PATH, 118)
    small = ImageFont.truetype(str(ROOT / "audits" / "LibreFranklin-Medium.ttf"), 22) if (ROOT / "audits" / "LibreFranklin-Medium.ttf").exists() else ImageFont.load_default()
    cover = next(s for s in d["sections"] if s["type"] == "cover")
    lines = cover["title"][0]
    y = 250
    for line in lines:
        dr.text((64, y), line, font=big, fill="#0F0F0F")
        y += 122
    dr.text((64, 64), cover["kicker"].upper(), font=small, fill="#6E6E73")
    dr.ellipse((64, 560, 76, 572), fill="#FFC629")
    img.save(path, optimize=True)


def with_shared(d):
    """Sections marked {"shared": "<key>"} take their copy from audits/shared.json, with {brand} filled in."""
    shared = json.loads((CONTENT / "shared.json").read_text())
    if d.get("questionnaire"):
        d["questionnaire_copy"] = json.loads(json.dumps(shared["questionnaire"], ensure_ascii=False).replace("{brand}", d["brand"]))
    for i, s in enumerate(d["sections"]):
        key = s.get("shared")
        if key:
            text = json.dumps(shared[key], ensure_ascii=False).replace("{brand}", d["brand"])
            d["sections"][i] = {**json.loads(text), **{k: v for k, v in s.items() if k != "shared"}}
    return d


PAIR_ART = {
    "pair-serif": lambda o: o.svg(["Aa"], "tv"),
    "pair-people": lambda o: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="13" r="7"/><path d="M6 38c1-9 7-14 14-14s13 5 14 14z"/></svg>',
    "pair-product": lambda o: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="12" y="4" width="16" height="32" rx="4"/></svg>',
}


def questionnaire_page(o, d):
    q = d["questionnaire_copy"]
    steps = []
    for k, st in enumerate(q["steps"]):
        hint = f'<p class="q-hint">{esc(st["hint"])}</p>' if st.get("hint") else ""
        body = ""
        if st["type"] == "brands":
            body = '<div class="chips brands">' + "".join(
                f'<button type="button" class="chip" data-v="{esc(b)}" aria-pressed="false">{esc(b)}</button>' for b in st["options"]
            ) + '</div><div class="add"><input type="text" placeholder="Add a brand" aria-label="Add a brand" maxlength="40"><button type="button" class="add-btn">Add</button></div>'
        elif st["type"] == "sliders":
            body = '<div class="sliders">' + "".join(
                f'<label class="sl"><span>{esc(a)}</span><input type="range" min="0" max="100" value="50" data-a="{esc(a)}" data-b="{esc(b)}" aria-label="{esc(a)} to {esc(b)}"><span>{esc(b)}</span></label>'
                for a, b in st["options"]
            ) + "</div>"
        elif st["type"] == "pairs":
            rows = ""
            for i, pr in enumerate(st["options"]):
                def card(side, label, cls):
                    art = PAIR_ART.get(cls, lambda o: "")(o)
                    return (f'<label class="pc {cls}"><input type="radio" name="pair{i}" value="{esc(label)}">'
                            f'<span class="pc-art">{art}</span><span class="pc-l">{esc(label)}</span></label>')
                rows += f'<div class="pair" data-k="{esc(pr["a"])} or {esc(pr["b"])}">{card("a", pr["a"], pr["sa"])}{card("b", pr["b"], pr["sb"])}</div>'
            body = f'<div class="pairs">{rows}</div>'
        elif st["type"] == "words":
            body = (f'<div class="chips words" data-max="{st["max"]}">' + "".join(
                f'<button type="button" class="chip" data-v="{esc(w)}" aria-pressed="false">{esc(w)}</button>' for w in st["options"]
            ) + f'</div><p class="q-hint">{esc(st["neverLabel"])}</p><div class="chips never">' + "".join(
                f'<button type="button" class="chip" data-v="{esc(w)}" aria-pressed="false">{esc(w)}</button>' for w in st["options"]
            ) + "</div>")
        elif st["type"] == "text":
            body = f'<textarea rows="3" maxlength="500" placeholder="{esc(st["placeholder"])}" aria-label="{esc(st["q"])}"></textarea>'
        steps.append(
            f'<section class="qs" data-type="{st["type"]}" data-id="{st["id"]}"{" data-optional" if st.get("optional") else ""} hidden>'
            f'<p class="q-n">{k + 1:02d} / {len(q["steps"]) + 1:02d}</p><h2 class="q-q">{esc(st["q"])}</h2>{hint}{body}</section>'
        )
    n = len(q["steps"]) + 1
    steps.append(
        f'<section class="qs" data-type="contact" data-id="contact" hidden><p class="q-n">{n:02d} / {n:02d}</p>'
        f'<h2 class="q-q">{esc(q["contactQ"])}</h2>'
        '<label class="f">Name<input name="name" type="text" autocomplete="name" maxlength="120" required></label>'
        '<label class="f">Email<input name="email" type="email" autocomplete="email" maxlength="200" required></label>'
        '<input class="hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true"></section>'
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{esc(q["title"])} · Atla</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500&display=swap">
<link rel="stylesheet" href="/audit/audit.css">
<link rel="stylesheet" href="/audit/questionnaire.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-X4ZD7PGXE3"></script>
<script defer src="/audit/questionnaire.js"></script>
</head>
<body data-audit="{esc(d["slug"])}" data-brand="{esc(d["brand"])}" class="qbody">
<header class="bar">
  <a class="bar-title" href="/audit/{esc(d["slug"])}">{esc(d["title"])}</a>
  <span class="bar-title q-count" aria-live="polite"></span>
  <span class="progress" aria-hidden="true"><i></i></span>
</header>
<main class="qw">
<noscript><p class="lead">This questionnaire needs JavaScript. You can also reply to the email with your answers.</p></noscript>
<form id="qf" novalidate>
<section class="qs q-intro" data-type="intro">
  <p class="label">{esc(d["brand"])} · Questionnaire</p>
  {title(o, [[q["title"]]], tag="h1", cls="t", tid="q-t")}
  <p class="lead">{esc(q["intro"])}</p>
  <button type="button" class="q-go" data-next>{esc(q["start"])}</button>
</section>
{chr(10).join(steps)}
<section class="qs q-done" data-type="done" hidden><h2 class="q-q">{esc(q["done"])}</h2></section>
<nav class="q-nav" hidden><button type="button" class="q-back" data-back>{esc(q["back"])}</button><button type="button" class="q-next" data-next>{esc(q["next"])}</button><button type="submit" class="q-next q-submit" hidden>{esc(q["submit"])}</button></nav>
<p class="gate-err q-err" role="alert" hidden></p>
</form>
</main>
</body>
</html>
"""


def build(slug, o):
    d = with_shared(json.loads((CONTENT / f"{slug}.json").read_text()))
    out = OUT / slug
    out.mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(page(o, d))
    if d.get("questionnaire"):
        (out / "questionnaire").mkdir(exist_ok=True)
        (out / "questionnaire" / "index.html").write_text(questionnaire_page(o, d))
    og_image(d, out / "og.png")
    print(f"built /audit/{slug}/")


if __name__ == "__main__":
    outliner = Outliner(FONT_PATH)
    slugs = sys.argv[1:] or [p.stem for p in CONTENT.glob("*.json") if p.stem != "shared"]
    for slug in slugs:
        build(slug, outliner)
