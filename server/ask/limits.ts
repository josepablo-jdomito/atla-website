import { hashIp } from "../limits/guards.ts";
import { incrWithExpiry, isProduction, sharedStoreConfigured } from "../limits/store.ts";

/**
 * Ask's brakes, on the brief's counter store and its hashed addresses (server/limits):
 *
 * - a short window per address (ASK_RATE_MAX per ten minutes),
 * - a daily cap per address (AI_DAILY_IP_CAP, default forty asks),
 * - a monthly call budget for the whole site (AI_MONTHLY_CALL_CAP, default three thousand),
 * - an idempotency mark per ask, so a resent request is never answered (and paid for) twice.
 *
 * All of them fail closed: a store error, or production without Upstash (per-instance memory is a
 * brake, not a control), means no model call. Ask then says so and the pill keeps Search.
 */

const RATE_WINDOW_SECONDS = 10 * 60;
const DEFAULT_RATE_MAX = 12;
const DEFAULT_DAILY_IP_CAP = 40;
const DEFAULT_MONTHLY_CAP = 3000;
const ALERT_RATIO = 0.8;
const DAILY_TTL_SECONDS = 26 * 60 * 60;
const MONTHLY_TTL_SECONDS = 40 * 24 * 60 * 60;
const IDEMPOTENCY_TTL_SECONDS = 10 * 60;

const positiveInt = (raw: string | undefined, fallback: number) => {
  const n = Number.parseInt(raw || "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** The model may run only where the caps are shared: always in development, in production only with Upstash. */
export const askStoreReady = () => sharedStoreConfigured() || !isProduction();

export type AskLimit = "ok" | "rate" | "daily" | "budget" | "duplicate" | "store";

async function count(key: string, ttl: number): Promise<number | null> {
  try {
    return await incrWithExpiry(key, ttl);
  } catch (err) {
    console.error(`[ask] limit store failed, refusing: ${err instanceof Error ? err.name : "unknown error"}`);
    return null;
  }
}

/**
 * Counts one ask for `ip` and says whether it may reach the model. The order matters: a duplicate is
 * refused before it counts against anything, and the monthly budget is taken last, so a refused ask
 * never spends it.
 */
export async function checkAskLimits(ip: string, idempotencyKey: string, now = new Date()): Promise<AskLimit> {
  if (!askStoreReady()) return "store";
  const hashed = hashIp(ip);

  const seen = await count(`ask:idem:${idempotencyKey}`, IDEMPOTENCY_TTL_SECONDS);
  if (seen === null) return "store";
  if (seen > 1) return "duplicate";

  const recent = await count(`rl:ask:${hashed}`, RATE_WINDOW_SECONDS);
  if (recent === null) return "store";
  if (recent > positiveInt(process.env.ASK_RATE_MAX, DEFAULT_RATE_MAX)) return "rate";

  const today = await count(`aid:ask:${now.toISOString().slice(0, 10)}:${hashed}`, DAILY_TTL_SECONDS);
  if (today === null) return "store";
  if (today > positiveInt(process.env.AI_DAILY_IP_CAP, DEFAULT_DAILY_IP_CAP)) return "daily";

  const month = await takeMonthlyUnit(now);
  if (month === "store") return "store";
  if (month === "budget") return "budget";

  return "ok";
}

/** One unit of the site-wide monthly model-call budget. */
async function takeMonthlyUnit(now: Date): Promise<"ok" | "budget" | "store"> {
  const monthKey = `ai:${now.toISOString().slice(0, 7)}`;
  const month = await count(monthKey, MONTHLY_TTL_SECONDS);
  if (month === null) return "store";
  const cap = positiveInt(process.env.AI_MONTHLY_CALL_CAP, DEFAULT_MONTHLY_CAP);
  if (month === Math.ceil(cap * ALERT_RATIO)) console.error(`[ask] ALERT: AI calls at 80% of the monthly cap (${monthKey})`);
  return month > cap ? "budget" : "ok";
}

/** The retry is a second model call: it takes a second unit, and is skipped when the budget refuses it. */
export async function takeAskRetryBudget(now = new Date()): Promise<boolean> {
  return (await takeMonthlyUnit(now)) === "ok";
}
