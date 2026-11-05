import { nextFixedQuestion, type BriefContact, type BriefState } from "@shared/brief";
import type { BriefStep } from "./briefStorage";

/** What comes after the current answers: another screen, or nothing left to ask. */
export type NextStep = BriefStep | { id: "done" };

export type SubmitResult =
  | { status: "ok"; calendlyUrl: string }
  | { status: "rate-limited" }
  | { status: "failed" };

/** /api/brief/next waits on the AI; past this the fixed order takes over so the flow never stalls. */
const NEXT_TIMEOUT_MS = 6000;
const SUBMIT_TIMEOUT_MS = 20000;

/** Only the fields the API knows about; storage bookkeeping stays on the client. */
function wireState(state: BriefState): BriefState {
  return { seed: state.seed, answers: state.answers, contact: state.contact };
}

async function postJson(url: string, body: unknown, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function isNextStep(value: unknown): value is NextStep {
  if (!value || typeof value !== "object") return false;
  const step = value as Record<string, unknown>;
  if (step.id === "contact" || step.id === "done") return true;
  if (typeof step.id !== "string" || typeof step.prompt !== "string") return false;
  if (step.kind === "text") return true;
  return (
    (step.kind === "single" || step.kind === "multi") &&
    Array.isArray(step.options) &&
    step.options.length > 0 &&
    step.options.every((option) => typeof option === "string")
  );
}

/** The next screen. Any failure (network, timeout, bad response) falls back to the fixed question order. */
export async function fetchNextStep(state: BriefState): Promise<NextStep> {
  try {
    const res = await postJson("/api/brief/next", { state: wireState(state) }, NEXT_TIMEOUT_MS);
    if (res.ok) {
      const body = (await res.json()) as { question?: unknown };
      if (isNextStep(body.question)) return body.question;
    }
  } catch {
    // Fall through to the fixed order.
  }
  return nextFixedQuestion(state);
}

export async function submitBrief(
  state: BriefState & { contact: BriefContact },
  submissionId: string,
  honeypot: string,
): Promise<SubmitResult> {
  try {
    const res = await postJson(
      "/api/brief/submit",
      { state: wireState(state), submissionId, _gotcha: honeypot },
      SUBMIT_TIMEOUT_MS,
    );
    if (res.status === 429) return { status: "rate-limited" };
    if (!res.ok) return { status: "failed" };
    const body = (await res.json()) as { ok?: unknown; calendlyUrl?: unknown };
    if (body.ok !== true) return { status: "failed" };
    return { status: "ok", calendlyUrl: typeof body.calendlyUrl === "string" ? body.calendlyUrl : "" };
  } catch {
    return { status: "failed" };
  }
}
