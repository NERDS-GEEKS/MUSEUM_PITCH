import { ANALYTICS_STATS } from "@/constants/analytics";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

type Stat = (typeof ANALYTICS_STATS)[number];

type ParsedStat = {
  prefix: string;
  numeric: number;
  decimals: number;
  suffix: string;
};

function parseStatValue(raw: string): ParsedStat {
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) {
    return { prefix: "", numeric: 0, decimals: 0, suffix: raw };
  }
  const numericPart = match[2] ?? "0";
  const decimals = numericPart.includes(".")
    ? (numericPart.split(".")[1]?.length ?? 0)
    : 0;
  return {
    prefix: match[1] ?? "",
    numeric: Number(numericPart),
    decimals,
    suffix: match[3] ?? "",
  };
}

function CountUpValue({
  value,
  active,
  reduce,
}: {
  value: string;
  active: boolean;
  reduce: boolean;
}) {
  const parsed = parseStatValue(value);
  const motionValue = useMotionValue(reduce ? parsed.numeric : 0);
  const display = useTransform(motionValue, (latest) => {
    const fixed = latest.toFixed(parsed.decimals);
    return `${parsed.prefix}${fixed}${parsed.suffix}`;
  });

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      motionValue.set(parsed.numeric);
      return;
    }
    const controls = animate(motionValue, parsed.numeric, {
      duration: 1.35,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [active, motionValue, parsed.numeric, reduce]);

  return <motion.span>{display}</motion.span>;
}

const HEATMAP_COLS = 12;
const HEATMAP_ROWS = 6;

function heatmapIntensity(col: number, row: number): number {
  const cx = (HEATMAP_COLS - 1) / 2;
  const cy = (HEATMAP_ROWS - 1) / 2;
  const dx = (col - cx) / cx;
  const dy = (row - cy) / cy;
  const radial = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) * 0.92);
  const wave = 0.35 + 0.65 * Math.sin((col + 1) * 0.85) * Math.cos((row + 1) * 0.7);
  return Math.min(1, Math.max(0.08, radial * 0.7 + wave * 0.35));
}

function Heatmap({ active, reduce }: { active: boolean; reduce: boolean }) {
  const cells = Array.from({ length: HEATMAP_ROWS * HEATMAP_COLS }, (_, i) => {
    const col = i % HEATMAP_COLS;
    const row = Math.floor(i / HEATMAP_COLS);
    return { id: `${row}-${col}`, intensity: heatmapIntensity(col, row), col, row };
  });

  return (
    <div
      className="grid gap-1.5 sm:gap-2"
      style={{
        gridTemplateColumns: `repeat(${HEATMAP_COLS}, minmax(0, 1fr))`,
      }}
      aria-hidden
    >
      {cells.map((cell) => {
        const opacity = 0.12 + cell.intensity * 0.88;
        const delay = reduce ? 0 : (cell.row * HEATMAP_COLS + cell.col) * 0.012;

        return (
          <motion.div
            key={cell.id}
            className="aspect-square rounded-sm"
            initial={
              reduce
                ? false
                : {
                    opacity: 0.08,
                    backgroundColor: "color-mix(in srgb, var(--nm-muted) 35%, transparent)",
                  }
            }
            animate={
              active
                ? {
                    opacity,
                    backgroundColor: `color-mix(in srgb, var(--nm-primary) ${Math.round(
                      28 + cell.intensity * 72,
                    )}%, color-mix(in srgb, var(--nm-muted) 40%, transparent))`,
                  }
                : undefined
            }
            transition={{
              duration: reduce ? 0 : 0.55,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        );
      })}
    </div>
  );
}

function StatCard({
  stat,
  active,
  reduce,
  index,
}: {
  stat: Stat;
  active: boolean;
  reduce: boolean;
  index: number;
}) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-nm-border bg-nm-glass px-5 py-5 backdrop-blur-xl md:px-6 md:py-6",
      )}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.55,
        delay: reduce ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <p className="text-3xl font-semibold tracking-tight text-nm-text md:text-4xl">
        <CountUpValue value={stat.value} active={active} reduce={reduce} />
      </p>
      <p className="mt-2 text-sm font-medium text-nm-text md:text-base">{stat.label}</p>
      <p className="mt-1 text-xs text-nm-muted md:text-sm">{stat.hint}</p>
    </motion.div>
  );
}

export function AnalyticsViz() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <div ref={ref} className="space-y-8 md:space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {ANALYTICS_STATS.map((stat, index) => (
          <StatCard
            key={stat.id}
            stat={stat}
            active={inView}
            reduce={reduce}
            index={index}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-nm-border bg-nm-glass p-4 backdrop-blur-xl md:p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nm-muted">
          Venue activity heatmap
        </p>
        <Heatmap active={inView} reduce={reduce} />
      </div>

      <p className="text-center text-[11px] leading-relaxed text-nm-muted/80 md:text-xs">
        Metrics shown are illustrative marketing figures, not live production data.
      </p>
    </div>
  );
}
