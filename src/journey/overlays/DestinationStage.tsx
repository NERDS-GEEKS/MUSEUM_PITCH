import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { setFinishCreditsTarget } from "@/journey/opening/finishCreditsStore";
import { useDestinationDetail } from "@/journey/overlays/useDestinationDetail";
import {
  useArrivedAtDock,
  useDockBandKey,
} from "@/journey/scroll/useJourneyProgress";
import { useEffect, useMemo, useState } from "react";

/** Brief beat after landing before finish credits can open. */
const REVEAL_DELAY_MS = 320;
/** Extra beat before finish wall credits (zoom + footer). */
const FINISH_CREDITS_DELAY_MS = 420;

/**
 * Arrival timing for the finish-wall credits. Page copy now lives on
 * the gallery walls, so this stage no longer mounts overlay billboards.
 */
export function DestinationStage() {
  const dockKey = useDockBandKey();
  const arrived = useArrivedAtDock();
  const { close, isOpen } = useDestinationDetail();
  const [reveal, setReveal] = useState(false);

  const node = useMemo(() => {
    const [id] = dockKey.split(":");
    return JOURNEY_NODES.find((n) => n.id === id) ?? JOURNEY_NODES[0];
  }, [dockKey]);

  const isFinish = node.id === "complete";

  useEffect(() => {
    if (!arrived) {
      setReveal(false);
      return;
    }
    const timer = window.setTimeout(() => setReveal(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [arrived, node.id]);

  useEffect(() => {
    if (!reveal || !arrived || !isFinish) {
      if (!isFinish) setFinishCreditsTarget(0);
      return;
    }
    const timer = window.setTimeout(() => {
      setFinishCreditsTarget(1);
    }, FINISH_CREDITS_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [reveal, arrived, isFinish]);

  useEffect(() => {
    if (isFinish || !arrived) close();
  }, [arrived, isFinish, close]);

  useEffect(() => {
    if ((!arrived || !reveal) && isOpen) close();
  }, [arrived, reveal, isOpen, close]);

  return null;
}
