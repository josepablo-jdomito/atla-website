# Branding analyses (atla.design/audit/<slug>)

One JSON file per brand. `script/build_audits.py` turns it into
`client/public/audit/<slug>/index.html`, `og.png` and, when `"questionnaire": true`,
`client/public/audit/<slug>/questionnaire/index.html`.

```
pip install uharfbuzz fonttools pillow
python3 script/build_audits.py <slug>
```

Titles are ABC Synt, drawn as SVG outlines at build time from the font on the build
machine (`ABC_SYNT_PATH`, default `~/Library/Fonts/ABCSyntVariableVF-Trial.ttf`).
The font file is never published.

Copy that is the same for every brand lives in `shared.json`: the threats section,
the next-steps flow and the questionnaire. A section takes it with
`{"type": "threats", "id": "whats-at-stake", "shared": "threats"}`. `{brand}` is
replaced with the brand name.

## Page fields

`slug`, `brand`, `title` ("<Brand> Branding Analysis", never "Brand Audit"),
`description`, `date`, `mailSubject`, `email`, `author`, `authorRole`,
`gate` (text, button, privacy), `questionnaire` (true), `privacy` (shown under the
contact, for readers who skip the gate with a `?r=` code).

## Titles

Every `title` is a list of variants: `[desktop lines]` or `[desktop lines, phone lines]`.
Each variant is a list of lines. Phone lines should fit about 12 characters at 40 px.

## Section types, in the order Bevel uses them

| type | purpose | fields |
|---|---|---|
| `cover` | dark full-bleed opener | `title`, `kicker`, `readTime` |
| `chapter` | dark part divider (Part 01, Part 02) | `part`, `title`, `sub` |
| `stats` | 2 or 3 big numbers | `label`, `title`, `stats[{value,text}]`, optional `statement`, `note` |
| `table` | comparison table | `label`, `title`, `lead`, `head`, `rows`, `highlight`, `note` |
| `map` | 2x2 positioning map with logos | `label`, `title`, `lead`, `axes{top,bottom,left,right}`, `logos[{src,alt,x,y,w,focus}]`, `description`, `note` |
| `gallery` | 3 homepage first screens | `label`, `title`, `items[{src,name,quote,alt}]`, `statement`, `note` |
| `cult` | one measured ratio on a line | `label`, `title`, `lead`, `ends`, `zone{from,label}`, `points[{name,src,w,value,label,focus}]`, `note` |
| `statement` | the diagnosis, two beats | `label`, `title`, `second`, `note` |
| `threats` | shared | `"shared": "threats"` |
| `journey` | today vs with Atla, brand moves on the map | `label`, `title`, `lead`, `head`, `rows`, `axes`, `logos`, `from{x,y}`, `to{x,y}`, `focus`, `description`, `note` |
| `columns` | what we would build (3 or 4) | `label`, `title`, `span`, `columns[{label,head,body}]` |
| `system` | agentic brand system diagram | `label`, `title`, `lead`, `inputs[6]`, `core`, `coreSub`, `outputs[6]` |
| `globe` | Part 03, Imagine the possibilities | `label`, `part`, `title`, `photos[{src,x,y,w}]` on a 1920x1080 frame, `note` |
| `process` | shared next steps | `"shared": "process"` |

Map and journey coordinates: `x` 0 to 1 left to right, `y` 0 to 1 top to bottom,
`w` is the logo width on an 840 px wide map. Images live in
`client/public/audit/<slug>/img/` and are referenced by file name.

## Rules for every number

Each figure carries its source and date in the section `note`. Company counts that
measure different things (free users, paying members, units sold) are named as such
wherever they appear. Editorial positions are labelled "Atla's editorial read".

## Tracking

GA4 events: `audit_open`, `audit_section`, `audit_complete`, `audit_time`, `audit_click`,
`audit_gate`, `questionnaire_*`. Each recipient gets an opaque `?r=` code (5 lowercase
letters or digits); links with a code skip the gate. Names and emails never go to GA;
the gate and questionnaire write to Attio through `/api/contact`.
