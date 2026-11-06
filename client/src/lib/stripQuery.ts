/**
 * Vercel Analytics and Speed Insights report the page URL. The work wall writes the typed search
 * into `?q=` and old links carry `?seed=`, so both are cut to origin and path before they leave
 * the browser (the same rule cleanPageLocation applies to GA4).
 */
export function stripQuery<T extends { url: string }>(event: T): T {
  try {
    const url = new URL(event.url);
    return { ...event, url: `${url.origin}${url.pathname}` };
  } catch {
    return { ...event, url: event.url.split(/[?#]/)[0] };
  }
}
