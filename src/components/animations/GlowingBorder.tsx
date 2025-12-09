"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowingBorder({
  children,
  className,
  glowColor = "var(--accent)",
}: GlowingBorderProps) {
  return (
    <div className={cn("relative group", className)}>
      {/* Animated gradient border */}
      <motion.div
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute -inset-[2px] rounded-xl opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500"
        style={{ background: glowColor }}
      />

      {/* Content */}
      <div className="relative bg-background-secondary rounded-xl">
        {children}
      </div>
    </div>
  );
}
