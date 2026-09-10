import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { cn } from "@/utils/cn";
import { PeakCardExtras, storyItemGridClass } from "./peakShared";

const HOW_STEPS = [
  {
    id: "exploded",
    step: "01",
    label: "3D Exploded View",
    detail:
      "The exhibit opens in AR so visitors can see how every part fits together.",
  },
  {
    id: "components",
    step: "02",
    label: "Internal Components",
    detail:
      "Hidden mechanisms and scientific internals become visible, not locked behind glass.",
  },
  {
    id: "animation",
    step: "03",
    label: "Working Animation",
    detail:
      "Machines, engines, and experiments come alive with motion while you scroll.",
  },
  {
    id: "story",
    step: "04",
    label: "Audio & History",
    detail:
      "Narration, historical story, and related exhibits continue the learning journey.",
  },
] as const;

const FLOW = [
  "Exhibit",
  "Explode",
  "Animate",
  "Narrate",
  "Related",
  "Discover",
] as const;

function NeuralRouteMark() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-10 w-10 text-nm-accent sm:h-14 sm:w-14 [@media(max-height:720px)]:h-8 [@media(max-height:720px)]:w-8"
      aria-hidden
    >
      <path
        d="M16 58 L28 40 L42 48 L54 24 L66 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="58" r="3" fill="currentColor" />
      <circle
        cx="66"
        cy="32"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="28" cy="40" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="42" cy="48" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="54" cy="24" r="2.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function AiRouteCard() {
  return (
    <DestinationCard
      size="lg"
      className="[@media(max-height:720px)]:[&_h2]:text-[15px] [@media(max-height:640px)]:[&_h2]:text-sm"
      title="Bring Every Exhibit to Life."
      subtitle="AR Exhibits"
      body="Selecting an exhibit reveals a 3D exploded view, internal components, working animation, audio narration, historical story, and related exhibits. This is the signature AR experience."
    >
      <ul
        className={cn(
          storyItemGridClass(HOW_STEPS.length),
          "mb-3 gap-1.5 sm:mb-4 sm:gap-2 [@media(max-height:720px)]:mb-2 [@media(max-height:720px)]:gap-1",
        )}
        aria-label="AR exhibit experience"
      >
        {HOW_STEPS.map((step) => (
          <li
            key={step.id}
            className="rounded-lg border border-nm-border/60 bg-nm-secondary/40 px-2 py-1.5 sm:rounded-xl sm:px-2.5 sm:py-2 [@media(max-height:720px)]:px-1.5 [@media(max-height:720px)]:py-1"
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-nm-primary sm:text-[10px] [@media(max-height:720px)]:text-[8px]">
              {step.step}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold leading-snug tracking-tight text-nm-text sm:text-xs [@media(max-height:720px)]:text-[9px]">
              {step.label}
            </p>
            <p className="mt-0.5 line-clamp-4 text-[9px] leading-snug text-nm-muted sm:line-clamp-5 sm:text-[11px] [@media(max-height:720px)]:line-clamp-2 [@media(max-height:720px)]:text-[8px]">
              {step.detail}
            </p>
          </li>
        ))}
      </ul>

      <p className="mb-3 hidden text-[10px] leading-snug text-nm-muted sm:mb-4 sm:block sm:text-[11px] md:text-xs [@media(max-height:640px)]:hidden">
        The exploded-view animation triggers as you scroll—printed labels become
        living science.
      </p>

      <ol
        className="mb-3 flex flex-wrap items-center gap-1 sm:mb-4 sm:gap-1.5 [@media(max-height:640px)]:hidden"
        aria-label="AR exhibit visitor flow"
      >
        {FLOW.map((stage, index) => (
          <li key={stage} className="flex items-center gap-1 sm:gap-1.5">
            <span className="rounded-full border border-nm-border/70 bg-nm-secondary/50 px-2 py-0.5 text-[9px] font-medium tracking-wide text-nm-muted sm:text-[10px]">
              {stage}
            </span>
            {index < FLOW.length - 1 ? (
              <span className="text-[10px] text-nm-primary/80" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="[@media(max-height:640px)]:hidden sm:[@media(max-height:640px)]:block">
        <PeakCardExtras illustration={<NeuralRouteMark />} />
      </div>
    </DestinationCard>
  );
}
