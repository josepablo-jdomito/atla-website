/**
 * Every journal article in Sanity points its coverImage and heroImage at the same asset
 * (one stock photo, checked 2026-11-05), so the index showed one picture six times.
 * A cover only counts as the article's own when no other article uses the same file;
 * a shared cover is treated as no cover, and the card shows no image rather than a wrong one.
 */
type WithCover = { slug: string; coverImage?: string | null };

/** The Sanity file name without query or crop params, so ?w= variants of one asset compare equal. */
function coverKey(url: string): string {
  return url.split("?")[0].split("#")[0];
}

export function ownCovers(articles: readonly WithCover[]): Map<string, string> {
  const uses = new Map<string, number>();
  for (const article of articles) {
    if (!article.coverImage) continue;
    const key = coverKey(article.coverImage);
    uses.set(key, (uses.get(key) ?? 0) + 1);
  }
  const covers = new Map<string, string>();
  for (const article of articles) {
    if (article.coverImage && uses.get(coverKey(article.coverImage)) === 1) covers.set(article.slug, article.coverImage);
  }
  return covers;
}
