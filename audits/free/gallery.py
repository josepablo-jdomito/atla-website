"""Review gallery: one self-contained local HTML file for JP's Sí/No pass over free audits.

Opened from disk, never deployed. Images are inlined as base64 data URIs.
"""
from __future__ import annotations

import base64
import html
import json
from datetime import date as _date
from pathlib import Path

CSS = """
:root{--bg:#f7f6f3;--fg:#15130f;--mut:#5c574d;--line:#d9d5cb;--card:#fff;--si:#14662f;--no:#9b1c1c;--hot:#b45309}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.45 -apple-system,system-ui,sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding:12px 20px;display:flex;gap:16px;align-items:center;justify-content:space-between}
h1{font-size:18px;margin:0}h2{font-size:15px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin:28px 20px 8px}
main{max-width:1100px;margin:0 auto}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(440px,1fr));gap:16px;padding:0 20px}
.card{background:var(--card);border:2px solid var(--line);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px}
.card.si{border-color:var(--si)}.card.no{border-color:var(--no)}
.top{display:flex;justify-content:space-between;gap:8px;align-items:baseline}.brand{font-weight:700;font-size:18px}.slug{color:var(--mut);font-size:13px}
.hot{background:var(--hot);color:#fff;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;white-space:nowrap}
.shot{position:relative;border:1px solid var(--line);border-radius:6px;overflow:hidden}.shot img{display:block;width:100%}
.pin{position:absolute;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;background:var(--fg);color:#fff;font:700 13px/24px sans-serif;text-align:center;border:2px solid #fff}
.pins{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}.pins li{font-size:14px}
.q{font-style:italic}.k{color:var(--mut);font-weight:600}
.pain{font-size:14px;color:var(--mut);border-left:3px solid var(--line);padding-left:8px}
.btns{display:flex;gap:8px}.btns button,header button{font:600 15px sans-serif;padding:9px 18px;border-radius:8px;border:2px solid var(--line);background:#fff;cursor:pointer;flex:1}
header button{flex:none;background:var(--fg);color:#fff;border-color:var(--fg)}
.btns .b-si.on{background:var(--si);color:#fff;border-color:var(--si)}.btns .b-no.on{background:var(--no);color:#fff;border-color:var(--no)}
.reason{font-size:14px}.issues{color:var(--no);font-size:14px;margin:0;padding-left:18px}
"""

JS = """
const D=%DATE%,KEY='decisions-'+D;let dec={},ok=true,dirty=false;
const cnt=document.getElementById('count'),note=document.getElementById('save');
function save(){try{localStorage.setItem(KEY,JSON.stringify(dec));ok=true;}catch(e){ok=false;}}
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object')dec=v;ok=true;}catch(e){ok=false;}}
function paint(c){const s=c.dataset.slug;c.classList.toggle('si',dec[s]==='si');c.classList.toggle('no',dec[s]==='no');
  c.querySelectorAll('button[data-v]').forEach(x=>x.classList.toggle('on',dec[s]===x.dataset.v));}
function upd(){cnt.textContent=Object.keys(dec).length+' de '+document.querySelectorAll('#ready .card').length+' decididos';
  note.textContent=ok?'Decisiones guardadas en este navegador':'No se pueden guardar: exporta antes de cerrar';}
load();
document.querySelectorAll('#ready .card').forEach(c=>{
  if(!dec[c.dataset.slug])delete dec[c.dataset.slug];
  paint(c);
  c.querySelectorAll('button[data-v]').forEach(b=>b.addEventListener('click',()=>{
    const v=b.dataset.v,s=c.dataset.slug;
    if(dec[s]===v){delete dec[s];}else{dec[s]=v;}
    dirty=true;paint(c);save();upd();
  }));
});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
document.getElementById('export').addEventListener('click',()=>{
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(dec,null,2)],{type:'application/json'}));
  a.download='decisions-'+D+'.json';document.body.appendChild(a);a.click();a.remove();dirty=false;
});
upd();
"""


def _e(s) -> str:
    return html.escape("" if s is None else str(s), quote=True)


def _data_uri(path: Path) -> str | None:
    if not path.is_file():
        return None
    mime = "image/jpeg" if path.suffix.lower() in (".jpg", ".jpeg") else "image/png"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


def _pins_section(audit: dict | None) -> dict | None:
    for s in (audit or {}).get("sections", []):
        if s.get("type") in ("pins", "memo"):
            return s
    return None


def _problem(item: dict) -> str | None:
    """Why a 'ready' item cannot be shown as a Sí/No card, or None if it can."""
    sec = _pins_section(item["audit"])
    pins = (sec or {}).get("pins")
    if not sec or not isinstance(pins, list) or not pins:
        return "sin pines"
    for p in pins:
        try:
            ok = isinstance(p, dict) and int(p["n"]) >= 1 and 0 <= float(p["x"]) <= 1 and 0 <= float(p["y"]) <= 1 \
                and int(p.get("on", 1)) in (1, 2)
        except (KeyError, TypeError, ValueError):
            ok = False
        if not ok:
            return "pines inválidos"
    base = Path(item["image_dir"])
    for p in pins:
        name = sec.get("image2" if int(p.get("on", 1)) == 2 else "image")
        if not name or _data_uri(base / name) is None:
            return "sin captura"
    return None


def _shots(item: dict) -> str:
    sec = _pins_section(item["audit"])
    if not sec:
        return ""
    base = Path(item["image_dir"])
    out = []
    for idx, key in ((1, "image"), (2, "image2")):
        name = sec.get(key)
        uri = _data_uri(base / name) if name else None
        if not uri:
            continue
        markers = "".join(
            f'<span class="pin" style="left:{p["x"] * 100:.1f}%;top:{p["y"] * 100:.1f}%">{_e(p["n"])}</span>'
            for p in sec.get("pins", []) if int(p.get("on", 1)) == idx
        )
        out.append(f'<div class="shot"><img src="{uri}" alt="">{markers}</div>')
    return "".join(out)


def _pin_list(audit: dict | None) -> str:
    sec = _pins_section(audit)
    if not sec:
        return ""
    lis = "".join(
        f'<li><b>{_e(p["n"])}.</b> <span class="q">{("&ldquo;" + _e(p.get("quote")) + "&rdquo;") if p.get("quote") else _e(p.get("area"))}</span><br>'
        f'<span class="k">Qué:</span> {_e(p.get("what"))} <span class="k">Por qué:</span> {_e(p.get("why"))} '
        f'<span class="k">Cómo:</span> {_e(p.get("how"))}</li>'
        for p in sec.get("pins", [])
    )
    return f'<ul class="pins">{lis}</ul>'


def _card(item: dict, ready: bool) -> str:
    r = item["request"]
    brand = (item["audit"] or {}).get("brand") or r.site or r.name
    hot = '<span class="hot">Lead caliente</span>' if item["hot"] else ""
    head = (f'<div class="top"><div><span class="brand">{_e(brand)}</span> '
            f'<span class="slug">{_e(item["slug"])}</span></div>{hot}</div>')
    pain = (r.answers or {}).get("frustration", "").strip()
    pain_html = f'<div class="pain">{_e(pain.splitlines()[0])}</div>' if pain else ""
    if ready:
        body = (f'{_shots(item)}{_pin_list(item["audit"])}{pain_html}'
                '<div class="btns"><button class="b-si" data-v="si">Sí</button>'
                '<button class="b-no" data-v="no">No</button></div>')
    else:
        why = item["reason"] or {"qa_failed": "No pasó QA", "no_finding": "Sin hallazgo", "unusable": "No usable"}.get(item["status"], item["status"])
        issues = "".join(f"<li>{_e(q)}</li>" for q in item["qa"])
        body = (f'<div class="reason"><b>{_e(item["status"])}</b>: {_e(why)}</div>'
                + (f'<ul class="issues">{issues}</ul>' if issues else "") + pain_html)
    return f'<article class="card" data-slug="{_e(item["slug"])}">{head}{body}</article>'


def _order(items: list[dict]) -> list[dict]:
    return sorted(items, key=lambda i: (not i["hot"], i["request"].created_at or ""))


def build_gallery(items: list[dict], out_path: Path | str, date: str | None = None) -> Path:
    date = date or _date.today().isoformat()
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    ordered = _order(items)
    ready, sent_not = [], []
    for i in ordered:
        if i["status"] == "ready" and not i["qa"]:
            prob = _problem(i)
            if prob is None:
                ready.append(i)
                continue
            i = {**i, "status": "unusable", "reason": prob}
        sent_not.append(i)
    doc = f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Revisión auditorías {_e(date)}</title>
<style>{CSS}</style></head><body>
<header><h1>Auditorías gratis · {_e(date)}</h1><span id="count"></span><small id="save"></small><button id="export">Exportar decisiones</button></header>
<main>
<h2>Listos ({len(ready)})</h2><section id="ready" class="grid">{"".join(_card(i, True) for i in ready)}</section>
<h2>No enviados ({len(sent_not)})</h2><section id="notsent" class="grid">{"".join(_card(i, False) for i in sent_not)}</section>
</main><script>{JS.replace("%DATE%", json.dumps(date))}</script></body></html>"""
    out_path.write_text(doc, encoding="utf-8")
    return out_path
