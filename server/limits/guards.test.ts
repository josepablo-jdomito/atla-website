import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fresh = async () => {
  vi.resetModules();
  return import("./guards.ts");
};

describe("limits", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  const nodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.AI_MONTHLY_CALL_CAP;
    delete process.env.AI_DAILY_IP_CAP;
    delete process.env.RATE_LIMIT_SALT;
    process.env.NODE_ENV = "test";
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = nodeEnv;
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
    const { reserveAiCall } = await fresh();
    for (let i = 0; i < 5; i++) expect(await reserveAiCall()).toBe(true);
    const alerts = () => errorSpy.mock.calls.filter((c) => String(c[0]).includes("80%"));
    expect(alerts()).toHaveLength(1);
    expect(await reserveAiCall()).toBe(false);
    expect(await reserveAiCall()).toBe(false);
    expect(alerts()).toHaveLength(1);
  });

  it("defaults the caps to 3000 a month and 40 per address a day", async () => {
    const { aiMonthlyCallCap, aiDailyIpCap } = await fresh();
    expect(aiMonthlyCallCap()).toBe(3000);
    expect(aiDailyIpCap()).toBe(40);
    process.env.AI_MONTHLY_CALL_CAP = "nonsense";
    process.env.AI_DAILY_IP_CAP = "-3";
    expect(aiMonthlyCallCap()).toBe(3000);
    expect(aiDailyIpCap()).toBe(40);
  });

  it("caps AI calls per address per day; an IPv6 /64 counts as one address", async () => {
    process.env.AI_DAILY_IP_CAP = "3";
    const { aiAllowedForIp } = await fresh();
    for (let i = 0; i < 3; i++) expect(await aiAllowedForIp("6.6.6.6")).toBe(true);
    expect(await aiAllowedForIp("6.6.6.6")).toBe(false);
    expect(await aiAllowedForIp("7.7.7.7")).toBe(true);

    // Rotating the interface id inside one /64 does not reset the count.
    expect(await aiAllowedForIp("2001:db8:1:2::a")).toBe(true);
    expect(await aiAllowedForIp("2001:0db8:0001:0002:ffff:eeee:dddd:cccc")).toBe(true);
    expect(await aiAllowedForIp("[2001:db8:1:2:0:0:0:b]")).toBe(true);
    expect(await aiAllowedForIp("2001:db8:1:2:1234::")).toBe(false);
    expect(await aiAllowedForIp("2001:db8:1:3::a")).toBe(true);
  });

  it("keys addresses by a salted sha256, never the address", async () => {
    const { hashIp, ipBucket } = await fresh();
    expect(ipBucket("2001:db8:1:2::a")).toBe("2001:db8:1:2::/64");
    expect(ipBucket("2001:0db8:0001:0002:ffff:eeee:dddd:cccc")).toBe("2001:db8:1:2::/64");
    expect(ipBucket("::1")).toBe("0:0:0:0::/64");
    expect(ipBucket("::ffff:10.0.0.1")).toBe("10.0.0.1");
    expect(ipBucket("10.0.0.1")).toBe("10.0.0.1");

    const fallback = hashIp("10.0.0.1");
    expect(fallback).toMatch(/^[0-9a-f]{32}$/);
    expect(fallback).not.toContain("10.0.0.1");
    expect(hashIp("10.0.0.2")).not.toBe(fallback);
    process.env.RATE_LIMIT_SALT = "server-secret";
    expect(hashIp("10.0.0.1")).not.toBe(fallback);
    expect(hashIp("10.0.0.1")).toBe(hashIp("10.0.0.1"));
  });

  it("stores only hashed addresses in Upstash", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([{ result: 1 }, { result: 1 }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { rateLimit, aiAllowedForIp } = await fresh();
    await rateLimit("203.0.113.9", "ask");
    await aiAllowedForIp("203.0.113.9");
    const bodies = fetchMock.mock.calls.map((call) => String((call as unknown as [string, RequestInit])[1].body));
    expect(bodies).toHaveLength(2);
    for (const body of bodies) {
      expect(body).not.toContain("203.0.113");
      expect(body).toMatch(/"(rl:ask|aid:\d{4}-\d{2}-\d{2}):[0-9a-f]{32}"/);
    }
  });

  it("production without Upstash: AI off (fail closed), one clear error, rate limits still in memory", async () => {
    process.env.NODE_ENV = "production";
    const { aiAllowedForIp, reserveAiCall, rateLimit } = await fresh();
    expect(await aiAllowedForIp("8.8.8.8")).toBe(false);
    expect(await reserveAiCall()).toBe(false);
    expect(await aiAllowedForIp("8.8.8.8")).toBe(false);
    expect(await rateLimit("8.8.8.8", "ask")).toBe(true);
    const lines = errorSpy.mock.calls.map((c) => String(c[0])).filter((line) => line.includes("[limits]"));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/UPSTASH_REDIS_REST_URL.*production.*AI is OFF/);
  });

  it("development without Upstash keeps the in-memory fallback with AI on", async () => {
    process.env.NODE_ENV = "development";
    const { aiAllowedForIp, reserveAiCall } = await fresh();
    expect(await aiAllowedForIp("8.8.8.8")).toBe(true);
    expect(await reserveAiCall()).toBe(true);
  });

  it("production with Upstash: the monthly check-and-count is one INCR with expiry", async () => {
    process.env.NODE_ENV = "production";
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    process.env.AI_MONTHLY_CALL_CAP = "10";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([{ result: 11 }, { result: 0 }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { reserveAiCall } = await fresh();
    expect(await reserveAiCall()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(body[0][0]).toBe("INCR");
    expect(body[0][1]).toMatch(/^ai:\d{4}-\d{2}$/);
    expect(body[1][0]).toBe("EXPIRE");
    fetchMock.mockImplementation(async () => new Response(JSON.stringify([{ result: 10 }, { result: 0 }]), { status: 200 }));
    expect(await reserveAiCall()).toBe(true);
  });

  it("deleteKey removes a counter in memory and in Upstash", async () => {
    vi.resetModules();
    const memoryStore = await import("./store.ts");
    expect(await memoryStore.incrWithExpiry("brief:x", 60)).toBe(1);
    await memoryStore.deleteKey("brief:x");
    expect(await memoryStore.incrWithExpiry("brief:x", 60)).toBe(1);

    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: 1 }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    const { deleteKey } = await import("./store.ts");
    await deleteKey("brief:y");
    expect(JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body))).toEqual(["DEL", "brief:y"]);
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
    const { rateLimit, reserveAiCall, aiAllowedForIp } = await fresh();
    expect(await rateLimit("5.5.5.5", "ask")).toBe(true);
    expect(await reserveAiCall()).toBe(false);
    expect(await aiAllowedForIp("5.5.5.5")).toBe(false);
  });
});
