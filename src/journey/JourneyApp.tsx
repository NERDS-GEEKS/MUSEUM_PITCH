import { JourneyFallback2D } from "@/journey/fallback/JourneyFallback2D";
import { JourneyHUD } from "@/journey/hud/JourneyHUD";
import { JourneyScrollGuide } from "@/journey/hud/JourneyScrollGuide";
import { useJourneyKeyboardNudge } from "@/journey/hooks/useJourneyKeyboardNudge";
import {
  useJourneyMode,
  type JourneyMode,
} from "@/journey/hooks/useJourneyMode";
import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { OpeningPrelude } from "@/journey/opening/OpeningPrelude";
import { consumeReturnToFinish } from "@/journey/returnToFinishStore";
import { setOpeningAssembly } from "@/journey/opening/openingAssemblyStore";
import {
  setFinishCredits,
  setFinishCreditsTarget,
} from "@/journey/opening/finishCreditsStore";
import { DestinationStage } from "@/journey/overlays/DestinationStage";
import { DestinationDetailProvider } from "@/journey/overlays/useDestinationDetail";
import { JourneyZoomController } from "@/journey/scroll/JourneyZoomController";
import {
  JourneyProgressProvider,
  useJourneyProgressApi,
} from "@/journey/scroll/useJourneyProgress";
import { FinishFooterOverlay } from "@/journey/world/FinishFooterOverlay";
import { ExperienceVideoModal } from "@/journey/overlays/ExperienceVideoModal";
import { MapBackdrop, MapVignette } from "@/journey/world/MapBackdrop";
import { lazy, Suspense, useCallback, useLayoutEffect, useState } from "react";

const LazyJourneyCanvas = lazy(() => import("./canvas/JourneyCanvas"));

const WELCOME_DOCK = JOURNEY_NODES[0].dockT;
const INTRO_END = 1;

function WorldJourney({
  locked,
  showPrelude,
  onPreludeComplete,
  startInFinish,
}: {
  locked: boolean;
  showPrelude: boolean;
  onPreludeComplete: () => void;
  startInFinish: boolean;
}) {
  const { setProgress } = useJourneyProgressApi();
  useJourneyKeyboardNudge(!locked);

  // Seed at the logo wall before first paint so the corridor opens there.
  // Only when prelude is active - never re-pin to the end after the pan.
  useLayoutEffect(() => {
    if (!showPrelude) return;
    setOpeningAssembly(1);
    setProgress(INTRO_END, { immediate: true });
  }, [showPrelude, setProgress]);

  // When coming back from Privacy/Terms, restore the finish-wall footer immediately
  // (so browser Back doesn't dump the user back at the start).
  useLayoutEffect(() => {
    if (!startInFinish) return;
    const completeDock =
      JOURNEY_NODES.find((n) => n.id === "complete")?.dockT ??
      JOURNEY_NODES[JOURNEY_NODES.length - 1]?.dockT ??
      1;
    setOpeningAssembly(1);
    setFinishCredits(1);
    setFinishCreditsTarget(1);
    setProgress(completeDock, { immediate: true });
  }, [setProgress, startInFinish]);

  const finishPrelude = useCallback(() => {
    setOpeningAssembly(1);
    setProgress(WELCOME_DOCK, { immediate: true });
    onPreludeComplete();
  }, [onPreludeComplete, setProgress]);

  return (
    <div className="relative h-svh w-screen overflow-hidden">
      <MapBackdrop />
      <JourneyZoomController enabled={!locked} />
      <Suspense fallback={null}>
        <LazyJourneyCanvas openingActive={showPrelude} />
      </Suspense>
      <MapVignette />
      {!locked ? (
        <>
          <DestinationStage />
          {/* HUD after stage so nav/dropdown always paint above glass panels */}
          <JourneyHUD />
          <JourneyScrollGuide />
          <ExperienceVideoModal />
          {/* Phone finish footer as real DOM — iOS cannot tap 3D Html reliably */}
          <FinishFooterOverlay />
        </>
      ) : null}
      {showPrelude ? <OpeningPrelude onComplete={finishPrelude} /> : null}
    </div>
  );
}

function JourneyShell({
  mode,
  startInFinish,
}: {
  mode: JourneyMode;
  startInFinish: boolean;
}) {
  // Intro on every page open / refresh - no Replay button, no session skip.
  const [phase, setPhase] = useState<"prelude" | "journey">(() =>
    startInFinish ? "journey" : "prelude",
  );
  const locked = mode === "world" && phase === "prelude";

  switch (mode) {
    case "world":
      return (
        <DestinationDetailProvider>
          <WorldJourney
            locked={locked}
            showPrelude={phase === "prelude"}
            onPreludeComplete={() => setPhase("journey")}
            startInFinish={startInFinish}
          />
        </DestinationDetailProvider>
      );
    case "fallback":
      return (
        <DestinationDetailProvider>
          <JourneyFallback2D />
        </DestinationDetailProvider>
      );
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

/** Journey shell: opening prelude on load, then wheel-zoom map world / 2D fallback. */
export function JourneyApp() {
  const mode = useJourneyMode();
  const [startInFinish] = useState(() => consumeReturnToFinish());

  return (
    <JourneyProgressProvider>
      <JourneyShell mode={mode} startInFinish={startInFinish} />
    </JourneyProgressProvider>
  );
}
