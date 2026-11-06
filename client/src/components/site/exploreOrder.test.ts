// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { WorkExplore } from "./WorkExplore";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  window.matchMedia = (() => ({ matches: true, addEventListener: () => undefined, removeEventListener: () => undefined })) as unknown as typeof window.matchMedia;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("Explore panel keyboard order", () => {
  it("the field comes first in the DOM and the panel after it, with no positive tabindex, and tabbing out closes it", () => {
    act(() =>
      root.render(
        createElement(WorkExplore, { query: "", onQuery: () => undefined, onClear: () => undefined, activeCount: 0, visible: true },
          createElement("button", { type: "button", id: "first-filter" }, "Sector")),
      ),
    );
    const input = document.querySelector<HTMLInputElement>(".site-explore__input")!;
    act(() => input.focus());
    const root_ = document.querySelector(".site-explore")!;
    const panel = root_.querySelector(".site-explore__panel")!;
    expect(panel).not.toBeNull();
    expect(input.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(root_.querySelector("[tabindex]:not([tabindex='-1']):not([tabindex='0'])")).toBeNull();
    const focusable = Array.from(root_.querySelectorAll<HTMLElement>("input, button")).map((el) => el.className || el.textContent || el.id);
    expect(focusable[0]).toContain("site-explore__input");
    act(() => {
      const outside = document.createElement("button");
      document.body.appendChild(outside);
      root_.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }));
    });
    expect(document.querySelector(".site-explore__panel")).toBeNull();
  });
});
