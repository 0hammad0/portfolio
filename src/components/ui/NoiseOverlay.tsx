"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface NoiseOverlayProps {
  opacity?: number;
  animate?: boolean;
  className?: string;
}

export function NoiseOverlay({
  opacity = 0.03,
  animate = true,
  className,
}: NoiseOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none z-[9999] ${className}`}
      initial={{ opacity }}
      animate={
        shouldAnimate
          ? {
              opacity: [opacity, opacity * 1.5, opacity],
            }
          : { opacity }
      }
      transition={
        shouldAnimate
          ? {
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
            }
          : undefined
      }
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </motion.div>
  );
}

// Alternative: CSS-based noise using a data URI (better performance)
export function NoiseOverlayCSS({
  opacity = 0.03,
  className,
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Film grain effect (more pronounced, good for hero sections)
export function FilmGrain({
  opacity = 0.05,
  className,
}: {
  opacity?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              backgroundPosition: ["0% 0%", "100% 100%"],
            }
      }
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <svg className="w-[200%] h-[200%]" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.7"
            numOctaves="3"
            result="noise"
          />
          <feComposite in="SourceGraphic" in2="noise" operator="in" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </motion.div>
  );
}
