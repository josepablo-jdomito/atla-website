import { PAPER, PAPER_EDGE } from "./styles";

/**
 * The printed, photocopied surface, rebuilt in the browser from the designer's
 * Filtro.psd stack: artwork, ink bleed on the type, a paper plate in multiply,
 * and a photocopy layer in screen.
 *
 * The plate and photocopy layers are generated here with SVG turbulence rather
 * than shipped as scans, so there is nothing to download and nothing to animate.
 * They are static by design: grain that flickers frame to frame is the one thing
 * this look must never do. Drop the real plate.jpg and photocopy.jpg into
 * client/public/fx and point the two background images at them to upgrade.
 */

/** Yellowed paper grain. Kept at roughly 4% so the page reads cream, never aged. */
const PLATE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320">
    <filter id="p">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" seed="7"/>
      <feColorMatrix type="saturate" values="0.15"/>
    </filter>
    <rect width="320" height="320" filter="url(#p)" opacity="0.26"/>
  </svg>`.replace(/\s+/g, " "),
);

/** Toner specks. Screened back over everything so it reads as a copy of a copy. */
const PHOTOCOPY_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
    <filter id="c">
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="3"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0"/>
    </filter>
    <rect width="240" height="240" filter="url(#c)" opacity="0.5"/>
  </svg>`.replace(/\s+/g, " "),
);

export const PAPER_SURFACE_STYLE = `
  .wwl-paper {
    position: relative;
    background-color: ${PAPER};
    background-image: radial-gradient(ellipse at center, ${PAPER} 42%, ${PAPER_EDGE} 100%);
    color: #141414;
  }
  .wwl-paper::before,
  .wwl-paper::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }
  .wwl-paper::before {
    background-image: url("data:image/svg+xml,${PLATE_SVG}");
    mix-blend-mode: multiply;
  }
  .wwl-paper::after {
    background-image: url("data:image/svg+xml,${PHOTOCOPY_SVG}");
    mix-blend-mode: screen;
  }
  /* Ink bleed is expensive, so it is only ever worn by large serif type. */
  .wwl-bleed { filter: url(#wwl-ink-bleed); }
  @supports not (filter: url(#wwl-ink-bleed)) { .wwl-bleed { filter: none; } }
`;

/**
 * Thickens letters by a hair and roughens their edges, so type looks printed
 * rather than rendered. Built off a darkness mask so it also works on text
 * sitting on the lighter cards.
 */
export function InkBleedDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <filter id="wwl-ink-bleed" x="-6%" y="-6%" width="112%" height="112%">
          <feMorphology operator="dilate" radius="0.35" result="fat" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="noise" />
          <feDisplacementMap in="fat" in2="noise" scale="1.3" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feGaussianBlur in="rough" stdDeviation="0.4" result="soft" />
          <feComponentTransfer in="soft">
            <feFuncA type="linear" slope="1.5" intercept="-0.18" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
