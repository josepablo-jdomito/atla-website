import { createHash } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { brandReadHits } from "../shared/schema.ts";

/**
 * Rate limiting for the live brand read.
 *
 * Each uncached read spends money on two upstream APIs, so the limit is a cost
 * control, not a nicety. Serverless gives every instance its own memory, so an
 * in-memory counter only limits a caller to N per instance. When a database is
 * configured the ledger is shared and the limit is real; without one it falls
 * back to in-memory, which is better than nothing and is what local development
 * uses.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : null;
const db = pool ? drizzle(pool) : null;

/** In-memory fallback, used only when no database is configured. */
const local = new Map<string, number[]>();

/**
 * The caller is counted by a salted hash, so the ledger can rate limit without
 * holding anyone's address. The salt falls back to a constant when unset: the
 * hash is then still not reversible to an address without guessing the input
 * space, and the alternative is storing the address itself.
 */
function hashCaller(ip: string) {
  const salt = process.env.BRAND_READ_SALT || "why-we-love";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function withinLocalLimit(callerHash: string) {
  const now = Date.now();
  const recent = (local.get(callerHash) ?? []).filter((at) => now - at < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    local.set(callerHash, recent);
    return false;
  }
  recent.push(now);
  local.set(callerHash, recent);
  return true;
}

/**
 * Records one attempt and says whether it is allowed. A database that is
 * configured but unreachable falls through to the in-memory counter rather
 * than taking the endpoint down with it.
 */
export async function withinRateLimit(ip: string): Promise<boolean> {
  const callerHash = hashCaller(ip);
  if (!db) return withinLocalLimit(callerHash);

  const since = new Date(Date.now() - WINDOW_MS);

  try {
    const [row] = await db
      .select({ used: sql<number>`count(*)::int` })
      .from(brandReadHits)
      .where(and(eq(brandReadHits.callerHash, callerHash), gte(brandReadHits.createdAt, since)));

    if ((row?.used ?? 0) >= MAX_PER_WINDOW) return false;

    await db.insert(brandReadHits).values({ callerHash });
    // Keep the table from growing without bound. Cheap, and off the hot path
    // for everyone whose first read of the hour this is.
    await db.delete(brandReadHits).where(lt(brandReadHits.createdAt, since));
    return true;
  } catch (error) {
    console.error("Brand read rate limit fell back to memory:", error);
    return withinLocalLimit(callerHash);
  }
}

/** True when both upstream keys are present, so the page can stop before promising a read. */
export function brandReadConfigured() {
  return Boolean(process.env.FIRECRAWL_API_KEY && process.env.ANTHROPIC_API_KEY);
}
