import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { PeakCardExtras, storyItemGridClass } from "./peakShared";
import { cn } from "@/utils/cn";
import { useState } from "react";

const PILLARS = [
  {
    id: "navigate",
    label: "Navigate",
    detail:
      "Find galleries, exhibits and amenities with intuitive indoor guidance.",
  },
  {
    id: "discover",
    label: "Discover",
    detail:
      "Explore nearby collections, hidden stories and points of interest.",
  },
  {
    id: "experience",
    label: "Experience",
    detail:
      "Unlock images, videos, audio, 3D models and WebAR experiences.",
  },
  {
    id: "understand",
    label: "Understand",
    detail:
      "Receive multilingual content for a more inclusive visitor experience.",
  },
] as const;

function BrowserNavMark() {
  return (
    <svg viewBox="0 0 80 80" className="h-14 w-14" aria-hidden>
      <rect
        x="14"
        y="18"
        width="52"
        height="44"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
      />
      <path
        d="M14 28 H66"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.45"
      />
      <circle cx="22" cy="23" r="1.8" fill="currentColor" opacity="0.55" />
      <circle cx="28" cy="23" r="1.8" fill="currentColor" opacity="0.55" />
      <circle cx="34" cy="23" r="1.8" fill="currentColor" opacity="0.55" />
      <path
        d="M28 52 L38 40 L48 46 L58 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="52" r="2.5" fill="currentColor" />
      <circle
        cx="58"
        cy="34"
        r="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function VpsCard() {
  const [selectedId, setSelectedId] = useState<string>(PILLARS[0].id);

  return (
    <DestinationCard
      size="lg"
      title="Turn Your Museum Into a Guided Experience"
      subtitle="Meet NavMe"
      body="NavMe adds a digital layer to your physical museum directly through the visitor's smartphone browser. No App. No Download. No Additional Hardware."
    >
      <ul
        className={cn(
          storyItemGridClass(PILLARS.length),
          "mb-3 gap-1.5 sm:mb-4 sm:gap-2",
        )}
        aria-label="NavMe experience pillars"
      >
        {PILLARS.map((pillar) => {
          const selected = selectedId === pillar.id;
          return (
            <li key={pillar.id}>
              <button
                type="button"
                onClick={() => setSelectedId(pillar.id)}
                aria-pressed={selected}
                className={cn(
                  "h-full w-full rounded-lg border px-2 py-1.5 text-left sm:rounded-xl sm:px-2.5 sm:py-2",
                  selected
                    ? "border-[#6ecfc8]/55 bg-nm-secondary/70 shadow-[0_0_0_1px_rgba(110,207,200,0.18)]"
                    : "border-nm-border/60 bg-nm-secondary/40 hover:border-nm-border",
                )}
              >
                <p className="text-[10px] font-semibold leading-snug tracking-tight text-nm-text sm:text-xs">
                  {pillar.label}
                </p>
                <p className="mt-0.5 line-clamp-3 text-[9px] leading-snug text-nm-muted sm:text-[11px]">
                  {pillar.detail}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mb-3 text-[10px] leading-snug text-nm-muted sm:mb-4 sm:text-[11px] md:text-xs">
        One museum. One spatial experience. Every visitor journey connected.
      </p>
      <PeakCardExtras illustration={<BrowserNavMark />} />
    </DestinationCard>
  );
}
