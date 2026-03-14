import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import {
  fetchFeaturedProjects,
  fetchSiteSettings,
  resolveImageUrl,
  type SanityProject,
} from "@/lib/sanity.queries";
import { hasSanityConfig } from "@/lib/sanity";

function FeaturedProjectCard({ project, featured = false }: { project: SanityProject; featured?: boolean }) {
  const imageUrl = resolveImageUrl(project.coverImage?.asset, featured ? 1200 : 900);

  return (
    <Link
      className="group block overflow-hidden rounded-[28px] border border-[#dfd6c5] bg-[#efe8dc] transition-transform duration-300 hover:-translate-y-1"
      href={`/work/${project.slug}`}
    >
      <div className={`relative ${featured ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
        {imageUrl ? (
          <img
            alt={project.coverImage?.alt || project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            src={imageUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#d8cfbf] text-sm uppercase tracking-[0.3em] text-[#5c5347]">
            No image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111111] via-[#11111199] to-transparent p-5 text-[#faf7f0]">
          <p className="text-[11px] uppercase tracking-[0.35em]">
            {project.category}{project.year ? ` / ${project.year}` : ""}
          </p>
          <h3 className="mt-2 font-web-desktop-h3 text-3xl leading-none md:text-5xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#f5ede0]">{project.description}</p>
        </div>
      </div>
    </Link>
  );
}

export function HomePage() {
  const siteQuery = useQuery({
    queryKey: ["sanity", "siteSettings"],
    queryFn: fetchSiteSettings,
  });
  const featuredProjectsQuery = useQuery({
    queryKey: ["sanity", "featuredProjects"],
    queryFn: fetchFeaturedProjects,
  });

  const settings = siteQuery.data;
  const projects = featuredProjectsQuery.data || [];
  const heroProject = projects[0];
  const secondaryProjects = projects.slice(1, 3);
  const isLoadingProjects = featuredProjectsQuery.isLoading;
  const hasProjects = projects.length > 0;

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#111111]">
      <AtlaNav />

      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-12 pt-8 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pb-16 md:pt-10">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#7f7465]">
                Working across the US and LATAM
              </p>
              <h1 className="max-w-3xl font-web-desktop-h3 text-5xl leading-[0.95] md:text-8xl">
                {settings?.tagline || "Design with intention"}
              </h1>
              <p className="max-w-xl text-base leading-7 text-[#444444] md:text-lg">
                {settings?.intro ||
                  "Connect your Sanity project to replace the placeholder content with your own editorial and project portfolio."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-[#111111] px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#faf7f0]"
                href="/work"
              >
                View Work
              </Link>
              <a
                className="rounded-full border border-[#111111] px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#111111]"
                href="/admin/projects"
              >
                Open CMS
              </a>
            </div>

            {!hasSanityConfig ? (
              <div className="max-w-xl rounded-[24px] border border-dashed border-[#c4b8a3] bg-[#f3ede2] p-5 text-sm leading-6 text-[#5f5547]">
                Sanity environment variables are not set yet. The page is rendering local placeholder content so you can deploy the shell before you connect the dataset.
              </div>
            ) : null}
          </div>

          {heroProject ? (
            <FeaturedProjectCard featured project={heroProject} />
          ) : isLoadingProjects ? (
            <div className="aspect-[4/5] animate-pulse rounded-[28px] border border-[#dfd6c5] bg-[#efe8dc]" />
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Featured Work</p>
              <p className="mt-4 text-base leading-7 text-[#4a4339]">
                No published portfolio projects were found in Sanity yet. Add projects in Studio, or mark one as featured to control the homepage hero.
              </p>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Featured Projects</p>
              <h2 className="mt-3 font-web-desktop-h3 text-4xl leading-none md:text-6xl">
                Selected work
              </h2>
            </div>
            <Link className="text-sm uppercase tracking-[0.28em] text-[#444444]" href="/work">
              View archive
            </Link>
          </div>
          {secondaryProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {secondaryProjects.map((project) => (
                <FeaturedProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : !isLoadingProjects && hasProjects ? (
            <div className="rounded-[28px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8 text-base leading-7 text-[#4a4339]">
              Add more published projects in Sanity to fill out the featured section.
            </div>
          ) : null}
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-[0.9fr_1.1fr] md:px-8" id="about">
          <div className="rounded-[28px] bg-[#111111] p-8 text-[#faf7f0]">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#c5bba9]">About</p>
            <p className="mt-6 text-xl leading-8 md:text-3xl md:leading-10">
              Atla builds visual systems with editorial discipline, cinematic pacing, and a cross-border perspective.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#ded5c4] bg-[#f7f2ea] p-8" id="services">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Services</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {(settings?.services || []).map((service) => (
                <div className="rounded-[20px] bg-[#efe7d9] p-4" key={service}>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#6a6154]">0{(settings?.services || []).indexOf(service) + 1}</p>
                  <p className="mt-6 text-lg leading-7 text-[#111111]">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {settings ? <AtlaFooter settings={settings} /> : null}
    </div>
  );
}
