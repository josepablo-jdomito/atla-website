import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { ProjectCard } from "@/components/site/ProjectCard";
import { nextProjectInSiteOrder, toSiteProject, useSiteProjects } from "@/components/site/siteProjects";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { trackEvent } from "@/hooks/use-analytics";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  buildProjectPageView,
  buildProjectSeoHead,
  fetchProject,
  PROJECT_PLACEHOLDER_IMAGE,
  projectMediaSequence,
  toVimeoBackgroundUrl,
  type ProjectApi,
  type ProjectMediaMosaicItem,
} from "@/lib/projectPage";
import NotFound from "@/pages/not-found";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

const { project: copy } = siteCopy;
const MEDIA_WIDTHS = [640, 960, 1280, 1600, 2000, 2400];
// React 18 warns on the camelCase `fetchPriority` prop; the lowercase attribute is what the browser reads.
const PRIORITY_ATTRS = { fetchpriority: "high" } as Record<string, string>;

type MediaItem = ProjectMediaMosaicItem | { type: "image"; src: string; sourceIndex?: number };

function ProjectImage({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  const dimensions = getImageDimensions(src);
  return (
    <img
      className="project-media__item"
      src={getOptimizedImageUrl(src, { width: 1600, quality: 88 }) || src}
      srcSet={buildImageSrcSet(src, MEDIA_WIDTHS, { quality: 88 })}
      sizes="100vw"
      alt={alt}
      width={dimensions?.width}
      height={dimensions?.height}
      loading={priority ? "eager" : "lazy"}
      {...(priority ? PRIORITY_ATTRS : null)}
      decoding="async"
    />
  );
}

/** Muted, looping and inline; plays while on screen. Under reduced motion it never starts on its own and shows controls. */
function ProjectVideo({ src, poster, title, reduced }: { src: string; poster?: string; title: string; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      className="project-media__item"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      controls={reduced}
      preload="metadata"
      disablePictureInPicture
      aria-label={title}
    />
  );
}

function ProjectMedia({ items, title, reduced }: { items: MediaItem[]; title: string; reduced: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className="project-media">
      {items.map((item, index) => {
        const key = `${item.type}-${index}-${item.src}`;
        if (item.type === "image") {
          return <ProjectImage key={key} src={item.src} alt={`${title}, image ${index + 1}`} priority={index === 0} />;
        }
        if (item.type === "video") {
          return <ProjectVideo key={key} src={item.src} poster={item.poster} title={item.title || `${title}, video`} reduced={reduced} />;
        }
        return (
          <div key={key} className="project-media__item project-media__embed">
            <iframe
              src={reduced ? item.src : toVimeoBackgroundUrl(item.src)}
              title={item.title || `${title}, video`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Project() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const reduced = useReducedMotion();
  const { projects } = useSiteProjects();

  const { data: projectData, isPending } = useQuery<ProjectApi | null>({
    queryKey: ["project", slug],
    queryFn: fetchProject(slug),
  });
  const { data: allProjects } = useQuery<ProjectApi[]>({ queryKey: ["/api/projects"] });

  const project = useMemo(
    () => (projectData ? buildProjectPageView(projectData, allProjects ?? []) : null),
    [allProjects, projectData],
  );
  const next = useMemo(() => nextProjectInSiteOrder(projects, slug), [projects, slug]);

  // wouter does not reset scroll; a project opened from the bottom of another should start at its top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    trackEvent("portfolio_project_view", { page: `/projects/${project.slug}`, project_name: project.title });
  }, [project]);

  if (!slug || (!project && isPending)) return <PageShell>{null}</PageShell>;
  if (!project) return <NotFound />;

  const seoHead = buildProjectSeoHead(project);
  const media: MediaItem[] = [
    ...(project.heroImage === PROJECT_PLACEHOLDER_IMAGE ? [] : [{ type: "image" as const, src: project.heroImage }]),
    ...projectMediaSequence(project),
  ];
  const year = Number.parseInt(project.dateLabel, 10) > 0 ? project.dateLabel : "";
  // The header names the services sold (Branding, Website…), not the descriptive tags the old page listed.
  const services = (projectData && toSiteProject(projectData)?.services) || [];

  return (
    <PageShell>
      <SeoHead
        title={seoHead.title}
        description={seoHead.description}
        pathname={seoHead.pathname}
        image={seoHead.image}
        preloadImages={seoHead.preloadImages}
        structuredData={seoHead.structuredData}
      />

      <article className="project">
        <header className="project-head">
          <h1 className="project-head__client">{project.client || project.title}</h1>
          {year ? <span className="project-head__meta">{year}</span> : null}
          {services.length > 0 ? <span className="project-head__meta">{services.join(", ")}</span> : null}
        </header>

        <ProjectMedia items={media} title={project.title} reduced={reduced} />

        <section className="project-cta" aria-labelledby="project-cta-title">
          <h2 id="project-cta-title" className="project-cta__title">
            {copy.ctaTitle}
          </h2>
          <Link href={`/brief?seed=${encodeURIComponent(copy.seed(project.title))}`} className="brief-primary">
            {copy.ctaLabel}
          </Link>
        </section>

        {next ? (
          <section className="project-next" aria-labelledby="project-next-label">
            <h2 id="project-next-label" className="home-section-label">
              {copy.nextLabel}
            </h2>
            <ProjectCard project={next} size="next" />
          </section>
        ) : null}
      </article>
    </PageShell>
  );
}
