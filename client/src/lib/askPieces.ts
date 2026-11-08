import { assetKey } from "@/components/site/wallLayout";

/**
 * Where a piece of work links: its project page, opened at that image (`#at=`, a fragment: crawlers see
 * one URL per project, and the server never gets it). The wall's tiles and
 * Ask's pieces use this one rule, so a piece always lands on the picture the visitor clicked.
 */
export const pieceHref = (slug: string, src: string) => `/projects/${slug}#at=${encodeURIComponent(assetKey(src))}`;
