import { createRoot, hydrateRoot } from "react-dom/client";
import { hydrate, type DehydratedState } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import { beginHydration } from "./lib/hydration";
import "./index.css";

declare global {
  interface Window {
    __ATLA_DEHYDRATED_STATE__?: DehydratedState;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

const dehydratedState = window.__ATLA_DEHYDRATED_STATE__;

if (dehydratedState) {
  hydrate(queryClient, dehydratedState);
}

// A prerendered page (script/build.ts) is adopted, not rebuilt: the first paint is the final paint and
// the LCP image the HTML already requested stays the LCP image. The client's first render equals the
// prerender (App.tsx AppShell, lib/hydration.ts). An empty #root (the dev server) renders from scratch.
if (container.firstElementChild) {
  beginHydration();
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
