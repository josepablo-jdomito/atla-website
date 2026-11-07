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
});

export type AuditRequest = z.infer<typeof auditSchema>;
/** What the form holds while the visitor fills it: every field a string, "" when untouched. */
export type AuditDraft = Record<keyof AuditRequest, string>;
export const EMPTY_AUDIT: AuditDraft = { name: "", email: "", site: "" };

/** Whether this week's five are still open. */
export type AuditWeek = "open" | "full";
/** What GET /api/audit/status answers: the week's slots as the page's live widget shows them. */
export type AuditStatus = { week: AuditWeek; taken: number; cap: number };

/**
 * The ISO week a moment falls in, as "2026-W45", in UTC: the counter key. Weeks start on Monday,
 * so the five open again every Monday at midnight UTC (Sunday evening in Austin).
 */
export function isoWeek(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export { brandFromSite };
