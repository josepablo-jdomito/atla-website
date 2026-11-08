type ImageDeliveryOptions = {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "max" | "clip" | "crop" | "fill" | "fillmax" | "min" | "scale";
  autoFormat?: boolean;
  /** Sanity hotspot centre (0..1). With a width and a height it crops around that point. */
  focal?: { x: number; y: number } | null;
};

const SANITY_IMAGE_HOST = "cdn.sanity.io";
const LOCAL_IMAGE_PREFIX = "/figmaAssets/";
const LOCAL_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/figmaAssets/about-hero.jpg": { width: 1200, height: 810 },
  "/figmaAssets/photo-1.jpg": { width: 550, height: 550 },
  "/figmaAssets/photo-2.jpg": { width: 403, height: 600 },
  "/figmaAssets/photo-3.jpg": { width: 736, height: 920 },
  "/figmaAssets/photo-4.jpg": { width: 800, height: 800 },
};

export function sanitizeImageUrl(src?: string | null) {
  if (!src || typeof src !== "string") return null;

  const trimmed = src.trim();
  if (!trimmed) return null;
  if (/^javascript:/i.test(trimmed)) return null;
  if (/^data:/i.test(trimmed)) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith(`${SANITY_IMAGE_HOST}/`)) {
    return `https://${trimmed}`;
  }

  if (trimmed.startsWith(LOCAL_IMAGE_PREFIX) || trimmed.startsWith("/")) {
    return trimmed;
  }

  if (trimmed.startsWith("figmaAssets/")) {
    return `/${trimmed}`;
  }

  return null;
}

export function sanitizeImageUrls(sources: Array<string | null | undefined>) {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const source of sources) {
    const value = sanitizeImageUrl(source);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    normalized.push(value);
  }

  return normalized;
}

function roundDimension(value?: number) {
  if (!value || !Number.isFinite(value)) return undefined;
  return Math.max(1, Math.round(value));
}

export function isSanityImageUrl(src?: string | null) {
  if (!src) return false;

  try {
    return new URL(src, "https://www.atla.design").hostname === SANITY_IMAGE_HOST;
  } catch {
    return false;
  }
}

export function getOptimizedImageUrl(
  src?: string | null,
  {
    width,
    height,
    quality = 92,
    fit = "max",
    autoFormat = true,
    focal,
  }: ImageDeliveryOptions = {},
) {
  if (!src || !isSanityImageUrl(src)) {
    return src ?? "";
  }

  const url = new URL(src);
  const resolvedWidth = roundDimension(width);
  const resolvedHeight = roundDimension(height);

  if (autoFormat) {
    url.searchParams.set("auto", "format");
  }

  const cropAround = focal && resolvedWidth && resolvedHeight && Number.isFinite(focal.x) && Number.isFinite(focal.y);
  url.searchParams.set("fit", cropAround ? "crop" : fit);
  if (cropAround) {
    url.searchParams.set("crop", "focalpoint");
    url.searchParams.set("fp-x", String(Math.max(0, Math.min(1, focal.x))));
    url.searchParams.set("fp-y", String(Math.max(0, Math.min(1, focal.y))));
  }

  if (resolvedWidth) {
    url.searchParams.set("w", String(resolvedWidth));
  }

  if (resolvedHeight) {
    url.searchParams.set("h", String(resolvedHeight));
  }

  if (quality > 0) {
    url.searchParams.set("q", String(Math.max(1, Math.min(quality, 100))));
  }

  return url.toString();
}

export function buildImageSrcSet(
  src?: string | null,
  widths: number[] = [],
  options: Omit<ImageDeliveryOptions, "width"> & { ratio?: number } = {},
) {
  if (!src || !isSanityImageUrl(src)) {
    return undefined;
  }

  const normalizedWidths = Array.from(
    new Set(widths.map(roundDimension).filter((value): value is number => Boolean(value))),
  )
    .sort((left, right) => left - right);

  if (normalizedWidths.length === 0) {
    return undefined;
  }

  // With a crop ratio (`height` as a share of the width), each candidate gets its own height.
  const { ratio, ...rest } = options;
  return normalizedWidths
    .map((width) => `${getOptimizedImageUrl(src, { ...rest, width, height: ratio ? width / ratio : rest.height })} ${width}w`)
    .join(", ");
}

export function getImageDimensions(src?: string | null) {
  if (!src) return undefined;

  let normalizedSrc = src;

  try {
    normalizedSrc = new URL(src, "https://www.atla.design").pathname;
  } catch {
    normalizedSrc = src;
  }

  if (LOCAL_IMAGE_DIMENSIONS[normalizedSrc]) {
    return LOCAL_IMAGE_DIMENSIONS[normalizedSrc];
  }

  const sanityMatch = src.match(/-(\d+)x(\d+)\.(?:png|jpe?g|webp|avif|gif|svg)(?:\?|$)/i);
  if (sanityMatch) {
    const width = Number(sanityMatch[1]);
    const height = Number(sanityMatch[2]);
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return { width, height };
    }
  }

  return undefined;
}
