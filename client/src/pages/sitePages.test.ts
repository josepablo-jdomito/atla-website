// @vitest-environment jsdom
import { act, createElement, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Services from "./Services";
import About from "./About";
import Contact from "./Contact";
import { ContactForm } from "@/components/site/ContactForm";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_EMAIL, SOCIAL_PROFILES } from "@shared/siteSeo";

const analytics = vi.hoisted(() => ({ trackEvent: vi.fn(), ga4Event: vi.fn() }));
vi.mock("@/hooks/use-analytics", () => ({ trackEvent: analytics.trackEvent }));
vi.mock("@/lib/ga", () => ({ ga4Event: analytics.ga4Event }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

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
  vi.unstubAllGlobals();
  analytics.trackEvent.mockClear();
  analytics.ga4Event.mockClear();
});

function render(Page: ComponentType, path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, enabled: false } } });
  const location = memoryLocation({ path });
  act(() =>
    root.render(
      createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook }, createElement(Page))),
    ),
  );
}

const main = () => container.querySelector("main")!;

describe("Services page", () => {
  it("has one h1 and the four moments as h2 sections, in order", () => {
    render(Services, "/services");
    expect(main().querySelectorAll("h1")).toHaveLength(1);
    const titles = Array.from(main().querySelectorAll("section.moment > h2")).map((h) => h.textContent);
    expect(titles).toEqual(["Launch", "Raise capital", "Grow / scale", "Reposition"]);
  });

  it("lists what we do in every moment and links each to the brief with an encoded seed", () => {
    render(Services, "/services");
    const sections = Array.from(main().querySelectorAll<HTMLElement>("section.moment"));
    expect(sections).toHaveLength(4);
    sections.forEach((section, i) => {
      const moment = siteCopy.services.moments[i];
      expect(section.querySelectorAll(".moment__list li").length).toBeGreaterThan(0);
      const links = Array.from(section.querySelectorAll<HTMLAnchorElement>('a[href^="/brief"]'));
      expect(links).toHaveLength(1);
      expect(links[0].getAttribute("href")).toBe(`/brief?seed=${encodeURIComponent(moment.seed)}`);
      expect(new URL(links[0].href, "https://x.test").searchParams.get("seed")).toBe(moment.seed);
    });
  });

  it("shows no prices", () => {
    render(Services, "/services");
    const text = main().textContent ?? "";
    expect(text).not.toMatch(/\$|USD|€|£|\b\d+\s?[kK]\b|\bper (month|hour|project)\b|pricing|price/i);
  });
});

describe("About page", () => {
  it("has one h1, h2 section headings, and four or five how-we-work steps without numbers", () => {
    render(About, "/about");
    expect(main().querySelectorAll("h1")).toHaveLength(1);
    const h2s = Array.from(main().querySelectorAll("h2")).map((h) => h.textContent);
    expect(h2s).toEqual([siteCopy.about.howLabel, siteCopy.about.teamLabel]);
    const steps = main().querySelectorAll(".how-step");
    expect(steps.length).toBeGreaterThanOrEqual(4);
    expect(steps.length).toBeLessThanOrEqual(5);
    for (const step of Array.from(steps)) expect(step.textContent).not.toMatch(/\d/);
  });

  it("renders the team as names and roles with no images", () => {
    render(About, "/about");
    const team = main().querySelector('[data-block="team"]')!;
    expect(team.querySelectorAll("img, picture, svg image")).toHaveLength(0);
    const names = Array.from(team.querySelectorAll(".team-list__name")).map((el) => el.textContent);
    expect(names).toEqual(siteCopy.about.team.map((m) => m.name));
    expect(team.textContent).toContain("Mexico City");
  });
});

describe("Contact page", () => {
  it("shows email, socials, cities, a brief link and the fallback form", () => {
    render(Contact, "/contact");
    expect(main().querySelectorAll("h1")).toHaveLength(1);
    expect(main().querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`)).not.toBeNull();
    for (const social of SOCIAL_PROFILES) expect(main().querySelector(`a[href="${social.href}"]`)).not.toBeNull();
    expect(main().textContent).toContain("Caracas");
    expect(main().querySelector('a[href="/brief"]')).not.toBeNull();
    const form = main().querySelector("form")!;
    expect(form.getAttribute("action")).toBe("/api/contact");
    expect(form.getAttribute("method")).toBe("post");
  });
});

function fill(form: HTMLFormElement, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values)) {
    (form.elements.namedItem(name) as HTMLInputElement).value = value;
  }
}

async function submit(form: HTMLFormElement) {
  await act(async () => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

describe("ContactForm", () => {
  it("posts the same JSON payload as before and shows the confirmation", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    act(() => root.render(createElement(ContactForm)));
    const form = container.querySelector("form")!;
    fill(form, { name: "Ana", email: "ana@example.com", company: "Acme", budget: "not-sure", timeline: "exploring", message: "We are opening a hotel." });
    await submit(form);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(String(init.body))).toEqual({
      name: "Ana",
      email: "ana@example.com",
      company: "Acme",
      budget: "not-sure",
      timeline: "exploring",
      message: "We are opening a hotel.",
      _gotcha: "",
    });
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector('[role="status"]')!.textContent).toContain("Received.");
    expect(analytics.trackEvent).toHaveBeenCalledWith("contact_form_submit", { page: "contact" });
    expect(analytics.ga4Event).toHaveBeenCalledWith("generate_lead", { form: "contact" });
  });

  it("falls back to email when the form is offline (503)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 503 })));
    act(() => root.render(createElement(ContactForm)));
    const form = container.querySelector("form")!;
    fill(form, { name: "Ana", email: "ana@example.com", message: "We are opening a hotel." });
    await submit(form);
    const alert = container.querySelector('[role="alert"]')!;
    expect(alert.textContent).toContain("offline");
    expect(alert.querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`)).not.toBeNull();
    expect(analytics.trackEvent).not.toHaveBeenCalled();
  });

  it("shows the server's validation message on a 400", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: "Add a longer message." }), { status: 400 })));
    act(() => root.render(createElement(ContactForm)));
    await submit(container.querySelector("form")!);
    expect(container.querySelector('[role="alert"]')!.textContent).toBe("Add a longer message.");
  });
});
