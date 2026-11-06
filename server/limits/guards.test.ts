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
    delete process.env.RATE_LIMIT_SALT;
    process.env.NODE_ENV = "test";
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = nodeEnv;
    errorSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it("production is NODE_ENV, or a Vercel production or preview deploy", async () => {
    vi.resetModules();
    const { isProduction } = await import("./store.ts");
    const vercelEnv = process.env.VERCEL_ENV;
    try {
      delete process.env.VERCEL_ENV;
      expect(isProduction()).toBe(false);
      process.env.VERCEL_ENV = "preview";
      expect(isProduction()).toBe(true);
      process.env.VERCEL_ENV = "production";
      expect(isProduction()).toBe(true);
      process.env.VERCEL_ENV = "development";
      expect(isProduction()).toBe(false);
    } finally {
      if (vercelEnv === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = vercelEnv;
    }
  });

  it("rate limit allows 20 brief calls per window", async () => {
    const { rateLimit } = await fresh();
    for (let i = 0; i < 20; i++) expect(await rateLimit("3.3.3.3", "brief")).toBe(true);
    expect(await rateLimit("3.3.3.3", "brief")).toBe(false);
  });

  it("memory fallback logs the missing Upstash config once per process", async () => {
    const { rateLimit } = await fresh();
    await rateLimit("4.4.4.4", "brief");
    await rateLimit("4.4.4.4", "brief");
    const calls = errorSpy.mock.calls.filter((c) => String(c[0]).includes("[limits] Upstash not configured"));
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe("[limits] Upstash not configured, using per-instance memory");
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
    const { rateLimit } = await fresh();
    await rateLimit("203.0.113.9", "brief");
    await rateLimit("203.0.113.9", "submit");
    const bodies = fetchMock.mock.calls.map((call) => String((call as unknown as [string, RequestInit])[1].body));
    expect(bodies).toHaveLength(2);
    for (const body of bodies) {
      expect(body).not.toContain("203.0.113");
      expect(body).toMatch(/"rl:(brief|submit):[0-9a-f]{32}"/);
    }
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
    expect(await incrWithExpiry("rl:brief:x", 600)).toBe(7);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://example.upstash.io/pipeline");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer token");
    expect(JSON.parse(String(init.body))).toEqual([["INCR", "rl:brief:x"], ["EXPIRE", "rl:brief:x", "600", "NX"]]);
  });

  it("fails open on rate limit when Upstash errors", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    const { rateLimit } = await fresh();
    expect(await rateLimit("5.5.5.5", "brief")).toBe(true);
  });
});
