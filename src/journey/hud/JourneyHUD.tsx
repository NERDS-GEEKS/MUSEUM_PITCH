import logo from "@/assets/logo.png";
import { CALENDLY_DEMO_URL } from "@/constants/contact";
import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { setFinishCreditsTarget } from "@/journey/opening/finishCreditsStore";
import { setWelcomeBeat } from "@/journey/camera/galleryWallStore";
import { closeDestinationDetail } from "@/journey/overlays/destinationDetailStore";
import {
  useActiveNodeId,
  useJourneyProgressApi,
} from "@/journey/scroll/useJourneyProgress";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Route, X } from "lucide-react";
import { Fragment, useEffect, useId, useMemo, useState } from "react";

/** Brand chrome for exit / journey UI (matches --nm-primary bronze). */
const JOURNEY_CHROME = "#c4a574";
const JOURNEY_CHROME_MUTED = "rgba(196,165,116,0.4)";

/** Top-nav keywords - short labels for journey destinations. */
const NAV_KEYWORDS: Record<string, string> = {
  welcome: "Welcome",
  "gps-fails": "Problem",
  vps: "Solution",
  mapping: "Guide",
  analytics: "Insights",
  industries: "Benefits",
  complete: "Connect",
};

const DEMO_NODE = JOURNEY_NODES.find((n) => n.id === "industries");
const CONTACT_NODE = JOURNEY_NODES.find((n) => n.id === "complete");

type GridPoint = { x: number; y: number };

type NavCell = { nodeIdx: number; col: number };

const NAV_COLS = 3;

/**
 * Mobile / tablet - 3-col snake (odd rows L→R, even rows R→L):
 *   1  2  3
 *   6  5  4
 *   7
 */
function buildNavRows(
  count: number,
  cols = NAV_COLS,
): readonly (readonly NavCell[])[] {
  const rows: NavCell[][] = [];
  for (let i = 0; i < count; i++) {
    const rowIdx = Math.floor(i / cols);
    const posInRow = i % cols;
    const rtl = rowIdx % 2 === 1;
    const col = rtl ? cols - 1 - posInRow : posInRow;
    if (!rows[rowIdx]) rows[rowIdx] = [];
    rows[rowIdx].push({ nodeIdx: i, col });
  }
  return rows;
}

/** Badge centers in a 0-100 viewBox matching the snake row layout. */
function navLayoutPoints(
  count: number,
  rows: readonly (readonly NavCell[])[],
  cols: number,
): GridPoint[] {
  const rowCount = rows.length;
  const points: GridPoint[] = new Array(count);
  rows.forEach((row, rowIdx) => {
    // Sit on the badge band (upper cell) so connectors stay above labels.
    const y = ((rowIdx + 0.22) / rowCount) * 100;
    row.forEach(({ nodeIdx, col }) => {
      if (nodeIdx >= count) return;
      points[nodeIdx] = {
        x: ((col + 0.5) / cols) * 100,
        y,
      };
    });
  });
  return points;
}

/**
 * Snake path with row doglegs through column gutters -
 * verticals miss the centered labels under each badge.
 */
function buildSnakePath(points: GridPoint[]): string {
  if (points.length === 0) return "";
  const gutter = 100 / NAV_COLS / 2.35;
  const parts: string[] = [];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (i === 0) {
      parts.push(`M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
      continue;
    }
    const prev = points[i - 1];
    const sameRow = Math.abs(prev.y - p.y) < 0.8;
    if (sameRow) {
      parts.push(`L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
      continue;
    }
    // Nudge toward the nearest inter-column gap (away from outer edge).
    const towardCenter = prev.x <= 50 ? gutter : -gutter;
    const midX = prev.x + towardCenter;
    parts.push(`L ${midX.toFixed(2)} ${prev.y.toFixed(2)}`);
    parts.push(`L ${midX.toFixed(2)} ${p.y.toFixed(2)}`);
    parts.push(`L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
  }
  return parts.join(" ");
}

/** Desktop - one row of circle + label stops, linked like 1–2–3. */
function JourneyNavLine({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (dockT: number) => void;
}) {
  const activeIndex =
    JOURNEY_NODES.find((n) => n.id === activeId)?.index ?? 1;

  return (
    <ul className="flex h-full w-full items-center px-1">
      {JOURNEY_NODES.map((node, i) => {
        const isActive = node.id === activeId;
        const label = NAV_KEYWORDS[node.id] ?? node.title;
        return (
          <Fragment key={node.id}>
            {i > 0 ? (
              <li aria-hidden className="flex shrink-0 items-center px-0.5">
                <span
                  className="h-[2px] w-2 rounded-full sm:w-3"
                  style={{
                    background:
                      activeIndex >= node.index
                        ? JOURNEY_CHROME
                        : JOURNEY_CHROME_MUTED,
                  }}
                />
              </li>
            ) : null}
            <li className="relative z-10 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onSelect(node.dockT)}
                title={node.title}
                className={cn(
                  "flex h-full w-full min-w-0 cursor-pointer flex-row items-center justify-center gap-1 rounded-md bg-transparent px-0.5 text-center transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight/70",
                  isActive
                    ? "text-nm-text"
                    : "text-nm-muted hover:text-nm-text",
                )}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${node.index}. ${node.title}`}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors",
                    "ring-2 ring-[rgb(12,22,42)]",
                    isActive
                      ? "bg-nm-primary text-white"
                      : "bg-[rgb(12,22,42)] text-nm-muted border border-white/25 hover:border-nm-primary/45 hover:text-nm-text",
                  )}
                >
                  {node.index}
                </span>
                <span className="min-w-0 truncate px-0.5 py-0.5 text-[10px] font-bold leading-none sm:text-[11px]">
                  {label}
                </span>
              </button>
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
}

/** Mobile - 3-col snake grid with dashed connectors. */
function JourneyNavGrid({
  activeId,
  onSelect,
  dense = false,
}: {
  activeId: string;
  onSelect: (dockT: number) => void;
  dense?: boolean;
}) {
  const activeIndex =
    JOURNEY_NODES.find((n) => n.id === activeId)?.index ?? 1;
  const count = JOURNEY_NODES.length;
  const cols = NAV_COLS;
  const rows = useMemo(() => buildNavRows(count, cols), [count, cols]);
  const points = useMemo(
    () => navLayoutPoints(count, rows, cols),
    [count, rows, cols],
  );
  const fullPath = useMemo(() => buildSnakePath(points), [points]);
  const activePath = useMemo(
    () => buildSnakePath(points.slice(0, Math.max(1, activeIndex))),
    [points, activeIndex],
  );

  return (
    <div className="relative isolate">
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={fullPath}
          fill="none"
          stroke={JOURNEY_CHROME_MUTED}
          strokeWidth={dense ? 1.4 : 1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1.8 2.4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={activePath}
          fill="none"
          stroke={JOURNEY_CHROME}
          strokeWidth={dense ? 2.2 : 2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative z-10 flex flex-col gap-1">
        {rows.map((row, rowIdx) => {
          // Sort by column so CSS grid packs one clean row (RTL snake still uses
          // journey order for the path; DOM must be L→R or items stack diagonally).
          const cells = [...row].sort((a, b) => a.col - b.col);
          return (
            <ul
              key={`nav-row-${rowIdx}`}
              className="grid grid-cols-3 gap-0"
            >
              {cells.map(({ nodeIdx, col }) => {
                const node = JOURNEY_NODES[nodeIdx];
                if (!node) return null;
                const isActive = node.id === activeId;
                const label = NAV_KEYWORDS[node.id] ?? node.title;
                return (
                  <li
                    key={node.id}
                    className="relative z-10 min-w-0"
                    style={{ gridColumn: col + 1, gridRow: 1 }}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(node.dockT)}
                      title={node.title}
                      className={cn(
                        "relative z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md bg-transparent text-center transition-colors",
                        dense ? "px-1 py-1" : "px-1.5 py-1.5",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight/70",
                        isActive
                          ? "text-nm-text"
                          : "text-nm-muted hover:text-nm-text",
                      )}
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`${node.index}. ${node.title}`}
                    >
                      <span
                        className={cn(
                          "relative z-20 flex shrink-0 items-center justify-center rounded-full font-semibold transition-colors",
                          "ring-2 ring-[rgb(12,22,42)]",
                          dense
                            ? "h-6 w-6 text-[11px]"
                            : "h-7 w-7 text-xs",
                          isActive
                            ? "bg-nm-primary text-white"
                            : "bg-[rgb(12,22,42)] text-nm-muted border border-white/25 hover:border-nm-primary/45 hover:text-nm-text",
                        )}
                      >
                        {node.index}
                      </span>
                      <span
                        className={cn(
                          "relative z-20 w-full rounded-sm bg-[rgb(12,22,42)] px-0.5 py-0.5 font-bold leading-tight",
                          dense ? "text-[10px]" : "text-[11px]",
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Journey chrome:
 * - Desktop: collapsible horizontal stop line (hidden on smaller devices).
 * - Mobile / tablet: 3-column snake dropdown.
 * - Persistent Demo + Contact shortcuts in the HUD (hidden on Connect mural).
 * - Connect mural: same nav stays up, plus Exit back to Demo.
 */
export function JourneyHUD() {
  const activeId = useActiveNodeId();
  const { setProgress } = useJourneyProgressApi();
  const active =
    JOURNEY_NODES.find((n) => n.id === activeId) ?? JOURNEY_NODES[0];
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const onConnectWall = active.id === "complete";
  const showHudCtas = !onConnectWall;

  useEffect(() => {
    setOpen(false);
  }, [active.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goTo = (dockT: number) => {
    const node = JOURNEY_NODES.find((item) => item.dockT === dockT);
    if (node?.id === "welcome") setWelcomeBeat("video");
    setFinishCreditsTarget(0);
    closeDestinationDetail();
    setOpen(false);
    setProgress(dockT);
  };

  const goContact = () => {
    if (!CONTACT_NODE) return;
    closeDestinationDetail();
    setOpen(false);
    setProgress(CONTACT_NODE.dockT);
    // Open the connect/contact mural immediately (don't clear credits via goTo).
    setFinishCreditsTarget(1);
  };

  const exitConnectWall = () => {
    setFinishCreditsTarget(0);
    closeDestinationDetail();
    setOpen(false);
    if (DEMO_NODE) {
      setProgress(DEMO_NODE.dockT);
    } else {
      const prev = JOURNEY_NODES[JOURNEY_NODES.length - 2];
      if (prev) setProgress(prev.dockT);
    }
  };

  const ctaBtn = (
    label: string,
    onClick: () => void,
    opts: { primary?: boolean; disabled?: boolean; short?: string },
  ) => (
    <button
      type="button"
      onClick={onClick}
      disabled={opts.disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 sm:text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight/80",
        opts.disabled
          ? "cursor-default border border-white/10 bg-white/5 text-nm-muted/45"
          : opts.primary
            ? "border border-nm-primary/50 bg-nm-primary/90 text-white hover:bg-nm-primary"
            : "border border-white/18 bg-[rgba(28,25,22,0.88)] text-nm-text backdrop-blur-md hover:border-white/35 hover:bg-[rgba(42,34,26,0.92)]",
      )}
      aria-label={label}
      aria-current={opts.disabled ? "page" : undefined}
    >
      <span className="sm:hidden">{opts.short ?? label}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const demoCta = (
    <a
      href={CALENDLY_DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 sm:text-sm",
        "border border-nm-primary/50 bg-nm-primary/90 text-white hover:bg-nm-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight/80",
      )}
      aria-label="Schedule a Demo"
    >
      <span className="sm:hidden">Demo</span>
      <span className="hidden sm:inline">Schedule a Demo</span>
    </a>
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] pl-[max(0.75rem,env(safe-area-inset-left))] md:px-5 md:pt-4">
      <div className="relative mx-auto flex w-full max-w-[100vw] items-center justify-between gap-2">
        {/* Logo + desktop nav on one row */}
        <div
          className={cn(
            "pointer-events-auto relative flex min-w-0 flex-1 items-center gap-2",
            open ? "z-[110]" : "z-20",
          )}
        >
          <button
            type="button"
            aria-label="Refresh NavMe"
            title="Refresh"
            onClick={() => {
              window.location.reload();
            }}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 md:h-11 md:w-11",
              "hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight/80",
            )}
          >
            <img
              id="journey-hud-logo"
              src={logo}
              alt="NavMe"
              width={44}
              height={44}
              className="h-full w-full rounded-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
              draggable={false}
            />
          </button>

          {/* Desktop - always visible, including Connect mural */}
          <nav
            id={menuId}
            aria-label="Journey destinations"
            className="pointer-events-auto hidden min-w-0 flex-1 lg:block"
          >
            <div className="flex h-10 w-full items-center rounded-full border border-white/18 bg-[rgba(28,25,22,0.94)] px-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)] md:h-11">
              <JourneyNavLine activeId={active.id} onSelect={goTo} />
            </div>
          </nav>
        </div>

        {/* Right cluster - CTAs + mobile menu / Exit */}
        <div
          className={cn(
            "pointer-events-auto relative flex shrink-0 items-center justify-end gap-1.5 sm:gap-2",
            open ? "z-[110]" : "z-20",
          )}
        >
          {showHudCtas ? (
            <div
              className="flex items-center gap-1.5 sm:gap-2"
              role="group"
              aria-label="Quick actions"
            >
              {demoCta}
              {ctaBtn("Contact Us", goContact, {
                short: "Contact",
              })}
            </div>
          ) : null}

          {onConnectWall ? (
            <button
              type="button"
              onClick={exitConnectWall}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-nm-primary/35 bg-[rgba(28,25,22,0.88)] px-3 py-1.5 text-sm font-semibold text-nm-text backdrop-blur-md lg:px-4 lg:py-2",
                "transition-colors hover:border-nm-primary/60 hover:bg-[rgba(42,34,26,0.92)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary/80",
              )}
              aria-label="Exit Connect wall and return to Benefits"
            >
              <ArrowLeft
                className="h-4 w-4 shrink-0 text-nm-primary"
                strokeWidth={2.25}
                aria-hidden
              />
              Exit
            </button>
          ) : null}

          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${menuId}-mobile`}
            aria-label={
              open
                ? "Close journey menu"
                : `Open journey menu · Stop ${String(active.index).padStart(2, "0")}`
            }
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-nm-primary/35 bg-[rgba(28,25,22,0.88)] text-nm-primary backdrop-blur-md transition-all duration-300 lg:hidden",
              "hover:border-nm-primary/60 hover:bg-[rgba(42,34,26,0.9)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary/80",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45, scale: 0.85 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex"
                >
                  <X className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                </motion.span>
              ) : (
                <motion.span
                  key="journey"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex"
                >
                  <Route className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence initial={false}>
            {open ? (
              <motion.nav
                id={`${menuId}-mobile`}
                key="journey-stop-menu-mobile"
                aria-label="Journey destinations"
                className="pointer-events-auto absolute right-0 top-[calc(100%+0.4rem)] z-[110] w-[min(14.5rem,calc(100vw-1.5rem))] origin-top-right"
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="max-h-[min(62svh,22rem)] overflow-y-auto overscroll-contain rounded-lg border border-white/18 bg-[rgba(28,25,22,0.94)] p-2 shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
                  <JourneyNavGrid activeId={active.id} onSelect={goTo} dense />
                </div>
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {open ? (
        <button
          type="button"
          className="pointer-events-auto fixed inset-0 z-[105] bg-black/25 lg:bg-transparent"
          aria-label="Close journey menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
