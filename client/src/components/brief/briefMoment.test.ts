// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextFixedQuestion, type BriefState } from "@shared/brief";
import { BriefFlow } from "./BriefFlow";
import { loadBrief, momentFromParam } from "./briefStorage";

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
const count = () => container.querySelector(".brief-meta__count")?.textContent?.replace(/\s+/g, " ").trim();

describe("BriefFlow with ?moment=", () => {
  it("pre-answers the moment and still asks what they are building", async () => {
    await renderFlow({ moment: "launch" });
    expect(prompt()).toBe("What are you building?");
    expect(loadBrief()?.answers).toEqual({ moment: "Launch" });
    // Seven screens (six questions + contact) minus the preset moment.
    expect(count()).toBe("01 / 06");
  });

  it("ignores an unknown moment", async () => {
    await renderFlow({ moment: "rocket" });
    expect(prompt()).toBe("What are you building?");
    expect(loadBrief()?.answers).toEqual({});
    expect(count()).toBe("01 / 07");
  });

  it("leaves the seed path unchanged", async () => {
    await renderFlow({ seed: "A hotel in Tulum" });
    const saved = loadBrief()!;
    expect(saved.seed).toBe("A hotel in Tulum");
    expect(saved.answers).toEqual({});
    expect(saved.path.map((step) => step.id)).toEqual(["industry"]);
    expect(count()).toBe("01 / 06");
  });

  it("combines a seed and a moment: both questions are skipped", async () => {
    await renderFlow({ seed: "A hotel in Tulum", moment: "reposition" });
    const saved = loadBrief()!;
    expect(saved.answers).toEqual({ moment: "Reposition" });
    expect(saved.path.map((step) => step.id)).toEqual(["industry"]);
    expect(count()).toBe("01 / 05");
  });
});
