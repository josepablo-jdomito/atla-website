import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { portfolioFallbackProjects } from "@/data/atlaContent";
import { useIsMobile } from "@/hooks/use-mobile";

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

const FILTERS = {
  region: ["All", "America", "Europe", "Asia", "Middle East"],
  industry: ["All", "Hospitality", "Food & Beverage", "Consumer Goods", "SAAS", "Digital"],
  service: ["All", "Branding", "Art Direction", "Packaging", "Website"],
  view: ["Masonry", "Grid", "List"],
} as const;

function normalizeProjects(projects?: Project[]): WorkProject[] {
  if (!projects || projects.length === 0) return portfolioFallbackProjects;

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
  return (
    <div style={{ flex: "1 0 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={LF_SMALL}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            style={{
              ...LF_MEDIUM,
              color: value === option ? "#222" : "#8e8e8e",
              border: "none",
              background: "none",
              textAlign: "left",
              padding: 0,
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
      <div style={{ width: "100%", position: "relative", minHeight: 750 }}>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))",
              gap: 20,
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
                      src={project.coverImage}
                      alt={project.title}
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
                  <p style={{ ...LF_MEDIUM, fontSize: isMobile ? 12 : 14, color: "#8e8e8e" }}>{project.title}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <AtlaFooter />
    </div>
  );
}
