// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NotFound from "./not-found";
import AtlaPrivacy from "./AtlaPrivacy";
import AtlaTerms from "./AtlaTerms";
import About from "./About";
import { SiteFooter, SITE_CITIES } from "@/components/site/SiteFooter";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_EMAIL } from "@shared/siteSeo";

vi.mock("@/hooks/use-analytics", () => ({ trackEvent: vi.fn() }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CSS = readFileSync(path.resolve(import.meta.dirname, "../styles/site.css"), "utf8");

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(Page: ComponentType, location = "/") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, enabled: false } } });
  const memory = memoryLocation({ path: location });
  act(() =>
    root.render(createElement(QueryClientProvider, { client }, createElement(Router, { hook: memory.hook }, createElement(Page)))),
  );
}

describe("The footer JP chose: paper, one line, links, cities (UX interview 15)", () => {
  it("is one row: links, cities, the email, then the legal row with the cookie control; no display line, no columns", () => {
    render(SiteFooter);
    const footer = container.querySelector(".site-footer")!;
    expect(footer.querySelector(".site-footer__line, .site-footer__grid, h2, h3")).toBeNull();
    expect(Array.from(footer.children).map((el) => el.tagName.toLowerCase())).toEqual(["nav", "ul", "a", "div"]);
    expect(Array.from(footer.querySelectorAll("nav a")).map((a) => a.textContent)).toEqual(siteCopy.footer.links.map((l) => l.label));
    expect(siteCopy.footer.links.map((l) => l.label)).not.toContain("Journal");
    expect(Array.from(footer.querySelectorAll(".site-footer__cities li")).map((li) => li.textContent)).toEqual(SITE_CITIES.map((c) => c.label));
    expect(footer.querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`)).not.toBeNull();
    expect(Array.from(footer.querySelectorAll(".site-footer__legal a")).map((a) => a.textContent)).toEqual(["Privacy", "Terms"]);
    // Privacy promises this control in the footer.
    expect(footer.querySelector(".site-footer__button")?.textContent).toBe("Analytics cookies");
  });
});

describe("The client marks", () => {
  it("are inverted to light on the dark page, or they vanish", () => {
    expect(CSS).toMatch(/@media \(prefers-color-scheme: dark\) \{\s*\.client-logos__mark \{ opacity: 0\.7; \}\s*\.client-logos__mark img \{ filter: invert\(1\) grayscale\(1\); \}/);
  });

  it("stay off the legal pages and the 404, and stay on the pages that sell", () => {
    for (const [Page, path] of [[NotFound, "/nope"], [AtlaPrivacy, "/privacy"], [AtlaTerms, "/terms"]] as const) {
      render(Page, path);
      expect(container.querySelector(".client-logos"), path).toBeNull();
      expect(container.querySelector(".site-footer"), path).not.toBeNull();
    }
    render(About, "/about");
    expect(container.querySelector(".client-logos")).not.toBeNull();
  });

  it("the 404 link points nowhere but home", () => {
    render(NotFound, "/nope");
    expect(container.querySelector(".not-found__home")?.textContent).toBe("Go to home");
  });
});

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

const read = (...parts: string[]) => readFileSync(path.resolve(import.meta.dirname, "../..", ...parts), "utf8");

describe("Chrome copy (fix wave 3, group C)", () => {
  it("has no em dash and none of the banned words in any site string", () => {
    for (const text of strings(siteCopy)) {
      expect(text).not.toMatch(/—/);
      expect(text).not.toMatch(/\b(elevate\w*|authentic\w*|game-changer|next level|synergy|leverage\w*|robust|seamless\w*|journey|vibrant|delve|landscape\w*|tapestry|testament|unlock\w*)\b/i);
    }
  });

  it("the document title and the seed journal titles carry no em dash", () => {
    expect(read("index.html")).not.toMatch(/—/);
    expect(read("index.html")).toContain("<title>Atla | Branding Studio</title>");
    expect(read("src/data/atlaContent.ts")).not.toMatch(/—/);
    expect(read("src/components/seo/SeoHead.tsx")).not.toMatch(/—/);
  });

  it("says one thing about what happens to a message: we reply by email and manage the inquiry, no durations", () => {
    const { contact } = siteCopy.brief;
    expect(contact.privacyNotice).toBe(siteCopy.contact.formNotice);
    expect(contact.body).toBe(
      "Every application gets a careful read. Name and email are required so we can reach back, including when there's a faster path than working with us directly.",
    );
    for (const text of [contact.body, contact.privacyNotice, siteCopy.contact.lead, siteCopy.contact.formNotice, siteCopy.contact.sent, siteCopy.brief.done]) {
      expect(text).not.toMatch(/\d|\bhours?\b|\bdays?\b|\bweeks?\b|\byears?\b/i);
    }
    expect(siteCopy.contact.lead).toContain("replies by email");
    expect(siteCopy.contact.lead).not.toMatch(/one at a time/i);
    // The policy says the same sentence, and no longer says "for nothing else" next to a longer list of uses.
    const privacy = read("src/pages/AtlaPrivacy.tsx");
    expect(privacy).toContain("We use it to reply to you and to manage your inquiry.");
    expect(privacy).not.toContain("for nothing else");
  });

  it("the contact form's timeline options read like the brief's", () => {
    const form = read("src/components/site/ContactForm.tsx");
    for (const label of ["In the next 30 days", "1 – 3 months", "3 – 6 months", "No fixed timeline"]) expect(form).toContain(label);
    expect(form).not.toContain("1–3 months");
  });

  it("brief options are rows with a hairline, a 44px hit area, a mark on hover and focus, and a clear selected state", () => {
    expect(CSS).toMatch(/\.brief-option \{[^}]*min-height: 56px;[^}]*border-top: 1px solid var\(--site-line\);/);
    expect(CSS).toMatch(/\.brief-option::after \{[^}]*width: 16px;/);
    expect(CSS).toMatch(/\.brief-option:hover:not\(:disabled\):not\(\[aria-pressed="true"\]\)::after \{ border-color: var\(--site-muted\); \}/);
    expect(CSS).toContain(".brief-option:focus-visible::after");
    expect(CSS).toMatch(/\.brief-option\[aria-pressed="true"\]::after \{[^}]*background: var\(--site-ink\);/);
    expect(CSS).toMatch(/\.brief-prompt \{[^}]*font-family: var\(--site-display\);/);
    // Still no boxes: no background or full border on a row.
    expect(CSS).not.toMatch(/\.brief-option \{[^}]*border: 1px solid/);
  });
});
