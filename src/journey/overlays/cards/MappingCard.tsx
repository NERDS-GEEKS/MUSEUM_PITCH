import { DestinationCard } from "@/journey/overlays/DestinationCard";
import { ArFeatureRoll } from "@/journey/overlays/cards/ArFeatureRoll";
import {
  resetPlatformGalleryIndex,
  setPlatformGalleryIndex,
} from "@/journey/overlays/platformGalleryStore";
import { CAPABILITY_IMAGES } from "@/journey/overlays/storyImages";
import { useCallback } from "react";

export function MappingCard() {
  const onIndexChange = useCallback((index: number) => {
    setPlatformGalleryIndex(index);
  }, []);
  const onReset = useCallback(() => {
    resetPlatformGalleryIndex();
  }, []);

  return (
    <DestinationCard
      title="Don't Just Show Visitors the Way. Give Them a Reason to Explore."
      subtitle="Navigate"
      body='From "Where do I go?" to "What can I discover next?"'
    >
      <ArFeatureRoll
        items={CAPABILITY_IMAGES}
        label="Visitor journey"
        ariaLabel="Interactive museum journey steps"
        onIndexChange={onIndexChange}
        onReset={onReset}
      />
    </DestinationCard>
  );
}
