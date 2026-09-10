import { Button } from "@/components/ui/Button";
import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { setExperienceVideoOpen } from "@/journey/overlays/experienceVideoStore";
import { storyItemGridClass } from "./peakShared";

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
      <p className="shrink-0 text-[12px] leading-snug text-nm-muted">
        Transforming physical spaces into intelligent, interactive environments.
      </p>

      <div className="mt-2 flex shrink-0 flex-wrap gap-1.5 text-[11px] text-nm-muted">
        {HERO_TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-nm-border/70 bg-nm-secondary/50 px-2.5 py-1"
          >
            {tag}
          </span>
        ))}
      </div>

      <dl
        className={`mt-3 min-h-0 flex-1 ${storyItemGridClass(HERO_PILLARS.length)}`}
      >
        {HERO_PILLARS.map((pillar) => (
          <div
            key={pillar.label}
            className="flex flex-col justify-center rounded-xl border border-nm-border/60 bg-nm-secondary/40 px-2 py-2"
          >
            <dt className="text-[11px] font-semibold tracking-tight text-nm-text">
              {pillar.label}
            </dt>
            <dd className="mt-0.5 text-[10px] leading-snug text-nm-muted">
              {pillar.detail}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 shrink-0">
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
