import type { StoryGalleryItem } from "@/journey/overlays/storyImages";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArFrameMarks({ active }: { active: boolean }) {
  if (!active) return null;
  const mark =
    "pointer-events-none absolute h-4 w-4 border-[#6ecfc8]/90 sm:h-5 sm:w-5";
  return (
    <>
      <span className={cn(mark, "left-1.5 top-1.5 border-l-2 border-t-2")} aria-hidden />
      <span className={cn(mark, "right-1.5 top-1.5 border-r-2 border-t-2")} aria-hidden />
      <span className={cn(mark, "bottom-1.5 left-1.5 border-b-2 border-l-2")} aria-hidden />
      <span className={cn(mark, "bottom-1.5 right-1.5 border-b-2 border-r-2")} aria-hidden />
      <span
        className="pointer-events-none absolute left-1/2 top-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-[#6ecfc8]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute bottom-1.5 left-1/2 h-px w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#6ecfc8]/80 to-transparent sm:w-10"
        aria-hidden
      />
    </>
  );
}

type ArFeatureRollProps = {
  items: readonly StoryGalleryItem[];
  label?: string;
  onIndexChange: (index: number) => void;
  onReset: () => void;
  ariaLabel?: string;
};

/**
 * AR-themed feature roll: one focused frame in center,
 * neighbors peek on the left/right like a partial roll.
 */
export function ArFeatureRoll({
  items,
  label = "AR target",
  onIndexChange,
  onReset,
  ariaLabel = "Feature frames",
}: ArFeatureRollProps) {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  useEffect(() => {
    onReset();
    setIndex(0);
    return () => onReset();
  }, [onReset]);

  const goTo = (next: number) => {
    const clamped = Math.min(total - 1, Math.max(0, next));
    setIndex(clamped);
    onIndexChange(clamped);
  };

  return (
    <div className="relative w-full shrink-0 overflow-hidden">
      <div className="relative mx-auto h-[8.25rem] w-full max-w-[28rem] overflow-hidden">
        {items.map((item, i) => {
          const offset = i - index;
          const abs = Math.abs(offset);
          if (abs > 2) return null;

          const active = offset === 0;
          const side = offset < 0 ? -1 : 1;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!active) goTo(i);
              }}
              className={cn(
                "absolute left-1/2 top-1/2 overflow-hidden rounded-xl border text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                active
                  ? "z-20 h-[7.1rem] w-[10.5rem] -translate-x-1/2 -translate-y-1/2 border-[#6ecfc8]/55 bg-[#1a1610] shadow-[0_0_0_1px_rgba(110,207,200,0.18),0_18px_40px_rgba(0,0,0,0.45)]"
                  : "z-10 h-[6rem] w-[8rem] -translate-y-1/2 scale-[0.92] border-white/12 bg-[#1a1610] opacity-55 shadow-[0_12px_28px_rgba(0,0,0,0.35)] hover:opacity-75",
              )}
              style={
                active
                  ? undefined
                  : {
                      transform: `translate(calc(-50% + ${side * (abs === 1 ? 5.1 : 8.2)}rem), -50%) scale(${abs === 1 ? 0.9 : 0.78})`,
                      zIndex: 10 - abs,
                      opacity: abs === 1 ? 0.55 : 0.28,
                    }
              }
              aria-label={
                active ? `${item.title} (current)` : `Show ${item.title}`
              }
              aria-current={active ? "true" : undefined}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  active
                    ? "bg-gradient-to-t from-[#1a1610] via-[#1a1610]/40 to-transparent"
                    : "bg-[#1a1610]/20",
                )}
                aria-hidden
              />
              {active ? (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(110,207,200,0.08),transparent_28%,transparent_72%,rgba(110,207,200,0.06))]"
                    aria-hidden
                  />
                  <ArFrameMarks active />
                  <div className="absolute inset-x-0 bottom-0 p-2">
                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#C4A574]/90">
                      {label}
                    </p>
                    <p className="mt-0.5 text-[13px] font-semibold tracking-tight text-white">
                      {item.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/70">
                      {item.description}
                    </p>
                  </div>
                </>
              ) : (
                <p className="absolute inset-x-0 bottom-0 p-2 text-[11px] font-semibold tracking-tight text-white/80">
                  {item.title}
                </p>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={!canPrev}
          aria-disabled={!canPrev}
          className={cn(
            "absolute left-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200",
            canPrev
              ? "border border-[#6ecfc8]/35 bg-[#221c16]/90 text-[#D4C4A8] shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:border-[#6ecfc8]/70 hover:bg-[#2a2218]"
              : "pointer-events-none border border-white/8 bg-[#1c1916]/55 text-white/25 opacity-40",
          )}
          aria-label="Previous"
        >
          <Chevron dir="left" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={!canNext}
          aria-disabled={!canNext}
          className={cn(
            "absolute right-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200",
            canNext
              ? "border border-[#6ecfc8]/35 bg-[#221c16]/90 text-[#D4C4A8] shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:border-[#6ecfc8]/70 hover:bg-[#2a2218]"
              : "pointer-events-none border border-white/8 bg-[#1c1916]/55 text-white/25 opacity-40",
          )}
          aria-label="Next"
        >
          <Chevron dir="right" />
        </button>
      </div>

      <div
        className="mt-2 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              i === index
                ? "w-5 bg-[#6ecfc8]"
                : "w-1.5 bg-white/20 hover:bg-white/40",
            )}
            aria-label={`Show ${item.title}`}
            aria-current={i === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
