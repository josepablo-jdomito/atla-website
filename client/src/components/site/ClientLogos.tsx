import { siteCopy } from "@/content/siteCopy";

const { logos } = siteCopy;

/**
 * Client marks above the footer: two rows drifting opposite ways, static under reduced motion.
 * The marks are monochrome SVGs in client/public/logos-v2/; with no files the band renders
 * nothing, so no logo is ever invented.
 */
export function ClientLogos() {
  if (logos.items.length === 0) return null;
  const half = Math.ceil(logos.items.length / 2);
  const rows = [logos.items.slice(0, half), logos.items.slice(half)].filter((row) => row.length > 0);
  return (
    <section className="client-logos" aria-label={logos.label}>
      <div role="img" aria-label={logos.items.map((item) => item.name).join(", ")} className="client-logos__rows">
        {rows.map((row, index) => (
          <div key={index} className="client-logos__row" data-direction={index % 2 === 0 ? "left" : "right"} aria-hidden="true">
            {/* Two copies, so the loop never shows its seam. */}
            {[0, 1].map((copy) => (
              <div key={copy} className="client-logos__track">
                {row.map((item) => (
                  <span key={`${copy}-${item.name}`} className="client-logos__mark">
                    <img src={item.src} alt="" width={item.width} height={item.height} decoding="async" draggable={false} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
