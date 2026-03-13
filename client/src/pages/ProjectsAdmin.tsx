import { studioUrl, hasSanityConfig } from "@/lib/sanity";

export default function ProjectsAdmin() {
  return (
    <div className="min-h-screen bg-[#faf7f0] px-5 py-12 text-[#111111] md:px-8">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-[#ddd2c1] bg-[#f3ede2] p-8 md:p-10">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f7465]">CMS</p>
        <h1 className="mt-4 font-web-desktop-h3 text-5xl leading-none md:text-7xl">
          Sanity is now the project CMS.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#444444]">
          The old local CRUD admin has been retired from the public app path. Manage projects, homepage copy, and publishing state from Sanity Studio instead.
        </p>

        <div className="mt-8 space-y-4 rounded-[24px] bg-[#faf7f0] p-6">
          <a
            className="inline-flex rounded-full bg-[#111111] px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#faf7f0]"
            href={studioUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open Studio
          </a>
          {!hasSanityConfig ? (
            <p className="text-sm leading-6 text-[#5f5547]">
              `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` are not configured yet, so the public site is still using placeholder content.
            </p>
          ) : (
            <p className="text-sm leading-6 text-[#5f5547]">
              The public site is ready to read published content from your configured Sanity dataset.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
