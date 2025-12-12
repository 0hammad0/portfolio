"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DraggableItem {
  id: string;
  label: string;
  color: "green" | "orange" | "purple" | "blue" | "pink" | "cyan";
  position: { x: string; y: string };
  rotation?: number;
  floatDelay?: number;
}

const draggableItems: DraggableItem[] = [
  { id: "1", label: "React", color: "cyan", position: { x: "8%", y: "20%" }, rotation: -8, floatDelay: 0 },
  { id: "2", label: "TypeScript", color: "blue", position: { x: "85%", y: "25%" }, rotation: 6, floatDelay: 0.5 },
  { id: "3", label: "Next.js", color: "purple", position: { x: "5%", y: "65%" }, rotation: 5, floatDelay: 1 },
  { id: "4", label: "Open for Work", color: "green", position: { x: "80%", y: "15%" }, rotation: -4, floatDelay: 1.5 },
  { id: "5", label: "Full-Stack", color: "orange", position: { x: "12%", y: "80%" }, rotation: -6, floatDelay: 2 },
  { id: "6", label: "Creative", color: "pink", position: { x: "82%", y: "70%" }, rotation: 8, floatDelay: 0.3 },
  { id: "7", label: "Node.js", color: "green", position: { x: "75%", y: "45%" }, rotation: -3, floatDelay: 0.8 },
  { id: "8", label: "UI/UX", color: "purple", position: { x: "15%", y: "40%" }, rotation: 4, floatDelay: 1.2 },
];

const colorClasses: Record<string, string> = {
  green: "bg-emerald-500 text-white shadow-emerald-500/40 hover:shadow-emerald-500/60",
  orange: "bg-orange-500 text-white shadow-orange-500/40 hover:shadow-orange-500/60",
  purple: "bg-violet-500 text-white shadow-violet-500/40 hover:shadow-violet-500/60",
  blue: "bg-blue-500 text-white shadow-blue-500/40 hover:shadow-blue-500/60",
  pink: "bg-pink-500 text-white shadow-pink-500/40 hover:shadow-pink-500/60",
  cyan: "bg-cyan-500 text-white shadow-cyan-500/40 hover:shadow-cyan-500/60",
};

function DraggableTag({ item, containerRef }: { item: DraggableItem; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Use motion values for drag - these bypass React state and work instantly
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragStart = () => {
    setHasBeenDragged(true);
  };

  // Floating animation - only when hasn't been dragged yet
  const shouldFloat = !hasBeenDragged && !prefersReducedMotion;

  return (
    // Outer wrapper for CSS float animation (doesn't interfere with drag)
    <div
      className={`absolute ${shouldFloat ? "animate-float" : ""}`}
      style={{
        left: item.position.x,
        top: item.position.y,
        animationDelay: shouldFloat ? `${(item.floatDelay || 0) * 1000}ms` : undefined,
      }}
    >
      {/* Inner motion.div for Framer Motion drag */}
      <motion.div
        drag={!prefersReducedMotion}
        dragConstraints={containerRef}
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={handleDragStart}
        style={{ x, y }}
        initial={{
          opacity: 0,
          scale: 0,
          rotate: item.rotation || 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: item.rotation || 0,
        }}
        whileHover={{
          scale: 1.15,
          rotate: 0,
          zIndex: 50,
          transition: { duration: 0.2 },
        }}
        whileDrag={{
          scale: 1.2,
          rotate: 0,
          zIndex: 100,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
        transition={{
          opacity: { delay: item.floatDelay || 0, duration: 0.5 },
          scale: { delay: item.floatDelay || 0, duration: 0.5 },
        }}
        className={`
          px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold
          cursor-grab active:cursor-grabbing select-none pointer-events-auto
          shadow-lg hover:shadow-xl transition-shadow duration-300
          backdrop-blur-sm
          ${colorClasses[item.color]}
        `}
      >
        {item.label}
      </motion.div>
    </div>
  );
}

export function DraggableElements() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render on server or for reduced motion preference
  if (!isMounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
    >
      {/* Individual tags have pointer-events via cursor-grab class */}
      <div className="relative w-full h-full pointer-events-none">
        {draggableItems.map((item) => (
          <DraggableTag key={item.id} item={item} containerRef={containerRef} />
        ))}
      </div>
    </div>
  );
}
