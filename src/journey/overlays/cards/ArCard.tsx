import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { storyItemGridClass } from "./peakShared";
import { cn } from "@/utils/cn";
import { useState } from "react";

const LAYERS = [
  {
    id: "family",
    step: "01",
    label: "Family",
    detail: "A 60-minute discovery trail through the most engaging galleries.",
  },
  {
    id: "student",
    step: "02",
    label: "Student",
    detail: "A science and engineering learning journey aligned to exhibits.",
  },
  {
    id: "tourist",
    step: "03",
    label: "Tourist",
    detail: "Museum highlights for a first visit with limited time.",
  },
  {
    id: "researcher",
    step: "04",
    label: "Researcher",
    detail: "Advanced technical exhibits and deeper collection access.",
  },
  {
    id: "accessibility",
    step: "05",
    label: "Accessibility",
    detail: "An inclusive navigation route through the same museum.",
  },
] as const;

export function ArCard() {
  const [selectedId, setSelectedId] = useState<string>(LAYERS[0].id);

  return (
    <DestinationCard
      title="One Museum. Five Different Experiences."
      subtitle="Personalized Visits"
      body="Changing a visitor persona redraws the museum path dynamically: the same Digital Twin, five learning journeys."
    >
      <ol
        className={cn(storyItemGridClass(LAYERS.length), "min-h-0 flex-1")}
        aria-label="Museum visitor personas"
      >
        {LAYERS.map((layer) => {
          const selected = selectedId === layer.id;
          return (
            <li key={layer.id} className="min-h-0">
              <button
                type="button"
                onClick={() => setSelectedId(layer.id)}
                aria-pressed={selected}
                className={cn(
                  "flex h-full w-full flex-col justify-center rounded-xl border px-2 py-2 text-left",
                  selected
                    ? "border-[#6ecfc8]/55 bg-nm-secondary/70 shadow-[0_0_0_1px_rgba(110,207,200,0.18)]"
                    : "border-nm-border/60 bg-nm-secondary/40 hover:border-nm-border",
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-nm-primary">
                  {layer.step}
                </p>
                <p className="mt-0.5 text-[12px] font-semibold leading-snug tracking-tight text-nm-text">
                  {layer.label}
                </p>
                <p className="mt-1 line-clamp-3 text-[10px] leading-snug text-nm-muted">
                  {layer.detail}
                </p>
              </button>
            </li>
          );
        })}
      </ol>
    </DestinationCard>
  );
}
