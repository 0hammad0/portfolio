"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxTextProps {
  children: string;
  className?: string;
  baseVelocity?: number;
  repeat?: number;
}

export function ParallaxText({
  children,
  className,
  baseVelocity = 100,
  repeat = 4,
}: ParallaxTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -baseVelocity * repeat]
  );

  const springX = useSpring(x, { stiffness: 100, damping: 30 });

  if (prefersReducedMotion) {
    return (
      <div className={cn("overflow-hidden py-4", className)}>
        <span className="text-4xl md:text-6xl font-bold whitespace-nowrap opacity-10">
          {children}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden py-2 md:py-4", className)}
    >
      <motion.div
        style={{ x: springX }}
        className="flex whitespace-nowrap gap-8 md:gap-12"
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <span
            key={i}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-foreground uppercase tracking-wider whitespace-nowrap"
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
