import logo from "@/assets/logo.png";
import { JOURNEY_NODES, getActiveNode } from "@/journey/constants/nodes";
import { DESTINATION_CARDS } from "@/journey/overlays/cards";
import {
  useJourneyProgress,
  useJourneyProgressApi,
} from "@/journey/scroll/useJourneyProgress";
import { MapBackdrop } from "@/journey/world/MapBackdrop";
import { cn } from "@/utils/cn";
import { useEffect, useRef } from "react";

/** Vertical 2D glowing path with glass stations - optional non-WebGL journey. */
export function JourneyFallback2D() {
  const progress = useJourneyProgress();
  const { setProgress } = useJourneyProgressApi();
  const stationRefs = useRef<(HTMLElement | null)[]>([]);
  const percent = Math.round(progress * 100);
  const active = getActiveNode(progress);

  useEffect(() => {
    const nodes = stationRefs.current.filter(
      (el): el is HTMLElement => el !== null,
    );
    if (nodes.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.nodeId;
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = JOURNEY_NODES[0].id;
        let bestRatio = -1;
        for (const node of JOURNEY_NODES) {
          const ratio = ratios.get(node.id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = node.id;
          }
        }

        const best = JOURNEY_NODES.find((n) => n.id === bestId);
        if (best) {
          setProgress(best.dockT, { immediate: true });
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of nodes) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [setProgress]);

  return (
    <div className="relative min-h-svh text-nm-text">
      <MapBackdrop />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <div
          className="pointer-events-auto mx-auto flex w-full max-w-lg items-center gap-3 rounded-2xl border border-nm-border bg-nm-glass px-3 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          aria-label="Journey progress"
        >
          <img
            src={logo}
            alt="NavMe"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-contain"
          />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="truncate text-sm font-semibold tracking-wide text-nm-text">
                NavMe Journey
              </span>
              <span className="shrink-0 text-xs font-medium tabular-nums text-nm-highlight">
                {percent}%
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Journey completion"
            >
              <div
                className="h-full rounded-full bg-nm-highlight transition-[width] duration-150 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-28">
        <svg
          className="pointer-events-none absolute left-8 top-28 bottom-24 w-6 md:left-10"
          viewBox="0 0 24 1100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="journey-fallback-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c4a574" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#7C5CFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#6ecfc8" stopOpacity="0.95" />
            </linearGradient>
            <filter id="journey-fallback-blur" x="-80%" y="-10%" width="260%" height="120%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>
          <path
            d="M12 8 C 4 120, 20 220, 12 340 S 4 560, 12 700 S 20 900, 12 1090"
            fill="none"
            stroke="url(#journey-fallback-glow)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#journey-fallback-blur)"
            opacity="0.55"
          />
          <path
            d="M12 8 C 4 120, 20 220, 12 340 S 4 560, 12 700 S 20 900, 12 1090"
            fill="none"
            stroke="url(#journey-fallback-glow)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2={8 + (progress * 1082)}
            stroke="#6ecfc8"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>

        <ol className="relative flex flex-col gap-16 md:gap-20">
          {JOURNEY_NODES.map((node, index) => {
            const Card = DESTINATION_CARDS[node.id];
            const isActive = node.id === active.id;
            const visited = progress >= node.dockT - node.dockRadius;

            return (
              <li
                key={node.id}
                ref={(el) => {
                  stationRefs.current[index] = el;
                }}
                data-node-id={node.id}
                className="relative pl-14 md:pl-16"
              >
                <button
                  type="button"
                  onClick={() => {
                    stationRefs.current[index]?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    setProgress(node.dockT);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "absolute left-0 top-6 z-10 flex h-10 w-10 -translate-x-1 items-center justify-center rounded-full border text-sm font-semibold transition-shadow md:left-1 md:h-11 md:w-11",
                    isActive
                      ? "border-nm-highlight/70 bg-nm-highlight/20 text-nm-text shadow-[0_0_22px_rgba(110,207,200,0.35)]"
                      : visited
                        ? "border-nm-primary/50 bg-nm-secondary text-nm-text"
                        : "border-nm-border bg-nm-secondary/80 text-nm-muted",
                  )}
                  aria-label={`Station ${node.index}: ${node.title}`}
                >
                  {node.index}
                </button>

                <div
                  className={cn(
                    "transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-80",
                  )}
                >
                  {Card ? <Card /> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
