import { createHash } from "node:crypto";
import { incrWithExpiry, isProduction, sharedStoreConfigured } from "./store.ts";

/**
 * Rate limits per address, the daily AI cap per address and the monthly AI call budget.
 *
 * - Rate limits fail open when the counter store errors: the visitor never sees an error,
 *   and the AI caps below still hold.
 * - Both AI caps fail closed: a store error, or production without Upstash, means no AI call.
 *   Every AI path has a non-AI fallback.
 *
 * Addresses are never stored as written: IPv6 is cut to its /64 (one household or one
 * server rotates inside it), then hashed with sha256 and a server salt (RATE_LIMIT_SALT,
 * or a fixed app salt when unset).
 */

const RATE_LIMITS = {
  ask: { max: 30, windowSeconds: 10 * 60 },
  brief: { max: 20, windowSeconds: 10 * 60 },
  submit: { max: 5, windowSeconds: 10 * 60 },
} as const;

const DEFAULT_AI_MONTHLY_CALL_CAP = 3000;
const DEFAULT_AI_DAILY_IP_CAP = 40;
const AI_ALERT_RATIO = 0.8;
// Longer than any month, so the key outlives its month and then disappears.
const AI_KEY_TTL_SECONDS = 40 * 24 * 60 * 60;
// Longer than a day, for the same reason.
const AI_DAILY_KEY_TTL_SECONDS = 26 * 60 * 60;
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

/** The key an address is counted under: sha256(salt + /64 or IPv4), never the address itself. */
export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || APP_SALT;
  return createHash("sha256").update(`${salt}:${ipBucket(ip)}`).digest("hex").slice(0, 32);
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

const positiveInt = (raw: string | undefined, fallback: number) => {
  const n = Number.parseInt(raw || "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const aiMonthlyCallCap = () => positiveInt(process.env.AI_MONTHLY_CALL_CAP, DEFAULT_AI_MONTHLY_CALL_CAP);
export const aiDailyIpCap = () => positiveInt(process.env.AI_DAILY_IP_CAP, DEFAULT_AI_DAILY_IP_CAP);

/** The AI may run only where its caps are shared: always in development, in production only with Upstash. */
export const aiStoreReady = () => sharedStoreConfigured() || !isProduction();

/** `ai:YYYY-MM`, in UTC. */
const aiBudgetKey = (now = new Date()) => `ai:${now.toISOString().slice(0, 7)}`;
/** `aid:YYYY-MM-DD:<hashed ip>`, in UTC. */
const aiDailyKey = (ip: string, now = new Date()) => `aid:${now.toISOString().slice(0, 10)}:${hashIp(ip)}`;

/** Counts one AI attempt for `ip` today; true while that address is within the daily cap. */
export async function aiAllowedForIp(ip: string): Promise<boolean> {
  if (!aiStoreReady()) return false;
  try {
    return (await incrWithExpiry(aiDailyKey(ip), AI_DAILY_KEY_TTL_SECONDS)) <= aiDailyIpCap();
  } catch (err) {
    console.error(`[limits] AI daily cap store failed, AI off for this request: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

/**
 * Takes one call from the monthly budget: a single atomic INCR, refused when the new count is
 * past the cap or the store fails, so a burst cannot overshoot and no call goes out uncounted.
 * The call that reaches 80% of the cap logs the alert, once per month across instances.
 */
export async function reserveAiCall(): Promise<boolean> {
  if (!aiStoreReady()) return false;
  const key = aiBudgetKey();
  let count: number;
  try {
    count = await incrWithExpiry(key, AI_KEY_TTL_SECONDS);
  } catch (err) {
    console.error(`[limits] AI budget store failed, treating budget as spent: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
  const cap = aiMonthlyCallCap();
  if (count === Math.ceil(cap * AI_ALERT_RATIO)) {
    console.error(`[limits] ALERT: AI calls at 80% of the monthly cap (${count}/${cap}, ${key})`);
  }
  return count <= cap;
}
