import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  formatMetaTitle,
  ORGANIZATION_LOGO_URL,
  ORGANIZATION_NAME,
  SITE_ORIGIN,
} from "@shared/siteSeo";
import type { Project } from "@shared/schema";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { portfolioFallbackProjects } from "@/data/atlaContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl, sanitizeImageUrls } from "@shared/imageDelivery";

type WorkProject = {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: string;
  region: string;
  country: string;
  industry: string;
  service: string;
  description: string;
  coverImage: string;
  images: string[];
  locationName: string;
  latitude: number | null;
  longitude: number | null;
};
type MasonryPhotoItem = {
  key: string;
  slug: string;
  title: string;
  imageSrc: string;
};

const LF_MEDIUM: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.1",
  color: "#222",
  margin: 0,
};

const LF_SMALL: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  color: "#222",
  textTransform: "uppercase",
  margin: 0,
};

const FILTERS = {
  region: ["All", "America", "Europe", "Asia", "Middle East"],
  year: ["All", "2023", "2024", "2025", "2026"],
  view: ["Masonry", "Grid", "List", "Timeline"],
  gridSize: ["Extra Large", "Large", "Small", "Extra Small"],
} as const;
const INDUSTRY_BASE_OPTIONS = ["Hospitality", "Food & Beverage", "Consumer Goods", "SaaS", "Digital"] as const;
const SERVICE_BASE_OPTIONS = ["Branding", "Art Direction", "Packaging", "Website"] as const;
const BACKGROUND_FILTERS = ["White", "Black", "Random", "System"] as const;
const SURFACE_PREFERENCE_STORAGE_KEY = "atla-surface-preference-v1";
const LIST_THUMBNAIL_COUNT = 4;
const MASONRY_INITIAL_ITEMS_DESKTOP = 20;
const MASONRY_INITIAL_ITEMS_MOBILE = 14;
const MASONRY_BATCH_DESKTOP = 12;
const MASONRY_BATCH_MOBILE = 8;
const WORK_PAGE_GUTTER_DESKTOP = 8;
const WORK_PAGE_GUTTER_MOBILE = 6;
const FILTER_COLUMN_GAP_DESKTOP = 12;
const FILTER_COLUMN_GAP_MOBILE = 3;
const FILTER_ROW_GAP_DESKTOP = 5;
const FILTER_ROW_GAP_MOBILE = 2;
const FILTER_OPTION_MIN_HEIGHT_DESKTOP = 16;
const FILTER_OPTION_MIN_HEIGHT_MOBILE = 16;
const FILTER_OPTION_MOBILE_FONT_SIZE = 12;
const FILTER_OPTION_MOBILE_PADDING = "0";
const GRID_SIZE_SHORT_LABEL: Record<(typeof FILTERS.gridSize)[number], string> = {
  "Extra Large": "XL",
  "Large": "L",
  "Small": "S",
  "Extra Small": "XS",
};

const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  US: "United States",
  USA: "United States",
  MX: "Mexico",
  MEX: "Mexico",
  VZ: "Venezuela",
  VE: "Venezuela",
  PE: "Peru",
  PER: "Peru",
  UK: "United Kingdom",
  GB: "United Kingdom",
  UAE: "United Arab Emirates",
  AE: "United Arab Emirates",
  ES: "Spain",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  BR: "Brazil",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  CA: "Canada",
};

const KNOWN_COUNTRY_NAMES = new Set<string>([
  ...Object.values(COUNTRY_CODE_TO_NAME),
  "Australia",
  "Austria",
  "Belgium",
  "Chile",
  "China",
  "Colombia",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Ireland",
  "Italy",
  "Japan",
  "Mexico",
  "Netherlands",
  "Peru",
  "Portugal",
  "Saudi Arabia",
  "Singapore",
  "South Korea",
  "Spain",
  "Switzerland",
  "Thailand",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Venezuela",
]);

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeCountryName(rawValue?: string | null) {
  if (!rawValue) return "";
  const trimmed = rawValue.trim();
  if (!trimmed) return "";
  const normalizedKey = trimmed.replace(/\./g, "").toUpperCase();
  if (COUNTRY_CODE_TO_NAME[normalizedKey]) return COUNTRY_CODE_TO_NAME[normalizedKey];
  return toTitleCase(trimmed);
}

function inferCountryFromLocation(locationName?: string | null) {
  if (!locationName) return "";
  const parts = locationName
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return "";
  const inferred = normalizeCountryName(parts[parts.length - 1]);
  return KNOWN_COUNTRY_NAMES.has(inferred) ? inferred : "";
}

function fallbackImageForProject(index: number) {
  return portfolioFallbackProjects[index % portfolioFallbackProjects.length]?.coverImage || "/figmaAssets/media.png";
}

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

function contrastRatio(backgroundHex: string, textHex: string) {
  const backgroundLum = relativeLuminance(backgroundHex);
  const textLum = relativeLuminance(textHex);
  const lighter = Math.max(backgroundLum, textLum);
  const darker = Math.min(backgroundLum, textLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function getRandomAccessibleColor() {
  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const randomColor = `#${toHex(Math.floor(Math.random() * 256))}${toHex(Math.floor(Math.random() * 256))}${toHex(Math.floor(Math.random() * 256))}`;
    const blackContrast = contrastRatio(randomColor, "#111111");
    const whiteContrast = contrastRatio(randomColor, "#f5f5f5");

    if (Math.max(blackContrast, whiteContrast) >= 4.5) {
      return randomColor;
    }
  }

  return "#d9d9d9";
}

function getSystemSurfaceColor() {
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "#111111";
  }

  return "#fafafa";
}

function pickMatchingValue(input: string, options: readonly string[]) {
  const normalizedInput = input.trim().toLowerCase();
  if (!normalizedInput) return "";
  return options.find((option) => option.toLowerCase() === normalizedInput) || "";
}

function uniqueCaseInsensitive(values: string[]) {
  const deduped = new Map<string, string>();
  for (const rawValue of values) {
    const value = rawValue.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (!deduped.has(key)) deduped.set(key, value);
  }
  return Array.from(deduped.values());
}

function buildFacetOptions(values: string[], preferredOrder: readonly string[]) {
  const normalizedValues = uniqueCaseInsensitive(values);
  const orderedFromPreference = preferredOrder.filter((preferred) =>
    normalizedValues.some((value) => value.toLowerCase() === preferred.toLowerCase()),
  );
  const leftovers = normalizedValues
    .filter((value) => !preferredOrder.some((preferred) => preferred.toLowerCase() === value.toLowerCase()))
    .sort((left, right) => left.localeCompare(right));

  return ["All", ...orderedFromPreference, ...leftovers];
}

function resolveIndustryValue(project: Project) {
  const projectRecord = project as Project & { industry?: string; tags?: string[] };
  const directIndustry = typeof projectRecord.industry === "string" ? projectRecord.industry.trim() : "";
  if (directIndustry) return directIndustry;

  const industryFromTags = Array.isArray(projectRecord.tags)
    ? projectRecord.tags
        .map((tag) => pickMatchingValue(tag, INDUSTRY_BASE_OPTIONS))
        .find(Boolean)
    : "";

  return industryFromTags || "Unspecified";
}

function resolveServiceValue(project: Project) {
  const projectRecord = project as Project & { services?: string[]; service?: string };
  const directService = typeof projectRecord.service === "string" ? projectRecord.service.trim() : "";
  if (directService) return directService;

  const serviceFromArray = Array.isArray(projectRecord.services)
    ? projectRecord.services
        .map((item) => item.trim())
        .find(Boolean)
    : "";

  return serviceFromArray || "Unspecified";
}

function normalizeProjects(projects?: Project[]): WorkProject[] {
  if (!projects || projects.length === 0) return [];

  return projects.map((project, index) => {
    const projectWithLocation = project as Project & {
      country?: string;
      locationName?: string;
      latitude?: number | null;
      longitude?: number | null;
    };
    const inferredCountry = normalizeCountryName(projectWithLocation.country) || inferCountryFromLocation(projectWithLocation.locationName);
    const fallbackCover = fallbackImageForProject(index);
    const galleryImages = sanitizeImageUrls(
      Array.isArray(project.images)
        ? project.images.filter((item) => typeof item === "string" && item.length > 0)
        : [],
    );
    const resolvedCoverImage =
      sanitizeImageUrls([project.coverImage, ...galleryImages, fallbackCover])[0] || "/figmaAssets/media.png";
    const normalizedGallery = galleryImages.filter((src) => src !== resolvedCoverImage);

    const regionMatch = pickMatchingValue(project.region || "", FILTERS.region);

    return {
    slug: project.slug,
    title: project.title,
    client: project.client,
    year: project.year,
    category: project.category,
    region: regionMatch || "America",
    country: inferredCountry,
    industry: resolveIndustryValue(project),
    service: resolveServiceValue(project),
    description: project.description,
    coverImage: resolvedCoverImage,
    images: normalizedGallery,
    locationName: projectWithLocation.locationName || "",
    latitude: Number.isFinite(projectWithLocation.latitude) ? Number(projectWithLocation.latitude) : null,
    longitude: Number.isFinite(projectWithLocation.longitude) ? Number(projectWithLocation.longitude) : null,
  };
  });
}

function FilterColumn({
  label,
  options,
  value,
  onChange,
  primaryColor,
  mutedColor,
  children,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  primaryColor: string;
  mutedColor: string;
  children?: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const optionMinHeight = isMobile ? FILTER_OPTION_MIN_HEIGHT_MOBILE : FILTER_OPTION_MIN_HEIGHT_DESKTOP;
  const optionPadding = isMobile ? FILTER_OPTION_MOBILE_PADDING : "2px 2px";
  const optionGap = isMobile ? FILTER_ROW_GAP_MOBILE : FILTER_ROW_GAP_DESKTOP;

  if (isMobile) {
    return (
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: optionGap }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: FILTER_COLUMN_GAP_MOBILE, rowGap: FILTER_ROW_GAP_MOBILE }}>
          <p style={{ ...LF_SMALL, color: primaryColor }}>{label}</p>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              style={{
                ...LF_MEDIUM,
                fontSize: FILTER_OPTION_MOBILE_FONT_SIZE,
                color: value === option ? primaryColor : mutedColor,
                border: "none",
                background: "none",
                textAlign: "left",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-start",
                minWidth: 24,
                minHeight: optionMinHeight,
                padding: optionPadding,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {option}
            </button>
          ))}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: optionGap }}>
      <p style={{ ...LF_SMALL, color: primaryColor }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: optionGap }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            style={{
              ...LF_MEDIUM,
              color: value === option ? primaryColor : mutedColor,
              border: "none",
              background: "none",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              width: "100%",
              minWidth: 0,
              minHeight: optionMinHeight,
              padding: optionPadding,
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

export default function AtlaWork() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState<string>("All");
  const [industry, setIndustry] = useState<string>("All");
  const [service, setService] = useState<string>("All");
  const [year, setYear] = useState<string>("All");
  const [view, setView] = useState<string>("Masonry");
  const [gridSize, setGridSize] = useState<string>("Large");
  const [backgroundMode, setBackgroundMode] = useState<(typeof BACKGROUND_FILTERS)[number]>("System");
  const [surfaceColor, setSurfaceColor] = useState(getSystemSurfaceColor);
  const [commandFocusSlug, setCommandFocusSlug] = useState<string | null>(null);
  const [visibleMasonryCount, setVisibleMasonryCount] = useState(
    isMobile ? MASONRY_INITIAL_ITEMS_MOBILE : MASONRY_INITIAL_ITEMS_DESKTOP,
  );

  const { data } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const projects = useMemo(() => normalizeProjects(data), [data]);
  const industryOptions = useMemo(
    () => buildFacetOptions(projects.map((project) => project.industry), INDUSTRY_BASE_OPTIONS),
    [projects],
  );
  const serviceOptions = useMemo(
    () => buildFacetOptions(projects.map((project) => project.service), SERVICE_BASE_OPTIONS),
    [projects],
  );
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (region !== "All" && project.region !== region) return false;
        if (industry !== "All" && project.industry !== industry) return false;
        if (service !== "All" && project.service !== service) return false;
        if (year !== "All" && String(project.year) !== year) return false;
        if (searchQuery) {
          const haystack = [
            project.title,
            project.client,
            project.category,
            project.region,
            project.industry,
            project.service,
            project.description,
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(searchQuery.toLowerCase())) return false;
        }
        return true;
      }),
    [industry, projects, region, searchQuery, service, year],
  );
  const masonryPhotoPool = useMemo<MasonryPhotoItem[]>(() => {
    const allItems: MasonryPhotoItem[] = [];

    for (const project of filteredProjects) {
      const uniqueImages = Array.from(
        new Set([project.coverImage, ...project.images].filter((src) => typeof src === "string" && src.length > 0)),
      );

      uniqueImages.forEach((imageSrc, imageIndex) => {
        allItems.push({
          key: `${project.slug}-${imageIndex}-${imageSrc}`,
          slug: project.slug,
          title: project.title,
          imageSrc,
        });
      });
    }

    const shuffled = [...allItems];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
  }, [filteredProjects]);

  const timelineProjects = useMemo(
    () => [...filteredProjects].sort((left, right) => left.year - right.year),
    [filteredProjects],
  );

  useEffect(() => {
    if (view !== "Masonry") return;
    setVisibleMasonryCount(isMobile ? MASONRY_INITIAL_ITEMS_MOBILE : MASONRY_INITIAL_ITEMS_DESKTOP);
  }, [isMobile, masonryPhotoPool, view]);

  useEffect(() => {
    if (view !== "Masonry" || typeof window === "undefined") return;

    const batchSize = isMobile ? MASONRY_BATCH_MOBILE : MASONRY_BATCH_DESKTOP;
    const onScroll = () => {
      const bottomThreshold = 560;
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      if (scrollBottom < pageHeight - bottomThreshold) return;

      setVisibleMasonryCount((current) => {
        if (current >= masonryPhotoPool.length) return current;
        return Math.min(current + batchSize, masonryPhotoPool.length);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, masonryPhotoPool.length, view]);

  const isSurfaceDark = useMemo(() => relativeLuminance(surfaceColor) < 0.35, [surfaceColor]);
  const primaryTextColor = isSurfaceDark ? "#f5f5f5" : "#222222";
  const mutedTextColor = isSurfaceDark ? "rgba(245,245,245,0.74)" : "#6f6f6f";
  const borderColor = isSurfaceDark ? "rgba(245,245,245,0.24)" : "#d8d8d8";
  const lcpPreloadImages = useMemo(() => {
    if (view === "Masonry") {
      return masonryPhotoPool
        .slice(0, 2)
        .map((item) => getOptimizedImageUrl(item.imageSrc, { width: isMobile ? 960 : 1600, quality: 90 }) || item.imageSrc);
    }

    if (view === "Timeline") {
      return timelineProjects
        .slice(0, 2)
        .map((project) => getOptimizedImageUrl(project.coverImage, { width: isMobile ? 960 : 1600, quality: 90 }) || project.coverImage);
    }

    return filteredProjects
      .slice(0, 2)
      .map((project) => getOptimizedImageUrl(project.coverImage, { width: isMobile ? 960 : 1600, quality: 90 }) || project.coverImage);
  }, [filteredProjects, isMobile, masonryPhotoPool, timelineProjects, view]);

  const resetArchiveState = (shouldScroll = true) => {
    setRegion("All");
    setIndustry("All");
    setService("All");
    setYear("All");
    setSearchQuery("");
    setCommandFocusSlug(null);
    applyBackgroundChoice("System");

    if (!shouldScroll || typeof window === "undefined") return;

    window.setTimeout(() => {
      document.getElementById("atla-work-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const element = event.currentTarget;
    if (element.dataset.fallbackApplied === "true") return;
    element.dataset.fallbackApplied = "true";
    element.src = "/figmaAssets/media.png";
    element.srcset = "";
  };

  const shareCurrentPage = async () => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;
    const shareTitle = document.title || "Atla";
    const shareText = "Take a look at this page from Atla.";

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch {
        // user cancelled or unsupported payload; continue with fallback
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        return;
      } catch {
        // continue with prompt fallback
      }
    }

    window.prompt("Copy this link", shareUrl);
  };


  const applyBackgroundChoice = (choice: (typeof BACKGROUND_FILTERS)[number]) => {
    setBackgroundMode(choice);
    if (choice === "White") {
      setSurfaceColor("#fafafa");
      return;
    }
    if (choice === "Black") {
      setSurfaceColor("#111111");
      return;
    }
    if (choice === "System") {
      setSurfaceColor(getSystemSurfaceColor());
      return;
    }
    setSurfaceColor(getRandomAccessibleColor());
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawValue = window.localStorage.getItem(SURFACE_PREFERENCE_STORAGE_KEY);
    if (!rawValue) return;

    try {
      const parsed = JSON.parse(rawValue) as { mode?: string; color?: string };
      const mode = parsed.mode;
      const color = parsed.color;
      if (!mode || !BACKGROUND_FILTERS.includes(mode as (typeof BACKGROUND_FILTERS)[number])) return;
      if (mode === "System") {
        setBackgroundMode("System");
        setSurfaceColor(getSystemSurfaceColor());
        return;
      }
      if (typeof color !== "string" || !color.trim()) return;
      setBackgroundMode(mode as (typeof BACKGROUND_FILTERS)[number]);
      setSurfaceColor(color);
    } catch {
      window.localStorage.removeItem(SURFACE_PREFERENCE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      SURFACE_PREFERENCE_STORAGE_KEY,
      JSON.stringify({ mode: backgroundMode, color: surfaceColor }),
    );
  }, [backgroundMode, surfaceColor]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (backgroundMode !== "System") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemSurface = () => setSurfaceColor(mediaQuery.matches ? "#111111" : "#fafafa");

    syncSystemSurface();
    mediaQuery.addEventListener("change", syncSystemSurface);
    return () => mediaQuery.removeEventListener("change", syncSystemSurface);
  }, [backgroundMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSearchQuery((params.get("q") || "").trim());
  }, [location]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onCommand = (event: Event) => {
      const customEvent = event as CustomEvent<{
        type?: string;
        value?: string;
      }>;
      const type = customEvent.detail?.type;
      const value = customEvent.detail?.value;
      if (!type) return;

      if (type === "search" && typeof value === "string") {
        setSearchQuery(value.trim());
        window.setTimeout(() => {
          document.getElementById("atla-work-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
        return;
      }

      if (type === "focus-project" && typeof value === "string") {
        const projectMatch = projects.find((project) => project.slug === value);
        if (!projectMatch) return;
        setRegion("All");
        setIndustry("All");
        setService("All");
        setYear("All");
        setView("Grid");
        setSearchQuery(projectMatch.title);
        setCommandFocusSlug(projectMatch.slug);
        window.setTimeout(() => {
          document.querySelector<HTMLElement>(`[data-project-slug="${projectMatch.slug}"]`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 140);
        return;
      }

      if (type === "clear-filters") {
        resetArchiveState();
        return;
      }

      if (type === "set-view" && typeof value === "string" && FILTERS.view.includes(value as (typeof FILTERS.view)[number])) {
        setView(value);
        return;
      }

      if (type === "set-background" && typeof value === "string" && BACKGROUND_FILTERS.includes(value as (typeof BACKGROUND_FILTERS)[number])) {
        applyBackgroundChoice(value as (typeof BACKGROUND_FILTERS)[number]);
        return;
      }

      if (type === "set-grid-size" && typeof value === "string" && FILTERS.gridSize.includes(value as (typeof FILTERS.gridSize)[number])) {
        setView("Grid");
        setGridSize(value);
      }
    };

    window.addEventListener("atla:command", onCommand as EventListener);
    return () => window.removeEventListener("atla:command", onCommand as EventListener);
  }, []);

  useEffect(() => {
    if (!commandFocusSlug) return;
    const timeoutId = window.setTimeout(() => setCommandFocusSlug(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [commandFocusSlug]);

  const columnCount = isMobile
    ? 1
    : view === "Timeline" || view === "List"
      ? 1
      : view === "Grid"
        ? gridSize === "Extra Small"
          ? 6
          : gridSize === "Small"
            ? 5
            : gridSize === "Large"
              ? 3
              : 2
        : 4;
  const isRootRoute = location === "/";
  const pageTitle = isRootRoute
    ? formatMetaTitle("Atla", "Strategy-Led Branding Studio")
    : formatMetaTitle("Selected Branding, Packaging, and Digital Work", "Atla");
  const pageDescription = isRootRoute
    ? "Atla is a strategy-led branding studio for companies across the US and Latin America."
    : "Browse selected Atla work across branding, packaging, art direction, and digital design for hospitality, consumer, and technology clients.";
  const canonicalPath = "/";
  const robots = isRootRoute ? "index,follow" : "noindex,follow";
  const isListView = view === "List";
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: SITE_ORIGIN,
    logo: ORGANIZATION_LOGO_URL,
    sameAs: [
      "https://www.instagram.com/atla.studio",
      "https://www.behance.net/atla",
      "https://www.linkedin.com",
    ],
    areaServed: ["United States", "Latin America"],
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Atla selected work",
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: filteredProjects.length,
    itemListElement: filteredProjects.slice(0, 64).map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: `${SITE_ORIGIN}/projects/${project.slug}`,
    })),
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: surfaceColor,
        ["--atla-surface-color" as string]: surfaceColor,
        ["--atla-text-color" as string]: primaryTextColor,
      }}
    >
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        pathname={canonicalPath}
        robots={robots}
        image={filteredProjects[0]?.coverImage || undefined}
        preloadImages={lcpPreloadImages}
        structuredData={[organizationSchema, itemListSchema]}
      />
      <div className="atla-dark-surface">
      <main style={{ width: "100%", position: "relative", minHeight: 750 }}>
        <div
          className="atla-enter"
          style={{
            padding: isMobile
              ? `4px ${WORK_PAGE_GUTTER_MOBILE}px 12px`
              : isListView
                ? `0 ${WORK_PAGE_GUTTER_DESKTOP}px 56px`
                : `0 ${WORK_PAGE_GUTTER_DESKTOP}px 56px`,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 20 : isListView ? 112 : 12,
          }}
        >
          <h1
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            Selected Atla branding and digital work
          </h1>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isListView ? "repeat(4, minmax(0, 1fr))" : "repeat(7, minmax(0, 1fr))",
              columnGap: isMobile ? FILTER_COLUMN_GAP_MOBILE : isListView ? 20 : FILTER_COLUMN_GAP_DESKTOP,
              rowGap: isMobile ? FILTER_ROW_GAP_MOBILE : FILTER_ROW_GAP_DESKTOP,
              width: "100%",
              maxWidth: isListView && !isMobile ? 1160 : "none",
              margin: isMobile ? "0 auto" : isListView ? "200px auto 0" : "8px auto 0",
            }}
          >
            {isListView ? (
              <>
                <FilterColumn label="( Industry )" options={industryOptions} value={industry} onChange={setIndustry} primaryColor={primaryTextColor} mutedColor={mutedTextColor} />
                <FilterColumn label="( Service )" options={serviceOptions} value={service} onChange={setService} primaryColor={primaryTextColor} mutedColor={mutedTextColor} />
                <FilterColumn label="( Region )" options={FILTERS.region} value={region} onChange={setRegion} primaryColor={primaryTextColor} mutedColor={mutedTextColor} />
              </>
            ) : (
              <>
                <FilterColumn label="( Region )" options={FILTERS.region} value={region} onChange={setRegion} primaryColor={primaryTextColor} mutedColor={mutedTextColor} />
                <FilterColumn label="( Industry )" options={industryOptions} value={industry} onChange={setIndustry} primaryColor={primaryTextColor} mutedColor={mutedTextColor} />
                <FilterColumn label="( Service )" options={serviceOptions} value={service} onChange={setService} primaryColor={primaryTextColor} mutedColor={mutedTextColor} />
                <FilterColumn label="( Year )" options={FILTERS.year} value={year} onChange={setYear} primaryColor={primaryTextColor} mutedColor={mutedTextColor} />
              </>
            )}
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: isMobile ? FILTER_ROW_GAP_MOBILE : FILTER_ROW_GAP_DESKTOP }}>
              <p style={{ ...LF_SMALL, color: primaryTextColor }}>( View )</p>
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? FILTER_ROW_GAP_MOBILE : FILTER_ROW_GAP_DESKTOP }}>
                {FILTERS.view.map((option) => {
                  const isGridOption = option === "Grid";
                  const isGridActive = view === "Grid";
                  const isOptionActive = view === option;

                  return (
                    <div key={option}>
                      {isGridOption ? (
                        <div
                          style={{
                            ...LF_MEDIUM,
                            fontSize: isMobile ? FILTER_OPTION_MOBILE_FONT_SIZE : LF_MEDIUM.fontSize,
                            color: isOptionActive ? primaryTextColor : mutedTextColor,
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            flexWrap: isMobile ? "wrap" : "nowrap",
                            gap: isMobile ? 4 : 2,
                            width: "100%",
                            whiteSpace: "nowrap",
                            minHeight: isMobile ? FILTER_OPTION_MIN_HEIGHT_MOBILE : FILTER_OPTION_MIN_HEIGHT_DESKTOP,
                            padding: isMobile ? FILTER_OPTION_MOBILE_PADDING : "2px 2px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setView("Grid")}
                            style={{
                              ...LF_MEDIUM,
                              fontSize: isMobile ? FILTER_OPTION_MOBILE_FONT_SIZE : LF_MEDIUM.fontSize,
                              color: isOptionActive ? primaryTextColor : mutedTextColor,
                              border: "none",
                              background: "none",
                              borderRadius: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              minWidth: isMobile ? 24 : 0,
                              minHeight: isMobile ? FILTER_OPTION_MIN_HEIGHT_MOBILE : FILTER_OPTION_MIN_HEIGHT_DESKTOP,
                              padding: 0,
                              margin: 0,
                              whiteSpace: "nowrap",
                              cursor: "pointer",
                            }}
                          >
                            Grid
                          </button>
                          <span style={{ ...LF_MEDIUM, color: mutedTextColor }}>-</span>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: isMobile ? 4 : 2, flexWrap: "nowrap", whiteSpace: "nowrap" }}>
                            {FILTERS.gridSize.map((sizeOption) => (
                              <button
                                key={sizeOption}
                                type="button"
                                onClick={() => {
                                  setView("Grid");
                                  setGridSize(sizeOption);
                                }}
                                style={{
                                  ...LF_MEDIUM,
                                  fontSize: isMobile ? FILTER_OPTION_MOBILE_FONT_SIZE : LF_MEDIUM.fontSize,
                                  color: isGridActive && gridSize === sizeOption ? primaryTextColor : mutedTextColor,
                                  border: "none",
                                  background: "none",
                                  borderRadius: 0,
                                  textAlign: "left",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  minWidth: isMobile ? 24 : 0,
                                  minHeight: isMobile ? FILTER_OPTION_MIN_HEIGHT_MOBILE : FILTER_OPTION_MIN_HEIGHT_DESKTOP,
                                  padding: 0,
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                  flexShrink: 0,
                                }}
                              >
                                {GRID_SIZE_SHORT_LABEL[sizeOption]}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {!isGridOption ? (
                        <button
                          type="button"
                          onClick={() => setView(option)}
                          style={{
                            ...LF_MEDIUM,
                            fontSize: isMobile ? FILTER_OPTION_MOBILE_FONT_SIZE : LF_MEDIUM.fontSize,
                            color: isOptionActive ? primaryTextColor : mutedTextColor,
                            border: "none",
                            background: "none",
                            borderRadius: 0,
                            WebkitTapHighlightColor: "transparent",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            minWidth: isMobile ? 24 : 0,
                            width: "100%",
                            minHeight: isMobile ? FILTER_OPTION_MIN_HEIGHT_MOBILE : FILTER_OPTION_MIN_HEIGHT_DESKTOP,
                            padding: isMobile ? FILTER_OPTION_MOBILE_PADDING : "2px 2px",
                            cursor: "pointer",
                          }}
                        >
                          {option}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
            {!isListView ? (
              <>
                <FilterColumn
                  label="( Background )"
                  options={BACKGROUND_FILTERS}
                  value={backgroundMode}
                  onChange={(value) => applyBackgroundChoice(value as (typeof BACKGROUND_FILTERS)[number])}
                  primaryColor={primaryTextColor}
                  mutedColor={mutedTextColor}
                />
                <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: isMobile ? FILTER_ROW_GAP_MOBILE : FILTER_ROW_GAP_DESKTOP }}>
                  <p style={{ ...LF_SMALL, color: primaryTextColor }}>( Actions )</p>
                  <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", flexWrap: isMobile ? "wrap" : "nowrap", gap: isMobile ? FILTER_COLUMN_GAP_MOBILE : FILTER_ROW_GAP_DESKTOP }}>
                    <button
                      type="button"
                      onClick={() => resetArchiveState()}
                      style={{
                        ...LF_MEDIUM,
                        fontSize: isMobile ? FILTER_OPTION_MOBILE_FONT_SIZE : LF_MEDIUM.fontSize,
                        color: mutedTextColor,
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: isMobile ? FILTER_OPTION_MIN_HEIGHT_MOBILE : FILTER_OPTION_MIN_HEIGHT_DESKTOP,
                        minWidth: isMobile ? 24 : 0,
                        padding: isMobile ? FILTER_OPTION_MOBILE_PADDING : "2px 2px",
                        cursor: "pointer",
                      }}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={shareCurrentPage}
                      style={{
                        ...LF_MEDIUM,
                        fontSize: isMobile ? FILTER_OPTION_MOBILE_FONT_SIZE : LF_MEDIUM.fontSize,
                        color: mutedTextColor,
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: isMobile ? FILTER_OPTION_MIN_HEIGHT_MOBILE : FILTER_OPTION_MIN_HEIGHT_DESKTOP,
                        minWidth: isMobile ? 24 : 0,
                        padding: isMobile ? FILTER_OPTION_MOBILE_PADDING : "2px 2px",
                        cursor: "pointer",
                      }}
                    >
                      Share
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div id="atla-work-results" style={{ width: "100%", maxWidth: isListView && !isMobile ? 1160 : "none", margin: "0 auto" }}>
          <section className="sr-only" aria-label="Work archive context">
            <h2>About the Atla work archive</h2>
            <p>
              This work archive presents selected branding, identity, packaging, and digital projects developed by
              Atla for companies across hospitality, consumer products, wellness, and technology. Each case study is
              documented to show how strategy decisions become visual systems, launch assets, and ongoing brand
              behavior across real customer touchpoints.
            </p>
            <p>
              The filters are structured so users can compare work by region, industry, service type, and year. The
              different visual views support different tasks: masonry for visual discovery, grid for controlled
              comparison, list for quick project scanning, and timeline for chronological context. This makes the
              archive useful both for inspiration and for practical vendor evaluation.
            </p>
            <p>
              Atla operates between Mexico City and Austin with clients across the United States and Latin America.
              Typical engagements begin when a team needs stronger positioning, better identity coherence, or clearer
              digital execution before a launch. The archive reflects a consistent standard: strategic clarity,
              recognizable craft, and systems that remain reliable after launch.
            </p>
            <p>
              For procurement teams, this page is also a practical reference for evaluating fit: project types,
              categories, regional contexts, and visible outputs are all indexed in one place. Instead of presenting
              isolated visuals, the archive groups work by the strategic role it played in growth, repositioning,
              launch readiness, and customer experience consistency.
            </p>
            <p>
              The long-term intent is operational clarity. Teams should be able to identify relevant examples fast,
              see proof of execution quality, and move from inspiration to scoped conversation without switching tools
              or opening new pages for basic qualification.
            </p>
            <p>
              The archive also highlights how different categories can still feel like one brand when strategy,
              identity, and execution are aligned from the start.
            </p>
          </section>
          {view === "Timeline" ? (
            <div
              className="atla-hide-scrollbar"
              style={{
                overflowX: "auto",
                paddingBottom: isMobile ? 8 : 12,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div style={{ ...LF_SMALL, color: mutedTextColor, marginBottom: 16 }}>Scroll horizontally</div>
              <div
                style={{
                  position: "relative",
                  width: "max-content",
                  minWidth: "100%",
                  display: "flex",
                  gap: isMobile ? 16 : 24,
                  alignItems: "flex-end",
                  padding: isMobile ? "8px 0 28px" : "18px 0 32px",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: isMobile ? 13 : 15,
                    height: 1,
                    backgroundColor: borderColor,
                  }}
                />
                {timelineProjects.map((project, index) => {
                  const imageDimensions = getImageDimensions(project.coverImage);
                  const targetWidth = isMobile ? 960 : 1400;
                  const optimizedSrc = getOptimizedImageUrl(project.coverImage, { width: targetWidth, quality: 90 }) || project.coverImage;
                  const srcSet = buildImageSrcSet(project.coverImage, [Math.round(targetWidth / 2), Math.round(targetWidth * 0.75), targetWidth], { quality: 90 });
                  const stagger = !isMobile && index % 2 === 1 ? 60 : 0;

                  return (
                    <a
                      key={project.slug}
                      href={`/projects/${project.slug}`}
                      aria-label={`Open project ${project.title}`}
                      className="atla-card"
                      style={{
                        width: isMobile ? 250 : 320,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        textDecoration: "none",
                        marginTop: stagger,
                      }}
                    >
                      <p style={{ ...LF_SMALL, color: primaryTextColor }}>{project.year}</p>
                      <div style={{ position: "relative", width: "100%", aspectRatio: "1.25 / 1", backgroundColor: "#ece9e2", overflow: "hidden" }}>
                        <img
                          src={optimizedSrc}
                          srcSet={srcSet}
                          sizes={isMobile ? "250px" : "320px"}
                          alt={project.title}
                          width={imageDimensions?.width}
                          height={imageDimensions?.height}
                          loading={index < 2 ? "eager" : "lazy"}
                          fetchPriority={index < 2 ? "high" : undefined}
                          decoding="async"
                          onError={handleImageError}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                      <p style={{ ...LF_MEDIUM, fontSize: 14, color: primaryTextColor }}>{project.title}</p>
                      <p style={{ ...LF_MEDIUM, fontSize: 12, color: mutedTextColor, lineHeight: "1.4" }}>
                        {project.category} • {project.region}
                      </p>
                      <div style={{ alignSelf: "center", width: 1, height: isMobile ? 12 : 16, backgroundColor: borderColor }} />
                      <div style={{ alignSelf: "center", width: 8, height: 8, borderRadius: "50%", backgroundColor: primaryTextColor }} />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : view === "List" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 48 : 68 }}>
              {filteredProjects.map((project, index) => {
                const baseListPhotos = [project.coverImage, ...project.images]
                  .filter((src, imageIndex, sources) => Boolean(src) && sources.indexOf(src) === imageIndex);
                const listPhotos = Array.from({ length: LIST_THUMBNAIL_COUNT }, (_, photoIndex) =>
                  baseListPhotos.length > 0
                    ? baseListPhotos[photoIndex % baseListPhotos.length]
                    : project.coverImage,
                );

                return (
                  <a
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    aria-label={`Open project ${project.title}`}
                    data-project-slug={project.slug}
                    className="atla-card"
                    style={{
                      textDecoration: "none",
                      display: "grid",
                      gap: isMobile ? 18 : 34,
                      borderBottom: "none",
                      padding: 0,
                      backgroundColor: commandFocusSlug === project.slug ? (isSurfaceDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)") : "transparent",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "157px 433px 295px 1fr",
                        columnGap: isMobile ? 0 : 0,
                        rowGap: isMobile ? 7 : 12,
                        alignItems: "start",
                        minWidth: 0,
                      }}
                    >
                      <p style={{ ...LF_MEDIUM, fontSize: isMobile ? 12 : 12, color: primaryTextColor, lineHeight: "1.2", minWidth: 0 }}>{project.title}</p>
                      <p style={{ ...LF_MEDIUM, fontSize: isMobile ? 12 : 12, color: mutedTextColor, lineHeight: "1.2", minWidth: 0 }}>
                        {[project.service, project.industry].filter(Boolean).join(", ")}
                      </p>
                      <p style={{ ...LF_MEDIUM, fontSize: isMobile ? 12 : 12, color: mutedTextColor, lineHeight: "1.2", minWidth: 0 }}>{project.region || project.country || "—"}</p>
                      <p style={{ ...LF_MEDIUM, fontSize: isMobile ? 12 : 12, color: primaryTextColor, lineHeight: "1.2", minWidth: 0 }}>{project.year}</p>
                      <p
                        style={{
                          ...LF_MEDIUM,
                          gridColumn: isMobile ? "auto" : "1 / span 2",
                          maxWidth: isMobile ? "100%" : 432,
                          fontSize: isMobile ? 12 : 12,
                          color: primaryTextColor,
                          lineHeight: "1.2",
                          minWidth: 0,
                        }}
                      >
                        {project.description}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : `repeat(${LIST_THUMBNAIL_COUNT}, minmax(0, 1fr))`,
                        gap: isMobile ? 8 : 20,
                        width: "100%",
                      }}
                    >
                      {listPhotos.map((photoSrc, photoIndex) => {
                        const photoDimensions = getImageDimensions(photoSrc);
                        const optimizedPhotoSrc = getOptimizedImageUrl(photoSrc, { width: isMobile ? 700 : 900, quality: 90 }) || photoSrc;
                        const photoSrcSet = buildImageSrcSet(photoSrc, isMobile ? [360, 520, 700] : [520, 700, 900], { quality: 90 });
                        return (
                          <div key={`${project.slug}-list-photo-${photoIndex}`} style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", backgroundColor: "#ece9e2", overflow: "hidden" }}>
                            <img
                              src={optimizedPhotoSrc}
                              srcSet={photoSrcSet}
                              sizes={isMobile ? "50vw" : "25vw"}
                              alt={`${project.title} photo ${photoIndex + 1}`}
                              width={photoDimensions?.width}
                              height={photoDimensions?.height}
                              loading={index < 1 && photoIndex < 4 ? "eager" : "lazy"}
                              fetchPriority={index < 1 && photoIndex < 4 ? "high" : undefined}
                              decoding="async"
                              onError={handleImageError}
                              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </a>
                );
              })}
            </div>
          ) : view === "Masonry" ? (
            <div
              style={{
                columnCount: isMobile ? 1 : 5,
                columnGap: isMobile ? 10 : 14,
                width: "100%",
                backgroundColor: surfaceColor,
                padding: isMobile ? 0 : 0,
                boxSizing: "border-box",
              }}
            >
              {masonryPhotoPool.slice(0, visibleMasonryCount).map((item, index) => {
                const imageDimensions = getImageDimensions(item.imageSrc);
                const targetWidth = isMobile ? 1200 : 1500;
                const optimizedSrc = getOptimizedImageUrl(item.imageSrc, { width: targetWidth, quality: 90 }) || item.imageSrc;
                const srcSet = buildImageSrcSet(item.imageSrc, [Math.round(targetWidth / 2), Math.round(targetWidth * 0.75), targetWidth], { quality: 90 });
                const shouldPrioritize = index < 2;
                const masonryAspectRatios = ["0.72 / 1", "1.35 / 1", "0.88 / 1", "1.08 / 1", "0.78 / 1", "1.2 / 1", "0.95 / 1"];
                const aspectRatio = isMobile ? "1 / 1" : masonryAspectRatios[index % masonryAspectRatios.length];

                return (
                  <a
                    key={item.key}
                    href={`/projects/${item.slug}`}
                    aria-label={`Open project ${item.title}`}
                    data-project-slug={item.slug}
                    className="atla-card"
                    style={{
                      display: "inline-block",
                      width: "100%",
                      marginBottom: isMobile ? 10 : 14,
                      textDecoration: "none",
                      breakInside: "avoid",
                      backgroundColor: surfaceColor,
                      boxShadow: commandFocusSlug === item.slug ? `0 0 0 2px ${primaryTextColor}` : "none",
                    }}
                  >
                    <span className="sr-only">Open project {item.title}</span>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio,
                        backgroundColor: "#111",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={optimizedSrc}
                        srcSet={srcSet}
                        sizes={isMobile ? "calc(100vw - 40px)" : "20vw"}
                        alt={item.title}
                        width={imageDimensions?.width}
                        height={imageDimensions?.height}
                        loading={shouldPrioritize ? "eager" : "lazy"}
                        fetchPriority={shouldPrioritize ? "high" : undefined}
                        decoding="async"
                        onError={handleImageError}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                gap: isMobile ? 40 : view === "Grid" && (gridSize === "Small" || gridSize === "Extra Small") ? 10 : 15,
                rowGap: isMobile ? 36 : view === "Grid" && (gridSize === "Small" || gridSize === "Extra Small") ? 30 : 80,
                alignItems: "start",
              }}
            >
              {filteredProjects.map((project, index) => {
                const targetWidth = isMobile
                  ? 900
                  : view === "Grid" && gridSize === "Extra Small"
                      ? 760
                      : view === "Grid" && gridSize === "Small"
                        ? 880
                        : view === "Grid" && gridSize === "Extra Large"
                          ? 1600
                          : 1200;
                const cardImages = [project.coverImage];
                const shouldPrioritize = index < 2;
                return (
                  <a
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    aria-label={`Open project ${project.title}`}
                    data-project-slug={project.slug}
                    className="atla-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: view === "Grid" && (gridSize === "Small" || gridSize === "Extra Small") ? 6 : 10,
                      textDecoration: "none",
                      minHeight: 56,
                      paddingBottom: 6,
                      boxShadow: commandFocusSlug === project.slug ? `0 0 0 2px ${primaryTextColor}` : "none",
                    }}
                    >
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cardImages.length || 1}, minmax(0, 1fr))`, gap: view === "Grid" ? 6 : 0 }}>
                      {cardImages.map((imageSrc, imageIndex) => {
                        const imageDimensions = getImageDimensions(imageSrc);
                        const optimizedSrc = getOptimizedImageUrl(imageSrc, { width: targetWidth, quality: 90 }) || imageSrc;
                        const srcSet = buildImageSrcSet(imageSrc, [Math.round(targetWidth / 2), Math.round(targetWidth * 0.75), targetWidth], { quality: 90 });
                        return (
                          <div
                            key={`${project.slug}-${imageSrc}-${imageIndex}`}
                            style={{
                              position: "relative",
                              width: "100%",
                              aspectRatio: isMobile ? "290 / 290" : "1 / 1",
                              backgroundColor: "#ece9e2",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={optimizedSrc}
                              srcSet={srcSet}
                              sizes={
                                isMobile
                                  ? "calc(100vw - 20px)"
                                  : view === "Grid" && (gridSize === "Small" || gridSize === "Extra Small")
                                    ? "20vw"
                                    : "25vw"
                              }
                              alt={`${project.title} ${imageIndex + 1}`}
                              width={imageDimensions?.width}
                              height={imageDimensions?.height}
                              loading={shouldPrioritize && imageIndex === 0 ? "eager" : "lazy"}
                              fetchPriority={shouldPrioritize && imageIndex === 0 ? "high" : undefined}
                              decoding="async"
                              onError={handleImageError}
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: view === "Grid" && (gridSize === "Small" || gridSize === "Extra Small") ? 4 : 8 }}>
                      <p style={{ ...LF_MEDIUM, fontSize: isMobile ? 12 : view === "Grid" && (gridSize === "Small" || gridSize === "Extra Small") ? 12 : 14, color: mutedTextColor }}>{project.title}</p>
                      {isMobile ? (
                        <p style={{ ...LF_MEDIUM, fontSize: 12, color: mutedTextColor, lineHeight: "1.4" }}>
                          {project.category} • {project.year} • {project.description}
                        </p>
                      ) : null}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
