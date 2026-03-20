export const SITE_ORIGIN = "https://atla-website.vercel.app";
export const SITE_NAME = "Atla";
export const ORGANIZATION_NAME = "Atla";
export const ORGANIZATION_LOGO_URL = `${SITE_ORIGIN}/figmaAssets/logo.svg`;
export const DEFAULT_OG_IMAGE_URL = `${SITE_ORIGIN}/figmaAssets/about-hero.jpg`;
export const MAX_META_TITLE_LENGTH = 60;

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
