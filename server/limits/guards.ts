import { createHmac } from "node:crypto";
import { incrWithExpiry } from "./store.ts";

/**
 * Rate limits per address for the brief, the brand check and the contact form.
 *
 * - Rate limits fail open when the counter store errors: the visitor never sees an error.
 *
 * Addresses are never stored as written: IPv6 is cut to its /64 (one household or one
 * server rotates inside it), then hashed with HMAC-SHA256 and a server salt (RATE_LIMIT_SALT,
 * or a fixed app salt when unset).
 */

const RATE_LIMITS = {
  brief: { max: 20, windowSeconds: 10 * 60 },
  submit: { max: 5, windowSeconds: 10 * 60 },
  brandCheck: { max: 5, windowSeconds: 10 * 60 },
  audit: { max: 5, windowSeconds: 10 * 60 },
} as const;

const APP_SALT = "atla-site-v2-rate-limit";

/** IPv4 as is; IPv6 cut to its first four hextets (/64); IPv4-mapped IPv6 as its IPv4. */
export function ipBucket(ip: string): string {
  const value = ip.trim().toLowerCase().replace(/^\[|\]$/g, "").replace(/%.*$/, "");
  const mapped = value.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return mapped[1];
  if (!value.includes(":")) return value;
  const [head, tail = ""] = value.split("::");
  const left = head ? head.split(":") : [];
  const right = value.includes("::") && tail ? tail.split(":") : [];
  const groups = value.includes("::")
    ? [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill("0"), ...right]
    : left;
  return `${groups
    .slice(0, 4)
    .map((group) => (group || "0").replace(/^0+(?=.)/, ""))
    .join(":")}::/64`;
}

let warnedNoSalt = false;

/**
 * The key an address is counted under: HMAC-SHA256 of the /64 or IPv4 keyed with RATE_LIMIT_SALT, never
 * the address itself. Without the env var the salt is the one in the repo, which only pseudonymises:
 * production logs that once.
 */
export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || APP_SALT;
  if (!process.env.RATE_LIMIT_SALT && !warnedNoSalt && (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production")) {
    warnedNoSalt = true;
    console.error("[limits] RATE_LIMIT_SALT is not set in production: hashed addresses can be reversed by anyone who reads the counter keys");
  }
  return createHmac("sha256", salt).update(ipBucket(ip)).digest("hex").slice(0, 32);
}

/** True while `ip` is within its limit for `bucket`. */
export async function rateLimit(ip: string, bucket: keyof typeof RATE_LIMITS): Promise<boolean> {
  const { max, windowSeconds } = RATE_LIMITS[bucket];
  try {
    return (await incrWithExpiry(`rl:${bucket}:${hashIp(ip)}`, windowSeconds)) <= max;
  } catch (err) {
    console.error(`[limits] rate limit store failed, allowing request: ${err instanceof Error ? err.message : String(err)}`);
    return true;
  }
}
