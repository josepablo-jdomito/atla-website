# Why We Love the Brands We Love — the web system

The visual system for `love.atla.design`, built from the WWLTBWL design guide.
It is paper and ink: a research document, printed, photocopied and annotated.

- `styles.ts` — the tokens: ink, paper, card, the two type stacks, the four
  easing families.
- `Paper.tsx` — the printed surface and the ink-bleed filter.
- `primitives.tsx` — step labels, the roman/italic headline, body, source tags,
  quote strips, drawn rules.
- `RingDiagram.tsx` — the Canvas, the framework's emblem.
- `JourneyChart.tsx` — the journey, the gap, and the payoff state.
- `Counter.tsx`, `LiveConsole.tsx`, `MomentMap.tsx`, `KitViewer.tsx`,
  `ColdReadDemo.tsx`, `CaseToggle.tsx` — the page's own pieces.

## Two things to close before this is finished

**Fonts.** The system is Times Now Light (JHA) for headlines and Parabolica Text
for labels. Neither file is in this repo, and the Parabolica cut in use
elsewhere is a personal-use test licence. Both are declared with `local()` in
`styles.ts`, the same way the rest of the site handles its trial cuts, so they
are picked up when installed and fall back to Times and Libre Franklin when they
are not. **Buy the web licences and drop the files into
`client/public/fonts/` before this page is promoted publicly.** Until then the
page renders in the fallbacks, which are close in colour but not the real cut.

**Textures.** The paper plate and photocopy layers are generated here with SVG
turbulence rather than shipped as scans, so there is nothing to download. The
designer's real `plate.jpg` and `photocopy.jpg` (from `Filtro.psd`) will read
better. Drop them into `client/public/fx/` and point the two background images
in `Paper.tsx` at them. Keep them static: grain that changes frame to frame is
the one thing this look must never do.

## Rules this code holds to

- No accent colour. Emphasis is weight, italic and dimming, never hue.
- Headlines are authored line by line and word by word, so breaks follow meaning
  rather than width, and nothing animates in by fading alone.
- Ink bleed is only ever applied to large serif type: it is expensive over a
  large DOM area.
- Every build-on-scroll animation resolves to its final state under
  `prefers-reduced-motion`.
- Only real numbers. The page carries 264 posts and 141 at the wait, because
  those are the two the read produced, and invents no split for the rest.
