export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[100] -translate-y-16 rounded-full bg-nm-primary px-4 py-2 text-sm font-medium text-white opacity-0 transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-nm-bg"
    >
      Skip to main content
    </a>
  );
}
