import { BLOG_PATH } from "@/constants/blog/types";
import { CALENDLY_DEMO_URL } from "@/constants/contact";
import { FOOTER_COLUMNS, type FooterLink } from "@/constants/footer";
import {
  PRIVACY_PATH,
  PRIVACY_URL,
  TERMS_PATH,
  TERMS_URL,
} from "@/constants/legal/types";
import { JOURNEY_NODES } from "@/journey/constants/nodes";
import {
  setFinishCreditsTarget,
  useFinishCredits,
} from "@/journey/opening/finishCreditsStore";
import { closeDestinationDetail } from "@/journey/overlays/destinationDetailStore";
import { requestReturnToFinish } from "@/journey/returnToFinishStore";
import { useJourneyProgressApi } from "@/journey/scroll/useJourneyProgress";
import { useEffect, useState, type MouseEvent } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

const PREV_NODE =
  JOURNEY_NODES[JOURNEY_NODES.length - 2] ??
  JOURNEY_NODES.find((n) => n.id === "industries");

const inkShadow =
  "0 1px 2px rgba(0,0,0,0.55), 0 0 14px rgba(8,14,28,0.3)";

/** Keep the phone dock short: 3 links max per column. */
const LINKS_PER_COLUMN = 3;

type GoToJourney = (dockT: number) => void;

function legalPathFromHref(
  href: string,
): typeof PRIVACY_PATH | typeof TERMS_PATH | null {
  const normalized = href.replace(/\/+$/, "");
  if (normalized === PRIVACY_PATH) return PRIVACY_PATH;
  if (normalized === TERMS_PATH) return TERMS_PATH;
  return null;
}

function openFooterLink(
  link: FooterLink | { href: string; journeyId?: string },
  event: MouseEvent,
  navigate: NavigateFunction,
  goToJourney: GoToJourney,
) {
  event.preventDefault();
  event.stopPropagation();

  if (link.journeyId) {
    const node = JOURNEY_NODES.find((n) => n.id === link.journeyId);
    if (node) {
      goToJourney(node.dockT);
      return;
    }
  }

  const href = link.href;
  if (href.startsWith("mailto:")) {
    window.location.assign(href);
    return;
  }
  const legalPath = legalPathFromHref(href);
  if (legalPath) {
    requestReturnToFinish();
    navigate(legalPath);
    return;
  }
  const blogHref = href === `${BLOG_PATH}/` ? BLOG_PATH : href;
  if (blogHref === BLOG_PATH || blogHref.startsWith(`${BLOG_PATH}/`)) {
    navigate(blogHref);
    return;
  }
  if (href.startsWith("http://") || href.startsWith("https://")) {
    window.location.assign(href);
  }
}

function isNativeFooterHref(href: string): boolean {
  return (
    href.startsWith("mailto:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  );
}

function shortLabel(label: string): string {
  if (label.includes("@")) return "Email";
  return label;
}

function FooterNavLink({
  link,
  navigate,
  goToJourney,
}: {
  link: FooterLink;
  navigate: NavigateFunction;
  goToJourney: GoToJourney;
}) {
  const label = shortLabel(link.label);
  const className =
    "block w-full truncate py-0.5 text-left text-[12px] leading-tight text-white active:text-white";

  if (!link.journeyId && isNativeFooterHref(link.href)) {
    const external = link.href.startsWith("http");
    return (
      <a
        href={link.href}
        className={className}
        style={{ textShadow: inkShadow }}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={{ textShadow: inkShadow }}
      onClick={(event) => openFooterLink(link, event, navigate, goToJourney)}
    >
      {label}
    </button>
  );
}

function useIsPhone(): boolean {
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const onResize = () => setIsPhone(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isPhone;
}

/**
 * Phone-only finish footer as a compact bottom dock (no scroll).
 * Leaves the upper screen clear for the companion robot.
 */
export function FinishFooterOverlay() {
  const credits = useFinishCredits();
  const isPhone = useIsPhone();
  const navigate = useNavigate();
  const { setProgress } = useJourneyProgressApi();

  if (!isPhone || credits < 0.08) return null;

  const opacity = Math.min(1, Math.max(0, (credits - 0.08) / 0.42));
  const interactive = credits > 0.28;

  const goToJourney = (dockT: number) => {
    closeDestinationDetail();
    setProgress(dockT);
    const completeDock =
      JOURNEY_NODES.find((n) => n.id === "complete")?.dockT ?? 1;
    if (Math.abs(dockT - completeDock) < 0.02) {
      setFinishCreditsTarget(1);
    } else {
      setFinishCreditsTarget(0);
    }
  };

  const onLeaveMural = () => {
    setFinishCreditsTarget(0);
    closeDestinationDetail();
    if (PREV_NODE) setProgress(PREV_NODE.dockT);
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] flex flex-col justify-end"
      style={{
        opacity,
        transition: "opacity 160ms linear",
      }}
      aria-hidden={!interactive}
    >
      <div
        className="w-full overflow-hidden px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-5"
        style={{
          pointerEvents: interactive ? "auto" : "none",
          background:
            "linear-gradient(to top, rgba(6,12,24,0.92) 0%, rgba(6,12,24,0.72) 62%, rgba(6,12,24,0.2) 88%, transparent 100%)",
          textShadow: inkShadow,
        }}
        data-footer-interactive
        data-allow-scroll
      >
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[1.35rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[1.5rem]">
              Navigate Smarter.
              <span className="mt-0.5 block text-[1.05rem] font-medium text-white sm:text-[1.15rem]">
                Experience Better.
              </span>
            </h2>
            <a
              href={CALENDLY_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center border-b border-white/55 pb-0.5 text-[0.95rem] font-semibold text-white"
            >
              Schedule a Demo ↗
            </a>
          </div>
          <button
            type="button"
            onClick={onLeaveMural}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 bg-[rgba(10,18,36,0.75)] px-2.5 py-1.5 text-[11px] font-semibold text-white"
            aria-label="Swipe down · Previous stop"
          >
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/25 text-[10px] text-white"
              aria-hidden
            >
              ↓
            </span>
            Back
          </button>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-x-2 border-t border-white/15 pt-2.5">
          {FOOTER_COLUMNS.slice(0, 4).map((column) => (
            <div key={column.title} className="min-w-0">
              <h3 className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                {column.title}
              </h3>
              <ul className="mt-1 space-y-0">
                {column.links.slice(0, LINKS_PER_COLUMN).map((link) => (
                  <li key={link.label}>
                    <FooterNavLink
                      link={link}
                      navigate={navigate}
                      goToJourney={goToJourney}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/12 pt-2">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="text-[11px] font-medium text-white active:text-white"
              onClick={(event) =>
                openFooterLink(
                  { href: PRIVACY_URL },
                  event,
                  navigate,
                  goToJourney,
                )
              }
            >
              Privacy
            </button>
            <button
              type="button"
              className="text-[11px] font-medium text-white active:text-white"
              onClick={(event) =>
                openFooterLink(
                  { href: TERMS_URL },
                  event,
                  navigate,
                  goToJourney,
                )
              }
            >
              Terms
            </button>
          </div>
          <p className="shrink-0 text-[10px] text-white">
            © 2026 MetaDigi Labs
          </p>
        </div>
      </div>
    </div>
  );
}
