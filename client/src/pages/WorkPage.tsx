import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { fetchProjects, fetchSiteSettings, resolveImageUrl } from "@/lib/sanity.queries";

export function WorkPage() {
  const projectsQuery = useQuery({
    queryKey: ["sanity", "projects"],
    queryFn: fetchProjects,
  });
  const settingsQuery = useQuery({
    queryKey: ["sanity", "siteSettings"],
    queryFn: fetchSiteSettings,
  });

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#111111]">
      <AtlaNav />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Archive</p>
            <h1 className="mt-3 font-web-desktop-h3 text-5xl leading-none md:text-7xl">Work</h1>
          </div>
          <p className="max-w-md text-base leading-7 text-[#444444]">
            A Sanity-backed archive of published projects. Featured projects surface on the homepage; the full list lives here.
          </p>
        </div>

        {projectsQuery.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                className="aspect-[4/3] animate-pulse rounded-[28px] border border-[#dfd6c5] bg-[#f3ede2]"
                key={index}
              />
            ))}
          </div>
        ) : projectsQuery.data?.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {projectsQuery.data.map((project) => {
            const imageUrl = resolveImageUrl(project.coverImage?.asset, 1200);

            return (
              <Link
                className="group overflow-hidden rounded-[28px] border border-[#dfd6c5] bg-[#f3ede2]"
                href={`/work/${project.slug}`}
                key={project._id}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {imageUrl ? (
                    <img
                      alt={project.coverImage?.alt || project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      src={imageUrl}
                    />
                  ) : null}
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">
                    {project.category}{project.year ? ` / ${project.year}` : ""}
                  </p>
                  <h2 className="font-web-desktop-h3 text-4xl leading-none">{project.title}</h2>
                  <p className="text-sm leading-6 text-[#4a4339]">{project.description}</p>
                </div>
              </Link>
            );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8 text-base leading-7 text-[#4a4339]">
            No published portfolio projects are available in Sanity yet.
          </div>
        )}
      </main>

      {settingsQuery.data ? <AtlaFooter settings={settingsQuery.data} /> : null}
    </div>
  );
}
