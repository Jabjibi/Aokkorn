"use client";

import type { MotionProps } from "motion/react";
import { useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(reducedMotionQuery).matches;
// Render the same static surface on the server and during hydration.
const getServerSnapshot = () => true;

export function useLandingMotion(kind: "float" | "reveal", delay = 0): MotionProps {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (reducedMotion) {
    return { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } };
  }

  if (kind === "float") {
    return {
      initial: false,
      animate: { y: [0, -12, 0] },
      transition: { duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay },
    };
  }

  return {
    initial: false,
    whileInView: { y: [18, 0], opacity: [0.75, 1] },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.55, ease: "easeOut", delay },
  };
}
