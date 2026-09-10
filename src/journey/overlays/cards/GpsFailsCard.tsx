import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { PeakCardExtras, storyItemGridClass } from "./peakShared";
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

function SignalFadeMark() {
  return (
    <svg viewBox="0 0 80 80" className="h-14 w-14" aria-hidden>
      <path
        d="M20 52 C28 36, 52 36, 60 52"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M26 56 C32 46, 48 46, 54 56"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M32 60 C36 54, 44 54, 48 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="40" cy="66" r="3" fill="currentColor" />
      <path
        d="M58 22 L62 34 L50 30 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      <path
        d="M22 24 H34 M22 30 H30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export function GpsFailsCard() {
  const [selectedId, setSelectedId] = useState<string>(SCENARIOS[0].id);

  return (
    <DestinationCard
      title="The Museum Starts Where Google Maps Stops."
      subtitle="The Problem"
      body="Visitors can reach the museum. But once inside, the experience becomes physical, fragmented and often difficult to navigate."
    >
      <ul
        className={cn(
          storyItemGridClass(SCENARIOS.length),
          "mb-3 gap-1.5 sm:mb-4 sm:gap-2 [@media(max-height:720px)]:mb-2 [@media(max-height:720px)]:gap-1",
        )}
        aria-label="Museum experience gap"
      >
        {SCENARIOS.map((scenario) => {
          const selected = selectedId === scenario.id;
          return (
            <li key={scenario.id}>
              <button
                type="button"
                onClick={() => setSelectedId(scenario.id)}
                aria-pressed={selected}
                className={cn(
                  "h-full w-full rounded-lg border px-2 py-1.5 text-left sm:rounded-xl sm:px-2.5 sm:py-2 [@media(max-height:720px)]:px-1.5 [@media(max-height:720px)]:py-1",
                  selected
                    ? "border-[#6ecfc8]/55 bg-nm-secondary/70 shadow-[0_0_0_1px_rgba(110,207,200,0.18)]"
                    : "border-nm-border/60 bg-nm-secondary/40 hover:border-nm-border",
                )}
              >
                <p className="text-[10px] font-semibold leading-snug tracking-tight text-nm-text sm:text-xs [@media(max-height:720px)]:text-[9px]">
                  {scenario.label}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-nm-muted sm:line-clamp-3 sm:text-[11px] [@media(max-height:720px)]:line-clamp-1 [@media(max-height:720px)]:text-[8px]">
                  {scenario.detail}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mb-3 text-[10px] leading-snug text-nm-muted sm:mb-4 sm:text-[11px] md:text-xs [@media(max-height:640px)]:hidden">
        Turn the museum itself into an interactive, guided digital experience.
      </p>
      <PeakCardExtras illustration={<SignalFadeMark />} />
    </DestinationCard>
  );
}
