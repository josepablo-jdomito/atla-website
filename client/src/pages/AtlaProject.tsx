import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Project } from "@shared/schema";
import { trackEvent } from "@/hooks/use-analytics";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from "@/pages/not-found";

const LABEL: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  color: "#8e8e8e",
  textTransform: "uppercase",
  margin: 0,
};

const BODY: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.1",
  color: "#222",
  margin: 0,
};

function fetchProject(slug: string) {
  return async () => {
    const res = await fetch(`/api/projects/${slug}`, { credentials: "include" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch project");
    return (await res.json()) as Project;
  };
}

type ProjectPageView = {
  slug: string;
  title: string;
  client: string;
  services: string[];
  location: string;
  dateLabel: string;
  intro: string;
  brandTitle: string;
  brandBody: string[];
  heroImage: string;
  storyImage?: string;
  gallery: string[];
  credits: Array<{ role: string; names: string[] }>;
  related: Array<{ slug: string; title: string; date: string }>;
};

function buildProjectPageView(project: Project, allProjects: Project[]): ProjectPageView {
  const brandBody = project.body.split("\n\n").filter(Boolean);
  const services = project.tags.length > 0 ? project.tags : [project.category];
  const heroImage = project.coverImage || project.images[0] || "/figmaAssets/media.png";
  const gallery = project.images.length > 0 ? project.images : [heroImage];
  const related = allProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 7)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      date: String(item.year),
    }));

  return {
    slug: project.slug,
    title: project.title,
    client: project.client,
    services,
    location: project.category,
    dateLabel: String(project.year),
    intro: project.description,
    brandTitle: "The brand",
    brandBody: brandBody.length > 0 ? brandBody : [project.description],
    heroImage,
    storyImage: project.images[1] || heroImage,
    gallery,
    credits: [
      { role: "Client", names: [project.client] },
      { role: "Category", names: [project.category] },
    ],
    related,
  };
}

export default function AtlaProject() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const isMobile = useIsMobile();

  const { data: projectData, isPending: isProjectPending } = useQuery<Project | null>({
    queryKey: ["project", slug],
    queryFn: fetchProject(slug),
  });
  const { data: allProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const project = useMemo(
    () => (projectData ? buildProjectPageView(projectData, allProjects ?? []) : null),
    [allProjects, projectData],
  );

  useEffect(() => {
    if (!project) return;

    trackEvent("portfolio_project_view", {
      page: `/projects/${project.slug}`,
      project_name: project.title,
    });
  }, [project]);

  const galleryRows = useMemo(() => {
    if (!project) return [];

    const rows: Array<{ kind: "single" | "pair"; images: string[] }> = [];
    for (let index = 0; index < project.gallery.length; index += 1) {
      const shouldPair = index % 3 === 0 && index + 1 < project.gallery.length;
      if (shouldPair) {
        rows.push({ kind: "pair", images: [project.gallery[index], project.gallery[index + 1]] });
        index += 1;
      } else {
        rows.push({ kind: "single", images: [project.gallery[index]] });
      }
    }
    return rows;
  }, [project]);

  if (!slug || (!project && isProjectPending)) {
    return null;
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <div className="atla-dark-surface">
      <main style={{ width: "100%", position: "relative" }}>
        <AtlaNav />

        <section
          className="atla-enter"
          style={{
            paddingTop: 50,
            minHeight: isMobile ? "auto" : 750,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
          }}
        >
          <div style={{ position: isMobile ? "relative" : "sticky", top: 0, minHeight: isMobile ? 468 : 750 }}>
            <img
              src={project.heroImage}
              alt={project.title}
              style={{ width: "100%", height: "100%", minHeight: isMobile ? 468 : 750, objectFit: "cover", display: "block" }}
            />
          </div>
          <div style={{ backgroundColor: "#fafafa", padding: isMobile ? "20px 10px 100px" : "0 26px 23px 0", display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: isMobile ? 48 : 140 }}>
              <h1
                style={{
                  fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                  fontSize: isMobile ? 42 : 82,
                  fontWeight: 400,
                  lineHeight: "1.1",
                  color: "#222",
                  margin: 0,
                }}
              >
                {project.title}
              </h1>

              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 40 : 95 }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={LABEL}>( Clients )</p>
                    <p style={{ ...BODY, fontSize: isMobile ? 12 : 14 }}>{project.client}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={LABEL}>( Service )</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {project.services.map((item) => (
                        <p key={item} style={{ ...BODY, fontSize: isMobile ? 12 : 14 }}>
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "229px 286px", justifyContent: "space-between", gap: 24 }}>
                  <p style={{ ...BODY, fontSize: isMobile ? 12 : 14 }}>{project.intro}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 10 }}>
                    <p style={{ ...BODY, fontSize: isMobile ? 12 : 14 }}>{project.location}</p>
                    <p style={{ ...BODY, fontSize: isMobile ? 12 : 14 }}>{project.dateLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: isMobile ? "20px 10px 100px" : "40px 60px 200px", position: "relative" }}>
          {project.storyImage && !isMobile && (
            <img
              src={project.storyImage}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
            />
          )}
          <div
            style={{
              backgroundColor: "#fafafa",
              padding: isMobile ? 0 : "40px 20px 200px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
              gap: 40,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 36, maxWidth: 554 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ ...LABEL, color: "#222" }}>( {project.brandTitle} )</p>
                {project.brandBody.map((paragraph) => (
                  <p key={paragraph} style={{ ...BODY, fontSize: isMobile ? 12 : 14 }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {project.credits.map((credit) => (
                <div key={credit.role} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
                  <p style={{ ...BODY, color: "#8e8e8e", fontSize: isMobile ? 12 : 14 }}>{credit.role}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    {credit.names.map((name) => (
                      <p key={name} style={{ ...BODY, fontSize: isMobile ? 12 : 14, textAlign: "right" }}>
                        {name}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ width: "100%", overflow: "hidden" }}>
          {galleryRows.map((row) => {
            if (row.kind === "pair") {
              return (
                <div key={row.images.join("-")} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
                  {row.images.map((src) => (
                    <div key={src} style={{ minHeight: isMobile ? 390 : 600 }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div key={row.images[0]} style={{ minHeight: isMobile ? 390 : 750 }}>
                <img src={row.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            );
          })}
        </section>

        <section
          style={{
            padding: isMobile ? "100px 10px" : "200px 20px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 570px",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div style={{ minHeight: 150, backgroundImage: `url(${project.storyImage || project.heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <p style={LABEL}>( other works )</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {project.related.map((item) => (
                <a
                  key={item.title}
                  href={`/projects/${item.slug}`}
                  className="atla-link"
                  style={{ ...BODY, color: "#8e8e8e", textDecoration: "none", display: "flex", justifyContent: "space-between" }}
                >
                  <span>{item.title}</span>
                  <span>{item.date}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
