import navmeArrow from "@/assets/NavMe_blue_arrow.png";
import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type NavMeArrowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual direction of the arrow asset (points up by default). */
  direction?: "up" | "down" | "left" | "right";
  size?: "sm" | "md" | "lg";
  label: string;
};

const SIZE = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-[4.75rem] w-[4.75rem]",
} as const;

const ROTATE = {
  up: "",
  down: "rotate-180",
  left: "-rotate-90",
  right: "rotate-90",
} as const;

/** Brand arrow control for opening marks and stepping between sections. */
export function NavMeArrowButton({
  direction = "up",
  size = "md",
  label,
  className,
  ...props
}: NavMeArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center rounded-full transition-transform duration-200",
        "hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-nm-bg",
        "disabled:pointer-events-none disabled:opacity-35",
        SIZE[size],
        className,
      )}
      {...props}
    >
      <img
        src={navmeArrow}
        alt=""
        width={96}
        height={96}
        draggable={false}
        className={cn(
          "h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(79,139,255,0.45)] transition-[filter,transform] duration-200 group-hover:brightness-110",
          ROTATE[direction],
        )}
        aria-hidden
      />
    </button>
  );
}
