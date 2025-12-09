"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
}

export function AnimatedGradientText({
  children,
  className,
  colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4"],
  animationSpeed = 3,
  as: Component = "span",
}: AnimatedGradientTextProps) {
  const prefersReducedMotion = useReducedMotion();

  const gradientColors = colors.join(", ");

  if (prefersReducedMotion) {
    return (
      <Component className={cn("text-gradient", className)}>
        {children}
      </Component>
    );
  }

  return (
    <motion.span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-[length:200%_auto]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientColors})`,
      }}
      animate={{
        backgroundPosition: ["0% center", "200% center"],
      }}
      transition={{
        duration: animationSpeed,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.span>
  );
}

// Shimmer variant - text that shimmers like light passing through
export function ShimmerText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={cn("text-foreground", className)}>{children}</span>;
  }

  return (
    <span
      className={cn(
        "relative inline-block",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </span>
  );
}

// Glowing text variant
export function GlowingText({
  children,
  className,
  glowColor = "var(--accent)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      animate={
        prefersReducedMotion
          ? {}
          : {
              textShadow: [
                `0 0 10px ${glowColor}40, 0 0 20px ${glowColor}20`,
                `0 0 20px ${glowColor}60, 0 0 40px ${glowColor}40, 0 0 60px ${glowColor}20`,
                `0 0 10px ${glowColor}40, 0 0 20px ${glowColor}20`,
              ],
            }
      }
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.span>
  );
}
