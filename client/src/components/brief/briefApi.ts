import type { BriefContact, BriefState } from "@shared/brief";

export type SubmitResult =
  | { status: "ok"; calendlyUrl: string }
  | { status: "rate-limited" }
  | { status: "failed" };

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
