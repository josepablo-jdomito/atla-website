import { useEffect, useRef, useState } from "react";
import { initialClientState } from "@/lib/hydration";

/**
 * One of the landing's ink drawings, animated (JP, 2026-11-07: "anima las ilustraciones"). The still
 * drawing (ink on transparent, `src`) is what the prerender, reduced motion and every failure show;
 * once the page is live and motion is allowed, a short looping clip of the same drawing plays over it.
 * The clip is plain video on white (H.264 for every browser, VP9 where it is lighter): the page
 * multiplies it onto the paper, so the white disappears and only the ink shows; in dark mode it is
 * inverted and screened (site.css). No alpha channel, so Safari shows no box. Muted, inline, looping,
 * no controls; the still stays as the poster.
 */
export function Drawing({
  src,
  clip,
  alt,
  width,
  height,
  className,
  eager = false,
}: {
  src: string;
  /** The clip's path without extension; `.webm` and `.mp4` are served beside it. */
  clip?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  eager?: boolean;
}) {
  const [motion, setMotion] = useState(() => initialClientState(false, () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches));
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setMotion(!mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Browsers may refuse autoplay or the format: the still is already underneath, so the clip just leaves.
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const play = el.play();
    if (play && typeof play.catch === "function") play.catch(() => setFailed(true));
  }, [motion, clip]);

  const showClip = Boolean(clip) && motion && !failed;
  return (
    <span className={className} data-drawing="" data-live={showClip ? "" : undefined}>
      <img src={src} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" fetchPriority={eager ? "high" : undefined} />
      {showClip ? (
        <video
          ref={video}
          className="drawing__clip"
          width={width}
          height={height}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          // A <source> the browser skips also fires error here (React listens in capture); only the
          // video's own error, once every source failed, means the still stays.
          onError={(event) => {
            if (event.target === event.currentTarget && event.currentTarget.error) setFailed(true);
          }}
        >
          <source src={`${clip}.webm`} type="video/webm" />
          <source src={`${clip}.mp4`} type="video/mp4" />
        </video>
      ) : null}
    </span>
  );
}
