"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function LandingAnimations({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;

        gsap
          .timeline({ defaults: { duration: 0.7, ease: "power3.out" } })
          .from("[data-site-header]", { autoAlpha: 0, y: -28 })
          .from("[data-hero-item]", { autoAlpha: 0, stagger: 0.08, y: 34 }, "-=0.35")
          .from("[data-hero-float]", { autoAlpha: 0, rotation: 2, x: 24 }, "-=0.4");

        gsap.to("[data-hero-image]", {
          ease: "none",
          scale: 1.08,
          yPercent: 10,
          scrollTrigger: {
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to("[data-hero-content]", {
          autoAlpha: 0.15,
          ease: "none",
          yPercent: -14,
          scrollTrigger: {
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom 20%",
            scrub: 0.8,
          },
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: "[data-features]",
              start: "top 88%",
              end: "top 35%",
              scrub: 0.9,
            },
          })
          .from("[data-feature-heading]", { autoAlpha: 0, y: 60 })
          .from(
            "[data-feature-card]",
            {
              autoAlpha: 0,
              stagger: 0.14,
              y: isDesktop ? 100 : 55,
            },
            "-=0.35",
          );

        gsap
          .timeline({
            scrollTrigger: {
              trigger: "[data-demo]",
              start: "top 88%",
              end: "top 30%",
              scrub: 1,
            },
          })
          .from("[data-demo-copy]", {
            autoAlpha: 0,
            x: isDesktop ? -90 : 0,
            y: isDesktop ? 0 : 55,
          })
          .from(
            "[data-demo-card]",
            {
              autoAlpha: 0,
              rotation: isDesktop ? 2 : 0,
              scale: 0.94,
              x: isDesktop ? 90 : 0,
              y: isDesktop ? 0 : 55,
            },
            "-=0.65",
          );

        gsap.from("[data-footer]", {
          autoAlpha: 0,
          y: 36,
          scrollTrigger: {
            trigger: "[data-footer]",
            start: "top 96%",
            end: "top 82%",
            scrub: 0.6,
          },
        });
      });

      return () => media.revert();
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
