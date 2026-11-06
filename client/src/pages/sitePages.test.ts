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

function render(Page: ComponentType, path: string, seed?: (client: QueryClient) => void) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, enabled: false } } });
  seed?.(client);
  const location = memoryLocation({ path });
  act(() =>
    root.render(
      createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook }, createElement(Page))),
    ),
  );
}

const main = () => container.querySelector("main")!;

describe("Services page, one route per moment", () => {
  const services = siteCopy.services;
  const IMAGE = (id: string) => `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg`;
  // Every project the page can show, so "From the work" has its cover.
  const PROJECTS = Array.from(
    new Set([...services.moments.map((m) => m.project), services.anyProject.slug, ...services.disciplines.map((d) => d.project)]),
  ).map((slug, i) => ({ slug, title: `Project ${slug}`, coverImage: IMAGE(`s${i}`), images: [] }));
  const show = (search = "") => {
    window.history.replaceState(null, "", `/services${search}`);
    render(Services, "/services", (client) => client.setQueryData(["/api/projects"], PROJECTS));
  };
  const radios = () => Array.from(main().querySelectorAll<HTMLButtonElement>('[role="radiogroup"] [role="radio"]'));
  const radio = (id: string) => main().querySelector<HTMLButtonElement>(`[role="radio"][data-moment="${id}"]`)!;
  const rowIds = () => Array.from(main().querySelectorAll<HTMLElement>(".services-rows [data-discipline]")).map((s) => s.dataset.discipline);
  const reset = () => main().querySelector<HTMLButtonElement>(".services-what__reset");
  const actTitle = () => main().querySelector(".services-what__title")!.textContent;
  const lineOf = (id: string) => main().querySelector(`.services-rows [data-discipline="${id}"] .discipline__line`)!.textContent;
  const happens = () => Array.from(main().querySelectorAll(".services-happens__line")).map((p) => p.textContent);
  const engagementTitles = () => Array.from(main().querySelectorAll(".engagements .how-step__title")).map((h) => h.textContent);
  const key = (target: Element, k: string) =>
    act(() => {
      target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
    });
  const fitFor = (id: (typeof services.moments)[number]["id"]) =>
    services.disciplines.filter((d) => (d.moments as readonly string[]).includes(id)).map((d) => d.id);

  afterEach(() => window.history.replaceState(null, "", "/"));

  it("opens with the page title and what Atla does, then Where are you? labelling the four moments as a radiogroup", () => {
    show();
    const h1s = main().querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(services.title);
    expect(main().querySelector(".services-intro .page-intro__lead")?.textContent).toBe(services.lead);
    const group = main().querySelector('[role="radiogroup"]')!;
    const label = document.getElementById(group.getAttribute("aria-labelledby")!)!;
    expect(label.textContent).toBe(services.pickerTitle);
    expect(radios().map((r) => r.querySelector(".moment-picker__title")?.textContent)).toEqual(services.moments.map((m) => m.title));
    for (const m of services.moments) expect(radio(m.id).textContent).toContain(m.line);
  });

  it("reads top to bottom in the chosen order: picker, what happens, what we do, engagements, the work, two doors, the index", () => {
    show("?moment=raise");
    const order = [
      '[role="radiogroup"]',
      ".services-happens",
      ".services-what",
      ".engagements",
      ".services-work",
      ".services-doors",
      ".services-index",
    ].map((selector) => main().querySelector(selector)!);
    for (let i = 1; i < order.length; i += 1) {
      expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING, `step ${i}`).toBeTruthy();
    }
  });

  it("each moment is its own route: its one line, only its three or four disciplines, only its engagements, its project", () => {
    for (const m of services.moments) {
      act(() => root.unmount());
      root = createRoot(container);
      show(`?moment=${m.id}`);
      expect(happens()).toEqual(m.happens);
      expect(m.happens).toHaveLength(1);
      const fit = fitFor(m.id);
      expect(fit.length, m.id).toBeGreaterThanOrEqual(3);
      expect(fit.length, m.id).toBeLessThanOrEqual(4);
      expect(rowIds()).toEqual(fit);
      for (const id of fit) expect(lineOf(id)).toBe(services.disciplines.find((d) => d.id === id)!.byMoment[m.id]);
      expect(actTitle()).toBe(services.disciplinesTitleByMoment[m.id]);
      expect(main().querySelector(".engagements__lead")?.textContent).toBe(services.engagementsByMoment[m.id]);
      expect(engagementTitles()).toEqual(services.engagementsFit[m.id]);
      expect(engagementTitles().length).toBeLessThanOrEqual(2);
      const work = main().querySelector<HTMLAnchorElement>(".services-work__link")!;
      expect(work.getAttribute("href")).toBe(`/projects/${m.project}`);
      expect(work.querySelector(".services-work__line")?.textContent).toBe(m.projectLine);
      expect(work.querySelector("img")?.getAttribute("src")).toBeTruthy();
    }
  });

  it("the moments map to the projects JP named", () => {
    expect(Object.fromEntries(services.moments.map((m) => [m.id, m.project]))).toEqual({
      launch: "rustico",
      raise: "anything-ai",
      grow: "casa-colora",
      reposition: "hanks-leather",
    });
  });

  it("with any moment, every act shows its general version and none is empty", () => {
    show();
    expect(radios().filter((r) => r.getAttribute("aria-checked") === "true")).toHaveLength(0);
    expect(radios().map((r) => r.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(happens()).toEqual(services.happensAny);
    expect(actTitle()).toBe(services.disciplinesTitle);
    expect(reset()).toBeNull();
    expect(rowIds()).toEqual(services.anyDisciplines);
    for (const id of rowIds()) expect(lineOf(id!)).toBe(services.disciplines.find((d) => d.id === id)!.line);
    expect(main().querySelector(".engagements__lead")?.textContent).toBe(services.engagementsLead);
    expect(engagementTitles()).toEqual(services.engagements.map((e) => e.title));
    expect(main().querySelector(".services-work__link")?.getAttribute("href")).toBe(`/projects/${services.anyProject.slug}`);
    for (const selector of [".services-happens", ".services-rows", ".how-steps", ".services-work", ".services-doors", ".services-index__list"]) {
      expect(main().querySelector(selector)?.textContent?.trim(), selector).toBeTruthy();
    }
  });

  it("the index after the doors always lists every discipline, with its general line, Includes and its anchor", () => {
    for (const search of ["", "?moment=reposition"]) {
      act(() => root.unmount());
      root = createRoot(container);
      show(search);
      const rows = Array.from(main().querySelectorAll<HTMLElement>(".services-index__row"));
      expect(main().querySelector(".services-index__title")?.textContent).toBe(services.indexTitle);
      expect(rows.map((r) => r.id)).toEqual(services.disciplines.map((d) => d.id));
      for (const [i, d] of services.disciplines.entries()) {
        expect(rows[i].querySelector(".services-index__name")?.textContent).toBe(d.title);
        expect(rows[i].querySelector(".services-index__line")?.textContent).toBe(d.line);
        expect(Array.from(rows[i].querySelectorAll(".discipline__list li")).map((li) => li.textContent)).toEqual(d.includes);
      }
    }
  });

  it("two doors in one row, no lines under them: Start a project (the action) and the free brand check (a text button)", () => {
    show("?moment=grow");
    const doors = Array.from(main().querySelectorAll(".services-doors a"));
    expect(doors.map((d) => d.textContent)).toEqual(["Start a project", "Ask for a free brand check"]);
    expect(doors.map((d) => d.getAttribute("href"))).toEqual(["/brief", "/brand-check"]);
    expect(doors[0].classList.contains("site-action")).toBe(true);
    expect(doors[1].classList.contains("site-text-button")).toBe(true);
    expect(main().querySelector(".services-door__line")).toBeNull();
    expect(main().querySelector(".page-intro__lead")).toBeNull();
  });

  it("arriving with ?moment= pre-selects it; an unknown moment reads as any moment", () => {
    show("?moment=raise");
    expect(radio("raise").getAttribute("aria-checked")).toBe("true");
    expect(radio("raise").tabIndex).toBe(0);
    expect(radios().filter((r) => r.tabIndex === 0)).toHaveLength(1);
    act(() => root.unmount());
    root = createRoot(container);
    show("?moment=someday");
    expect(radios().filter((r) => r.getAttribute("aria-checked") === "true")).toHaveLength(0);
    expect(actTitle()).toBe(services.disciplinesTitle);
  });

  it("choosing a moment writes it to the URL and swaps the route; the Any moment reset clears both", () => {
    show();
    act(() => radio("grow").click());
    expect(window.location.search).toBe("?moment=grow");
    expect(radio("grow").getAttribute("aria-checked")).toBe("true");
    expect(happens()).toEqual(services.moments.find((m) => m.id === "grow")!.happens);
    expect(rowIds()).toEqual(fitFor("grow"));
    // The route fades in once after a change: one wrapper, opacity only (CSS), never on arrival.
    expect(main().querySelector(".services-route")?.classList.contains("services-fade")).toBe(true);
    expect(reset()?.textContent).toBe(services.allMoments);
    expect(reset()!.closest('[role="radiogroup"]')).toBeNull();
    act(() => reset()!.click());
    expect(window.location.search).toBe("");
    expect(radios().filter((r) => r.getAttribute("aria-checked") === "true")).toHaveLength(0);
    expect(actTitle()).toBe(services.disciplinesTitle);
  });

  it("does not fade on arrival", () => {
    show("?moment=launch");
    expect(main().querySelector(".services-route")?.classList.contains("services-fade")).toBe(false);
  });

  it("arrow keys move the choice with roving tabindex, wrap around, and Home/End jump", () => {
    show("?moment=launch");
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
    key(radio("reposition"), "ArrowRight");
    expect(window.location.search).toBe("?moment=launch");
    key(radio("launch"), "End");
    expect(radio("reposition").getAttribute("aria-checked")).toBe("true");
    key(radio("reposition"), "Home");
    expect(radio("launch").getAttribute("aria-checked")).toBe("true");
  });

  it("announces the change once in one polite live region", () => {
    show();
    const live = main().querySelectorAll("[aria-live]");
    expect(live).toHaveLength(1);
    expect(live[0].getAttribute("aria-live")).toBe("polite");
    expect(live[0].textContent).toBe("");
    act(() => radio("reposition").click());
    expect(live[0].textContent).toBe(`${services.liveFor} Reposition.`);
    act(() => reset()!.click());
    expect(live[0].textContent).toBe(services.liveAny);
  });

  it("shows no prices", () => {
    for (const search of ["", "?moment=launch", "?moment=raise", "?moment=grow", "?moment=reposition"]) {
      act(() => root.unmount());
      root = createRoot(container);
      show(search);
      expect(main().textContent ?? "").not.toMatch(/\$|USD|€|£|\b\d+\s?[kK]\b|\bper (month|hour|project)\b|pricing|price/i);
    }
  });
});

describe("Services copy read through a moment", () => {
  const services = siteCopy.services;
  const BANNED =
    /game-?changer|elevate|authentic|next level|synergy|leverage|robust|seamless|journey|vibrant|delve|landscape|tapestry|testament|unlock/i;
  const lines = [
    ...services.disciplines.flatMap((d) => services.moments.map((m) => [`${d.id}.${m.id}`, d.byMoment[m.id]] as const)),
    ...services.moments.map((m) => [`engagements.${m.id}`, services.engagementsByMoment[m.id]] as const),
    ...services.moments.map((m) => [`actTwo.${m.id}`, services.disciplinesTitleByMoment[m.id]] as const),
    ...services.moments.flatMap((m) => m.happens.map((line, i) => [`happens.${m.id}.${i}`, line] as const)),
    ...services.moments.map((m) => [`project.${m.id}`, m.projectLine] as const),
    ...services.happensAny.map((line, i) => [`happensAny.${i}`, line] as const),
    ...services.doors.map((door) => [`door.${door.href}`, door.label] as const),
    ["index", services.indexTitle] as const,
  ];

  it("every discipline has one line per moment, and every moment its engagements by real titles", () => {
    for (const d of services.disciplines) {
      expect(Object.keys(d.byMoment).sort()).toEqual(services.moments.map((m) => m.id).sort());
    }
    expect(Object.keys(services.engagementsByMoment).sort()).toEqual(services.moments.map((m) => m.id).sort());
    expect(Object.keys(services.engagementsFit).sort()).toEqual(services.moments.map((m) => m.id).sort());
    const titles = services.engagements.map((e) => e.title);
    for (const fit of Object.values(services.engagementsFit)) for (const t of fit) expect(titles).toContain(t);
    for (const id of services.anyDisciplines) expect(services.disciplines.map((d) => d.id)).toContain(id);
  });

  it("no line is empty, has a digit, an em dash or a banned word", () => {
    for (const [where, line] of lines) {
      expect(line.trim(), where).not.toBe("");
      expect(line, where).not.toMatch(/\d/);
      expect(line, where).not.toMatch(/—|–/);
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
      siteCopy.about.clientsLabel,
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
    // The cities are said once, in the page lead (and the footer), not again under the team.
    expect(team.textContent).not.toContain("Mexico City");
    expect(main().querySelector(".page-intro__lead")?.textContent).toContain("Mexico City");
  });
});

describe("Contact page", () => {
  it("has one way in: the email and the socials under the title, then the form; no labels, no lead, no brief CTA, no pills", () => {
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
    for (const social of SOCIAL_PROFILES) expect(main().querySelector(`a[href="${social.href}"]`)).not.toBeNull();
    // The cities live in the footer; the page carries no lead and no field labels beyond one per field.
    expect(main().querySelector(".page-intro__lead")).toBeNull();
    expect(main().textContent).not.toMatch(/optional|Elsewhere|Where we are/i);
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
