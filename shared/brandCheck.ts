import { z } from "zod";

/**
 * The free brand check (/brand-check, JP 2026-11-06, after baked.design/design-check): one screen,
 * a few fields, delivered like the brief (Attio note + an email to the studio). The option labels
 * live here so the page, the Attio note and the email read the same words.
 */

export type BrandCheckOption = { value: string; label: string };

export const BRAND_CHECK_MOMENTS = [
  { value: "launch", label: "Launch" },
  { value: "raise", label: "Raise capital" },
  { value: "grow", label: "Grow" },
  { value: "reposition", label: "Reposition" },
  { value: "not_sure", label: "Not sure" },
] as const satisfies readonly BrandCheckOption[];

export const BRAND_CHECK_SIZES = [
  { value: "solo", label: "Just me" },
  { value: "small_team", label: "A small team" },
  { value: "company", label: "A company" },
  { value: "group", label: "A group of brands" },
] as const satisfies readonly BrandCheckOption[];

export const BRAND_CHECK_INVESTING = [
  { value: "not_yet", label: "Not yet" },
  { value: "maybe", label: "Maybe" },
  { value: "yes", label: "Yes" },
] as const satisfies readonly BrandCheckOption[];

const values = <T extends readonly BrandCheckOption[]>(options: T) =>
  options.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

export const MAX_BRAND_CHECK_MESSAGE = 2000;

/** A website ("brand.com", "https://brand.com/x") or an Instagram ("@brand", "instagram.com/brand"): one word, no spaces. */
const siteOrHandle = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine((value) => /^\S+$/.test(value) && (/^@[A-Za-z0-9._]{1,30}$/.test(value) || /[A-Za-z0-9-]\.[A-Za-z]{2,}/.test(value)), {
    message: "site",
  });

export const brandCheckSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  site: siteOrHandle,
  moment: z.enum(values(BRAND_CHECK_MOMENTS)),
  size: z.enum(values(BRAND_CHECK_SIZES)),
  investing: z.enum(values(BRAND_CHECK_INVESTING)),
  message: z.string().trim().max(MAX_BRAND_CHECK_MESSAGE).optional().default(""),
});

export type BrandCheckRequest = z.infer<typeof brandCheckSchema>;
/** What the form holds while the visitor fills it: every field a string, "" when untouched. */
export type BrandCheckDraft = Record<keyof BrandCheckRequest, string>;
export const EMPTY_BRAND_CHECK: BrandCheckDraft = { name: "", email: "", site: "", moment: "", size: "", investing: "", message: "" };

/** The label the visitor saw for a stored value. */
export function brandCheckLabel(options: readonly BrandCheckOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/**
 * The brand's name for the Attio note title and the email subject: the Instagram handle, or the
 * website's host without "www.". Falls back to the person's name.
 */
export function brandFromSite(site: string, fallback = ""): string {
  const value = site.trim();
  if (value.startsWith("@")) return value;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (/(^|\.)instagram\.com$/.test(host)) {
      const handle = url.pathname.split("/").filter(Boolean)[0];
      if (handle) return `@${handle}`;
    }
    if (host) return host;
  } catch {
    // Not a URL: fall through.
  }
  return fallback.trim() || value;
}
