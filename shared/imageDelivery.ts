type ImageDeliveryOptions = {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "max" | "clip" | "crop" | "fill" | "fillmax" | "min" | "scale";
  autoFormat?: boolean;
};

const SANITY_IMAGE_HOST = "cdn.sanity.io";
const LOCAL_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/figmaAssets/about-hero.jpg": { width: 1200, height: 810 },
  "/figmaAssets/photo-1.jpg": { width: 550, height: 550 },
  "/figmaAssets/photo-2.jpg": { width: 403, height: 600 },
  "/figmaAssets/photo-3.jpg": { width: 736, height: 920 },
  "/figmaAssets/photo-4.jpg": { width: 800, height: 800 },
};

function roundDimension(value?: number) {
  if (!value || !Number.isFinite(value)) return undefined;
  return Math.max(1, Math.round(value));
}

export function isSanityImageUrl(src?: string | null) {
  if (!src) return false;

  try {
    return new URL(src, "https://atla-website.vercel.app").hostname === SANITY_IMAGE_HOST;
  } catch {
    return false;
  }
}

export function getOptimizedImageUrl(
  src?: string | null,
  {
    width,
    height,
    quality = 82,
    fit = "max",
    autoFormat = true,
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

  url.searchParams.set("fit", fit);

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
  options: Omit<ImageDeliveryOptions, "width"> = {},
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

  return normalizedWidths
    .map((width) => `${getOptimizedImageUrl(src, { ...options, width })} ${width}w`)
    .join(", ");
}

export function getImageDimensions(src?: string | null) {
  if (!src) return undefined;

  let normalizedSrc = src;

  try {
    normalizedSrc = new URL(src, "https://atla-website.vercel.app").pathname;
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
