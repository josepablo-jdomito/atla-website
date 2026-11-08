import type { MouseEvent } from "react";

/**
 * The one door to the free audit (JP, 2026-11-07): every "Start free audit request" opens the flow
 * that takes the screen (components/audit/AuditFlow.tsx). The page listens for this event; when it is
 * not there (before hydration, or with scripts off) the anchor falls through to the form on the page.
 */
export const AUDIT_OPEN_EVENT = "audit:open";
/** The closing section's id: the anchor every door points at when the flow cannot open. */
export const AUDIT_FORM_ID = "send";

export function openAuditFlow(event?: MouseEvent | Event) {
  const handled = !window.dispatchEvent(new CustomEvent(AUDIT_OPEN_EVENT, { cancelable: true }));
  if (handled) event?.preventDefault();
}
