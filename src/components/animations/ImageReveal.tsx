"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

type RevealDirection = "up" | "down" | "left" | "right" | "center";

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
  blur?: boolean;
  scale?: boolean;
}

const getClipPath = (direction: RevealDirection, revealed: boolean) => {
  if (revealed) return "inset(0% 0% 0% 0%)";

  switch (direction) {
    case "up":
      return "inset(100% 0% 0% 0%)";
    case "down":
      return "inset(0% 0% 100% 0%)";
    case "left":
      return "inset(0% 100% 0% 0%)";
    case "right":
      return "inset(0% 0% 0% 100%)";
    case "center":
      return "inset(50% 50% 50% 50%)";
    default:
      return "inset(100% 0% 0% 0%)";
  }
};

export function ImageReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.8,
  once = true,
  blur = true,
  scale = false,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{
          clipPath: getClipPath(direction, false),
          filter: blur ? "blur(10px)" : "blur(0px)",
          scale: scale ? 1.1 : 1,
        }}
        animate={{
          clipPath: isInView ? getClipPath(direction, true) : getClipPath(direction, false),
          filter: isInView ? "blur(0px)" : blur ? "blur(10px)" : "blur(0px)",
          scale: isInView ? 1 : scale ? 1.1 : 1,
        }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="will-change-[clip-path,filter,transform]"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Simpler variant with just opacity and blur
export function BlurFadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  once = true,
  y = 20,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-30px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : y,
        filter: isInView ? "blur(0px)" : "blur(10px)",
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("will-change-[opacity,transform,filter]", className)}
    >
      {children}
    </motion.div>
  );
}
