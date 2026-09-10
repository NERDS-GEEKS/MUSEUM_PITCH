import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down" | "top";

const TOP_THRESHOLD = 24;

function initialScrollDirection(): ScrollDirection {
  if (typeof window === "undefined") return "top";
  return window.scrollY < TOP_THRESHOLD ? "top" : "down";
}

export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(initialScrollDirection);
  const lastY = useRef(
    typeof window !== "undefined" ? window.scrollY : 0,
  );

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < TOP_THRESHOLD) {
        setDirection("top");
      } else if (y > lastY.current) {
        setDirection("down");
      } else if (y < lastY.current) {
        setDirection("up");
      }
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return direction;
}
