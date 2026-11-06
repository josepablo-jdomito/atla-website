/**
 * Security headers, one list for both edges: vercel.json sets them on Vercel, server/app.ts sets the same
 * ones in Express, so a path that never touches the Vercel edge (a preview function hit, the Replit deploy,
 * `npm start`) is covered too. server/vercelCsp.test.ts fails if the two drift apart.
 */
export const SECURITY_HEADERS: ReadonlyArray<{ key: string; value: string }> = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.clarity.ms https://scripts.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; media-src 'self' https://cdn.sanity.io; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://cdn.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net https://www.clarity.ms https://*.clarity.ms; frame-src https://www.googletagmanager.com https://player.vimeo.com https://vimeo.com",
  },
  {
    key: "Referrer-Policy",
    value:
      "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value:
      "nosniff",
  },
  {
    key: "X-Frame-Options",
    value:
      "DENY",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=()",
  },
];

/** The CSP is the one header the Vite dev server cannot live under (inline refresh preamble, HMR socket). */
export const CSP_HEADER = "Content-Security-Policy";
