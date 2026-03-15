import {
  fetchPortfolioProjectAuditFromSanity,
  type PortfolioProjectAuditItem,
  type PortfolioProjectAuditReport,
} from "../server/sanity/projectService.ts";

type ApiProject = {
  id?: string;
  slug?: string;
  title?: string;
  coverImage?: unknown;
  images?: unknown;
  body?: unknown;
  tags?: unknown;
  year?: unknown;
  category?: unknown;
  client?: unknown;
};

async function main() {
  const args = process.argv.slice(2);
  const apiUrl = readFlag(args, "--url");
  const useJson = args.includes("--json");

  const report = apiUrl
    ? await fetchPortfolioProjectAuditFromApi(apiUrl)
    : await fetchPortfolioProjectAuditFromSanity();

  if (!apiUrl && report.totalProjects === 0) {
    console.error(
      "No Sanity portfolio projects were returned. Set SANITY_JOURNAL_* env vars or pass --url <projects-api-url>.",
    );
    process.exitCode = 1;
    return;
  }

  if (useJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  printReport(apiUrl ? `api:${apiUrl}` : "sanity", report);
}

async function fetchPortfolioProjectAuditFromApi(
  apiUrl: string,
): Promise<PortfolioProjectAuditReport> {
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${apiUrl}: ${response.status} ${response.statusText}`);
  }

  const projects = (await response.json()) as ApiProject[];

  const report = createEmptyReport();
  const items: PortfolioProjectAuditItem[] = projects.map((project, index) => {
    const slug = asNonEmptyString(project.slug) || `project-${index + 1}`;
    const title = asNonEmptyString(project.title) || "Untitled project";
    const gallery = Array.isArray(project.images)
      ? project.images.filter(isNonEmptyString)
      : [];
    const tags = Array.isArray(project.tags)
      ? project.tags.filter(isNonEmptyString)
      : [];
    const missing = {
      coverImage: !isNonEmptyString(project.coverImage),
      galleryImages: gallery.length === 0,
      bodyText: !hasBodyContent(project.body),
      tags: tags.length === 0,
      year: !hasYearValue(project.year),
      category: !isNonEmptyString(project.category),
      client: !isNonEmptyString(project.client),
    };

    collectMissing(report, slug, missing);

    return {
      id: asNonEmptyString(project.id) || slug,
      slug,
      title,
      galleryCount: gallery.length,
      tagCount: tags.length,
      missing,
    };
  });

  report.totalProjects = items.length;
  report.projects = items;

  return report;
}

function printReport(sourceLabel: string, report: PortfolioProjectAuditReport) {
  console.log(`Portfolio audit source: ${sourceLabel}`);
  console.log(`Projects checked: ${report.totalProjects}`);
  console.log("");
  console.log(`Missing cover images: ${report.missing.coverImage.length}`);
  console.log(`Missing gallery images: ${report.missing.galleryImages.length}`);
  console.log(`Missing body text: ${report.missing.bodyText.length}`);
  console.log(`Missing tags: ${report.missing.tags.length}`);
  console.log(`Missing year: ${report.missing.year.length}`);
  console.log(`Missing category: ${report.missing.category.length}`);
  console.log(`Missing client: ${report.missing.client.length}`);

  printSlugList("coverImage", report.missing.coverImage);
  printSlugList("galleryImages", report.missing.galleryImages);
  printSlugList("bodyText", report.missing.bodyText);
  printSlugList("tags", report.missing.tags);
  printSlugList("year", report.missing.year);
  printSlugList("category", report.missing.category);
  printSlugList("client", report.missing.client);
}

function printSlugList(label: string, values: string[]) {
  if (values.length === 0) return;
  console.log("");
  console.log(`${label}: ${values.join(", ")}`);
}

function collectMissing(
  report: PortfolioProjectAuditReport,
  slug: string,
  missing: PortfolioProjectAuditItem["missing"],
) {
  if (missing.coverImage) report.missing.coverImage.push(slug);
  if (missing.galleryImages) report.missing.galleryImages.push(slug);
  if (missing.bodyText) report.missing.bodyText.push(slug);
  if (missing.tags) report.missing.tags.push(slug);
  if (missing.year) report.missing.year.push(slug);
  if (missing.category) report.missing.category.push(slug);
  if (missing.client) report.missing.client.push(slug);
}

function createEmptyReport(): PortfolioProjectAuditReport {
  return {
    totalProjects: 0,
    missing: {
      coverImage: [],
      galleryImages: [],
      bodyText: [],
      tags: [],
      year: [],
      category: [],
      client: [],
    },
    projects: [],
  };
}

function readFlag(args: string[], flag: string) {
  const index = args.indexOf(flag);
  if (index === -1) return null;

  const value = args[index + 1];
  if (!value) {
    throw new Error(`Missing value for ${flag}`);
  }

  return value;
}

function hasBodyContent(value: unknown) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (!Array.isArray(value)) {
    return false;
  }

  return value.some((block) => {
    if (!block || typeof block !== "object" || !("children" in block) || !Array.isArray(block.children)) {
      return false;
    }

    return block.children.some((child: unknown) => {
      return Boolean(
        child &&
        typeof child === "object" &&
        "text" in child &&
        typeof child.text === "string" &&
        child.text.trim().length > 0,
      );
    });
  });
}

function hasYearValue(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    if (value.trim().length === 0) return false;
    if (Number.isFinite(Number.parseInt(value, 10))) return true;
    return Number.isFinite(new Date(value).getTime());
  }

  return false;
}

function asNonEmptyString(value: unknown) {
  return isNonEmptyString(value) ? value : "";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
