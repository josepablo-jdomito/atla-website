import express from "express";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiErrorHandler, apiLogLine, errorLogLine, isPrivateApiPath } from "./apiLog.ts";

describe("apiLogLine", () => {
  it("keeps response bodies for ordinary API paths", () => {
    expect(apiLogLine("GET", "/api/projects", 200, 5, [{ slug: "a" }])).toBe('GET /api/projects 200 in 5ms :: [{"slug":"a"}]');
  });

  it("logs a body over 2 KB by its size only, and never serializes it when the length is known", () => {
    const big = [{ slug: "a", body: "x".repeat(3000) }];
    expect(apiLogLine("GET", "/api/projects", 200, 5, big)).toMatch(/^GET \/api\/projects 200 in 5ms :: \d+ bytes$/);
    const toJSON = vi.fn(() => "never");
    expect(apiLogLine("GET", "/api/projects", 200, 5, { toJSON }, 90_000)).toBe("GET /api/projects 200 in 5ms :: 90000 bytes");
    expect(toJSON).not.toHaveBeenCalled();
  });

  it("never logs bodies for /api/brief/* and /api/contact", () => {
    const body = { kind: "brief", seed: "We're launching a coffee brand" };
    expect(apiLogLine("POST", "/api/brief/next", 200, 7, body)).toBe("POST /api/brief/next 200 in 7ms");
    expect(apiLogLine("POST", "/api/brief", 200, 7, body)).toBe("POST /api/brief 200 in 7ms");
    expect(apiLogLine("POST", "/api/contact", 400, 7, { error: "x" })).toBe("POST /api/contact 400 in 7ms");
    expect(apiLogLine("POST", "/api/ask", 200, 7, { text: "answer words" })).toBe("POST /api/ask 200 in 7ms");
    expect(apiLogLine("POST", "/api/brand-check", 502, 7, { error: "x", ref: "r" })).toBe("POST /api/brand-check 502 in 7ms");
    expect(isPrivateApiPath("/API/Brand-Check")).toBe(true);
    expect(isPrivateApiPath("/api/brand-checks")).toBe(false);
  });

  it("matches the private paths in any case, and only those", () => {
    for (const path of ["/api/Brief/submit", "/API/BRIEF/next", "/api/Contact", "/api/contact/result"]) {
      expect(isPrivateApiPath(path), path).toBe(true);
    }
    expect(apiLogLine("POST", "/api/BRIEF/next", 200, 1, { seed: "secret" })).not.toContain("secret");
    expect(isPrivateApiPath("/api/briefing")).toBe(false);
    expect(isPrivateApiPath("/api/briefs")).toBe(false);
    expect(isPrivateApiPath("/api/contacts")).toBe(false);
  });
});

describe("the error handler", () => {
  afterEach(() => vi.restoreAllMocks());

  it("logs method, path, status and a short error name only", () => {
    const err = Object.assign(new SyntaxError("Unexpected token in ana@example.com"), {
      type: "entity.parse.failed",
      body: '{"name":"Ana Test","email":"ana@example.com"',
    });
    expect(errorLogLine("POST", "/api/brief/submit", 400, err)).toBe("[api] POST /api/brief/submit 400 entity.parse.failed");
    expect(errorLogLine("GET", "/api/x", 500, new TypeError("boom secret"))).toBe("[api] GET /api/x 500 TypeError");
    expect(errorLogLine("GET", "/api/x", 500, "a string")).toBe("[api] GET /api/x 500 Error");
  });

  it("never prints the raw body of a malformed JSON request", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = express();
    app.use(express.json());
    app.post("/api/brief/submit", (_req, res) => res.json({ ok: true }));
    app.use(apiErrorHandler);
    const server = app.listen(0);
    await new Promise<void>((resolve) => server.once("listening", () => resolve()));
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://127.0.0.1:${port}/api/brief/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"state":{"contact":{"name":"Ana Test","email":"ana@example.com","phone":"+1 555"}},',
    });
    const body = await res.json();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    expect(res.status).toBe(400);
    expect(body).toEqual({ message: "Bad request" });
    const logged = errorSpy.mock.calls.map((call) => call.map(String).join(" ")).join("\n");
    expect(logged).toBe("[api] POST /api/brief/submit 400 entity.parse.failed");
    expect(logged).not.toMatch(/Ana|example\.com|555/);
  });
});
