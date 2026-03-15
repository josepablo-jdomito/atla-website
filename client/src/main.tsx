import { createRoot, hydrateRoot } from "react-dom/client";
import { hydrate, type DehydratedState } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "./lib/queryClient";
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
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
