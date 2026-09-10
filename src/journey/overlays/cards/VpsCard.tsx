import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { storyItemGridClass } from "./peakShared";
import { cn } from "@/utils/cn";

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
        {PILLARS.map((pillar) => (
          <li key={pillar.id} className="min-h-0">
            <div className="flex h-full w-full flex-col justify-center rounded-xl border border-nm-border/60 bg-nm-secondary/40 px-3 py-2.5 text-left">
              <p className="text-[12px] font-semibold leading-snug tracking-tight text-nm-text">
                {pillar.label}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-nm-muted">
                {pillar.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </DestinationCard>
  );
}
