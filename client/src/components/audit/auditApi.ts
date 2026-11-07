import type { AuditRequest, AuditWeek } from "@shared/audit";

export type AuditResult = { status: "ok"; week: AuditWeek } | { status: "rate-limited" } | { status: "failed" };

const SUBMIT_TIMEOUT_MS = 20000;
const STATUS_TIMEOUT_MS = 6000;

const asWeek = (value: unknown): AuditWeek => (value === "full" ? "full" : "open");

/** POST /api/audit. Every failure (network, timeout, 4xx, 5xx) reads as "failed"; 429 as "rate-limited". */
export async function submitAudit(request: AuditRequest, submissionId: string, honeypot: string): Promise<AuditResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
  try {
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request, submissionId, _gotcha: honeypot }),
      signal: controller.signal,
    });
    if (res.status === 429) return { status: "rate-limited" };
    if (!res.ok) return { status: "failed" };
    const body = (await res.json()) as { ok?: unknown; week?: unknown };
    if (body.ok !== true) return { status: "failed" };
    return { status: "ok", week: asWeek(body.week) };
  } catch {
    return { status: "failed" };
  } finally {
    clearTimeout(timer);
  }
}

/** GET /api/audit/status: whether this week's five are taken. Null when the read fails: the page keeps its neutral line. */
export async function fetchAuditWeek(signal?: AbortSignal): Promise<AuditWeek | null> {
  try {
    const res = await fetch("/api/audit/status", { signal: signal ?? AbortSignal.timeout(STATUS_TIMEOUT_MS) });
    if (!res.ok) return null;
    const body = (await res.json()) as { week?: unknown };
    return asWeek(body.week);
  } catch {
    return null;
  }
}
