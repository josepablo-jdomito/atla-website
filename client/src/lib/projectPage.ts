/**
 * Project page data: the API fetch, the view model and the media sequence.
 * Shared by the v2 Project page and the legacy AtlaProject page (removed in Task 12),
 * so both render the same media in the same order with the same SEO head.
 */
import type { Project, ProjectMediaAsset, ProjectVideoAsset } from "@shared/schema";
import { getOptimizedImageUrl, sanitizeImageUrls } from "@shared/imageDelivery";
import { formatMetaTitle, ORGANIZATION_LOGO_URL, ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";
import {
  buildProjectBreadcrumb,
  buildProjectMetaDescription,
  cleanProjectSummary,
  getNextProject,
  projectBodySections,
} from "@/lib/projectSeo";
import { creativeWorkSchema } from "@/lib/seoSchema";

/** Stand-in hero when a project has no image at all. */
export const PROJECT_PLACEHOLDER_IMAGE = "/figmaAssets/media.png";

export type ProjectApi = Project & {
  country?: string | null;
  locationName?: string | null;
  videoFiles?: ProjectVideoAsset[];
  mediaItems?: ProjectMediaAsset[];
};

export function fetchProject(slug: string) {
  return async () => {
    const res = await fetch(`/api/projects/${slug}`, { credentials: "include" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch project");
    return (await res.json()) as ProjectApi;
  };
}

export type ProjectPageView = {
  slug: string;
  title: string;
  client: string;
  region: string;
  country: string;
  locationName: string;
  services: string[];
  category: string;
  dateLabel: string;
  intro: string;
  bodySections: string[];
  heroImage: string;
  storyImage?: string;
  gallery: string[];
  videos: string[];
  videoFiles: ProjectVideoAsset[];
  mediaItems: ProjectMediaAsset[];
  credits: Array<{ role: string; names: string[] }>;
  related: Array<{ slug: string; title: string; date: string }>;
  nextProject: { slug: string; title: string } | null;
};

export type ProjectGalleryItem = {
  type: "image";
  src: string;
  sourceIndex: number;
};

export type ProjectUploadedVideoMediaItem = {
  type: "video";
  src: string;
  title?: string;
  mimeType?: string;
  poster?: string;
};

export type ProjectVimeoMediaItem = {
  type: "vimeo";
  src: string;
  title?: string;
};

export type ProjectMediaMosaicItem = ProjectGalleryItem | ProjectUploadedVideoMediaItem | ProjectVimeoMediaItem;

export function getProjectFullscreenImages(project: ProjectPageView) {
  return Array.from(new Set([
    project.heroImage,
    ...project.gallery,
    ...project.mediaItems
      .filter((item): item is Extract<ProjectMediaAsset, { type: "image" }> => item.type === "image")
      .map((item) => item.url),
  ].filter(Boolean)));
}

/** Vimeo honors dnt=1 by not tracking viewers or setting analytics cookies; the privacy policy relies on it. */
function withVimeoDoNotTrack(embedUrl: string) {
  try {
    const parsed = new URL(embedUrl);
    parsed.searchParams.set("dnt", "1");
    return parsed.toString();
  } catch {
    return embedUrl;
  }
}

export function toVimeoEmbedUrl(url: string) {
  const resolved = resolveVimeoEmbedUrl(url);
  return resolved ? withVimeoDoNotTrack(resolved) : resolved;
}

function resolveVimeoEmbedUrl(url: string) {
  const value = url.trim().replace(/&amp;/gi, "&");
  const iframeSrc = value.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1]?.trim();
  const source = (iframeSrc || value).replace(/^\/\//, "https://");

  try {
    const parsed = new URL(
      /^https?:\/\//i.test(source) ? source : `https://${source.replace(/^\/+/, "")}`,
    );
    const host = parsed.hostname.toLowerCase();

    if (host.includes("player.vimeo.com")) {
      const match = parsed.pathname.match(/\/video\/(\d+)/i);
      if (!match) return null;
      return `https://player.vimeo.com/video/${match[1]}${parsed.search}${parsed.hash}`;
    }

    if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
      const match = parsed.pathname.match(/\/(\d+)(?:$|\/)/i) || parsed.pathname.match(/\/(\d+)\b/i);
      if (match) return `https://player.vimeo.com/video/${match[1]}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // fall through to regex fallback
  }

  const playerMatch = source.match(/player\.vimeo\.com\/video\/(\d+)(\?[^"'\s>]*)?/i);
  if (playerMatch) return `https://player.vimeo.com/video/${playerMatch[1]}${playerMatch[2] || ""}`;

  const directMatch = source.match(/vimeo\.com\/(?:.*\/)?(\d+)/i);
  if (directMatch) return `https://player.vimeo.com/video/${directMatch[1]}`;

  return null;
}

export function toVimeoWatchUrl(embedUrl: string) {
  const match = embedUrl.match(/player\.vimeo\.com\/video\/(\d+)/i);
  if (!match) return "https://vimeo.com";
  return `https://vimeo.com/${match[1]}`;
}

export function toVimeoBackgroundUrl(embedUrl: string) {
  try {
    const parsed = new URL(embedUrl);
    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("muted", "1");
    parsed.searchParams.set("loop", "1");
    parsed.searchParams.set("background", "1");
    parsed.searchParams.set("controls", "0");
    parsed.searchParams.set("playsinline", "1");
    return parsed.toString();
  } catch {
    return embedUrl;
  }
}

function sanitizeMediaUrl(src?: string | null) {
  if (!src || typeof src !== "string") return "";
  const trimmed = src.trim();
  if (!trimmed || /^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return trimmed;
  return "";
}

function normalizeProjectVideoFiles(videos?: ProjectVideoAsset[]) {
  if (!Array.isArray(videos)) return [];

  const byUrl = new Map<string, ProjectVideoAsset>();
  for (const video of videos) {
    const url = sanitizeMediaUrl(video.url);
    if (!url || byUrl.has(url)) continue;

    const poster = sanitizeImageUrls([video.poster])[0];
    byUrl.set(url, {
      url,
      title: video.title?.trim() || undefined,
      caption: video.caption?.trim() || undefined,
      mimeType: video.mimeType?.trim() || undefined,
      poster,
    });
  }

  return Array.from(byUrl.values());
}

function normalizeProjectMediaItems(mediaItems?: ProjectMediaAsset[]) {
  if (!Array.isArray(mediaItems)) return [];

  const items: ProjectMediaAsset[] = [];
  const seen = new Set<string>();
  for (const item of mediaItems) {
    const url = sanitizeMediaUrl(item.url);
    if (!url) continue;

    const key = `${item.type}:${url}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (item.type === "video") {
      items.push({
        type: "video",
        url,
        title: item.title?.trim() || undefined,
        caption: item.caption?.trim() || undefined,
        mimeType: item.mimeType?.trim() || undefined,
        poster: sanitizeImageUrls([item.poster])[0],
      });
      continue;
    }

    const imageUrl = sanitizeImageUrls([url])[0];
    if (!imageUrl) continue;
    items.push({
      type: "image",
      url: imageUrl,
      title: item.title?.trim() || undefined,
      caption: item.caption?.trim() || undefined,
    });
  }

  return items;
}

export function buildProjectPageView(project: ProjectApi, allProjects: ProjectApi[]): ProjectPageView {
  const client = project.client === "Confidential" ? "" : project.client;
  const category = project.category === "Uncategorized" ? "" : project.category;
  const region = project.region;
  const country = project.country || "";
  const locationName = project.locationName || "";
  const bodySections = projectBodySections(
    project.body,
    [project.title, project.client],
    allProjects.filter((item) => item.slug !== project.slug).map((item) => item.title),
  );
  // "Unspecified" is the import's fallback for an untagged project, not a service.
  const services = project.tags.filter((tag) => Boolean(tag) && tag.trim().toLowerCase() !== "unspecified");
  const imageGallery = sanitizeImageUrls(project.images);
  const heroImage = sanitizeImageUrls([project.coverImage, ...imageGallery])[0] || PROJECT_PLACEHOLDER_IMAGE;
  const gallery = imageGallery.length > 0 ? imageGallery : [heroImage];
  const related = allProjects
    .filter((item) => item.slug !== project.slug)
    .sort((left, right) => {
      const leftScore =
        Number(left.category === project.category) * 3 +
        Number(left.client === project.client) * 2 +
        Math.max(0, 3 - Math.abs(left.year - project.year));
      const rightScore =
        Number(right.category === project.category) * 3 +
        Number(right.client === project.client) * 2 +
        Math.max(0, 3 - Math.abs(right.year - project.year));
      return rightScore - leftScore;
    })
    .slice(0, 6)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      date: String(item.year),
    }));

  return {
    slug: project.slug,
    title: project.title,
    client,
    region,
    country,
    locationName,
    services,
    category,
    dateLabel: String(project.year),
    intro: cleanProjectSummary(project.description),
    bodySections,
    heroImage,
    storyImage: project.images[1] || heroImage,
    gallery,
    videos: project.videos.filter(Boolean),
    videoFiles: normalizeProjectVideoFiles(project.videoFiles),
    mediaItems: normalizeProjectMediaItems(project.mediaItems),
    credits: [
      ...(client ? [{ role: "Client", names: [client] }] : []),
      ...(region ? [{ role: "Region", names: [region] }] : []),
      ...(country ? [{ role: "Country", names: [country] }] : []),
      ...(locationName ? [{ role: "Location", names: [locationName] }] : []),
      ...(category ? [{ role: "Category", names: [category] }] : []),
      ...(services.length > 0 ? [{ role: "Service", names: services }] : []),
    ],
    related,
    nextProject: (() => {
      const next = getNextProject(allProjects, project.slug);
      return next ? { slug: next.slug, title: next.title } : null;
    })(),
  };
}

/** Vimeo URLs from `videos`, as privacy-safe embed URLs plus their watch pages. */
export function projectVimeoEmbeds(project: ProjectPageView) {
  return project.videos
    .map((videoUrl) => {
      const embedUrl = toVimeoEmbedUrl(videoUrl);
      if (!embedUrl) return null;
      return {
        embedUrl,
        watchUrl: toVimeoWatchUrl(embedUrl),
      };
    })
    .filter((video): video is { embedUrl: string; watchUrl: string } => Boolean(video));
}

/**
 * The gallery after the hero, in order. When the project has an explicit media sequence
 * (`mediaItems`) it wins; otherwise images interleave with uploaded videos and Vimeo embeds,
 * one of each after each image, and the leftovers trail at the end.
 */
export function projectMediaSequence(project: ProjectPageView): ProjectMediaMosaicItem[] {
  const fullscreenImages = getProjectFullscreenImages(project);
  const galleryStream: ProjectMediaMosaicItem[] = fullscreenImages
    .map((src, sourceIndex) => ({ type: "image" as const, src, sourceIndex }))
    .filter(({ src, sourceIndex }) => !(sourceIndex === 0 && src === project.heroImage));
  const videoEmbeds = projectVimeoEmbeds(project);
  const uploadedVideos = project.videoFiles;

  const mediaItemsFromSequence = project.mediaItems.flatMap((item): ProjectMediaMosaicItem[] => {
    if (item.type === "video") {
      return [{
        type: "video" as const,
        src: item.url,
        title: item.title,
        mimeType: item.mimeType,
        poster: item.poster,
      }];
    }

    const sourceIndex = fullscreenImages.indexOf(item.url);
    if (sourceIndex < 0 || item.url === project.heroImage) return [];
    return [{ type: "image" as const, src: item.url, sourceIndex }];
  });
  if (mediaItemsFromSequence.length > 0) return mediaItemsFromSequence;

  const fallbackMediaItems = galleryStream.reduce<ProjectMediaMosaicItem[]>((items, imageItem, index) => {
    items.push(imageItem);
    const video = uploadedVideos[index];
    if (video) {
      items.push({
        type: "video",
        src: video.url,
        title: video.title,
        mimeType: video.mimeType,
        poster: video.poster,
      });
    }
    const vimeo = videoEmbeds[index];
    if (vimeo) {
      items.push({
        type: "vimeo",
        src: vimeo.embedUrl,
        title: `${project.title} Vimeo video ${index + 1}`,
      });
    }
    return items;
  }, []);
  uploadedVideos.slice(galleryStream.length).forEach((video) => {
    fallbackMediaItems.push({
      type: "video",
      src: video.url,
      title: video.title,
      mimeType: video.mimeType,
      poster: video.poster,
    });
  });
  videoEmbeds.slice(galleryStream.length).forEach((video, index) => {
    fallbackMediaItems.push({
      type: "vimeo",
      src: video.embedUrl,
      title: `${project.title} Vimeo video ${galleryStream.length + index + 1}`,
    });
  });
  return fallbackMediaItems;
}

/** Props for SeoHead on a project page. script/build.ts writes the prerendered head from the same builders. */
export function buildProjectSeoHead(project: ProjectPageView) {
  const description = buildProjectMetaDescription({
    title: project.title,
    client: project.client,
    category: project.category,
    services: project.services,
    description: project.intro,
  });
  const pathname = `/projects/${project.slug}`;
  const preloadImages = [
    getOptimizedImageUrl(project.heroImage, { width: 960, quality: 88 }) || project.heroImage,
    getOptimizedImageUrl(project.heroImage, { width: 1600, quality: 92 }) || project.heroImage,
    project.gallery[0]
      ? getOptimizedImageUrl(project.gallery[0], { width: 1400, quality: 90 }) || project.gallery[0]
      : null,
    project.gallery[1]
      ? getOptimizedImageUrl(project.gallery[1], { width: 1400, quality: 90 }) || project.gallery[1]
      : null,
  ].filter((src): src is string => Boolean(src));
  const parsedYear = Number.parseInt(project.dateLabel, 10);
  const videoUploadDate = Number.isFinite(parsedYear) ? `${parsedYear}-01-01T00:00:00.000Z` : undefined;
  const uploadedVideos = project.videoFiles;
  const videoEmbeds = projectVimeoEmbeds(project);
  const creativeWork = creativeWorkSchema({
    slug: project.slug,
    title: project.title,
    description,
    heroImage: project.heroImage,
    gallery: project.gallery,
    year: project.dateLabel,
    industry: project.category,
    client: project.client,
    region: project.region,
    services: project.services,
  });
  const videoPublisherSchema = {
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: SITE_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: ORGANIZATION_LOGO_URL,
    },
  };
  const videoStructuredData: Array<Record<string, unknown>> = [
    ...uploadedVideos.map((video, index) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: video.title || `${project.title} video ${index + 1}`,
      description: video.caption || `${project.title} case study video ${index + 1} from Atla.`,
      mainEntityOfPage: `${SITE_ORIGIN}${pathname}`,
      contentUrl: video.url,
      url: video.url,
      thumbnailUrl: video.poster || project.gallery[index] || project.heroImage,
      uploadDate: videoUploadDate,
      inLanguage: "en",
      isFamilyFriendly: true,
      publisher: videoPublisherSchema,
    })),
    ...videoEmbeds.map((video, index) => {
      const videoIndex = uploadedVideos.length + index;
      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${project.title} video ${videoIndex + 1}`,
        description: `${project.title} case study video ${videoIndex + 1} from Atla.`,
        mainEntityOfPage: `${SITE_ORIGIN}${pathname}`,
        embedUrl: video.embedUrl,
        contentUrl: video.watchUrl,
        url: video.watchUrl,
        thumbnailUrl: project.gallery[videoIndex] || project.heroImage,
        uploadDate: videoUploadDate,
        inLanguage: "en",
        isFamilyFriendly: true,
        publisher: videoPublisherSchema,
      };
    }),
  ];

  return {
    title: formatMetaTitle(`${project.title}${project.category ? ` ${project.category}` : ""} Case Study`, "Atla"),
    description,
    pathname,
    image: project.heroImage,
    preloadImages,
    structuredData: [creativeWork, buildProjectBreadcrumb(project), ...videoStructuredData],
    videoStructuredData,
  };
}

export type ProjectCredit = { role: string; names: string[] };

/**
 * The project's team credits, when the API sends them (`credits: [{ role, names | name }]`).
 * Empty when it does not; the page then shows its one fallback row.
 */
export function projectCredits(project: ProjectApi | null | undefined): ProjectCredit[] {
  const raw = (project as { credits?: unknown } | null | undefined)?.credits;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry): ProjectCredit[] => {
    if (!entry || typeof entry !== "object") return [];
    const record = entry as { role?: unknown; names?: unknown; name?: unknown };
    const role = typeof record.role === "string" ? record.role.trim() : "";
    const names = (Array.isArray(record.names) ? record.names : [record.name])
      .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
      .map((name) => name.trim());
    return role && names.length > 0 ? [{ role, names }] : [];
  });
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "Oct 2025" when a real month is known, else "2025". The API's `createdAt` is the request time
 * (server/sanity/projectService.ts sets `new Date()`), not the project's date, so it is never read:
 * a month only shows when `month` (1–12) comes from a real Sanity date.
 */
export function projectDateLabel(year: number | string | null | undefined, month?: number | null) {
  const y = Number.parseInt(String(year ?? ""), 10);
  if (!(y > 0)) return "";
  return month && month >= 1 && month <= 12 ? `${MONTHS[month - 1]} ${y}` : String(y);
}
