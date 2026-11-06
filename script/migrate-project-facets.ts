/**
 * Project facets migration (proposal section 5, approved by JP 2026-11-05).
 *
 * Reads script/project-facets.json (the section 4 table with JP's section 6 answers) and writes
 * `sector`, `disciplines`, `stage` and `searchTerms` onto the DRAFT of each project document
 * (`drafts.<id>`), creating the draft from the published document when none exists, and unsets the
 * legacy `service` string. Published documents are never touched: JP reviews each draft in the
 * Studio and publishes it. The deprecated fields (industry, region, category, services, tags) stay.
 *
 *   npx tsx script/migrate-project-facets.ts                       dry run: prints the diff, writes nothing
 *   SANITY_WRITE_TOKEN=... npx tsx script/migrate-project-facets.ts --write
 *
 * Runs only on JP's «mándalo». Reading drafts needs a token too (SANITY_WRITE_TOKEN or SANITY_READ_TOKEN);
 * without one the dry run compares against the published documents and says so.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
import { DISCIPLINES, MAX_SEARCH_TERMS, SECTORS, STAGES } from "../shared/projectFacets.ts";

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? "dvufm78f";
const DATASET = process.env.SANITY_DATASET ?? "production";
const API_VERSION = "2023-10-01";
const FACETS_PATH = path.resolve(import.meta.dirname, "project-facets.json");

type Row = { slug: string; sector: string; disciplines: string[]; stage: string; searchTerms: string[] };
type Doc = {
  _id: string;
  _type: string;
  /** slug.current, projected beside the raw document so the slug object itself is never overwritten. */
  slugCurrent?: string;
  sector?: string;
  disciplines?: string[];
  stage?: string;
  searchTerms?: string[];
  service?: unknown;
  [key: string]: unknown;
};

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_READ_TOKEN || "";

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function validateRows(rows: Row[]) {
  const seen = new Set<string>();
  for (const row of rows) {
    const where = `row ${row.slug || "(no slug)"}`;
    const text = JSON.stringify(row);
    if (text.includes("?")) fail(`${where} still holds a "?": resolve it in the proposal first`);
    if (!row.slug) fail(`${where}: slug missing`);
    if (seen.has(row.slug)) fail(`${where}: slug listed twice`);
    seen.add(row.slug);
    if (!(SECTORS as readonly string[]).includes(row.sector)) fail(`${where}: sector "${row.sector}" is not in the list`);
    if (!(STAGES as readonly string[]).includes(row.stage)) fail(`${where}: stage "${row.stage}" is not in the list`);
    if (!Array.isArray(row.disciplines) || row.disciplines.length === 0) fail(`${where}: disciplines empty`);
    for (const d of row.disciplines) if (!(DISCIPLINES as readonly string[]).includes(d)) fail(`${where}: discipline "${d}" is not in the list`);
    if (new Set(row.disciplines).size !== row.disciplines.length) fail(`${where}: duplicate discipline`);
    if (!Array.isArray(row.searchTerms) || row.searchTerms.length > MAX_SEARCH_TERMS) fail(`${where}: more than ${MAX_SEARCH_TERMS} search terms`);
    for (const term of row.searchTerms) {
      if (term !== term.toLowerCase() || term.trim().length < 2 || term.trim().length > 30) fail(`${where}: search term "${term}" must be lowercase, 2 to 30 characters`);
    }
  }
}

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const show = (value: unknown) => (value === undefined || value === null ? "·" : Array.isArray(value) ? value.join(", ") || "·" : String(value));

async function main() {
  const file = JSON.parse(await readFile(FACETS_PATH, "utf8")) as { projects: Row[] };
  const rows = file.projects;
  validateRows(rows);
  console.log(`${rows.length} rows in ${path.relative(process.cwd(), FACETS_PATH)} (all values in the lists)`);

  if (write && !process.env.SANITY_WRITE_TOKEN) fail("--write needs SANITY_WRITE_TOKEN");
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    useCdn: false,
    token: token || undefined,
    perspective: "raw",
  });
  console.log(`${write ? "WRITE" : "DRY RUN"} against ${PROJECT_ID}/${DATASET}${token ? "" : " (no token: drafts cannot be read, diff is against published)"}`);

  const docs = await client.fetch<Doc[]>(
    `*[_type == "project" && defined(slug.current)]{ ..., "slugCurrent": slug.current }`,
  );
  const published = new Map<string, Doc>();
  const drafts = new Map<string, Doc>();
  for (const doc of docs) {
    if (doc._id.startsWith("drafts.")) drafts.set(doc._id.slice("drafts.".length), doc);
    else published.set(doc._id, doc);
  }
  const bySlug = new Map<string, { baseId: string; published?: Doc; draft?: Doc }>();
  for (const [id, doc] of published) bySlug.set(doc.slugCurrent!, { baseId: id, published: doc, draft: drafts.get(id) });
  for (const [id, doc] of drafts) if (!bySlug.has(doc.slugCurrent!)) bySlug.set(doc.slugCurrent!, { baseId: id, draft: doc });

  const transaction = client.transaction();
  let changes = 0;
  const missing: string[] = [];
  for (const row of rows) {
    const found = bySlug.get(row.slug);
    if (!found) {
      missing.push(row.slug);
      continue;
    }
    const current = found.draft ?? found.published!;
    const draftId = `drafts.${found.baseId}`;
    const after = { sector: row.sector, disciplines: row.disciplines, stage: row.stage, searchTerms: row.searchTerms };
    const diffs = (Object.keys(after) as Array<keyof typeof after>).filter((key) => !same(current[key], after[key]));
    const dropService = current.service !== undefined;
    const origin = found.draft ? "draft" : found.published ? "published → new draft" : "draft";
    if (diffs.length === 0 && !dropService) {
      console.log(`= ${row.slug} (${origin}): already set`);
      continue;
    }
    changes += 1;
    console.log(`~ ${row.slug} (${origin}) → ${draftId}`);
    for (const key of diffs) console.log(`    ${key}: ${show(current[key])}  →  ${show(after[key])}`);
    if (dropService) console.log(`    service: ${show(current.service)}  →  (unset)`);
    if (write) {
      if (!found.draft && found.published) {
        // Copy the raw published document (slug object included); drop the projection and the system fields.
        const { _rev, _updatedAt, _createdAt, slugCurrent, ...rest } = found.published;
        transaction.createIfNotExists({ ...rest, _id: draftId } as Doc & { _type: string });
      }
      transaction.patch(draftId, (patch) => patch.set(after).unset(["service"]));
    }
  }
  const untouched = Array.from(bySlug.keys()).filter((slug) => !rows.some((row) => row.slug === slug));
  if (missing.length) console.log(`! not in Sanity, skipped: ${missing.join(", ")}`);
  if (untouched.length) console.log(`! in Sanity, not in the table, untouched: ${untouched.join(", ")}`);
  console.log(`${changes} document${changes === 1 ? "" : "s"} to change`);

  if (!write || changes === 0) {
    if (!write) console.log("Dry run: nothing written. Add --write with SANITY_WRITE_TOKEN to patch the drafts.");
    return;
  }

  await transaction.commit();
  console.log("Committed. Verifying…");
  const after = await client.fetch<Doc[]>(
    `*[_type == "project" && _id in path("drafts.**")]{ ..., "slugCurrent": slug.current }`,
  );
  const afterBySlug = new Map(after.map((doc) => [doc.slugCurrent, doc]));
  const wrong: string[] = [];
  for (const row of rows) {
    const doc = afterBySlug.get(row.slug);
    if (!doc) {
      if (bySlug.has(row.slug)) wrong.push(`${row.slug}: no draft after the write`);
      continue;
    }
    if (!doc.slug || typeof doc.slug !== "object" || (doc.slug as { current?: string }).current !== row.slug) {
      wrong.push(`${row.slug}.slug: not a slug object`);
    }
    for (const key of ["sector", "disciplines", "stage", "searchTerms"] as const) {
      if (!same(doc[key], row[key])) wrong.push(`${row.slug}.${key}: ${show(doc[key])} ≠ ${show(row[key])}`);
    }
    if (doc.service !== undefined) wrong.push(`${row.slug}.service still set`);
  }
  if (wrong.length) {
    for (const line of wrong) console.error(`✗ ${line}`);
    process.exit(1);
  }
  console.log(`✓ ${rows.length - missing.length} drafts match the table. Review and publish them in the Studio.`);
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
