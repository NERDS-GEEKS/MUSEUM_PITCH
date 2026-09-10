import logo from "@/assets/logo.png";
import { BLOG_PATH } from "@/constants/blog/types";
import { CALENDLY_DEMO_URL } from "@/constants/contact";
import { requestReturnToFinish } from "@/journey/returnToFinishStore";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function BlogChrome({
  children,
  active = "blog",
}: {
  children: ReactNode;
  active?: "blog" | "post";
}) {
  return (
    <div className="min-h-svh bg-nm-bg text-nm-text">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,139,255,0.16),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.08),transparent_40%)]"
        aria-hidden
      />
      <header className="relative z-10 border-b border-nm-border/80 bg-[rgba(5,5,5,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
          >
            <img src={logo} alt="NavMe" className="h-8 w-auto sm:h-9" />
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-2">
            {active === "post" ? (
              <Link
                to={BLOG_PATH}
                className="rounded-full border border-white/30 bg-transparent px-3 py-1.5 text-xs font-semibold text-[#C8D6EC] transition-colors hover:border-white/50 hover:text-white sm:px-4 sm:text-sm"
              >
                All posts
              </Link>
            ) : (
              <span
                aria-current="page"
                className="rounded-full border border-nm-primary/60 bg-nm-primary/15 px-3 py-1.5 text-xs font-semibold text-nm-primary sm:px-4 sm:text-sm"
              >
                Blog
              </span>
            )}
            <a
              href={CALENDLY_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-nm-primary to-nm-highlight px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 sm:px-4 sm:text-sm"
            >
              Schedule a Demo
            </a>
            <Link
              to="/"
              onClick={() => requestReturnToFinish()}
              className="rounded-full border border-white/30 bg-transparent px-3 py-1.5 text-xs font-semibold text-[#C8D6EC] transition-colors hover:border-white/50 hover:text-white sm:px-4 sm:text-sm"
            >
              Back to NavMe
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="relative z-10 border-t border-nm-border/80 py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-nm-muted sm:px-6 lg:px-8">
          <p>© 2026 NavMe. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
