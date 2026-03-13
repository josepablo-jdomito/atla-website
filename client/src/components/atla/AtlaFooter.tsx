import { studioUrl } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity.queries";

type Props = {
  settings: SiteSettings;
};

export function AtlaFooter({ settings }: Props) {
  return (
    <footer className="border-t border-[#222222] bg-[#ffc629] px-5 py-10 text-[#1f1f1f] md:px-8 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.35em]">Atla</p>
          <h2 className="font-web-desktop-h3 text-4xl leading-none md:text-6xl">
            {settings.tagline}
          </h2>
          <p className="max-w-md text-sm leading-6">{settings.intro}</p>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.35em]">Contact</p>
          <a className="block text-sm underline underline-offset-4" href={`mailto:${settings.contactEmail}`}>
            {settings.contactEmail}
          </a>
          <a
            className="block text-sm underline underline-offset-4"
            href={studioUrl}
            rel="noreferrer"
            target="_blank"
          >
            {settings.studioLabel}
          </a>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.35em]">Offices</p>
          <div className="space-y-2 text-sm">
            {settings.offices.map((office) => (
              <div className="flex items-center justify-between gap-4" key={office.city}>
                <span>{office.city}</span>
                <span className="uppercase tracking-[0.25em] text-[#4b4b4b]">{office.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
