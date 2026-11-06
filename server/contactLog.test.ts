import express from "express";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { failureRef, registerContactRoute } from "./contact.ts";

let server: Server | undefined;
afterEach(async () => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (server) await new Promise((resolve) => server!.close(resolve));
  server = undefined;
});

describe("contact failure log", () => {
  it("keeps a reference and the email domain, never the address or the message", () => {
    const line = failureRef("Ana.Ruiz@Example.com", "00000000-0000-4000-8000-000000000000");
    expect(line).toBe("ref=00000000-0000-4000-8000-000000000000 domain=example.com");
    expect(line).not.toMatch(/ana|ruiz/i);
  });

  it("a failed Attio delivery logs no message excerpt", async () => {
    vi.stubEnv("ATTIO_API_KEY", "test-key");
    const realFetch = globalThis.fetch;
    vi.stubGlobal("fetch", (input: RequestInfo | URL, init?: RequestInit) =>
      String(input).startsWith("https://api.attio.com") ? Promise.resolve(new Response("down", { status: 503 })) : realFetch(input, init),
    );
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const app = express();
    app.use(express.json());
    registerContactRoute(app);
    server = app.listen(0);
    await new Promise<void>((resolve) => server!.once("listening", () => resolve()));
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://127.0.0.1:${port}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: `http://127.0.0.1:${port}` },
      body: JSON.stringify({ name: "Ana", email: "ana.private@example.com", message: "A very private project description about our launch." }),
    });
    expect(res.status).toBe(502);
    const logged = errors.mock.calls.map((call) => call.join(" ")).join("\n");
    expect(logged).toContain("Contact delivery failed");
    expect(logged).toContain("domain=example.com");
    expect(logged).not.toContain("private");
    expect(logged).not.toContain("ana.private");
  });

  it("refuses a post that names no site, native form or JSON, before anything else runs", async () => {
    vi.stubEnv("ATTIO_API_KEY", "test-key");
    const warns = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    registerContactRoute(app);
    server = app.listen(0);
    await new Promise<void>((resolve) => server!.once("listening", () => resolve()));
    const { port } = server.address() as AddressInfo;
    const url = `http://127.0.0.1:${port}/api/contact`;
    const json = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Ana", email: "ana@example.com", message: "A project we want to talk about." }),
    });
    expect(json.status).toBe(403);
    const form = await fetch(url, {
      method: "POST",
      redirect: "manual",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "name=Ana&email=ana%40example.com&message=A+project+we+want+to+talk+about.",
    });
    expect(form.status).toBe(303);
    expect(form.headers.get("location")).toContain("o=forbidden");
    expect(warns.mock.calls.map((call) => call.join(" ")).join("\n")).toContain("no Origin or Referer");
  });
});
