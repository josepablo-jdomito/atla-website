import { z } from "zod";
import { brandFromSite } from "./brandCheck.ts";

/**
 * The free brand audit (/audit, JP 2026-11-07): the audit clients pay for, free for five brands a
 * week, in order of arrival. One screen, a few fields, delivered like the brand check (an Attio
 * note and an email to the studio) plus a shared weekly counter that tells the page whether this
 * week's five are taken. Three fields (JP, 2026-11-07, after oddit.co/pages/free-trial): the page
 * reads in two minutes.
 */

/** Audits per ISO week. The only place the number lives; the page says it in words. */
export const AUDITS_PER_WEEK = 5;

/** A website ("brand.com", "https://brand.com/x") or an Instagram ("@brand", "instagram.com/brand"): one word, no spaces. */
const siteOrHandle = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine((value) => /^\S+$/.test(value) && (/^@[A-Za-z0-9._]{1,30}$/.test(value) || /[A-Za-z0-9-]\.[A-Za-z]{2,}/.test(value)), {
    message: "site",
  });

export const auditSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  site: siteOrHandle,
  /** Where the visit came from (utm_* and the referrer host), read by the page; never typed by the visitor. */
  source: z
    .string()
    .trim()
    .max(240)
    .regex(/^(direct|(utm_(source|medium|campaign|content)=[\w.-]{1,60}|referrer=[a-z0-9.-]{1,80})(, (utm_(source|medium|campaign|content)=[\w.-]{1,60}|referrer=[a-z0-9.-]{1,80}))*)$/)
    .optional()
    .default("direct"),
});

export const MAX_AUDIT_FEEDBACK = 600;

/** The one post-submit question ("What almost stopped you from sending it?"), tied to the request by its id. */
export const auditFeedbackSchema = z.object({
  submissionId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  site: siteOrHandle,
  text: z.string().trim().min(1).max(MAX_AUDIT_FEEDBACK),
});
export type AuditFeedback = z.infer<typeof auditFeedbackSchema>;

export type AuditRequest = z.infer<typeof auditSchema>;
/** What the form holds while the visitor fills it: every field a string, "" when untouched. */
export type AuditDraft = Record<"name" | "email" | "site", string>;
export const EMPTY_AUDIT: AuditDraft = { name: "", email: "", site: "" };

/** Whether this week's five are still open. */
export type AuditWeek = "open" | "full";
/** What GET /api/audit/status answers: the week's slots as the page's live widget shows them, and last week's count. */
export type AuditStatus = { week: AuditWeek; taken: number; cap: number; last: number };

/** The studio's clock: the five open again on Monday at midnight in Austin, not at midnight UTC. */
export const AUDIT_TIME_ZONE = "America/Chicago";

const dateParts = new Intl.DateTimeFormat("en-CA", { timeZone: AUDIT_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });

/** The civil date of `date` in Austin, as a UTC midnight, so ISO week arithmetic can run on it. */
function austinDay(date: Date): Date {
  const [y, m, d] = dateParts.format(date).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * The ISO week a moment falls in, as "2026-W45", on Austin's calendar: the counter key. Weeks start
 * on Monday, so the five open again every Monday at midnight in Austin.
 */
export function isoWeek(date: Date = new Date()): string {
  return isoWeekOfDay(austinDay(date));
}

/** The ISO week seven days after `date`: where a request past this week's five is queued. */
export function nextIsoWeek(date: Date = new Date()): string {
  return isoWeekOfDay(new Date(austinDay(date).getTime() + 7 * 86_400_000));
}

/** The ISO week seven days before `date`: last week's count, for the widget's proof line. */
export function previousIsoWeek(date: Date = new Date()): string {
  return isoWeekOfDay(new Date(austinDay(date).getTime() - 7 * 86_400_000));
}

function isoWeekOfDay(day: Date): string {
  const d = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));
  const weekday = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export { brandFromSite };
