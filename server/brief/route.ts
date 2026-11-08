import { createHash, randomUUID } from "node:crypto";
import type { Express, NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  BRIEF_QUESTIONS,
  briefContactSchema,
  isComplete,
  type BriefContact,
  type BriefState,
} from "../../shared/brief.ts";
import { clientIp, foreignPostSource } from "../contact.ts";
import { rateLimit } from "../limits/guards.ts";
import { deleteKey, incrWithExpiry } from "../limits/store.ts";
import { briefCalendlyUrl, deliverBriefToAttio, sendBriefEmail, type SubmittedBrief } from "./deliver.ts";

/**
 * The brief: a short guided intake that ends in Attio, an email to JP and a
 * Calendly link.
 *
 * POST /api/brief/submit  { state, submissionId } → { ok: true, calendlyUrl }
 *   Attio and the email are independent. When one fails the lead still exists
 *   in the other, and the visitor gets ok. When both fail the visitor gets 502
 *   and is asked to send again, and the submissionId stays unspent so that
 *   resend delivers. Either way the log line holds a generated reference id,
 *   the failed steps and the email's domain, never the brief itself (JP,
 *   2026-11-05: a failed delivery is never logged in full). The same
 *   submissionId within 24 h skips delivery. A filled honeypot (`_gotcha`) gets
 *   ok and delivers nothing; more than 5 submits per address in 10 min get 429.
 *
 * The route refuses cross-site posts (Origin or Referer naming another host)
 * with 403, like the contact form. The questions and their order live in shared/brief.ts and the
 * page walks them itself: no AI picks or rewords them (JP, 2026-11-05). Request bodies stay out of the request log
 * (server/apiLog.ts).
 */

const MAX_ANSWER_CHARS = 1000;
const MAX_MULTI_ITEMS = 10;
const MAX_ANSWER_KEYS = 20;
const MAX_SEED_CHARS = 300;
const SUBMISSION_TTL_SECONDS = 24 * 60 * 60;
/** Briefs one email address can file in a day: it stops a script from filling Attio under a real client's address. */
const MAX_BRIEFS_PER_EMAIL_PER_DAY = 3;
const HONEYPOT_FIELD = "_gotcha";

const answerValue = z.union([
  z.string().max(MAX_ANSWER_CHARS),
  z.array(z.string().max(MAX_ANSWER_CHARS)).max(MAX_MULTI_ITEMS),
]);

const answersSchema = z
  .record(z.string().max(40), answerValue)
  .refine((answers) => Object.keys(answers).length <= MAX_ANSWER_KEYS, { message: "Too many answers" });

/** Only the bank's question ids, with option values the bank offers: a script cannot invent labels for JP's email. */
function answersMatchBank(answers: Record<string, string | string[]>): boolean {
  const known = new Map(BRIEF_QUESTIONS.map((q) => [q.id, q]));
  return Object.entries(answers).every(([id, value]) => {
    const question = known.get(id);
    if (!question) return false;
    if (question.kind === "text") return typeof value === "string";
    const allowed = new Set((question.options ?? []).map((o) => o.value));
    const values = Array.isArray(value) ? value : [value];
    return (question.kind === "multi" || !Array.isArray(value)) && values.every((v) => allowed.has(v));
  });
}

const submitBody = z.object({
  state: z.object({
    seed: z.string().max(MAX_SEED_CHARS).optional(),
    answers: answersSchema,
    contact: briefContactSchema,
  }),
  submissionId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
}).refine(({ state }) => answersMatchBank(state.answers) && isComplete(state), { message: "Invalid brief" });

const RETRY_MESSAGE = "We could not send your brief. Nothing was lost: please send it again in a moment.";

type SubmitAnswer = { ok: true; calendlyUrl: string };

export type BriefDeps = {
  rateLimit: (ip: string, bucket: "submit") => Promise<boolean>;
  incrWithExpiry: (key: string, ttlSeconds: number) => Promise<number>;
  deleteKey: (key: string) => Promise<void>;
  deliverToAttio: (brief: SubmittedBrief) => Promise<void>;
  sendEmail: (brief: SubmittedBrief) => Promise<void>;
  calendlyUrl: (contact: BriefContact) => string;
};

const defaultDeps: BriefDeps = {
  rateLimit,
  incrWithExpiry,
  deleteKey,
  deliverToAttio: deliverBriefToAttio,
  sendEmail: sendBriefEmail,
  calendlyUrl: briefCalendlyUrl,
};

/** The part of an address after "@", for a log line that must not name the person. */
const emailDomain = (email: string) => email.split("@").pop()?.toLowerCase().replace(/[^a-z0-9.-]/g, "").slice(0, 80) || "unknown";

/** Same-site posts only, like the contact form: a page on another host cannot drive the brief. */
function sameSiteOnly(req: Request, res: Response, next: NextFunction) {
  const foreignHost = foreignPostSource(req);
  if (!foreignHost) return next();
  console.warn(`[brief] refused cross-site post from ${foreignHost}`);
  return res.status(403).json({ error: "Forbidden" });
}

/** True when this submissionId was already delivered. A store failure delivers anyway: a duplicate beats a lost lead. */
async function alreadySubmitted(deps: BriefDeps, submissionId: string): Promise<boolean> {
  try {
    return (await deps.incrWithExpiry(`brief:${submissionId}`, SUBMISSION_TTL_SECONDS)) > 1;
  } catch (err) {
    console.error(`[brief] idempotency store failed, delivering anyway: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

export function registerBriefRoutes(app: Express, deps: BriefDeps = defaultDeps) {
  app.post("/api/brief/submit", sameSiteOnly, async (req, res) => {
    const parsed = submitBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid brief" });

    const brief: SubmittedBrief = parsed.data.state;
    const answer = (body: SubmitAnswer) => res.json(body);
    const calendlyUrl = deps.calendlyUrl(brief.contact);
    const ip = clientIp(req);

    // Honeypot filled in: pretend success so bots learn nothing. Counted like a delivery.
    const honeypot = (req.body as Record<string, unknown>)[HONEYPOT_FIELD];
    if (typeof honeypot === "string" && honeypot.trim()) {
      await deps.rateLimit(ip, "submit");
      console.warn("[brief] honeypot hit");
      return answer({ ok: true, calendlyUrl });
    }

    // Before the idempotency mark, so a refused submit can still be delivered on a later retry.
    if (!(await deps.rateLimit(ip, "submit"))) {
      return res.status(429).json({ error: "Too many briefs from this address. Try again in a few minutes." });
    }

    try {
      const key = `briefmail:${createHash("sha256").update(brief.contact.email.toLowerCase()).digest("hex").slice(0, 32)}`;
      if ((await deps.incrWithExpiry(key, SUBMISSION_TTL_SECONDS)) > MAX_BRIEFS_PER_EMAIL_PER_DAY) {
        return res.status(429).json({ error: "Too many briefs from this address. Try again tomorrow." });
      }
    } catch {
      // A counter outage never blocks a real lead.
    }

    const submissionKey = `brief:${parsed.data.submissionId}`;
    if (await alreadySubmitted(deps, parsed.data.submissionId)) return answer({ ok: true, calendlyUrl });

    const steps = [
      ["Attio", deps.deliverToAttio],
      ["email", deps.sendEmail],
    ] as const;
    const results = await Promise.allSettled(steps.map(([, deliver]) => deliver(brief)));
    // Step names and our own error messages (statuses, missing config) only: never the brief.
    const failures = results.flatMap((result, i) => {
      if (result.status === "fulfilled") return [];
      const reason = result.reason instanceof Error ? result.reason.message : "unknown error";
      return [`${steps[i][0]}: ${reason.replace(/\s+/g, " ").slice(0, 160)}`];
    });
    if (!failures.length) return answer({ ok: true, calendlyUrl });

    const ref = randomUUID();
    const allFailed = failures.length === steps.length;
    console.error(
      `[brief] delivery failed ref=${ref} domain=${emailDomain(brief.contact.email)} ${allFailed ? "nothing delivered, visitor asked to resend" : "partly delivered"} (${failures.join("; ")})`,
    );
    if (!allFailed) return answer({ ok: true, calendlyUrl });

    // Nothing reached JP: leave the submissionId unspent so the visitor's resend delivers.
    try {
      await deps.deleteKey(submissionKey);
    } catch (err) {
      console.error(`[brief] could not release ref=${ref} for a resend: ${err instanceof Error ? err.message : "unknown error"}`);
    }
    return res.status(502).json({ error: RETRY_MESSAGE, ref });
  });
}
