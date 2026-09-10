import {
  getActiveNode,
  JOURNEY_NODES,
} from "@/journey/constants/nodes";
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

      let nextIndex = index;
      let handled = false;

      switch (event.key) {
        case "ArrowUp":
        case "k":
        case "K":
        case " ":
          // Up → next stop (same as Swipe / Scroll up).
          handled = true;
          if (active.id === "complete") break;
          nextIndex = Math.min(JOURNEY_NODES.length - 1, index + 1);
          break;
        case "ArrowDown":
        case "j":
        case "J":
          // Down → previous stop (leave mural).
          handled = true;
          if (index <= 0) break;
          nextIndex = Math.max(0, index - 1);
          break;
        default:
          return;
      }

      if (!handled) return;
      event.preventDefault();
      if (nextIndex === index) return;

      if (active.id === "complete") {
        setFinishCreditsTarget(0);
      }
      api.setProgress(JOURNEY_NODES[nextIndex].dockT);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [api, enabled]);
}
