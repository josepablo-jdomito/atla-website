import { z } from "zod";
import { BRAND_CHECK_INVESTING, BRAND_CHECK_MOMENTS, brandCheckLabel, brandFromSite, type BrandCheckOption } from "./brandCheck.ts";

/**
 * The free brand audit (/audit, JP 2026-11-07): the audit clients pay for, free for five brands a
 * week, in order of arrival. One screen, a few fields, delivered like the brand check (an Attio
 * note and an email to the studio) plus a shared weekly counter that tells the page whether this
 * week's five are taken. The option labels live in shared/brandCheck.ts so both doors read the same.
 */

/** Audits per ISO week. The only place the number lives; the page says it in words. */
export const AUDITS_PER_WEEK = 5;

export const AUDIT_MOMENTS = BRAND_CHECK_MOMENTS;
export const AUDIT_INVESTING = BRAND_CHECK_INVESTING;
export type AuditOption = BrandCheckOption;

const values = <T extends readonly AuditOption[]>(options: T) =>
  options.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

export const MAX_AUDIT_MESSAGE = 2000;

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
  moment: z.enum(values(AUDIT_MOMENTS)),
  investing: z.enum(values(AUDIT_INVESTING)),
  message: z.string().trim().max(MAX_AUDIT_MESSAGE).optional().default(""),
});

export type AuditRequest = z.infer<typeof auditSchema>;
/** What the form holds while the visitor fills it: every field a string, "" when untouched. */
export type AuditDraft = Record<keyof AuditRequest, string>;
export const EMPTY_AUDIT: AuditDraft = { name: "", email: "", site: "", moment: "", investing: "", message: "" };

/** Whether this week's five are still open. The page shows one line for each. */
export type AuditWeek = "open" | "full";

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

export { brandCheckLabel as auditLabel, brandFromSite };
