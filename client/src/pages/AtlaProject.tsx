import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Project, ProjectMediaAsset, ProjectVideoAsset } from "@shared/schema";
import { trackEvent } from "@/hooks/use-analytics";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from "@/pages/not-found";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl, sanitizeImageUrls } from "@shared/imageDelivery";
import { formatMetaTitle, ORGANIZATION_LOGO_URL, ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";

const LABEL: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 0.4,
  lineHeight: "1.2",
  textTransform: "uppercase",
  margin: 0,
};

const BODY: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: "1.1",
  margin: 0,
  overflowWrap: "normal",
  wordBreak: "normal",
  minWidth: 0,
  maxWidth: "100%",
  whiteSpace: "normal",
  boxSizing: "border-box",
};
const SURFACE_PREFERENCE_STORAGE_KEY = "atla-surface-preference-v1";
const PROJECT_PAGE_GUTTER_DESKTOP = 12;
const PROJECT_PAGE_GUTTER_MOBILE = 32;
const PROJECT_MEDIA_MAX_WIDTH = 872;
const PROJECT_TEXT_MAX_WIDTH = 810;
const MOBILE_TOUCH_TARGET = 44;

type ProjectApi = Project & {
  country?: string | null;
  locationName?: string | null;
  videoFiles?: ProjectVideoAsset[];
  mediaItems?: ProjectMediaAsset[];
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;
  const parsed = Number.parseInt(value, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function fetchProject(slug: string) {
  return async () => {
    const res = await fetch(`/api/projects/${slug}`, { credentials: "include" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch project");
    return (await res.json()) as ProjectApi;
  };
}

type ProjectPageView = {
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
};

type ProjectRelatedLink = {
  href: string;
  label: string;
};

const PROJECT_VERTICAL_OVERRIDES: Record<string, ProjectRelatedLink> = {
  "the-bridge": { href: "/hospitality-branding", label: "Hospitality branding" },
  "pax-and-beneficia": { href: "/hospitality-branding", label: "Hospitality branding" },
  "alma-brava": { href: "/hospitality-branding", label: "Hospitality branding" },
  "tequila-unido": { href: "/hospitality-branding", label: "Hospitality branding" },
  ando: { href: "/cpg-branding", label: "CPG branding" },
  tigretigre: { href: "/cpg-branding", label: "CPG branding" },
  reggie: { href: "/cpg-branding", label: "CPG branding" },
  oxylife: { href: "/cpg-branding", label: "CPG branding" },
  "bovi-health": { href: "/wellness-branding", label: "Wellness branding" },
  "conscious-care-co": { href: "/wellness-branding", label: "Wellness branding" },
  "pathize-health": { href: "/wellness-branding", label: "Wellness branding" },
  "peachy-patients": { href: "/wellness-branding", label: "Wellness branding" },
  "anything-ai": { href: "/saas-branding", label: "SaaS branding" },
  puppypy: { href: "/saas-branding", label: "SaaS branding" },
};

const PROJECT_BLOG_CASE_STUDIES: Record<string, ProjectRelatedLink> = {
  "the-bridge": {
    href: "/journal/hospitality-branding-guide",
    label: "Read the hospitality branding guide",
  },
  ando: {
    href: "/journal/brand-audit-framework",
    label: "Read the brand audit framework",
  },
  "conscious-care-co": {
    href: "/journal/brand-strategy-vs-brand-identity",
    label: "Read brand strategy vs brand identity",
  },
};

type ProjectMediaTileSpec = {
  aspectRatio: string;
  weight?: number;
};

type ProjectMediaRowSpec = {
  tiles: ProjectMediaTileSpec[];
  gap?: number;
};

type ProjectGalleryItem = {
  type: "image";
  src: string;
  sourceIndex: number;
};

type ProjectUploadedVideoMediaItem = {
  type: "video";
  src: string;
  title?: string;
  mimeType?: string;
  poster?: string;
};

type ProjectVimeoMediaItem = {
  type: "vimeo";
  src: string;
  title?: string;
};

type ProjectMediaMosaicItem = ProjectGalleryItem | ProjectUploadedVideoMediaItem | ProjectVimeoMediaItem;

const getMobileTextFrameStyle = (): React.CSSProperties => ({
  width: "auto",
  maxWidth: "none",
  margin: `0 ${PROJECT_PAGE_GUTTER_MOBILE}px`,
  boxSizing: "border-box",
  minWidth: 0,
  overflow: "hidden",
});

const mediaTile = (width: number, height: number): ProjectMediaTileSpec => ({
  aspectRatio: `${width} / ${height}`,
  weight: width,
});

const mediaRow = (tiles: ProjectMediaTileSpec[], gap = 10): ProjectMediaRowSpec => ({
  tiles,
  gap,
});

const mediaFull = (width: number, height: number) => mediaRow([mediaTile(width, height)]);
const mediaSplit = (left: [number, number], right: [number, number], gap = 10) => (
  mediaRow([mediaTile(left[0], left[1]), mediaTile(right[0], right[1])], gap)
);

const FIGMA_PROJECT_MEDIA_ROWS = {
  common: [
    mediaSplit([465.215, 593.455], [395.714, 593.57]),
    mediaFull(870.462, 442.612),
    mediaFull(870.462, 558.858),
    mediaSplit([430, 586], [430, 586]),
    mediaFull(870.462, 515.266),
    mediaSplit([430, 586], [430, 586]),
    mediaFull(869, 552.14),
  ],
  rustico: [
    mediaSplit([465.215, 593.455], [395.714, 593.57]),
    mediaFull(870.462, 442.612),
    mediaSplit([393.253, 563.932], [470.059, 563.932]),
    mediaFull(870.462, 558.858),
    mediaSplit([353.582, 585.613], [502.119, 585.613]),
    mediaFull(870.462, 515.266),
    mediaFull(871.154, 525.184),
    mediaSplit([372.956, 525.875], [490.817, 525.875]),
    mediaFull(870.462, 377.8),
  ],
  tequila: [
    mediaSplit([465.215, 593.455], [395.714, 593.57]),
    mediaFull(871.77, 459.469),
    mediaSplit([425, 553], [425, 553]),
    mediaFull(871.77, 586),
    mediaSplit([426, 586], [430, 586]),
    mediaFull(871.77, 537),
  ],
  anything: [
    mediaSplit([465.215, 593.455], [395.714, 593.57]),
    mediaFull(870.462, 442.612),
    mediaFull(870.462, 558.858),
    mediaSplit([430, 586], [430, 586]),
    mediaFull(869, 586),
    mediaFull(870.462, 515.266),
    mediaSplit([428, 572], [428, 572]),
  ],
  vyv: [
    mediaSplit([465.215, 593.455], [396, 594]),
    mediaFull(870.462, 442.612),
    mediaFull(870.462, 558.858),
    mediaSplit([299, 586], [554, 586]),
    mediaFull(869, 586),
    mediaFull(867, 489),
    mediaSplit([428, 572], [428, 572]),
  ],
  casaColora: [
    mediaSplit([465.215, 593.455], [409.256, 610.072]),
    mediaFull(870.462, 442.612),
    mediaFull(870.462, 558.858),
    mediaSplit([377, 586], [484, 586]),
    mediaFull(869, 586),
    mediaFull(867, 489),
    mediaFull(870.462, 515.266),
    mediaFull(870.462, 442.612),
  ],
  arcStudio: [
    mediaSplit([416, 593], [444, 593]),
    mediaFull(870.462, 442.612),
    mediaFull(869, 557),
    mediaSplit([377, 586], [484, 586]),
    mediaFull(869, 586),
    mediaFull(869, 515),
    mediaFull(869, 488.812),
  ],
  bondBloom: [
    mediaSplit([465.215, 593.455], [400, 599.368]),
    mediaFull(866, 444),
    mediaFull(870.462, 558.858),
    mediaSplit([430, 586], [430, 586]),
    mediaFull(869, 579.333),
    mediaFull(870.462, 515.266),
    mediaFull(869, 488.812),
  ],
  huemac: [
    mediaSplit([465.215, 593.455], [395.714, 593.57]),
    mediaFull(870.462, 442.612),
    mediaFull(869, 586),
    mediaFull(870.462, 515.266),
    mediaFull(869, 537),
  ],
  peachyPatients: [
    mediaSplit([465.215, 593.455], [395.714, 593.57]),
    mediaFull(870.462, 442.612),
    mediaFull(870, 225),
    mediaFull(869, 586),
    mediaFull(869, 586),
  ],
  boviHealth: [
    mediaSplit([465.215, 593.455], [395.714, 593.57]),
    mediaFull(870.462, 442.612),
    mediaFull(870.462, 558.858),
    mediaSplit([430, 586], [430, 586]),
    mediaFull(869, 299),
  ],
  persona: [
    mediaSplit([465.215, 593.455], [395.714, 593.57]),
    mediaFull(871, 443),
    mediaFull(870.462, 558.858),
    mediaSplit([430, 586], [430, 586]),
    mediaFull(869, 586),
  ],
  pathizeHealth: [
    mediaSplit([465.215, 593.455], [396, 593.57]),
    mediaFull(870.462, 558.858),
    mediaFull(869, 586),
  ],
} satisfies Record<string, ProjectMediaRowSpec[]>;

const PROJECT_MEDIA_ROW_PRESETS: Record<string, ProjectMediaRowSpec[]> = {
  rustico: FIGMA_PROJECT_MEDIA_ROWS.rustico,
  baristio: FIGMA_PROJECT_MEDIA_ROWS.common,
  reggie: FIGMA_PROJECT_MEDIA_ROWS.common,
  "tequila-unido": FIGMA_PROJECT_MEDIA_ROWS.tequila,
  anything: FIGMA_PROJECT_MEDIA_ROWS.anything,
  "anything-ai": FIGMA_PROJECT_MEDIA_ROWS.anything,
  vyv: FIGMA_PROJECT_MEDIA_ROWS.vyv,
  "casa-colora": FIGMA_PROJECT_MEDIA_ROWS.casaColora,
  "arc-studio": FIGMA_PROJECT_MEDIA_ROWS.arcStudio,
  "bond-and-bloom": FIGMA_PROJECT_MEDIA_ROWS.bondBloom,
  "bond-bloom": FIGMA_PROJECT_MEDIA_ROWS.bondBloom,
  huemac: FIGMA_PROJECT_MEDIA_ROWS.huemac,
  "peachy-patients": FIGMA_PROJECT_MEDIA_ROWS.peachyPatients,
  "bovi-health": FIGMA_PROJECT_MEDIA_ROWS.boviHealth,
  persona: FIGMA_PROJECT_MEDIA_ROWS.persona,
  "pathize-health": FIGMA_PROJECT_MEDIA_ROWS.pathizeHealth,
};

function normalizeProjectKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProjectMediaRows(project: ProjectPageView, itemCount = project.gallery.length) {
  const baseRows = (
    PROJECT_MEDIA_ROW_PRESETS[normalizeProjectKey(project.slug)] ||
    PROJECT_MEDIA_ROW_PRESETS[normalizeProjectKey(project.title)] ||
    FIGMA_PROJECT_MEDIA_ROWS.common
  );
  const rows = [...baseRows];
  let tileCapacity = rows.reduce((total, row) => total + row.tiles.length, 0);
  let fallbackRowIndex = 0;

  while (tileCapacity < itemCount) {
    const nextRow = FIGMA_PROJECT_MEDIA_ROWS.common[fallbackRowIndex % FIGMA_PROJECT_MEDIA_ROWS.common.length];
    rows.push(nextRow);
    tileCapacity += nextRow.tiles.length;
    fallbackRowIndex += 1;
  }

  return rows;
}

function getProjectFullscreenImages(project: ProjectPageView) {
  return Array.from(new Set([
    project.heroImage,
    ...project.gallery,
    ...project.mediaItems
      .filter((item): item is Extract<ProjectMediaAsset, { type: "image" }> => item.type === "image")
      .map((item) => item.url),
  ].filter(Boolean)));
}

function inferVerticalFromProject(project: ProjectPageView): ProjectRelatedLink {
  const direct = PROJECT_VERTICAL_OVERRIDES[project.slug];
  if (direct) return direct;

  const haystack = [
    project.title,
    project.client,
    project.category,
    project.region,
    ...project.services,
  ]
    .join(" ")
    .toLowerCase();

  if (/(health|wellness|patient|care|clinic|supplement)/.test(haystack)) {
    return { href: "/wellness-branding", label: "Wellness branding" };
  }

  if (/(saas|software|ai|digital|platform|app)/.test(haystack)) {
    return { href: "/saas-branding", label: "SaaS branding" };
  }

  if (/(packaging|consumer|cpg|product|retail|food|beverage)/.test(haystack)) {
    return { href: "/cpg-branding", label: "CPG branding" };
  }

  return { href: "/hospitality-branding", label: "Hospitality branding" };
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

function toVimeoEmbedUrl(url: string) {
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

function toVimeoWatchUrl(embedUrl: string) {
  const match = embedUrl.match(/player\.vimeo\.com\/video\/(\d+)/i);
  if (!match) return "https://vimeo.com";
  return `https://vimeo.com/${match[1]}`;
}

function toVimeoBackgroundUrl(embedUrl: string) {
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

function buildProjectPageView(project: ProjectApi, allProjects: ProjectApi[]): ProjectPageView {
  const client = project.client === "Confidential" ? "" : project.client;
  const category = project.category === "Uncategorized" ? "" : project.category;
  const region = project.region;
  const country = project.country || "";
  const locationName = project.locationName || "";
  const bodySections = project.body
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const services = project.tags.filter(Boolean);
  const imageGallery = sanitizeImageUrls(project.images);
  const heroImage = sanitizeImageUrls([project.coverImage, ...imageGallery])[0] || "/figmaAssets/media.png";
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
    intro: project.description,
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
  };
}

function buildProjectMetaDescription(project: ProjectPageView) {
  const base = project.intro?.trim();
  if (base && base.length >= 130) return base.slice(0, 155);

  const category = project.category || "Brand system";
  const region = project.region || "US and Latin America";
  const serviceLabel = project.services.length > 0 ? project.services.slice(0, 3).join(", ") : "strategy, identity, digital, and packaging";
  const clientLabel = project.client || "a confidential client";

  const fallback = `${project.title} is an Atla case study for ${clientLabel} in ${region}. Explore how ${category.toLowerCase()} work and ${serviceLabel} were developed into a coherent launch-ready system.`;
  return fallback.slice(0, 155);
}

function ProjectMediaMosaic({
  rows,
  items,
  projectTitle,
  isMobile,
  isSurfaceDark,
  onOpen,
  onImageError,
}: {
  rows: ProjectMediaRowSpec[];
  items: ProjectMediaMosaicItem[];
  projectTitle: string;
  isMobile: boolean;
  isSurfaceDark: boolean;
  onOpen: (sourceIndex: number) => void;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
}) {
  let itemIndex = 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: isMobile ? PROJECT_MEDIA_MAX_WIDTH : "none",
        margin: isMobile ? "0 auto" : 0,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 2 : 10,
        padding: isMobile ? `0 ${PROJECT_PAGE_GUTTER_MOBILE}px` : 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {rows.map((row, rowIndex) => {
        const rowTiles = row.tiles
          .map((tile) => {
            const item = items[itemIndex];
            itemIndex += 1;
            return item ? { tile, item } : null;
          })
          .filter((tile): tile is { tile: ProjectMediaTileSpec; item: ProjectMediaMosaicItem } => Boolean(tile));

        if (rowTiles.length === 0) return null;

        return (
          <div
            key={`row-${rowIndex}`}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : row.gap ?? 10,
              width: "100%",
            }}
          >
            {rowTiles.map(({ tile, item }) => {
              const isFullWidthTile = rowTiles.length === 1;
              const tileKey = `${item.type}-${item.src}-${item.type === "image" ? item.sourceIndex : rowIndex}`;

              if (item.type === "video") {
                return (
                  <div
                    key={tileKey}
                    style={{
                      backgroundColor: isSurfaceDark ? "#0f0f0f" : "#ececec",
                      overflow: "hidden",
                      flex: isMobile ? "1 1 auto" : `${tile.weight ?? 1} ${tile.weight ?? 1} 0`,
                      minWidth: 0,
                      width: isMobile ? "100%" : undefined,
                    }}
                  >
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      poster={item.poster}
                      disablePictureInPicture
                      controlsList="nodownload noplaybackrate noremoteplayback"
                      aria-label={item.title || `${projectTitle} project video`}
                      onCanPlay={(event) => {
                        const video = event.currentTarget;
                        video.muted = true;
                        void video.play().catch(() => undefined);
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                        aspectRatio: tile.aspectRatio,
                      }}
                    />
                  </div>
                );
              }

              if (item.type === "vimeo") {
                return (
                  <div
                    key={tileKey}
                    style={{
                      position: "relative",
                      backgroundColor: isSurfaceDark ? "#0f0f0f" : "#ececec",
                      overflow: "hidden",
                      flex: isMobile ? "1 1 auto" : `${tile.weight ?? 1} ${tile.weight ?? 1} 0`,
                      minWidth: 0,
                      width: isMobile ? "100%" : undefined,
                      aspectRatio: tile.aspectRatio,
                    }}
                  >
                    <iframe
                      src={toVimeoBackgroundUrl(item.src)}
                      title={item.title || `${projectTitle} project video`}
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                    />
                  </div>
                );
              }

              const imageItem = item;
              const imageDimensions = getImageDimensions(item.src);
              const targetWidth = isMobile
                ? 1400
                : isFullWidthTile
                  ? 3200
                  : Math.max(1800, Math.round((tile.weight ?? PROJECT_MEDIA_MAX_WIDTH) * 3.2));
              const optimizedSrc = getOptimizedImageUrl(item.src, { width: targetWidth, quality: 92 }) || item.src;
              const srcSet = buildImageSrcSet(
                item.src,
                [Math.round(targetWidth * 0.5), Math.round(targetWidth * 0.75), targetWidth],
                { quality: 92 },
              );
              const imageAlt = `${projectTitle} project image ${imageItem.sourceIndex + 1}`;

              return (
                <button
                  key={tileKey}
                  type="button"
                  onClick={() => onOpen(imageItem.sourceIndex)}
                  aria-label={`Open ${imageAlt} in fullscreen`}
                  style={{
                    border: "none",
                    backgroundColor: isSurfaceDark ? "#0f0f0f" : "#ececec",
                    padding: 0,
                    margin: 0,
                    cursor: "zoom-in",
                    overflow: "hidden",
                    flex: isMobile ? "1 1 auto" : `${tile.weight ?? 1} ${tile.weight ?? 1} 0`,
                    minWidth: 0,
                    width: isMobile ? "100%" : undefined,
                  }}
                >
                  <img
                    src={optimizedSrc}
                    srcSet={srcSet}
                    sizes={isMobile ? "100vw" : isFullWidthTile ? "100vw" : "50vw"}
                    alt={imageAlt}
                    width={imageDimensions?.width}
                    height={imageDimensions?.height}
                    loading={imageItem.sourceIndex <= 3 ? "eager" : "lazy"}
                    fetchPriority={imageItem.sourceIndex <= 3 ? "high" : undefined}
                    decoding="async"
                    onError={onImageError}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      objectFit: "cover",
                      aspectRatio: tile.aspectRatio,
                    }}
                  />
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function AtlaProject() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const isMobile = useIsMobile();
  const [surfaceColor, setSurfaceColor] = useState("#fafafa");
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const element = event.currentTarget;
    if (element.dataset.fallbackApplied === "true") return;
    element.dataset.fallbackApplied = "true";
    element.src = "/figmaAssets/media.png";
    element.srcset = "";
  };

  const { data: projectData, isPending: isProjectPending } = useQuery<ProjectApi | null>({
    queryKey: ["project", slug],
    queryFn: fetchProject(slug),
  });
  const { data: allProjects } = useQuery<ProjectApi[]>({
    queryKey: ["/api/projects"],
  });

  const project = useMemo(
    () => (projectData ? buildProjectPageView(projectData, allProjects ?? []) : null),
    [allProjects, projectData],
  );
  const isSurfaceDark = useMemo(() => relativeLuminance(surfaceColor) < 0.35, [surfaceColor]);
  const primaryTextColor = isSurfaceDark ? "#f5f5f5" : "#222222";
  const mutedTextColor = isSurfaceDark ? "rgba(245,245,245,0.88)" : "#555555";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawValue = window.localStorage.getItem(SURFACE_PREFERENCE_STORAGE_KEY);
    if (!rawValue) return;

    try {
      const parsed = JSON.parse(rawValue) as { color?: string };
      if (typeof parsed.color === "string" && parsed.color.trim()) {
        setSurfaceColor(parsed.color);
      }
    } catch {
      window.localStorage.removeItem(SURFACE_PREFERENCE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!project) return;

    trackEvent("portfolio_project_view", {
      page: `/projects/${project.slug}`,
      project_name: project.title,
    });
  }, [project]);

  useEffect(() => {
    if (fullscreenIndex === null) return;

    const totalImages = project ? getProjectFullscreenImages(project).length : 0;
    if (totalImages < 1) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreenIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setFullscreenIndex((current) => {
          if (current === null) return 0;
          return (current + 1) % totalImages;
        });
        return;
      }

      if (event.key === "ArrowLeft") {
        setFullscreenIndex((current) => {
          if (current === null) return 0;
          return (current - 1 + totalImages) % totalImages;
        });
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fullscreenIndex, project]);

  if (!slug || (!project && isProjectPending)) {
    return null;
  }

  if (!project) {
    return <NotFound />;
  }

  const heroDimensions = getImageDimensions(project.heroImage);
  const heroAspectRatio = isMobile ? "4 / 3" : "872 / 482";
  const heroSrc = getOptimizedImageUrl(project.heroImage, { width: isMobile ? 1200 : 2200, quality: 92 }) || project.heroImage;
  const heroSrcSet = buildImageSrcSet(project.heroImage, isMobile ? [800, 1200] : [1200, 1600, 2200], { quality: 92 });
  const projectMetaDescription = buildProjectMetaDescription(project);
  const projectPreloadImages = [
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
  const fullscreenImages = getProjectFullscreenImages(project);
  const heroFullscreenIndex = Math.max(0, fullscreenImages.indexOf(project.heroImage));
  const galleryStream: ProjectMediaMosaicItem[] = fullscreenImages
    .map((src, sourceIndex) => ({ type: "image" as const, src, sourceIndex }))
    .filter(({ src, sourceIndex }) => !(sourceIndex === 0 && src === project.heroImage));
  const narrativePool = project.bodySections.filter(Boolean);
  const introText = project.intro || project.bodySections[0] || "Case study documentation and execution details.";
  const brandNarrative = narrativePool[0] || introText;
  const challengeNarrative = narrativePool[1] || narrativePool[0] || introText;
  const resultNarrative = narrativePool[2] || narrativePool[narrativePool.length - 1] || introText;
  const projectNarratives = [
    { label: "( The Brand )", text: brandNarrative },
    { label: "( The Challenge )", text: challengeNarrative },
    { label: "( The Result )", text: resultNarrative },
  ];
  const serviceLabel = project.services.length > 0
    ? project.services.join(isMobile ? ", " : " · ")
    : "Brand Identity";
  const totalGalleryImages = fullscreenImages.length;
  const heroFullscreenLabel = `Open Fullscreen · 1/${totalGalleryImages}`;
  const fullscreenImageSrc = fullscreenIndex !== null ? fullscreenImages[fullscreenIndex] : null;
  const fullscreenImageAlt = fullscreenIndex !== null ? `${project.title} project image ${fullscreenIndex + 1}` : "";
  const fullscreenOptimizedSrc = fullscreenImageSrc
    ? getOptimizedImageUrl(fullscreenImageSrc, { width: isMobile ? 1800 : 2800, quality: 95 }) || fullscreenImageSrc
    : null;
  const videoEmbeds = project.videos
    .map((videoUrl) => {
      const embedUrl = toVimeoEmbedUrl(videoUrl);
      if (!embedUrl) return null;
      return {
        embedUrl,
        watchUrl: toVimeoWatchUrl(embedUrl),
      };
    })
    .filter((video): video is { embedUrl: string; watchUrl: string } => Boolean(video));
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
  const fallbackMediaItems: ProjectMediaMosaicItem[] = galleryStream.reduce<ProjectMediaMosaicItem[]>((items, imageItem, index) => {
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
  const galleryTiles = mediaItemsFromSequence.length > 0 ? mediaItemsFromSequence : fallbackMediaItems;
  const mediaRows = getProjectMediaRows(project, galleryTiles.length);
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.title} case study`,
    description: projectMetaDescription,
    url: `${SITE_ORIGIN}/projects/${project.slug}`,
    image: [project.heroImage, ...project.gallery.slice(0, 7)],
    creator: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_ORIGIN,
    },
    about: [project.category, project.client, project.region, ...project.services].filter(Boolean),
  };
  const videoPublisherSchema = {
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: SITE_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: ORGANIZATION_LOGO_URL,
    },
  };
  const videoStructuredData = [
    ...uploadedVideos.map((video, index) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: video.title || `${project.title} video ${index + 1}`,
      description: video.caption || `${project.title} case study video ${index + 1} from Atla.`,
      mainEntityOfPage: `${SITE_ORIGIN}/projects/${project.slug}`,
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
        mainEntityOfPage: `${SITE_ORIGIN}/projects/${project.slug}`,
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

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        backgroundColor: surfaceColor,
        color: primaryTextColor,
        ["--atla-text-color" as string]: primaryTextColor,
      }}
    >
      <SeoHead
        title={formatMetaTitle(`${project.title}${project.category ? ` ${project.category}` : ""} Case Study`, "Atla")}
        description={projectMetaDescription}
        pathname={`/projects/${project.slug}`}
        image={project.heroImage}
        preloadImages={projectPreloadImages}
        structuredData={[creativeWorkSchema, ...videoStructuredData]}
      />
      {videoStructuredData.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(videoStructuredData.length === 1 ? videoStructuredData[0] : videoStructuredData),
          }}
        />
      ) : null}
      <main style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden", position: "relative" }}>
          <section
            style={{
              width: "100%",
              margin: 0,
              padding: isMobile ? "0 0 24px" : "11px 0 0",
              overflow: "hidden",
            }}
          >
            <section className="sr-only" aria-label={`${project.title} case study context`}>
              <h2>{project.title} project overview</h2>
              <p>{introText}</p>
            </section>

            <button
              type="button"
              onClick={() => setFullscreenIndex(heroFullscreenIndex)}
              aria-label={heroFullscreenLabel}
              style={{
                position: "relative",
                width: "100%",
                margin: 0,
                border: "none",
                cursor: "zoom-in",
                display: "block",
                backgroundColor: isSurfaceDark ? "#0f0f0f" : "#d8d8d8",
                aspectRatio: heroAspectRatio,
                overflow: "hidden",
                padding: 0,
              }}
            >
              <img
                src={heroSrc}
                srcSet={heroSrcSet}
                sizes="100vw"
                alt={`${project.title} hero image`}
                width={heroDimensions?.width}
                height={heroDimensions?.height}
                fetchPriority="high"
                onError={handleImageError}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </button>

              <section
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? 18 : 36,
                  padding: isMobile ? "24px 0 0" : `53px ${PROJECT_PAGE_GUTTER_DESKTOP}px 0`,
                  ...(isMobile
                    ? getMobileTextFrameStyle()
                    : {
                      width: "100%",
                      maxWidth: PROJECT_TEXT_MAX_WIDTH,
                      margin: "0 auto",
                      boxSizing: "border-box",
                    }),
                }}
              >
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <h1
                  style={{
                    fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                    fontSize: isMobile ? 42 : 64,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    letterSpacing: 0,
                    color: primaryTextColor,
                    margin: 0,
                  }}
                >
                  {project.title}
                </h1>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
                  columnGap: isMobile ? 0 : 36,
                  rowGap: isMobile ? 14 : 12,
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 5 : 8, minWidth: 0 }}>
                  <p style={{ ...LABEL, color: "#8e8e8e" }}>( Clients )</p>
                  <p style={{ ...BODY, color: primaryTextColor }}>{project.client || "Confidential"}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 5 : 8, minWidth: 0 }}>
                  <p style={{ ...LABEL, color: "#8e8e8e" }}>( Service )</p>
                  <p style={{ ...BODY, color: primaryTextColor }}>
                    {serviceLabel}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
                  columnGap: isMobile ? 0 : 36,
                  rowGap: isMobile ? 14 : 10,
                  alignItems: "end",
                  minWidth: 0,
                }}
              >
                <p style={{ ...BODY, color: primaryTextColor, lineHeight: "1.1" }}>
                  {introText}
                </p>
                <div
                  style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "140px 1fr",
                  gap: isMobile ? 6 : 8,
                  minWidth: 0,
                }}
              >
                  <p style={{ ...BODY, color: primaryTextColor }}>{project.country || project.region || "—"}</p>
                  <p style={{ ...BODY, color: primaryTextColor }}>{project.dateLabel}</p>
                </div>
              </div>
            </section>

            <section
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 36 : 64,
                padding: isMobile ? "40px 0 56px" : `40px 20px 120px`,
                ...(isMobile
                  ? getMobileTextFrameStyle()
                  : {
                    width: "100%",
                    maxWidth: PROJECT_TEXT_MAX_WIDTH,
                    margin: "0 auto",
                    boxSizing: "border-box",
                  }),
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 22 : 36 }}>
                {projectNarratives.map((item) => (
                  <article key={item.label} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 6 : 8 }}>
                    <p style={{ ...LABEL, color: primaryTextColor, paddingBottom: isMobile ? 8 : 12 }}>{item.label}</p>
                    <p style={{ ...BODY, color: primaryTextColor, lineHeight: "1.1" }}>{item.text}</p>
                  </article>
                ))}
              </div>

              {project.credits.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile ? 8 : 10,
                    width: "100%",
                    maxWidth: isMobile ? "100%" : 573,
                  }}
                >
                  <p style={{ ...LABEL, color: primaryTextColor, paddingBottom: 4 }}>( Credits )</p>
                  {project.credits.map((credit) => (
                    <div
                      key={credit.role}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "180px minmax(0, 1fr)",
                        gap: isMobile ? 3 : 4,
                        alignItems: "start",
                        minWidth: 0,
                      }}
                    >
                      <p style={{ ...BODY, color: "#8e8e8e" }}>{credit.role}</p>
                      <p style={{ ...BODY, color: primaryTextColor, textAlign: isMobile ? "left" : "right", lineHeight: "1.1" }}>
                        {credit.names.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          </section>

          {galleryTiles.length > 0 ? (
            <section
              style={{
                width: "100%",
                padding: isMobile ? "0 0 32px" : "0 0 64px",
              }}
            >
              <ProjectMediaMosaic
                rows={mediaRows}
                items={galleryTiles}
                projectTitle={project.title}
                isMobile={isMobile}
                isSurfaceDark={isSurfaceDark}
                onOpen={setFullscreenIndex}
                onImageError={handleImageError}
              />
            </section>
          ) : null}

          {fullscreenIndex !== null && fullscreenOptimizedSrc ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Project image fullscreen preview"
            onClick={() => setFullscreenIndex(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2400,
              backgroundColor: "rgba(0, 0, 0, 0.94)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "zoom-out",
              padding: isMobile ? 8 : 16,
            }}
          >
            <button
              type="button"
              aria-label="Close fullscreen"
              onClick={() => setFullscreenIndex(null)}
              style={{
                position: "fixed",
                top: isMobile ? 12 : 16,
                right: isMobile ? 12 : 16,
                border: "1px solid rgba(255,255,255,0.45)",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                padding: "8px 12px",
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                cursor: "pointer",
                minHeight: isMobile ? MOBILE_TOUCH_TARGET : 38,
                minWidth: isMobile ? 76 : 64,
              }}
            >
              Close
            </button>
            {totalGalleryImages > 1 ? (
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  setFullscreenIndex((current) => {
                    if (current === null) return 0;
                    return (current - 1 + totalGalleryImages) % totalGalleryImages;
                  });
                }}
                style={{
                  position: "fixed",
                  left: isMobile ? 10 : 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "rgba(0,0,0,0.45)",
                  color: "#fff",
                  width: isMobile ? MOBILE_TOUCH_TARGET : 44,
                  height: isMobile ? MOBILE_TOUCH_TARGET : 44,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? 18 : 20,
                  cursor: "pointer",
                }}
              >
                ‹
              </button>
            ) : null}
            {totalGalleryImages > 1 ? (
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  setFullscreenIndex((current) => {
                    if (current === null) return 0;
                    return (current + 1) % totalGalleryImages;
                  });
                }}
                style={{
                  position: "fixed",
                  right: isMobile ? 10 : 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "rgba(0,0,0,0.45)",
                  color: "#fff",
                  width: isMobile ? MOBILE_TOUCH_TARGET : 44,
                  height: isMobile ? MOBILE_TOUCH_TARGET : 44,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? 18 : 20,
                  cursor: "pointer",
                }}
              >
                ›
              </button>
            ) : null}
            <img
              src={fullscreenOptimizedSrc}
              alt={fullscreenImageAlt}
              onClick={(event) => event.stopPropagation()}
              onError={handleImageError}
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100vw",
                maxHeight: isMobile ? "100svh" : "100vh",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
            <div
              style={{
                position: "fixed",
                left: "50%",
                bottom: isMobile ? 12 : 16,
                transform: "translateX(-50%)",
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(0,0,0,0.45)",
                color: "rgba(255,255,255,0.95)",
                padding: "6px 10px",
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.3,
                textTransform: "uppercase",
                pointerEvents: "none",
              }}
            >
              {fullscreenIndex + 1}/{totalGalleryImages}
            </div>
          </div>
        ) : null}
      </main>
      <AtlaFooter />
    </div>
  );
}
