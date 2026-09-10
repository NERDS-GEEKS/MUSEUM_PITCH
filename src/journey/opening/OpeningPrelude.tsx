import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { setOpeningAssembly } from "@/journey/opening/openingAssemblyStore";
import { setIntroLogoReveal } from "@/journey/opening/introLogoStore";
import { setOpeningSplashBusy } from "@/journey/opening/openingSplashStore";
import { markIntroSeen } from "@/journey/opening/openingSession";
import {
  useJourneyProgressApi,
  useJourneyProgressStore,
} from "@/journey/scroll/useJourneyProgress";
import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";

type OpeningPreludeProps = {
  onComplete: () => void;
};

const END_T = 1;
const WELCOME_T = JOURNEY_NODES[0].dockT;
const HOLD_S = 0.3;
const REWIND_S = 1.3;
/** Logo tile assemble - long enough to read the particle join. */
const ASSEMBLE_S = 3.5;

/**
 * Opening: camera on the end wall while the 3D logo assembles in place,
 * then straight pan to Welcome. No separate 2D splash mark.
 */
export function OpeningPrelude({ onComplete }: OpeningPreludeProps) {
  const reduced = usePrefersReducedMotion();
  const api = useJourneyProgressApi();
  const store = useJourneyProgressStore();
  const veilRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const cancelledRef = useRef(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (cancelledRef.current || finishedRef.current) return;
    finishedRef.current = true;
    tlRef.current = null;
    setOpeningSplashBusy(false);
    store.setUiMuted(false);
    api.setProgress(WELCOME_T, { immediate: true });
    setOpeningAssembly(1);
    setIntroLogoReveal(1);
    markIntroSeen();
    onCompleteRef.current();
  }, [api, store]);

  useEffect(() => {
    cancelledRef.current = false;
    finishedRef.current = false;
    // Keep WebGL visible - assemble plays on the wall logo
    setOpeningSplashBusy(false);
    store.setUiMuted(true);

    setOpeningAssembly(1);
    api.setProgress(END_T, { immediate: true });

    if (reduced) {
      setIntroLogoReveal(1);
      store.setUiMuted(false);
      if (veilRef.current) gsap.set(veilRef.current, { opacity: 0 });
      const t = window.setTimeout(finish, 200);
      return () => {
        cancelledRef.current = true;
        setOpeningSplashBusy(false);
        store.setUiMuted(false);
        window.clearTimeout(t);
      };
    }

    setIntroLogoReveal(0);
    if (veilRef.current) gsap.set(veilRef.current, { opacity: 0.22 });

    const assembleProxy = { t: 0 };
    const progressProxy = { t: END_T };
    const tl = gsap.timeline({ onComplete: finish });
    tlRef.current = tl;

    if (veilRef.current) {
      tl.to(
        veilRef.current,
        { opacity: 0.06, duration: 0.5, ease: "power2.out" },
        0,
      );
    }

    tl.to(
      assembleProxy,
      {
        t: 1,
        duration: ASSEMBLE_S,
        ease: "none",
        onUpdate: () => {
          setIntroLogoReveal(assembleProxy.t);
        },
      },
      0.12,
    );

    if (veilRef.current) {
      tl.to(
        veilRef.current,
        { opacity: 0, duration: 0.45, ease: "power2.out" },
        "-=0.35",
      );
    }

    tl.to({}, { duration: HOLD_S });

    tl.to(
      progressProxy,
      {
        t: WELCOME_T,
        duration: REWIND_S,
        ease: "power1.inOut",
        onUpdate: () => {
          if (cancelledRef.current || finishedRef.current) return;
          api.setProgress(progressProxy.t, { immediate: true, silent: true });
        },
      },
      ">",
    );

    tl.to({}, { duration: 0.06 });

    return () => {
      cancelledRef.current = true;
      setOpeningSplashBusy(false);
      store.setUiMuted(false);
      tl.kill();
      if (tlRef.current === tl) tlRef.current = null;
    };
  }, [api, reduced, finish, store]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      role="presentation"
      aria-label="NavMe corridor introduction"
    >
      <div
        ref={veilRef}
        className="absolute inset-0 bg-[#12100e]/35"
        aria-hidden
      />
    </div>
  );
}
