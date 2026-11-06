// @vitest-environment jsdom
import { act, createElement } from "react";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BRIEF_QUESTIONS } from "@shared/brief";
import { BriefFlow } from "./BriefFlow";
import { loadBrief } from "./briefStorage";
import { siteCopy } from "@/content/siteCopy";

vi.mock("./briefApi", () => ({
  submitBrief: vi.fn(),
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  sessionStorage.clear();
  window.history.replaceState(null, "", "/brief");
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

async function renderFlow(url = "/brief") {
  window.history.replaceState(null, "", url);
  await act(async () => {
    root.render(createElement(BriefFlow));
  });
}

const prompt = () => container.querySelector(".brief-prompt")?.textContent;
/** The progress line's value (0 to 100). It is a bar for assistive tech; no digits are shown. */
const progress = () => Number(container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"));
/** Everything the visitor can read outside the question: never a step count. */
const meta = () => container.querySelector(".brief-meta")?.textContent ?? "";

const options = () => Array.from(container.querySelectorAll<HTMLButtonElement>(".brief-option"));
const optionLabels = () => options().map((o) => o.textContent);

/** Picks the nth option on screen and waits for the next screen. */
async function pick(index: number) {
  await act(async () => options()[index].click());
}

describe("BriefFlow: the waitlist's questions", () => {
  it("opens on the first question, with its five labels, and no welcome screen", async () => {
    await renderFlow();
    expect(prompt()).toBe(BRIEF_QUESTIONS[0].prompt);
    expect(optionLabels()).toEqual(BRIEF_QUESTIONS[0].options!.map((o) => o.label));
    expect(progress()).toBe(0);
    expect(meta()).not.toMatch(/\d/);
  });

  it("asks q1 to q5 in order, stores the option values, then shows the contact gate", async () => {
    await renderFlow();
    const asked: (string | null | undefined)[] = [];
    for (let i = 0; i < 5; i += 1) {
      asked.push(prompt());
      expect(progress()).toBe(Math.round((i / 6) * 100));
      await pick(1);
    }
    expect(asked).toEqual(BRIEF_QUESTIONS.map((q) => q.prompt));
    expect(loadBrief()?.answers).toEqual({
      q1: "wrong_audience",
      q2: "launched",
      q3: "sort_of",
      q4: "15_35k",
      q5: "1_3_months",
    });
    expect(prompt()).toBe(siteCopy.brief.contact.prompt);
    expect(container.querySelector(".brief-lead")?.textContent).toBe(siteCopy.brief.contact.body);
    expect(container.querySelector("button.site-action")?.textContent).toBe("Send the brief");
  });

  it("the budget screen shows the dollar ranges exactly", async () => {
    await renderFlow();
    for (let i = 0; i < 3; i += 1) await pick(0);
    expect(prompt()).toBe("What's your investment range for this?");
    expect(optionLabels()).toEqual(["$5K \u2013 $15K", "$15K \u2013 $35K", "$35K \u2013 $75K", "$75K+"]);
  });

  it("Back returns to the previous question and keeps its answer selected", async () => {
    await renderFlow();
    await pick(2);
    await act(async () => container.querySelector<HTMLButtonElement>(".brief-back")!.click());
    expect(prompt()).toBe(BRIEF_QUESTIONS[0].prompt);
    expect(options()[2].getAttribute("aria-pressed")).toBe("true");
  });
});

describe("BriefFlow: the seed", () => {
  it("takes ?seed= out of the URL, keeps it in the brief, and answers no question", async () => {
    await renderFlow("/brief?seed=Like%20Casa%20Mar");
    expect(window.location.search).toBe("");
    const saved = loadBrief()!;
    expect(saved.seed).toBe("Like Casa Mar");
    expect(saved.answers).toEqual({});
    expect(prompt()).toBe(BRIEF_QUESTIONS[0].prompt);
  });

  it("ignores ?moment=: nothing is pre-answered", async () => {
    await renderFlow("/brief?moment=launch");
    expect(loadBrief()?.answers).toEqual({});
    expect(prompt()).toBe(BRIEF_QUESTIONS[0].prompt);
  });
});

describe("BriefFlow: screens", () => {
  it("shows Back as a plain text button after the first screen, no arrow glyph, no count", async () => {
    await renderFlow();
    expect(container.querySelector(".brief-back")).toBeNull();
    await pick(0);
    const back = container.querySelector(".brief-back")!;
    expect(back.textContent).toBe(siteCopy.brief.back);
    expect(meta()).not.toMatch(/\d|\u2190/);
  });

  it("the server HTML has the page heading before any script runs", () => {
    const html = renderToString(createElement(BriefFlow));
    expect(html).toMatch(/<h1[^>]*>What(&#x27;|')s your brand actually costing you right now\?<\/h1>/);
  });
});
