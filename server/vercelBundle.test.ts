import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The Vercel function (api/index.ts) only ships the files vercel.json's includeFiles names.
 * A server import that reaches outside those globs resolves locally and crashes on Vercel
 * with ERR_MODULE_NOT_FOUND (the Ask route did on 2026-11-06). This keeps the two in step.
 */
const ROOT = resolve(import.meta.dirname, "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.ts$/.test(name) && !/\.test\.ts$/.test(name) && name !== "vite.ts") out.push(full); // vite.ts is dev-only
  }
  return out;
}

describe("vercel function bundle", () => {
  it("includeFiles covers every file the server imports", () => {
    const config = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
    const include: string = config.functions["api/index.ts"].includeFiles;
    const prefixes = include
      .replace(/^\{|\}$/g, "")
      .split(",")
      .map((glob) => glob.replace(/\/?\*\*$/, "/"));
    const offenders: string[] = [];
    for (const file of [...walk(join(ROOT, "server")), ...walk(join(ROOT, "shared")), join(ROOT, "api/index.ts")]) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/from\s+"(\.{1,2}\/[^"]+)"/g)) {
        const target = relative(ROOT, resolve(file, "..", match[1]));
        if (!prefixes.some((prefix) => target.startsWith(prefix)) && !target.startsWith("api/")) {
          offenders.push(`${relative(ROOT, file)} -> ${target}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
