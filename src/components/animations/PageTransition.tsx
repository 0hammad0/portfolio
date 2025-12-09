"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsLoaded(true);
      return;
    }

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(containerRef.current, {
        filter: "blur(20px)",
        opacity: 0,
        scale: 0.98,
      });

      // Entrance animation
      const tl = gsap.timeline({
        onComplete: () => setIsLoaded(true),
      });

      // Overlay fade out
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      });

      // Content reveal with blur
      tl.to(
        containerRef.current,
        {
          filter: "blur(0px)",
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Loading overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-background pointer-events-none"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Animated loader */}
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-accent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div ref={containerRef} className="will-change-[filter,opacity,transform]">
        {children}
      </div>
    </>
  );
}
