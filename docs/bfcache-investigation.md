# bfcache Investigation (/projects/[slug])

## Scope
- Route: `/projects/[slug]`
- Goal: Ensure back/forward cache eligibility or document unavoidable blockers.

## Findings
- No `unload`/`beforeunload` listeners are registered in app code.
- No service worker registration is present in app code.
- Project detail route uses cacheable headers (`public, s-maxage=300, stale-while-revalidate=86400`).
- External scripts are loaded with `afterInteractive`; these can still affect bfcache in some browser/runtime combinations.

## Status
- Expected status in Lighthouse: `bf-cache` should pass for most runs.
- If a run fails only due browser extensions, automation tooling, or third-party runtime behavior, treat as external blocker and attach run evidence.

## Mitigation/Next Actions
1. Keep third-party scripts minimal on detail pages.
2. Re-test with a clean Chrome profile in CI and local verification.
3. If failures persist with clean profile, capture DevTools bfcache diagnostics and log root cause in this file.
