import { cn } from "@/utils/cn";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "glass" | "ghost";
type ButtonSize = "md" | "lg";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

export type ButtonProps =
  | (SharedProps &
      ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: undefined;
      })
  | (SharedProps &
      AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      });

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
): string {
  return cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nm-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nm-bg)]",
    "before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:translate-x-0 before:skew-x-[-20deg] before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:opacity-0 before:transition-all before:duration-500 hover:before:translate-x-[220%] hover:before:opacity-100",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-7 text-base",
    variant === "primary" && "bg-nm-primary text-white hover:brightness-110",
    variant === "glass" &&
      "border border-nm-border bg-nm-glass text-nm-text backdrop-blur-md hover:bg-white/10",
    variant === "ghost" && "bg-transparent text-nm-text hover:bg-nm-glass",
    className,
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    href,
    ...rest
  } = props;
  const classes = buttonClasses(variant, size, className);

  if (typeof href === "string") {
    return (
      <a
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <span className="relative z-10">{children}</span>
      </a>
    );
  }

  const { type = "button", ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={classes} {...buttonRest}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
