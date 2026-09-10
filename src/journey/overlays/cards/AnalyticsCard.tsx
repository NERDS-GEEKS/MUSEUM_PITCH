import {
  BUSINESS_IMPROVEMENTS,
  BUSINESS_OUTCOMES,
} from "@/constants/analytics";
import { DestinationCard } from "@/journey/overlays/DestinationCard";

export function AnalyticsCard() {
  return (
    <DestinationCard
      title="Every Visitor Journey Becomes an Insight"
      subtitle="Insights"
      body="NavMe isn't only visitor-facing. Museum teams gain meaningful spatial intelligence about how their physical spaces are explored."
    >
      <dl className="grid min-h-0 flex-1 grid-cols-2 gap-2">
        {BUSINESS_OUTCOMES.map((outcome) => (
          <div
            key={outcome.id}
            className="flex flex-col justify-center rounded-xl border border-nm-border/60 bg-nm-secondary/40 px-3 py-2"
          >
            <dt className="text-[10px] font-medium uppercase tracking-wider text-nm-muted">
              {outcome.label}
            </dt>
            <dd className="mt-0.5 text-[15px] font-semibold leading-snug text-nm-text">
              {outcome.value}
            </dd>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-nm-muted">
              {outcome.detail}
            </p>
          </div>
        ))}
      </dl>
      <ul
        className="mt-2 flex shrink-0 flex-wrap gap-1.5"
        aria-label="Museum intelligence insights"
      >
        {BUSINESS_IMPROVEMENTS.map((item) => (
          <li key={item}>
            <span className="inline-flex rounded-full border border-nm-border/80 bg-nm-secondary/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-nm-muted">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </DestinationCard>
  );
}
