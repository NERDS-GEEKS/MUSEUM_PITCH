import {
  getActiveNode,
  getNextNode,
  getPrevNode,
  JOURNEY_NODES,
} from "@/journey/constants/nodes";
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
  const prev = getPrevNode(progress);
  const next = getNextNode(progress);

  if (active.id === "complete") return null;

  const atFirst =
    active.id === JOURNEY_NODES[0].id && progress <= active.dockT + 0.01;
  const atLast =
    active.id === JOURNEY_NODES[JOURNEY_NODES.length - 1].id &&
    progress >= active.dockT - 0.01;

  const goTo = (dockT: number) => {
    if (isOpen) close();
    else closeDestinationDetail();
    setProgress(dockT);
  };

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 pb-3 sm:bottom-10 sm:gap-4 md:bottom-12"
      role="navigation"
      aria-label="Scroll through the journey"
    >
      <div className="pointer-events-auto">
        <NavMeArrowButton
          direction="down"
          size="sm"
          label="Scroll down · Previous stop"
          disabled={atFirst && prev.id === active.id}
          onClick={() => goTo(prev.dockT)}
        />
      </div>
      <div className="pointer-events-auto">
        <NavMeArrowButton
          direction="up"
          size="md"
          label="Scroll up · Next stop"
          disabled={atLast && next.id === active.id}
          onClick={() => goTo(next.dockT)}
        />
      </div>
    </div>
  );
}
