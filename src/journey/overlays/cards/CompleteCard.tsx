import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { VITM_MUSEUM_URL } from "@/constants/contact";
import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { PeakContinueButton } from "./peakShared";
import { useJourneyProgressApi } from "@/journey/scroll/useJourneyProgress";
import { useDestinationDetail } from "@/journey/overlays/useDestinationDetail";

const VALUE_GRID = [
  {
    label: "For Visitors",
    detail: "Navigate easier. Discover more. Experience deeper.",
  },
  {
    label: "For Curators",
    detail: "Tell richer stories. Create new forms of engagement.",
  },
  {
    label: "For Museum Teams",
    detail: "Understand visitor behaviour. Improve the experience.",
  },
  {
    label: "For Museums",
    detail:
      "Turn a static physical space into a living, interactive and measurable destination.",
  },
] as const;

const PIPELINE = [
  "PHYSICAL SPACE",
  "SPATIAL INTELLIGENCE",
  "DIGITAL EXPERIENCE",
  "MUSEUM INTELLIGENCE",
] as const;

export function CompleteCard() {
  const { setProgress } = useJourneyProgressApi();
  const { close } = useDestinationDetail();

  return (
    <DestinationCard
      title="The Future Museum Is Phygital"
      subtitle="From Maps to Experiences."
      body="NavMe turns a static physical space into a living, interactive and measurable destination."
      showCtas={false}
    >
      <ol
        className="mb-3 flex flex-wrap items-center gap-1 sm:mb-4 sm:gap-1.5"
        aria-label="Future museum pipeline"
      >
        {PIPELINE.map((step, index) => (
          <li key={step} className="flex items-center gap-1 sm:gap-1.5">
            {index > 0 ? (
              <span className="text-[9px] text-nm-primary sm:text-[10px]" aria-hidden>
                ↓
              </span>
            ) : null}
            <span className="rounded-full border border-[#6ecfc8]/40 bg-nm-secondary/50 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-nm-text sm:text-[10px]">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <dl className="mb-3 grid grid-cols-2 gap-1.5 sm:mb-4 sm:gap-2">
        {VALUE_GRID.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-nm-border/60 bg-nm-secondary/40 px-2 py-1.5 sm:rounded-xl sm:px-2.5 sm:py-2"
          >
            <dt className="text-[9px] font-medium uppercase tracking-[0.14em] text-nm-primary sm:text-[10px]">
              {item.label}
            </dt>
            <dd className="mt-0.5 text-[10px] leading-snug text-nm-text sm:text-[11px]">
              {item.detail}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Magnetic>
          <Button
            type="button"
            variant="glass"
            size="md"
            onClick={() => {
              close();
              setProgress(0);
            }}
          >
            Replay journey
          </Button>
        </Magnetic>
        <PeakContinueButton toId="industries" label="See the Conversion" />
        <Magnetic>
          <Button
            href={VITM_MUSEUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
          >
            Explore the VITM Museum
          </Button>
        </Magnetic>
      </div>
    </DestinationCard>
  );
}
