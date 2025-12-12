"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Check if device has touch
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth animation loop with lerp
    const animate = () => {
      const lerp = 0.1; // Smoothing factor

      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * lerp;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || !isVisible) return null;

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-[1] will-change-transform"
      style={{
        transform: "translate(-100px, -100px)",
      }}
    >
      {/* Main glow */}
      <div
        className="absolute rounded-full opacity-20 dark:opacity-15"
        style={{
          width: "600px",
          height: "600px",
          left: "-300px",
          top: "-300px",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Inner bright spot */}
      <div
        className="absolute rounded-full opacity-30 dark:opacity-20"
        style={{
          width: "200px",
          height: "200px",
          left: "-100px",
          top: "-100px",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
