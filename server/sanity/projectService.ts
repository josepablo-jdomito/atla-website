import type { Project } from "../../shared/schema.ts";
import { getJournalSanityClient, isJournalSanityConfigured } from "./journalClient.ts";

type SanityProject = {
  _id: string;
  slug: string;
  title: string;
  client?: unknown;
  clientName?: unknown;
  brand?: unknown;
  year: string | number | null;
  category?: unknown;
  industry?: unknown;
  region?: unknown;
  country?: unknown;
  locationName?: unknown;
  location?: unknown;
  market?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  categoryTitle?: unknown;
  projectType?: unknown;
  discipline?: unknown;
  tags?: unknown;
  keywords?: unknown;
  service?: unknown;
  services?: unknown;
  vimeoVideos?: unknown;
  videos?: unknown;
  description?: unknown;
  excerpt?: unknown;
  summary?: unknown;
  body?: unknown;
  content?: unknown;
  caseStudy?: unknown;
  featured: boolean;
  status?: string;
  coverImage?: string;
  gallery?: string[];
};

type FacetSourceProject = {
  slug?: unknown;
  industry?: unknown;
  category?: unknown;
  categoryTitle?: unknown;
  projectType?: unknown;
  discipline?: unknown;
  tags?: unknown;
  keywords?: unknown;
  service?: unknown;
  services?: unknown;
};

type SanityProjectAuditSource = {
  _id: string;
  slug: string;
  title: string;
  client?: unknown;
  clientName?: unknown;
  brand?: unknown;
  year: string | number | null;
  category?: unknown;
  industry?: unknown;
  region?: unknown;
  country?: unknown;
  locationName?: unknown;
  location?: unknown;
  market?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  categoryTitle?: unknown;
  projectType?: unknown;
  discipline?: unknown;
  tags: unknown;
  keywords?: unknown;
  service?: unknown;
  services?: unknown;
  vimeoVideos?: unknown;
  videos?: unknown;
  body?: unknown;
  content?: unknown;
  caseStudy?: unknown;
  coverImage?: string;
  gallery?: string[];
};

export type PortfolioProjectAuditItem = {
  id: string;
  slug: string;
  title: string;
  galleryCount: number;
  tagCount: number;
  missing: {
    coverImage: boolean;
    galleryImages: boolean;
    bodyText: boolean;
    tags: boolean;
    year: boolean;
    category: boolean;
    client: boolean;
  };
};

export type PortfolioProjectAuditReport = {
  totalProjects: number;
  missing: {
    coverImage: string[];
    galleryImages: string[];
    bodyText: string[];
    tags: string[];
    year: string[];
    category: string[];
    client: string[];
  };
  projects: PortfolioProjectAuditItem[];
};

const PROJECT_QUERY = `
  *[_type == "project" && defined(slug.current)] | order(coalesce(featured, featuredOnHomepage, false) desc, coalesce(year, _createdAt) desc, _createdAt desc) {
    _id,
    "slug": slug.current,
    "title": coalesce(title, name, "Untitled project"),
    client,
    clientName,
    brand,
    "year": coalesce(year, publishedAt, _createdAt),
    category,
    industry,
    region,
    country,
    locationName,
    location,
    market,
    "latitude": coalesce(coordinates.lat, geoPoint.lat, null),
    "longitude": coalesce(coordinates.lng, geoPoint.lng, null),
    "categoryTitle": category->title,
    projectType,
    discipline,
    tags,
    keywords,
    service,
    services,
    vimeoVideos,
    videos,
    description,
    excerpt,
    summary,
    body,
    content,
    caseStudy,
    "featured": coalesce(featured, featuredOnHomepage, false),
    "status": status,
    "coverImage": coalesce(coverImage.asset->url, mainImage.asset->url, heroImage.asset->url, thumbnail.asset->url),
    "gallery": array::unique(array::compact([
      ...coalesce(gallery, [])[].asset->url,
      ...coalesce(images, [])[].asset->url,
      ...coalesce(galleryImages, [])[].asset->url,
      ...coalesce(body, [])[ _type == "image" ].asset->url,
      ...coalesce(content, [])[ _type == "image" ].asset->url,
      ...coalesce(caseStudy, [])[ _type == "image" ].asset->url
    ]))
  }
`;

const PROJECT_AUDIT_QUERY = `
  *[_type == "project" && defined(slug.current)] | order(coalesce(featured, featuredOnHomepage, false) desc, coalesce(year, _createdAt) desc, _createdAt desc) {
    _id,
    "slug": slug.current,
    "title": coalesce(title, name, "Untitled project"),
    client,
    clientName,
    brand,
    year,
    category,
    industry,
    region,
    country,
    locationName,
    location,
    market,
    "latitude": coalesce(coordinates.lat, geoPoint.lat, null),
    "longitude": coalesce(coordinates.lng, geoPoint.lng, null),
    "categoryTitle": category->title,
    projectType,
    discipline,
    tags,
    keywords,
    service,
    services,
    vimeoVideos,
    videos,
    body,
    content,
    caseStudy,
    "coverImage": coalesce(coverImage.asset->url, mainImage.asset->url, heroImage.asset->url, thumbnail.asset->url),
    "gallery": array::unique(array::compact([
      ...coalesce(gallery, [])[].asset->url,
      ...coalesce(images, [])[].asset->url,
      ...coalesce(galleryImages, [])[].asset->url,
      ...coalesce(body, [])[ _type == "image" ].asset->url,
      ...coalesce(content, [])[ _type == "image" ].asset->url,
      ...coalesce(caseStudy, [])[ _type == "image" ].asset->url
    ]))
  }
`;

const INDUSTRY_ORDER = [
  "Hospitality",
  "Food & Beverage",
  "Consumer Goods",
  "SaaS",
  "Digital",
] as const;

const SERVICE_ORDER = [
  "Branding",
  "Art Direction",
  "Packaging",
  "Website",
] as const;

// Temporary source-of-truth guardrails for projects that still have incomplete facet data in Sanity.
// Keep this list minimal and remove entries once fields are fully populated in CMS.
const INDUSTRY_OVERRIDES_BY_SLUG: Record<string, (typeof INDUSTRY_ORDER)[number]> = {
  "pax-and-beneficia": "Food & Beverage",
  "angeles-wellness": "Consumer Goods",
  "the-bridge": "Hospitality",
  "conscious-care-co": "Consumer Goods",
};

const TAG_CASE_OVERRIDES: Record<string, string> = {
  branding: "Branding",
  "art direction": "Art Direction",
  packaging: "Packaging",
  website: "Website",
  hospitality: "Hospitality",
  "food & beverage": "Food & Beverage",
  "consumer goods": "Consumer Goods",
  saas: "SaaS",
  digital: "Digital",
  editorial: "Editorial",
};

const INDUSTRY_KEYWORDS: Record<(typeof INDUSTRY_ORDER)[number], string[]> = {
  Hospitality: [
    "hospitality",
    "hotel",
    "resort",
    "travel",
    "boutique hotel",
  ],
  "Food & Beverage": [
    "food",
    "beverage",
    "f&b",
    "cafe",
    "coffee",
    "restaurant",
    "bar",
    "tequila",
    "gin",
    "liquor",
    "spirits",
    "fine dining",
    "sake",
  ],
  "Consumer Goods": [
    "consumer goods",
    "cpg",
    "d2c",
    "beauty",
    "wellness",
    "supplement",
    "apparel",
    "fashion",
    "kids",
    "retail",
    "lifestyle",
    "accessories",
    "packaging",
  ],
  SaaS: [
    "saas",
    "software",
    "platform",
    "ai",
    "health-tech",
    "health tech",
    "b2b",
    "b2c",
  ],
  Digital: [
    "digital",
    "website",
    "web",
    "digital product",
    "ui",
    "ux",
    "app",
    "e-commerce",
    "ecommerce",
  ],
};

const SERVICE_KEYWORDS: Record<(typeof SERVICE_ORDER)[number], string[]> = {
  Branding: [
    "brand",
    "branding",
    "identity",
    "strategy",
    "positioning",
    "naming",
    "copywriting",
  ],
  "Art Direction": [
    "art direction",
    "creative direction",
    "editorial",
    "photography",
    "render",
  ],
  Packaging: [
    "packaging",
    "label",
    "bottle",
    "box",
    "dieline",
  ],
  Website: [
    "website",
    "web",
    "digital product",
    "ui",
    "ux",
    "app",
    "landing page",
    "e-commerce",
    "ecommerce",
  ],
};

export async function fetchProjectsFromSanity(options?: { featured?: boolean }) {
  if (!isJournalSanityConfigured()) return [];

  const client = getJournalSanityClient();
  const projects = await client.fetch<SanityProject[]>(PROJECT_QUERY);

  return projects
    .filter((project) => (options?.featured ? project.featured : true))
    .map(normalizeProject);
}

export async function fetchProjectBySlugOrIdFromSanity(slugOrId: string) {
  const projects = await fetchProjectsFromSanity();
  return projects.find((project) => project.slug === slugOrId || project.id === slugOrId);
}

export function normalizeProjectFacetsForApi<T extends FacetSourceProject & Record<string, unknown>>(project: T) {
  const facetValues = deriveFacetValues(project);
  return {
    ...project,
    ...facetValues,
  };
}

export function isProjectSanityConfigured() {
  return isJournalSanityConfigured();
}

export async function fetchPortfolioProjectAuditFromSanity(): Promise<PortfolioProjectAuditReport> {
  if (!isJournalSanityConfigured()) {
    return emptyPortfolioProjectAudit();
  }

  const client = getJournalSanityClient();
  const projects = await client.fetch<SanityProjectAuditSource[]>(PROJECT_AUDIT_QUERY);

  return buildPortfolioProjectAudit(projects);
}

export function buildPortfolioProjectAudit(
  projects: SanityProjectAuditSource[],
): PortfolioProjectAuditReport {
  const missing = {
    coverImage: [] as string[],
    galleryImages: [] as string[],
    bodyText: [] as string[],
    tags: [] as string[],
    year: [] as string[],
    category: [] as string[],
    client: [] as string[],
  };

  const items = projects.map((project) => {
    const slug = project.slug;
    const gallery = Array.isArray(project.gallery)
      ? project.gallery.filter(isNonEmptyString)
      : [];
    const tags = normalizeTagValues([
      ...extractStringList(project.industry),
      ...extractStringList(project.tags),
      ...extractStringList(project.keywords),
      ...extractStringList(project.services, project.service),
    ]);
    const category = firstNonEmptyString(
      project.categoryTitle,
      project.category,
      project.projectType,
      project.discipline,
    );
    const client = firstNonEmptyString(project.client, project.clientName, project.brand);
    const missingFields = {
      coverImage: !isNonEmptyString(project.coverImage),
      galleryImages: gallery.length === 0,
      bodyText: !hasBodyContent(project.body ?? project.content ?? project.caseStudy),
      tags: tags.length === 0,
      year: !hasYearValue(project.year),
      category: !isNonEmptyString(category),
      client: !isNonEmptyString(client),
    };

    if (missingFields.coverImage) missing.coverImage.push(slug);
    if (missingFields.galleryImages) missing.galleryImages.push(slug);
    if (missingFields.bodyText) missing.bodyText.push(slug);
    if (missingFields.tags) missing.tags.push(slug);
    if (missingFields.year) missing.year.push(slug);
    if (missingFields.category) missing.category.push(slug);
    if (missingFields.client) missing.client.push(slug);

    return {
      id: project._id,
      slug,
      title: project.title,
      galleryCount: gallery.length,
      tagCount: tags.length,
      missing: missingFields,
    };
  });

  return {
    totalProjects: items.length,
    missing,
    projects: items,
  };
}

function normalizeProject(project: SanityProject): Project {
  const client = firstNonEmptyString(project.client, project.clientName, project.brand);
  const category = firstNonEmptyString(
    project.categoryTitle,
    project.category,
    project.projectType,
    project.discipline,
  );
  const { industry, service: primaryService, services, tags } = deriveFacetValues({
    industry: project.industry,
    category: project.category,
    categoryTitle: project.categoryTitle,
    projectType: project.projectType,
    discipline: project.discipline,
    tags: project.tags,
    keywords: project.keywords,
    service: project.service,
    services: project.services,
  });
  const region = firstNonEmptyString(project.region, project.location, project.market) || "America";
  const country = firstNonEmptyString(project.country);
  const videos = extractVimeoEmbedSources(project.vimeoVideos, project.videos);
  const description = firstNonEmptyString(project.description, project.excerpt, project.summary);
  const body = portableTextToPlainText(project.body ?? project.content ?? project.caseStudy);
  const locationName = firstNonEmptyString(
    project.locationName,
    project.location,
    project.market,
  ) || "";
  const latitude = normalizeCoordinate(project.latitude) ?? null;
  const longitude = normalizeCoordinate(project.longitude) ?? null;

  return {
    id: project._id,
    slug: project.slug,
    title: project.title,
    client: client || "Confidential",
    year: normalizeYear(project.year),
    category: category || "Uncategorized",
    region,
    country,
    industry,
    service: primaryService,
    services,
    tags,
    description: description || "",
    body,
    coverImage: project.coverImage || "",
    images: Array.isArray(project.gallery) ? project.gallery.filter(isNonEmptyString) : [],
    videos,
    featured: Boolean(project.featured),
    status: project.status === "draft" ? "draft" : "published",
    createdAt: new Date(),
    locationName,
    latitude,
    longitude,
  } as Project;
}

function normalizeTagValues(values: string[]) {
  return uniqueCaseInsensitive(values.map(normalizeTagValue).filter(isNonEmptyString));
}

function deriveFacetValues(project: FacetSourceProject) {
  const slug = firstNonEmptyString(project.slug)?.toLowerCase() || "";
  const rawTagCandidates = [
    ...extractStringList(project.tags),
    ...extractStringList(project.keywords),
  ];
  const normalizedTags = normalizeTagValues([
    ...extractStringList(project.industry),
    ...rawTagCandidates,
    ...extractStringList(project.services, project.service),
  ]);
  const industry = resolveIndustry([
    ...extractStringList(
      project.industry,
      project.categoryTitle,
      project.category,
      project.projectType,
      project.discipline,
    ),
    ...normalizedTags,
  ]) || INDUSTRY_OVERRIDES_BY_SLUG[slug] || "Unspecified";
  const services = resolveServices([
    ...extractStringList(project.services, project.service),
    ...normalizedTags,
    ...extractStringList(project.categoryTitle, project.category, project.projectType, project.discipline),
  ]);
  const service =
    resolvePrimaryService(extractStringList(project.service), services) ||
    services[0] ||
    "Unspecified";
  const tags = normalizeTagValues([
    ...normalizedTags,
    ...(industry ? [industry] : []),
    ...services,
  ]);

  return {
    industry,
    service,
    services,
    tags,
  };
}

function normalizeTagValue(value: string) {
  const compact = normalizeWhitespace(value);
  if (!compact) return "";
  const override = TAG_CASE_OVERRIDES[compact.toLowerCase()];
  return override || compact;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function uniqueCaseInsensitive(values: string[]) {
  const byLower = new Map<string, string>();
  for (const value of values) {
    const normalized = normalizeWhitespace(value);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (!byLower.has(key)) byLower.set(key, normalized);
  }
  return Array.from(byLower.values());
}

function splitFacetCandidate(rawValue: string) {
  return normalizeWhitespace(rawValue)
    .split(/[•·,|/]+/)
    .map((chunk) => normalizeWhitespace(chunk))
    .filter(Boolean);
}

function resolveIndustry(candidates: string[]) {
  const normalizedCandidates = uniqueCaseInsensitive(
    candidates.flatMap(splitFacetCandidate),
  );
  if (normalizedCandidates.length === 0) return "";

  for (const industry of INDUSTRY_ORDER) {
    const exact = normalizedCandidates.find(
      (candidate) => candidate.toLowerCase() === industry.toLowerCase(),
    );
    if (exact) return industry;
  }

  const scores = INDUSTRY_ORDER.map((industry) => {
    const keywords = INDUSTRY_KEYWORDS[industry];
    const score = normalizedCandidates.reduce((total, candidate) => {
      const lowered = candidate.toLowerCase();
      return total + (keywords.some((keyword) => lowered.includes(keyword)) ? 1 : 0);
    }, 0);
    return { industry, score };
  });

  const best = scores.sort((left, right) => right.score - left.score)[0];
  if (best && best.score > 0) return best.industry;

  return "";
}

function resolveServices(candidates: string[]) {
  const normalizedCandidates = uniqueCaseInsensitive(
    candidates.flatMap(splitFacetCandidate),
  );
  if (normalizedCandidates.length === 0) return [];

  const scored = SERVICE_ORDER.map((serviceName) => {
    const serviceKey = serviceName.toLowerCase();
    const keywords = SERVICE_KEYWORDS[serviceName];
    const score = normalizedCandidates.reduce((total, candidate) => {
      const lowered = candidate.toLowerCase();
      if (lowered === serviceKey) return total + 4;
      if (keywords.some((keyword) => lowered === keyword)) return total + 2;
      if (keywords.some((keyword) => lowered.includes(keyword))) return total + 1;
      return total;
    }, 0);

    return { serviceName, score };
  })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  return scored.map((item) => item.serviceName);
}

function resolvePrimaryService(directCandidates: string[], services: string[]) {
  const normalizedDirect = uniqueCaseInsensitive(directCandidates.flatMap(splitFacetCandidate));
  for (const candidate of normalizedDirect) {
    const matched = services.find((serviceName) => serviceName.toLowerCase() === candidate.toLowerCase());
    if (matched) return matched;
  }
  return services[0] || normalizedDirect[0] || "";
}

function extractVimeoEmbedSources(...values: unknown[]) {
  const sources = values.flatMap((value) => normalizeStringListValue(value));
  const embeds = sources
    .map((source) => toVimeoEmbedUrl(source))
    .filter(isNonEmptyString);

  return Array.from(new Set(embeds));
}

function toVimeoEmbedUrl(value: string) {
  const raw = value.trim().replace(/&amp;/gi, "&");
  if (!raw) return "";

  const iframeSrc = raw.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1]?.trim();
  const candidate = (iframeSrc || raw).replace(/^\/\//, "https://");

  try {
    const parsed = new URL(
      /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate.replace(/^\/+/, "")}`,
    );
    const host = parsed.hostname.toLowerCase();

    if (host.includes("player.vimeo.com")) {
      const match = parsed.pathname.match(/\/video\/(\d+)/i);
      if (!match) return "";
      return `https://player.vimeo.com/video/${match[1]}${parsed.search}${parsed.hash}`;
    }

    if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
      const match = parsed.pathname.match(/\/(\d+)(?:$|\/)/i) || parsed.pathname.match(/\/(\d+)\b/i);
      if (match) return `https://player.vimeo.com/video/${match[1]}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // fall through to regex fallback
  }

  const playerMatch = candidate.match(/player\.vimeo\.com\/video\/(\d+)(\?[^"'\s>]*)?/i);
  if (playerMatch) return `https://player.vimeo.com/video/${playerMatch[1]}${playerMatch[2] || ""}`;

  const directMatch = candidate.match(/vimeo\.com\/(?:.*\/)?(\d+)/i);
  if (directMatch) return `https://player.vimeo.com/video/${directMatch[1]}`;

  return "";
}

function normalizeYear(value: string | number | null) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const direct = Number.parseInt(value, 10);
    if (Number.isFinite(direct)) return direct;

    const parsed = new Date(value).getFullYear();
    if (Number.isFinite(parsed)) return parsed;
  }

  return new Date().getFullYear();
}

function hasYearValue(value: string | number | null) {
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

function normalizeCoordinate(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function hasBodyContent(value: unknown) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return portableTextToPlainText(value).trim().length > 0;
}

function extractStringList(...values: unknown[]) {
  return values.flatMap((value) => normalizeStringListValue(value)).filter(isNonEmptyString);
}

function normalizeStringListValue(value: unknown): string[] {
  if (isNonEmptyString(value)) {
    return [value.trim()];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (isNonEmptyString(item)) {
      return [item.trim()];
    }

    if (!item || typeof item !== "object") {
      return [];
    }

    return [
      getStringField(item, "url"),
      getStringField(item, "embedCode"),
      getStringField(item, "href"),
      getStringField(item, "title"),
      getStringField(item, "name"),
      getStringField(item, "label"),
      getStringField(item, "value"),
      getStringField(item, "current"),
    ].filter(isNonEmptyString);
  });
}

function firstNonEmptyString(...values: unknown[]) {
  for (const value of values) {
    if (isNonEmptyString(value)) {
      return value.trim();
    }

    if (value && typeof value === "object") {
      const nested = [
        getStringField(value, "title"),
        getStringField(value, "url"),
        getStringField(value, "href"),
        getStringField(value, "name"),
        getStringField(value, "label"),
        getStringField(value, "value"),
        getStringField(value, "current"),
      ].find(isNonEmptyString);

      if (nested) {
        return nested.trim();
      }
    }
  }

  return "";
}

function getStringField(value: object, key: string) {
  const record = value as Record<string, unknown>;
  return typeof record[key] === "string" ? record[key] : "";
}

function portableTextToPlainText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      if (!block || typeof block !== "object" || !("children" in block) || !Array.isArray(block.children)) {
        return "";
      }

      return block.children
        .map((child: unknown) => {
          if (!child || typeof child !== "object" || !("text" in child) || typeof child.text !== "string") {
            return "";
          }

          return child.text;
        })
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function emptyPortfolioProjectAudit(): PortfolioProjectAuditReport {
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
