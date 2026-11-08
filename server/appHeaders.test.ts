import http from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { SITE_ORIGIN } from "../shared/siteSeo.ts";
import { SECURITY_HEADERS } from "../shared/securityHeaders.ts";

// The whole app, as it is served off Vercel: headers set by Express, sitemap and feed built from a constant.
let server: http.Server;
let port = 0;

beforeAll(async () => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("SANITY_PROJECT_ID", "");
  const { app, ready } = await import("./app.ts");
  await ready;
  server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  port = (server.address() as AddressInfo).port;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  vi.unstubAllEnvs();
});

/** `fetch` will not let a script set Host; http.request will. */
function get(path: string, headers: Record<string, string> = {}) {
  return new Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }>((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path, headers }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body }));
    });
    req.on("error", reject);
    req.end();
  });
}

describe("security headers in Express", () => {
  it("carries every header vercel.json sets, on API answers too, and hides the framework", async () => {
    const res = await get("/api/projects");
    for (const { key, value } of SECURITY_HEADERS) expect(res.headers[key.toLowerCase()], key).toBe(value);
    expect(res.headers["x-frame-options"]).toBe("DENY");
    expect(res.headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});

describe("sitemap and feed origin", () => {
  it("never follows Host or X-Forwarded-Host: every URL starts at the site's own origin", async () => {
    for (const headers of [
      { host: "phish.example" },
      { "x-forwarded-host": "evil.attacker.example", "x-forwarded-proto": "http" },
    ]) {
      const sitemap = await get("/api/sitemap.xml", headers);
      expect(sitemap.status).toBe(200);
      const locs = Array.from(sitemap.body.matchAll(/<loc>([^<]*)<\/loc>/g), (m) => m[1]);
      expect(locs.length).toBeGreaterThan(0);
      for (const loc of locs) expect(loc.startsWith(`${SITE_ORIGIN}/`), loc).toBe(true);
      expect(sitemap.body).not.toMatch(/phish\.example|attacker/);

      const feed = await get("/api/feed.xml", headers);
      expect(feed.body).toContain(`<link>${SITE_ORIGIN}/journal</link>`);
      expect(feed.body).not.toMatch(/phish\.example|attacker/);
    }
  });
});

describe("cache headers (fix pass A)", () => {
  function post(path: string, body: string) {
    return new Promise<{ status: number; headers: http.IncomingHttpHeaders }>((resolve, reject) => {
      const req = http.request(
        { host: "127.0.0.1", port, path, method: "POST", headers: { "content-type": "application/json" } },
        (res) => {
          res.resume();
          res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers }));
        },
      );
      req.on("error", reject);
      req.end(body);
    });
  }

  it("caches a content answer at the edge only when it is a 200", async () => {
    const list = await get("/api/projects");
    expect(list.status).toBe(200);
    expect(list.headers["cache-control"]).toBe("public, s-maxage=300, stale-while-revalidate=600");
    const missing = await get("/api/projects/no-such-project");
    expect(missing.status).toBe(404);
    expect(missing.headers["cache-control"]).toBe("no-store");
  });

  it("never caches what a visitor posts", async () => {
    for (const path of ["/api/contact", "/api/brief/submit", "/api/brand-check"]) {
      const res = await post(path, "{}");
      expect(res.headers["cache-control"], path).toBe("no-store");
    }
  });
});
