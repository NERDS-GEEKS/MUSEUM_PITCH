import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function GlassPanel({ className, children, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-nm-border bg-nm-glass backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}