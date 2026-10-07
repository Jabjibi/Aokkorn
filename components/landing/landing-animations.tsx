"use client";

import type { ReactNode } from "react";
import { AnimatedSurface } from "@/components/shared/animated-surface";
import { useLandingMotion } from "@/lib/hooks/landing/use-landing-motion";

export function LandingAnimations({
  children,
  className,
  kind = "reveal",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  kind?: "float" | "reveal";
  delay?: number;
}) {
  const animation = useLandingMotion(kind, delay);
  return (
    <AnimatedSurface animation={animation} className={className}>
      {children}
    </AnimatedSurface>
  );
}
