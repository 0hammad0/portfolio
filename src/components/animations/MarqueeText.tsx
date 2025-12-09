"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface MarqueeTextProps {
  children: string;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  separator?: string;
  repeat?: number;
}

export function MarqueeText({
  children,
  className,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  separator = " • ",
  repeat = 4,
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !marqueeRef.current) return;

    const marquee = marqueeRef.current;
    const marqueeContent = marquee.querySelector(".marquee-content") as HTMLElement;
    if (!marqueeContent) return;

    // Clone content for seamless loop
    const clone = marqueeContent.cloneNode(true) as HTMLElement;
    marquee.appendChild(clone);

    const contentWidth = marqueeContent.offsetWidth;
    const duration = contentWidth / speed;

    const tl = gsap.timeline({ repeat: -1 });

    if (direction === "left") {
      tl.fromTo(
        marquee.children,
        { x: 0 },
        { x: -contentWidth, duration, ease: "none" }
      );
    } else {
      gsap.set(marquee.children, { x: -contentWidth });
      tl.to(marquee.children, { x: 0, duration, ease: "none" });
    }

    // Pause on hover
    if (pauseOnHover && containerRef.current) {
      containerRef.current.addEventListener("mouseenter", () => tl.pause());
      containerRef.current.addEventListener("mouseleave", () => tl.play());
    }

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion, speed, direction, pauseOnHover]);

  const text = Array(repeat).fill(children + separator).join("");

  if (prefersReducedMotion) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <span className="text-foreground/10 font-bold whitespace-nowrap">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", className)}
    >
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        <div className="marquee-content flex-shrink-0">
          <span className="text-4xl md:text-6xl lg:text-8xl font-bold text-foreground/5 whitespace-nowrap px-4">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
