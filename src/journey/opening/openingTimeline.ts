import gsap from "gsap";

export type OpeningTimelineHandles = {
  root: HTMLElement;
  particles: HTMLElement | null;
  blueprint: HTMLElement | null;
  fragments: HTMLElement | null;
  messageA: HTMLElement | null;
  messageB: HTMLElement | null;
  welcomeLine: HTMLElement | null;
  brand: HTMLElement | null;
  logo: HTMLElement | null;
  enter: HTMLElement | null;
  tagline: HTMLElement | null;
  scan: HTMLElement | null;
  dimmer: HTMLElement | null;
};

export type OpeningTimelineOptions = {
  reducedMotion: boolean;
  onReadyForEnter: () => void;
  onAssemblyProgress?: (t: number) => void;
};

/**
 * Master GSAP timeline for Scenes 1-3, then pauses for Enter (Scene 4).
 * Caller runs Scene 5 exit separately after click.
 */
export function createOpeningTimeline(
  handles: OpeningTimelineHandles,
  opts: OpeningTimelineOptions,
): gsap.core.Timeline {
  const {
    root,
    particles,
    blueprint,
    fragments,
    messageA,
    messageB,
    welcomeLine,
    brand,
    logo,
    enter,
    tagline,
    scan,
    dimmer,
  } = handles;

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
  });

  if (opts.reducedMotion) {
    gsap.set(
      [messageA, messageB, welcomeLine, brand, logo, enter].filter(Boolean),
      { opacity: 0 },
    );
    gsap.set([particles, blueprint, fragments].filter(Boolean), {
      opacity: 0,
    });
    if (dimmer) tl.to(dimmer, { opacity: 0.55, duration: 0.3 }, 0);
    if (logo) tl.to(logo, { opacity: 1, scale: 1, duration: 0.4 }, 0.15);
    if (brand) tl.to(brand, { opacity: 1, duration: 0.3 }, 0.35);
    if (enter) tl.to(enter, { opacity: 1, duration: 0.25 }, 0.5);
    tl.add(() => opts.onReadyForEnter());
    return tl;
  }

  gsap.set(root, { opacity: 1 });
  gsap.set(
    [messageA, messageB, welcomeLine, brand, logo, enter, tagline].filter(
      Boolean,
    ),
    { opacity: 0 },
  );
  if (logo) gsap.set(logo, { scale: 0.88 });
  if (enter) gsap.set(enter, { y: 8 });
  if (scan) gsap.set(scan, { scale: 0, opacity: 0 });

  if (particles) {
    tl.fromTo(
      particles,
      { opacity: 0 },
      { opacity: 0.7, duration: 0.7, ease: "sine.out" },
      0,
    );
  }
  if (blueprint) {
    tl.fromTo(
      blueprint,
      { opacity: 0 },
      { opacity: 0.45, duration: 0.85, ease: "sine.out" },
      0.1,
    );
  }
  if (fragments) {
    const kids = Array.from(
      fragments.querySelectorAll<HTMLElement>("[data-fx]"),
    );
    kids.forEach((el, i) => {
      const x = Number(el.dataset.fx ?? 0);
      const y = Number(el.dataset.fy ?? 0);
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0.55,
        rotation: 0,
      });
      tl.to(
        el,
        {
          x,
          y,
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: "power3.out",
        },
        0.15 + i * 0.04,
      );
    });
    kids.forEach((el, i) => {
      gsap.to(el, {
        y: `+=${5}`,
        duration: 1.4,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
        delay: 0.9 + i * 0.03,
      });
    });
  }

  // Brief hold on constellation, then assemble.
  tl.to({}, { duration: 2.1 });

  tl.addLabel("assembly");
  if (fragments) {
    const kids = Array.from(
      fragments.querySelectorAll<HTMLElement>("[data-fx]"),
    );
    const assemblyProxy = { t: 0 };
    tl.to(
      assemblyProxy,
      {
        t: 1,
        duration: 1.7,
        ease: "power3.inOut",
        onUpdate: () => opts.onAssemblyProgress?.(assemblyProxy.t),
      },
      "assembly",
    );
    tl.to(
      kids,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0.85,
        opacity: 0.3,
        filter: "blur(2px)",
        duration: 1.7,
        stagger: 0.025,
        ease: "power3.inOut",
      },
      "assembly",
    );
  } else {
    const assemblyProxy = { t: 0 };
    tl.to(
      assemblyProxy,
      {
        t: 1,
        duration: 1.7,
        ease: "power3.inOut",
        onUpdate: () => opts.onAssemblyProgress?.(assemblyProxy.t),
      },
      "assembly",
    );
  }
  if (blueprint) {
    tl.to(
      blueprint,
      { opacity: 0.75, duration: 1.3, ease: "power2.inOut" },
      "assembly+=0.15",
    );
  }
  tl.to({}, { duration: 0.35 });

  tl.addLabel("message");
  if (dimmer) {
    tl.to(dimmer, { opacity: 0.62, duration: 0.45 }, "message");
  }
  if (fragments) {
    tl.to(fragments, { opacity: 0.15, duration: 0.45 }, "message");
  }
  if (messageA) {
    tl.fromTo(
      messageA,
      { opacity: 0, y: 14, letterSpacing: "0.08em" },
      { opacity: 1, y: 0, letterSpacing: "0.02em", duration: 0.65 },
      "message+=0.1",
    );
  }
  if (messageB) {
    tl.fromTo(
      messageB,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55 },
      "message+=0.45",
    );
  }
  tl.to({}, { duration: 0.45 });
  if (messageA && messageB) {
    tl.to(
      [messageA, messageB],
      { opacity: 0, y: -8, duration: 0.35 },
      "-=0.05",
    );
  }
  if (welcomeLine) {
    tl.fromTo(
      welcomeLine,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35 },
      "-=0.1",
    );
  }
  if (brand) {
    tl.fromTo(
      brand,
      { opacity: 0, y: 12, letterSpacing: "0.12em" },
      { opacity: 1, y: 0, letterSpacing: "-0.02em", duration: 0.55 },
      "-=0.08",
    );
  }
  if (logo) {
    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.82, filter: "blur(8px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.4",
    );
  }

  if (enter) {
    tl.fromTo(
      enter,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35 },
      "+=0.1",
    );
  }
  tl.add(() => opts.onReadyForEnter());

  return tl;
}

/** Scene 4 click → scan + tagline words → dissolve overlay (Scene 5 start). */
export function playEnterSequence(
  handles: Pick<
    OpeningTimelineHandles,
    | "scan"
    | "tagline"
    | "enter"
    | "logo"
    | "brand"
    | "welcomeLine"
    | "root"
    | "dimmer"
    | "fragments"
    | "particles"
    | "blueprint"
  >,
  onComplete: () => void,
): gsap.core.Timeline {
  const tl = gsap.timeline({
    onComplete,
    defaults: { ease: "power2.out" },
  });

  const {
    scan,
    tagline,
    enter,
    logo,
    brand,
    welcomeLine,
    root,
    dimmer,
    fragments,
    particles,
    blueprint,
  } = handles;

  if (enter) tl.to(enter, { opacity: 0, y: -6, duration: 0.2 }, 0);
  if (scan) {
    gsap.set(scan, { scale: 0.2, opacity: 0.8 });
    tl.to(
      scan,
      { scale: 3.2, opacity: 0, duration: 0.75, ease: "power2.out" },
      0,
    );
  }
  if (logo) {
    tl.to(logo, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1 }, 0.05);
  }

  if (tagline) {
    const words = Array.from(tagline.querySelectorAll("[data-word]"));
    gsap.set(tagline, { opacity: 1 });
    gsap.set(words, { opacity: 0, y: 10 });
    tl.to(
      words,
      { opacity: 1, y: 0, duration: 0.25, stagger: 0.07 },
      0.2,
    );
  }

  tl.to({}, { duration: 0.3 });
  tl.to(
    [
      welcomeLine,
      brand,
      logo,
      tagline,
      fragments,
      particles,
      blueprint,
      dimmer,
    ].filter(Boolean),
    { opacity: 0, duration: 0.5, ease: "power2.inOut" },
    "-=0.05",
  );
  if (root) {
    tl.to(root, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, "-=0.3");
  }

  return tl;
}
