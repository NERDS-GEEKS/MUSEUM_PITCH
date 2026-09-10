import {
  getActiveNode,
  JOURNEY_NODES,
} from "@/journey/constants/nodes";
import {
  resolveGalleryStep,
  setWelcomeBeat,
} from "@/journey/camera/galleryWallStore";
import { setFinishCreditsTarget } from "@/journey/opening/finishCreditsStore";
import { isBookDemoDetailOpen } from "@/journey/overlays/destinationDetailStore";
import { useJourneyProgressApi } from "@/journey/scroll/useJourneyProgress";
import { useEffect } from "react";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("[contenteditable='true'], form"));
}

/**
 * Arrow / J-K nudge - matches swipe / scroll up:
 * Up / K / Space = next · Down / J = previous.
 */
export function useJourneyKeyboardNudge(enabled: boolean) {
  const api = useJourneyProgressApi();

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        isTypingTarget(event.target) ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }
      if (isBookDemoDetailOpen()) return;

      const active = getActiveNode(api.progress);
      const index = JOURNEY_NODES.findIndex((n) => n.id === active.id);
      if (index < 0) return;

      let dir: 1 | -1 | 0 = 0;

      switch (event.key) {
        case "ArrowUp":
        case "k":
        case "K":
        case " ":
          dir = 1;
          break;
        case "ArrowDown":
        case "j":
        case "J":
          dir = -1;
          break;
        default: {
          return;
        }
      }

      event.preventDefault();
      if (dir !== 1 && dir !== -1) return;
      const resolved = resolveGalleryStep(dir, index);
      if (!resolved) return;

      if (active.id === "complete" && dir === -1) {
        setFinishCreditsTarget(0);
      }
      setWelcomeBeat(resolved.welcomeBeat);
      if (resolved.stopIndex === index) return;
      api.setProgress(JOURNEY_NODES[resolved.stopIndex].dockT);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [api, enabled]);
}
