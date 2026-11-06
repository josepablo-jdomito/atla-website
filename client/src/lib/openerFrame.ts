import { getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

/**
 * The opener's frame (fix wave 3, red team 4: the 4:3 crop was cutting wordmarks off their own covers).
 * 4:3 stays the rule, but it never decides alone:
 * - a Sanity hotspot on the cover wins: 4:3 around that point;
 * - without one, an image whose own ratio is close to 4:3 is cropped to 4:3, centered
 *   (at most a tenth of the height, or just over a quarter of the width, is lost);
 * - anything else is shown whole, at its own ratio, the column's width, no letterbox.
 */
export const OPENER_RATIO = 4 / 3;
/** Own ratios (width / height) that still crop to 4:3 when nobody set a hotspot. */
export const OPENER_CROP_MIN = 1.2;
export const OPENER_CROP_MAX = 1.85;

export type Focal = { x: number; y: number };
export type OpenerFrame =
  | { mode: "crop"; ratio: number; focal: Focal | null }
  | { mode: "native"; ratio: number | null; focal: null };

export function openerFrame(src: string, focal?: Focal | null): OpenerFrame {
  if (focal && Number.isFinite(focal.x) && Number.isFinite(focal.y)) return { mode: "crop", ratio: OPENER_RATIO, focal };
  const dims = getImageDimensions(src);
  if (!dims || dims.width <= 0 || dims.height <= 0) return { mode: "native", ratio: null, focal: null };
  const own = dims.width / dims.height;
  if (own >= OPENER_CROP_MIN && own <= OPENER_CROP_MAX) return { mode: "crop", ratio: OPENER_RATIO, focal: null };
  return { mode: "native", ratio: own, focal: null };
}

/** The opener image at `width`, cropped by the CDN when the frame crops; plain otherwise. */
export function openerImageUrl(src: string, frame: OpenerFrame, width: number, quality: number) {
  if (frame.mode === "crop") {
    return getOptimizedImageUrl(src, { width, height: width / frame.ratio, quality, fit: "crop", focal: frame.focal }) || src;
  }
  return getOptimizedImageUrl(src, { width, quality }) || src;
}
