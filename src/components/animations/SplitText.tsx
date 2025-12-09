"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  type?: "chars" | "words" | "lines";
  animation?: "fade" | "slide" | "rotate" | "scale" | "blur" | "wave";
  trigger?: "load" | "scroll";
  delay?: number;
  stagger?: number;
  duration?: number;
}

export function SplitText({
  children,
  className,
  as: Component = "div",
  type = "chars",
  animation = "slide",
  trigger = "scroll",
  delay = 0,
  stagger = 0.02,
  duration = 0.8,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const text = children;

    // Split text into elements
    let elements: string[];
    if (type === "chars") {
      elements = text.split("");
    } else if (type === "words") {
      elements = text.split(/(\s+)/);
    } else {
      elements = text.split("\n");
    }

    // Create HTML with spans
    container.innerHTML = elements
      .map((el, i) => {
        if (el.match(/^\s+$/)) return el; // Keep whitespace
        const content = el === " " ? "&nbsp;" : el;
        return `<span class="split-parent inline-block overflow-hidden"><span class="split-child inline-block" data-index="${i}">${content}</span></span>`;
      })
      .join("");

    const splitChildren = container.querySelectorAll(".split-child");

    // Animation presets
    const animations = {
      fade: { opacity: 0 },
      slide: { opacity: 0, y: "110%" },
      rotate: { opacity: 0, y: "100%", rotateX: -90 },
      scale: { opacity: 0, scale: 0, y: 50 },
      blur: { opacity: 0, filter: "blur(20px)", y: 30 },
      wave: { opacity: 0, y: "100%", rotation: 10 },
    };

    gsap.set(splitChildren, animations[animation]);

    const tl = gsap.timeline({
      scrollTrigger:
        trigger === "scroll"
          ? {
              trigger: container,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            }
          : undefined,
    });

    tl.to(splitChildren, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      rotation: 0,
      filter: "blur(0px)",
      duration,
      stagger: {
        each: stagger,
        from: "start",
      },
      ease: "power4.out",
      delay: trigger === "scroll" ? 0 : delay,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [children, prefersReducedMotion, type, animation, trigger, delay, stagger, duration]);

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={cn("whitespace-pre-wrap", className)}
      aria-label={children}
    >
      {children}
    </Component>
  );
}
