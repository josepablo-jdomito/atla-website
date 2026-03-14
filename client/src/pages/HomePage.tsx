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

function FeaturedProjectPanel({
  project,
  featured = false,
}: {
  project: SanityProject;
  featured?: boolean;
}) {
  const imageUrl = resolveImageUrl(project.coverImage?.asset, featured ? 1600 : 1200);

  return (
    <Link
      className="group block overflow-hidden rounded-[32px] border border-[#ddd2c1] bg-[#f1e8dc]"
      href={`/work/${project.slug}`}
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[4/5]" : "aspect-[4/4.7]"}`}>
        {imageUrl ? (
          <img
            alt={project.coverImage?.alt || project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            src={imageUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#dfd3c1] text-sm uppercase tracking-[0.3em] text-[#5c5347]">
            No image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111111] via-[#111111c4] to-transparent p-6 text-[#faf7f0] md:p-7">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#d6cab9]">
            {project.category}
            {project.year ? ` / ${project.year}` : ""}
          </p>
          <h3 className={`mt-3 font-web-desktop-h3 leading-none ${featured ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"}`}>
            {project.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#f4ecdf] md:text-base md:leading-7">
            {project.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function HomeLoadingState() {
  return (
    <div className="space-y-10">
      <div className="grid gap-8 md:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-[#e6dccd]" />
          <div className="h-24 max-w-xl animate-pulse rounded bg-[#e6dccd]" />
          <div className="h-28 max-w-2xl animate-pulse rounded bg-[#e6dccd]" />
        </div>
        <div className="aspect-[4/5] animate-pulse rounded-[32px] bg-[#e6dccd]" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div className="aspect-[4/4.7] animate-pulse rounded-[32px] bg-[#e6dccd]" key={index} />
        ))}
      </div>
    </div>
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
  const serviceHighlights = (settings?.services || []).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f7f1e6] text-[#111111]">
      <AtlaNav />

      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,198,41,0.36),_transparent_50%),radial-gradient(circle_at_85%_15%,_rgba(17,17,17,0.08),_transparent_32%)]" />

        <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 md:px-8 md:pt-10">
          <section className="relative">
            {isLoadingProjects ? (
              <HomeLoadingState />
            ) : (
              <>
                <div className="grid gap-8 md:grid-cols-[1.04fr_0.96fr] md:gap-10">
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <p className="text-[11px] uppercase tracking-[0.4em] text-[#7f7465]">
                        Working across the US and LATAM
                      </p>
                      <h1 className="max-w-4xl font-web-desktop-h3 text-5xl leading-[0.92] text-[#17130e] md:text-[7.25rem]">
                        {settings?.tagline || "Design with intention"}
                      </h1>
                      <p className="max-w-2xl text-base leading-8 text-[#453c33] md:text-[1.3rem] md:leading-9">
                        {settings?.intro ||
                          "Connect your Sanity project to replace the placeholder content with your own editorial and project portfolio."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        className="rounded-full bg-[#111111] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#faf7f0]"
                        href="/work"
                      >
                        View Work
                      </Link>
                      <a
                        className="rounded-full border border-[#111111] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#111111]"
                        href="/admin/projects"
                      >
                        Open CMS
                      </a>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-[24px] border border-[#ddd2c1] bg-[#fcf8f1] p-5">
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Featured Work</p>
                        <p className="mt-4 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-5xl">
                          {projects.length}
                        </p>
                      </div>
                      <div className="rounded-[24px] border border-[#ddd2c1] bg-[#fcf8f1] p-5">
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Services</p>
                        <p className="mt-4 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-5xl">
                          {settings?.services?.length || 0}
                        </p>
                      </div>
                      <div className="rounded-[24px] border border-[#ddd2c1] bg-[#fcf8f1] p-5">
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Offices</p>
                        <p className="mt-4 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-5xl">
                          {settings?.offices?.length || 0}
                        </p>
                      </div>
                    </div>

                    {!hasSanityConfig ? (
                      <div className="max-w-xl rounded-[24px] border border-dashed border-[#c4b8a3] bg-[#f3ede2] p-5 text-sm leading-6 text-[#5f5547]">
                        Sanity environment variables are not set yet. The page is rendering local placeholder content so you can deploy the shell before you connect the dataset.
                      </div>
                    ) : null}
                  </div>

                  {heroProject ? (
                    <FeaturedProjectPanel featured project={heroProject} />
                  ) : (
                    <div className="rounded-[32px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Featured Work</p>
                      <p className="mt-4 text-base leading-7 text-[#4a4339]">
                        No published portfolio projects were found in Sanity yet. Add projects in Studio, or mark one as featured to control the homepage hero.
                      </p>
                    </div>
                  )}
                </div>

                {secondaryProjects.length > 0 ? (
                  <section className="mt-10 grid gap-6 md:grid-cols-2">
                    {secondaryProjects.map((project) => (
                      <FeaturedProjectPanel key={project._id} project={project} />
                    ))}
                  </section>
                ) : !hasProjects ? null : (
                  <section className="mt-10 rounded-[28px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8 text-base leading-7 text-[#4a4339]">
                    Add more published projects in Sanity to fill out the homepage selection.
                  </section>
                )}
              </>
            )}
          </section>

          <section className="mt-16 grid gap-6 md:grid-cols-[0.92fr_1.08fr]" id="about">
            <div className="rounded-[32px] bg-[#17130e] p-8 text-[#faf7f0] md:p-10">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#ccbca2]">About</p>
              <p className="mt-7 text-xl leading-8 md:text-[2.35rem] md:leading-[1.08]">
                Atla builds visual systems with editorial discipline, cinematic pacing, and a cross-border point of view.
              </p>
              <div className="mt-10 grid gap-4 text-sm leading-6 text-[#d9cfbf] md:grid-cols-2">
                {settings?.offices?.map((office) => (
                  <div className="rounded-[20px] border border-[#2f2a24] bg-[#211c17] p-4" key={office.city}>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#aa9a80]">{office.label}</p>
                    <p className="mt-3 text-lg leading-7 text-[#faf7f0]">{office.city}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#ded5c4] bg-[#fcf8f1] p-8 md:p-10" id="services">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Services</p>
                  <h2 className="mt-3 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-6xl">
                    Systems that scale
                  </h2>
                </div>
                <Link className="text-sm uppercase tracking-[0.28em] text-[#444444]" href="/work">
                  View archive
                </Link>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {serviceHighlights.map((service, index) => (
                  <div className="rounded-[22px] bg-[#f1e8dc] p-5" key={service}>
                    <p className="text-sm uppercase tracking-[0.2em] text-[#6a6154]">
                      {(index + 1).toString().padStart(2, "0")}
                    </p>
                    <p className="mt-8 text-lg leading-7 text-[#111111]">{service}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {settings ? <AtlaFooter settings={settings} /> : null}
    </div>
  );
}
