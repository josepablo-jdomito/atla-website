import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import {
  fetchProjects,
  fetchProjectBySlug,
  fetchSiteSettings,
  renderPortableText,
  resolveImageUrl,
  type SanityProject,
} from "@/lib/sanity.queries";

type Props = {
  slug: string;
};

function ProjectMetaCard({ project }: { project: SanityProject }) {
  return (
    <div className="rounded-[28px] border border-[#d8cdbb] bg-[#f5efe4] p-6">
      <p className="text-[11px] uppercase tracking-[0.34em] text-[#8c7b68]">Project Data</p>
      <dl className="mt-6 space-y-5">
        <div className="flex items-start justify-between gap-6 border-b border-[#e5dccd] pb-4">
          <dt className="text-xs uppercase tracking-[0.24em] text-[#8c7b68]">Client</dt>
          <dd className="text-right text-sm leading-6 text-[#2b241d]">{project.client}</dd>
        </div>
        <div className="flex items-start justify-between gap-6 border-b border-[#e5dccd] pb-4">
          <dt className="text-xs uppercase tracking-[0.24em] text-[#8c7b68]">Category</dt>
          <dd className="text-right text-sm leading-6 text-[#2b241d]">{project.category}</dd>
        </div>
        {project.year ? (
          <div className="flex items-start justify-between gap-6 border-b border-[#e5dccd] pb-4">
            <dt className="text-xs uppercase tracking-[0.24em] text-[#8c7b68]">Year</dt>
            <dd className="text-right text-sm leading-6 text-[#2b241d]">{project.year}</dd>
          </div>
        ) : null}
        <div className="flex items-start justify-between gap-6">
          <dt className="text-xs uppercase tracking-[0.24em] text-[#8c7b68]">Tags</dt>
          <dd className="max-w-[15rem] text-right text-sm leading-6 text-[#2b241d]">
            {project.tags.length ? project.tags.join(" / ") : "Details coming soon"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function ProjectGallery({ project }: { project: SanityProject }) {
  if (!project.gallery?.length) {
    return null;
  }

  return (
    <section className="mt-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Visual Archive</p>
          <h2 className="mt-3 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-6xl">
            Frames from the system
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#5c5144]">
          A curated sequence of application shots, details, and supporting material from the project.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-12">
        {project.gallery.map((image, index) => {
          const imageUrl = resolveImageUrl(image.asset, index === 0 ? 1800 : 1200);
          if (!imageUrl) {
            return null;
          }

          const spanClass =
            index === 0
              ? "md:col-span-12"
              : index % 3 === 1
                ? "md:col-span-5"
                : index % 3 === 2
                  ? "md:col-span-7"
                  : "md:col-span-6";
          const ratioClass =
            index === 0 ? "aspect-[16/10]" : index % 2 === 0 ? "aspect-[4/5]" : "aspect-[5/4]";

          return (
            <figure
              className={`group overflow-hidden rounded-[28px] border border-[#ddd2c1] bg-[#f2eadf] ${spanClass}`}
              key={image._key}
            >
              <div className={`overflow-hidden ${ratioClass}`}>
                <img
                  alt={image.alt || project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  src={imageUrl}
                />
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

export function ProjectPage({ slug }: Props) {
  const projectQuery = useQuery({
    queryKey: ["sanity", "project", slug],
    queryFn: () => fetchProjectBySlug(slug),
  });
  const settingsQuery = useQuery({
    queryKey: ["sanity", "siteSettings"],
    queryFn: fetchSiteSettings,
  });
  const projectsQuery = useQuery({
    queryKey: ["sanity", "projects"],
    queryFn: fetchProjects,
  });

  const project = projectQuery.data;

  if (projectQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#faf7f0] text-[#111111]">
        <AtlaNav />
        <main className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="h-6 w-32 animate-pulse rounded bg-[#ece4d7]" />
          <div className="mt-8 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              <div className="h-4 w-48 animate-pulse rounded bg-[#ece4d7]" />
              <div className="h-24 w-full animate-pulse rounded bg-[#ece4d7]" />
              <div className="h-20 w-full animate-pulse rounded bg-[#ece4d7]" />
            </div>
            <div className="aspect-[4/3] animate-pulse rounded-[32px] bg-[#ece4d7]" />
          </div>
        </main>
        {settingsQuery.data ? <AtlaFooter settings={settingsQuery.data} /> : null}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#faf7f0] text-[#111111]">
        <AtlaNav />
        <main className="mx-auto max-w-4xl px-5 py-20 md:px-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Not found</p>
          <h1 className="mt-4 font-web-desktop-h3 text-5xl leading-none md:text-7xl">
            This project is not published.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#444444]">
            Check the slug in the URL or publish the project from Sanity Studio.
          </p>
          <Link className="mt-8 inline-flex rounded-full bg-[#111111] px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#faf7f0]" href="/work">
            Back to Work
          </Link>
        </main>
        {settingsQuery.data ? <AtlaFooter settings={settingsQuery.data} /> : null}
      </div>
    );
  }

  const heroUrl = resolveImageUrl(project.coverImage?.asset, 1800);
  const hasBody = project.body.length > 0;
  const relatedProjects =
    projectsQuery.data?.filter((candidate) => candidate.slug !== project.slug).slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-[#f7f1e6] text-[#111111]">
      <AtlaNav />

      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,198,41,0.36),_transparent_52%),radial-gradient(circle_at_top_right,_rgba(17,17,17,0.08),_transparent_38%)]" />
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-8">
          <Link className="text-xs uppercase tracking-[0.35em] text-[#7f7465]" href="/work">
            Back to archive
          </Link>

          <section className="relative mt-8 grid gap-8 md:grid-cols-[0.82fr_1.18fr] md:gap-10">
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="text-[11px] uppercase tracking-[0.38em] text-[#8c7b68]">
                  {project.category}
                  {project.year ? ` / ${project.year}` : ""}
                </p>
                <h1 className="max-w-xl font-web-desktop-h3 text-5xl leading-[0.94] text-[#17130e] md:text-8xl">
                  {project.title}
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[#453c33] md:text-[1.3rem] md:leading-9">
                  {project.description}
                </p>
              </div>

              {project.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      className="rounded-full border border-[#d6cab9] bg-[#fbf7ef] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#53483c]"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <ProjectMetaCard project={project} />
            </div>

            <div className="relative overflow-hidden rounded-[34px] border border-[#d8cdbb] bg-[#ede4d6] shadow-[0_24px_60px_rgba(60,44,24,0.12)]">
              {heroUrl ? (
                <img
                  alt={project.coverImage?.alt || project.title}
                  className="h-full w-full object-cover"
                  src={heroUrl}
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-[#e1d6c6] text-sm uppercase tracking-[0.35em] text-[#6c5f50]">
                  Image coming soon
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111111] via-[#111111b8] to-transparent p-6 text-[#faf7f0] md:p-8">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#d6cab9]">Client</p>
                <p className="mt-3 text-xl leading-7 md:text-3xl md:leading-9">{project.client}</p>
              </div>
            </div>
          </section>

          <section className="mt-14 grid gap-8 md:grid-cols-[0.46fr_1fr] md:gap-12">
            <div className="rounded-[28px] bg-[#17130e] p-7 text-[#f8f1e5]">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#ccbca2]">Project Frame</p>
              <p className="mt-6 text-xl leading-8 md:text-[1.95rem] md:leading-10">
                {hasBody
                  ? "Expanded narrative, rationale, and application notes for the identity system."
                  : "This project is currently structured as a sharp portfolio entry: concise summary, strong hero, and gallery-led storytelling."}
              </p>
            </div>

            <div className="rounded-[28px] border border-[#ddd2c1] bg-[#fcf9f3] p-7 md:p-9">
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">
                  {hasBody ? "Project Notes" : "Summary"}
                </p>
                <span className="text-[11px] uppercase tracking-[0.35em] text-[#b49e84]">
                  {project.gallery?.length || 0} gallery frames
                </span>
              </div>

              {hasBody ? (
                <div className="space-y-6">{renderPortableText(project.body)}</div>
              ) : (
                <div className="space-y-5 text-base leading-8 text-[#453c33] md:text-lg">
                  <p>{project.description}</p>
                  <p>
                    The current Sanity entry prioritizes visual material over long-form case-study copy, so the
                    page leans into image sequencing and project metadata instead of empty content blocks.
                  </p>
                  <p>
                    Add rich text to the project body in Sanity whenever you want a more editorial case study with
                    process notes, strategy context, or launch outcomes.
                  </p>
                </div>
              )}
            </div>
          </section>

          <ProjectGallery project={project} />

          {relatedProjects.length ? (
            <section className="mt-20">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">Next in Archive</p>
                  <h2 className="mt-3 font-web-desktop-h3 text-4xl leading-none text-[#17130e] md:text-6xl">
                    Related work
                  </h2>
                </div>
                <Link className="text-sm uppercase tracking-[0.28em] text-[#5c5144]" href="/work">
                  View all work
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {relatedProjects.map((relatedProject) => {
                  const relatedImageUrl = resolveImageUrl(relatedProject.coverImage?.asset, 1200);

                  return (
                    <Link
                      className="group overflow-hidden rounded-[28px] border border-[#ddd2c1] bg-[#f3ebdf]"
                      href={`/work/${relatedProject.slug}`}
                      key={relatedProject._id}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        {relatedImageUrl ? (
                          <img
                            alt={relatedProject.coverImage?.alt || relatedProject.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            src={relatedImageUrl}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#e0d4c2] text-xs uppercase tracking-[0.35em] text-[#6c5f50]">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 p-6">
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8c7b68]">
                          {relatedProject.category}
                          {relatedProject.year ? ` / ${relatedProject.year}` : ""}
                        </p>
                        <h3 className="font-web-desktop-h3 text-4xl leading-none text-[#17130e]">
                          {relatedProject.title}
                        </h3>
                        <p className="text-sm leading-6 text-[#4f4337]">{relatedProject.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      {settingsQuery.data ? <AtlaFooter settings={settingsQuery.data} /> : null}
    </div>
  );
}
