import { useEffect, useState } from "react";

/**
 * False while the viewport is still changing (rotate / resize),
 * then true after it settles. Used to freeze CSS3D boards and look-around.
 */
export function useViewportSettled(delayMs = 200): boolean {
  const [settled, setSettled] = useState(true);

  useEffect(() => {
    let timer = 0;
    const bump = () => {
      setSettled(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSettled(true), delayMs);
    };
    window.addEventListener("resize", bump);
    window.addEventListener("orientationchange", bump);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", bump);
      window.removeEventListener("orientationchange", bump);
    };
  }, [delayMs]);

  return settled;
}
