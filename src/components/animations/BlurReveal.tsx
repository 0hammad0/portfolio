"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // blur intensity in px
  scale?: number; // scale factor
  y?: number; // y offset
  duration?: number;
  stagger?: number;
  selector?: string; // selector for child elements to animate
}

export function BlurReveal({
  children,
  className,
  intensity = 20,
  scale = 0.95,
  y = 60,
  duration = 1,
  stagger = 0.1,
  selector,
}: BlurRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const elements = selector
      ? containerRef.current.querySelectorAll(selector)
      : [containerRef.current];

    const ctx = gsap.context(() => {
      gsap.from(elements, {
        filter: `blur(${intensity}px)`,
        opacity: 0,
        scale,
        y,
        duration,
        stagger: selector ? stagger : 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, intensity, scale, y, duration, stagger, selector]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={cn("will-change-[filter,opacity,transform]", className)}>
      {children}
    </div>
  );
}

// Staggered blur reveal for lists/grids
export function BlurRevealStagger({
  children,
  className,
  itemClassName,
  intensity = 15,
  scale = 0.9,
  y = 40,
  duration = 0.8,
  stagger = 0.08,
}: BlurRevealProps & { itemClassName?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".blur-reveal-item");

    const ctx = gsap.context(() => {
      gsap.from(items, {
        filter: `blur(${intensity}px)`,
        opacity: 0,
        scale,
        y,
        duration,
        stagger: {
          amount: stagger * items.length,
          from: "start",
        },
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, intensity, scale, y, duration, stagger]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
