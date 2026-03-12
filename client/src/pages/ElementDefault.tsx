import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";

const galleryImages = [
  {
    src: "/figmaAssets/media.png",
    width: "w-[225px]",
    height: "h-[337.5px]",
    marginClass: "ml-[-200px]",
    isCenter: false,
  },
  {
    src: "/figmaAssets/media-1.png",
    width: "w-[225px]",
    height: "h-[337.5px]",
    marginClass: "",
    isCenter: false,
  },
  {
    src: "/figmaAssets/media-2.png",
    width: "w-[300px]",
    height: "h-[450px]",
    marginClass: "",
    isCenter: true,
  },
  {
    src: "/figmaAssets/media-3.png",
    width: "w-[225px]",
    height: "h-[337.5px]",
    marginClass: "",
    isCenter: false,
  },
  {
    src: "/figmaAssets/media-4.png",
    width: "w-[225px]",
    height: "h-[337.5px]",
    marginClass: "mr-[-200px]",
    isCenter: false,
  },
];

export const ElementDefault = (): JSX.Element => {
  return (
    <div className="w-full flex flex-col items-center bg-neutral-50">
      {/* ── 750px home viewport ── */}
      <div className="flex flex-col w-full md:w-[1200px] h-screen md:h-[750px] items-center justify-between relative bg-neutral-50 overflow-hidden">
        <AtlaNav />

        {/* Main gallery section */}
        <section className="flex gap-[100px] self-stretch w-full items-center justify-center relative flex-[0_0_auto] overflow-visible">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`inline-flex flex-col items-center justify-center gap-3 relative flex-[0_0_auto] ${image.marginClass}`}
            >
              <div
                className={`relative ${image.width} ${image.height}`}
                style={{ background: `url(${image.src}) 50% 50% / cover` }}
              />
              {image.isCenter && (
                <div className="absolute top-[calc(50%_-_70px)] left-[calc(50%_-_188px)] w-[375px] h-[140px]">
                  <div className="absolute top-[35px] left-0 w-full h-[70px] flex items-center justify-center font-web-desktop-h3 font-[number:var(--web-desktop-h3-font-weight)] text-atlacolormarble-white text-[length:var(--web-desktop-h3-font-size)] text-center tracking-[var(--web-desktop-h3-letter-spacing)] leading-[var(--web-desktop-h3-line-height)] whitespace-nowrap [font-style:var(--web-desktop-h3-font-style)]">
                    Project Name
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Bottom text strip (home-specific) */}
        <div
          data-testid="home-footer-strip"
          className="flex h-[50px] items-start justify-center gap-2.5 px-5 py-0 relative self-stretch w-full"
        >
          <div className="flex items-center gap-2.5 relative flex-1 grow">
            <p
              style={{
                fontFamily: LIBRE,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.48,
                lineHeight: "120%",
                color: "#222222",
                textTransform: "uppercase",
              }}
            >
              WORKING AROUND <br />
              THE US &amp; LATAM
            </p>
          </div>
          <div className="flex items-center justify-end gap-2.5 relative flex-1 grow">
            <p
              style={{
                fontFamily: LIBRE,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.48,
                lineHeight: "120%",
                color: "#222222",
                textAlign: "right",
                textTransform: "uppercase",
              }}
            >
              DESIGN WITH
              <br />
              INTENTION
            </p>
          </div>
        </div>
      </div>

      {/* ── Full yellow footer section ── */}
      <div className="w-full md:w-[1200px]">
        <AtlaFooter />
      </div>
    </div>
  );
};
