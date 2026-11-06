import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")) as {
  headers: Array<{ headers: Array<{ key: string; value: string }> }>;
};
const csp = config.headers.flatMap((rule) => rule.headers).find((header) => header.key === "Content-Security-Policy")!.value;
const directive = (name: string) =>
  csp
    .split(";")
    .map((part) => part.trim().split(/\s+/))
    .find(([key]) => key === name)
    ?.slice(1) ?? [];

describe("vercel.json CSP", () => {
  it("loads nothing from Clarity or Bing", () => {
    expect(csp).not.toMatch(/clarity|bing/i);
  });

  it("connect-src names its hosts: self, Sanity, GA, Vimeo, Calendly, and no blanket https:", () => {
    const hosts = directive("connect-src");
    expect(hosts).not.toContain("https:");
    expect(hosts).toEqual(expect.arrayContaining(["'self'", "https://cdn.sanity.io", "https://*.google-analytics.com", "https://*.analytics.google.com", "https://player.vimeo.com", "https://calendly.com"]));
    for (const host of hosts.filter((h) => h !== "'self'")) {
      expect(host, host).toMatch(/^https:\/\/(\*\.)?[a-z0-9.-]*(sanity\.io|google-analytics\.com|analytics\.google\.com|googletagmanager\.com|vimeo\.com|calendly\.com)$/);
    }
  });

  it("lets the Sanity CDN video loops play", () => {
    expect(directive("media-src")).toEqual(["'self'", "https://cdn.sanity.io"]);
  });
});
