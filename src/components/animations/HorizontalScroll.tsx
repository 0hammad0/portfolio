"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function HorizontalScroll({
  children,
  className,
  speed = 1,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !scrollRef.current) return;

    const container = containerRef.current;
    const scrollContent = scrollRef.current;
    const scrollWidth = scrollContent.scrollWidth - container.offsetWidth;

    const ctx = gsap.context(() => {
      gsap.to(scrollContent, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${scrollWidth * speed}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion, speed]);

  if (prefersReducedMotion) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className="flex gap-8">{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <div ref={scrollRef} className="flex gap-8 will-change-transform">
        {children}
      </div>
    </div>
  );
}
