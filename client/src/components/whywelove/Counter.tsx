import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { INK, SERIF, label } from "./styles";

const RUN_MS = 1600;

/** A big serif number ticking up, with its label underneath. */
export function Counter({ to, caption }: { to: number; caption: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const startedAt = performance.now();
    const step = (now: number) => {
      const ratio = Math.min((now - startedAt) / RUN_MS, 1);
      // Expo-out, so the count arrives rather than stops.
      setValue(Math.round(to * (1 - Math.pow(1 - ratio, 4))));
      if (ratio < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, to]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <span
        className="wwl-bleed"
        style={{
          fontFamily: SERIF,
          fontWeight: 300,
          fontSize: "clamp(4rem, 12vw, 10.5rem)",
          lineHeight: 0.9,
          letterSpacing: "-0.015em",
          color: INK,
        }}
        aria-live="polite"
      >
        {value}
      </span>
      <span style={{ ...label, fontSize: 12 }}>{caption}</span>
    </div>
  );
}
