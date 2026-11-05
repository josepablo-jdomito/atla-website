import { getCount, incrWithExpiry } from "./store.ts";

/**
 * Rate limits per address and the monthly AI call budget.
 *
 * Both fail safe when the counter store errors: a rate limit lets the request
 * through (the visitor never sees an error, and the AI budget still holds),
 * while the budget reports exhausted so no AI call goes out uncounted.
 */

const RATE_LIMITS = {
  ask: { max: 30, windowSeconds: 10 * 60 },
  brief: { max: 20, windowSeconds: 10 * 60 },
} as const;

const DEFAULT_AI_MONTHLY_CALL_CAP = 3000;
const AI_ALERT_RATIO = 0.8;
// Longer than any month, so the key outlives its month and then disappears.
const AI_KEY_TTL_SECONDS = 40 * 24 * 60 * 60;

/** True while `ip` is within its limit for `bucket`. */
export async function rateLimit(ip: string, bucket: keyof typeof RATE_LIMITS): Promise<boolean> {
  const { max, windowSeconds } = RATE_LIMITS[bucket];
  try {
    return (await incrWithExpiry(`rl:${bucket}:${ip}`, windowSeconds)) <= max;
  } catch (err) {
    console.error(`[limits] rate limit store failed, allowing request: ${err instanceof Error ? err.message : String(err)}`);
    return true;
  }
}

export function aiMonthlyCallCap(): number {
  const cap = Number.parseInt(process.env.AI_MONTHLY_CALL_CAP || "", 10);
  return Number.isFinite(cap) && cap > 0 ? cap : DEFAULT_AI_MONTHLY_CALL_CAP;
}

/** `ai:YYYY-MM`, in UTC. */
const aiBudgetKey = (now = new Date()) => `ai:${now.toISOString().slice(0, 7)}`;

export async function aiBudgetAvailable(): Promise<boolean> {
  try {
    return (await getCount(aiBudgetKey())) < aiMonthlyCallCap();
  } catch (err) {
    console.error(`[limits] AI budget store failed, treating budget as spent: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

/**
 * Count one AI call. The call that reaches 80% of the cap logs the alert; INCR
 * is atomic, so with Upstash that happens once per month across all instances.
 */
export async function recordAiCall(): Promise<void> {
  const key = aiBudgetKey();
  try {
    const count = await incrWithExpiry(key, AI_KEY_TTL_SECONDS);
    const cap = aiMonthlyCallCap();
    if (count === Math.ceil(cap * AI_ALERT_RATIO)) {
      console.error(`[limits] ALERT: AI calls at 80% of the monthly cap (${count}/${cap}, ${key})`);
    }
  } catch (err) {
    console.error(`[limits] could not record AI call: ${err instanceof Error ? err.message : String(err)}`);
  }
}
