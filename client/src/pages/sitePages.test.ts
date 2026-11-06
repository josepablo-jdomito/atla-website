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
  it("has one h1, the four moments on top, and the disciplines as h2 rows", () => {
    render(Services, "/services");
    expect(main().querySelectorAll("h1")).toHaveLength(1);
    const moments = Array.from(main().querySelectorAll(".moments-strip__item")).map((b) => b.textContent);
    expect(moments).toEqual([siteCopy.services.allMoments, ...siteCopy.services.moments.map((m) => m.title)]);
    const titles = Array.from(main().querySelectorAll("section.discipline > h2")).map((h) => h.textContent);
    expect(titles).toEqual(siteCopy.services.disciplines.map((d) => d.title));
  });

  it("every discipline lists what is included and links to the brief; a moment changes nothing in the link", () => {
    render(Services, "/services");
    const sections = Array.from(main().querySelectorAll<HTMLElement>("section.discipline"));
    expect(sections.length).toBe(siteCopy.services.disciplines.length);
    for (const section of sections) {
      expect(section.querySelectorAll(".discipline__list li").length).toBeGreaterThan(0);
      expect(section.querySelector<HTMLAnchorElement>("a.discipline__cta")?.getAttribute("href")).toBe("/brief");
    }
    const raise = siteCopy.services.moments.find((m) => m.id === "raise")!;
    const button = Array.from(main().querySelectorAll<HTMLButtonElement>(".moments-strip__item")).find((b) => b.textContent === raise.title)!;
    act(() => button.click());
    const narrowed = Array.from(main().querySelectorAll<HTMLElement>("section.discipline"));
    expect(narrowed.length).toBe(siteCopy.services.disciplines.filter((d) => (d.moments as readonly string[]).includes("raise")).length);
    const href = narrowed[0].querySelector<HTMLAnchorElement>("a.discipline__cta")!.getAttribute("href")!;
    expect(href).toBe("/brief");
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
    expect(h2s).toEqual([
      siteCopy.about.thesisLabel,
      siteCopy.about.howLabel,
      siteCopy.about.proofLabel,
      siteCopy.about.engagementsLabel,
      siteCopy.about.teamLabel,
    ]);
    const steps = main().querySelectorAll("[aria-labelledby='about-how'] .how-step");
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
  it("has one way in: the email line with the socials and cities beside it, then the form; no brief CTA, no pills", () => {
    render(Contact, "/contact");
    expect(main().querySelectorAll("h1")).toHaveLength(1);
    const email = main().querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`)!;
    expect(email).not.toBeNull();
    const form = main().querySelector("form")!;
    expect(form.getAttribute("action")).toBe("/api/contact");
    expect(form.getAttribute("method")).toBe("post");
    // The email line sits above the form.
    expect(email.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(main().querySelector('a[href="/brief"]')).toBeNull();
    // UX interview 31: email, cities, socials, the form. The footer is one line and no longer carries the socials.
    for (const social of SOCIAL_PROFILES) expect(main().querySelector(`a[href="${social.href}"]`)).not.toBeNull();
    expect(main().textContent).toContain("Austin, Mexico City, Barcelona, Lima, Caracas");
    expect(email.compareDocumentPosition(main().querySelector(`a[href="${SOCIAL_PROFILES[0].href}"]`)!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(email.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(main().querySelector(".site-pill")).toBeNull();
    expect(form.querySelectorAll('button[type="submit"]')).toHaveLength(1);
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
  it("asks no budget question, shows no price and posts no budget", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    act(() => root.render(createElement(ContactForm)));
    const form = container.querySelector("form")!;
    expect(form.querySelector('[name="budget"]')).toBeNull();
    expect(container.textContent).not.toMatch(/\$|budget/i);
    fill(form, { name: "Ana", email: "ana@example.com", message: "We are opening a hotel." });
    await submit(form);
    const body = JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(body.budget ?? "").toBe("");
  });

  it("posts the same JSON payload as before and shows the confirmation", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    act(() => root.render(createElement(ContactForm)));
    const form = container.querySelector("form")!;
    fill(form, { name: "Ana", email: "ana@example.com", company: "Acme", timeline: "exploring", message: "We are opening a hotel." });
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
