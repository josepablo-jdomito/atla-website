import { createHash, randomUUID } from "node:crypto";
import type { Express, NextFunction, Request, Response } from "express";
import { z } from "zod";
import { brandCheckSchema, type BrandCheckRequest } from "../../shared/brandCheck.ts";
import { clientIp, foreignPostSource } from "../contact.ts";
import { rateLimit } from "../limits/guards.ts";
import { deleteKey, incrWithExpiry } from "../limits/store.ts";
import { briefCalendlyUrl } from "../brief/deliver.ts";
import { deliverBrandCheckToAttio, sendBrandCheckEmail } from "./deliver.ts";

/**
 * The free brand check (/brand-check, JP 2026-11-06). Same rules as the brief (server/brief/route.ts):
 *
 * POST /api/brand-check  { request, submissionId, _gotcha } → { ok: true, calendlyUrl }
 *   Same-site posts only (403 otherwise). A filled honeypot gets ok and delivers nothing. More than
 *   5 posts per hashed address in 10 min, or 3 per email a day, get 429. The same submissionId
 *   within 24 h skips delivery. Attio and the email are independent: when one fails the visitor
 *   still gets ok; when both fail they get 502 and the submissionId stays unspent so a resend
 *   delivers. A failed delivery logs a generated reference id, the failed steps and the email's
 *   domain, never what the visitor wrote. Request bodies stay out of the request log (server/apiLog.ts).
 */

const SUBMISSION_TTL_SECONDS = 24 * 60 * 60;
const MAX_PER_EMAIL_PER_DAY = 3;
const HONEYPOT_FIELD = "_gotcha";

const body = z.object({
  request: brandCheckSchema,
  submissionId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
});

const RETRY_MESSAGE = "We could not send your request. Nothing was lost: please send it again in a moment.";

export type BrandCheckDeps = {
  rateLimit: (ip: string, bucket: "brandCheck") => Promise<boolean>;
  incrWithExpiry: (key: string, ttlSeconds: number) => Promise<number>;
  deleteKey: (key: string) => Promise<void>;
  deliverToAttio: (request: BrandCheckRequest) => Promise<void>;
  sendEmail: (request: BrandCheckRequest) => Promise<void>;
  calendlyUrl: (contact: { name: string; email: string }) => string;
};

const defaultDeps: BrandCheckDeps = {
  rateLimit,
  incrWithExpiry,
  deleteKey,
  deliverToAttio: deliverBrandCheckToAttio,
  sendEmail: sendBrandCheckEmail,
  calendlyUrl: briefCalendlyUrl,
};

/** The part of an address after "@", for a log line that must not name the person. */
const emailDomain = (email: string) => email.split("@").pop()?.toLowerCase().replace(/[^a-z0-9.-]/g, "").slice(0, 80) || "unknown";

function sameSiteOnly(req: Request, res: Response, next: NextFunction) {
  const foreignHost = foreignPostSource(req);
  if (!foreignHost) return next();
  console.warn(`[brand-check] refused cross-site post from ${foreignHost}`);
  return res.status(403).json({ error: "Forbidden" });
}

export function registerBrandCheckRoutes(app: Express, deps: BrandCheckDeps = defaultDeps) {
  app.post("/api/brand-check", sameSiteOnly, async (req, res) => {
    const ip = clientIp(req);

    // Honeypot first: a bot that filled it learns nothing, whatever else it sent. Counted like a delivery.
    const honeypot = (req.body as Record<string, unknown> | undefined)?.[HONEYPOT_FIELD];
    if (typeof honeypot === "string" && honeypot.trim()) {
      await deps.rateLimit(ip, "brandCheck");
      console.warn("[brand-check] honeypot hit");
      return res.json({ ok: true, calendlyUrl: "" });
    }

    const parsed = body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request" });
    const request = parsed.data.request;
    const calendlyUrl = deps.calendlyUrl(request);

    if (!(await deps.rateLimit(ip, "brandCheck"))) {
      return res.status(429).json({ error: "Too many requests from this address. Try again in a few minutes." });
    }

    const submissionKey = `brandcheck:${parsed.data.submissionId}`;
    try {
      if ((await deps.incrWithExpiry(submissionKey, SUBMISSION_TTL_SECONDS)) > 1) return res.json({ ok: true, calendlyUrl });
    } catch (err) {
      console.error(`[brand-check] idempotency store failed, delivering anyway: ${err instanceof Error ? err.message : "unknown error"}`);
    }

    // Counted after the idempotency check, so a resent submission never uses the cap up twice.
    const emailKey = `brandcheckmail:${createHash("sha256").update(request.email.toLowerCase()).digest("hex").slice(0, 32)}`;
    try {
      if ((await deps.incrWithExpiry(emailKey, SUBMISSION_TTL_SECONDS)) > MAX_PER_EMAIL_PER_DAY) {
        await deps.deleteKey(submissionKey).catch(() => {});
        return res.status(429).json({ error: "Too many requests from this address. Try again tomorrow." });
      }
    } catch {
      // A counter outage never blocks a real lead.
    }

    const steps = [
      ["Attio", deps.deliverToAttio],
      ["email", deps.sendEmail],
    ] as const;
    const results = await Promise.allSettled(steps.map(([, deliver]) => deliver(request)));
    // Step names and our own error messages (statuses, missing config) only: never the request.
    const failures = results.flatMap((result, i) => {
      if (result.status === "fulfilled") return [];
      const reason = result.reason instanceof Error ? result.reason.message : "unknown error";
      return [`${steps[i][0]}: ${reason.replace(/\s+/g, " ").slice(0, 160)}`];
    });
    if (!failures.length) return res.json({ ok: true, calendlyUrl });

    const ref = randomUUID();
    const allFailed = failures.length === steps.length;
    console.error(
      `[brand-check] delivery failed ref=${ref} domain=${emailDomain(request.email)} ${allFailed ? "nothing delivered, visitor asked to resend" : "partly delivered"} (${failures.join("; ")})`,
    );
    if (!allFailed) return res.json({ ok: true, calendlyUrl });

    try {
      await deps.deleteKey(submissionKey);
      // Nothing was delivered, so this attempt does not count against the visitor's daily cap.
      await deps.deleteKey(emailKey);
    } catch (err) {
      console.error(`[brand-check] could not release ref=${ref} for a resend: ${err instanceof Error ? err.message : "unknown error"}`);
    }
    return res.status(502).json({ error: RETRY_MESSAGE, ref });
  });
}
