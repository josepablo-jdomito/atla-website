import { fallbackSiteSettings, type SiteSettings } from "@/lib/sanity.queries";
import { studioUrl } from "@/lib/sanity";

type Props = {
  settings?: SiteSettings;
};

export function AtlaFooter({ settings }: Props) {
  const resolvedSettings = settings ?? fallbackSiteSettings;
  const serviceHighlights = resolvedSettings.services.slice(0, 4);

  return (
    <footer className="border-t border-[#221c14] bg-[#ffc629] text-[#1f1a14]">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-8 rounded-[36px] border border-[#221c14] bg-[#fff3ce] p-7 shadow-[0_24px_60px_rgba(82,61,19,0.12)] md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div className="space-y-7">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#6f5a27]">Atla</p>
              <h2 className="max-w-xl font-web-desktop-h3 text-5xl leading-[0.93] text-[#17130e] md:text-7xl">
                {resolvedSettings.tagline}
              </h2>
              <p className="max-w-xl text-base leading-8 text-[#433720] md:text-lg">
                {resolvedSettings.intro}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {serviceHighlights.map((service, index) => (
                <div className="rounded-[22px] border border-[#d8b75e] bg-[#ffefbc] p-4" key={service}>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#7e6630]">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <p className="mt-5 text-base leading-7 text-[#1f1a14]">{service}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-rows-[auto_auto_1fr]">
            <div className="rounded-[24px] border border-[#d8b75e] bg-[#ffefbc] p-5">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#6f5a27]">Contact</p>
              <a
                className="mt-5 block font-web-desktop-h3 text-3xl leading-none text-[#17130e] underline decoration-[#c7a446] underline-offset-[10px]"
                href={`mailto:${resolvedSettings.contactEmail}`}
              >
                {resolvedSettings.contactEmail}
              </a>
            </div>

            <div className="rounded-[24px] border border-[#d8b75e] bg-[#ffefbc] p-5">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#6f5a27]">Studio</p>
              <a
                className="mt-5 inline-flex rounded-full border border-[#17130e] bg-[#17130e] px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-[#faf7f0] transition-colors hover:bg-transparent hover:text-[#17130e]"
                href={studioUrl}
                rel="noreferrer"
                target="_blank"
              >
                {resolvedSettings.studioLabel}
              </a>
            </div>

            <div className="rounded-[24px] border border-[#d8b75e] bg-[#17130e] p-5 text-[#faf7f0]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-[#aa9a80]">Offices</p>
                  <p className="mt-3 text-sm leading-6 text-[#dccfb8]">
                    A cross-border studio working across the Americas.
                  </p>
                </div>
                <span className="font-web-desktop-h3 text-4xl leading-none text-[#ffc629]">
                  {resolvedSettings.offices.length}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {resolvedSettings.offices.map((office) => (
                  <div
                    className="flex items-center justify-between gap-4 rounded-[18px] border border-[#2f261b] bg-[#211b14] px-4 py-3"
                    key={office.city}
                  >
                    <span className="text-base leading-6 text-[#faf7f0]">{office.city}</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#aa9a80]">{office.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
