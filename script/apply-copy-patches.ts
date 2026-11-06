/**
 * Applies the Sanity copy patches from docs/superpowers/specs/2026-11-06-sanity-copy-fix/patches.json.
 *
 * Dry run by default: prints what would change. `--write` mutates, and runs only on JP's «mándalo».
 * Entries with a `hold` are skipped unless named in `--include slug,slug`. The `ifCodeUnchanged`
 * shape is the one applied (intro in `description`, the rest as `caseStudy` blocks): that is how
 * server/sanity/projectService.ts reads a project today (`body ?? content ?? caseStudy`).
 *
 *   SANITY_WRITE_TOKEN=... npx tsx script/apply-copy-patches.ts            # dry run
 *   SANITY_WRITE_TOKEN=... npx tsx script/apply-copy-patches.ts --write    # mutate
 *
 * Without SANITY_WRITE_TOKEN the token from the Sanity CLI login (~/.config/sanity/config.json) is used.
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "dvufm78f";
const DATASET = process.env.SANITY_DATASET || "production";
const DEFAULT_FILE = "docs/superpowers/specs/2026-11-06-sanity-copy-fix/patches.json";

type Entry = {
  _id: string;
  slug: string;
  hold?: string;
  note?: string;
  set?: Record<string, unknown>;
  unset?: string[];
  ifCodeUnchanged?: { set?: Record<string, unknown>; unset?: string[] };
};

function cliToken(): string {
  const path = join(homedir(), ".config", "sanity", "config.json");
  if (!existsSync(path)) return "";
  try {
    return (JSON.parse(readFileSync(path, "utf8")) as { authToken?: string }).authToken ?? "";
  } catch {
    return "";
  }
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const includeArg = args[args.indexOf("--include") + 1];
  const include = new Set(args.includes("--include") && includeArg ? includeArg.split(",") : []);
  const fileArg = args[args.indexOf("--file") + 1];
  const FILE = args.includes("--file") && fileArg ? fileArg : DEFAULT_FILE;
  const token = process.env.SANITY_WRITE_TOKEN || cliToken();
  if (!token) throw new Error("No Sanity token: set SANITY_WRITE_TOKEN or log in with the Sanity CLI.");

  const entries = JSON.parse(readFileSync(FILE, "utf8")) as Entry[];
  const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: "2023-10-01", token, useCdn: false });

  console.log(`${write ? "WRITE" : "DRY RUN"} against ${PROJECT_ID}/${DATASET}, ${entries.length} entries`);
  let applied = 0;
  for (const entry of entries) {
    if (entry.hold && !include.has(entry.slug)) {
      console.log(`  skip  ${entry.slug}: hold (${entry.hold.slice(0, 80)})`);
      continue;
    }
    const shape = entry.ifCodeUnchanged ?? { set: entry.set, unset: entry.unset };
    const set = shape.set ?? {};
    // The top-level `unset` belongs to the description-only shape; with `ifCodeUnchanged` the
    // caseStudy is replaced, not cleared.
    const unset = shape.unset ?? [];
    const fields = Object.keys(set);
    const current = await client.getDocument(entry._id);
    if (!current) {
      console.log(`  MISSING ${entry.slug} (${entry._id})`);
      continue;
    }
    console.log(`  ${write ? "patch" : "would"} ${entry.slug}: set ${fields.join(", ")}${unset.length ? `; unset ${unset.join(", ")}` : ""}`);
    if (!write) continue;
    let patch = client.patch(entry._id).set(set);
    if (unset.length) patch = patch.unset(unset);
    await patch.commit({ autoGenerateArrayKeys: true });
    applied += 1;
  }
  console.log(write ? `${applied} documents patched.` : "Nothing written.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
