import {
  getActiveNode,
  JOURNEY_NODES,
} from "@/journey/constants/nodes";
import {
  resolveGalleryStep,
  setWelcomeBeat,
  useWelcomeBeat,
} from "@/journey/camera/galleryWallStore";
import { closeDestinationDetail } from "@/journey/overlays/destinationDetailStore";
import { useDestinationDetail } from "@/journey/overlays/useDestinationDetail";
import {
  useJourneyProgress,
  useJourneyProgressApi,
} from "@/journey/scroll/useJourneyProgress";
import { NavMeArrowButton } from "./NavMeArrowButton";

/**
 * Prev / next section controls using the NavMe blue arrow.
 * Up = next stop · Down = previous stop (matches swipe travel).
 */
export function SectionArrowNav() {
  const progress = useJourneyProgress();
  const { setProgress } = useJourneyProgressApi();
  const { isOpen, close } = useDestinationDetail();
  const active = getActiveNode(progress);
  const welcomeBeat = useWelcomeBeat();
  const index = JOURNEY_NODES.findIndex((node) => node.id === active.id);
  const prevStep = resolveGalleryStep(-1, Math.max(0, index));
  const nextStep = resolveGalleryStep(1, Math.max(0, index));

  if (active.id === "complete") return null;

  const goStep = (dir: 1 | -1) => {
    const resolved = resolveGalleryStep(dir, index);
    if (!resolved) return;
    if (isOpen) close();
    else closeDestinationDetail();
    setWelcomeBeat(resolved.welcomeBeat);
    if (resolved.stopIndex === index) return;
    setProgress(JOURNEY_NODES[resolved.stopIndex].dockT);
  };

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 pb-3 sm:bottom-10 sm:gap-4 md:bottom-12"
      role="navigation"
      aria-label="Scroll through the journey"
      data-welcome-beat={welcomeBeat}
    >
      <div className="pointer-events-auto">
        <NavMeArrowButton
          direction="down"
          size="sm"
          label="Scroll down · Previous stop"
          disabled={!prevStep}
          onClick={() => goStep(-1)}
        />
      </div>
      <div className="pointer-events-auto">
        <NavMeArrowButton
          direction="up"
          size="md"
          label="Scroll up · Next stop"
          disabled={!nextStep}
          onClick={() => goStep(1)}
        />
      </div>
    </div>
  );
}
