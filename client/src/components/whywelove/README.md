# Why We Love the Brands We Love — the web system

The visual system for `love.atla.design`, built from the WWLTBWL design guide.
It is paper and ink: a research document, printed, photocopied and annotated.

## The Mirror

The page's engine is the live read: a visitor gives a brand, and the page shows
them where their own customers say the love leaks. `server/brandRead.ts` finds
real public review and forum pages, scrapes them, and has Claude map each post
onto the journey. `BrandRead.tsx` renders it.

Two rules the server exists to protect:

1. **Nothing is invented.** Every quote is checked back against the fetched text
   before it leaves the server (`keepOnlyRealQuotes`), so a paraphrase or an
   invention is dropped rather than shown. A brand with no public corpus returns
   `no_corpus`, never a plausible guess.
2. **The free read stops at the leak.** The twenty-five touchpoints, the fixes
   and the filled kit are what a Brand Read is for.

### Hardening

The corpus is public writing, so it is treated as hostile input end to end:

- `isCorpusUrl` matches the parsed hostname against an allowlist and requires
  https, so a planted page at `evil.example/trustpilot.com` cannot enter the
  corpus. A substring test let that through.
- `sanitizeCorpus` strips control characters and any tag that would let planted
  text pose as our own scaffolding, and the corpus is delimited and declared as
  data in the prompt. Text that tries to instruct the model stays in the corpus
  as a post to classify.
- `sanitizeOutbound` strips links and markup from everything the page renders
  and caps its length, because the model's output is shaped by text strangers
  wrote.
- `keepOnlyRealQuotes` runs before sanitising, so cleaning a string can never
  turn a fabricated quote into one that matches.

`npm run test:brand-read` covers all of it, plus input validation. No keys, no
network, no database needed.

It needs `FIRECRAWL_API_KEY` and `ANTHROPIC_API_KEY` in the environment. Without
both, the endpoint answers 503 and the page says the live read is not switched
on yet. Reads are cached per brand for 24 hours and rate limited to five per hour per
caller, because each uncached read spends real money. The ledger is a Postgres
table keyed by a salted hash of the address when `DATABASE_URL` is set, so the
limit holds across serverless instances; without a database it falls back to
in-memory, which only limits per instance. The caller is identified from
`x-vercel-forwarded-for`, which the platform sets, rather than the
client-supplied `x-forwarded-for`.

For local work, `BRAND_READ_FIXTURE=1 npm run dev` serves a fixture instead of
calling anything. It is refused in production regardless of the flag.

## Files

- `styles.ts` — the tokens: ink, paper, card, the two type stacks, the four
  easing families.
- `Paper.tsx` — the printed surface and the ink-bleed filter.
- `primitives.tsx` — step labels, the roman/italic headline, body, source tags,
  quote strips, drawn rules.
- `RingDiagram.tsx` — the Canvas, the framework's emblem.
- `BrandRead.tsx` — the Mirror: the input, the job log, and the report.
- `KitViewer.tsx` — the kit a Brand Read ships.

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
- Only real numbers, and no example brand. The page carries no case study: the
  live read is about whoever is looking at it.
