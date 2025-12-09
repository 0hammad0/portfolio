"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins (only on client)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Default animation settings
export const gsapDefaults = {
  ease: "power3.out",
  duration: 0.8,
};

// Configure GSAP defaults
gsap.defaults(gsapDefaults);

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// ScrollTrigger default configuration
export const scrollTriggerDefaults = {
  start: "top 85%",
  end: "bottom 15%",
  toggleActions: "play none none reverse",
};

export { gsap, ScrollTrigger };
