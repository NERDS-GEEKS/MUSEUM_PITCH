import { GlassPanel } from "@/components/ui/GlassPanel";
import { PanelCtaButtons } from "@/journey/overlays/cards/peakShared";
import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type DestinationCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle?: string;
  body?: string;
  children?: ReactNode;
  /** Optional close control - only for click-managed panels (e.g. Book Demo). */
  onClose?: () => void;
  /** Larger shell for content-heavy stops (e.g. Welcome). */
  size?: "default" | "lg";
  /**
   * Demo + Contact Us buttons - off by default; CTAs live in the journey HUD.
   * Kept for rare one-off panel continues.
   */
  showCtas?: boolean;
  /** Hide subtitle / title / body below `md` (e.g. Book Demo form-first on phones). */
  hideIntroOnMobile?: boolean;
};

/** Wall-board shell — sized for the 640×355 gallery plaque, not the viewport. */
export function DestinationCard({
  title,
  subtitle,
  body,
  children,
  onClose,
  size = "default",
  showCtas = false,
  hideIntroOnMobile = false,
  className,
  ...props
}: DestinationCardProps) {
  const large = size === "lg";
  const introMobile = hideIntroOnMobile ? "hidden md:block" : undefined;

  return (
    <GlassPanel
      className={cn(
        "relative flex h-full w-full max-w-none min-w-0 flex-col overflow-hidden rounded-[18px] border-white/12 bg-[rgba(14,12,10,0.94)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl",
        className,
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-nm-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-32 w-32 rounded-full bg-nm-accent/15 blur-3xl"
        aria-hidden
      />

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-nm-border/80 bg-nm-bg/50 text-nm-muted transition-colors hover:border-nm-primary/40 hover:text-nm-text"
          aria-label="Close details"
        >
          <span className="text-lg leading-none" aria-hidden>
            ×
          </span>
        </button>
      ) : null}

      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col",
          onClose && "pr-8",
        )}
      >
        {subtitle ? (
          <p
            className={cn(
              introMobile,
              "mb-1 shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] text-nm-primary",
            )}
          >
            {subtitle}
          </p>
        ) : null}
        <h2
          className={cn(
            introMobile,
            "shrink-0 text-balance font-black tracking-tight text-nm-text",
            large
              ? "text-[1.45rem] leading-[1.15]"
              : "text-[1.28rem] leading-[1.18]",
          )}
        >
          {title}
        </h2>
        {body ? (
          <p
            className={cn(
              introMobile,
              "mt-1.5 shrink-0 text-[13px] leading-snug text-nm-muted",
              large ? "line-clamp-3" : "line-clamp-2",
            )}
          >
            {body}
          </p>
        ) : null}
        {children ? (
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col",
              hideIntroOnMobile ? "mt-0 md:mt-3" : "mt-3",
            )}
          >
            {children}
          </div>
        ) : null}
        {showCtas ? <PanelCtaButtons /> : null}
      </div>
    </GlassPanel>
  );
}
