import { describe, expect, it } from "vitest";
import { apiLogLine, isPrivateApiPath } from "./apiLog.ts";

describe("apiLogLine", () => {
  it("keeps response bodies for ordinary API paths", () => {
    expect(apiLogLine("GET", "/api/projects", 200, 5, [{ slug: "a" }])).toBe('GET /api/projects 200 in 5ms :: [{"slug":"a"}]');
  });

  it("never logs bodies for /api/ask and /api/brief/*", () => {
    const body = { kind: "brief", seed: "We're launching a coffee brand" };
    expect(apiLogLine("POST", "/api/ask", 200, 7, body)).toBe("POST /api/ask 200 in 7ms");
    expect(apiLogLine("POST", "/api/brief/next", 200, 7, body)).toBe("POST /api/brief/next 200 in 7ms");
    expect(apiLogLine("POST", "/api/brief", 200, 7, body)).toBe("POST /api/brief 200 in 7ms");
  });

  it("matches only the private paths", () => {
    expect(isPrivateApiPath("/api/ask/")).toBe(true);
    expect(isPrivateApiPath("/api/asking")).toBe(false);
    expect(isPrivateApiPath("/api/briefs")).toBe(false);
  });
});
