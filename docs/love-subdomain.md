# love.atla.design

The "Why We Love The Brands We Love" live prototype is served at the root of
`love.atla.design`. It is built as the `/why-we-love` route of this project —
one codebase, one deploy, one extra domain.

## How it works

| Request | What happens |
|---|---|
| `love.atla.design/` | Rewritten to `/why-we-love`, serving the prerendered page |
| `love.atla.design/<anything else>` | 301 to `https://www.atla.design/<path>` |
| `www.atla.design/why-we-love` | 301 to `https://love.atla.design/` |
| `love.atla.design/robots.txt` | Rewritten to the API, which names this host's sitemap |
| `love.atla.design/api/sitemap.xml` | Returns one URL: the root |

Build assets, `/figmaAssets`, `/images`, `/favicon*`, `/security.txt`,
`/sitemap.xml` and `/api` are excluded from the catch-all redirect so the page
can load its own JavaScript and images.

The page's canonical URL is `https://love.atla.design/` on every host, baked
into the prerendered HTML and set again at runtime. It is excluded from the
main sitemap, so there is exactly one indexable URL for it.

## Where the pieces live

- `shared/siteSeo.ts` — `LOVE_HOST`, `LOVE_ORIGIN`, `WHY_WE_LOVE_PATH`
- `vercel.json` — the host-scoped redirects and rewrites
- `client/src/lib/loveHost.ts` — runtime host check
- `client/src/AppRouter.tsx` — renders the prototype at `/` on this host
- `script/build.ts` — the prerender entry, its canonical, and its sitemap opt-out
- `server/routes.ts` — the host-aware `sitemap.xml` and `robots.txt`

## One-time setup outside the repo

Both steps are manual and have to happen before the domain resolves:

1. **Vercel** — add `love.atla.design` as a domain on this project. Do not set a
   redirect on it in the Vercel UI; `vercel.json` owns the routing.
2. **DNS** — add a `CNAME` for `love` pointing at `cname.vercel-dns.com`, then
   wait for Vercel to issue the certificate.

Until both are done, `www.atla.design/why-we-love` will 301 to a host that does
not resolve yet.
