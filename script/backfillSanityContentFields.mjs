import { createClient } from "@sanity/client";

const PROJECT_ID = process.env.SANITY_JOURNAL_PROJECT_ID || "dvufm78f";
const DATASET = process.env.SANITY_JOURNAL_DATASET || "production";
const API_VERSION = process.env.SANITY_JOURNAL_API_VERSION || "2026-03-12";
const TOKEN =
  process.env.SANITY_TOKEN ||
  process.env.SANITY_JOURNAL_WRITE_TOKEN ||
  process.env.SANITY_JOURNAL_READ_TOKEN;

const args = process.argv.slice(2);
const IS_DRY_RUN = args.includes("--dry-run");
const PROJECTS_ONLY = args.includes("--projects-only");
const JOURNAL_ONLY = args.includes("--journal-only");
const METADATA_ONLY = args.includes("--metadata-only");
const DESCRIPTION_ONLY = args.includes("--description-only");

if (!TOKEN && !IS_DRY_RUN) {
  throw new Error(
    "Missing Sanity token. Set SANITY_TOKEN or SANITY_JOURNAL_WRITE_TOKEN.",
  );
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

const PROJECT_QUERY = `
  *[_type == "project" && defined(slug.current)]{
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    client,
    clientName,
    brand,
    year,
    publishedAt,
    category,
    industry,
    projectType,
    discipline,
    tags,
    keywords,
    service,
    services,
    description,
    excerpt,
    summary,
    body,
    content,
    caseStudy,
    region,
    country
  }
`;

const JOURNAL_QUERY = `
  *[_type == "journalArticle" && defined(slug.current)]{
    _id,
    title,
    "slug": slug.current,
    heroImage,
    coverImage,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset
      }
    }
  }
`;

const FALLBACK_JOURNAL_IMAGE_QUERY = `
  coalesce(
    *[_type == "journalArticle" && defined(heroImage.asset._ref)][0].heroImage.asset._ref,
    *[_type == "journalArticle" && defined(coverImage.asset._ref)][0].coverImage.asset._ref,
    *[_type == "project" && defined(coverImage.asset._ref)][0].coverImage.asset._ref,
    *[_type == "project" && defined(mainImage.asset._ref)][0].mainImage.asset._ref,
    *[_type == "project" && defined(heroImage.asset._ref)][0].heroImage.asset._ref,
    *[_type == "project" && defined(gallery[0].asset._ref)][0].gallery[0].asset._ref
  )
`;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function firstNonEmptyString(...values) {
  for (const value of values) {
    if (isNonEmptyString(value)) return value.trim();
  }
  return "";
}

function normalizeStringList(...values) {
  return values
    .flatMap((value) => {
      if (isNonEmptyString(value)) return [value.trim()];
      if (!Array.isArray(value)) return [];
      return value
        .flatMap((entry) => {
          if (isNonEmptyString(entry)) return [entry.trim()];
          if (!entry || typeof entry !== "object") return [];
          return [
            entry.title,
            entry.name,
            entry.label,
            entry.value,
            entry.current,
          ].filter(isNonEmptyString);
        })
        .map((entry) => entry.trim());
    })
    .filter(isNonEmptyString);
}

function unique(values) {
  return Array.from(new Set(values));
}

function hasYearValue(value) {
  if (typeof value === "number") return Number.isFinite(value);
  if (!isNonEmptyString(value)) return false;
  if (Number.isFinite(Number.parseInt(value, 10))) return true;
  return Number.isFinite(new Date(value).getTime());
}

function normalizeYear(value, fallbackDateString) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (isNonEmptyString(value)) {
    const parsedInt = Number.parseInt(value, 10);
    if (Number.isFinite(parsedInt)) return parsedInt;
    const parsedDate = new Date(value);
    if (Number.isFinite(parsedDate.getTime())) return parsedDate.getUTCFullYear();
  }
  if (isNonEmptyString(fallbackDateString)) {
    const parsedDate = new Date(fallbackDateString);
    if (Number.isFinite(parsedDate.getTime())) return parsedDate.getUTCFullYear();
  }
  return new Date().getUTCFullYear();
}

function portableTextToPlainText(value) {
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      if (!block || typeof block !== "object" || !Array.isArray(block.children)) {
        return "";
      }
      return block.children
        .map((child) => (isNonEmptyString(child?.text) ? child.text : ""))
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

function hasBodyContent(value) {
  if (isNonEmptyString(value)) return true;
  return portableTextToPlainText(value).trim().length > 0;
}

function toPortableTextBlocks(textA, textB) {
  const sentences = [textA, textB].filter(isNonEmptyString);
  return sentences.map((text, index) => ({
    _type: "block",
    _key: `auto-${index}-${Math.random().toString(36).slice(2, 9)}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `span-${index}-${Math.random().toString(36).slice(2, 9)}`,
        text,
        marks: [],
      },
    ],
  }));
}

function inferCategory(project) {
  return firstNonEmptyString(
    project.category,
    project.projectType,
    project.discipline,
    project.industry,
    "Brand Identity",
  );
}

function inferClient(project) {
  return firstNonEmptyString(project.client, project.clientName, project.brand, project.title);
}

function inferTags(project, categoryValue) {
  const generated = unique(
    normalizeStringList(
      project.tags,
      project.keywords,
      project.services,
      project.service,
      project.industry,
      categoryValue,
      project.region,
      project.country,
    )
      .map((tag) => tag.replace(/\s+/g, " ").trim())
      .filter(isNonEmptyString),
  );

  return generated.length > 0 ? generated.slice(0, 12) : ["Branding"];
}

function buildProjectPatch(project) {
  const patch = {};
  const categoryValue = inferCategory(project);
  const clientValue = inferClient(project);
  const bodySource = project.body ?? project.content ?? project.caseStudy;
  const hasNarrative = Boolean(
    hasBodyContent(bodySource) ||
      isNonEmptyString(project.description) ||
      isNonEmptyString(project.excerpt) ||
      isNonEmptyString(project.summary),
  );

  if (!isNonEmptyString(project.client) && isNonEmptyString(clientValue)) {
    patch.client = clientValue;
  }

  if (!hasYearValue(project.year)) {
    patch.year = normalizeYear(project.year, project.publishedAt || project._createdAt);
  }

  if (!isNonEmptyString(project.category) && isNonEmptyString(categoryValue)) {
    patch.category = categoryValue;
  }

  const existingTags = normalizeStringList(project.tags);
  if (existingTags.length === 0) {
    patch.tags = inferTags(project, categoryValue);
  }

  const summary =
    firstNonEmptyString(project.description, project.excerpt, project.summary) ||
    `${project.title} is an Atla case study focused on ${categoryValue.toLowerCase()} execution.`;

  if (DESCRIPTION_ONLY) {
    if (!hasNarrative && !isNonEmptyString(project.description)) {
      patch.description = summary;
    }
    return patch;
  }

  if (!METADATA_ONLY && !hasBodyContent(bodySource)) {
    const summary =
      firstNonEmptyString(project.description, project.excerpt, project.summary) ||
      `${project.title} is an Atla case study focused on ${categoryValue.toLowerCase()} execution.`;
    const bodyFollowUp = `The engagement aligned strategy, identity, and delivery across the key brand touchpoints for ${clientValue}.`;

    patch.caseStudy = toPortableTextBlocks(summary, bodyFollowUp);

    if (!isNonEmptyString(project.description)) {
      patch.description = summary;
    }
  }

  return patch;
}

function resolveImageRef(imageObject) {
  const ref = imageObject?.asset?._ref;
  return isNonEmptyString(ref) ? ref : "";
}

function buildJournalPatch(article, fallbackImageRef) {
  const patch = {};
  const heroRef = resolveImageRef(article.heroImage);
  const coverRef = resolveImageRef(article.coverImage);
  const bodyImageRef = Array.isArray(article.body)
    ? article.body
        .map((block) => resolveImageRef(block))
        .find((ref) => isNonEmptyString(ref)) || ""
    : "";
  const targetRef = bodyImageRef || heroRef || coverRef || fallbackImageRef || "";

  if (!heroRef && isNonEmptyString(targetRef)) {
    patch.heroImage = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: targetRef,
      },
    };
  }

  if (!coverRef && isNonEmptyString(targetRef)) {
    patch.coverImage = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: targetRef,
      },
    };
  }

  return patch;
}

function hasPatch(patch) {
  return Object.keys(patch).length > 0;
}

async function runProjectBackfill() {
  const projects = await client.fetch(PROJECT_QUERY);
  const patches = projects
    .map((project) => ({
      id: project._id,
      slug: project.slug,
      title: project.title,
      patch: buildProjectPatch(project),
    }))
    .filter((entry) => hasPatch(entry.patch));

  if (IS_DRY_RUN) {
    return { count: patches.length, patches };
  }

  for (const entry of patches) {
    await client.patch(entry.id).set(entry.patch).commit();
    console.log(`Updated project: ${entry.title} (${entry.slug})`);
  }

  return { count: patches.length, patches: [] };
}

async function runJournalBackfill() {
  const [articles, fallbackImageRef] = await Promise.all([
    client.fetch(JOURNAL_QUERY),
    client.fetch(FALLBACK_JOURNAL_IMAGE_QUERY),
  ]);

  const patches = articles
    .map((article) => ({
      id: article._id,
      slug: article.slug,
      title: article.title,
      patch: buildJournalPatch(article, fallbackImageRef),
    }))
    .filter((entry) => hasPatch(entry.patch));

  if (IS_DRY_RUN) {
    return { count: patches.length, fallbackImageRef, patches };
  }

  for (const entry of patches) {
    await client.patch(entry.id).set(entry.patch).commit();
    console.log(`Updated journal article: ${entry.title} (${entry.slug})`);
  }

  return { count: patches.length, fallbackImageRef, patches: [] };
}

async function main() {
  const summary = {};

  if (!JOURNAL_ONLY) {
    summary.projects = await runProjectBackfill();
  }

  if (!PROJECTS_ONLY) {
    summary.journal = await runJournalBackfill();
  }

  if (IS_DRY_RUN) {
    console.log(JSON.stringify({ dryRun: true, summary }, null, 2));
    return;
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
