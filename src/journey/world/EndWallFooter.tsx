import { BLOG_PATH } from "@/constants/blog/types";
import { CALENDLY_DEMO_URL } from "@/constants/contact";
import { FOOTER_COLUMNS, type FooterLink } from "@/constants/footer";
import {
  PRIVACY_PATH,
  TERMS_PATH,
} from "@/constants/legal/types";
import { JOURNEY_NODES } from "@/journey/constants/nodes";
import {
  getFinishCredits,
  setFinishCreditsTarget,
  useFinishCredits,
} from "@/journey/opening/finishCreditsStore";
import { closeDestinationDetail } from "@/journey/overlays/destinationDetailStore";
import {
  FINISH_WALL_FRAME,
  FINISH_WALL_MURAL,
  finishViewDistance,
  INTRO_LOGO_FRAME,
  isMuralCompactViewport,
} from "@/journey/path/walkPath";
import { useJourneyProgressApi } from "@/journey/scroll/useJourneyProgress";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type CSSProperties, type MouseEvent } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { requestReturnToFinish } from "@/journey/returnToFinishStore";
import { Group } from "three";

/** CSS pixels across the mural; world size = css * (distanceFactor / 400). */
const MURAL_CSS_W = 1600;

const DEMO_NODE = JOURNEY_NODES.find((n) => n.id === "industries");
const PREV_NODE =
  JOURNEY_NODES[JOURNEY_NODES.length - 2] ?? DEMO_NODE;

const inkShadow =
  "0 1px 2px rgba(0,0,0,0.55), 0 0 18px rgba(8,14,28,0.35)";

type GoToJourney = (dockT: number) => void;

function legalPathFromHref(href: string): typeof PRIVACY_PATH | typeof TERMS_PATH | null {
  const normalized = href.replace(/\/+$/, "");
  if (normalized === PRIVACY_PATH) return PRIVACY_PATH;
  if (normalized === TERMS_PATH) return TERMS_PATH;
  return null;
}

/** iOS Safari often blocks window.open from button handlers inside WebGL Html. */
function openExternalUrl(url: string) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened || opened.closed) {
    window.location.assign(url);
  }
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
    // Used so browser back restores the finish-wall footer view.
    requestReturnToFinish();
    navigate(legalPath);
    return;
  }
  const blogHref = href === `${BLOG_PATH}/` ? BLOG_PATH : href;
  if (blogHref === BLOG_PATH || blogHref.startsWith(`${BLOG_PATH}/`)) {
    navigate(blogHref);
    return;
  }
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/")
  ) {
    const url = href.startsWith("/")
      ? new URL(href, window.location.origin).href
      : href;
    openExternalUrl(url);
  }
}

function isNativeFooterHref(href: string): boolean {
  return (
    href.startsWith("mailto:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  );
}

/** Prefer real anchors for mailto/http so iPhone Safari treats the tap as navigation. */
function FooterNavLink({
  link,
  className,
  style,
  navigate,
  goToJourney,
}: {
  link: FooterLink;
  className: string;
  style?: CSSProperties;
  navigate: NavigateFunction;
  goToJourney: GoToJourney;
}) {
  if (!link.journeyId && isNativeFooterHref(link.href)) {
    const external = link.href.startsWith("http");
    return (
      <a
        href={link.href}
        className={className}
        style={style}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
      >
        {link.label}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={(event) => openFooterLink(link, event, navigate, goToJourney)}
    >
      {link.label}
    </button>
  );
}

function WallMuralHtml({
  cssW,
  cssH,
  isPhone,
  isCompact,
  onLeaveMural,
  navigate,
  goToJourney,
}: {
  cssW: number;
  cssH: number;
  isPhone: boolean;
  isCompact: boolean;
  onLeaveMural?: () => void;
  navigate: NavigateFunction;
  goToJourney: GoToJourney;
}) {
  const quickLinks =
    FOOTER_COLUMNS.find((column) => column.title === "Quick Links") ??
    FOOTER_COLUMNS[0];
  const contact =
    FOOTER_COLUMNS.find((column) => column.title === "Contact") ??
    FOOTER_COLUMNS[1];

  const titlePx = isPhone
    ? Math.max(42, Math.min(72, cssW * 0.072))
    : isCompact
      ? Math.max(24, cssW * 0.036)
      : 40;
  const subPx = isPhone
    ? Math.max(32, Math.min(54, cssW * 0.054))
    : isCompact
      ? Math.max(18, cssW * 0.028)
      : 34;
  const bodyPx = isCompact ? Math.max(11, cssW * 0.015) : 15;
  const labelPx = isPhone
    ? Math.max(18, Math.min(28, cssW * 0.028))
    : isCompact
      ? Math.max(10, cssW * 0.013)
      : 15;
  const headPx = isPhone
    ? Math.max(20, Math.min(30, cssW * 0.032))
    : isCompact
      ? Math.max(9, cssW * 0.011)
      : 11;

  /** Phone: mural ink painted onto the visible wall face (fills the screen). */
  if (isPhone) {
    return (
      <div
        className="select-none overflow-hidden bg-transparent"
        style={{ width: cssW, height: cssH, touchAction: "manipulation" }}
        data-footer-interactive
        data-allow-scroll
        onPointerDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
      >
        <div
          className="relative flex h-full flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain bg-transparent px-[5.5%] pb-[max(6%,env(safe-area-inset-bottom))] pt-[8%]"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        >
          <div
            className="mt-auto flex flex-col"
            style={{
              textShadow: inkShadow,
              background:
                "linear-gradient(to top, rgba(6,12,24,0.55) 0%, rgba(6,12,24,0.28) 55%, transparent 100%)",
              marginInline: "-2%",
              paddingInline: "2%",
              paddingTop: "7%",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            }}
          >
            <h2
              className="mt-1 font-semibold leading-[1.05] tracking-tight text-white"
              style={{ fontSize: titlePx }}
            >
              Navigate Smarter.
              <span
                className="mt-1 block text-white"
                style={{ fontSize: subPx }}
              >
                Experience Better.
              </span>
            </h2>

            <p
              className="mt-2 max-w-[38rem] leading-relaxed text-white/70"
              style={{ fontSize: Math.max(16, cssW * 0.022), textShadow: inkShadow }}
            >
              NavMe transforms traditional museums into AR museums through
              Digital Twins, indoor navigation, interactive exhibits, AI
              guidance, and visitor analytics.
            </p>

            <a
              href={CALENDLY_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 w-fit items-center border-b border-white/70 pb-1 font-semibold text-white"
              style={{
                fontSize: Math.max(22, cssW * 0.032),
                textShadow: inkShadow,
              }}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
            >
              Schedule a Demo ↗
            </a>

            <div className="mt-5 flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold uppercase tracking-[0.18em] text-white/45"
                  style={{ fontSize: headPx, textShadow: inkShadow }}
                >
                  {quickLinks?.title ?? "Quick Links"}
                </h3>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {quickLinks?.links.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink
                        link={link}
                        className="block min-h-10 py-1.5 text-left text-white/80 transition-colors hover:text-white active:text-white"
                        style={{ fontSize: labelPx, textShadow: inkShadow }}
                        navigate={navigate}
                        goToJourney={goToJourney}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              {contact ? (
                <div className="shrink-0 text-right">
                  <h3
                    className="font-semibold uppercase tracking-[0.18em] text-white/45"
                    style={{ fontSize: headPx, textShadow: inkShadow }}
                  >
                    {contact.title}
                  </h3>
                  <ul className="mt-2 space-y-0.5">
                    {contact.links.map((link) => (
                      <li key={link.label}>
                        <FooterNavLink
                          link={link}
                          className="block min-h-10 py-1.5 text-right text-white/80 transition-colors hover:text-white active:text-white"
                          style={{ fontSize: labelPx, textShadow: inkShadow }}
                          navigate={navigate}
                          goToJourney={goToJourney}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex flex-col items-center gap-2 border-t border-white/20 pt-2">
              {onLeaveMural ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onLeaveMural();
                  }}
                  className="inline-flex min-h-11 w-fit self-start items-center gap-1.5 rounded-full border border-white/20 bg-[rgba(10,18,36,0.72)] px-3 py-2 font-semibold text-white"
                  style={{ fontSize: Math.max(13, labelPx), textShadow: inkShadow }}
                  aria-label="Swipe down · Previous stop"
                >
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/25 text-[11px] text-white"
                    aria-hidden
                  >
                    ↓
                  </span>
                  Swipe down
                </button>
              ) : null}
              <p
                className="w-full text-center text-white"
                style={{
                  fontSize: Math.max(14, cssW * 0.02),
                  textShadow: inkShadow,
                }}
              >
                © 2026 MetaDigi Labs. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const linkClass =
    "text-white/75 transition-colors hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary";

  return (
    <div
      className="select-none overflow-hidden bg-transparent"
      style={{ width: cssW, height: cssH, touchAction: "manipulation" }}
      data-footer-interactive
      data-allow-scroll
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
    >
      <div
        className={`relative flex h-full flex-col bg-transparent ${
          isCompact ? "px-[3.5%] pb-[2.5%] pt-[8%]" : "px-[4%] pb-[3%] pt-[8.5%]"
        }`}
      >
        {/* Left gutter reserved for the companion robot on desktop/tablet. */}
        <div
          className={`flex min-h-0 flex-1 flex-col ${
            isCompact ? "pl-[18%]" : "pl-[20%]"
          }`}
        >
          <div
            className="max-w-[38rem] shrink-0"
            style={{ textShadow: inkShadow }}
          >
            <h2
              className="font-semibold leading-[1.05] tracking-tight text-white"
              style={{ fontSize: titlePx }}
            >
              Navigate Smarter.
              <span
                className="mt-0.5 block text-white"
                style={{ fontSize: subPx }}
              >
                Experience Better.
              </span>
            </h2>
            <p
              className="mt-3 max-w-[34rem] leading-relaxed text-white/65"
              style={{ fontSize: bodyPx }}
            >
              NavMe transforms traditional museums into AR museums through
              Digital Twins, indoor navigation, interactive exhibits, AI
              guidance, and visitor analytics.
            </p>
            <a
              href={CALENDLY_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center rounded-full border border-white/30 bg-white/[0.08] px-5 py-2.5 font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
              style={{ fontSize: isCompact ? 13 : 15, textShadow: inkShadow }}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
            >
              Schedule a Demo
            </a>
          </div>

          <div
            className="mt-auto shrink-0"
            style={{ textShadow: inkShadow }}
          >
            <div className="flex items-start justify-between gap-12 border-t border-white/18 pt-6">
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold uppercase tracking-[0.22em] text-white/40"
                  style={{ fontSize: headPx }}
                >
                  {quickLinks?.title ?? "Quick Links"}
                </h3>
                <ul className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {quickLinks?.links.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink
                        link={link}
                        className={linkClass}
                        style={{ fontSize: labelPx, textShadow: inkShadow }}
                        navigate={navigate}
                        goToJourney={goToJourney}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              {contact ? (
                <div className="shrink-0 text-right">
                  <h3
                    className="font-semibold uppercase tracking-[0.22em] text-white/40"
                    style={{ fontSize: headPx }}
                  >
                    {contact.title}
                  </h3>
                  <ul className="mt-3 flex flex-col items-end gap-2">
                    {contact.links.map((link) => (
                      <li key={link.label}>
                        <FooterNavLink
                          link={link}
                          className={linkClass}
                          style={{ fontSize: labelPx, textShadow: inkShadow }}
                          navigate={navigate}
                          goToJourney={goToJourney}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div
              className={`relative mt-5 flex items-center border-t border-white/12 ${
                isCompact ? "pt-2.5" : "pt-3.5"
              }`}
            >
              {onLeaveMural ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onLeaveMural();
                  }}
                  className="relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-[rgba(10,18,36,0.75)] px-3 py-1.5 font-semibold text-white transition-colors hover:border-white/45 hover:bg-[rgba(16,28,52,0.88)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary sm:px-4 sm:py-2"
                  style={{
                    fontSize: isCompact ? 11 : 13,
                    textShadow: inkShadow,
                  }}
                  aria-label={
                    isPhone
                      ? "Swipe down · Previous stop"
                      : "Scroll down · Previous stop"
                  }
                >
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/25 text-[11px] text-white"
                    aria-hidden
                  >
                    ↓
                  </span>
                  {isPhone ? "Swipe down" : "Scroll down"}
                </button>
              ) : null}

              <p
                className="pointer-events-none absolute inset-x-0 text-center text-white/45"
                style={{ fontSize: isCompact ? 10 : 12, textShadow: inkShadow }}
              >
                © 2026 MetaDigi Labs. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Finish-wall HTML mural on the real room wall.
 * Phones use FinishFooterOverlay (DOM) instead — iOS cannot reliably tap
 * CSS-transformed drei Html links.
 * Tablet / desktop: original shipped wall mural layout.
 */
export function EndWallFooter() {
  const credits = useFinishCredits();
  const navigate = useNavigate();
  const { size } = useThree();
  const { setProgress } = useJourneyProgressApi();
  const groupRef = useRef<Group>(null);
  const [cx] = INTRO_LOGO_FRAME.position;
  // Sit slightly in front of the physical wall face so Html doesn't z-fight
  const wallZ = INTRO_LOGO_FRAME.wallZ - 0.04;
  const muralY = FINISH_WALL_MURAL.centerY;
  const fov = FINISH_WALL_FRAME.fov;

  const isPhone = size.width > 0 && size.width < 768;
  const isCompact =
    !isPhone && isMuralCompactViewport(size.width, size.height);
  const aspect =
    size.width > 0 && size.height > 0 ? size.width / size.height : 16 / 9;
  // Match finishWallCamera - wall fills the screen so mural sits on the face.
  const fill = "cover" as const;

  const layout = useMemo(() => {
    const dist = finishViewDistance(aspect, fov, fill);
    const vFov = (fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    // Size mural to the visible wall patch (camera frustum at the wall).
    // Cover framing makes that patch match the screen on the wall face.
    const muralHeight = 2 * dist * Math.tan(vFov / 2);
    const muralWidth = 2 * dist * Math.tan(hFov / 2);
    const cssW = MURAL_CSS_W;
    const cssH = Math.max(1, Math.round(cssW * (muralHeight / muralWidth)));
    const distanceFactor = (400 * muralWidth) / cssW;
    return { muralWidth, muralHeight, cssW, cssH, distanceFactor };
  }, [aspect, fov, fill]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const t = getFinishCredits();
    g.visible = !isPhone && t > 0.02;
    void delta;
  });

  // Phones: FinishFooterOverlay handles the mural chrome + taps.
  if (isPhone) return null;

  const htmlOpacity = Math.min(1, Math.max(0, (credits - 0.08) / 0.42));

  const onLeaveMural = () => {
    setFinishCreditsTarget(0);
    closeDestinationDetail();
    if (PREV_NODE) setProgress(PREV_NODE.dockT);
  };

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

  return (
    <group
      ref={groupRef}
      position={[cx, muralY, wallZ]}
      rotation={[0, Math.PI, 0]}
      visible={false}
    >
      <Html
        transform
        occlude={false}
        center
        distanceFactor={layout.distanceFactor}
        position={[0, 0, 0.01]}
        style={{
          pointerEvents: credits > 0.28 ? "auto" : "none",
          opacity: htmlOpacity,
          transition: "opacity 160ms linear",
          background: "transparent",
        }}
        zIndexRange={[40, 0]}
      >
        <WallMuralHtml
          cssW={layout.cssW}
          cssH={layout.cssH}
          isPhone={false}
          isCompact={isCompact}
          onLeaveMural={onLeaveMural}
          navigate={navigate}
          goToJourney={goToJourney}
        />
      </Html>
    </group>
  );
}
