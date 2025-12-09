"use client";

import { useRef, useEffect, useState, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function HeroBackgroundComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Pause animations when page is hidden (tab inactive)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Pause animations when section is not in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Should animations be active?
  const shouldAnimate = !prefersReducedMotion && isVisible && isPageVisible;

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Animated gradient orbs - using CSS animations with will-change */}
      <motion.div
        style={{ y: y1, opacity, willChange: "transform" }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px]"
      >
        <div
          className="w-full h-full rounded-full bg-accent/20 blur-[100px]"
          style={{
            animation: shouldAnimate ? "pulse-glow 4s ease-in-out infinite" : "none",
            willChange: shouldAnimate ? "opacity" : "auto"
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: y2, opacity, willChange: "transform" }}
        className="absolute -top-20 -right-40 w-[600px] h-[600px]"
      >
        <div
          className="w-full h-full rounded-full bg-accent/15 blur-[120px]"
          style={{
            animation: shouldAnimate ? "pulse-glow 4s ease-in-out infinite 1s" : "none",
            willChange: shouldAnimate ? "opacity" : "auto"
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: y1, opacity, willChange: "transform" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
      >
        <div
          className="w-full h-full rounded-full bg-accent/10 blur-[150px]"
          style={{
            animation: shouldAnimate ? "pulse-glow 4s ease-in-out infinite 2s" : "none",
            willChange: shouldAnimate ? "opacity" : "auto"
          }}
        />
      </motion.div>

      {/* Animated mesh gradient */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating gradient lines - CSS animations instead of Framer Motion */}
      <div
        className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        style={{
          animation: shouldAnimate ? "float-line-1 8s ease-in-out infinite" : "none",
          willChange: shouldAnimate ? "transform, opacity" : "auto"
        }}
      />

      <div
        className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
        style={{
          animation: shouldAnimate ? "float-line-2 10s ease-in-out infinite" : "none",
          willChange: shouldAnimate ? "transform, opacity" : "auto"
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-accent/10 to-transparent" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />

      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes float-line-1 {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        @keyframes float-line-2 {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(20px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const HeroBackground = memo(HeroBackgroundComponent);
