import { cn } from "@/utils/cn";

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-nm-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-nm-text md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-nm-muted md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}