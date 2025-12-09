"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Track which elements already have listeners to avoid duplicates
  const processedElementsRef = useRef(new WeakSet<Element>());
  const mutationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize handlers to prevent recreation
  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);
  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Check if device has touch
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Instant position update - no delay
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Add hover listeners only to new elements (not already processed)
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button'], .cursor-pointer"
      );

      interactiveElements.forEach((el) => {
        // Skip if already processed
        if (processedElementsRef.current.has(el)) return;

        processedElementsRef.current.add(el);
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    addHoverListeners();

    // Debounced MutationObserver callback to reduce DOM thrashing
    const observer = new MutationObserver(() => {
      // Clear any pending timeout
      if (mutationTimeoutRef.current) {
        clearTimeout(mutationTimeoutRef.current);
      }

      // Debounce: wait 100ms after mutations settle before processing
      mutationTimeoutRef.current = setTimeout(() => {
        addHoverListeners();
      }, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
      if (mutationTimeoutRef.current) {
        clearTimeout(mutationTimeoutRef.current);
      }
    };
  }, [prefersReducedMotion, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  if (prefersReducedMotion || !isVisible) return null;

  return (
    <>
      {/* Triangle cursor - instant follow */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          willChange: "transform",
          transform: "translate(-100px, -100px)" // Start off-screen
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-75 ${isClicking ? "scale-90" : isHovering ? "scale-110" : "scale-100"}`}
        >
          {/* Cursor triangle with accent fill and dark border */}
          <path
            d="M5.5 3.21V20.79C5.5 21.58 6.36 22.1 7.13 21.73L12.22 19.17C12.71 18.93 13.29 18.93 13.78 19.17L18.87 21.73C19.64 22.1 20.5 21.58 20.5 20.79V3.21C20.5 2.42 19.64 1.9 18.87 2.27L13.78 4.83C13.29 5.07 12.71 5.07 12.22 4.83L7.13 2.27C6.36 1.9 5.5 2.42 5.5 3.21Z"
            className="fill-accent/0"
          />
          {/* Simple arrow pointer cursor */}
          <path
            d="M4 4L4 19L9 14.5L12 20L14 19L11 13L17 13L4 4Z"
            className={`transition-colors duration-75 ${isHovering ? "fill-accent" : "fill-foreground"}`}
            stroke="var(--background)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Hide native cursor on desktop */}
      <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
