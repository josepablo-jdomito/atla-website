import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { hasSanityConfig, studioUrl } from "@/lib/sanity";
import { fetchRawProjectDocuments } from "@/lib/sanity.queries";

function summarizeKeys(project: Record<string, unknown>) {
  return Object.keys(project)
    .filter((key) => !key.startsWith("_"))
    .sort();
}

export function SanityPortfolioDebug() {
  const projectsQuery = useQuery({
    queryKey: ["sanity", "rawProjects"],
    queryFn: fetchRawProjectDocuments,
    enabled: hasSanityConfig,
  });

  return (
    <div className="min-h-screen bg-[#faf7f0] px-5 py-12 text-[#111111] md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">Debug</p>
            <h1 className="mt-3 font-web-desktop-h3 text-4xl leading-none md:text-6xl">
              Sanity Portfolio Shape
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              className="rounded-full border border-[#111111] px-4 py-3 text-xs uppercase tracking-[0.3em]"
              href="/admin/projects"
            >
              Back
            </Link>
            <a
              className="rounded-full bg-[#111111] px-4 py-3 text-xs uppercase tracking-[0.3em] text-[#faf7f0]"
              href={studioUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open Studio
            </a>
          </div>
        </div>

        {!hasSanityConfig ? (
          <div className="rounded-[28px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8 text-base leading-7 text-[#4a4339]">
            Set `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` first. This page only runs against a real Sanity dataset.
          </div>
        ) : projectsQuery.isLoading ? (
          <div className="rounded-[28px] bg-[#f2ebde] p-8 text-base leading-7 text-[#4a4339]">
            Loading project documents from Sanity...
          </div>
        ) : projectsQuery.data?.length ? (
          <div className="space-y-6">
            {projectsQuery.data.map((project) => (
              <div
                className="rounded-[28px] border border-[#ddd2c1] bg-[#f3ede2] p-6"
                key={project._id}
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">
                      {String(project._type)} / {String(project._id)}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                      {String(project.title || project.name || "Untitled")}
                    </h2>
                    <p className="mt-2 text-sm text-[#5f5547]">
                      slug: {String(project.slugValue || "missing")} | category:{" "}
                      {String(project.categoryTitle || project.category || "missing")}
                    </p>
                  </div>
                  <div className="text-sm text-[#5f5547]">
                    featured: {String(project.featured ?? project.featuredOnHomepage ?? false)}
                    <br />
                    status: {String(project.status || "missing")}
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {summarizeKeys(project).map((key) => (
                    <span
                      className="rounded-full bg-[#e7decf] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#6b6255]"
                      key={key}
                    >
                      {key}
                    </span>
                  ))}
                </div>

                <pre className="overflow-x-auto rounded-[20px] bg-[#faf7f0] p-4 text-xs leading-6 text-[#4a4339]">
                  {JSON.stringify(project, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#c8bea9] bg-[#f2ebde] p-8 text-base leading-7 text-[#4a4339]">
            No `project` documents were found in the configured Sanity dataset.
          </div>
        )}
      </div>
    </div>
  );
}
