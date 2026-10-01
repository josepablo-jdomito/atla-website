import type { BrandReadResult } from "./brandRead.ts";

/**
 * A development fixture for the Mirror, so the page can be built and checked
 * without spending a live read on every reload.
 *
 * The quotes are real: they were scraped verbatim from the public Trustpilot
 * page while this feature was being built. The counts are illustrative, which
 * is exactly why this never runs outside local development.
 */
const FIXTURE: BrandReadResult = {
  brand: "oatly",
  category: "oat milk",
  total: 119,
  counts: [
    { momentId: "discovery", count: 6 },
    { momentId: "first-contact", count: 4 },
    { momentId: "purchase", count: 9 },
    { momentId: "wait", count: 3 },
    { momentId: "use", count: 51 },
    { momentId: "when-it-goes-wrong", count: 41 },
    { momentId: "return", count: 5 },
  ],
  leakMomentId: "when-it-goes-wrong",
  quotes: [
    {
      text: "I tried to send a complain using online form - it doesn’t work. Send them email with all the detail no reply. Poor customer service.",
      source: "Trustpilot",
      momentId: "when-it-goes-wrong",
    },
    {
      text: "I called customer service in Malmö and Stockholm and was on hold for full hour with no one answering the phone",
      source: "Trustpilot",
      momentId: "when-it-goes-wrong",
    },
  ],
  verdict:
    "Your product argument is fine. People who dislike the taste say so once and move on. What they do not move on from is writing to you and hearing nothing back, and that is where the loudest, longest posts cluster. The leak is not the oat milk, it is the silence after someone takes the trouble to complain.",
  sources: ["trustpilot.com", "reddit.com"],
};

/**
 * Only ever returns anything in local development, and only when explicitly
 * switched on. Production returns null no matter what the environment says.
 */
export function brandReadFixture(): BrandReadResult | null {
  if (process.env.NODE_ENV === "production") return null;
  if (process.env.BRAND_READ_FIXTURE !== "1") return null;
  return FIXTURE;
}
