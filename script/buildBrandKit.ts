/**
 * Generates Atla's own brand kit from this repository.
 *
 * The argument the page makes is that a brand system should be the thing the
 * work is actually built from, not a PDF beside it. So the kit is not written
 * by hand: it is extracted from the files that build atla.design and from this
 * repository's real commit history. If the site changes and the kit does not,
 * the kit is wrong and the next build says so.
 *
 * Every entry records where it came from, so a reader can tell the difference
 * between a value lifted out of the running site and a rule someone wrote down.
 *
 * Run: npm run build:brand-kit (the site build runs it first).
 */
import { execFileSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

type Provenance =
  /** Lifted verbatim out of a file that builds the live site. */
  | { kind: "extracted"; from: string }
  /** Written by the studio. The source of record is this file itself. */
  | { kind: "authored"; from: string };

type KitFile = {
  path: string;
  blurb: string;
  language: "markdown" | "css" | "json";
  provenance: Provenance;
  content: string;
};

type Decision = {
  sha: string;
  date: string;
  author: string;
  subject: string;
  reasoning: string;
  files: string[];
  diff: string;
};

const ROOT = path.resolve(import.meta.dirname, "..");

function read(relative: string) {
  return readFileSync(path.join(ROOT, relative), "utf8");
}

function git(args: string[]) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
}

/**
 * The branch to read history from. A deployment checkout is often a shallow,
 * single-branch clone with no origin/main, so try the refs in order of how
 * faithful they are and take the first that resolves.
 */
function resolveHistoryRef() {
  for (const ref of ["origin/main", "main", "HEAD"]) {
    try {
      git(["rev-parse", "--verify", "--quiet", ref]);
      return ref;
    } catch {
      // Try the next one.
    }
  }
  return null;
}

/** The real custom properties the site renders with, lifted out of its stylesheet. */
function extractTokens() {
  const css = read("client/src/index.css");
  const block = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!block) throw new Error("No :root block in client/src/index.css; the token extractor is stale.");

  const declarations = block[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("--"));

  if (declarations.length === 0) throw new Error("No custom properties found; the token extractor is stale.");

  return [
    "/* Extracted from client/src/index.css at build time.",
    "   These are the values atla.design renders with right now, not a copy. */",
    ":root {",
    ...declarations.map((line) => `  ${line}`),
    "}",
    "",
  ].join("\n");
}

/** The real font stacks, read off the same custom properties. */
function extractTypography() {
  const css = read("client/src/index.css");
  const families = Array.from(css.matchAll(/--([a-z0-9-]*font-family):\s*([^;]+);/gi)).map(
    ([, name, value]) => ({ name, value: value.trim() }),
  );

  const unique = Array.from(new Set(families.map((entry) => entry.value)));

  return [
    "# Typography",
    "",
    "Extracted from client/src/index.css. These are the stacks in use.",
    "",
    ...unique.map((value) => `- \`${value}\``),
    "",
    "## Rules",
    "",
    "- The display face sets headings. The text face sets everything else.",
    "- Letter-spacing is part of the token, not a per-component decision.",
    "- Line height is a percentage so it survives a type-scale change.",
    "",
  ].join("\n");
}

/** Organisation facts, read from the module the site and the build both import. */
function extractOrganisation() {
  const seo = read("shared/siteSeo.ts");
  const pick = (name: string) => seo.match(new RegExp(`export const ${name} = "([^"]+)"`))?.[1] ?? "";
  const socials = Array.from(seo.matchAll(/\{ label: "([^"]+)", href: "([^"]+)" \}/g)).map(
    ([, label, href]) => `- ${label}: ${href}`,
  );

  return [
    "# Organisation",
    "",
    "Extracted from shared/siteSeo.ts, the single module the site, the sitemap",
    "and the structured data all read from.",
    "",
    `- Name: ${pick("ORGANIZATION_NAME")}`,
    `- Site: ${pick("SITE_ORIGIN")}`,
    `- Contact: ${pick("CONTACT_EMAIL")}`,
    `- Guided entry: ${pick("START_URL")}`,
    "",
    "## Profiles",
    "",
    ...socials,
    "",
  ].join("\n");
}

/**
 * Commits that changed what the brand says or how it looks, as opposed to the
 * plumbing underneath.
 *
 * Selected on the paths that only a brand decision touches: the stylesheet the
 * site renders from, the studio's own components, the module holding the
 * organisation's facts, and the design context. Including the page directory
 * here would drag in every privacy and analytics change, which are real work
 * but say nothing about the brand.
 */
const BRAND_PATHS = [
  "client/src/index.css",
  "client/src/components/atla/",
  "shared/siteSeo.ts",
  ".impeccable.md",
];

function extractDecisions(limit: number, ref: string): Decision[] {
  const log = git([
    "log",
    ref,
    `-n${limit * 4}`,
    "--no-merges",
    "--date=short",
    "--pretty=format:%H%x1f%ad%x1f%an%x1f%s%x1f%b%x1e",
    "--",
    ...BRAND_PATHS,
  ]);

  const decisions: Decision[] = [];

  for (const record of log.split("\x1e")) {
    const trimmed = record.trim();
    if (!trimmed) continue;

    const [sha, date, author, subject, body = ""] = trimmed.split("\x1f");
    if (!sha) continue;

    // The reasoning is the commit body with the trailers stripped. A decision
    // without stated reasoning is not evidence of anything, so skip it.
    const reasoning = body
      .split("\n")
      .filter((line) => !/^(Co-Authored-By|Claude-Session|Signed-off-by):/i.test(line.trim()))
      .join("\n")
      .trim();
    if (!reasoning) continue;

    const files = git(["show", "--name-only", "--pretty=format:", sha])
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    // One readable hunk, not the whole changeset.
    const diff = git(["show", sha, "--unified=2", "--pretty=format:", "--", ...BRAND_PATHS])
      .split("\n")
      .filter((line) => !/^(index |diff --git |--- |\+\+\+ )/.test(line))
      .slice(0, 22)
      .join("\n")
      .trim();

    decisions.push({ sha: sha.slice(0, 7), date, author, subject, reasoning, files, diff });
    if (decisions.length >= limit) break;
  }

  return decisions;
}

/**
 * The decisions already generated and committed, used when this checkout has no
 * history to read. They were produced by a real run against the real log; this
 * keeps them rather than shipping an empty history.
 */
function committedDecisions(): Decision[] {
  try {
    const existing = JSON.parse(read("client/src/data/atlaKit.generated.json"));
    return Array.isArray(existing.decisions) ? existing.decisions : [];
  } catch {
    return [];
  }
}

const AUTHORED_VOICE = `# Voice

How Atla sounds, and the words it will not use.

## Service names

These are the names. A generic substitute is wrong even when it reads better.

- Fractional Creative Director. A retainer, three months minimum. Not coaching,
  not a design service. Never "Brand Director": that name was retired.
- Brand Strategy & Positioning
- Verbal Identity
- Brand Bible
- Brand Expressions
- Web Design
- Branding Analysis. Never "Brand Audit".

Never "fractional creative team". Never a service name that is not on this list.

## Never

- No discounts and no coupons, in any Atla business. No exceptions.
- No clichés: game-changer, authentic story, next level, elevate your brand.
- No empty corporate: synergies, leverage, robust solutions.
- No invented services, data, claims, testimonials or case studies.
- No em dash. A full stop, a comma or a colon instead.
- No emoji in anything written to be copied.

## Shape

- Founder to founder. Direct, with a point of view.
- High density, low length. Value per line.
- Where there are options, two or three, with one recommended out loud.
- Close on an action, never on a moral.
- Calls to action are quiet. Never aggressive.
`;

const AUTHORED_README = `# Atla brand kit

This kit is generated from the repository that builds atla.design. The visual
values are read out of the stylesheet the site ships. The organisation facts are
read out of the module the site, the sitemap and the structured data all import.
The decision history is this repository's own commit log.

That is the point. A brand system that is generated from the work cannot drift
from the work. When the site changes and the kit does not follow, the build is
wrong and it says so.

## Where to start

Depending on what you are making:

- **Anything written**: \`brand/voice.md\`, then \`brand/principles.md\`.
- **Anything designed**: \`visual/tokens.css\`, then \`visual/typography.md\`.
- **Anything that names the studio or a service**: \`brand/voice.md\` for the
  service names, \`brand/organisation.md\` for the facts.
- **A decision you disagree with**: the history. It records what changed and
  why, including the reversals.

## Provenance

Every file in this kit is labelled. "Extracted" means it was lifted out of a
file that builds the live site at the moment this page was built. "Authored"
means the studio wrote it and this file is the source of record.
`;

function buildKit() {
  const files: KitFile[] = [
    {
      path: "readme.md",
      blurb: "Where to start, and how to read the rest.",
      language: "markdown",
      provenance: { kind: "authored", from: "script/buildBrandKit.ts" },
      content: AUTHORED_README,
    },
    {
      path: "brand/principles.md",
      blurb: "Who the work is for, and what it has to feel like.",
      language: "markdown",
      provenance: { kind: "extracted", from: ".impeccable.md" },
      content: read(".impeccable.md"),
    },
    {
      path: "brand/voice.md",
      blurb: "The service names, the banned words, the shape of a sentence.",
      language: "markdown",
      provenance: { kind: "authored", from: "script/buildBrandKit.ts" },
      content: AUTHORED_VOICE,
    },
    {
      path: "brand/organisation.md",
      blurb: "The facts the site, the sitemap and the structured data share.",
      language: "markdown",
      provenance: { kind: "extracted", from: "shared/siteSeo.ts" },
      content: extractOrganisation(),
    },
    {
      path: "visual/tokens.css",
      blurb: "The values atla.design renders with, right now.",
      language: "css",
      provenance: { kind: "extracted", from: "client/src/index.css" },
      content: extractTokens(),
    },
    {
      path: "visual/typography.md",
      blurb: "The stacks in use, and the rules around them.",
      language: "markdown",
      provenance: { kind: "extracted", from: "client/src/index.css" },
      content: extractTypography(),
    },
  ];

  // Extraction from files is the staleness check, and it throws: those files
  // exist in every checkout, so a failure there means the kit no longer matches
  // the site. History is different. A shallow deployment clone legitimately has
  // none, and that must not fail a deploy, so fall back to what was committed.
  const ref = resolveHistoryRef();
  const fresh = ref ? extractDecisions(8, ref) : [];
  const committed = committedDecisions();

  // A shallow clone resolves HEAD but holds only a commit or two, which is a
  // thinner record than the one already generated from the full log. Take
  // whichever source actually has more history.
  const useFresh = fresh.length >= committed.length && fresh.length > 0;
  const decisions = useFresh ? fresh : committed;
  const decisionsFrom = useFresh ? `git (${ref})` : "committed snapshot";

  if (decisions.length === 0) {
    throw new Error("No decisions from history and none committed; the decision extractor is stale.");
  }

  let headSha = "unknown";
  try {
    headSha = git(["rev-parse", "--short", ref ?? "HEAD"]).trim();
  } catch {
    // Leave it unknown rather than fail the build over a label.
  }

  return {
    generatedAt: new Date().toISOString().slice(0, 10),
    headSha,
    decisionsFrom,
    files,
    decisions,
  };
}

const output = path.join(ROOT, "client/src/data/atlaKit.generated.json");
const kit = buildKit();
writeFileSync(output, `${JSON.stringify(kit, null, 2)}\n`, "utf8");
console.log(
  `[brand-kit] ${kit.files.length} files, ${kit.decisions.length} decisions ` +
    `from ${kit.decisionsFrom}, at ${kit.headSha}`,
);
