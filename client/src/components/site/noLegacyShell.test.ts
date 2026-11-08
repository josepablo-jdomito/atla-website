import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Every page renders inside PageShell (SiteHeader + SiteFooter). Task 12 deleted the old Atla shell and
// the pages built on it; this fails if any of them comes back, as a file or as an import.
const CLIENT_SRC = path.resolve(import.meta.dirname, "../..");
const DELETED = [
  "AtlaHeader",
  "AtlaFooter",
  "AtlaNav",
  "AtlaWork",
  "AtlaProject",
  "AtlaAbout",
  "AtlaServices",
  "AtlaContact",
  "AtlaBlogPage",
  "ElementDefault",
  "ThemeProvider",
];
const NAMES = DELETED.join("|");
const LEGACY_IMPORT = new RegExp(
  `from\\s+["'][^"']*\\/(${NAMES})["']|import\\(\\s*["'][^"']*\\/(${NAMES})["']\\s*\\)`,
);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(tsx?|jsx?)$/.test(name) ? [full] : [];
  });
}

describe("legacy Atla shell", () => {
  it("no file under client/src imports AtlaHeader, AtlaFooter, AtlaNav or a deleted old page", () => {
    const offenders = sourceFiles(CLIENT_SRC)
      .filter((file) => LEGACY_IMPORT.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(CLIENT_SRC, file));
    expect(offenders).toEqual([]);
  });

  it("none of the deleted files exists again under client/src", () => {
    const recreated = sourceFiles(CLIENT_SRC)
      .filter((file) => DELETED.includes(path.basename(file).replace(/\.(tsx?|jsx?)$/, "")))
      .map((file) => path.relative(CLIENT_SRC, file));
    expect(recreated).toEqual([]);
  });
});
