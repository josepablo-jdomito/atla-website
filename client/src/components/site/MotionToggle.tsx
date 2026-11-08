import { siteCopy } from "@/content/siteCopy";
import { setMotionPaused, useMotionPaused } from "@/components/site/media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The single pause mechanism for autoplaying loops (WCAG 2.2.2). One per page: the wall carries it
 * on the home, a project page carries it above its first video. Visitors who asked for reduced
 * motion already see stills, so it does not render for them.
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const paused = useMotionPaused();
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <button
      type="button"
      className={`motion-toggle ${className}`.trim()}
      aria-pressed={paused}
      onClick={() => setMotionPaused(!paused)}
    >
      {paused ? siteCopy.motion.play : siteCopy.motion.pause}
    </button>
  );
}
