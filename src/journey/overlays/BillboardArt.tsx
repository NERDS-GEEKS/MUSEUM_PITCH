import {
  getIndustryGalleryIndex,
  subscribeIndustryGalleryIndex,
} from "@/journey/overlays/industryGalleryStore";
import {
  getPlatformGalleryIndex,
  subscribePlatformGalleryIndex,
} from "@/journey/overlays/platformGalleryStore";
import {
  CAPABILITY_IMAGES,
  INDUSTRY_IMAGES,
  STORY_IMAGES,
  type StoryGalleryItem,
} from "@/journey/overlays/storyImages";
import { AnimatePresence, motion } from "framer-motion";
import { useSyncExternalStore } from "react";

function galleryForNode(nodeId: string): readonly StoryGalleryItem[] | null {
  if (nodeId === "mapping") return CAPABILITY_IMAGES;
  if (nodeId === "industries") return INDUSTRY_IMAGES;
  return null;
}

function useIndustryGalleryIndex(): number {
  return useSyncExternalStore(
    subscribeIndustryGalleryIndex,
    getIndustryGalleryIndex,
    getIndustryGalleryIndex,
  );
}

function usePlatformGalleryIndex(): number {
  return useSyncExternalStore(
    subscribePlatformGalleryIndex,
    getPlatformGalleryIndex,
    getPlatformGalleryIndex,
  );
}

/** Large thematic imagery for the empty left side of the destination billboard. */
export function BillboardArt({ nodeId }: { nodeId: string }) {
  const gallery = galleryForNode(nodeId);
  const industryIndex = useIndustryGalleryIndex();
  const platformIndex = usePlatformGalleryIndex();

  const safeIndex = gallery
    ? nodeId === "industries"
      ? industryIndex % gallery.length
      : nodeId === "mapping"
        ? platformIndex % gallery.length
        : 0
    : 0;
  const src = gallery
    ? gallery[safeIndex].src
    : (STORY_IMAGES[nodeId] ?? STORY_IMAGES.welcome);
  const caption = gallery ? gallery[safeIndex].title : undefined;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={gallery ? `${nodeId}-${safeIndex}` : nodeId}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, x: -24, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        <div className="relative h-[min(38vh,14rem)] w-[min(40vw,14rem)] sm:h-[min(42vh,17rem)] sm:w-[min(40vw,17rem)] md:h-[min(46vh,20rem)] md:w-[min(42vw,20rem)] lg:h-[min(50vh,24rem)] lg:w-[min(44vw,24rem)] xl:h-[min(56vh,28rem)] xl:w-[min(46vw,28rem)]">
          <div className="absolute inset-4 rounded-full bg-nm-primary/15 blur-3xl md:inset-6" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-nm-border/60 bg-nm-secondary/40 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:rounded-3xl">
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12100e]/70 via-transparent to-[#12100e]/20"
              aria-hidden
            />
            {caption ? (
              <p className="pointer-events-none absolute bottom-3 left-3 right-3 text-xs font-semibold tracking-wide text-white/95 drop-shadow-md md:bottom-4 md:left-4 md:right-4 md:text-sm lg:text-base">
                {caption}
              </p>
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
