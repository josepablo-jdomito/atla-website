import { useInView } from "@/hooks/use-in-view";
import { CANVAS_BLOCKS } from "@/data/whyWeLove";
import { EASE, INK, LABEL_FONT } from "./styles";

const SIZE = 560;
const CENTER = SIZE / 2;
/** Six concentric rules, thin, evenly spaced out to the label ring. */
const RING_RADII = [84, 118, 152, 186, 220, 244];
const LABEL_RADIUS = 232;
const SPOKE_INNER = 84;
const SPOKE_OUTER = 244;

/**
 * The Canvas: the framework's emblem. Six thin ink circles, eight spokes, and
 * the eight blocks set on the arcs. It turns slowly and forever, and it draws
 * itself the first time it scrolls into view.
 */
export function RingDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  return (
    <div ref={ref} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`The Canvas: ${CANVAS_BLOCKS.map((block) => block.name).join(", ")}`}
        style={{ width: "min(100%, 560px)", height: "auto", overflow: "visible" }}
      >
        <defs>
          {CANVAS_BLOCKS.map((block, index) => {
            // One arc per block, each an eighth of the label ring, centred on
            // its own slice. Arcs on the bottom half are drawn the other way
            // round so their text reads right-side up instead of inverted.
            const slice = 360 / CANVAS_BLOCKS.length;
            const start = index * slice - 90 - slice / 2;
            const end = start + slice;
            const mid = ((start + slice / 2) * Math.PI) / 180;
            const flipped = Math.sin(mid) > 0;
            const radius = flipped ? LABEL_RADIUS - 15 : LABEL_RADIUS;
            const toPoint = (angle: number) => {
              const radians = (angle * Math.PI) / 180;
              return `${CENTER + radius * Math.cos(radians)} ${CENTER + radius * Math.sin(radians)}`;
            };
            const d = flipped
              ? `M ${toPoint(end)} A ${radius} ${radius} 0 0 0 ${toPoint(start)}`
              : `M ${toPoint(start)} A ${radius} ${radius} 0 0 1 ${toPoint(end)}`;
            return <path key={block.id} id={`wwl-arc-${block.id}`} fill="none" d={d} />;
          })}
        </defs>

        <g
          style={{
            transformOrigin: "center",
            animation: inView ? "wwl-ring-spin 180s linear infinite" : undefined,
          }}
        >
          {RING_RADII.map((radius, index) => {
            const circumference = 2 * Math.PI * radius;
            return (
              <circle
                key={radius}
                cx={CENTER}
                cy={CENTER}
                r={radius}
                fill="none"
                stroke={INK}
                strokeWidth={1.2}
                strokeDasharray={circumference}
                strokeDashoffset={inView ? 0 : circumference}
                style={{ transition: `stroke-dashoffset 1400ms ${EASE.arrive} ${index * 90}ms` }}
              />
            );
          })}

          {CANVAS_BLOCKS.map((block, index) => {
            const angle = ((index * 360) / CANVAS_BLOCKS.length - 90) * (Math.PI / 180);
            return (
              <line
                key={`spoke-${block.id}`}
                x1={CENTER + SPOKE_INNER * Math.cos(angle)}
                y1={CENTER + SPOKE_INNER * Math.sin(angle)}
                x2={CENTER + SPOKE_OUTER * Math.cos(angle)}
                y2={CENTER + SPOKE_OUTER * Math.sin(angle)}
                stroke={INK}
                strokeWidth={1.2}
                opacity={inView ? 1 : 0}
                style={{ transition: `opacity 600ms ${EASE.arrive} ${600 + index * 60}ms` }}
              />
            );
          })}

          {CANVAS_BLOCKS.map((block, index) => (
            <text
              key={`label-${block.id}`}
              fill={INK}
              style={{
                fontFamily: LABEL_FONT,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: inView ? 1 : 0,
                transition: `opacity 600ms ${EASE.arrive} ${800 + index * 60}ms`,
              }}
            >
              <textPath href={`#wwl-arc-${block.id}`} startOffset="50%" textAnchor="middle">
                {block.short.toUpperCase()}
              </textPath>
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
