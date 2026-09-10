import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { storyItemGridClass } from "./peakShared";
import { cn } from "@/utils/cn";
import { useState } from "react";

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
  const [selectedId, setSelectedId] = useState<string>(SCENARIOS[0].id);

  return (
    <DestinationCard
      title="The Museum Starts Where Google Maps Stops."
      subtitle="The Problem"
      body="Visitors can reach the museum. But once inside, the experience becomes physical, fragmented and often difficult to navigate."
    >
      <ul
        className={cn(storyItemGridClass(SCENARIOS.length), "min-h-0 flex-1")}
        aria-label="Museum experience gap"
      >
        {SCENARIOS.map((scenario) => {
          const selected = selectedId === scenario.id;
          return (
            <li key={scenario.id} className="min-h-0">
              <button
                type="button"
                onClick={() => setSelectedId(scenario.id)}
                aria-pressed={selected}
                className={cn(
                  "flex h-full w-full flex-col justify-center rounded-xl border px-3 py-2.5 text-left",
                  selected
                    ? "border-[#6ecfc8]/55 bg-nm-secondary/70 shadow-[0_0_0_1px_rgba(110,207,200,0.18)]"
                    : "border-nm-border/60 bg-nm-secondary/40 hover:border-nm-border",
                )}
              >
                <p className="text-[12px] font-semibold leading-snug tracking-tight text-nm-text">
                  {scenario.label}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-nm-muted">
                  {scenario.detail}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </DestinationCard>
  );
}
