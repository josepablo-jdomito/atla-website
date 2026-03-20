import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Project } from "@shared/schema";
import { trackEvent } from "@/hooks/use-analytics";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from "@/pages/not-found";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";
import { formatMetaTitle } from "@shared/siteSeo";

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
  processBody: string[];
  related: Array<{ slug: string; title: string; date: string }>;
};

function buildProjectPageView(project: Project, allProjects: Project[]): ProjectPageView {
  const baseBrandBody = project.body.split("\n\n").filter(Boolean);
  const services = project.tags.length > 0 ? project.tags : [project.category];
  const heroImage = project.coverImage || project.images[0] || "/figmaAssets/media.png";
  const gallery = project.images.length > 0 ? project.images : [heroImage];
  const generatedBrandBody = [
    `${project.title} was developed as a ${project.category.toLowerCase()} engagement for ${project.client}, with the work shaped around a system that could stay coherent across strategy, identity, and rollout.`,
    `The brief had to do more than refresh appearances. It needed to give the brand clearer structure, sharper recognition, and a set of visual decisions that could hold up across real touchpoints instead of only in presentation views.`,
  ];
  const brandBody = [...baseBrandBody];

  if (brandBody.join(" ").length < 420) {
    for (const paragraph of generatedBrandBody) {
      if (!brandBody.includes(paragraph)) {
        brandBody.push(paragraph);
      }
    }
  }

  const processBody = [
    `The process focused on translating ${project.client} into a brand experience that could stay consistent from first impression through implementation, with ${services.join(", ")} working as connected parts instead of separate deliverables.`,
    `That meant creating enough clarity in the core system that future launches, collateral, campaigns, or digital updates could extend the work without diluting the original idea.`,
    `${project.title} also had to hold up under practical use, not just presentation logic. The decisions around hierarchy, tone, and rollout were made so the brand could keep performing as the business changed, new materials were added, and the work moved across teams or vendors.`,
    `That discipline is what turns a project from a one-off visual refresh into a working brand system. The case study matters because it shows how the identity, language, and implementation choices were built to stay useful long after launch.`,
    `For teams reviewing similar work, this project is useful because it shows the studio's approach under real constraints: aligning strategic clarity, visual direction, and rollout decisions so the finished system can actually be used by the business after launch.`,
  ];
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
    processBody,
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

  const heroDimensions = getImageDimensions(project.heroImage);
  const heroSrc = getOptimizedImageUrl(project.heroImage, { width: isMobile ? 900 : 1400, quality: 84 }) || project.heroImage;
  const heroSrcSet = buildImageSrcSet(project.heroImage, isMobile ? [600, 900] : [900, 1200, 1400], { quality: 84 });

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle(`${project.title} ${project.location} Case Study`, "Atla")}
        description={project.intro}
        pathname={`/projects/${project.slug}`}
        image={project.heroImage}
      />
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
              src={heroSrc}
              srcSet={heroSrcSet}
              sizes={isMobile ? "100vw" : "55vw"}
              alt={project.title}
              width={heroDimensions?.width}
              height={heroDimensions?.height}
              fetchPriority="high"
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

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <a
                    href="/work"
                    className="atla-link"
                    style={{ ...LABEL, color: "#222", textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: 52, padding: "14px 4px" }}
                  >
                    Back to work
                  </a>
                  <a
                    href="/contact"
                    className="atla-link"
                    style={{ ...LABEL, color: "#222", textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: 52, padding: "14px 4px" }}
                  >
                    Start a project
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: isMobile ? "20px 10px 100px" : "40px 60px 200px", position: "relative" }}>
          {project.storyImage && !isMobile && (
            <img
              src={project.storyImage}
              alt={`${project.title} supporting project image`}
              width={getImageDimensions(project.storyImage)?.width}
              height={getImageDimensions(project.storyImage)?.height}
              loading="eager"
              fetchPriority="high"
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
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ ...LABEL, color: "#222" }}>( what the work needed to do )</p>
                  {project.processBody.map((paragraph) => (
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
          {galleryRows.map((row, rowIndex) => {
            if (row.kind === "pair") {
              return (
                <div key={row.images.join("-")} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
                  {row.images.map((src, imageIndex) => {
                    const imageDimensions = getImageDimensions(src);
                    const targetWidth = isMobile ? 900 : 1200;
                    const optimizedSrc = getOptimizedImageUrl(src, { width: targetWidth, quality: 82 }) || src;
                    const srcSet = buildImageSrcSet(src, [Math.round(targetWidth / 2), Math.round(targetWidth * 0.75), targetWidth], { quality: 82 });

                    return (
                    <div key={src} style={{ minHeight: isMobile ? 390 : 600 }}>
                      <img
                        src={optimizedSrc}
                        srcSet={srcSet}
                        sizes={isMobile ? "100vw" : "50vw"}
                        alt={`${project.title} gallery image ${imageIndex + 1}`}
                        width={imageDimensions?.width}
                        height={imageDimensions?.height}
                        loading={rowIndex === 0 ? "eager" : "lazy"}
                        fetchPriority={rowIndex === 0 ? "high" : undefined}
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    );
                  })}
                </div>
              );
            }

            const singleImage = row.images[0];
            const imageDimensions = getImageDimensions(singleImage);
            const targetWidth = isMobile ? 900 : 1400;
            const optimizedSrc = getOptimizedImageUrl(singleImage, { width: targetWidth, quality: 82 }) || singleImage;
            const srcSet = buildImageSrcSet(singleImage, [Math.round(targetWidth / 2), Math.round(targetWidth * 0.75), targetWidth], { quality: 82 });

            return (
              <div key={singleImage} style={{ minHeight: isMobile ? 390 : 750 }}>
                <img
                  src={optimizedSrc}
                  srcSet={srcSet}
                  sizes="100vw"
                  alt={`${project.title} gallery image`}
                  width={imageDimensions?.width}
                  height={imageDimensions?.height}
                  loading={rowIndex === 0 ? "eager" : "lazy"}
                  fetchPriority={rowIndex === 0 ? "high" : undefined}
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
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
            <p style={{ ...BODY, color: "#8e8e8e", lineHeight: "1.4", maxWidth: 520 }}>
              Explore related case studies with similar categories, timelines, or brand-building challenges.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {project.related.map((item) => (
                <a
                  key={item.title}
                  href={`/projects/${item.slug}`}
                  className="atla-link"
                  style={{ ...BODY, color: "#8e8e8e", textDecoration: "none", display: "flex", justifyContent: "space-between", minHeight: 52, alignItems: "center", padding: "14px 4px" }}
                >
                  <span>{item.title}</span>
                  <span>{item.date}</span>
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <a href="/work" className="atla-link" style={{ ...LABEL, color: "#222", textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: 52, padding: "14px 4px" }}>
                View all work
              </a>
              <a href="/journal" className="atla-link" style={{ ...LABEL, color: "#222", textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: 52, padding: "14px 4px" }}>
                Read the journal
              </a>
            </div>
          </div>
        </section>
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
