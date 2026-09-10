import { SkipLink } from "@/components/layout/SkipLink";
import type { ReactNode } from "react";

/** Thin chrome: skip link + main. JourneyApp owns visuals. */
export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <main id="main">{children}</main>
    </>
  );
}
