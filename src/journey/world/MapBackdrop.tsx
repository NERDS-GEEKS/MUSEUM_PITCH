/**
 * Soft museum atmosphere behind the WebGL stage.
 * Warm gallery washes and a faint floor-plan ghost.
 */
export function MapBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Deep gallery base */}
      <div className="absolute inset-0 bg-[#1a1612]" />

      {/* Primary spatial wash - warm center stage */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 85% 60% at 50% 42%, rgba(196,165,116,0.16), transparent 62%),
            radial-gradient(ellipse 55% 40% at 22% 68%, rgba(110,207,200,0.05), transparent 55%),
            linear-gradient(180deg, #221c16 0%, #1a1612 48%, #100e0c 100%)
          `,
        }}
      />

      {/* Soft ceiling ambient */}
      <div
        className="absolute inset-x-0 top-0 h-[42%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(60,50,38,0.75) 0%, rgba(26,22,18,0.35) 45%, transparent 100%)",
        }}
      />

      {/* Floor contact */}
      <div
        className="absolute inset-x-[-10%] bottom-[-8%] h-[48%]"
        style={{
          background:
            "linear-gradient(0deg, rgba(16,12,8,0.8) 0%, transparent 75%)",
        }}
      />

      {/* Ghost floor plan - faint museum galleries */}
      <div
        className="absolute inset-x-[-5%] bottom-[-18%] h-[78%] opacity-[0.2]"
        style={{
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 48%, black 10%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 48%, black 10%, transparent 72%)",
          transform: "perspective(1100px) rotateX(58deg) scale(1.35)",
          transformOrigin: "center 62%",
        }}
      >
        <svg
          viewBox="0 0 800 520"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M120 260 H680"
            stroke="rgba(196,165,116,0.5)"
            strokeWidth="1.2"
          />
          <path
            d="M120 300 H680"
            stroke="rgba(196,165,116,0.32)"
            strokeWidth="1"
          />
          <path
            d="M260 120 V400"
            stroke="rgba(110,207,200,0.22)"
            strokeWidth="1"
          />
          <path
            d="M540 120 V400"
            stroke="rgba(110,207,200,0.22)"
            strokeWidth="1"
          />
          <rect
            x="140"
            y="140"
            width="100"
            height="90"
            stroke="rgba(196,165,116,0.38)"
            strokeWidth="1"
          />
          <rect
            x="140"
            y="300"
            width="100"
            height="90"
            stroke="rgba(196,165,116,0.3)"
            strokeWidth="1"
          />
          <rect
            x="560"
            y="140"
            width="100"
            height="90"
            stroke="rgba(196,165,116,0.38)"
            strokeWidth="1"
          />
          <rect
            x="560"
            y="300"
            width="100"
            height="90"
            stroke="rgba(196,165,116,0.3)"
            strokeWidth="1"
          />
          <rect
            x="300"
            y="200"
            width="200"
            height="120"
            rx="2"
            stroke="rgba(110,207,200,0.4)"
            strokeWidth="1.15"
          />
          <path
            d="M380 200 V188 M420 200 V188 M380 320 V332 M420 320 V332"
            stroke="rgba(110,207,200,0.3)"
            strokeWidth="1.2"
          />
          <circle cx="190" cy="185" r="2.2" fill="rgba(110,207,200,0.4)" />
          <circle cx="610" cy="185" r="2.2" fill="rgba(110,207,200,0.35)" />
          <circle cx="400" cy="260" r="2.5" fill="rgba(196,165,116,0.45)" />
          <circle cx="190" cy="345" r="2" fill="rgba(196,165,116,0.32)" />
          <circle cx="610" cy="345" r="2" fill="rgba(196,165,116,0.32)" />
        </svg>
      </div>

      {/* Distant soft light pools */}
      <div
        className="absolute left-[8%] top-[30%] h-[28vmin] w-[28vmin] rounded-full opacity-35 blur-3xl"
        style={{ background: "rgba(196,165,116,0.2)" }}
      />
      <div
        className="absolute right-[10%] top-[38%] h-[22vmin] w-[22vmin] rounded-full opacity-28 blur-3xl"
        style={{ background: "rgba(110,207,200,0.12)" }}
      />
    </div>
  );
}

/** Edge vignette above the canvas - frames the gallery without covering the route. */
export function MapVignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 78% 72% at 50% 48%, transparent 40%, rgba(12,10,8,0.55) 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, rgba(12,10,8,0.4) 0%, transparent 14%, transparent 86%, rgba(12,10,8,0.4) 100%),
            linear-gradient(180deg, rgba(20,16,12,0.35) 0%, transparent 16%, transparent 84%, rgba(12,10,8,0.5) 100%)
          `,
        }}
      />
    </div>
  );
}
