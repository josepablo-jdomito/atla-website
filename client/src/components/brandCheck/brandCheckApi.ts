import type { BrandCheckRequest } from "@shared/brandCheck";

export type BrandCheckResult =
  | { status: "ok"; calendlyUrl: string }
  | { status: "rate-limited" }
  | { status: "failed" };

const SUBMIT_TIMEOUT_MS = 20000;

/** POST /api/brand-check. Every failure (network, timeout, 4xx, 5xx) reads as "failed"; 429 as "rate-limited". */
export async function submitBrandCheck(
  request: BrandCheckRequest,
  submissionId: string,
  honeypot: string,
): Promise<BrandCheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
  try {
    const res = await fetch("/api/brand-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request, submissionId, _gotcha: honeypot }),
      signal: controller.signal,
    });
    if (res.status === 429) return { status: "rate-limited" };
    if (!res.ok) return { status: "failed" };
    const body = (await res.json()) as { ok?: unknown; calendlyUrl?: unknown };
    if (body.ok !== true) return { status: "failed" };
    return { status: "ok", calendlyUrl: typeof body.calendlyUrl === "string" ? body.calendlyUrl : "" };
  } catch {
    return { status: "failed" };
  } finally {
    clearTimeout(timer);
  }
}
