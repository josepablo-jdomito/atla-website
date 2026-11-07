import { describe, expect, it } from "vitest";
import { stripQuery } from "./stripQuery";

describe("stripQuery", () => {
  it("drops the typed search and the hash from the reported url", () => {
    expect(stripQuery({ type: "pageview", url: "https://www.atla.design/?q=coffee+shop&sector=x#a" }).url).toBe("https://www.atla.design/");
    expect(stripQuery({ url: "https://www.atla.design/brief?seed=my%20words" }).url).toBe("https://www.atla.design/brief");
  });
  it("copes with a relative or broken url", () => {
    expect(stripQuery({ url: "/work?q=a" }).url).toBe("/work");
  });
});
