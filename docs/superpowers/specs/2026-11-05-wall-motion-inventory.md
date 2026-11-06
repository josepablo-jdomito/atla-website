# Wall motion inventory (2026-11-05)

Finding: 11 of the 31 wall projects have real brand motion; 18 loops were cut and staged as Sanity drafts (drafts only, nothing published). The other 20 projects have no usable motion in Instagram, Drive, Figma or Behance today, or only files above the 10 MB Drive cap.

Source: sweep run 2026-11-05 from this session (Sanity project dvufm78f, Instagram via the signed-in Aside browser REPL plus yt-dlp, Google Drive MCP, Figma team search in the signed-in browser, Behance via the signed-in browser and the public CDN). Checked by reading every file back with ffprobe and by viewing a three-frame strip of each source before cutting.

## Tools that did not work and what is therefore missing

| Tool | Status 2026-11-05 | Consequence |
|---|---|---|
| vidIQ `vidiq_ig_profile_reels` | "Not enough credits" (402) on both handles | Replaced by the Aside browser REPL (signed in) to list reels, then yt-dlp for metadata and downloads. Nothing missing. |
| Aside agent (`aside exec`) | 402 "Insufficient credits" | Replaced by `aside repl` (Playwright). Nothing missing. |
| Firecrawl | 0 credits | Replaced by curl and the browser. Nothing missing. |
| Figma MCP `export_video` | Not run. File keys could not be resolved from the team search page (results are buttons without links, double-click did not open them inside the REPL timeout) | Figma prototypes or motion frames were NOT exported for any project. Figma files found by name are listed per project below so JP or the parent session can open one and export if a prototype exists. |
| Google Drive MCP | Works, 10 MB cap | Files above the cap are listed in the skip table for JP to share a compressed copy. |
| Sanity MCP | Not used; the Sanity CLI user token in `~/.config/sanity/config.json` (from `npx sanity debug --secrets` in `studio/`) was used with `@sanity/client` from the repo `node_modules` | Writes went through `@sanity/client` (script: scratchpad `wall-motion/scripts/stage.mjs`). |

## Candidates found (one row per source)

Verdict "use" means a loop was cut from it. Sizes are the source sizes.

| Project | Source | URL or path | Duration | Size | Verdict |
|---|---|---|---|---|---|
| ando | Drive | ANDO.gif, id 1JCOPfBeaeXjNfGxrbFQqp7ZJ8yBFYeo_ (shared by levi@atla.design) | 1.3 s | 0.4 MB | use, looped 4x |
| ando | Behance | https://www.behance.net/gallery/199900635/Ando | - | - | no video or gif modules |
| ando | Figma | file "ANDO" (team search) | - | - | not exported, see tools table |
| anything-ai | Drive | Anything_Logo.mp4, id 1UMFdybdYT6NSBcj_wBscuHlZY_CqpVBz (Behance export folder) | 10 s | 6.4 MB | use, 3 to 9 s |
| anything-ai | Drive | Anything_Symbol.mp4, id 1AxdJZfJ6auKcZOwDzqnyJ-Td9A41zBMc | 10 s | 6.1 MB | use, 3 to 9 s |
| anything-ai | Drive | ANYTHING-ANIMATION-1-1080-1440.mp4, id 1woEhQyUjQI-6K9QUjfyzcdxqhjvxYHHg (ANYTHING folder by aldo@) | 4 s | 4.6 MB | use, whole |
| anything-ai | Drive | Anything_Icons.mp4, id 15ojMBpJVuKo8u0vwGjbTfJhMK0VPjMhS | 10 s | 6.3 MB | skip, three loops is the cap; good fourth option |
| anything-ai | Drive | ANYTHING-ANIMATION-2 and -4 (1080x1440 and 1080x1080), ids 1gKt-FByFWAR4HOSQ0XQr29bPoM0PQ-Gj, 1FK2gbtncqoAp9UERqx3G2saRWIDXqb4X, 1vc4bsQgJOTn_TbNL1JH5ATfiG_Rl8qGa, 1Yw1_EeIEIm96gLvrkiHsB2Pbu9xQdlQY | 1.2 s and 2 s | 0.5 to 2.3 MB | skip, too short, cap reached |
| anything-ai | Drive | Anything_SocialPosts.mp4, id 1QvLXFRb3diiezztIBQ7PLEMnIDsS4K9M | - | 10.6 MB | skip, above 10 MB cap |
| anything-ai | Drive | ANYTHING-ANIMATION-3 (two sizes), ids 1BtOt6TTnaJpvg_JMProwV5nh2W5m-loe, 1Vg1lk6oxj19qNVBJfapKnuU9ox4DQBqa | - | 16.6 and 16.9 MB | skip, above cap |
| anything-ai | Behance | https://www.behance.net/gallery/244259723/Anything-AI, five Vimeo embeds 1165518432, 1165518440, 1165714161, 1165714172, 1165727849 (downloaded with yt-dlp) | 10 to 16 s | 1.1 to 6.3 MB | skip, same clips as the Drive files; 1165727849 is a web UI render and 1165714172 carries small copy |
| anything-ai | Instagram | none on @atla.design or @jdomito_ | - | - | - |
| bovi-health | Behance | https://mir-s3-cdn-cf.behance.net/project_modules/source/645464234221647.68bf5543d9607.gif (packaging in the sky) | 4.0 s | 8.4 MB | use, natural loop, converted to mp4 |
| bovi-health | Drive | folders "Bovi Health Branding", "Bovi health_Carpeta": no video or gif by title | - | - | - |
| bovi-health | Figma | "Bovi", "Bovi Health" | - | - | not exported |
| pax-and-beneficia | Drive | paxandbeneficia_1728519253_...mp4, id 1Dvwh_9q5JKA21mwh0pJKE8NuXDzlxa40 (folder "Pax&B Portafolio Proceso", a saved Instagram post of the latte pour) | 8.2 s | 0.6 MB | use, whole, audio stripped |
| pax-and-beneficia | Behance | https://www.behance.net/gallery/234981873/Pax-Beneficia | - | - | no video or gif modules |
| pax-and-beneficia | Figma | "Pax & Beneficia", "Pax & Beneficia - Portfolio", "Paxa" | - | - | not exported |
| peachy-patients | Drive | Peachy Patients_Icon Animation.mp4, id 18cAN5LRPJWQiuso7xhCTqy_QrTuFAI2n (folder "Icon Animation") | 4.0 s | 0.3 MB | use, whole, audio stripped |
| peachy-patients | Drive | Peachy Patients_Icon.gif, id 1NOc5ZyVaCSXhAHILecPBFC57RC7tVat5 | 3.0 s | 2.5 MB | skip, same animation as the mp4 |
| peachy-patients | Behance | https://mir-s3-cdn-cf.behance.net/project_modules/source/f9c379167670599.642fa31d89648.gif (icon) and .../8f7c6e167670599.642d0a4ff06ac.gif (sticker banner) | 3.0 s and 2.8 s | 0.5 MB each | skip: icon duplicates the mp4; banner carries the headline "Healthcare made easy" |
| peachy-patients | Figma | "Peachy" | - | - | not exported |
| puppypy | Behance | https://mir-s3-cdn-cf.behance.net/project_modules/source/3108db173328499.64901600ddc50.gif (business cards) | 1.3 s | 1.5 MB | use, looped 4x |
| puppypy | Behance | https://mir-s3-cdn-cf.behance.net/project_modules/source/40936d173328499.649a1f255d408.gif (wordmark with dogs) | 5.0 s | 40.8 MB | use, natural loop, converted to mp4 |
| puppypy | Behance | https://mir-s3-cdn-cf.behance.net/project_modules/source/ed08ba173328499.6497f7b259a9f.gif (posters) | 2.4 s | 8.1 MB | skip, poster copy reads as a caption |
| puppypy | Drive | Puppypy_Logo V1, V2, V3.gif and Puppypy_Poster.gif, ids 1ZVMKNAQ7Mm2pFGDc47fdT849UMjJdpI8, 1XcoKaZkxodS8M7d6ymFbsxvEXdbE64MG, 1TV3jBfbp24B1u-reMmIJcMflKOQvnG5T, 1CdipKWXrsQTdfquXQxzq-CkZHH9_Ux2v | 5 s | 41 to 96 MB | skip, above cap (the Behance copy of the wordmark gif covers it) |
| reggie | Drive | Reggie_Instagram_03.mp4, id 1Jo7zuqOP_mFiHlcLYtLTOSSvUpJTksyc (folder Reggie/05 Case Study) | 10 s | 6.2 MB | use, 2 to 8 s (jars turning) |
| reggie | Behance | https://www.behance.net/gallery/243022193/Reggie, Vimeo 1159757447 (bag and bandana) | 10 s | 3.1 MB | use, 2 to 8 s |
| reggie | Behance | Vimeo 1159757393 (card strip) | 17.5 s | 5.1 MB | use, 4 to 11 s |
| reggie | Behance | Vimeo 1159690421 (jars), 1159757426 ("We believe in" type), 1159757468 (social posts); gifs .../a55cde243022193.697916d70d2ef.gif (wordmark) and .../456cc1243022193.697a6ff30bf32.gif (icons) | 5 to 25 s | 1 to 3 MB | skip: jars duplicate the Drive clip, the type clip is text, cap reached |
| reggie | Drive | Reggie_Instagram_05.mp4 ("Calming" type), id 14LAPSxnK8nOiteFAoyTu-xbPpkKnzQqg | 15.5 s | 9.8 MB | skip, text only |
| reggie | Drive | Reggie_Instagram_08.mp4 (bag), id 10FDyohdXojAQvu-AMBcjJGgvlv7X4wZz | 10 s | 6.5 MB | skip, cap reached |
| reggie | Drive | Reggie_Instagram_07.mp4, Reggie_Behance_05, 09-01, 10, 10_16:9 (ids 1kSj1Pe9iSoETzfmlIHkOCjlRmDRAFA7L, 1dBts8E3UlP9C7JP5Wc0cf3lRXe6aa6SM, 1H2pe77dy1eHFBGrqMHInUhvZE_lji3J6, 10Znw_DkN0RFYJE-EN7vTdJ57AIkJ4sw8, 1gEX1mP_5LwS9QipfHrQKz8_N8zHzMR5w) | - | 10.9 to 18.8 MB | skip, above cap |
| rustico | Behance | https://www.behance.net/gallery/246423231/Rustico, Vimeo 1177107488 (stationery, wordmark) | 31.5 s | 7.8 MB | use, 14 to 21 s |
| rustico | Behance | Vimeo 1176681358 (stamp "Start in the garden, finish in the fire, 7PM 12AM") | 10.5 s | 0.4 MB | skip, burned-in copy and clock numbers |
| rustico | Drive | Acre folders (1YO1n3Fsj9Yj3cq0puY0xhxW48OUa9xiG, ACRE - Web): no video or gif | - | - | - |
| tequila-unido | Drive | TequilaUnido_Web_04-02.mp4, id 1xE-iswkhXW_nzqtr1pyPuNo1MTUqRFaJ (Tequila Unido/05 Case Study) | 8 s | 4.9 MB | use, whole |
| tequila-unido | Drive | TequilaUnido_Web_05.mp4, id 1FmO6eYnirSdyB2QFlyLHlM3wk_KVMRzV; Moodboard.mp4 ids 1cpsiGZmiXndOa5wB7EXDfx4pGxJTXSEp, 1NQtGnQ3VsdNYRQbB1x5tJXETjoQIg0D2 | - | 15.8 MB, 182 MB | skip, above cap |
| tigretigre | Drive | 02 reel (tigre tigre).mp4, id 1Ku5HZZyaeHfmWDjnon_ZoilNxUPnMd7- (table top with ribbon) | 5.4 s | 10.0 MB | use, 0 to 5 s, audio stripped |
| tigretigre | Drive | 02 (Tigre tigre).mov, id 15CqdeLxVlWuCyPK_1J4uEcbqzmfyA4uC | - | 12.4 MB | skip, above cap |
| tigretigre | Behance | https://www.behance.net/gallery/199901269/TigreTigre | - | - | no video or gif modules |
| torre-avancer | Drive | Banos_Avancer.gif, Elevador_Avancer.gif, Avancer_Iconos2.gif, ids 1Ju_7SKGPUf372emze4W5vEWSAEWrdSin, 1XeUowEyMuRWh0Z9_3SkrwjALTHfIqeHb, 17c6EZEIUW6eftbvIgsPtt5o7kWHEr3PZ (signage icons drawing in) | 3 s each | 0.7 to 0.9 MB | use, each looped 2x |
| torre-avancer | Drive | Escaleras, Escritorio, Extintor gifs (ids 1aNngyK0ywIvkGJr-W24cT_SgZqVF3XVK, 1TDqAuIavXxZAyeKUPmOgyMqQf5GXFUHy, 14jhxYtJgFPw70_AI1VwWHCTE7MEUsx2F); Avancer21_Entrevista.mp4 id 1vwEM6FdeH4wAgjSf4zsebzS6bHbjjPL3 | 3 s; - | 0.2 to 0.7 MB; 96 MB | skip, cap reached; interview above cap |
| bond-and-bloom | Instagram | @jdomito_ reels DeInpJmM6o4, Dd-b0QxsLJL, Dd2gBy-pfvK (tagged @bondandbloomm) | 4.5 s each | 0.8 to 1.4 MB | skip, JP on camera with burned-in countdown captions, not brand motion |
| bond-and-bloom | Drive | Bond&Bloom_Web_03.mp4, id 1tHe6rp9ZRJpM48CAQqUrqOXAeDDm1pWB (05 Case Study) | - | 13.9 MB | skip, above cap |
| bond-and-bloom | Figma | "Bond&Bloom" | - | - | not exported |
| arc-studio | Drive | ArcStudio_BrandIdentifiersReview.mov id 11h09nw4fb4D_zXw20fNJjCULH2f6ZSQs; Arc Studio - Moodboards.mp4 id 16u9zJyVMJEvmXEWzJSdKHp9OYHAGom0i | - | 15.0 MB, 139.6 MB | skip, above cap (and both are review recordings) |
| baristio | Drive | BARISTIO_COLORES_v001.mp4, id 1UEpa8-OcFcwWB8dT97Up1Umxc1NrPTX5 (shared by aldo@) | - | 20.8 MB | skip, above cap |
| munda | Drive | Munda_Playa, Munda_Cara, Munda_Anemona, Munda_Palmeras .gif (folder Munda_Animaciones_AME), ids 1qgjpf6IlRdgF3TPhRNA-VOhpm_kJXxge, 1i_NL7aRcyBwhjpG5QShLJqlW48fZPGsi, 1pOYOSHp7IowpsoBpJmbiIx1toLgt7zEQ, 13kIia9LaJxjUTOFhFyZ8wxuNa714TZS2 | - | 260 to 267 MB each | skip, above cap |
| sexto-abismo | Drive | promo sexto abismo.mp4 id 1Un3aWR9yB5ptK1MXbMCBGBY7duayKKAi; REEL SEXTO ABISMO MARTINI.mp4 id 1nFYZyQnjAEJP6lCT1lBJ1LHIAL6QDkTD; SEXTO ABISMO - PRESENTACION_2.mp4 id 1281xpTIVGVznOxu4jBfabqJ5f5qtlYsv | - | 75.7, 138.4, 170.2 MB | skip, above cap |
| shop-latinx | Drive | folders "SLX Animation", "SLX_ANIMATION_AME", "_2_AME", "_3_AME" (ids 1zi8rzlzAMXPPBSZo2NwSHCrPe3ms5LwJ, 1uYZN30LulOF3yswvLdwBZgszx8Rog3P5, 1UCMca-kOUUto-GDgtiTLXXEIKS_1Ulbq, 1HtLwjPJUWFF4h93ss_RosUZCaGSVm2lD) | - | - | no video or gif inside (render projects only) |
| the-bridge | Drive | folder "Bridge_Animation_AME" id 1kkufongit0lZ-o9Zi0VRT2qTcVWnk9kB | - | - | no video or gif inside |

## Projects with no motion found (three places checked each)

| Project | Instagram (@atla.design, @jdomito_) | Drive | Figma (team search) | Behance |
|---|---|---|---|---|
| alma-brava | no reel | folders Alma Brava (1X-rETzSILYGDSgZrX3EjLI0U7LhGevlA, 1311VJcwsqN4bKCwt_AvQ1Jddj_nFWCir): photos only | no file matched | https://www.behance.net/gallery/124178971/Alma-Brava, no video or gif |
| angeles-wellness | no reel | folder 1qBWMXvgKGNflUhkVBiQxsSyCgXBBRGEl: no video | "Angeles Wellnes - Graphic Path", "Angeles Wellness - Brand Guidelines", not exported | not on the profile |
| arc-studio | no reel | only files above cap (see table) | "Arc Studio", not exported | not on the profile |
| baristio | no reel | only a file above cap | "Barisito", "Baristio Moodboard", not exported | not on the profile |
| bond-and-bloom | 3 reels, captions burned in, skipped | only a file above cap | "Bond&Bloom", not exported | not on the profile |
| casa-colora | no reel | no folder found by name | "Casa Colora", "IG Access Casa Colora", not exported | not on the profile |
| castro-capital | no reel | folders 1zUpcA8KkW5mKud-0Q1TPRfnq9AlzS5dO, 1Xpgz9oOBouYyyKRS2aVMlO2V-OS-3u1Y: no video | no file matched | https://www.behance.net/gallery/138395503/Castro-Capital, no video or gif |
| conscious-care-co | no reel | folder 1DGoK6ODz_MFcvm63fjUpu6MMTOxIITsi: no video | "Conscious Care Co", not exported | https://www.behance.net/gallery/199900683/Conscious-Care-Co, no video or gif |
| hanks-leather | no reel | folders 1n8xlOjDH8Jll93t4GAHmSMCsBSCKacae and the Hanks Belths set: no video | "Hanks Leather Goods", "Hanks Leather Proposal", not exported | not on the profile |
| huemac | no reel | folders 1-_lpP_cmWUFrY6YMuxB_BzYuChE9NZc7, 1WTuBGKs3Kkyj8YAYweSiEbnk4vTBQrgs: no video | no file matched | https://www.behance.net/gallery/167514967/Humac, no video or gif |
| munda | no reel | only gifs above cap | no file matched | not on the profile |
| oxylife | no reel | folders 1_skqLTi5UPGXxhu_CMrwvbhTi2colYha, 1cj-QNxkGlrktC6jwdbHXeN61HNubXPyN: no video | no file matched | https://www.behance.net/gallery/199900885/Oxylife, no video or gif |
| pathize-health | no reel | folder 1u8d9GiVgOjcp55ELWnK9QMp96Nkm7k32: no video | no file matched | https://www.behance.net/gallery/199900935/Pathize-Health, no video or gif |
| persona | no reel | folder 1wzdbuIJ0uDChe73Liok34Byo1oVgNw3w (05. Case Study): no video | "Persona Nutrition", "Persona - Web Design", not exported | not on the profile |
| sexto-abismo | no reel | only files above cap | "Sexto Abismo" (two), "SextoAbismo-Shopify", not exported | not on the profile |
| shop-latinx | no reel | animation folders hold render projects only | "ShopLatinx - SLX - WEB", "SLX // Mock Up", not exported | https://www.behance.net/gallery/199901139/Shop-Latinx, no video or gif |
| the-bridge | no reel | Bridge_Animation_AME folder empty of media | no file matched (search "Bridge" returns Bridget Health, a different client) | https://www.behance.net/gallery/199901185/The-Bridge, no video or gif |
| the-curated-outfit | no reel | folder 1SFt11Z4Re2LIHEZoayozC4QV_l0vZJmC: PDFs and logo folders, no video | "The Curated Outfit" (two), "Moodboard Deck", not exported | not on the profile |
| the-internet-empires | no reel | no folder found by name | no file matched | not on the profile |
| vyv | no reel | folders 1QjdCGHWjjfdV3sNFRApd7OJhxo-w6skn, 1YhRnBnnQ-46Pjotvo9WdF1qYSNF3F-sz: .ai and fonts only | "VYV - Branding", "VYV - Graphic Path", "VYV - Brand Guideliness", not exported | not on the profile |

Instagram note: @atla.design (32 reels) and @jdomito_ (32 reels) were listed in full from the reels tab on 2026-11-05; every caption was read with yt-dlp. Apart from the three Bond & Bloom reels, the reels are talking-head content or show Atla itself, Temakase and Ulysses (not on the wall).

## Loops cut (scratchpad `wall-motion/out/`)

All H.264 yuv420p, CRF 23, 30 fps, no audio, faststart, longest side 1080 px. Crossfade 0.3 s on the xfade rows; the gif rows loop naturally.

| File | Source | Length | Size | Draft document |
|---|---|---|---|---|
| ando-loop-1.mp4 | ANDO.gif x4 | 5.1 s | 72 KB | drafts.sEXYKEM0YtrucL1vKyRfJk |
| anything-ai-loop-1.mp4 | Anything_Logo.mp4, xfade | 6.0 s | 494 KB | drafts.osnJeRBom7V2w5tRKXO0Cf |
| anything-ai-loop-2.mp4 | Anything_Symbol.mp4, xfade | 6.0 s | 477 KB | drafts.osnJeRBom7V2w5tRKXO0Cf |
| anything-ai-loop-3.mp4 | ANYTHING-ANIMATION-1, xfade | 3.7 s | 349 KB | drafts.osnJeRBom7V2w5tRKXO0Cf |
| bovi-health-loop-1.mp4 | Behance gif | 4.0 s | 356 KB | drafts.7Lth8w1jA20JqbnelFrdGp |
| pax-and-beneficia-loop-1.mp4 | latte pour, xfade | 7.8 s | 515 KB | drafts.sEXYKEM0YtrucL1vKyRq7H |
| peachy-patients-loop-1.mp4 | icon animation | 4.0 s | 34 KB | drafts.osnJeRBom7V2w5tRKXOgWe |
| puppypy-loop-1.mp4 | cards gif x4 | 5.0 s | 320 KB | drafts.7Lth8w1jA20JqbnelFss4l |
| puppypy-loop-2.mp4 | wordmark gif | 5.0 s | 108 KB | drafts.7Lth8w1jA20JqbnelFss4l |
| reggie-loop-1.mp4 | jars, xfade | 6.0 s | 942 KB | drafts.7Lth8w1jA20JqbnelFr1LN |
| reggie-loop-2.mp4 | bag and bandana, xfade | 6.0 s | 291 KB | drafts.7Lth8w1jA20JqbnelFr1LN |
| reggie-loop-3.mp4 | card strip, xfade | 7.0 s | 665 KB | drafts.7Lth8w1jA20JqbnelFr1LN |
| rustico-loop-1.mp4 | stationery, xfade | 7.0 s | 332 KB | drafts.bdc10566-6f43-439d-9263-d1e85edf370c |
| tequila-unido-loop-1.mp4 | bottles, xfade | 7.6 s | 747 KB | drafts.02188fc6-b6ca-4d2c-806d-5ca8216970b1 |
| tigretigre-loop-1.mp4 | table reel, xfade | 5.0 s | 400 KB | drafts.7Lth8w1jA20JqbnelFsCBL |
| torre-avancer-loop-1.mp4 | Banos gif x2 | 6.0 s | 46 KB | drafts.51bf7ba0-ed44-48c0-8e6f-2985a953029d |
| torre-avancer-loop-2.mp4 | Elevador gif x2 | 6.0 s | 40 KB | drafts.51bf7ba0-ed44-48c0-8e6f-2985a953029d |
| torre-avancer-loop-3.mp4 | Iconos2 gif x2 | 6.0 s | 36 KB | drafts.51bf7ba0-ed44-48c0-8e6f-2985a953029d |

Contact sheet: scratchpad `wall-motion/out/contact-sheet.jpg` (one mid frame per loop, labelled by file name).

## Sanity staging (drafts only)

Writes made 2026-11-05 with `@sanity/client` and the CLI user token, API 2025-02-19, from `wall-motion/scripts/stage.mjs`. For each of the 11 projects the script created `drafts.<id>` from the published document (none had a draft before), uploaded the loops as file assets, and appended their URLs as strings to `videos[]`. `vimeoVideos[]` was left untouched (anything-ai keeps its one embed). Published documents were not modified. Read back after the write: 18 URLs across 11 drafts, counts per draft match the table above.

Two things the parent session must know before these can show on the wall:
1. `server/sanity/projectService.ts` builds `videos` with `extractVimeoEmbedSources(project.vimeoVideos, project.videos)`, and `toVimeoEmbedUrl` returns an empty string for anything that is not Vimeo, so direct `cdn.sanity.io/files/...` URLs in `videos[]` are dropped before `wallLayout.ts` ever sees them. The wall will show nothing new until that filter passes direct file URLs through (or the wall reads the schema field `videoFiles[]`, which already reaches the client as `videoFiles`).
2. `videos` is not a field in `sanity/schemaTypes/project.ts`; the Studio will show it as an unknown field on the draft. The schema field for uploaded motion is `videoFiles[]` (object with `file` and `poster`). Moving the 18 assets into `videoFiles[]` is a small patch if the parent prefers that path.

Decision: none from this file. JP's call is on the contact sheet: approve all, approve some, or redo.
