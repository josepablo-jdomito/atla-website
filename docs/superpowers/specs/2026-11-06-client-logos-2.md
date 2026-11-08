# Client marks, second batch (2026-11-06)

Eight more marks added to `client/public/logos-v2/` and to the end of `siteCopy.logos.items`. Same rules as `2026-11-05-client-logos.md`: real vector only, one fill `#1b1a17`, no raster, no `<text>`, nothing redrawn. Every client is already a case study on the site. Source files were read through the Drive MCP (and, for two decks, the local Drive mount); paths were extracted from the PDF/AI with `pdftocairo -svg`, outlines kept as-is, viewBox trimmed to the content box measured with `getBBox()` in Chrome.

| Name in band | File | Source (Drive) | Format | How converted |
|---|---|---|---|---|
| Pathize Health | pathize-health.svg | Pathize Health › logotype folder › `pathize-logotype.ai` (id 17srq4CHNDO48-5zg6bwnJHQkDFt_rj7M, 2023-08-16), page 1 of 6 (black version) | AI (PDF-compatible) | `pdftocairo -svg`, 14 paths. Primary lockup: heart-pill icon + wordmark. |
| Huémac | huemac.svg | Huémac › `Huémac_H Membretada.ai` (id 1vVF85FYr_wyVIzdFFwl2xnjAq_kItzsa, 2021-10-01), page 2 | AI | The letterhead page carries the wordmark as 8 outlined glyph paths (H u é m a c ® plus accent); only those were kept, frame lines and text dropped. Keeps the ® as in the source. |
| Castro Capital | castro-capital.svg | Castro Capital › `Castro Capital_Carpeta_Digital_Entregable.ai` (id 1DRbVIiz24fwfzbxW-sMfKv8yXkYohf7m, 2021-10-14), the folder cover | AI | 13 outlined glyph paths of "CASTRO CAPITAL" selected by their navy fill; everything else (address, icon, crop marks) dropped. No standalone logo file exists in the shared Drive; this is the wordmark as set on the client's folder. |
| Oxylife | oxylife.svg | `OXYLIFE-BRANDING.pdf` (mk+2 proposal deck, 2021-11-29, My Drive), slide 5 "Logotype" | PDF | 9 black paths (OXYLIFE + the small mark) from the slide; the textured panel behind it is raster and was not taken. |
| Peachy Patients | peachy-patients.svg | Peachy Patients › logotype folder › `peachypatients-logotype-wordmark.pdf` (id 114YNGuX0urbBmhjDN3v_jNOk2zdciJq5, 2022-06-13), page 7 (stacked, black) | PDF | 14 paths. Page 1 holds the one-line version; the stacked one was chosen because it matches the weight of Pax & Beneficia. Keeps the ®. |
| PuppyPy | puppypy.svg | PuppyPy › `Puppypy_Logo.ai` (id 1yqHATaR4LXNOTobYc22y3tuPWl7CBbNN, 2023-06-23) | AI | The art is white letters on green with line-drawn dogs standing in front. Only the 7 white letter paths (p-u-p-p-y-p-y) were kept; the dogs and the green field dropped. The first letter extends past the artboard edge in the source; its path is complete. |
| Mundã | munda.svg | `MUNDA-BRANDING-ROUND 2.pdf` (mk+2 proposal deck, 2022-07-18, My Drive), slide 5 "Logotipo" | PDF | 6 black paths (M U N D A + tilde). Slide 6 adds the "ALDEA DEL MAR" tagline; not used. |
| Baristio | baristio.svg | Baristio › Logotype › SVG › `Baristio_Logotype_Black.svg` (id 1IxWWnVxC5M_vSCeYyOroNexRC0WhvY9t, 2025-07-29) | SVG | Client's own SVG; fill set to `#1b1a17`, viewBox trimmed (the source had 20 units of padding). |

## Not sourced (and why)

No raster was traced: `potrace`, `autotrace` and `vtracer` are not installed (only Pillow and OpenCV). Nothing was redrawn.

| Client | Looked in | Result |
|---|---|---|
| Casa Colora | Drive title search, no client folder in the shared Drive; Sanity gallery (9 images) | Only website JPGs and mockups. No vector, no clean wordmark file. |
| Reggie | Reggie › 01 Client Files, 04 Final Delivery, 2. Assets; Sanity gallery | The brand-identity and brand-book PDFs hold the wordmark but are 16 to 113 MB, over the 10 MB Drive download limit of the connector. Sanity image 6 ("Old / New") shows a clean flat wordmark but it is raster and cannot be traced here. Needs the `.ai`/`.svg` dropped locally. |
| Ando | Ando › `ando-assets.ai` (18 MB, over the limit); `Ando-Artwork-5x7x3.ai` (pouch artwork, the ANDO letters are fused with the label art) | No standalone wordmark reachable. |
| Bovi Health | Bovi Health › Logotype › Editable files / Illustrator / PNG (folders empty or not shared with this account); `Bovi Health - Packaging.pdf` | Packaging only; the "Bovi Health" there is a script lockup inside a circular label, not the logo on its own. |
| Shop Latinx | Drive title search | Only weekly-meeting recordings. No brand files. |
| Torre Avancer | `Logotipos_Avancer.ai`; `AVANCER-BRANDING.pdf` (72 MB, over the limit) | The `.ai` is a sheet of third-party tenant logos (HSBC, Walmart and others), not Avancer's own. Not used. |
| The Internet Empires | `Internet Empires - 2025.09.05 - Brand Guidelines.pdf` (20 MB, over the limit) and the Graphic Path PDFs (22 to 24 MB) | Exist, cannot be downloaded through the connector. |
| Aimee Kestenberg, PrettyBoy | not searched again | Unchanged from 2026-11-05: no final vector. |

Files that would unlock the rest if JP drops them in a folder: Reggie brand-book PDF, `ando-assets.ai`, `AVANCER-BRANDING.pdf`, Internet Empires brand guidelines PDF.

## Verification

- Browser (own tab, `/about`, 753 px wide): all 24 SVGs load; the 8 new marks render as the real wordmarks at the 176 x 56 contain box and in the live band (Mundã and Baristio seen drifting). Optical weight sits in the same range as the existing marks (Persona, Temakase, Brick on the heavy side; Hanks, Tigre Tigre on the light side). Nothing clipped.
- `grep` for `<image>`, `<text>`, gradients in the new files: none. Sizes 2.5 to 8.8 KB.
- `npx vitest run`: 240 passed, 5 failed. The 5 failures are all in the Services page (`sitePages.test.ts`, `fixWave.test.ts`), being edited by another agent right now; the logos test (`chromeWave3.test.ts`) passes.
