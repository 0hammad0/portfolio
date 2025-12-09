"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface RevealMaskProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  blur?: boolean;
}

export function RevealMask({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 1,
  blur = true,
}: RevealMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !contentRef.current) return;

    const directions = {
      up: { y: 60, x: 0, clipPath: "inset(100% 0% 0% 0%)" },
      down: { y: -60, x: 0, clipPath: "inset(0% 0% 100% 0%)" },
      left: { x: 60, y: 0, clipPath: "inset(0% 0% 0% 100%)" },
      right: { x: -60, y: 0, clipPath: "inset(0% 100% 0% 0%)" },
    };

    const dir = directions[direction];

    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, {
        ...dir,
        opacity: 0,
        filter: blur ? "blur(10px)" : "blur(0px)",
      });

      gsap.to(contentRef.current, {
        y: 0,
        x: 0,
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        filter: "blur(0px)",
        duration,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, direction, delay, duration, blur]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <div
        ref={contentRef}
        className="will-change-[transform,opacity,clip-path,filter]"
      >
        {children}
      </div>
    </div>
  );
}
