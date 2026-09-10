import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { storyItemGridClass } from "./peakShared";
import { cn } from "@/utils/cn";

const SCENARIOS = [
  {
    id: "finding",
    label: "Finding Galleries",
    detail: "Locate exhibits, facilities and different floors.",
  },
  {
    id: "explore",
    label: "Knowing What to Explore",
    detail: "Help visitors decide where to go next.",
  },
  {
    id: "hidden",
    label: "Hidden Collections",
    detail: "Reveal exhibits visitors might otherwise miss.",
  },
  {
    id: "stories",
    label: "Understanding Stories",
    detail: "Bring artifacts to life beyond static labels.",
  },
] as const;

export function GpsFailsCard() {
  return (
    <DestinationCard
      title="The Museum Starts Where Google Maps Stops."
      subtitle="Problem"
      body="Visitors can reach the museum. But once inside, the experience becomes physical, fragmented and often difficult to navigate."
    >
      <ul
        className={cn(storyItemGridClass(SCENARIOS.length), "min-h-0 flex-1")}
        aria-label="Museum experience gap"
      >
        {SCENARIOS.map((scenario) => (
          <li key={scenario.id} className="min-h-0">
            <div className="flex h-full w-full flex-col justify-center rounded-xl border border-nm-border/60 bg-nm-secondary/40 px-3 py-2.5 text-left">
              <p className="text-[12px] font-semibold leading-snug tracking-tight text-nm-text">
                {scenario.label}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-nm-muted">
                {scenario.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </DestinationCard>
  );
}
