// @vitest-environment jsdom
import { act, createElement } from "react";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextFixedQuestion, type BriefState } from "@shared/brief";
import { BriefFlow } from "./BriefFlow";
import { loadBrief, momentFromParam } from "./briefStorage";
import { siteCopy } from "@/content/siteCopy";

// The API's own fallback: the fixed order. Keeps the flow deterministic and off the network.
vi.mock("./briefApi", () => ({
  fetchNextStep: vi.fn(async (state: BriefState) => nextFixedQuestion(state)),
  submitBrief: vi.fn(),
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Question ids the fixed flow asks, in order, answering each with a placeholder. */
function askedIds(state: BriefState): string[] {
  const probe: BriefState = { ...state, answers: { ...state.answers } };
  const ids: string[] = [];
  for (let next = nextFixedQuestion(probe); "kind" in next; next = nextFixedQuestion(probe)) {
    ids.push(next.id);
    probe.answers[next.id] = "x";
  }
  return ids;
}

describe("momentFromParam", () => {
  it("maps the Services ids to the brief's moment options", () => {
    expect(momentFromParam("launch")).toBe("Launch");
    expect(momentFromParam("raise")).toBe("Raise capital");
    expect(momentFromParam("grow")).toBe("Grow / scale");
    expect(momentFromParam("reposition")).toBe("Reposition");
  });

  it("ignores unknown or empty values", () => {
    for (const value of ["", null, undefined, "Launch now", "toString", "__proto__", "raise-capital"]) {
      expect(momentFromParam(value)).toBeUndefined();
    }
  });

  it("a preset moment skips only the moment question", () => {
    expect(askedIds({ answers: {} })).toEqual(["building", "industry", "stage", "moment", "deliverables", "timing"]);
    expect(askedIds({ answers: { moment: momentFromParam("grow")! } })).toEqual([
      "building",
      "industry",
      "stage",
      "deliverables",
      "timing",
    ]);
  });
});

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  sessionStorage.clear();
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

async function renderFlow(props: { seed?: string; moment?: string }) {
  await act(async () => {
    root.render(createElement(BriefFlow, props));
  });
}

const prompt = () => container.querySelector(".brief-prompt")?.textContent;
/** The progress line's value (0 to 100). It is a bar for assistive tech; no digits are shown. */
const progress = () => Number(container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"));
/** Everything the visitor can read outside the question: never a step count. */
const meta = () => container.querySelector(".brief-meta")?.textContent ?? "";

/** Answers the text question on screen and waits for the next one. */
async function answerText(value: string) {
  const textarea = container.querySelector<HTMLTextAreaElement>("textarea")!;
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!;
    setter.call(textarea, value);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(async () => {
    container.querySelector<HTMLButtonElement>("button.brief-primary")!.click();
  });
}

describe("BriefFlow with ?moment=", () => {
  it("pre-answers the moment and still asks what they are building", async () => {
    await renderFlow({ moment: "launch" });
    expect(prompt()).toBe("What are you building?");
    expect(loadBrief()?.answers).toEqual({ moment: "Launch" });
    expect(progress()).toBe(0);
    expect(meta()).not.toMatch(/\d/);
    // Seven screens (six questions + contact) minus the preset moment: one answered is a sixth of the line.
    await answerText("A hotel");
    expect(progress()).toBe(Math.round(100 / 6));
  });

  it("ignores an unknown moment", async () => {
    await renderFlow({ moment: "rocket" });
    expect(prompt()).toBe("What are you building?");
    expect(loadBrief()?.answers).toEqual({});
    await answerText("A hotel");
    expect(progress()).toBe(Math.round(100 / 7));
  });

  it("leaves the seed path unchanged", async () => {
    await renderFlow({ seed: "A hotel in Tulum" });
    const saved = loadBrief()!;
    expect(saved.seed).toBe("A hotel in Tulum");
    expect(saved.answers).toEqual({});
    expect(saved.path.map((step) => step.id)).toEqual(["industry"]);
    expect(progress()).toBe(0);
  });

  it("combines a seed and a moment: both questions are skipped", async () => {
    await renderFlow({ seed: "A hotel in Tulum", moment: "reposition" });
    const saved = loadBrief()!;
    expect(saved.answers).toEqual({ moment: "Reposition" });
    expect(saved.path.map((step) => step.id)).toEqual(["industry"]);
    expect(meta()).not.toMatch(/\d/);
  });
});

describe("BriefFlow screens (fix wave 2026-11-05)", () => {
  it("Continue on an empty answer shows one quiet line and stays on the question", async () => {
    await renderFlow({});
    const before = prompt();
    const button = container.querySelector<HTMLButtonElement>("button.brief-primary")!;
    expect(button.disabled).toBe(false);
    await act(async () => button.click());
    expect(prompt()).toBe(before);
    expect(container.querySelector(".brief-empty")?.textContent).toBe(siteCopy.brief.emptyText);
    // Typing clears the line.
    await answerText("A hotel");
    expect(container.querySelector(".brief-empty")).toBeNull();
  });

  it("a multi question asks for a pick instead of moving on empty", async () => {
    await renderFlow({ seed: "A hotel in Tulum" });
    // Walk the single-choice questions until a multi one is on screen.
    for (let guard = 0; guard < 6 && !container.querySelector('.brief-option[data-kind="multi"]'); guard += 1) {
      const option = container.querySelector<HTMLButtonElement>(".brief-option");
      if (!option) break;
      await act(async () => option.click());
    }
    expect(container.querySelector('.brief-option[data-kind="multi"]')).not.toBeNull();
    const continueButton = container.querySelector<HTMLButtonElement>("button.brief-primary")!;
    const before = prompt();
    await act(async () => continueButton.click());
    expect(prompt()).toBe(before);
    expect(container.querySelector(".brief-empty")?.textContent).toBe(siteCopy.brief.emptyChoice);
  });

  it("shows Back as a plain text button after the first screen, no arrow glyph, no count", async () => {
    await renderFlow({});
    expect(container.querySelector(".brief-back")).toBeNull();
    await answerText("A hotel");
    const back = container.querySelector(".brief-back")!;
    expect(back.textContent).toBe(siteCopy.brief.back);
    expect(meta()).not.toMatch(/\d|←/);
  });

  it("the server HTML has the page heading before any script runs", () => {
    const html = renderToString(createElement(BriefFlow, {}));
    expect(html).toMatch(/<h1[^>]*>What are you building\?<\/h1>/);
  });
});
