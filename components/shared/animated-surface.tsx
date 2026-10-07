"use client";

import { motion, type MotionProps } from "motion/react";
import type { ReactNode } from "react";

export function AnimatedSurface({
  animation,
  children,
  className,
}: {
  animation: MotionProps;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div {...animation} className={className}>
      {children}
    </motion.div>
  );
}
