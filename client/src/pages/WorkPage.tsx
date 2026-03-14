import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import {
  fetchProjects,
  fetchSiteSettings,
  resolveImageUrl,
  type SanityProject,
} from "@/lib/sanity.queries";

function WorkHeroCard({ project }: { project: SanityProject }) {
  const imageUrl = resolveImageUrl(project.coverImage?.asset, 1600);

  return (
    <Link
      className="group overflow-hidden rounded-[34px] border border-[#d9cebc] bg-[#efe6d9] shadow-[0_24px_60px_rgba(60,44,24,0.12)]"
      href={`/work/${project.slug}`}
    >
      <div className="grid md:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,198,41,0.24),_transparent_40%)]" />
          <div className="relative flex h-full flex-col justify-between p-7 md:p-9">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Featured Archive Entry</p>
              <h2 className="mt-5 max-w-lg font-web-desktop-h3 text-5xl leading-[0.96] text-[#17130e] md:text-7xl">
                {project.title}
              </h2>
            </div>

            <div className="mt-10 space-y-5">
              <p className="max-w-xl text-base leading-8 text-[#453c33] md:text-lg">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#d2c6b4] bg-[#f8f3ea] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#53483c]">
                  {project.category}
                </span>
                {project.year ? (
                  <span className="rounded-full border border-[#d2c6b4] bg-[#f8f3ea] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#53483c]">
                    {project.year}
                  </span>
                ) : null}
                <span className="rounded-full border border-[#d2c6b4] bg-[#f8f3ea] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#53483c]">
                  {project.client}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[22rem] overflow-hidden md:min-h-[34rem]">
          {imageUrl ? (
            <img
              alt={project.coverImage?.alt || project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              src={imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#e0d4c2] text-xs uppercase tracking-[0.35em] text-[#6c5f50]">
              No image
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111111] via-[#111111b3] to-transparent p-6 text-[#faf7f0]">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#d8ccb9]">Open project</p>
            <p className="mt-2 text-xl leading-7 md:text-3xl md:leading-9">View case study</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArchiveCard({
  project,
  variant,
}: {
  project: SanityProject;
  variant: "large" | "tall" | "wide";
}) {
  const imageUrl = resolveImageUrl(project.coverImage?.asset, variant === "large" ? 1600 : 1200);
  const aspectClass =
    variant === "large" ? "aspect-[4/5]" : variant === "tall" ? "aspect-[5/6]" : "aspect-[16/11]";
  const spanClass =
    variant === "large"
      ? "md:col-span-4"
      : variant === "tall"
        ? "md:col-span-4"
        : "md:col-span-8";

  return (
    <Link
      className={`group overflow-hidden rounded-[30px] border border-[#ddd2c1] bg-[#f4ecdf] ${spanClass}`}
      href={`/work/${project.slug}`}
    >
      <div className={`overflow-hidden ${aspectClass}`}>
        {imageUrl ? (
          <img
            alt={project.coverImage?.alt || project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            src={imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#e0d4c2] text-xs uppercase tracking-[0.35em] text-[#6c5f50]">
            No image
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">
          <span>{project.category}</span>
          {project.year ? <span>{project.year}</span> : null}
          <span>{project.client}</span>
        </div>
        <h2 className="font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-5xl">
          {project.title}
        </h2>
        <p className="text-sm leading-7 text-[#4f4337] md:text-base">{project.description}</p>
        {project.tags.length ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                className="rounded-full border border-[#d6cab9] bg-[#fbf7ef] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#53483c]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function LoadingArchive() {
  return (
    <div className="space-y-8">
      <div className="h-[34rem] animate-pulse rounded-[34px] border border-[#dfd6c5] bg-[#f1eadf]" />
      <div className="grid gap-6 md:grid-cols-12">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            className={`animate-pulse rounded-[30px] border border-[#dfd6c5] bg-[#f1eadf] ${
              index === 2 ? "md:col-span-8" : "md:col-span-4"
            } h-[24rem]`}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export function WorkPage() {
  const projectsQuery = useQuery({
    queryKey: ["sanity", "projects"],
    queryFn: fetchProjects,
  });
  const settingsQuery = useQuery({
    queryKey: ["sanity", "siteSettings"],
    queryFn: fetchSiteSettings,
  });

  const projects = projectsQuery.data || [];
  const leadProject = projects[0];
  const archiveProjects = projects.slice(1);
  const featuredCount = projects.filter((project) => project.featured).length;
  const categoryCount = new Set(projects.map((project) => project.category)).size;

  return (
    <div className="min-h-screen bg-[#f7f1e6] text-[#111111]">
      <AtlaNav />

      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,198,41,0.32),_transparent_52%),radial-gradient(circle_at_top_right,_rgba(17,17,17,0.08),_transparent_36%)]" />
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-8">
          <section className="relative">
            <div className="max-w-4xl space-y-6">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#7f7465]">Archive</p>
              <h1 className="font-web-desktop-h3 text-5xl leading-[0.94] text-[#17130e] md:text-8xl">
                Work that carries its own atmosphere.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#453c33] md:text-xl md:leading-9">
                A living archive of identity systems, packaging, and visual worlds built across hospitality, culture,
                product, and brand launches.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-[#ddd2c1] bg-[#fcf8f1] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Published Projects</p>
                <p className="mt-4 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-5xl">
                  {projects.length}
                </p>
              </div>
              <div className="rounded-[24px] border border-[#ddd2c1] bg-[#fcf8f1] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Featured Entries</p>
                <p className="mt-4 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-5xl">
                  {featuredCount}
                </p>
              </div>
              <div className="rounded-[24px] border border-[#ddd2c1] bg-[#fcf8f1] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Categories</p>
                <p className="mt-4 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-5xl">
                  {categoryCount}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12">
            {projectsQuery.isLoading ? (
              <LoadingArchive />
            ) : leadProject ? (
              <div className="space-y-10">
                <WorkHeroCard project={leadProject} />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Full Archive</p>
                    <h2 className="mt-3 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-6xl">
                      Selected projects
                    </h2>
                  </div>
                  <p className="max-w-sm text-sm leading-6 text-[#5c5144]">
                    Built to read like a collection: different formats, one consistent point of view.
                  </p>
                </div>

                {archiveProjects.length ? (
                  <div className="grid gap-6 md:grid-cols-12">
                    {archiveProjects.map((project, index) => {
                      const variant =
                        index % 5 === 0 ? "wide" : index % 3 === 0 ? "large" : "tall";

                      return <ArchiveCard key={project._id} project={project} variant={variant} />;
                    })}
                  </div>
                ) : (
                  <div className="rounded-[28px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8 text-base leading-7 text-[#4a4339]">
                    Add more published projects in Sanity to build out the archive grid.
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8 text-base leading-7 text-[#4a4339]">
                No published portfolio projects are available in Sanity yet.
              </div>
            )}
          </section>
        </div>
      </main>

      {settingsQuery.data ? <AtlaFooter settings={settingsQuery.data} /> : null}
    </div>
  );
}
