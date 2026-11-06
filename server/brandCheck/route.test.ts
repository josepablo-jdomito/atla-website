import express from "express";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { brandCheckTitle, formatBrandCheckSummary } from "./deliver.ts";
import { registerBrandCheckRoutes, type BrandCheckDeps } from "./route.ts";

const REQUEST = {
  name: "Ana Ruiz",
  email: "ana@casamar.example",
  site: "casamar.example",
  moment: "raise",
  size: "small_team",
  investing: "maybe",
  message: "Our deck reads like three companies.",
};
const CALENDLY = "https://calendly.com/atla/intro?name=Ana%20Ruiz&email=ana%40casamar.example";
const id = (n: number) => `bbbbbbbb-cccc-4ddd-8eee-${String(n).padStart(12, "0")}`;

let server: Server | undefined;

afterEach(async () => {
  await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
  server = undefined;
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

function counterStore() {
  const counts = new Map<string, number>();
  return {
    incr: vi.fn(async (key: string) => {
      const next = (counts.get(key) ?? 0) + 1;
      counts.set(key, next);
      return next;
    }),
    del: vi.fn(async (key: string) => void counts.delete(key)),
  };
}

async function start(overrides: Partial<BrandCheckDeps> = {}, realDelivery = false) {
  const store = counterStore();
  const deps: BrandCheckDeps = {
    rateLimit: vi.fn(async () => true),
    incrWithExpiry: store.incr,
    deleteKey: store.del,
    deliverToAttio: vi.fn(async () => {}),
    sendEmail: vi.fn(async () => {}),
    calendlyUrl: vi.fn(() => CALENDLY),
    ...overrides,
  };
  const app = express();
  app.use(express.json());
  if (realDelivery) {
    // The real Attio and Resend steps, with only the counters stubbed.
    const { deliverBrandCheckToAttio, sendBrandCheckEmail } = await import("./deliver.ts");
    registerBrandCheckRoutes(app, { ...deps, deliverToAttio: deliverBrandCheckToAttio, sendEmail: sendBrandCheckEmail });
  } else registerBrandCheckRoutes(app, deps);
  server = app.listen(0);
  await new Promise<void>((resolve) => server!.once("listening", () => resolve()));
  const { port } = server.address() as AddressInfo;
  const post = async (body: unknown, headers: Record<string, string> = {}) => {
    const res = await fetch(`http://127.0.0.1:${port}/api/brand-check`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: `http://127.0.0.1:${port}`, ...headers },
      body: JSON.stringify(body),
    });
    return { status: res.status, json: (await res.json()) as Record<string, any> };
  };
  return { deps, port, post };
}

describe("POST /api/brand-check", () => {
  it("refuses a cross-site post and one that names no site with 403, and lets a same-site post through", async () => {
    const { post, deps, port } = await start();
    const body = { request: REQUEST, submissionId: id(1) };
    expect((await post(body, { origin: "https://evil.example" })).status).toBe(403);
    expect((await post(body, { origin: "", referer: "https://evil.example/page" })).status).toBe(403);
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
    expect((await post(body, { origin: `http://127.0.0.1:${port}` })).status).toBe(200);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(1);
  });

  it("delivers to Attio and the email and answers ok with the Calendly link", async () => {
    const { post, deps } = await start();
    const res = await post({ request: REQUEST, submissionId: id(2) });
    expect(res).toEqual({ status: 200, json: { ok: true, calendlyUrl: CALENDLY } });
    expect(deps.deliverToAttio).toHaveBeenCalledWith(expect.objectContaining({ name: "Ana Ruiz", site: "casamar.example", moment: "raise" }));
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
    expect(deps.rateLimit).toHaveBeenCalledWith(expect.any(String), "brandCheck");
  });

  it("a filled honeypot answers ok and delivers nothing, even when the rest is junk", async () => {
    const { post, deps } = await start();
    const res = await post({ request: { name: "" }, submissionId: "x", _gotcha: "http://spam.example" });
    expect(res.status).toBe(200);
    expect(res.json.ok).toBe(true);
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(deps.rateLimit).toHaveBeenCalledTimes(1);
  });

  it("refuses an invalid request with 400 and delivers nothing", async () => {
    const { post, deps } = await start();
    const bad = [
      { ...REQUEST, name: " " },
      { ...REQUEST, email: "not-an-email" },
      { ...REQUEST, site: "" },
      { ...REQUEST, site: "my brand" },
      { ...REQUEST, moment: "someday" },
      { ...REQUEST, size: "huge" },
      { ...REQUEST, investing: "" },
      { ...REQUEST, message: "x".repeat(2001) },
    ];
    for (const [i, request] of bad.entries()) {
      expect((await post({ request, submissionId: id(10 + i) })).status, JSON.stringify(request).slice(0, 80)).toBe(400);
    }
    expect((await post({ request: REQUEST, submissionId: "short" })).status).toBe(400);
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
  });

  it("delivers the same submissionId once, and a new one again", async () => {
    const { post, deps } = await start();
    expect((await post({ request: REQUEST, submissionId: id(3) })).status).toBe(200);
    expect((await post({ request: REQUEST, submissionId: id(3) })).json.ok).toBe(true);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(1);
    await post({ request: REQUEST, submissionId: id(4) });
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(2);
  });

  it("answers 429 past the address limit and past three requests per email a day", async () => {
    const limited = await start({ rateLimit: vi.fn(async () => false) });
    expect((await limited.post({ request: REQUEST, submissionId: id(5) })).status).toBe(429);
    expect(limited.deps.deliverToAttio).not.toHaveBeenCalled();
    await new Promise<void>((resolve) => server!.close(() => resolve()));
    server = undefined;

    const { post, deps } = await start();
    for (let i = 0; i < 3; i += 1) expect((await post({ request: REQUEST, submissionId: id(20 + i) })).status).toBe(200);
    expect((await post({ request: REQUEST, submissionId: id(23) })).status).toBe(429);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(3);
  });

  it("when both steps fail: 502 with a ref, the id stays unspent, and the log names only the ref, the steps and the domain", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const attio = vi.fn(async () => {
      throw new Error("Attio note failed (500) for record rec_1");
    });
    const email = vi.fn(async () => {
      throw new Error("Resend answered 500");
    });
    const { post, deps } = await start({ deliverToAttio: attio, sendEmail: email });
    const res = await post({ request: REQUEST, submissionId: id(6) });
    expect(res.status).toBe(502);
    expect(res.json.ref).toMatch(/^[0-9a-f-]{36}$/);
    expect(deps.deleteKey).toHaveBeenCalledWith(`brandcheck:${id(6)}`);
    const logged = errors.mock.calls.map((args) => args.join(" ")).join("\n");
    expect(logged).toContain(`ref=${res.json.ref}`);
    expect(logged).toContain("domain=casamar.example");
    for (const secret of ["Ana", "Ruiz", "ana@", "casamar.example/", "three companies", "small_team", "maybe"]) {
      expect(logged).not.toContain(secret);
    }

    // The resend with the same id delivers once the steps are back.
    attio.mockImplementation(async () => {});
    email.mockImplementation(async () => {});
    expect((await post({ request: REQUEST, submissionId: id(6) })).status).toBe(200);
    expect(attio).toHaveBeenCalledTimes(2);
  });

  it("when one step fails the visitor still gets ok, and the log still holds no content", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { post } = await start({
      sendEmail: vi.fn(async () => {
        throw new Error("Resend answered 422");
      }),
    });
    expect((await post({ request: REQUEST, submissionId: id(7) })).json.ok).toBe(true);
    const logged = errors.mock.calls.map((args) => args.join(" ")).join("\n");
    expect(logged).toMatch(/partly delivered/);
    expect(logged).not.toContain("Ruiz");
    expect(logged).not.toContain("three companies");
  });

  it("with the real delivery steps and no keys configured, answers 502 and names only missing config", async () => {
    for (const key of ["ATTIO_API_KEY", "RESEND_API_KEY", "BRIEF_FROM_EMAIL"]) vi.stubEnv(key, "");
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { post } = await start({}, true);
    const res = await post({ request: REQUEST, submissionId: id(8) });
    expect(res.status).toBe(502);
    const logged = errors.mock.calls.map((args) => args.join(" ")).join("\n");
    expect(logged).toContain("ATTIO_API_KEY is not set");
    expect(logged).toContain("RESEND_API_KEY is not set");
    expect(logged).not.toContain("Ruiz");
    // Only the test's own request went out: nothing reached Attio or Resend.
    expect(fetchSpy.mock.calls.every(([url]) => String(url).startsWith("http://127.0.0.1"))).toBe(true);
  });
});

describe("brand check delivery format", () => {
  const request = { ...REQUEST, moment: "raise", size: "small_team", investing: "maybe" } as const;

  it("titles the Attio note and the email with the brand, from a website or an Instagram", () => {
    expect(brandCheckTitle(request)).toBe("Brand check: casamar.example");
    expect(brandCheckTitle({ ...request, site: "https://www.CasaMar.example/about" })).toBe("Brand check: casamar.example");
    expect(brandCheckTitle({ ...request, site: "@casamar" })).toBe("Brand check: @casamar");
    expect(brandCheckTitle({ ...request, site: "instagram.com/casamar/" })).toBe("Brand check: @casamar");
  });

  it("reads every field as the visitor saw it, values in brackets, the message as written", () => {
    const text = formatBrandCheckSummary(request);
    expect(text).toContain("Name: Ana Ruiz");
    expect(text).toContain("Email: ana@casamar.example");
    expect(text).toContain("Website or Instagram: casamar.example");
    expect(text).toContain("Moment: Raise capital [raise]");
    expect(text).toContain("Company size: A small team [small_team]");
    expect(text).toContain("Investing in brand this year: Maybe [maybe]");
    expect(text).toContain("Message\nOur deck reads like three companies.");
    expect(formatBrandCheckSummary({ ...request, message: "" })).not.toContain("Message");
  });

  it("keeps a name with line breaks on one line, so it cannot fake a field", () => {
    const text = formatBrandCheckSummary({ ...request, name: "Ana\nEmail: someone@else.example" });
    expect(text).toContain("Name: Ana Email: someone@else.example");
    expect(text.split("\n").filter((line) => line.startsWith("Email:"))).toHaveLength(1);
  });
});
