export const SITE_ORIGIN = "https://www.atla.design";
export const SITE_NAME = "Atla";
export const ORGANIZATION_NAME = "Atla";
export const ORGANIZATION_LOGO_URL = `${SITE_ORIGIN}/figmaAssets/logo.svg`;
export const DEFAULT_OG_IMAGE_URL = `${SITE_ORIGIN}/figmaAssets/about-hero.jpg`;
export const MAX_META_TITLE_LENGTH = 60;

/** Public studio inbox. Also mirrored by hand in client/public/security.txt. */
export const CONTACT_EMAIL = "josepablo@atla.design";
/** Guided entry point (Branding Analysis router) hosted on the start subdomain. */
export const START_URL = "https://start.atla.design";
/** Social profiles: rendered in the footer and asserted as Organization sameAs. */
export const SOCIAL_PROFILES = [
  { label: "Instagram", href: "https://www.instagram.com/atla.studio" },
  { label: "Behance", href: "https://www.behance.net/atla" },
  { label: "Linkedin", href: "https://www.linkedin.com/company/atlabrandingagency" },
] as const;
/** Organization JSON-LD asserted on / and /about. */
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORGANIZATION_NAME,
  url: SITE_ORIGIN,
  logo: ORGANIZATION_LOGO_URL,
  sameAs: SOCIAL_PROFILES.map((profile) => profile.href),
  areaServed: ["United States", "Latin America"],
} as const;
/** Home meta description, shared by the prerender route table and the runtime SeoHead. */
export const HOME_META_DESCRIPTION =
  "Strategy-led branding studio for companies across the US and Latin America. Positioning, identity, packaging, and digital systems that hold up after launch.";

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function formatMetaTitle(base: string, suffix?: string) {
  const cleanBase = normalizeWhitespace(base);
  const cleanSuffix = suffix ? normalizeWhitespace(suffix) : "";

  if (!cleanSuffix) {
    return cleanBase.length <= MAX_META_TITLE_LENGTH
      ? cleanBase
      : `${cleanBase.slice(0, MAX_META_TITLE_LENGTH - 1).trimEnd()}…`;
  }

  const fullTitle = `${cleanBase} | ${cleanSuffix}`;
  if (fullTitle.length <= MAX_META_TITLE_LENGTH) {
    return fullTitle;
  }

  if (cleanBase.length <= MAX_META_TITLE_LENGTH) {
    return cleanBase;
  }

  return `${cleanBase.slice(0, MAX_META_TITLE_LENGTH - 1).trimEnd()}…`;
}
