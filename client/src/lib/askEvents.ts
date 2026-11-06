import { analyticsAllowed, ga4Event } from "@/lib/ga";

/**
 * GA4 `ask_turn`: one settled Ask answer. Like bar_search (ga.ts), behind the same consent gate,
 * and only shape: how many pieces and links the answer showed. Never the question, the history or
 * the answer text.
 */
export type AskTurnEvent = { name: "ask_turn"; params: { mode: "ask"; pieces: number; links: number } };

const count = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(99, Math.trunc(n))) : 0);

export function trackAskTurn(pieces: number, links: number) {
  if (!analyticsAllowed()) return;
  const event: AskTurnEvent = { name: "ask_turn", params: { mode: "ask", pieces: count(pieces), links: count(links) } };
  ga4Event(event.name, event.params);
}
