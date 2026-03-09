# Performance Evidence (Homepage + /projects)

## Render-Blocking / Critical Path

- Before: 5 explicit font preloads in layout head (`parabolica-text-regular`, `parabolica-medium`, `parabolica-bold`, `jha-times-semibold`, `jha-times-bold`).
- After: 2 explicit preloads (`parabolica-text-regular`, `jha-times-semibold`).
- Estimated critical-priority transfer drop:
- Before: ~265 KiB (`28 + 31 + 31 + 87 + 87`)
- After: ~115 KiB (`28 + 87`)
- Estimated reduction: ~150 KiB (~57%).

## Unused / Legacy JS Pressure

- `PostFeed` no longer imports Sanity client and GROQ queries into client bundle.
- Load-more now uses `/api/feed/load-more` server endpoint, reducing route-level browser JS shipped for feed pagination.
- `Sidebar` and `BottomTabBar` no longer depend on `usePathname` client hooks, removing always-mounted navigation client code from initial route JS.
