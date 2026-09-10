import { SectionReveal } from "@/components/ui/SectionReveal";
import { INDUSTRIES } from "@/constants/industries";

const LABELS = INDUSTRIES.map((industry) => industry.label);
const MARQUEE_LABELS = [...LABELS, ...LABELS];

export function TrustedBy() {
  return (
    <section id="trusted" className="relative py-14 md:py-20">
      <SectionReveal className="mx-auto max-w-6xl px-4 md:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-[0.2em] text-nm-muted">
          Built for museums and cultural institutions
        </p>
        <div
          className="nm-marquee opacity-70"
          aria-label="Spaces NavMe serves"
        >
          <div className="nm-marquee__track">
            {MARQUEE_LABELS.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="nm-marquee__item"
                aria-hidden={index >= LABELS.length ? true : undefined}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
