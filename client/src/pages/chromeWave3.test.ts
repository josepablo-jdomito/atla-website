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
