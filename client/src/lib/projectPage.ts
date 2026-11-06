/**
 * Project page data: the API fetch, the view model and the media sequence.
 * Shared by the v2 Project page and the legacy AtlaProject page (removed in Task 12),
 * so both render the same media in the same order with the same SEO head.
 */
import type { Project, ProjectMediaAsset, ProjectVideoAsset } from "@shared/schema";
import { getOptimizedImageUrl, sanitizeImageUrls } from "@shared/imageDelivery";
import { resolveProjectFacets } from "@shared/projectFacets";
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

/**
 * The one line under the facets is one sentence (fix wave 3, finding 20); whatever follows it in the
 * description moves into the story. A description with no sentence end stays whole.
 */
export function splitLead(text: string): { line: string; rest: string } {
  const clean = text.trim();
  const match = clean.match(/^(.+?[.!?])(?:["')\]]*)\s+(\S[\s\S]*)$/);
  if (!match) return { line: clean, rest: "" };
  return { line: match[1].trim(), rest: match[2].trim() };
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
  /** The controlled facets (shared/projectFacets.ts). */
  sector: string;
  disciplines: string[];
  stage: string;
  place: string;
  searchTerms: string[];
  dateLabel: string;
  /** The one-sentence line under the facets. */
  intro: string;
  /** The whole cleaned description, for the meta description. */
  summary: string;
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
  /** The image's own line from Sanity (mediaItems[].caption), when it has one. */
  caption?: string;
};

export type ProjectUploadedVideoMediaItem = {
  type: "video";
  src: string;
  title?: string;
  mimeType?: string;
  poster?: string;
  caption?: string;
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
  const facets = resolveProjectFacets(project);
  const locationName = project.locationName || "";
  const summary = cleanProjectSummary(project.description);
  const lead = splitLead(summary);
  const bodyOnly = projectBodySections(
    project.body,
    [project.title, project.client],
    allProjects.filter((item) => item.slug !== project.slug).map((item) => item.title),
  );
  // What the description says after its first sentence opens the story, unless the body already says it.
  const bodySections =
    lead.rest && !bodyOnly.some((section) => section.includes(lead.rest.slice(0, 60))) ? [lead.rest, ...bodyOnly] : bodyOnly;
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
    sector: facets.sector,
    disciplines: facets.disciplines,
    stage: facets.stage,
    place: facets.place,
    searchTerms: facets.searchTerms,
    dateLabel: String(project.year),
    intro: lead.line,
    summary,
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
        caption: item.caption,
      }];
    }

    const sourceIndex = fullscreenImages.indexOf(item.url);
    if (sourceIndex < 0 || item.url === project.heroImage) return [];
    return [{ type: "image" as const, src: item.url, sourceIndex, caption: item.caption }];
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
        caption: video.caption,
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
      caption: video.caption,
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
    category: project.sector || project.category,
    services: project.disciplines.length > 0 ? project.disciplines : project.services,
    description: project.summary,
  });
  const pathname = `/projects/${project.slug}`;
  // The Scroll film's first frame is its own high-priority <img>; the prerender writes the matching
  // responsive preload (script/build.ts). A list of single URLs here would fetch a second copy.
  const preloadImages: string[] = [];
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
    sector: project.sector,
    disciplines: project.disciplines,
    place: project.place,
    stage: project.stage,
    searchTerms: project.searchTerms,
    locationName: project.locationName,
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
    title: formatMetaTitle(`${project.title}${project.sector || project.category ? ` ${project.sector || project.category}` : ""} Case Study`, "Atla"),
    description,
    pathname,
    image: project.heroImage,
    preloadImages,
    structuredData: [creativeWork, buildProjectBreadcrumb(project), ...videoStructuredData],
    videoStructuredData,
  };
}


/* ---- Scroll film (JP, 2026-11-06; project-scrollfilm-brief.md) ----
   Every piece fills the screen under the header and the next slides over it as the page scrolls.
   The story runs in the caption bar, one line per frame. These are the pure parts. */

/** The sticky header's height: every frame sits under it. */
export const FILM_HEADER = 64;
/** The widths a frame's image is offered at (the frame fills the screen). */
export const FILM_WIDTHS = [640, 960, 1280, 1600, 2000, 2400];
export const FILM_QUALITY = 85;
/** The blurred fill behind a whole (uncropped) piece: a few pixels are enough under a 40px blur. */
export const FILM_FILL_WIDTH = 64;
/**
 * About two lines of the caption bar at its widest (72ch), three on a phone: a longer paragraph splits
 * at a sentence end, and a sentence longer than that at a clause.
 */
export const CAPTION_MAX = 140;
/** The most text a text frame carries before the next paragraph opens another one. */
export const TEXT_FRAME_MAX = 560;

/**
 * The width the browser needs for a frame's image. A landscape fills the screen's width; a portrait
 * sits whole at the frame's height, so it never needs more than its own ratio times that height.
 */
export function filmImageSizes(ratio: number): string {
  if (!(ratio > 0) || ratio >= 1) return "100vw";
  const r = Math.round(ratio * 1000) / 1000;
  return `min(100vw, calc((100vh - ${FILM_HEADER}px) * ${r}))`;
}

const SENTENCE_BREAK = /(?<=[.!?]["'”’)\]]?)\s+(?=["'“‘(¿¡]?[A-ZÀ-ÖØ-Þ0-9])/;

/**
 * A sentence too long for the bar, cut at its clauses (after ; : or a comma), each piece as long as
 * fits, the way film subtitles run one sentence over two cards. Words are never cut, nothing is added
 * or dropped: joined with spaces, the pieces are the sentence. A sentence with no clause break stays whole.
 */
function splitClauses(sentence: string, max: number): string[] {
  if (sentence.length <= max) return [sentence];
  const breaks: number[] = [];
  const clause = /[,;:](?=\s)/g;
  for (let match = clause.exec(sentence); match; match = clause.exec(sentence)) breaks.push(match.index + 1);
  // The latest break that keeps the first piece within the line, else the first break there is.
  const fit = breaks.filter((at) => at <= max);
  const at = fit.length > 0 ? fit[fit.length - 1] : breaks[0];
  if (at === undefined || at >= sentence.length - 1) return [sentence];
  const head = sentence.slice(0, at).trim();
  const tail = sentence.slice(at).trim();
  if (!head || !tail) return [sentence];
  return [head, ...splitClauses(tail, max)];
}

/**
 * A paragraph as caption lines: whole when it fits two lines, else split at sentence ends into lines
 * that each fit (and a sentence too long on its own at its clauses). Nothing is cut mid-word.
 */
export function splitCaption(text: string, max = CAPTION_MAX): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  if (clean.length <= max) return [clean];
  const lines: string[] = [];
  let line = "";
  for (const sentence of clean.split(SENTENCE_BREAK).flatMap((part) => splitClauses(part, max))) {
    if (line && line.length + 1 + sentence.length > max) {
      lines.push(line);
      line = sentence;
    } else {
      line = line ? `${line} ${sentence}` : sentence;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export type FilmTextPlan = {
  /** One caption per media frame, in order; "" means the bar shows the title alone. */
  captions: string[];
  /** The story that found no frame, as text frames after the last piece: each holds whole paragraphs. */
  textFrames: string[][];
};

/**
 * Who says what in the caption bar. A frame with its own line in Sanity keeps it. The others take the
 * story in order: the intro first, then the paragraphs one by one, a long one split at a sentence
 * across consecutive frames. Frames past the story carry no caption (nothing is invented). Story left
 * when the pieces run out is never dropped: it closes the film as text frames, paragraphs whole.
 */
export function planFilmText(ownCaptions: Array<string | undefined>, intro: string, paragraphs: string[]): FilmTextPlan {
  const queue = [intro, ...paragraphs].flatMap((text, unit) => splitCaption(text).map((line) => ({ unit, line })));
  const captions = ownCaptions.map((own) => {
    const mine = own?.replace(/\s+/g, " ").trim();
    if (mine) return mine;
    return queue.shift()?.line ?? "";
  });
  // The rest, regrouped into its paragraphs (the one cut short keeps its remaining sentences).
  const rest: string[] = [];
  let lastUnit = -1;
  for (const { unit, line } of queue) {
    if (unit === lastUnit) rest[rest.length - 1] += ` ${line}`;
    else rest.push(line);
    lastUnit = unit;
  }
  const textFrames: string[][] = [];
  let size = 0;
  for (const paragraph of rest) {
    const current = textFrames[textFrames.length - 1];
    if (current && size + paragraph.length <= TEXT_FRAME_MAX) {
      current.push(paragraph);
      size += paragraph.length;
    } else {
      textFrames.push([paragraph]);
      size = paragraph.length;
    }
  }
  return { captions, textFrames };
}

/**
 * Where the film stands. `offset` is how far the page has scrolled into the frames (0 with the first
 * frame under the header), `frameHeight` one frame. The active frame flips when the next one has
 * covered half the screen. The progress line reads the frames passed over the whole, the frame being
 * watched included: a sliver at the first, full at the last, continuous in between.
 */
export function filmPosition(offset: number, frameHeight: number, count: number): { active: number; progress: number } {
  if (count <= 0 || !(frameHeight > 0)) return { active: 0, progress: 0 };
  const travelled = Math.max(0, offset) / frameHeight;
  return {
    active: Math.min(count - 1, Math.round(travelled)),
    progress: Math.min(1, (travelled + 1) / count),
  };
}

/** The page scrollY that puts frame `index` exactly under the header. `framesTop` is the frames' document top. */
export function filmFrameScrollY(framesTop: number, index: number, frameHeight: number, header = FILM_HEADER): number {
  return Math.max(0, framesTop - header + index * frameHeight);
}

/**
 * The frame an arrow or Page key goes to: the next frame edge below where the film stands (or the
 * previous one above it), so a half-scrolled frame is finished first rather than skipped. Clamped.
 */
export function filmStep(offset: number, frameHeight: number, count: number, direction: 1 | -1): number {
  if (count <= 0 || !(frameHeight > 0)) return 0;
  const travelled = Math.max(0, offset) / frameHeight;
  const slack = 0.02;
  const target = direction > 0 ? Math.floor(travelled + slack) + 1 : Math.ceil(travelled - slack) - 1;
  return Math.min(count - 1, Math.max(0, target));
}
