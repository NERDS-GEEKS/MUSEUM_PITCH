import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { ArFeatureRoll } from "@/journey/overlays/cards/ArFeatureRoll";
import {
  resetIndustryGalleryIndex,
  setIndustryGalleryIndex,
} from "@/journey/overlays/industryGalleryStore";
import { INDUSTRY_IMAGES } from "@/journey/overlays/storyImages";
import { useCallback } from "react";

const VISITOR_BENEFITS = [
  "Indoor Navigation",
  "Interactive AR Exhibits",
  "Audio Guides",
  "Multilingual Stories",
  "Personalized Learning Journeys",
] as const;

const MUSEUM_BENEFITS = [
  "Better engagement",
  "Richer storytelling",
  "Higher accessibility",
  "Measurable visitor behaviour",
] as const;

export function IndustriesCard() {
  const onIndexChange = useCallback((index: number) => {
    setIndustryGalleryIndex(index);
  }, []);
  const onReset = useCallback(() => {
    resetIndustryGalleryIndex();
  }, []);

  return (
    <DestinationCard
      title="Transform Traditional Museums into AR Museums"
      subtitle="Convert"
      body="Physical Museum → Digital Twin → AR Experience Layer → Intelligent Museum."
    >
      <ArFeatureRoll
        items={INDUSTRY_IMAGES}
        label="Museum transformation"
        ariaLabel="How NavMe converts a traditional museum"
        onIndexChange={onIndexChange}
        onReset={onReset}
      />
      <div className="mt-2 grid shrink-0 grid-cols-2 gap-2">
        <div className="rounded-xl border border-nm-border/60 bg-nm-secondary/40 px-2.5 py-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-nm-muted">
            Visitor Benefits
          </p>
          <ul className="mt-1 space-y-0.5">
            {VISITOR_BENEFITS.map((item) => (
              <li key={item} className="text-[11px] leading-snug text-nm-text">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[#6ecfc8]/40 bg-nm-secondary/50 px-2.5 py-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-nm-primary">
            Museum Benefits
          </p>
          <ul className="mt-1 space-y-0.5">
            {MUSEUM_BENEFITS.map((item) => (
              <li key={item} className="text-[11px] leading-snug text-nm-text">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DestinationCard>
  );
}
