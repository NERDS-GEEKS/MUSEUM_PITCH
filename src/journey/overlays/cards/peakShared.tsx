import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { CALENDLY_DEMO_URL } from "@/constants/contact";
import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { useDestinationDetail } from "@/journey/overlays/useDestinationDetail";
import { useJourneyProgressApi } from "@/journey/scroll/useJourneyProgress";

/** Optional jump CTA (e.g. Book a demo) - not used for normal section travel. */
export function PeakContinueButton({
  toId,
  label = "Continue",
  variant = "glass",
}: {
  toId: string;
  label?: string;
  variant?: "primary" | "glass";
}) {
  const { setProgress } = useJourneyProgressApi();
  const { close } = useDestinationDetail();
  const target = JOURNEY_NODES.find((node) => node.id === toId);
  if (!target) return null;

  return (
    <Magnetic>
      <Button
        type="button"
        variant={variant}
        size="md"
        onClick={() => {
          close();
          setProgress(target.dockT);
        }}
      >
        {label}
      </Button>
    </Magnetic>
  );
}

/** Demo + Contact Us - opt-in for rare panel continues; default CTAs live in JourneyHUD. */
export function PanelCtaButtons() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-end gap-2 sm:mt-5">
      <Magnetic>
        <Button
          href={CALENDLY_DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="md"
        >
          Schedule a Demo
        </Button>
      </Magnetic>
      <PeakContinueButton toId="complete" label="Contact Us" variant="glass" />
    </div>
  );
}

/**
 * Story item layout: exactly 3 → one horizontal row; otherwise a responsive grid.
 */
export function storyItemGridClass(count: number): string {
  if (count === 3) return "grid grid-cols-3 gap-2";
  return "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5";
}

/** Illustration row for peak destination cards. */
export function PeakCardExtras({
  illustration,
  actions,
}: {
  illustration: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="shrink-0 text-nm-primary" aria-hidden>
        {illustration}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
