import express from "express";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AUDITS_PER_WEEK, isoWeek } from "../../shared/audit.ts";
import { auditTitle, formatAuditSummary } from "./deliver.ts";
import { registerAuditRoutes, type AuditDeps, weekKey } from "./route.ts";

const REQUEST = {
  name: "Ana Ruiz",
  email: "ana@casamar.example",
  site: "casamar.example",
};
const NOW = new Date("2026-11-07T18:00:00Z");
const id = (n: number) => `bbbbbbbb-cccc-4ddd-8eee-${String(n).padStart(12, "0")}`;

let server: Server | undefined;

afterEach(async () => {
  await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
  server = undefined;
  vi.restoreAllMocks();
});

function counterStore() {
  const counts = new Map<string, number>();
  return {
    counts,
    incr: vi.fn(async (key: string) => {
      const next = (counts.get(key) ?? 0) + 1;
      counts.set(key, next);
      return next;
    }),
    del: vi.fn(async (key: string) => void counts.delete(key)),
    get: vi.fn(async (key: string) => counts.get(key) ?? 0),
    decr: vi.fn(async (key: string) => void counts.set(key, Math.max(0, (counts.get(key) ?? 0) - 1))),
  };
}

async function start(overrides: Partial<AuditDeps> = {}) {
  const store = counterStore();
  const deps: AuditDeps = {
    rateLimit: vi.fn(async () => true),
    incrWithExpiry: store.incr,
    deleteKey: store.del,
    getCount: store.get,
    decrement: store.decr,
    deliverToAttio: vi.fn(async () => {}),
    sendEmail: vi.fn(async () => {}),
    now: () => NOW,
    ...overrides,
  };
  const app = express();
  app.use(express.json());
  registerAuditRoutes(app, deps);
  server = app.listen(0);
  await new Promise<void>((resolve) => server!.once("listening", () => resolve()));
  const { port } = server.address() as AddressInfo;
  const post = async (body: unknown, headers: Record<string, string> = {}) => {
    const res = await fetch(`http://127.0.0.1:${port}/api/audit`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: `http://127.0.0.1:${port}`, ...headers },
      body: JSON.stringify(body),
    });
    return { status: res.status, json: (await res.json()) as Record<string, any> };
  };
  const status = async () => {
    const res = await fetch(`http://127.0.0.1:${port}/api/audit/status`);
    return { status: res.status, cache: res.headers.get("cache-control"), json: (await res.json()) as Record<string, any> };
  };
  return { deps, store, port, post, status };
}

describe("isoWeek", () => {
  it("names the ISO week in UTC, Monday to Sunday", () => {
    expect(isoWeek(new Date("2026-11-07T18:00:00Z"))).toBe("2026-W45");
    expect(isoWeek(new Date("2026-11-08T23:59:59Z"))).toBe("2026-W45");
    expect(isoWeek(new Date("2026-11-09T00:00:00Z"))).toBe("2026-W46");
    expect(isoWeek(new Date("2027-01-01T12:00:00Z"))).toBe("2026-W53");
  });
});

describe("POST /api/audit", () => {
  it("refuses a cross-site post with 403 and lets a same-site post through", async () => {
    const { post, deps } = await start();
    const body = { request: REQUEST, submissionId: id(1) };
    expect((await post(body, { origin: "https://evil.example" })).status).toBe(403);
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
    const ok = await post(body);
    expect(ok.status).toBe(200);
    expect(ok.json).toEqual({ ok: true, week: "open" });
    expect(deps.deliverToAttio).toHaveBeenCalledWith(expect.objectContaining({ email: REQUEST.email }), {
      week: "2026-W45",
      count: 1,
      full: false,
    });
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("answers a filled honeypot with ok and delivers nothing", async () => {
    const { post, deps, store } = await start();
    const res = await post({ request: REQUEST, submissionId: id(1), _gotcha: "http://spam" });
    expect(res.json).toEqual({ ok: true, week: "open" });
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
    expect(store.counts.get(weekKey(NOW))).toBeUndefined();
  });

  it("rejects a request that fails the schema with 400", async () => {
    const { post, deps } = await start();
    expect((await post({ request: { ...REQUEST, site: "not a site" }, submissionId: id(1) })).status).toBe(400);
    expect((await post({ request: REQUEST, submissionId: "short" })).status).toBe(400);
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
  });

  it("takes one slot per request and turns full past the cap, still delivering", async () => {
    const { post, deps, status, store } = await start();
    for (let n = 1; n <= AUDITS_PER_WEEK; n += 1) {
      const res = await post({ request: { ...REQUEST, email: `ana${n}@casamar.example` }, submissionId: id(n) });
      expect(res.json).toEqual({ ok: true, week: "open" });
      expect((await status()).json).toEqual({ week: n < AUDITS_PER_WEEK ? "open" : "full", taken: n, cap: AUDITS_PER_WEEK });
    }
    const sixth = await post({ request: { ...REQUEST, email: "late@casamar.example" }, submissionId: id(99) });
    expect(sixth.json).toEqual({ ok: true, week: "full" });
    // Past the cap the widget still shows five of five, never six.
    expect((await status()).json).toEqual({ week: "full", taken: AUDITS_PER_WEEK, cap: AUDITS_PER_WEEK });
    expect(deps.deliverToAttio).toHaveBeenLastCalledWith(expect.anything(), { week: "2026-W45", count: AUDITS_PER_WEEK + 1, full: true });
    expect(store.counts.get(weekKey(NOW))).toBe(AUDITS_PER_WEEK + 1);
  });

  it("delivers a submissionId once and answers the resend with the week as it stands", async () => {
    const { post, deps, store } = await start();
    const body = { request: REQUEST, submissionId: id(1) };
    await post(body);
    const again = await post(body);
    expect(again.json).toEqual({ ok: true, week: "open" });
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(1);
    expect(store.counts.get(weekKey(NOW))).toBe(1);
  });

  it("caps one email at three a day and gives the submission back", async () => {
    const { post, deps } = await start();
    for (let n = 1; n <= 3; n += 1) expect((await post({ request: REQUEST, submissionId: id(n) })).status).toBe(200);
    const fourth = await post({ request: REQUEST, submissionId: id(4) });
    expect(fourth.status).toBe(429);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(3);
    expect(deps.deleteKey).toHaveBeenCalledWith(`audit:${id(4)}`);
  });

  it("keeps ok when one step fails and answers 502 with the slot given back when both fail", async () => {
    const attioDown = vi.fn(async () => {
      throw new Error("Attio person lookup failed (500)");
    });
    const first = await start({ deliverToAttio: attioDown });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await first.post({ request: REQUEST, submissionId: id(1) })).json).toEqual({ ok: true, week: "open" });
    expect(error.mock.calls.flat().join(" ")).toContain("partly delivered");
    expect(error.mock.calls.flat().join(" ")).not.toContain("Ana");
    await new Promise<void>((resolve) => server!.close(() => resolve()));
    server = undefined;

    const emailDown = vi.fn(async () => {
      throw new Error("Resend answered 500");
    });
    const second = await start({ deliverToAttio: attioDown, sendEmail: emailDown });
    const res = await second.post({ request: REQUEST, submissionId: id(2) });
    expect(res.status).toBe(502);
    expect(res.json.error).toMatch(/send it again/);
    expect(second.store.counts.get(weekKey(NOW))).toBe(0);
    expect(second.store.counts.has(`audit:${id(2)}`)).toBe(false);
    expect((await second.status()).json).toEqual({ week: "open", taken: 0, cap: AUDITS_PER_WEEK });
  });

  it("answers 429 when the address is over its limit", async () => {
    const { post, deps } = await start({ rateLimit: vi.fn(async () => false) });
    expect((await post({ request: REQUEST, submissionId: id(1) })).status).toBe(429);
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
  });
});

describe("GET /api/audit/status", () => {
  it("is never cached and reads as open when the counter store fails", async () => {
    const { status } = await start({
      getCount: vi.fn(async () => {
        throw new Error("Upstash GET failed");
      }),
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await status();
    expect(res.cache).toBe("no-store");
    expect(res.json).toEqual({ week: "open", taken: 0, cap: AUDITS_PER_WEEK });
  });
});

describe("the note and the email", () => {
  it("name the brand in the title and say the week's slot in words JP can act on", () => {
    expect(auditTitle(REQUEST as any)).toBe("Free audit: casamar.example");
    expect(auditTitle({ ...REQUEST, site: "@casamar" } as any)).toBe("Free audit: @casamar");
    const open = formatAuditSummary(REQUEST as any, { week: "2026-W45", count: 2, full: false });
    expect(open).toContain("Website or Instagram: casamar.example");
    expect(open).toContain("Week 2026-W45: request 2 of 5, in this week's five");
    const full = formatAuditSummary(REQUEST as any, { week: "2026-W45", count: 6, full: true });
    expect(full).toContain("this week is full, queued for next week");
  });
});
