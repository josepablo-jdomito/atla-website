/**
 * Counters with expiry for rate limits and the brief's idempotency marks.
 *
 * With UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN set (or the KV_REST_API_URL and
 * KV_REST_API_TOKEN the Vercel Marketplace Upstash store injects), counters live in
 * Upstash Redis (plain REST, no SDK), so every Vercel instance shares them.
 * Without them, counters fall back to a per-process Map: on Vercel each
 * instance then keeps its own, which is a brake, not a control. That fallback
 * is logged once per process.
 */

const UPSTASH_TIMEOUT_MS = 2_000;
const MEMORY_SWEEP_AT = 5_000;

type MemoryEntry = { count: number; expiresAt: number };
const memory = new Map<string, MemoryEntry>();
let warnedNoUpstash = false;

export const isProduction = () =>
  process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview";

function upstashConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/+$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
  if (url && token) return { url, token };
  if (!warnedNoUpstash) {
    warnedNoUpstash = true;
    console.error(
      isProduction()
        ? "[limits] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set in production: rate limits and brief idempotency use per-instance memory"
        : "[limits] Upstash not configured, using per-instance memory",
    );
  }
  return null;
}

/** True when counters are shared across instances (Upstash). Logs the fallback once per process. */
export const sharedStoreConfigured = () => upstashConfig() !== null;

async function upstash(config: { url: string; token: string }, path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${config.url}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Upstash ${path} answered ${res.status}`);
  return res.json();
}

const toCount = (value: unknown) => {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) throw new Error("Upstash returned a non-numeric counter");
  return n;
};

function liveMemoryEntry(key: string, now: number): MemoryEntry | undefined {
  const entry = memory.get(key);
  if (entry && entry.expiresAt <= now) {
    memory.delete(key);
    return undefined;
  }
  return entry;
}

/**
 * Increment `key` and return the new value: the check-and-increment is this one atomic INCR,
 * so callers compare the result with their cap. The expiry is set only when the key is new
 * (fixed window), in the same request.
 */
export async function incrWithExpiry(key: string, ttlSeconds: number): Promise<number> {
  const config = upstashConfig();
  if (config) {
    const json = await upstash(config, "/pipeline", [["INCR", key], ["EXPIRE", key, String(ttlSeconds), "NX"]]);
    const first = Array.isArray(json) ? (json[0] as { result?: unknown; error?: unknown } | undefined) : undefined;
    if (!first || first.error) throw new Error(`Upstash INCR failed: ${String(first?.error ?? "no result")}`);
    return toCount(first.result);
  }

  const now = Date.now();
  if (memory.size > MEMORY_SWEEP_AT) {
    memory.forEach((entry, k) => {
      if (entry.expiresAt <= now) memory.delete(k);
    });
  }
  const entry = liveMemoryEntry(key, now);
  if (!entry) {
    memory.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

/** Remove `key`, so a counter starts again (an idempotency mark whose delivery failed). */
export async function deleteKey(key: string): Promise<void> {
  const config = upstashConfig();
  if (config) {
    const json = (await upstash(config, "", ["DEL", key])) as { error?: unknown } | null;
    if (!json || json.error) throw new Error(`Upstash DEL failed: ${String(json?.error ?? "no result")}`);
    return;
  }
  memory.delete(key);
}
