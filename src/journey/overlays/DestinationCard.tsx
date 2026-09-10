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

/** Glass billboard shell - sized for top-right popup boards. */
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
        "relative w-full min-w-0 overflow-x-hidden overflow-y-hidden border-white/18 bg-[rgba(28,25,22,0.92)] shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl",
        // Compact padding on short / small phones so content fits above the robot.
        large
          ? "max-w-none p-3 sm:p-5 md:max-w-3xl md:p-6 lg:p-7 xl:p-8 [@media(max-height:720px)]:p-2.5 sm:[@media(max-height:720px)]:p-4"
          : "max-w-none p-3 sm:p-5 md:max-w-xl md:p-6 lg:p-8 [@media(max-height:720px)]:p-2.5 sm:[@media(max-height:720px)]:p-4",
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
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-nm-border/80 bg-nm-bg/50 text-nm-muted transition-colors hover:border-nm-primary/40 hover:text-nm-text sm:right-3 sm:top-3 sm:h-8 sm:w-8"
          aria-label="Close details"
        >
          <span className="text-lg leading-none" aria-hidden>
            ×
          </span>
        </button>
      ) : null}

      <div className={cn(onClose ? "relative min-w-0 pr-7 sm:pr-8" : "relative min-w-0")}>
        {subtitle ? (
          <p
            className={cn(
              introMobile,
              "mb-1 font-bold uppercase tracking-[0.16em] text-nm-primary sm:mb-1.5 sm:tracking-[0.18em]",
              "text-[10px] sm:text-xs md:text-sm",
              "[@media(max-height:720px)]:mb-0.5 [@media(max-height:720px)]:text-[9px]",
              large && "lg:text-sm",
            )}
          >
            {subtitle}
          </p>
        ) : null}
        <h2
          className={cn(
            introMobile,
            "font-black tracking-tight text-nm-text",
            large
              ? "text-lg leading-snug sm:text-xl md:text-2xl lg:text-[1.65rem] lg:leading-tight"
              : "text-lg leading-snug sm:text-2xl md:text-2xl lg:text-3xl",
            "[@media(max-height:720px)]:text-base [@media(max-height:720px)]:leading-snug sm:[@media(max-height:720px)]:text-xl",
            "[@media(max-height:640px)]:text-[15px]",
          )}
        >
          {title}
        </h2>
        {body ? (
          <p
            className={cn(
              introMobile,
              "mt-1.5 leading-relaxed text-nm-muted sm:mt-2.5",
              "text-xs sm:text-sm md:text-base",
              "[@media(max-height:720px)]:mt-1 [@media(max-height:720px)]:text-[11px] [@media(max-height:720px)]:leading-snug",
              "[@media(max-height:640px)]:text-[10px] [@media(max-height:640px)]:line-clamp-3",
            )}
          >
            {body}
          </p>
        ) : null}
        {children ? (
          <div
            className={cn(
              "min-w-0 overflow-x-hidden",
              hideIntroOnMobile
                ? "mt-0 md:mt-5"
                : large
                  ? "mt-2.5 sm:mt-4"
                  : "mt-3 sm:mt-5",
              !hideIntroOnMobile && "[@media(max-height:720px)]:mt-2",
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
