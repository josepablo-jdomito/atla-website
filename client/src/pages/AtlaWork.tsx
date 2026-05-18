import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatMetaTitle } from "@shared/siteSeo";
import type { Project } from "@shared/schema";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { portfolioFallbackProjects } from "@/data/atlaContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

type WorkProject = {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: string;
  region: string;
  industry: string;
  service: string;
  description: string;
  coverImage: string;
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

const MUTED_TEXT = "#6f6f6f";

const BODY_COPY: React.CSSProperties = {
  ...LF_MEDIUM,
  fontSize: 16,
  lineHeight: "1.5",
};

const FILTERS = {
  region: ["All", "America", "Europe", "Asia", "Middle East"],
  industry: ["All", "Hospitality", "Food & Beverage", "Consumer Goods", "SaaS", "Digital"],
  service: ["All", "Branding", "Art Direction", "Packaging", "Website"],
  view: ["Masonry", "Grid", "List"],
} as const;

function normalizeProjects(projects?: Project[]): WorkProject[] {
  if (!projects || projects.length === 0) return [];

  return projects.map((project, index) => ({
    slug: project.slug,
    title: project.title,
    client: project.client,
    year: project.year,
    category: project.category,
    region: portfolioFallbackProjects[index % portfolioFallbackProjects.length]?.region ?? "America",
    industry: portfolioFallbackProjects[index % portfolioFallbackProjects.length]?.industry ?? "Digital",
    service: portfolioFallbackProjects[index % portfolioFallbackProjects.length]?.service ?? "Branding",
    description: project.description,
    coverImage: project.coverImage || portfolioFallbackProjects[index % portfolioFallbackProjects.length]?.coverImage || "/figmaAssets/media.png",
  }));
}

function FilterColumn({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const isMobile = useIsMobile();
  return (
    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: isMobile ? 14 : 10 }}>
      <p style={LF_SMALL}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 4 : 2 }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            style={{
              ...LF_MEDIUM,
              color: value === option ? "#222" : MUTED_TEXT,
              border: "none",
              background: "none",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              width: "100%",
              minHeight: isMobile ? 52 : 34,
              padding: isMobile ? "14px 6px" : "6px 2px",
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AtlaWork() {
  const isMobile = useIsMobile();
  const [region, setRegion] = useState<string>("All");
  const [industry, setIndustry] = useState<string>("All");
  const [service, setService] = useState<string>("All");
  const [view, setView] = useState<string>("Masonry");

  const { data } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const projects = useMemo(() => normalizeProjects(data), [data]);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (region !== "All" && project.region !== region) return false;
        if (industry !== "All" && project.industry !== industry) return false;
        if (service !== "All" && project.service !== service) return false;
        return true;
      }),
    [industry, projects, region, service],
  );

  const columnCount = isMobile ? 1 : view === "List" ? 1 : 4;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("Selected Branding, Packaging, and Digital Work", "Atla")}
        description="Browse selected Atla work across branding, packaging, art direction, and digital design for hospitality, consumer, and technology clients."
        pathname="/work"
        image={filteredProjects[0]?.coverImage || undefined}
      />
      <div className="atla-dark-surface">
      <main style={{ width: "100%", position: "relative", minHeight: 750 }}>
        <AtlaNav />

        <div
          className="atla-enter"
          style={{
            padding: isMobile ? "120px 10px 100px" : "200px 20px 200px",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 40 : 60,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: isMobile ? "100%" : 860 }}>
            <p style={LF_SMALL}>( Portfolio )</p>
            <p style={{ ...LF_MEDIUM, fontSize: isMobile ? 16 : 20, lineHeight: "1.4", maxWidth: 720 }}>
              Selected case studies across hospitality, consumer goods, health, and technology. Each project shows how
              strategy, identity, packaging, and digital design come together as one brand system.
            </p>
            <p style={{ ...BODY_COPY, maxWidth: 820 }}>
              Some engagements begin with a repositioning problem. Others start with a launch, a fragmented identity,
              or a digital presence that no longer reflects the level of the company behind it. This archive is a mix
              of those moments: identity systems, packaging work, digital design, and the connective thinking that
              keeps the whole thing coherent once the brand leaves the presentation deck and enters the real world.
            </p>
            <p style={{ ...BODY_COPY, maxWidth: 820 }}>
              Use the archive to move by region, industry, service, or layout depending on how you want to read the
              work. Some case studies are brand-first, others are driven by packaging, websites, or rollout systems,
              but the common thread is always the same: strategy has to survive implementation. That is the standard
              these projects are meant to show.
            </p>
            <p style={{ ...BODY_COPY, maxWidth: 820 }}>
              The case studies are intentionally different in scale and category so you can see how the studio adapts
              the same level of rigor across hospitality brands, consumer products, health, and digital companies
              without flattening everything into one visual formula.
            </p>
            <p style={{ ...BODY_COPY, maxWidth: 820 }}>
              If you are comparing possible partners, this page is also a way to read the studio&apos;s operating style.
              The work is not arranged to show one aesthetic repeated over and over. It is arranged to show how a clear
              strategic standard can flex across different categories without losing sharpness, consistency, or ambition.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
              <a
                href="/contact"
                className="atla-link"
                style={{ ...LF_SMALL, textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: 52, padding: "14px 4px" }}
              >
                Start a project
              </a>
              <a
                href="/journal"
                className="atla-link"
                style={{ ...LF_SMALL, textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: 52, padding: "14px 4px" }}
              >
                Read the journal
              </a>
            </div>
          </div>
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
              gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(160px, 1fr))",
              columnGap: isMobile ? 20 : 28,
              rowGap: isMobile ? 20 : 12,
              width: "100%",
              maxWidth: isMobile ? "100%" : 1320,
            }}
          >
            <FilterColumn label="( Region )" options={FILTERS.region} value={region} onChange={setRegion} />
            <FilterColumn label="( Industry )" options={FILTERS.industry} value={industry} onChange={setIndustry} />
            <FilterColumn label="( Service )" options={FILTERS.service} value={service} onChange={setService} />
            <FilterColumn label="( View )" options={FILTERS.view} value={view} onChange={setView} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              gap: isMobile ? 40 : 15,
              rowGap: isMobile ? 36 : 80,
              alignItems: "start",
            }}
          >
            {filteredProjects.map((project, index) => {
              const masonryOffset = !isMobile && view === "Masonry" ? [0, 120, 0, 120][index % 4] : 0;
              const imageDimensions = getImageDimensions(project.coverImage);
              const targetWidth = isMobile ? 580 : view === "List" ? 1280 : 640;
              const optimizedSrc = getOptimizedImageUrl(project.coverImage, { width: targetWidth, quality: 82 }) || project.coverImage;
              const srcSet = buildImageSrcSet(project.coverImage, [Math.round(targetWidth / 2), Math.round(targetWidth * 0.75), targetWidth], { quality: 82 });
              const shouldPrioritize = index < (isMobile ? 4 : 4);

              return (
                <a
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="atla-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    textDecoration: "none",
                    marginTop: masonryOffset,
                    minHeight: 56,
                    paddingBottom: 6,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: isMobile ? "290 / 290" : view === "List" ? "1.8 / 1" : "1 / 1",
                      backgroundColor: "#ece9e2",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={optimizedSrc}
                      srcSet={srcSet}
                      sizes={isMobile ? "calc(100vw - 20px)" : view === "List" ? "min(100vw - 40px, 1280px)" : "25vw"}
                      alt={project.title}
                      width={imageDimensions?.width}
                      height={imageDimensions?.height}
                      loading={shouldPrioritize ? "eager" : "lazy"}
                      fetchPriority={shouldPrioritize ? "high" : undefined}
                      decoding="async"
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={{ ...LF_MEDIUM, fontSize: isMobile ? 12 : 14, color: MUTED_TEXT }}>{project.title}</p>
                    {view === "List" || isMobile ? (
                      <p style={{ ...LF_MEDIUM, fontSize: 12, color: MUTED_TEXT, lineHeight: "1.4" }}>
                        {project.category} • {project.year} • {project.description}
                      </p>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
