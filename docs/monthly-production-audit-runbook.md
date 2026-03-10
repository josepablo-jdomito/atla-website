# Monthly Production Audit Runbook

## Owner
- Primary owner: Engineering (Web Platform)
- Backup owner: Product Engineering on-call

## Schedule
- Cadence: Monthly, first business day
- Trigger: Manual `workflow_dispatch` for all QA/Security workflows, plus review of latest scheduled runs

## Checklist
1. Run Lighthouse CI gate (`QA Lighthouse CI`) and verify:
   - `/` performance >= 90, accessibility >= 98, best-practices >= 95, SEO = 100
   - `/projects` performance >= 90, accessibility >= 98, best-practices >= 95, SEO = 100
   - One `/projects/[slug]` page meets same thresholds
2. Confirm no Lighthouse regressions for:
   - `label-content-name-mismatch`
   - `link-name`
   - `lcp-lazy-loaded`
   - `render-blocking-resources`
   - `unused-javascript` and `legacy-javascript` (track trend in savings)
   - `bf-cache` on project detail sample
3. Run `Security Header Regression` and verify required headers on key routes.
4. Run `QA Link and Sitemap Health` and verify:
   - robots/sitemap consistency passes
   - broken-link crawl passes for nav + sitemap routes
   - canonical and `og:url` host consistency passes
5. Run `SEO Domain Cutover Readiness` matrix for production and staging URLs.
6. Confirm `docs/perf-evidence.md` is updated with latest Lighthouse report links and key numbers.

## Reporting Format
- Destination: Monthly post in engineering channel + Jira ticket comment
- Required fields:
  - Audit date/time (local and UTC)
  - Commit SHA audited
  - Route sample used for `/projects/[slug]`
  - Score table (Perf, A11y, BP, SEO per route)
  - Key opportunities (top 3) and deltas vs previous month
  - Failures/incidents and remediation owner + due date
  - Final status: `PASS`, `PASS WITH FOLLOW-UPS`, or `FAIL`
