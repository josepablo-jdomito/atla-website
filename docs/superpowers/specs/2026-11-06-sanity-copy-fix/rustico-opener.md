# Rústico opener (2026-11-06)

Recommendation: open the Rústico page on the cream menu cover with the full script "rústico" wordmark, gallery item `a81c66a4e6d7`. It survives the 4:3 crop whole, and it carries no placeholder and no typo.

Decision for JP: approve this swap, sí/no.

## Why the current opener goes

The page opener is `coverImage` (asset `image-7cc46aa684db97a142951eea093612947de54122-2616x1445-png`). It is a business card mockup that reads "JOHN SMITH (MANAGER)", a placeholder phone and "JS@ACRERESORT.COM". A prospect sees a fake name as the first thing on the case.

## The pick

| field | value |
|---|---|
| gallery index today | 4 |
| `_key` | `a81c66a4e6d7` |
| asset | `image-768f3e3a0d6b5cb45773feaffe121dad2773ab23-1411x1692-png` |
| URL | https://cdn.sanity.io/images/dvufm78f/production/768f3e3a0d6b5cb45773feaffe121dad2773ab23-1411x1692.png |
| what it shows | cream menu cover, full script wordmark, centered |
| 4:3 centered crop | wordmark whole |

Alternatives, in order: leather coasters (`25760735baa9`, index 7), then the napkin (`496060326ad8`, index 1). The leather menu (`4dffcb394f37`, index 0) clips the R at 4:3.

## How the patch works

The code takes the hero as `[coverImage, ...gallery][0]` and drops a gallery item only when it sits at index 0 and matches the hero. So the patch sets `coverImage` to the pick and moves `a81c66a4e6d7` to the front of `gallery`. The John Smith card leaves the page; its asset is not deleted. The exact patch is the `rustico` entry in `patches.json`. Nothing was written to Sanity.

## Other images on this page JP should know about

| index | `_key` | issue |
|---|---|---|
| 3, 5, 8, 11 | `5b069b67a2ba`, `9787e37bd798`, `6325112b67a3`, `0aa5a21e8532` | typo "EVERY NIGTH!" in the artwork |
| 14 | `ac5f7ab5ba41` | shows reservations@rustico.com, not verified as a real address |

These stay in the gallery in this patch. Fixing the typo needs a new export from the source file.

## Same problem on other openers (checked all covers on 2026-11-06)

| slug | opener issue |
|---|---|
| arc-studio | card with "+971 55 123 4567", a placeholder phone |
| pathize-health | card "Alex Bahram, Cell Phone 831 345 3069": real name, number unverified |
| hanks-leather | 4:3 crop drops the wordmark |
| sexto-abismo | 4:3 crop cuts "SEXTO" |
| puppypy | opens on an ad comp |

All other covers are clean.

Decision: approve the Rústico opener swap.
