import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fresh = async () => {
  vi.resetModules();
  return import("./guards.ts");
};

describe("limits", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.AI_MONTHLY_CALL_CAP;
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it("rate limit allows 30 ask calls per window, then refuses", async () => {
    const { rateLimit } = await fresh();
    for (let i = 0; i < 30; i++) expect(await rateLimit("1.1.1.1", "ask")).toBe(true);
    expect(await rateLimit("1.1.1.1", "ask")).toBe(false);
    // Other addresses and other buckets keep their own counters.
    expect(await rateLimit("2.2.2.2", "ask")).toBe(true);
    expect(await rateLimit("1.1.1.1", "brief")).toBe(true);
  });

  it("rate limit allows 20 brief calls per window", async () => {
    const { rateLimit } = await fresh();
    for (let i = 0; i < 20; i++) expect(await rateLimit("3.3.3.3", "brief")).toBe(true);
    expect(await rateLimit("3.3.3.3", "brief")).toBe(false);
  });

  it("memory fallback logs the missing Upstash config once per process", async () => {
    const { rateLimit } = await fresh();
    await rateLimit("4.4.4.4", "ask");
    await rateLimit("4.4.4.4", "ask");
    const calls = errorSpy.mock.calls.filter((c) => String(c[0]).includes("[limits] Upstash not configured"));
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe("[limits] Upstash not configured, using per-instance memory");
  });

  it("budget closes at the monthly cap and alerts once at 80%", async () => {
    process.env.AI_MONTHLY_CALL_CAP = "5";
    const { aiBudgetAvailable, recordAiCall } = await fresh();
    for (let i = 0; i < 4; i++) {
      expect(await aiBudgetAvailable()).toBe(true);
      await recordAiCall();
    }
    const alerts = () => errorSpy.mock.calls.filter((c) => String(c[0]).includes("80%"));
    expect(alerts()).toHaveLength(1);
    expect(await aiBudgetAvailable()).toBe(true);
    await recordAiCall();
    expect(await aiBudgetAvailable()).toBe(false);
    await recordAiCall();
    expect(alerts()).toHaveLength(1);
  });

  it("defaults the cap to 3000", async () => {
    const { aiMonthlyCallCap } = await fresh();
    expect(aiMonthlyCallCap()).toBe(3000);
    process.env.AI_MONTHLY_CALL_CAP = "nonsense";
    expect(aiMonthlyCallCap()).toBe(3000);
  });

  it("uses the Upstash REST pipeline when configured", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([{ result: 7 }, { result: 0 }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    const { incrWithExpiry } = await import("./store.ts");
    expect(await incrWithExpiry("rl:ask:x", 600)).toBe(7);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://example.upstash.io/pipeline");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer token");
    expect(JSON.parse(String(init.body))).toEqual([["INCR", "rl:ask:x"], ["EXPIRE", "rl:ask:x", "600", "NX"]]);
  });

  it("fails open on rate limit and closed on budget when Upstash errors", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    const { rateLimit, aiBudgetAvailable } = await fresh();
    expect(await rateLimit("5.5.5.5", "ask")).toBe(true);
    expect(await aiBudgetAvailable()).toBe(false);
  });
});
