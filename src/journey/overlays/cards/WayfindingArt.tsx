import wayfindingRef from "@/assets/wayfinding-reference.png";

/** Shared media block for cards using the indoor wayfinding concept art. */
export function WayfindingArt({
  caption,
  className = "",
}: {
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-nm-border/80 bg-nm-secondary/40 ${className}`}>
      <img
        src={wayfindingRef}
        alt="Indoor wayfinding concept - AR path, floor plan, and turn-by-turn guidance"
        className="h-auto w-full object-cover object-center"
        loading="lazy"
        width={640}
        height={400}
      />
      {caption ? (
        <figcaption className="border-t border-nm-border/60 px-3 py-2 text-[11px] leading-snug text-nm-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
