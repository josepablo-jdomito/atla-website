# Performance Budget

## Font Budget (Homepage)

- Limit critical preloads to two files:
- `/fonts/parabolica-text-regular.woff2`
- `/fonts/jha-times-semibold.otf`
- Keep above-the-fold font transfer under `120 KiB` total.
- Non-critical weights/styles should load on demand only.

## JS Budget

- Avoid bundling CMS SDKs in client routes.
- Client route-level JS target: keep avoidable Lighthouse "unused JavaScript" under `15 KiB` estimated savings.

## Accessibility Token Note

- `muted` text token updated to `rgb(var(--wld-muted-rgb) / 0.82)` to improve WCAG AA contrast on light surfaces.
- Dark-surface secondary copy should not use alpha below `0.75` for small text.
