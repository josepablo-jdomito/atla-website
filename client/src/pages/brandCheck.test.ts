// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BrandCheck from "./BrandCheck";
import { siteCopy } from "@/content/siteCopy";
import { submitBrandCheck } from "@/components/brandCheck/brandCheckApi";

const ga = vi.hoisted(() => ({ trackBrandCheckComplete: vi.fn(), trackCalendlyClick: vi.fn() }));
vi.mock("@/lib/ga", () => ga);
vi.mock("@/hooks/use-analytics", () => ({ trackEvent: vi.fn() }));
vi.mock("@/components/brandCheck/brandCheckApi", () => ({ submitBrandCheck: vi.fn() }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const copy = siteCopy.brandCheck;
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
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, enabled: false } } });
  const location = memoryLocation({ path: "/brand-check" });
  act(() =>
    root.render(createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook }, createElement(BrandCheck)))),
  );
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.mocked(submitBrandCheck).mockReset();
  ga.trackBrandCheckComplete.mockReset();
});

const main = () => container.querySelector("main")!;
const input = (name: string) => main().querySelector<HTMLInputElement>(`[name="${name}"]:not([type="radio"])`)!;
const radio = (name: string, value: string) => main().querySelector<HTMLInputElement>(`input[type="radio"][name="${name}"][value="${value}"]`)!;
const submitButton = () => main().querySelector<HTMLButtonElement>('form button[type="submit"]')!;

function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  act(() => {
    Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function fillValid() {
  type(input("name"), "Ana Ruiz");
  type(input("email"), "ana@casamar.example");
  type(input("site"), "@casamar");
  act(() => radio("moment", "raise").click());
  act(() => radio("size", "company").click());
  act(() => radio("investing", "yes").click());
  type(main().querySelector<HTMLTextAreaElement>('textarea[name="message"]')!, "The deck first.");
}

async function submit() {
  await act(async () => {
    submitButton().click();
  });
}

describe("Brand check page", () => {
  it("is the question in one h1 and the form, nothing else: no lead, no facts, no form title, no number", () => {
    const h1s = main().querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(copy.title);
    expect(main().querySelector(".page-intro__lead")).toBeNull();
    expect(main().querySelectorAll("h2")).toHaveLength(0);
    expect(main().querySelectorAll("form")).toHaveLength(1);
    expect(main().querySelector("[placeholder]")).toBeNull();
    expect(main().textContent).not.toMatch(/optional/i);
    const text = main().textContent ?? "";
    expect(text).not.toMatch(/\d/);
    expect(text).not.toMatch(/—|–/);
  });

  it("has every field on one screen with its label, the three choices as radio groups, a honeypot and the privacy link", () => {
    for (const name of ["name", "email", "site"]) {
      const el = input(name);
      expect(el, name).toBeTruthy();
      expect(el.labels?.[0]?.textContent).toBe(copy.fields[name as "name" | "email" | "site"]);
    }
    const legends = Array.from(main().querySelectorAll("fieldset legend")).map((l) => l.textContent);
    expect(legends).toEqual([copy.fields.moment, copy.fields.size, copy.fields.investing]);
    expect(Array.from(main().querySelectorAll('input[name="moment"]')).map((r) => (r as HTMLInputElement).labels?.[0]?.textContent)).toEqual([
      "Launch",
      "Raise capital",
      "Grow",
      "Reposition",
      "Not sure",
    ]);
    expect(main().querySelectorAll('input[name="size"]')).toHaveLength(4);
    expect(main().querySelectorAll('input[name="investing"]')).toHaveLength(3);
    expect(main().querySelector('textarea[name="message"]')).toBeTruthy();
    expect(main().querySelector('[hidden] input[name="_gotcha"]')).toBeTruthy();
    const privacy = Array.from(main().querySelectorAll("a")).find((a) => a.textContent === copy.privacyLink);
    expect(privacy?.getAttribute("href")).toBe("/privacy");
    expect(submitButton().textContent).toBe(copy.submit);
  });

  it("the footer links the brand check from the Atla column", () => {
    const link = Array.from(container.querySelectorAll("footer a")).find((a) => a.textContent === "Brand check");
    expect(link?.getAttribute("href")).toBe("/brand-check");
  });

  it("an empty submit names what is missing in the brief's words, focuses the first field and sends nothing", async () => {
    await submit();
    const errors = Array.from(main().querySelectorAll(".brief-field__error")).map((p) => p.textContent);
    expect(errors).toEqual([copy.nameError, copy.emailError, copy.siteError, copy.choiceError, copy.choiceError, copy.choiceError]);
    expect(document.activeElement).toBe(input("name"));
    expect(input("name").getAttribute("aria-invalid")).toBe("true");
    expect(submitBrandCheck).not.toHaveBeenCalled();
    type(input("name"), "Ana");
    expect(main().querySelectorAll(".brief-field__error")).toHaveLength(5);
  });

  it("sends the parsed request with one id, then says Sent with the Calendly link and fires the lead with that id only", async () => {
    vi.mocked(submitBrandCheck).mockResolvedValue({ status: "ok", calendlyUrl: "https://calendly.com/atla/intro" });
    fillValid();
    await submit();
    expect(submitBrandCheck).toHaveBeenCalledTimes(1);
    const [request, submissionId, honeypot] = vi.mocked(submitBrandCheck).mock.calls[0];
    expect(request).toEqual({
      name: "Ana Ruiz",
      email: "ana@casamar.example",
      site: "@casamar",
      moment: "raise",
      size: "company",
      investing: "yes",
      message: "The deck first.",
    });
    expect(submissionId).toMatch(/^[A-Za-z0-9-]{8,64}$/);
    expect(honeypot).toBe("");
    expect(ga.trackBrandCheckComplete).toHaveBeenCalledWith(submissionId);
    expect(main().querySelector(".bcheck-ask__title")?.textContent).toBe(copy.doneTitle);
    expect(main().textContent).toContain(copy.done);
    const book = Array.from(main().querySelectorAll("a")).find((a) => a.textContent === copy.bookCall);
    expect(book?.getAttribute("href")).toBe("https://calendly.com/atla/intro");
    expect(main().querySelector("form")).toBeNull();
  });

  it("a failed send keeps what was written, reads Try again, and the retry reuses the same id", async () => {
    vi.mocked(submitBrandCheck).mockResolvedValueOnce({ status: "failed" });
    fillValid();
    await submit();
    expect(main().querySelector(".bcheck-status")?.textContent).toBe(copy.network);
    expect(submitButton().textContent).toBe(copy.retry);
    expect(input("name").value).toBe("Ana Ruiz");
    expect(radio("moment", "raise").checked).toBe(true);
    expect(ga.trackBrandCheckComplete).not.toHaveBeenCalled();
    vi.mocked(submitBrandCheck).mockResolvedValueOnce({ status: "rate-limited" });
    await submit();
    expect(main().querySelector(".bcheck-status")?.textContent).toBe(copy.rateLimited);
    const ids = vi.mocked(submitBrandCheck).mock.calls.map((call) => call[1]);
    expect(new Set(ids).size).toBe(1);
  });
});

describe("Brand check copy", () => {
  it("holds no digit, dash or banned word, and the done line is JP's", () => {
    const BANNED =
      /game-?changer|elevate|authentic|next level|synergy|leverage|robust|seamless|journey|vibrant|delve|landscape|tapestry|testament|unlock/i;
    const strings = JSON.stringify(copy);
    expect(strings).not.toMatch(/\d/);
    expect(strings).not.toMatch(/—|–/);
    expect(strings).not.toMatch(BANNED);
    expect(`${copy.doneTitle} ${copy.done}`).toBe("Sent. Check your inbox for a note from José Pablo.");
  });
});
