// @vitest-environment jsdom
import { siteCopy } from "@/content/siteCopy";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PageShell } from "./PageShell";

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
});

describe("skip link", () => {
  it("is the first focusable element and targets PageShell's main content", () => {
    const client = new QueryClient();
    act(() =>
      root.render(
        createElement(QueryClientProvider, { client }, createElement(PageShell, null, createElement("p", null, "Page body"))),
      ),
    );

    const first = container.querySelector<HTMLElement>("a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])");
    expect(first?.className).toBe("site-skip-link");
    expect(first?.textContent).toBe(siteCopy.header.skipLink);

    const targetId = first!.getAttribute("href")!.slice(1);
    const target = document.getElementById(targetId);
    expect(target?.tagName).toBe("MAIN");
    expect(target?.textContent).toContain("Page body");
    // Focusable from script, so following the link moves keyboard focus into the content.
    expect(target?.getAttribute("tabindex")).toBe("-1");

    first!.focus();
    expect(document.activeElement).toBe(first);
  });
});
