/** A vercel.json redirect, only the fields this check needs. Host conditions live on `has`. */
export type RedirectRule = {
  source: string;
  has?: unknown;
};

/**
 * True when this pathname is the source of a redirect that applies on every host.
 * Host-only rules (the apex and preview canonicalization) are ignored: they move
 * the host, they do not retire the path. A trailing-slash source (`/audit/`) does
 * not retire the slashless path it points at.
 */
export function pathnameRedirects(pathname: string, rules: readonly RedirectRule[]): boolean {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  for (const rule of rules) {
    if (rule.has) continue;
    const source = rule.source;
    if (!source.startsWith("/")) continue;
    if (source === path) return true;
    const wildcard = source.match(/^(.*)\/:[A-Za-z0-9_]+(?:\([^)]*\))?\*$/);
    if (!wildcard) continue;
    const prefix = wildcard[1];
    if (prefix && (path === prefix || path.startsWith(`${prefix}/`)) && path !== source) {
      // `/blog/:path*` retires `/blog/old-post`. It does not retire `/blog` itself;
      // that path has its own exact rule when it should redirect.
      if (path !== prefix) return true;
    }
  }
  return false;
}
