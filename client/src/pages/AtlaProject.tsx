import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Project } from "@shared/schema";
import { trackEvent } from "@/hooks/use-analytics";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from "@/pages/not-found";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl, sanitizeImageUrls } from "@shared/imageDelivery";
import { formatMetaTitle, ORGANIZATION_LOGO_URL, ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";

const LABEL: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.4,
  lineHeight: "1.2",
  textTransform: "uppercase",
  margin: 0,
};

const BODY: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: "1.3",
  margin: 0,
};
const SURFACE_PREFERENCE_STORAGE_KEY = "atla-surface-preference-v1";
const PROJECT_PAGE_GUTTER_DESKTOP = 8;
const PROJECT_PAGE_GUTTER_MOBILE = 6;
const PROJECT_TEXT_MAX_WIDTH = 1280;
const MOBILE_TOUCH_TARGET = 44;

type ProjectApi = Project & {
  country?: string | null;
  locationName?: string | null;
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

function toVimeoEmbedUrl(url: string) {
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

    const totalImages = project?.gallery.length ?? 0;
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
  }, [fullscreenIndex, project?.gallery.length]);

  if (!slug || (!project && isProjectPending)) {
    return null;
  }

  if (!project) {
    return <NotFound />;
  }

  const heroDimensions = getImageDimensions(project.heroImage);
  const heroAspectRatio = heroDimensions
    ? `${heroDimensions.width} / ${heroDimensions.height}`
    : "16 / 9";
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
  const orderedProjectSlugs = (allProjects ?? [])
    .slice()
    .sort((left, right) => left.year - right.year || left.title.localeCompare(right.title))
    .map((item) => item.slug);
  const projectOrdinal = Math.max(1, orderedProjectSlugs.indexOf(project.slug) + 1);
  const parsedYear = Number.parseInt(project.dateLabel, 10);
  const projectYearToken = Number.isFinite(parsedYear)
    ? String(Math.abs(parsedYear) % 100).padStart(2, "0")
    : project.dateLabel.slice(-2).padStart(2, "0");
  const videoUploadDate = Number.isFinite(parsedYear) ? `${parsedYear}-01-01T00:00:00.000Z` : undefined;
  const projectMarker = `${String(projectOrdinal).padStart(2, "0")} ${projectYearToken}`;
  const galleryStream = project.gallery
    .map((src, sourceIndex) => ({ src, sourceIndex }))
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
  const totalGalleryImages = project.gallery.length;
  const heroFullscreenLabel = `Open Fullscreen · 1/${totalGalleryImages}`;
  const fullscreenImageSrc = fullscreenIndex !== null ? project.gallery[fullscreenIndex] : null;
  const fullscreenImageAlt = fullscreenIndex !== null ? `${project.title} project image ${fullscreenIndex + 1}` : "";
  const fullscreenOptimizedSrc = fullscreenImageSrc
    ? getOptimizedImageUrl(fullscreenImageSrc, { width: isMobile ? 1800 : 2800, quality: 95 }) || fullscreenImageSrc
    : null;
  const galleryTiles = galleryStream;
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
  const videoStructuredData = videoEmbeds.map((video, index) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${project.title} video ${index + 1}`,
    description: `${project.title} case study video ${index + 1} from Atla.`,
    mainEntityOfPage: `${SITE_ORIGIN}/projects/${project.slug}`,
    embedUrl: video.embedUrl,
    contentUrl: video.watchUrl,
    url: video.watchUrl,
    thumbnailUrl: project.gallery[index] || project.heroImage,
    uploadDate: videoUploadDate,
    inLanguage: "en",
    isFamilyFriendly: true,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO_URL,
      },
    },
  }));

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
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
      <main style={{ width: "100%", position: "relative" }}>
          <section
            style={{
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              padding: isMobile ? "0 0 24px" : "0 0 40px",
            }}
          >
            <section className="sr-only" aria-label={`${project.title} case study context`}>
              <h2>{project.title} project overview</h2>
              <p>{introText}</p>
            </section>

            <button
              type="button"
              onClick={() => setFullscreenIndex(0)}
              aria-label={heroFullscreenLabel}
              style={{
                position: "relative",
                width: "100%",
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
                  gap: isMobile ? 10 : 24,
                  padding: isMobile
                    ? `12px ${PROJECT_PAGE_GUTTER_MOBILE}px 0`
                    : `34px ${PROJECT_PAGE_GUTTER_DESKTOP}px 0`,
                  width: "100%",
                  maxWidth: PROJECT_TEXT_MAX_WIDTH,
                  margin: "0 auto",
                }}
              >
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 4 : 8 }}>
                <p style={{ ...LABEL, color: "#8e8e8e" }}>{projectMarker}</p>
                <h1
                  style={{
                    fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                    fontSize: isMobile ? 38 : 64,
                    fontWeight: 400,
                    lineHeight: "1.02",
                    letterSpacing: -0.3,
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
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                  columnGap: isMobile ? 10 : 32,
                  rowGap: isMobile ? 8 : 10,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 5 : 8 }}>
                  <p style={{ ...LABEL, color: "#8e8e8e" }}>( Clients )</p>
                  <p style={{ ...BODY, color: primaryTextColor }}>{project.client || "Confidential"}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 5 : 8 }}>
                  <p style={{ ...LABEL, color: "#8e8e8e" }}>( Service )</p>
                  <p style={{ ...BODY, color: primaryTextColor }}>
                    {project.services.length > 0 ? project.services.join(" · ") : "Brand Identity"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                  columnGap: isMobile ? 10 : 32,
                  rowGap: isMobile ? 8 : 10,
                  alignItems: "end",
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
                gap: isMobile ? 18 : 40,
                padding: isMobile
                  ? `18px ${PROJECT_PAGE_GUTTER_MOBILE}px 28px`
                  : `28px ${PROJECT_PAGE_GUTTER_DESKTOP}px 84px`,
                width: "100%",
                maxWidth: PROJECT_TEXT_MAX_WIDTH,
                margin: "0 auto",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 24 }}>
                {projectNarratives.map((item) => (
                  <article key={item.label} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 6 : 8 }}>
                    <p style={{ ...LABEL, color: primaryTextColor, paddingBottom: isMobile ? 4 : 8 }}>{item.label}</p>
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
                  }}
                >
                  <p style={{ ...LABEL, color: primaryTextColor, paddingBottom: 4 }}>( Credits )</p>
                  {project.credits.map((credit) => (
                    <div
                      key={credit.role}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "96px minmax(0, 1fr)" : "180px minmax(0, 1fr)",
                        gap: isMobile ? 2 : 4,
                        alignItems: "start",
                      }}
                    >
                      <p style={{ ...BODY, color: "#8e8e8e" }}>{credit.role}</p>
                      <p style={{ ...BODY, color: primaryTextColor, textAlign: "left", lineHeight: "1.1" }}>
                        {credit.names.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          </section>

          {videoEmbeds.length > 0 ? (
            <section
              style={{
                width: "100vw",
                marginLeft: "calc(50% - 50vw)",
                marginRight: "calc(50% - 50vw)",
                padding: isMobile ? "0 0 14px" : "0 0 30px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 8 : 10 }}>
                <p
                  style={{
                    ...LABEL,
                    color: primaryTextColor,
                    padding: isMobile
                      ? `0 ${PROJECT_PAGE_GUTTER_MOBILE}px`
                      : `0 ${PROJECT_PAGE_GUTTER_DESKTOP}px`,
                  }}
                >
                  ( Videos )
                </p>
                {videoEmbeds.map(({ embedUrl, watchUrl }, index) => (
                  <div key={embedUrl} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        backgroundColor: isSurfaceDark ? "#101010" : "#ececec",
                        paddingTop: "56.25%",
                      }}
                    >
                      <iframe
                        src={embedUrl}
                        title={`${project.title} Vimeo video ${index + 1}`}
                        width={1280}
                        height={720}
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        allowFullScreen
                        loading={index === 0 ? "eager" : "lazy"}
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
                    <a
                      href={watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="atla-link"
                      style={{
                        ...BODY,
                        color: mutedTextColor,
                        textDecoration: "none",
                        padding: isMobile
                          ? `10px ${PROJECT_PAGE_GUTTER_MOBILE}px`
                          : `4px ${PROJECT_PAGE_GUTTER_DESKTOP}px`,
                        width: "fit-content",
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: isMobile ? MOBILE_TOUCH_TARGET : 26,
                      }}
                    >
                      Open on Vimeo if embed is restricted
                    </a>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {galleryTiles.length > 0 ? (
            <section
              style={{
                width: "100vw",
                marginLeft: "calc(50% - 50vw)",
                marginRight: "calc(50% - 50vw)",
                padding: isMobile ? "0 0 32px" : "0 0 64px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: isMobile ? 2 : 10,
                }}
              >
                {galleryTiles.map(({ src, sourceIndex }, tileIndex) => {
                  const imageDimensions = getImageDimensions(src);
                  const tileMap = [
                    { gridColumn: "span 1", aspectRatio: "465 / 594" },
                    { gridColumn: "span 1", aspectRatio: "395 / 594" },
                    { gridColumn: "1 / -1", aspectRatio: "870 / 443" },
                    { gridColumn: "span 1", aspectRatio: "393 / 564" },
                    { gridColumn: "span 1", aspectRatio: "470 / 564" },
                    { gridColumn: "1 / -1", aspectRatio: "870 / 559" },
                    { gridColumn: "span 1", aspectRatio: "400 / 623" },
                    { gridColumn: "span 1", aspectRatio: "457 / 623" },
                    { gridColumn: "1 / -1", aspectRatio: "870 / 515" },
                  ] as const;
                  const tilePreset = tileMap[tileIndex % tileMap.length];
                  const isFullWidthTile = tilePreset.gridColumn === "1 / -1";
                  const targetWidth = isMobile
                    ? isFullWidthTile ? 1600 : 1200
                    : isFullWidthTile ? 2800 : 2000;
                  const optimizedSrc = getOptimizedImageUrl(src, { width: targetWidth, quality: 92 }) || src;
                  const srcSet = buildImageSrcSet(
                    src,
                    [Math.round(targetWidth * 0.5), Math.round(targetWidth * 0.75), targetWidth],
                    { quality: 92 },
                  );
                  const imageAlt = `${project.title} project image ${sourceIndex + 1}`;

                  return (
                    <button
                      key={`${src}-${sourceIndex}`}
                      type="button"
                      onClick={() => setFullscreenIndex(sourceIndex)}
                      aria-label={`Open ${imageAlt} in fullscreen`}
                      style={{
                        border: "none",
                        backgroundColor: isSurfaceDark ? "#0f0f0f" : "#ececec",
                        padding: 0,
                        margin: 0,
                        cursor: "zoom-in",
                        overflow: "hidden",
                        gridColumn: tilePreset.gridColumn,
                      }}
                    >
                      <img
                        src={optimizedSrc}
                        srcSet={srcSet}
                        sizes={
                          isMobile
                            ? isFullWidthTile
                              ? "100vw"
                              : "50vw"
                            : isFullWidthTile
                              ? "100vw"
                              : "50vw"
                        }
                        alt={imageAlt}
                        width={imageDimensions?.width}
                        height={imageDimensions?.height}
                        loading={sourceIndex <= 3 ? "eager" : "lazy"}
                        fetchPriority={sourceIndex <= 3 ? "high" : undefined}
                        decoding="async"
                        onError={handleImageError}
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "block",
                          objectFit: "cover",
                          aspectRatio: tilePreset.aspectRatio,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
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
