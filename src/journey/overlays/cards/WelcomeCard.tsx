import { Button } from "@/components/ui/Button";
import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { setExperienceVideoOpen } from "@/journey/overlays/experienceVideoStore";

const HERO_TAGS = [
  "Browser Native",
  "No App Download",
  "No Hardware",
  "Multi-Floor Experience",
] as const;

const HERO_PILLARS = [
  {
    label: "Browser Native",
    detail: "Works directly in a modern browser. No app required.",
  },
  {
    label: "No App Download",
    detail: "Scan and start exploring instantly. Frictionless visitor access.",
  },
  {
    label: "No Hardware",
    detail: "No beacons, kiosks or additional infrastructure.",
  },
  {
    label: "Multi-Floor",
    detail: "Navigate across galleries, floors and points of interest.",
  },
] as const;

export function WelcomeCard() {
  return (
    <DestinationCard
      size="lg"
      className="overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      title="NavMe"
      subtitle="A Spatial AI Layer for Physical Spaces"
      body="NavMe connects physical museums with a digital experience layer — helping visitors navigate, discover, learn and engage, while enabling museums to understand how their spaces are explored and experienced."
    >
      <p className="text-[10px] leading-snug text-nm-muted sm:text-[11px] md:text-xs">
        Transforming physical spaces into intelligent, interactive environments.
      </p>

      <div className="flex flex-wrap gap-1.5 text-[10px] text-nm-muted sm:gap-2 sm:text-[11px] md:text-xs">
        {HERO_TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-nm-border/70 bg-nm-secondary/50 px-2 py-0.5 sm:px-2.5 sm:py-1"
          >
            {tag}
          </span>
        ))}
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-2.5 sm:grid-cols-4 sm:gap-2">
        {HERO_PILLARS.map((pillar) => (
          <div
            key={pillar.label}
            className="rounded-lg border border-nm-border/60 bg-nm-secondary/40 px-1.5 py-1.5 sm:rounded-xl sm:px-2 sm:py-2"
          >
            <dt className="text-[10px] font-semibold tracking-tight text-nm-text sm:text-xs">
              {pillar.label}
            </dt>
            <dd className="mt-0.5 text-[9px] leading-snug text-nm-muted sm:text-[10px] md:text-[11px]">
              {pillar.detail}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-2.5 sm:mt-3">
        <Button
          type="button"
          variant="primary"
          size="md"
          className="static translate-x-0 translate-y-0 before:hidden hover:before:hidden"
          onClick={() => setExperienceVideoOpen(true)}
        >
          See in Action
        </Button>
      </div>
    </DestinationCard>
  );
}
