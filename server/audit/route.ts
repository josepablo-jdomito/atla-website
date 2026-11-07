import { createHash, randomUUID } from "node:crypto";
import type { Express, NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AUDITS_PER_WEEK, auditFeedbackSchema, auditSchema, isoWeek, type AuditFeedback, type AuditRequest, type AuditStatus, type AuditWeek } from "../../shared/audit.ts";
import { clientIp, foreignPostSource } from "../contact.ts";
import { rateLimit } from "../limits/guards.ts";
import { decrement, deleteKey, getCount, incrWithExpiry } from "../limits/store.ts";
import { deliverAuditFeedbackToAttio, deliverAuditToAttio, sendAuditEmail, type AuditSlot } from "./deliver.ts";

/**
 * The free brand audit (/audit, JP 2026-11-07). Same rules as the brand check (server/brandCheck/route.ts)
 * plus one shared weekly counter:
 *
 * GET  /api/audit/status → { week: "open" | "full", taken, cap }
 *   This ISO week's slots (cap = AUDITS_PER_WEEK, taken clamped to it). Never cached: the page's
 *   widget shows it live and polls it.
 *
 * POST /api/audit/feedback  { submissionId, name, email, site, text } → { ok: true }
 *   The one post-submit question. Same-site only, same address limit, one per submissionId; an Attio
 *   note on the Person. Never logged; a failure answers 502 without a reference to the text.
 *
 * POST /api/audit  { request, submissionId, _gotcha } → { ok: true, week: "open" | "full" }
 *   Same-site posts only (403 otherwise). A filled honeypot gets ok and delivers nothing. More than
 *   5 posts per hashed address in 10 min, or 3 per email a day, get 429. The same submissionId
 *   within 24 h skips delivery. Every accepted request takes the next number in the week's counter:
 *   within the cap it is in this week's five ("open"), past it the request is queued for next week
 *   ("full"). Either way it is delivered: the visitor is never turned away, only told which week.
 *   Attio and the email are independent: when one fails the visitor still gets ok; when both fail
 *   they get 502, the slot is given back and the submissionId stays unspent so a resend delivers.
 *   A failed delivery logs a generated reference id, the failed steps and the email's domain, never
 *   what the visitor wrote. Request bodies stay out of the request log (server/apiLog.ts).
 */

const SUBMISSION_TTL_SECONDS = 24 * 60 * 60;
/** A week's counter outlives its week, so a status read on Monday never finds last week's number. */
const WEEK_TTL_SECONDS = 14 * 24 * 60 * 60;
const MAX_PER_EMAIL_PER_DAY = 3;
const HONEYPOT_FIELD = "_gotcha";

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
  deliverToAttio: (request: AuditRequest, slot: AuditSlot) => Promise<void>;
  sendEmail: (request: AuditRequest, slot: AuditSlot) => Promise<void>;
  deliverFeedback: (feedback: AuditFeedback) => Promise<void>;
  now: () => Date;
};

const defaultDeps: AuditDeps = {
  rateLimit,
  incrWithExpiry,
  deleteKey,
  getCount,
  decrement,
  deliverToAttio: deliverAuditToAttio,
  sendEmail: sendAuditEmail,
  deliverFeedback: deliverAuditFeedbackToAttio,
  now: () => new Date(),
};

export const weekKey = (date: Date) => `audit:week:${isoWeek(date)}`;
const weekOf = (count: number): AuditWeek => (count >= AUDITS_PER_WEEK ? "full" : "open");
const statusOf = (count: number): AuditStatus => ({ week: weekOf(count), taken: Math.min(Math.max(0, count), AUDITS_PER_WEEK), cap: AUDITS_PER_WEEK });

/** The part of an address after "@", for a log line that must not name the person. */
const emailDomain = (email: string) => email.split("@").pop()?.toLowerCase().replace(/[^a-z0-9.-]/g, "").slice(0, 80) || "unknown";

function sameSiteOnly(req: Request, res: Response, next: NextFunction) {
  const foreignHost = foreignPostSource(req);
  if (!foreignHost) return next();
  console.warn(`[audit] refused cross-site post from ${foreignHost}`);
  return res.status(403).json({ error: "Forbidden" });
}

export function registerAuditRoutes(app: Express, deps: AuditDeps = defaultDeps) {
  app.get("/api/audit/status", async (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      const count = await deps.getCount(weekKey(deps.now()));
      return res.json(statusOf(count));
    } catch (err) {
      // A counter outage reads as open: the form still takes the request and the note says the week.
      console.error(`[audit] status read failed: ${err instanceof Error ? err.message : "unknown error"}`);
      return res.json(statusOf(0));
    }
  });

  app.post("/api/audit/feedback", sameSiteOnly, async (req, res) => {
    const parsed = auditFeedbackSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request" });
    if (!(await deps.rateLimit(clientIp(req), "audit"))) return res.status(429).json({ error: "Too many requests." });
    const key = `auditfb:${parsed.data.submissionId}`;
    try {
      if ((await deps.incrWithExpiry(key, SUBMISSION_TTL_SECONDS)) > 1) return res.json({ ok: true });
    } catch {
      // A counter outage never blocks the answer.
    }
    try {
      await deps.deliverFeedback(parsed.data);
      return res.json({ ok: true });
    } catch (err) {
      console.error(`[audit] feedback delivery failed: ${err instanceof Error ? err.message : "unknown error"}`);
      await deps.deleteKey(key).catch(() => {});
      return res.status(502).json({ error: "We could not save that. Try again in a moment." });
    }
  });

  app.post("/api/audit", sameSiteOnly, async (req, res) => {
    const ip = clientIp(req);

    // Honeypot first: a bot that filled it learns nothing, whatever else it sent. Counted like a delivery.
    const honeypot = (req.body as Record<string, unknown> | undefined)?.[HONEYPOT_FIELD];
    if (typeof honeypot === "string" && honeypot.trim()) {
      await deps.rateLimit(ip, "audit");
      console.warn("[audit] honeypot hit");
      return res.json({ ok: true, week: "open" satisfies AuditWeek });
    }

    const parsed = body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request" });
    const request = parsed.data.request;
    const week = weekKey(deps.now());

    if (!(await deps.rateLimit(ip, "audit"))) {
      return res.status(429).json({ error: "Too many requests from this address. Try again in a few minutes." });
    }

    const submissionKey = `audit:${parsed.data.submissionId}`;
    try {
      if ((await deps.incrWithExpiry(submissionKey, SUBMISSION_TTL_SECONDS)) > 1) {
        // Already delivered: answer with the week as it stands, without taking another slot.
        const count = await deps.getCount(week).catch(() => 0);
        return res.json({ ok: true, week: weekOf(count) });
      }
    } catch (err) {
      console.error(`[audit] idempotency store failed, delivering anyway: ${err instanceof Error ? err.message : "unknown error"}`);
    }

    // Counted after the idempotency check, so a resent submission never uses the cap up twice.
    const emailKey = `auditmail:${createHash("sha256").update(request.email.toLowerCase()).digest("hex").slice(0, 32)}`;
    try {
      if ((await deps.incrWithExpiry(emailKey, SUBMISSION_TTL_SECONDS)) > MAX_PER_EMAIL_PER_DAY) {
        await deps.deleteKey(submissionKey).catch(() => {});
        return res.status(429).json({ error: "Too many requests from this address. Try again tomorrow." });
      }
    } catch {
      // A counter outage never blocks a real lead.
    }

    // The week's slot: one atomic INCR, so two requests at the same moment get different numbers.
    let count = 0;
    let slotTaken = false;
    try {
      count = await deps.incrWithExpiry(week, WEEK_TTL_SECONDS);
      slotTaken = true;
    } catch (err) {
      console.error(`[audit] weekly counter failed, delivering as open: ${err instanceof Error ? err.message : "unknown error"}`);
    }
    const slot: AuditSlot = { week: isoWeek(deps.now()), count, full: count > AUDITS_PER_WEEK };
    const answer: AuditWeek = slot.full ? "full" : "open";

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
    if (!failures.length) return res.json({ ok: true, week: answer });

    const ref = randomUUID();
    const allFailed = failures.length === steps.length;
    console.error(
      `[audit] delivery failed ref=${ref} domain=${emailDomain(request.email)} ${allFailed ? "nothing delivered, visitor asked to resend" : "partly delivered"} (${failures.join("; ")})`,
    );
    if (!allFailed) return res.json({ ok: true, week: answer });

    try {
      await deps.deleteKey(submissionKey);
      // Nothing was delivered, so this attempt does not count against the visitor's daily cap or the week.
      await deps.deleteKey(emailKey);
      if (slotTaken) await deps.decrement(week);
    } catch (err) {
      console.error(`[audit] could not release ref=${ref} for a resend: ${err instanceof Error ? err.message : "unknown error"}`);
    }
    return res.status(502).json({ error: RETRY_MESSAGE, ref });
  });
}
