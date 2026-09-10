import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { createRouteCurve } from "@/journey/path/routeCurve";
import {
  useJourneyProgress,
  useJourneyProgressApi,
} from "@/journey/scroll/useJourneyProgress";

const VIEW = 128;
const PAD = 14;

const xs = JOURNEY_NODES.map((node) => node.position[0]);
const zs = JOURNEY_NODES.map((node) => node.position[2]);
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minZ = Math.min(...zs);
const maxZ = Math.max(...zs);
const spanX = Math.max(maxX - minX, 1e-6);
const spanZ = Math.max(maxZ - minZ, 1e-6);
const inner = VIEW - PAD * 2;
const scale = Math.min(inner / spanX, inner / spanZ);
const offsetX = PAD + (inner - spanX * scale) / 2;
const offsetZ = PAD + (inner - spanZ * scale) / 2;

function project(x: number, z: number): { x: number; y: number } {
  return {
    x: offsetX + (x - minX) * scale,
    y: offsetZ + (z - minZ) * scale,
  };
}

const NODE_POINTS = JOURNEY_NODES.map((node) =>
  project(node.position[0], node.position[2]),
);

const PATH_D = NODE_POINTS.map((point, index) =>
  `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
).join(" ");

const routeCurve = createRouteCurve(
  JOURNEY_NODES.map((node) => node.position),
);

export function MiniMap() {
  const progress = useJourneyProgress();
  const { setProgress } = useJourneyProgressApi();
  const marker3d = routeCurve.getPointAt(progress);
  const marker = project(marker3d.x, marker3d.z);
  const pathLength = 400;
  const traveled = progress * pathLength;

  return (
    <div
      className="relative h-32 w-32 shrink-0"
      role="group"
      aria-label="Route mini-map"
    >
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="h-full w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        aria-hidden
      >
        <defs>
          <radialGradient id="mm-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6ECFC8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#6ECFC8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width={VIEW}
          height={VIEW}
          rx="18"
          className="fill-nm-secondary/90 stroke-nm-border"
          strokeWidth="1"
        />
        {/* Full route */}
        <path
          d={PATH_D}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Completed route */}
        <path
          d={PATH_D}
          fill="none"
          stroke="#C4A574"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength - traveled}
          opacity="0.85"
        />
        {JOURNEY_NODES.map((node, index) => {
          const point = NODE_POINTS[index];
          const visited = progress >= node.dockT;
          return (
            <circle
              key={node.id}
              cx={point.x}
              cy={point.y}
              r={visited ? 3.8 : 3}
              fill={visited ? "#C4A574" : "rgba(181,181,181,0.55)"}
              aria-hidden
            />
          );
        })}
        {/* You-are-here pulse */}
        <circle
          cx={marker.x}
          cy={marker.y}
          r="12"
          fill="url(#mm-pulse)"
          className="origin-center animate-pulse"
        />
        <circle
          cx={marker.x}
          cy={marker.y}
          r="4.5"
          className="fill-nm-highlight"
          aria-hidden
        />
        <circle
          cx={marker.x}
          cy={marker.y}
          r="7.5"
          fill="none"
          stroke="#6ECFC8"
          strokeOpacity="0.65"
          strokeWidth="1.5"
          aria-hidden
        />
      </svg>
      {JOURNEY_NODES.map((node, index) => {
        const point = NODE_POINTS[index];
        return (
          <button
            key={node.id}
            type="button"
            aria-label={`Go to ${node.title}`}
            onClick={() => setProgress(node.dockT)}
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent hover:bg-nm-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight"
            style={{
              left: `${(point.x / VIEW) * 100}%`,
              top: `${(point.y / VIEW) * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
}
