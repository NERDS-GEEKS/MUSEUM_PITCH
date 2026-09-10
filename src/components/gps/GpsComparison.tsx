import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type RefObject } from "react";

const GPS_PATH =
  "M24 160 C 70 150, 90 90, 130 110 S 190 170, 230 140 S 300 60, 360 90";
const NAVME_PATH =
  "M24 160 C 80 155, 140 120, 200 100 S 280 70, 360 55";

type SideProps = {
  title: string;
  pathD: string;
  pathClass: string;
  endY: number;
  gridId: string;
  pathRef?: RefObject<SVGPathElement | null>;
  barsRef?: RefObject<HTMLDivElement | null>;
  degraded?: boolean;
  locked?: boolean;
};

function ComparisonSide({
  title,
  pathD,
  pathClass,
  endY,
  gridId,
  pathRef,
  barsRef,
  degraded = false,
  locked = false,
}: SideProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-nm-text">
          {title}
        </h3>
        <div
          ref={barsRef}
          className="flex h-5 items-end gap-1"
          aria-hidden
        >
          {[0.45, 0.7, 1, 0.85].map((height, index) => (
            <span
              key={index}
              className={cn(
                "gps-bar w-1.5 rounded-sm bg-nm-primary",
                degraded && "opacity-25",
              )}
              style={{ height: `${height * 100}%` }}
            />
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-nm-border bg-nm-secondary/80 p-4">
        <svg
          viewBox="0 0 384 200"
          className="h-auto w-full"
          role="img"
          aria-label={`${title} path illustration`}
        >
          <defs>
            <linearGradient id={gridId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(79,139,255,0.12)" />
              <stop offset="100%" stopColor="rgba(5,5,5,0)" />
            </linearGradient>
          </defs>
          <rect width="384" height="200" fill={`url(#${gridId})`} />
          {[40, 80, 120, 160].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="384"
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          ))}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={pathClass}
          />
          <circle cx="24" cy="160" r="5" className="fill-nm-muted" />
          <circle
            cx="360"
            cy={endY}
            r="5"
            className={locked ? "fill-nm-highlight" : "fill-nm-muted"}
          />
        </svg>
      </div>
    </div>
  );
}

export function GpsComparison() {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const gpsPathRef = useRef<SVGPathElement>(null);
  const navPathRef = useRef<SVGPathElement>(null);
  const gpsBarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;

    const root = rootRef.current;
    const pin = pinRef.current;
    const gpsPath = gpsPathRef.current;
    const navPath = navPathRef.current;
    const gpsBars = gpsBarsRef.current;
    if (!root || !pin || !gpsPath || !navPath || !gpsBars) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const bars = gpsBars.querySelectorAll<HTMLElement>(".gps-bar");

      gsap.set(gpsPath, {
        strokeDasharray: 420,
        strokeDashoffset: 0,
        opacity: 1,
        x: 0,
      });
      gsap.set(navPath, {
        strokeDasharray: 420,
        strokeDashoffset: 0,
        opacity: 1,
      });
      gsap.set(bars, { scaleY: 1, transformOrigin: "bottom center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=200%",
          pin: pin,
          scrub: 0.65,
          anticipatePin: 1,
        },
      });

      tl.to(
        bars,
        {
          scaleY: 0.15,
          opacity: 0.25,
          stagger: 0.08,
          ease: "power1.inOut",
          duration: 1,
        },
        0,
      )
        .to(
          gpsPath,
          {
            x: 10,
            opacity: 0.2,
            strokeDashoffset: 80,
            ease: "power1.inOut",
            duration: 1,
          },
          0,
        )
        .to(
          gpsPath,
          {
            x: -8,
            duration: 0.35,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 2,
          },
          0.15,
        )
        .to(
          navPath,
          {
            attr: { "stroke-width": 5 },
            opacity: 1,
            duration: 1,
            ease: "power1.out",
          },
          0.2,
        );
    }, root);

    return () => {
      ctx.revert();
    };
  }, [reduce]);

  return (
    <div ref={rootRef} className={cn(!reduce && "relative h-[200vh]")}>
      <div
        ref={pinRef}
        className={cn(
          "flex flex-col justify-center gap-8 py-8",
          !reduce && "min-h-[100svh]",
        )}
      >
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <ComparisonSide
            title="GPS"
            pathD={GPS_PATH}
            pathClass="stroke-[#7a8799] stroke-[3]"
            endY={90}
            gridId="gps-grid-left"
            pathRef={gpsPathRef}
            barsRef={gpsBarsRef}
            degraded={reduce}
          />
          <ComparisonSide
            title="NavMe"
            pathD={NAVME_PATH}
            pathClass="stroke-nm-highlight stroke-[3.5]"
            endY={55}
            gridId="gps-grid-right"
            pathRef={navPathRef}
            locked
          />
        </div>
        {reduce ? (
          <p className="mx-auto max-w-2xl text-center text-base text-nm-muted md:text-lg">
            Indoors, GPS signal collapses into noise. NavMe locks a visual path
            with AI and Visual Positioning so routes stay accurate through walls,
            floors, and dense structures.
          </p>
        ) : null}
      </div>
    </div>
  );
}
