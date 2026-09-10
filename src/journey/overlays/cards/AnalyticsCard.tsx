import {
  BUSINESS_IMPROVEMENTS,
  BUSINESS_OUTCOMES,
} from "@/constants/analytics";
import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { cn } from "@/utils/cn";
import { useState } from "react";

export function AnalyticsCard() {
  const [selectedGallery, setSelectedGallery] = useState<string>(
    BUSINESS_IMPROVEMENTS[0],
  );

  return (
    <DestinationCard
      className="[@media(max-height:720px)]:[&_h2]:text-[15px] [@media(max-height:640px)]:[&_h2]:text-sm"
      title="Every Visitor Journey Becomes an Insight"
      subtitle="Insights"
      body="NavMe isn't only visitor-facing. Museum teams gain meaningful spatial intelligence about how their physical spaces are explored."
    >
      <dl className="grid grid-cols-2 gap-1.5 sm:gap-2 [@media(max-height:720px)]:gap-1">
        {BUSINESS_OUTCOMES.map((outcome) => (
          <div
            key={outcome.id}
            className="rounded-lg border border-nm-border/60 bg-nm-secondary/40 px-2 py-1.5 sm:rounded-xl sm:px-3 sm:py-2 [@media(max-height:720px)]:px-1.5 [@media(max-height:720px)]:py-1"
          >
            <dt className="text-[9px] font-medium uppercase tracking-wider text-nm-muted sm:text-[10px] [@media(max-height:720px)]:text-[8px]">
              {outcome.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold leading-snug text-nm-text sm:text-base [@media(max-height:720px)]:text-xs">
              {outcome.value}
            </dd>
            <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-nm-muted sm:text-[10px] [@media(max-height:720px)]:line-clamp-1 [@media(max-height:720px)]:text-[8px]">
              {outcome.detail}
            </p>
          </div>
        ))}
      </dl>
      <ul
        className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-2 [@media(max-height:720px)]:mt-1.5 [@media(max-height:720px)]:gap-1"
        aria-label="Museum intelligence insights"
      >
        {BUSINESS_IMPROVEMENTS.map((item) => {
          const selected = selectedGallery === item;
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => setSelectedGallery(item)}
                aria-pressed={selected}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide sm:px-3 sm:py-1 sm:text-xs [@media(max-height:720px)]:px-1.5 [@media(max-height:720px)]:py-px [@media(max-height:720px)]:text-[8px]",
                  selected
                    ? "border-[#6ecfc8]/55 bg-[#6ecfc8]/15 text-nm-text"
                    : "border-nm-border/80 bg-nm-secondary/60 text-nm-muted hover:border-nm-border",
                )}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[10px] leading-snug text-nm-muted sm:mt-3 sm:text-[11px] md:text-xs [@media(max-height:640px)]:hidden">
        Discover what attracts attention. Identify what gets missed. Understand
        visitor behaviour. Design better museum experiences using real data.
      </p>
    </DestinationCard>
  );
}
