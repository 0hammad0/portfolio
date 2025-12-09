"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
  duration?: number;
  stagger?: number;
  splitBy?: "chars" | "words" | "lines";
  animation?: "fade" | "slide" | "scale" | "blur";
  trigger?: "load" | "scroll";
}

export function TextReveal({
  children,
  className,
  as: Component = "span",
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  splitBy = "chars",
  animation = "slide",
  trigger = "scroll",
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const text = children;

    // Split text
    let elements: string[];
    if (splitBy === "chars") {
      elements = text.split("");
    } else if (splitBy === "words") {
      elements = text.split(" ");
    } else {
      elements = text.split("\n");
    }

    // Create spans for each element
    container.innerHTML = elements
      .map((el, i) => {
        const content = el === " " ? "&nbsp;" : el;
        return `<span class="inline-block overflow-hidden"><span class="reveal-char inline-block" style="display: inline-block;">${content}</span></span>${splitBy === "words" && i < elements.length - 1 ? "&nbsp;" : ""}`;
      })
      .join("");

    const chars = container.querySelectorAll(".reveal-char");

    // Animation presets
    const animations = {
      fade: { opacity: 0, y: 0 },
      slide: { opacity: 0, y: "100%" },
      scale: { opacity: 0, scale: 0.5, y: 20 },
      blur: { opacity: 0, filter: "blur(10px)", y: 20 },
    };

    const fromVars = animations[animation];

    gsap.set(chars, fromVars);

    const tl = gsap.timeline({
      scrollTrigger:
        trigger === "scroll"
          ? {
              trigger: container,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            }
          : undefined,
      delay: trigger === "load" ? delay : 0,
    });

    tl.to(chars, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration,
      stagger,
      ease: "power4.out",
      delay: trigger === "scroll" ? delay : 0,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [children, prefersReducedMotion, delay, duration, stagger, splitBy, animation, trigger]);

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={cn("whitespace-pre-wrap", className)}
      aria-label={children}
    >
      {children}
    </Component>
  );
}
