import logo from "@/assets/logo.png";
import {
  CALENDLY_DEMO_URL,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
} from "@/constants/contact";
import { FOOTER_COLUMNS } from "@/constants/footer";

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-nm-border px-4 pb-10 pt-20 md:px-8 md:pb-14 md:pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--nm-secondary)_55%,transparent)] to-[color-mix(in_srgb,var(--nm-primary)_18%,var(--nm-bg))]"
      />
      <div
        aria-hidden
        className="nm-footer-grid pointer-events-none absolute inset-0 opacity-50"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <a
            href="#hero"
            className="group flex items-center gap-4 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
          >
            <img
              src={logo}
              alt="NavMe"
              width={80}
              height={80}
              className="h-16 w-16 rounded-2xl object-contain md:h-20 md:w-20"
            />
            <div>
              <p className="text-3xl font-semibold tracking-tight text-nm-text md:text-4xl">
                NavMe
              </p>
              <p className="mt-1 text-sm text-nm-muted md:text-base">
                Navigate Smarter. Experience Better. NavMe transforms
                traditional museums into AR museums through Digital Twins,
                indoor navigation, interactive exhibits, and visitor analytics.
              </p>
            </div>
          </a>

          <div className="w-full max-w-md space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-nm-text">
              Let&apos;s Work Together
            </p>
            <h3 className="text-xl font-semibold text-nm-text sm:text-2xl">
              Make Your Museum an AR Museum.
            </h3>
            <p className="text-sm text-nm-muted sm:text-base">
              Talk to us about Digital Twins, AR exhibits, and visitor analytics
              that convert a traditional museum into an AR museum.
            </p>
            <a
              href={CALENDLY_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-nm-primary/50 bg-nm-primary/90 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-nm-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
            >
              Schedule a Demo
            </a>
            <p className="text-sm text-nm-muted">
              Email:{" "}
              <a
                href={CONTACT_MAILTO}
                className="text-nm-text underline decoration-nm-border/70 underline-offset-4 transition-colors hover:text-nm-primary"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-nm-text">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm text-nm-muted transition-colors hover:text-nm-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-nm-border pt-8">
          <p className="text-center text-sm text-nm-muted">
            © 2026 NavMe. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
