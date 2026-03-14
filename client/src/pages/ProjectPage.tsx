import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import {
  fetchProjectBySlug,
  fetchSiteSettings,
  renderPortableText,
  resolveImageUrl,
} from "@/lib/sanity.queries";

type Props = {
  slug: string;
};

export function ProjectPage({ slug }: Props) {
  const projectQuery = useQuery({
    queryKey: ["sanity", "project", slug],
    queryFn: () => fetchProjectBySlug(slug),
  });
  const settingsQuery = useQuery({
    queryKey: ["sanity", "siteSettings"],
    queryFn: fetchSiteSettings,
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

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#111111]">
      <AtlaNav />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-8">
        <Link className="text-xs uppercase tracking-[0.35em] text-[#7f7465]" href="/work">
          Back to archive
        </Link>

        <section className="mt-8 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">
              {project.category} / {project.year}
            </p>
            <h1 className="font-web-desktop-h3 text-5xl leading-none md:text-7xl">
              {project.title}
            </h1>
            <p className="text-lg leading-8 text-[#444444]">{project.description}</p>
            <div className="space-y-2 text-sm text-[#444444]">
              <p>Client: {project.client}</p>
              {project.tags.length ? <p>Tags: {project.tags.join(" / ")}</p> : null}
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-[#ddd2c1] bg-[#efe8dc]">
            {heroUrl ? (
              <img
                alt={project.coverImage?.alt || project.title}
                className="h-full w-full object-cover"
                src={heroUrl}
              />
            ) : null}
          </div>
        </section>

        <section className="mt-12 grid gap-12 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Project Notes</p>
          </div>
          <div className="space-y-6">{renderPortableText(project.body)}</div>
        </section>

        {project.gallery?.length ? (
          <section className="mt-16 grid gap-5 md:grid-cols-3">
            {project.gallery.map((image) => {
              const imageUrl = resolveImageUrl(image.asset, 1200);
              if (!imageUrl) {
                return null;
              }

              return (
                <div
                  className="overflow-hidden rounded-[24px] border border-[#ddd2c1] bg-[#f2ebde]"
                  key={image._key}
                >
                  <img alt={image.alt || project.title} className="h-full w-full object-cover" src={imageUrl} />
                </div>
              );
            })}
          </section>
        ) : null}
      </main>

      {settingsQuery.data ? <AtlaFooter settings={settingsQuery.data} /> : null}
    </div>
  );
}
