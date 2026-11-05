import express from "express";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextFixedQuestion, type BriefState } from "../../shared/brief.ts";
import { briefCalendlyUrl, formatBriefSummary, sendBriefEmail } from "./deliver.ts";
import { registerBriefRoutes, type BriefDeps } from "./route.ts";

const CONTACT = { name: "Ana Ruiz", email: "ana@example.com", company: "Casa Mar", website: "", phone: "" };
const CALENDLY = "https://calendly.com/atla/intro?name=Ana%20Ruiz&email=ana%40example.com";

let server: Server | undefined;

function counterStore() {
  const counts = new Map<string, number>();
  return vi.fn(async (key: string) => {
    const next = (counts.get(key) ?? 0) + 1;
    counts.set(key, next);
    return next;
  });
}

async function start(overrides: Partial<BriefDeps> = {}) {
  const deps: BriefDeps = {
    ai: vi.fn(async () => null),
    rateLimit: vi.fn(async () => true),
    aiBudgetAvailable: vi.fn(async () => true),
    incrWithExpiry: counterStore(),
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
  const post = async (path: string, body: unknown) => {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return { status: res.status, json: (await res.json()) as Record<string, any> };
  };
  return { deps, next: (body: unknown) => post("/api/brief/next", body), submit: (body: unknown) => post("/api/brief/submit", body) };
}

const answeredState = (): BriefState => ({
  seed: "A boutique hotel in Tulum",
  answers: { building: "A boutique hotel in Tulum", industry: "Hospitality", moment: "Launch", deliverables: ["Identity", "Website"] },
  contact: CONTACT,
});

describe("POST /api/brief/next", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(async () => {
    errorSpy.mockRestore();
    await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
    server = undefined;
  });

  it("returns the AI question when it is valid and unanswered", async () => {
    const ai = vi.fn(async () => ({
      id: "stage",
      prompt: "Is the hotel open yet?",
      kind: "single",
      options: ["Still an idea", "Under construction", "Open", "Open for years"],
    }));
    const { next } = await start({ ai });
    const { status, json } = await next({ state: { answers: { building: "A hotel in Tulum" } } });
    expect(status).toBe(200);
    expect(json.question).toEqual({
      id: "stage",
      prompt: "Is the hotel open yet?",
      kind: "single",
      options: ["Still an idea", "Under construction", "Open", "Open for years"],
    });
    const opts = ai.mock.calls[0][0] as { system: string; toolName: string; schema: any; user: string };
    expect(opts.toolName).toBe("next_question");
    expect(opts.system).toMatch(/English/);
    expect(opts.system).toMatch(/budget/i);
    expect(opts.system).toMatch(/data/i);
    expect(opts.schema.properties.id.enum).toEqual(["industry", "stage", "moment", "deliverables", "timing"]);
  });

  it("next falls back when AI returns answered id", async () => {
    const state: BriefState = { answers: { building: "A hotel", industry: "Hospitality" } };
    const ai = vi.fn(async () => ({ id: "industry", prompt: "Which world again?", kind: "single", options: ["A", "B"] }));
    const { next } = await start({ ai });
    const { status, json } = await next({ state });
    expect(status).toBe(200);
    expect(ai).toHaveBeenCalledTimes(1);
    expect(json.question).toEqual(nextFixedQuestion(state));
    expect(json.question.id).toBe("stage");
  });

  it("next falls back on null, malformed or kind-changing AI output", async () => {
    const state: BriefState = { answers: { building: "A hotel" } };
    for (const output of [
      null,
      { id: "stage" },
      { id: "contact", prompt: "Your email?", kind: "text", options: [] },
      { id: "stage", prompt: "Tell me about the stage", kind: "text", options: [] },
      { id: "stage", prompt: "Stage?", kind: "single", options: [] },
    ]) {
      const { next } = await start({ ai: vi.fn(async () => output) });
      const { json } = await next({ state });
      expect(json.question).toEqual(nextFixedQuestion(state));
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      server = undefined;
    }
  });

  it("next never returns budget", async () => {
    const state: BriefState = { answers: { building: "A hotel" } };
    for (const output of [
      { id: "budget", prompt: "What is your budget?", kind: "single", options: ["< $10k", "$10k+"] },
      { id: "stage", prompt: "What budget do you have for this?", kind: "text", options: [] },
      { id: "timing", prompt: "When do you want to start?", kind: "single", options: ["Now, price is no issue", "Later"] },
      { id: "moment", prompt: "How much can you spend?", kind: "single", options: ["$50,000", "More"] },
      { id: "moment", prompt: "What is the moment?", kind: "single", options: ["Launch", "Under 50k"] },
    ]) {
      const { next } = await start({ ai: vi.fn(async () => output) });
      const { json } = await next({ state });
      expect(json.question).toEqual(nextFixedQuestion(state));
      expect(JSON.stringify(json.question)).not.toMatch(/budget|price|\$/i);
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      server = undefined;
    }
  });

  it("does not mistake ordinary words for money talk", async () => {
    const question = { id: "building", prompt: "How should it feel to guests?", kind: "text" };
    const { next } = await start({ ai: vi.fn(async () => ({ ...question, options: [] })) });
    expect((await next({ state: { answers: {} } })).json.question).toEqual(question);
  });

  it("cap reached uses fallback", async () => {
    const state: BriefState = { answers: { building: "A hotel" } };
    for (const overrides of [{ rateLimit: vi.fn(async () => false) }, { aiBudgetAvailable: vi.fn(async () => false) }]) {
      const ai = vi.fn(async () => ({ id: "stage", prompt: "Open yet?", kind: "single", options: ["Yes", "No"] }));
      const { next } = await start({ ai, ...overrides });
      const { status, json } = await next({ state });
      expect(status).toBe(200);
      expect(ai).not.toHaveBeenCalled();
      expect(json.question).toEqual(nextFixedQuestion(state));
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      server = undefined;
    }
  });

  it("falls back when the AI dependency throws", async () => {
    const state: BriefState = { answers: {} };
    const { next } = await start({ ai: vi.fn(async () => Promise.reject(new Error("down"))) });
    const { status, json } = await next({ state });
    expect(status).toBe(200);
    expect(json.question).toEqual(nextFixedQuestion(state));
  });

  it("goes to contact and done without the AI", async () => {
    const ai = vi.fn(async () => null);
    const { next } = await start({ ai });
    const all = { building: "x", industry: "Other", stage: "Idea", moment: "Launch", deliverables: ["Naming"], timing: "Exploring" };
    expect((await next({ state: { answers: all } })).json.question).toEqual({ id: "contact" });
    expect((await next({ state: { answers: all, contact: CONTACT } })).json.question).toEqual({ id: "done" });
    expect(ai).not.toHaveBeenCalled();
  });

  it("rejects malformed or oversized state with 400", async () => {
    const { next } = await start();
    const tooMany = Object.fromEntries(Array.from({ length: 21 }, (_, i) => [`k${i}`, "x"]));
    for (const body of [
      {},
      { state: { answers: "nope" } },
      { state: { answers: { building: "a".repeat(1001) } } },
      { state: { answers: { deliverables: Array(11).fill("Naming") } } },
      { state: { answers: tooMany } },
      { state: { seed: "s".repeat(301), answers: {} } },
    ]) {
      expect((await next(body)).status).toBe(400);
    }
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

  it("submit survives Attio and AI failure", async () => {
    const { submit } = await start({
      ai: vi.fn(async () => Promise.reject(new Error("AI down"))),
      deliverToAttio: vi.fn(async () => Promise.reject(new Error("Attio 503"))),
      sendEmail: vi.fn(async () => Promise.reject(new Error("Resend 500"))),
    });
    const { status, json } = await submit({ state: answeredState(), submissionId: "11111111-2222-4333-8444-555555555555" });
    expect(status).toBe(200);
    expect(json).toEqual({ ok: true, calendlyUrl: CALENDLY });
    const logged = errorSpy.mock.calls.map((call) => call.join(" ")).join("\n");
    expect(logged).toMatch(/Attio 503/);
    expect(logged).toMatch(/Resend 500/);
    expect(logged).toContain(formatBriefSummary(answeredState()));
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

  it("formats an English, deterministic summary that keeps free text as written", () => {
    const state: BriefState = { ...answeredState(), answers: { ...answeredState().answers, building: "Un hotel boutique\nen Tulum" } };
    const summary = formatBriefSummary(state);
    expect(summary).toBe(formatBriefSummary(state));
    expect(summary).toContain("Name: Ana Ruiz");
    expect(summary).toContain("Email: ana@example.com");
    expect(summary).toContain("Company: Casa Mar");
    expect(summary).toContain("What are you building?\nUn hotel boutique\nen Tulum");
    expect(summary).toContain("What do you need from us?\nIdentity, Website");
    expect(summary).not.toContain("Website: ");
    expect(summary).not.toMatch(/budget|price/i);
  });

  it("builds the Calendly URL, or an empty string without CALENDLY_URL", () => {
    process.env.CALENDLY_URL = "https://calendly.com/atla/intro";
    expect(briefCalendlyUrl(CONTACT)).toBe(CALENDLY);
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
