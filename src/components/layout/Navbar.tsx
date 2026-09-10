import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { NAV_LINKS } from "@/constants/nav";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/utils/cn";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const direction = useScrollDirection();
  const [open, setOpen] = useState(false);
  const hidden = direction === "down";

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-transform duration-300 ease-out",
        hidden && "-translate-y-[140%]",
      )}
    >
      <nav
        aria-label="Primary"
        className="flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-nm-border bg-nm-glass px-3 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-4"
      >
        <a
          href="#hero"
          className="flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="NavMe"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain"
          />
          <span className="text-sm font-bold tracking-wide text-nm-text">
            NavMe
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3 py-2 text-sm text-nm-muted transition-colors hover:text-nm-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Magnetic className="hidden sm:block">
            <Button variant="primary" size="md" href="#contact">
              Schedule a Demo
            </Button>
          </Magnetic>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-nm-border bg-nm-glass text-nm-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="absolute left-4 right-4 top-[calc(100%+0.75rem)] rounded-3xl border border-nm-border bg-[color-mix(in_srgb,var(--nm-secondary)_92%,transparent)] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex min-h-12 items-center rounded-2xl px-4 text-base text-nm-text transition-colors hover:bg-nm-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-nm-border pt-2 sm:hidden">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              href="#contact"
              onClick={closeMenu}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
