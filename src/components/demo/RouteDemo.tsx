import { GlassPanel } from "@/components/ui/GlassPanel";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

type DestinationId = "entrance" | "space" | "engine" | "exit";

type Destination = {
  id: DestinationId;
  label: string;
  path: string;
  end: { x: number; y: number };
};

const START = { x: 48, y: 220 } as const;

const DESTINATIONS: readonly Destination[] = [
  {
    id: "entrance",
    label: "Entrance",
    path: "M48 220 L48 180 L90 180 L90 140",
    end: { x: 90, y: 140 },
  },
  {
    id: "space",
    label: "Space Gallery",
    path: "M48 220 L48 160 L160 160 L160 90 L220 90",
    end: { x: 220, y: 90 },
  },
  {
    id: "engine",
    label: "Engine Hall",
    path: "M48 220 L48 160 L160 160 L160 200 L280 200 L280 150",
    end: { x: 280, y: 150 },
  },
  {
    id: "exit",
    label: "Exit",
    path: "M48 220 L48 160 L160 160 L160 60 L340 60 L340 100",
    end: { x: 340, y: 100 },
  },
] as const;

export function RouteDemo() {
  const reduce = usePrefersReducedMotion();
  const gradientId = useId();
  const pathRef = useRef<SVGPathElement>(null);
  const [activeId, setActiveId] = useState<DestinationId>("space");
  const active = DESTINATIONS.find((d) => d.id === activeId) ?? DESTINATIONS[1];

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length =
      typeof path.getTotalLength === "function" ? path.getTotalLength() : 480;
    path.style.strokeDasharray = `${length}`;

    if (reduce) {
      path.style.strokeDashoffset = "0";
      path.style.transition = "none";
      return;
    }

    path.style.transition = "none";
    path.style.strokeDashoffset = `${length}`;
    // Force reflow so the draw animation restarts on destination change.
    void path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)";
    path.style.strokeDashoffset = "0";
  }, [activeId, reduce, active.path]);

  return (
    <GlassPanel className="overflow-hidden p-4 md:p-6">
      <div
        className="mb-4 flex flex-wrap gap-2"
        role="group"
        aria-label="Choose a destination"
      >
        {DESTINATIONS.map((destination) => {
          const selected = destination.id === activeId;
          return (
            <button
              key={destination.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveId(destination.id)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-nm-highlight/70 bg-nm-highlight/15 text-nm-text"
                  : "border-nm-border bg-nm-secondary/80 text-nm-muted hover:border-nm-primary/50 hover:text-nm-text",
              )}
            >
              {destination.label}
            </button>
          );
        })}
      </div>

      <svg
        viewBox="0 0 400 260"
        className="h-auto w-full"
        role="img"
        aria-label={`Route to ${active.label}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(79,139,255,0.14)" />
            <stop offset="100%" stopColor="rgba(5,5,5,0)" />
          </linearGradient>
        </defs>

        <rect width="400" height="260" rx="16" fill={`url(#${gradientId})`} />

        {/* Floor outline */}
        <rect
          x="28"
          y="28"
          width="344"
          height="204"
          rx="12"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
        <path
          d="M28 120 H160 V28 M160 120 H372 M160 180 H280 V232"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />

        {/* Destination markers */}
        {DESTINATIONS.map((destination) => (
          <circle
            key={destination.id}
            cx={destination.end.x}
            cy={destination.end.y}
            r="4"
            className={
              destination.id === activeId ? "fill-nm-highlight" : "fill-nm-muted/50"
            }
          />
        ))}

        {/* Start node */}
        <circle cx={START.x} cy={START.y} r="6" className="fill-nm-primary" />
        <circle
          cx={START.x}
          cy={START.y}
          r="11"
          fill="none"
          stroke="rgba(79,139,255,0.45)"
          strokeWidth="1.5"
        />

        {/* Active route */}
        <path
          ref={pathRef}
          key={active.path}
          d={active.path}
          fill="none"
          stroke="var(--nm-highlight)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End pulse */}
        <motion.circle
          cx={active.end.x}
          cy={active.end.y}
          r="7"
          className="fill-nm-highlight"
          animate={
            reduce
              ? undefined
              : {
                  scale: [1, 1.35, 1],
                  opacity: [1, 0.65, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {!reduce ? (
          <motion.circle
            cx={active.end.x}
            cy={active.end.y}
            r="14"
            fill="none"
            stroke="rgba(62,244,255,0.55)"
            strokeWidth="1.5"
            animate={{ scale: [0.85, 1.4], opacity: [0.7, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
        ) : null}
      </svg>

      <p className="mt-3 text-center text-sm text-nm-muted">
        Tap a gallery to preview a museum route.
      </p>
    </GlassPanel>
  );
}
