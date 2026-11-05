import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Every page renders inside PageShell (SiteHeader + SiteFooter). The old Atla shell was deleted in
// Task 12; this fails if anything under client/src imports it again.
const CLIENT_SRC = path.resolve(import.meta.dirname, "../..");
const LEGACY_SHELL = /from\s+["'][^"']*\/(AtlaHeader|AtlaFooter|AtlaNav)["']|import\(\s*["'][^"']*\/(AtlaHeader|AtlaFooter|AtlaNav)["']\s*\)/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(tsx?|jsx?)$/.test(name) ? [full] : [];
  });
}

describe("legacy Atla shell", () => {
  it("no file under client/src imports AtlaHeader, AtlaFooter or AtlaNav", () => {
    const offenders = sourceFiles(CLIENT_SRC)
      .filter((file) => LEGACY_SHELL.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(CLIENT_SRC, file));
    expect(offenders).toEqual([]);
  });
});
