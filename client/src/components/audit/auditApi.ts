import type { AuditFeedback, AuditRequest, AuditStatus, AuditWeek } from "@shared/audit";

/** `repeat`: the brand (or the address) already asked this week, so this request took no slot. */
export type AuditResult = { status: "ok"; week: AuditWeek; repeat: boolean } | { status: "rate-limited" } | { status: "failed" };

// Attio (two or three calls) and Resend run in parallel on the server, each with an 8 s timeout; the function may take 30 s.
const SUBMIT_TIMEOUT_MS = 30000;
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
    const body = (await res.json()) as { ok?: unknown; week?: unknown; repeat?: unknown };
    if (body.ok !== true) return { status: "failed" };
    return { status: "ok", week: asWeek(body.week), repeat: body.repeat === true };
  } catch {
    return { status: "failed" };
  } finally {
    clearTimeout(timer);
  }
}

/** GET /api/audit/status: this week's slots. Null when the read fails: the widget keeps its last state. */
export async function fetchAuditStatus(signal?: AbortSignal): Promise<AuditStatus | null> {
  try {
    const res = await fetch("/api/audit/status", { signal: signal ?? AbortSignal.timeout(STATUS_TIMEOUT_MS), cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { week?: unknown; taken?: unknown; cap?: unknown; last?: unknown };
    const cap = typeof body.cap === "number" && body.cap > 0 ? body.cap : 5;
    const clamp = (value: unknown) => (typeof value === "number" ? Math.min(Math.max(0, Math.round(value)), cap) : 0);
    return { week: asWeek(body.week), taken: clamp(body.taken), cap, last: clamp(body.last) };
  } catch {
    return null;
  }
}

/** POST /api/audit/feedback: the one post-submit answer. True when saved. */
export async function submitAuditFeedback(feedback: AuditFeedback): Promise<boolean> {
  try {
    const res = await fetch("/api/audit/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
      signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
const ATTRIBUTION_KEY = "atla-audit-attribution";

/** Where the visit came from, kept for the tab so it survives a look around the site: utm_* and the referrer host. "direct" otherwise. */
export function readAuditAttribution(): string {
  const params = new URLSearchParams(window.location.search);
  const tagged = UTM_KEYS.some((key) => params.get(key));
  // A tagged arrival (a reel) replaces what the tab saved; an untagged one keeps it.
  if (!tagged) {
    try {
      const saved = sessionStorage.getItem(ATTRIBUTION_KEY);
      if (saved) return saved;
    } catch {
      // Storage blocked: read this visit only.
    }
  }
  // Only what the server accepts (shared/audit.ts): tag values as a slug, the referrer as a host.
  const parts = UTM_KEYS.filter((key) => params.get(key)).map((key) => `${key}=${params.get(key)!.replace(/[^\w.-]/g, "").slice(0, 60)}`).filter((part) => !part.endsWith("="));
  try {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    if (referrer && referrer.origin !== window.location.origin) parts.push(`referrer=${referrer.hostname.toLowerCase().replace(/[^a-z0-9.-]/g, "").slice(0, 80)}`);
  } catch {
    // Not a URL.
  }
  const attribution = (parts.join(", ") || "direct").slice(0, 240);
  try {
    sessionStorage.setItem(ATTRIBUTION_KEY, attribution);
  } catch {
    // Not critical.
  }
  return attribution;
}
