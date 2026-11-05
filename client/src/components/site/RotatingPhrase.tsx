import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const INTERVAL_MS = 3000;

/**
 * Cycles through `items` every 3 s with a 250 ms opacity/blur crossfade.
 * Every item sits in the same grid cell, so the line keeps the size of the
 * longest phrase and nothing around it moves. Pauses on hover and while the
 * tab is hidden; under reduced motion it shows the first item only.
 */
export function RotatingPhrase({ items }: { items: string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const running = !reduced && !hovered && !hidden && items.length > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % items.length), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [running, items.length]);

  if (items.length === 0) return null;
  if (reduced) return <span className="rotating-phrase">{items[0]}</span>;

  const active = index % items.length;
  return (
    <span
      className="rotating-phrase"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {items.map((item, i) => (
        <span key={item} className="rotating-phrase__item" data-active={i === active} aria-hidden={i !== active}>
          {item}
        </span>
      ))}
    </span>
  );
}
