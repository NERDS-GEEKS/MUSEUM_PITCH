import logo from "@/assets/logo.png";
import type { LegalBlock, LegalDocument } from "@/constants/legal/types";
import { PRIVACY_PATH, TERMS_PATH } from "@/constants/legal/types";
import { requestReturnToFinish } from "@/journey/returnToFinishStore";
import { Link } from "react-router-dom";

function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-12 scroll-mt-24 border-b border-nm-border/60 pb-3 text-xl font-semibold tracking-tight text-nm-text sm:text-2xl">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 text-sm font-semibold tracking-wide text-nm-text sm:text-base">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="mt-3 text-[0.9375rem] leading-[1.75] text-nm-muted sm:text-base">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="mt-4 space-y-2.5 border-l border-nm-border/70 pl-5 text-[0.9375rem] leading-[1.75] text-nm-muted sm:text-base">
          {block.items.map((item) => (
            <li key={item.slice(0, 48)} className="relative pl-1">
              <span
                className="absolute -left-[1.35rem] top-[0.7em] h-1 w-1 rounded-full bg-nm-primary/80"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <aside className="mt-12 border border-nm-border/80 bg-nm-secondary/40 px-5 py-4 text-sm leading-relaxed text-nm-muted sm:px-6 sm:py-5">
          {block.text}
        </aside>
      );
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

export function LegalDocumentPage({
  document,
  otherLabel,
  otherPath,
}: {
  document: LegalDocument;
  otherLabel: string;
  otherPath: typeof PRIVACY_PATH | typeof TERMS_PATH;
}) {
  return (
    <div className="min-h-svh bg-nm-bg text-nm-text">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,139,255,0.1),transparent_50%)]"
        aria-hidden
      />
      <header className="relative z-10 border-b border-nm-border/70 bg-[rgba(5,5,5,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nm-bg"
          >
            <img src={logo} alt="Home" className="h-8 w-auto sm:h-9" />
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-2.5">
            <Link
              to={otherPath}
              className="border border-nm-border bg-transparent px-3.5 py-1.5 text-xs font-medium text-nm-muted transition-colors hover:border-white/35 hover:text-nm-text sm:px-4 sm:text-sm"
            >
              {otherLabel}
            </Link>
            <Link
              to="/"
              onClick={() => requestReturnToFinish()}
              className="border border-nm-primary/40 bg-nm-primary/90 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-nm-primary sm:px-4 sm:text-sm"
            >
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-nm-text sm:text-[2.5rem] sm:leading-tight">
          {document.title}
        </h1>
        <p className="mt-4 text-sm text-nm-muted">
          Effective Date: {document.effectiveDate}
        </p>

        <div className="mt-4 border-t border-nm-border/70 pt-5">
          {document.intro.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="mt-4 text-[0.9375rem] leading-[1.75] text-nm-muted first:mt-0 sm:text-base"
            >
              {paragraph}
            </p>
          ))}
          {document.blocks.map((block, index) => (
            <LegalBlockView key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      </main>

      <footer className="relative z-20 border-t border-nm-border/70 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 text-sm text-nm-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 MetaDigi Labs. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-1">
            <Link
              to={PRIVACY_PATH}
              className="inline-flex min-h-11 items-center px-2 py-2 transition-colors hover:text-nm-text"
            >
              Privacy Policy
            </Link>
            <Link
              to={TERMS_PATH}
              className="inline-flex min-h-11 items-center px-2 py-2 transition-colors hover:text-nm-text"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
