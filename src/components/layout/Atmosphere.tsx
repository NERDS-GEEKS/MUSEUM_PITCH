export function Atmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-nm-bg" />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 80% 55% at 15% 20%, color-mix(in srgb, var(--nm-primary) 28%, transparent), transparent 65%)",
            "radial-gradient(ellipse 70% 50% at 85% 15%, color-mix(in srgb, var(--nm-accent) 22%, transparent), transparent 60%)",
            "radial-gradient(ellipse 60% 45% at 50% 90%, color-mix(in srgb, var(--nm-highlight) 12%, transparent), transparent 55%)",
          ].join(", "),
        }}
      />
      <div className="nm-atmosphere-orb nm-atmosphere-orb--a" />
      <div className="nm-atmosphere-orb nm-atmosphere-orb--b" />
      <div className="nm-atmosphere-beam" />
      <div className="nm-atmosphere-grid absolute inset-0 opacity-[0.12]" />
      <div className="nm-atmosphere-noise absolute inset-0 opacity-[0.045]" />
    </div>
  );
}
