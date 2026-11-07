import { createHash, randomUUID } from "node:crypto";
import type { Express, NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  AUDIT_ANSWER_KEYS,
  AUDITS_PER_WEEK,
  auditFeedbackSchema,
  auditSchema,
  brandFromSite,
  isoWeek,
  nextIsoWeek,
  previousIsoWeek,
  type AuditAnswerKey,
  type AuditFeedback,
  type AuditRequest,
  type AuditStatus,
  type AuditWeek,
} from "../../shared/audit.ts";
import { clientIp, foreignPostSource } from "../contact.ts";
import { hashIp, rateLimit } from "../limits/guards.ts";
import { decrement, deleteKey, getCount, getValue, incrWithExpiry, setValue } from "../limits/store.ts";
import { deliverAuditFeedbackToAttio, deliverAuditToAttio, sendAuditEmail, type AuditSlot } from "./deliver.ts";

/**
 * The free brand audit (/audit, JP 2026-11-07). Same rules as the brand check (server/brandCheck/route.ts)
 * plus one shared weekly counter. Hardened after the red team of 2026-11-07
 * (docs/superpowers/specs/2026-11-07-audit-landing/redteam-report.md).
 *
 * GET  /api/audit/status → { week: "open" | "full", taken, cap, last }
 *   This week's slots on Austin's calendar (cap = AUDITS_PER_WEEK, taken clamped to it) and last week's count. Read from the store at most
 *   once every five seconds per instance; never cached at the edge. A store outage answers 503, so the
 *   page keeps its neutral line instead of claiming "open".
 *
 * POST /api/audit  { request, submissionId, _gotcha } → { ok: true, week: "open" | "full", repeat: boolean }
 *   Same-site posts only (403 otherwise). A filled honeypot gets ok and delivers nothing. More than
 *   5 posts per hashed address in 10 min, or 3 per email a day, get 429. The same submissionId
 *   within 24 h skips delivery and answers with the week as it stands. A slot is taken once per
 *   brand (the site's host or handle) and once per hashed address per week: a repeat is delivered,
 *   marked as such in the note, but takes no slot (red team P0-2). Past the cap the request is still
 *   delivered and queued: it takes a slot in next week's counter, so Monday's five already show the
 *   queue (P0-1). Attio and the email are independent: when one fails the visitor still gets ok; when
 *   both fail they get 502, the slot is given back and the submissionId stays unspent so a resend
 *   delivers. A failed delivery logs a generated reference id, the failed steps and the email's
 *   domain, never what the visitor wrote. Request bodies stay out of the request log (server/apiLog.ts).
 *
 * POST /api/audit/form (application/x-www-form-urlencoded)
 *   The same form submitted before hydration or without JavaScript: the fields never travel in a
 *   URL. Answers a 303 to /audit?sent=<week> or /audit?sent=error, which the page reads (P1-5).
 *
 * POST /api/audit/feedback  { submissionId, name, email, site, frustration, outcome, tried, anything, final } → { ok: true }
 *   One question at a time on the page: every step posts the answers so far with final:false (kept in the
 *   store, no note yet); the last step, a skip at the end or the page closing posts final:true, and the one
 *   note goes to Attio with the answers merged. Only for a delivered request, from the same email.
 *   The one post-submit question. Accepted only for a submissionId this server delivered in the last
 *   24 h, from the same email (P1-6); one answer per submission; an Attio note on the Person. Never
 *   logged; a failure answers 502.
 *
 * POST /api/audit/release  { week?: "2026-W45" }  with header x-audit-admin: AUDIT_ADMIN_KEY
 *   Gives one slot back (a junk request JP discarded). 404 when the key is not configured.
 */

const SUBMISSION_TTL_SECONDS = 24 * 60 * 60;
/** A week's counters outlive the week by two weeks: next week's queue and last week's proof line read them. */
const WEEK_TTL_SECONDS = 21 * 24 * 60 * 60;
const MAX_PER_EMAIL_PER_DAY = 3;
const HONEYPOT_FIELD = "_gotcha";
const STATUS_CACHE_MS = 5_000;

const body = z.object({
  request: auditSchema,
  submissionId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
});

const RETRY_MESSAGE = "We could not send your request. Nothing was lost: please send it again in a moment.";

export type AuditDeps = {
  rateLimit: (ip: string, bucket: "audit") => Promise<boolean>;
  incrWithExpiry: (key: string, ttlSeconds: number) => Promise<number>;
  deleteKey: (key: string) => Promise<void>;
  getCount: (key: string) => Promise<number>;
  decrement: (key: string) => Promise<void>;
  setValue: (key: string, value: string, ttlSeconds: number) => Promise<void>;
  getValue: (key: string) => Promise<string | null>;
  deliverToAttio: (request: AuditRequest, slot: AuditSlot) => Promise<void>;
  sendEmail: (request: AuditRequest, slot: AuditSlot) => Promise<void>;
  deliverFeedback: (feedback: AuditFeedback) => Promise<void>;
  now: () => Date;
  adminKey: () => string;
};

const defaultDeps: AuditDeps = {
  rateLimit,
  incrWithExpiry,
  deleteKey,
  getCount,
  decrement,
  setValue,
  getValue,
  deliverToAttio: deliverAuditToAttio,
  sendEmail: sendAuditEmail,
  deliverFeedback: deliverAuditFeedbackToAttio,
  now: () => new Date(),
  adminKey: () => process.env.AUDIT_ADMIN_KEY || "",
};

export const weekKey = (date: Date) => `audit:week:${isoWeek(date)}`;
const nextWeekKey = (date: Date) => `audit:week:${nextIsoWeek(date)}`;
const sha = (value: string) => createHash("sha256").update(value).digest("hex").slice(0, 32);
/** "full" from the fifth slot on when reading the status; a request itself is queued only past the cap. */
const weekOf = (count: number): AuditWeek => (count >= AUDITS_PER_WEEK ? "full" : "open");
const statusOf = (count: number, last: number): AuditStatus => ({ week: weekOf(count), taken: Math.min(Math.max(0, count), AUDITS_PER_WEEK), cap: AUDITS_PER_WEEK, last: Math.min(Math.max(0, last), AUDITS_PER_WEEK) });
const previousWeekKey = (date: Date) => `audit:week:${previousIsoWeek(date)}`;

/** The part of an address after "@", for a log line that must not name the person. */
const emailDomain = (email: string) => email.split("@").pop()?.toLowerCase().replace(/[^a-z0-9.-]/g, "").slice(0, 80) || "unknown";

function sameSiteOnly(req: Request, res: Response, next: NextFunction) {
  const foreignHost = foreignPostSource(req);
  if (!foreignHost) return next();
  console.warn(`[audit] refused cross-site post from ${foreignHost}`);
  return res.status(403).json({ error: "Forbidden" });
}

type Outcome = { status: number; body: Record<string, unknown> };

/** The whole request pipeline, shared by the JSON route and the plain form route. */
async function handleAudit(deps: AuditDeps, ip: string, raw: unknown): Promise<Outcome> {
  const record = (raw ?? {}) as Record<string, unknown>;

  // Honeypot first: a bot that filled it learns nothing, whatever else it sent. Counted like a delivery.
  const honeypot = record[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim()) {
    await deps.rateLimit(ip, "audit");
    console.warn("[audit] honeypot hit");
    const count = await deps.getCount(weekKey(deps.now())).catch(() => 0);
    return { status: 200, body: { ok: true, week: weekOf(count), repeat: false } };
  }

  const parsed = body.safeParse(record);
  if (!parsed.success) return { status: 400, body: { error: "Invalid request" } };
  const request = parsed.data.request;
  const now = deps.now();
  const week = weekKey(now);

  // The idempotency mark goes before the address limit, so a retry of the same request never counts twice (red team P2-6).
  const submissionKey = `audit:${parsed.data.submissionId}`;
  try {
    if ((await deps.incrWithExpiry(submissionKey, SUBMISSION_TTL_SECONDS)) > 1) {
      // Already delivered: answer with the week as it stands, without taking another slot.
      const count = await deps.getCount(week).catch(() => 0);
      return { status: 200, body: { ok: true, week: weekOf(count), repeat: false } };
    }
  } catch (err) {
    console.error(`[audit] idempotency store failed, delivering anyway: ${err instanceof Error ? err.message : "unknown error"}`);
  }

  if (!(await deps.rateLimit(ip, "audit"))) {
    await deps.deleteKey(submissionKey).catch(() => {});
    return { status: 429, body: { error: "Too many requests from this address. Try again in a few minutes." } };
  }

  // Counted after the idempotency check, so a resent submission never uses the cap up twice.
  const emailKey = `auditmail:${sha(request.email.toLowerCase())}`;
  try {
    if ((await deps.incrWithExpiry(emailKey, SUBMISSION_TTL_SECONDS)) > MAX_PER_EMAIL_PER_DAY) {
      await deps.deleteKey(submissionKey).catch(() => {});
      return { status: 429, body: { error: "Too many requests from this address. Try again tomorrow." } };
    }
  } catch {
    // A counter outage never blocks a real lead.
  }

  // One slot per brand and one per address per week: a repeat is delivered and marked, but takes no slot.
  const brand = brandFromSite(request.site, request.name).toLowerCase();
  const brandKey = `${week}:brand:${sha(brand)}`;
  const addressKey = `${week}:ip:${hashIp(ip)}`;
  let repeat: AuditSlot["repeat"] = null;
  try {
    if ((await deps.incrWithExpiry(brandKey, WEEK_TTL_SECONDS)) > 1) repeat = "brand";
    else if ((await deps.incrWithExpiry(addressKey, WEEK_TTL_SECONDS)) > 1) repeat = "address";
  } catch (err) {
    console.error(`[audit] repeat check failed, counting the request: ${err instanceof Error ? err.message : "unknown error"}`);
  }

  // The week's slot: one atomic INCR, so two requests at the same moment get different numbers. Past
  // the cap the request is queued: it takes next week's slot instead, so Monday shows the queue.
  let count = 0;
  let slotKey: string | null = null;
  if (!repeat) {
    try {
      count = await deps.incrWithExpiry(week, WEEK_TTL_SECONDS);
      slotKey = week;
      if (count > AUDITS_PER_WEEK) {
        await deps.decrement(week).catch(() => {});
        count = await deps.incrWithExpiry(nextWeekKey(now), WEEK_TTL_SECONDS);
        slotKey = nextWeekKey(now);
        // Next week full too: still delivered, still queued; the note carries the number.
      }
    } catch (err) {
      console.error(`[audit] weekly counter failed, delivering as open: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  } else {
    count = await deps.getCount(week).catch(() => 0);
  }
  const queued = !repeat && slotKey !== null && slotKey !== week;
  const slot: AuditSlot = { week: isoWeek(now), count, full: queued, repeat };
  const answer: AuditWeek = queued || (repeat !== null && count >= AUDITS_PER_WEEK) ? "full" : "open";

  const steps = [
    ["Attio", deps.deliverToAttio],
    ["email", deps.sendEmail],
  ] as const;
  const results = await Promise.allSettled(steps.map(([, deliver]) => deliver(request, slot)));
  // Step names and our own error messages (statuses, missing config) only: never the request.
  const failures = results.flatMap((result, i) => {
    if (result.status === "fulfilled") return [];
    const reason = result.reason instanceof Error ? result.reason.message : "unknown error";
    return [`${steps[i][0]}: ${reason.replace(/\s+/g, " ").slice(0, 160)}`];
  });
  if (failures.length < steps.length) {
    // Delivered (fully or partly): the feedback question may now be answered for this submission.
    await deps.setValue(`auditfb:${parsed.data.submissionId}`, sha(request.email.toLowerCase()), SUBMISSION_TTL_SECONDS).catch(() => {});
  }
  if (!failures.length) return { status: 200, body: { ok: true, week: answer, repeat: repeat !== null } };

  const ref = randomUUID();
  const allFailed = failures.length === steps.length;
  console.error(
    `[audit] delivery failed ref=${ref} domain=${emailDomain(request.email)} ${allFailed ? "nothing delivered, visitor asked to resend" : "partly delivered"} (${failures.join("; ")})`,
  );
  if (!allFailed) return { status: 200, body: { ok: true, week: answer, repeat: repeat !== null } };

  try {
    await deps.deleteKey(submissionKey);
    // Nothing was delivered, so this attempt does not count against the visitor's daily cap, the week or the repeat marks.
    await deps.deleteKey(emailKey);
    await deps.decrement(brandKey);
    if (repeat !== "brand") await deps.decrement(addressKey);
    if (slotKey) await deps.decrement(slotKey);
  } catch (err) {
    console.error(`[audit] could not release ref=${ref} for a resend: ${err instanceof Error ? err.message : "unknown error"}`);
  }
  return { status: 502, body: { error: RETRY_MESSAGE, ref } };
}

export function registerAuditRoutes(app: Express, deps: AuditDeps = defaultDeps) {
  let statusCache: { at: number; value: AuditStatus } | null = null;

  app.get("/api/audit/status", async (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const nowMs = Date.now();
    if (statusCache && nowMs - statusCache.at < STATUS_CACHE_MS) return res.json(statusCache.value);
    try {
      const [count, last] = await Promise.all([deps.getCount(weekKey(deps.now())), deps.getCount(previousWeekKey(deps.now())).catch(() => 0)]);
      statusCache = { at: nowMs, value: statusOf(count, last) };
      return res.json(statusCache.value);
    } catch (err) {
      // A counter outage is not "open": the page keeps its neutral line.
      console.error(`[audit] status read failed: ${err instanceof Error ? err.message : "unknown error"}`);
      return res.status(503).json({ error: "Unavailable" });
    }
  });

  app.post("/api/audit", sameSiteOnly, async (req, res) => {
    const outcome = await handleAudit(deps, clientIp(req), req.body);
    if (outcome.status === 200) statusCache = null;
    return res.status(outcome.status).json(outcome.body);
  });

  // The form before hydration or without JavaScript: urlencoded in, a redirect out, nothing in a URL.
  app.post("/api/audit/form", sameSiteOnly, async (req, res) => {
    const form = (req.body ?? {}) as Record<string, unknown>;
    const field = (name: string) => (typeof form[name] === "string" ? (form[name] as string) : "");
    const raw = {
      request: { site: field("site"), name: field("name"), email: field("email"), source: "direct" },
      submissionId: field("submissionId") || randomUUID(),
      [HONEYPOT_FIELD]: field(HONEYPOT_FIELD),
    };
    const outcome = await handleAudit(deps, clientIp(req), raw);
    if (outcome.status === 200) statusCache = null;
    const sent = outcome.status === 200 ? String(outcome.body.week ?? "open") : "error";
    return res.redirect(303, `/audit?sent=${sent}#send`);
  });

  app.post("/api/audit/feedback", sameSiteOnly, async (req, res) => {
    const parsed = auditFeedbackSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request" });
    // Only for a request this server delivered, from the same email.
    let owner: string | null = null;
    try {
      owner = await deps.getValue(`auditfb:${parsed.data.submissionId}`);
    } catch {
      owner = null;
    }
    if (!owner || owner !== sha(parsed.data.email.toLowerCase())) return res.status(404).json({ error: "Unknown request" });
    if (!(await deps.rateLimit(clientIp(req), "audit"))) return res.status(429).json({ error: "Too many requests." });
    const answersKey = `auditfbans:${parsed.data.submissionId}`;
    const pick = (value: AuditFeedback) => Object.fromEntries(AUDIT_ANSWER_KEYS.map((k) => [k, value[k]]));
    if (!parsed.data.final) {
      // A step: keep the answers so far, so a closed tab loses nothing the visitor already gave.
      await deps.setValue(answersKey, JSON.stringify(pick(parsed.data)), SUBMISSION_TTL_SECONDS).catch(() => {});
      return res.json({ ok: true });
    }
    const key = `auditfbdone:${parsed.data.submissionId}`;
    try {
      if ((await deps.incrWithExpiry(key, SUBMISSION_TTL_SECONDS)) > 1) return res.json({ ok: true });
    } catch {
      // A counter outage never blocks the answer.
    }
    // The closing post carries everything; a step saved earlier only fills what it left blank.
    let merged: AuditFeedback = parsed.data;
    try {
      const saved = JSON.parse((await deps.getValue(answersKey)) ?? "null") as Partial<Record<AuditAnswerKey, string>> | null;
      if (saved) merged = { ...parsed.data, ...Object.fromEntries(AUDIT_ANSWER_KEYS.map((k) => [k, parsed.data[k] || saved[k] || ""])) };
    } catch {
      // Nothing saved, or unreadable: the closing post stands on its own.
    }
    try {
      await deps.deliverFeedback(merged);
      await deps.deleteKey(answersKey).catch(() => {});
      return res.json({ ok: true });
    } catch (err) {
      console.error(`[audit] feedback delivery failed: ${err instanceof Error ? err.message : "unknown error"}`);
      await deps.deleteKey(key).catch(() => {});
      return res.status(502).json({ error: "We could not save that. Try again in a moment." });
    }
  });

  // JP gives a junk request's slot back: one call, one slot, this week unless another is named.
  app.post("/api/audit/release", async (req, res) => {
    const key = deps.adminKey();
    const given = req.headers["x-audit-admin"];
    if (!key || typeof given !== "string" || given !== key) return res.status(404).json({ error: "Not found" });
    const named = (req.body as { week?: unknown } | undefined)?.week;
    const week = typeof named === "string" && /^\d{4}-W\d{2}$/.test(named) ? `audit:week:${named}` : weekKey(deps.now());
    try {
      await deps.decrement(week);
      statusCache = null;
      return res.json({ ok: true, taken: await deps.getCount(week) });
    } catch (err) {
      console.error(`[audit] release failed: ${err instanceof Error ? err.message : "unknown error"}`);
      return res.status(502).json({ error: "Store unavailable" });
    }
  });
}
