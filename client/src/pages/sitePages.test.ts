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
  const services = siteCopy.services;
  const radios = () => Array.from(main().querySelectorAll<HTMLButtonElement>('[role="radiogroup"] [role="radio"]'));
  const radio = (id: string) => main().querySelector<HTMLButtonElement>(`[role="radio"][data-moment="${id}"]`)!;
  const rowIds = (group?: string) =>
    Array.from(main().querySelectorAll<HTMLElement>(`section.discipline${group ? `[data-group="${group}"]` : ""}`)).map((s) => s.id);
  const reset = () => main().querySelector<HTMLButtonElement>(".services-what__reset");
  const actTwo = () => main().querySelector(".services-what__title")!.textContent;
  const lineOf = (id: string) => main().querySelector(`section.discipline#${id} .discipline__line`)!.textContent;
  const key = (target: Element, k: string) =>
    act(() => {
      target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
    });

  afterEach(() => window.history.replaceState(null, "", "/"));

  it("opens with one h1 asking where you are, the four moments as a radiogroup, then the disciplines as h2 rows", () => {
    render(Services, "/services");
    const h1s = main().querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(services.title);
    const group = main().querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute("aria-labelledby")).toBe(h1s[0].id);
    // The picker comes before every discipline row.
    expect(group.compareDocumentPosition(main().querySelector("section.discipline")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(radios().map((r) => r.querySelector(".moment-picker__title")?.textContent)).toEqual(services.moments.map((m) => m.title));
    for (const m of services.moments) expect(radio(m.id).textContent).toContain(m.line);
    expect(services.moments.map((m) => m.title)).toContain("Grow");
    const titles = Array.from(main().querySelectorAll("section.discipline > h2")).map((h) => h.textContent);
    expect(titles).toEqual(services.disciplines.map((d) => d.title));
  });

  it("with no moment, no radio is checked, act two reads What we do., and every discipline shows its general line", () => {
    render(Services, "/services");
    expect(radios().filter((r) => r.getAttribute("aria-checked") === "true")).toHaveLength(0);
    expect(radios().map((r) => r.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(actTwo()).toBe(services.disciplinesTitle);
    expect(reset()).toBeNull();
    expect(rowIds()).toEqual(services.disciplines.map((d) => d.id));
    expect(rowIds("also")).toEqual([]);
    expect(main().querySelector(".services-also")).toBeNull();
    for (const d of services.disciplines) expect(lineOf(d.id)).toBe(d.line);
    expect(main().querySelector(".engagements__lead")?.textContent).toBe(services.engagementsLead);
  });

  it("arriving with ?moment= pre-selects it; an unknown moment reads as any moment", () => {
    window.history.replaceState(null, "", "/services?moment=raise");
    render(Services, "/services");
    expect(radio("raise").getAttribute("aria-checked")).toBe("true");
    expect(radio("raise").tabIndex).toBe(0);
    expect(radios().filter((r) => r.tabIndex === 0)).toHaveLength(1);
    act(() => root.unmount());
    root = createRoot(container);
    window.history.replaceState(null, "", "/services?moment=someday");
    render(Services, "/services");
    expect(radios().filter((r) => r.getAttribute("aria-checked") === "true")).toHaveLength(0);
    expect(actTwo()).toBe(services.disciplinesTitle);
  });

  it("choosing a moment writes it to the URL and echoes it in act two; the Any moment reset beside it clears both", () => {
    window.history.replaceState(null, "", "/services");
    render(Services, "/services");
    act(() => radio("grow").click());
    expect(window.location.search).toBe("?moment=grow");
    expect(radio("grow").getAttribute("aria-checked")).toBe("true");
    expect(actTwo()).toBe(services.disciplinesTitleByMoment.grow);
    expect(reset()?.textContent).toBe(services.allMoments);
    // The reset sits in the act-two header, beside its heading, not in the picker.
    expect(reset()!.closest(".services-what")).not.toBeNull();
    expect(reset()!.closest('[role="radiogroup"]')).toBeNull();
    act(() => reset()!.click());
    expect(window.location.search).toBe("");
    expect(radios().filter((r) => r.getAttribute("aria-checked") === "true")).toHaveLength(0);
    expect(actTwo()).toBe(services.disciplinesTitle);
    expect(reset()).toBeNull();
  });

  it("arrow keys move the choice with roving tabindex, wrap around, and Home/End jump", () => {
    window.history.replaceState(null, "", "/services?moment=launch");
    render(Services, "/services");
    radio("launch").focus();
    key(radio("launch"), "ArrowDown");
    expect(window.location.search).toBe("?moment=raise");
    expect(document.activeElement).toBe(radio("raise"));
    expect(radio("raise").tabIndex).toBe(0);
    expect(radio("launch").tabIndex).toBe(-1);
    key(radio("raise"), "ArrowRight");
    expect(window.location.search).toBe("?moment=grow");
    key(radio("grow"), "ArrowUp");
    key(radio("raise"), "ArrowLeft");
    key(radio("launch"), "ArrowLeft");
    expect(document.activeElement).toBe(radio("reposition"));
    expect(window.location.search).toBe("?moment=reposition");
    key(radio("reposition"), "ArrowRight");
    expect(window.location.search).toBe("?moment=launch");
    key(radio("launch"), "End");
    expect(radio("reposition").getAttribute("aria-checked")).toBe("true");
    key(radio("reposition"), "Home");
    expect(radio("launch").getAttribute("aria-checked")).toBe("true");
  });

  it("reads every discipline through the moment; the rest drop to Also, when you need it, and none vanish", () => {
    for (const m of services.moments) {
      window.history.replaceState(null, "", `/services?moment=${m.id}`);
      render(Services, "/services");
      const applies = services.disciplines.filter((d) => (d.moments as readonly string[]).includes(m.id));
      const rest = services.disciplines.filter((d) => !(d.moments as readonly string[]).includes(m.id));
      expect(rowIds("relevant")).toEqual(applies.map((d) => d.id));
      expect(rowIds("also")).toEqual(rest.map((d) => d.id));
      expect(rowIds()).toHaveLength(services.disciplines.length);
      expect(actTwo()).toBe(services.disciplinesTitleByMoment[m.id]);
      for (const d of applies) expect(lineOf(d.id)).toBe(d.byMoment[m.id]);
      for (const d of rest) expect(lineOf(d.id)).toBe(d.line);
      const also = main().querySelector(".services-also");
      if (rest.length) {
        expect(also?.textContent).toBe(services.alsoLabel);
        // The label sits between the two groups.
        const firstAlso = main().querySelector(`section.discipline#${rest[0].id}`)!;
        expect(also!.compareDocumentPosition(firstAlso) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      } else expect(also).toBeNull();
      expect(main().querySelector(".engagements__lead")?.textContent).toBe(services.engagementsByMoment[m.id]);
    }
  });

  it("announces the change once in one polite live region, not per row", () => {
    render(Services, "/services");
    const live = main().querySelectorAll('[aria-live]');
    expect(live).toHaveLength(1);
    expect(live[0].getAttribute("aria-live")).toBe("polite");
    expect(live[0].textContent).toBe("");
    act(() => radio("reposition").click());
    expect(live[0].textContent).toBe(`${services.liveFor} Reposition.`);
    act(() => reset()!.click());
    expect(live[0].textContent).toBe(services.liveAny);
  });

  it("every Start a project link goes to /brief, plain, whatever the moment", () => {
    window.history.replaceState(null, "", "/services?moment=raise");
    render(Services, "/services");
    const sections = Array.from(main().querySelectorAll<HTMLElement>("section.discipline"));
    expect(sections.length).toBe(services.disciplines.length);
    for (const section of sections) {
      expect(section.querySelectorAll(".discipline__list li").length).toBeGreaterThan(0);
      expect(section.querySelector<HTMLAnchorElement>("a.discipline__cta")?.getAttribute("href")).toBe("/brief");
    }
    for (const a of Array.from(main().querySelectorAll<HTMLAnchorElement>("a")).filter((a) => a.textContent === services.cta)) {
      expect(a.getAttribute("href")).toBe("/brief");
    }
  });

  it("shows no prices", () => {
    render(Services, "/services");
    const text = main().textContent ?? "";
    expect(text).not.toMatch(/\$|USD|€|£|\b\d+\s?[kK]\b|\bper (month|hour|project)\b|pricing|price/i);
  });
});

describe("Services copy read through a moment", () => {
  const services = siteCopy.services;
  const BANNED = /game-?changer|elevate|authentic|next level|synergy|leverage|robust/i;
  const lines = [
    ...services.disciplines.flatMap((d) => services.moments.map((m) => [`${d.id}.${m.id}`, d.byMoment[m.id]] as const)),
    ...services.moments.map((m) => [`engagements.${m.id}`, services.engagementsByMoment[m.id]] as const),
    ...services.moments.map((m) => [`actTwo.${m.id}`, services.disciplinesTitleByMoment[m.id]] as const),
  ];

  it("every discipline has exactly one line for each of the four moments", () => {
    for (const d of services.disciplines) {
      expect(Object.keys(d.byMoment).sort()).toEqual(services.moments.map((m) => m.id).sort());
    }
    expect(Object.keys(services.engagementsByMoment).sort()).toEqual(services.moments.map((m) => m.id).sort());
    expect(Object.keys(services.disciplinesTitleByMoment).sort()).toEqual(services.moments.map((m) => m.id).sort());
  });

  it("no line is empty, has a digit, an em dash or a banned word", () => {
    for (const [where, line] of lines) {
      expect(line.trim(), where).not.toBe("");
      expect(line, where).not.toMatch(/\d/);
      expect(line, where).not.toMatch(/\u2014|\u2013/);
      expect(line, where).not.toMatch(BANNED);
      expect(line, where).not.toMatch(/\$|price|pricing/i);
    }
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
