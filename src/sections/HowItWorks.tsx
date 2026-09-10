import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { WORKS_STEPS } from "@/constants/worksSteps";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export function HowItWorks() {
  const reduce = usePrefersReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const timeline = timelineRef.current;
    if (!line || !timeline) return;

    if (reduce) {
      gsap.set(line, { scaleY: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
      gsap.to(line, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timeline,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });
    }, timeline);

    return () => {
      ctx.revert();
    };
  }, [reduce]);

  return (
    <section id="how-it-works" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="How NavMe works"
            title="How NavMe Works"
            description="From a simple QR scan to an AR exhibit—NavMe guides every step of the museum learning journey."
          />
        </SectionReveal>

        <div ref={timelineRef} className="relative mx-auto mt-14 max-w-2xl md:mt-20">
          <div
            className="absolute left-[1.15rem] top-3 bottom-3 w-px bg-nm-border md:left-[1.4rem]"
            aria-hidden
          />
          <div
            ref={lineRef}
            className="absolute left-[1.15rem] top-3 bottom-3 w-px origin-top bg-gradient-to-b from-nm-primary via-nm-accent to-nm-highlight md:left-[1.4rem]"
            aria-hidden
          />

          <ol className="relative flex flex-col gap-10 md:gap-12">
            {WORKS_STEPS.map((step, index) => (
              <li key={step.id}>
                <SectionReveal>
                  <div className="flex gap-5 md:gap-7">
                    <div
                      className={cn(
                        "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-nm-border bg-nm-secondary text-sm font-semibold text-nm-text md:h-11 md:w-11 md:text-base",
                        index === WORKS_STEPS.length - 1 &&
                          "border-nm-highlight/60 shadow-[0_0_20px_rgba(62,244,255,0.25)]",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="pt-0.5 md:pt-1">
                      <h3 className="text-xl font-semibold tracking-tight text-nm-text md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-base text-nm-muted md:text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
