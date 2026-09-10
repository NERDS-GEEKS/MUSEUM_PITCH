import { useCallback, useState, type PointerEvent } from "react";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function useMagnetic(strength = 0.35): {
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  style: { x: number; y: number };
} {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxX = rect.width / 2;
      const maxY = rect.height / 2;
      const x = clamp((e.clientX - centerX) * strength, -maxX, maxX);
      const y = clamp((e.clientY - centerY) * strength, -maxY, maxY);
      setOffset({ x, y });
    },
    [strength],
  );

  const onPointerLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return {
    onPointerMove,
    onPointerLeave,
    style: offset,
  };
}
