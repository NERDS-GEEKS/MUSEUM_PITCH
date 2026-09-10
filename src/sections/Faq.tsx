import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { FAQ_ITEMS } from "@/constants/faq";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

export function Faq() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section id="faq" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="Answers about Digital Twins, AR exhibits, browser-based visits, curator CMS, and how NavMe converts a traditional museum."
          />
        </SectionReveal>

        <ul className="mt-12 space-y-3 md:mt-16">
          {FAQ_ITEMS.map((item) => {
            const expanded = openId === item.id;
            const panelId = `${baseId}-${item.id}-panel`;
            const buttonId = `${baseId}-${item.id}-button`;

            return (
              <li key={item.id}>
                <SectionReveal>
                  <GlassPanel className="overflow-hidden">
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-nm-text transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary focus-visible:ring-inset md:px-6 md:py-5 md:text-lg"
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        onClick={() =>
                          setOpenId((current) =>
                            current === item.id ? null : item.id,
                          )
                        }
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className={cn(
                            "size-5 shrink-0 text-nm-muted transition-transform duration-200",
                            expanded && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!expanded}
                    >
                      <p className="border-t border-nm-border px-5 py-4 text-sm leading-relaxed text-nm-muted md:px-6 md:py-5 md:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </GlassPanel>
                </SectionReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
