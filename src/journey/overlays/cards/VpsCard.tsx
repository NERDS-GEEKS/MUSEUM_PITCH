import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { storyItemGridClass } from "./peakShared";
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

export function VpsCard() {
  const [selectedId, setSelectedId] = useState<string>(PILLARS[0].id);

  return (
    <DestinationCard
      size="lg"
      title="Turn Your Museum Into a Guided Experience"
      subtitle="Solution"
      body="NavMe adds a digital layer to your physical museum directly through the visitor's smartphone browser. No App. No Download. No Additional Hardware."
    >
      <ul
        className={cn(storyItemGridClass(PILLARS.length), "min-h-0 flex-1")}
        aria-label="NavMe experience pillars"
      >
        {PILLARS.map((pillar) => {
          const selected = selectedId === pillar.id;
          return (
            <li key={pillar.id} className="min-h-0">
              <button
                type="button"
                onClick={() => setSelectedId(pillar.id)}
                aria-pressed={selected}
                className={cn(
                  "flex h-full w-full flex-col justify-center rounded-xl border px-3 py-2.5 text-left",
                  selected
                    ? "border-[#6ecfc8]/55 bg-nm-secondary/70 shadow-[0_0_0_1px_rgba(110,207,200,0.18)]"
                    : "border-nm-border/60 bg-nm-secondary/40 hover:border-nm-border",
                )}
              >
                <p className="text-[12px] font-semibold leading-snug tracking-tight text-nm-text">
                  {pillar.label}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-nm-muted">
                  {pillar.detail}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </DestinationCard>
  );
}
