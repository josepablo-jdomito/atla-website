import express from "express";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type BriefState } from "../../shared/brief.ts";
import { briefCalendlyUrl, formatBriefSummary, sendBriefEmail } from "./deliver.ts";
import { registerBriefRoutes, type BriefDeps } from "./route.ts";

const CONTACT = { name: "Ana Ruiz", email: "ana@example.com", company: "Casa Mar", website: "", phone: "" };
const CALENDLY = "https://calendly.com/atla/intro?name=Ana%20Ruiz&email=ana%40example.com";

let server: Server | undefined;

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

async function start(overrides: Partial<BriefDeps> = {}) {
  const store = counterStore();
  const deps: BriefDeps = {
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
  registerBriefRoutes(app, deps);
  server = app.listen(0);
  await new Promise<void>((resolve) => server!.once("listening", () => resolve()));
  const { port } = server.address() as AddressInfo;
  const post = async (path: string, body: unknown, headers: Record<string, string> = {}) => {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
    return { status: res.status, json: (await res.json()) as Record<string, any> };
  };
  return {
    deps,
    port,
    next: (body: unknown, headers?: Record<string, string>) => post("/api/brief/next", body, headers),
    submit: (body: unknown, headers?: Record<string, string>) => post("/api/brief/submit", body, headers),
  };
}

const answeredState = (): BriefState => ({
  seed: "Like Casa Mar",
  answers: { q1: "lost_deals", q2: "launched", q3: "sort_of", q4: "35_75k", q5: "1_3_months" },
  contact: CONTACT,
});

describe("POST /api/brief/submit cross-site", () => {
  afterEach(async () => {
    await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
    server = undefined;
  });

  it("refuses a cross-site post with 403 and lets same-site and header-less posts through", async () => {
    const { submit, deps, port } = await start();
    const body = { state: answeredState(), submissionId: "cccccccc-bbbb-4ccc-8ddd-000000000001" };
    expect((await submit(body, { origin: "https://evil.example" })).status).toBe(403);
    expect((await submit(body, { referer: "https://evil.example/page" })).status).toBe(403);
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
    expect((await submit(body, { origin: `http://127.0.0.1:${port}` })).status).toBe(200);
    expect((await submit({ ...body, submissionId: "cccccccc-bbbb-4ccc-8ddd-000000000002" })).status).toBe(200);
  });
});

describe("POST /api/brief/submit", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(async () => {
    errorSpy.mockRestore();
    await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
    server = undefined;
  });

  it("delivers to Attio and email and returns the Calendly URL", async () => {
    const { submit, deps } = await start();
    const { status, json } = await submit({ state: answeredState(), submissionId: "9b2d4c1e-0f6a-4b8e-9f00-1a2b3c4d5e6f" });
    expect(status).toBe(200);
    expect(json).toEqual({ ok: true, calendlyUrl: CALENDLY });
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(1);
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
    expect(deps.incrWithExpiry).toHaveBeenCalledWith("brief:9b2d4c1e-0f6a-4b8e-9f00-1a2b3c4d5e6f", 86400);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("when every delivery fails: 502 asking to resend, a log with ref and domain only, and the id stays unspent", async () => {
    const deliverToAttio = vi.fn(async () => Promise.reject(new Error("Attio 503")));
    const sendEmail = vi.fn(async () => Promise.reject(new Error("Resend 500")));
    const { submit, deps } = await start({ deliverToAttio, sendEmail });
    const body = { state: answeredState(), submissionId: "11111111-2222-4333-8444-555555555555" };
    const { status, json } = await submit(body);
    expect(status).toBe(502);
    expect(json.error).toMatch(/send it again/i);
    expect(json.ref).toMatch(/^[0-9a-f-]{36}$/);
    expect(json.calendlyUrl).toBeUndefined();

    const logged = errorSpy.mock.calls.map((call) => call.map(String).join(" ")).join("\n");
    expect(logged).toContain(`ref=${json.ref}`);
    expect(logged).toContain("domain=example.com");
    expect(logged).toMatch(/Attio 503/);
    expect(logged).toMatch(/Resend 500/);
    for (const privateText of ["Ana", "Ruiz", "ana@", "Casa Mar", "Tulum", "Hospitality", "Identity"]) {
      expect(logged, privateText).not.toContain(privateText);
    }
    expect(deps.deleteKey).toHaveBeenCalledWith("brief:11111111-2222-4333-8444-555555555555");

    // The resend with the same id delivers.
    deliverToAttio.mockImplementation(async () => {});
    sendEmail.mockImplementation(async () => {});
    const retry = await submit(body);
    expect(retry).toEqual({ status: 200, json: { ok: true, calendlyUrl: CALENDLY } });
    expect(deliverToAttio).toHaveBeenCalledTimes(2);
  });

  it("when one delivery fails the lead exists elsewhere: ok, id spent, log with ref and domain only", async () => {
    const { submit, deps } = await start({
      sendEmail: vi.fn(async () => Promise.reject(new Error("RESEND_API_KEY is not set"))),
    });
    const body = { state: answeredState(), submissionId: "11111111-2222-4333-8444-666666666666" };
    const { status, json } = await submit(body);
    expect(status).toBe(200);
    expect(json).toEqual({ ok: true, calendlyUrl: CALENDLY });
    const logged = errorSpy.mock.calls.map((call) => call.map(String).join(" ")).join("\n");
    expect(logged).toMatch(/ref=[0-9a-f-]{36} domain=example\.com partly delivered \(email: RESEND_API_KEY is not set\)/);
    expect(logged).not.toContain(formatBriefSummary(answeredState()));
    expect(logged).not.toMatch(/Ana|Casa Mar|Tulum/);
    expect(deps.deleteKey).not.toHaveBeenCalled();
    expect((await submit(body)).status).toBe(200);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(1);
  });

  it("honeypot answers ok and delivers nothing", async () => {
    const { submit, deps } = await start();
    const { status, json } = await submit({
      state: answeredState(),
      submissionId: "aaaaaaaa-bbbb-4ccc-8ddd-333333333333",
      _gotcha: "http://spam.example",
    });
    expect(status).toBe(200);
    expect(json).toEqual({ ok: true, calendlyUrl: CALENDLY });
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(deps.incrWithExpiry).not.toHaveBeenCalled();
    expect(deps.rateLimit).toHaveBeenCalledWith(expect.any(String), "submit");
  });

  it("rate-limits submits per address with 429", async () => {
    let calls = 0;
    const rateLimit = vi.fn(async (_ip: string, bucket: string) => bucket === "submit" && ++calls <= 5);
    const { submit, deps } = await start({ rateLimit });
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      statuses.push((await submit({ state: { ...answeredState(), contact: { ...CONTACT, email: `visitor${i}@example.com` } }, submissionId: `aaaaaaaa-bbbb-4ccc-8ddd-44444444444${i}` })).status);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(5);
    // One per-email counter and one idempotency mark for each delivered brief.
    expect(deps.incrWithExpiry).toHaveBeenCalledTimes(10);
  });

  it("idempotent submit", async () => {
    const { submit, deps } = await start();
    const body = { state: answeredState(), submissionId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" };
    const first = await submit(body);
    const second = await submit(body);
    expect(second).toEqual(first);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(1);
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("delivers anyway when the idempotency store fails", async () => {
    const { submit, deps } = await start({ incrWithExpiry: vi.fn(async () => Promise.reject(new Error("upstash down"))) });
    const { status } = await submit({ state: answeredState(), submissionId: "aaaaaaaa-bbbb-4ccc-8ddd-000000000000" });
    expect(status).toBe(200);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(1);
  });

  it("submit rejects invalid email with 400", async () => {
    const { submit, deps } = await start();
    const state = { ...answeredState(), contact: { ...CONTACT, email: "not-an-email" } };
    const { status } = await submit({ state, submissionId: "aaaaaaaa-bbbb-4ccc-8ddd-111111111111" });
    expect(status).toBe(400);
    expect((await submit({ state: answeredState(), submissionId: "" })).status).toBe(400);
    expect((await submit({ state: { answers: {} }, submissionId: "aaaaaaaa-bbbb-4ccc-8ddd-222222222222" })).status).toBe(400);
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
});

describe("POST /api/brief/submit shape and abuse limits", () => {
  afterEach(async () => {
    await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
    server = undefined;
  });

  it("refuses made-up keys, values outside the bank and incomplete briefs", async () => {
    const { submit, deps } = await start();
    const base = answeredState();
    const bad = [
      { ...base, answers: { ...base.answers, evil: "x" } },
      { ...base, answers: { ...base.answers, q1: "not an option" } },
      { ...base, answers: { ...base.answers, q1: ["lost_deals"] } },
      { ...base, answers: { q1: "lost_deals" } },
    ];
    for (const [i, state] of bad.entries()) {
      expect((await submit({ state, submissionId: `dddddddd-bbbb-4ccc-8ddd-00000000000${i}` })).status, `case ${i}`).toBe(400);
    }
    expect(deps.deliverToAttio).not.toHaveBeenCalled();
  });

  it("caps three briefs a day per email address with 429", async () => {
    const { submit, deps } = await start();
    for (let i = 0; i < 3; i++) {
      expect((await submit({ state: answeredState(), submissionId: `eeeeeeee-bbbb-4ccc-8ddd-00000000000${i}` })).status).toBe(200);
    }
    const fourth = await submit({ state: { ...answeredState(), contact: { ...CONTACT, email: "ANA@example.com" } }, submissionId: "eeeeeeee-bbbb-4ccc-8ddd-000000000009" });
    expect(fourth.status).toBe(429);
    expect(deps.deliverToAttio).toHaveBeenCalledTimes(3);
  });
});

describe("brief delivery helpers", () => {
  const env = { ...process.env };
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    process.env = { ...env };
    errorSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it("formats an English, deterministic summary: prompt, then the label the visitor saw and the stored value", () => {
    const state = answeredState();
    const summary = formatBriefSummary(state);
    expect(summary).toBe(formatBriefSummary(state));
    expect(summary).toContain("Name: Ana Ruiz");
    expect(summary).toContain("Email: ana@example.com");
    expect(summary).toContain("Company: Casa Mar");
    expect(summary).toContain("Came from\nLike Casa Mar");
    expect(summary).toContain("What's your brand actually costing you right now?\nLost deals. Clients can't see what we're worth. [lost_deals]");
    expect(summary).toContain("What's your investment range for this?\n$35K \u2013 $75K [35_75k]");
    expect(summary).toContain("When do you want this live?\n1 \u2013 3 months. [1_3_months]");
    expect(summary).not.toContain("Website: ");
  });

  it("builds the Calendly URL, or an empty string without CALENDLY_URL", () => {
    process.env.CALENDLY_URL = "https://calendly.com/atla/intro";
    const plain = new URL(briefCalendlyUrl(CONTACT));
    expect(plain.origin + plain.pathname).toBe("https://calendly.com/atla/intro");
    expect(plain.searchParams.get("name")).toBe("Ana Ruiz");
    expect(plain.searchParams.get("email")).toBe("ana@example.com");
    process.env.CALENDLY_URL = "https://calendly.com/atla/intro?hide_gdpr_banner=1";
    const withQuery = new URL(briefCalendlyUrl(CONTACT));
    expect(withQuery.searchParams.get("hide_gdpr_banner")).toBe("1");
    expect(withQuery.searchParams.get("name")).toBe("Ana Ruiz");
    expect(withQuery.searchParams.get("email")).toBe("ana@example.com");
    process.env.CALENDLY_URL = "not a url";
    expect(briefCalendlyUrl(CONTACT)).toBe("");
    delete process.env.CALENDLY_URL;
    expect(briefCalendlyUrl(CONTACT)).toBe("");
    expect(errorSpy.mock.calls.join(" ")).toMatch(/CALENDLY_URL/);
  });

  it("sends a plain-text Resend email", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.BRIEF_FROM_EMAIL = "Atla <brief@atla.design>";
    delete process.env.BRIEF_TO_EMAIL;
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await sendBriefEmail(answeredState());
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test");
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      from: "Atla <brief@atla.design>",
      to: ["josepablo@atla.design"],
      subject: "New brief: Casa Mar",
      text: formatBriefSummary(answeredState()),
      reply_to: "ana@example.com",
    });
  });

  it("fails loud when Resend is not configured or answers an error", async () => {
    delete process.env.RESEND_API_KEY;
    await expect(sendBriefEmail(answeredState())).rejects.toThrow(/RESEND_API_KEY/);
    process.env.RESEND_API_KEY = "re_test";
    process.env.BRIEF_FROM_EMAIL = "brief@atla.design";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad", { status: 422 })));
    await expect(sendBriefEmail(answeredState())).rejects.toThrow(/422/);
  });
});
