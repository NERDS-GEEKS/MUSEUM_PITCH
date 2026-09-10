import { useMagnetic } from "@/hooks/useMagnetic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type MagneticProps = {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  strength?: number;
};

export function Magnetic({
  children,
  disabled = false,
  className,
  strength,
}: MagneticProps) {
  const reduce = usePrefersReducedMotion();
  const { onPointerMove, onPointerLeave, style } = useMagnetic(strength);
  const inactive = disabled || reduce;

  if (inactive) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      animate={{ x: style.x, y: style.y }}
      transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.35 }}
    >
      {children}
    </motion.div>
  );
}