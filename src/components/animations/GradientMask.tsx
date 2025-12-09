"use client";

import { cn } from "@/lib/utils/cn";

interface GradientMaskProps {
  children: React.ReactNode;
  className?: string;
  direction?: "top" | "bottom" | "both";
  intensity?: number; // percentage where fade starts (e.g., 70 means fade starts at 70%)
}

export function GradientMask({
  children,
  className,
  direction = "bottom",
  intensity = 70,
}: GradientMaskProps) {
  const getMaskStyle = () => {
    switch (direction) {
      case "top":
        return {
          maskImage: `linear-gradient(to bottom, transparent 0%, black ${100 - intensity}%, black 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${100 - intensity}%, black 100%)`,
        };
      case "bottom":
        return {
          maskImage: `linear-gradient(to bottom, black 0%, black ${intensity}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${intensity}%, transparent 100%)`,
        };
      case "both":
        return {
          maskImage: `linear-gradient(to bottom, transparent 0%, black ${100 - intensity}%, black ${intensity}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${100 - intensity}%, black ${intensity}%, transparent 100%)`,
        };
      default:
        return {};
    }
  };

  return (
    <div className={cn("relative", className)} style={getMaskStyle()}>
      {children}
    </div>
  );
}

// Scrollable container with gradient fade at edges
export function ScrollFade({
  children,
  className,
  fadeSize = 60,
}: {
  children: React.ReactNode;
  className?: string;
  fadeSize?: number;
}) {
  return (
    <div
      className={cn("relative overflow-auto", className)}
      style={{
        maskImage: `linear-gradient(to bottom, transparent, black ${fadeSize}px, black calc(100% - ${fadeSize}px), transparent)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent, black ${fadeSize}px, black calc(100% - ${fadeSize}px), transparent)`,
      }}
    >
      {children}
    </div>
  );
}
