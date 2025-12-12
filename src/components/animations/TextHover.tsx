"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface TextHoverProps {
  children: string;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function TextHover({ children, className, href, onClick }: TextHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const letters = children.split("");

  if (prefersReducedMotion) {
    if (href) {
      return (
        <a href={href} className={cn("hover:text-accent transition-colors cursor-pointer", className)}>
          {children}
        </a>
      );
    }
    return (
      <span onClick={onClick} className={cn("hover:text-accent transition-colors", onClick && "cursor-pointer", className)}>
        {children}
      </span>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative inline-block overflow-hidden cursor-pointer",
          className
        )}
        style={{ lineHeight: 1.2 }}
      >
        <TextHoverContent letters={letters} isHovered={isHovered} />
      </motion.a>
    );
  }

  return (
    <motion.span
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-block overflow-hidden cursor-pointer",
        className
      )}
      style={{ lineHeight: 1.2 }}
    >
      <TextHoverContent letters={letters} isHovered={isHovered} />
    </motion.span>
  );
}

function TextHoverContent({ letters, isHovered }: { letters: string[]; isHovered: boolean }) {
  return (
    <>
      {/* Original text (slides up on hover) */}
      <span className="inline-flex">
        {letters.map((letter, i) => (
          <motion.span
            key={`original-${i}`}
            className="inline-block"
            animate={{
              y: isHovered ? "-100%" : "0%",
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.02,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>

      {/* Duplicate text (slides in from below) */}
      <span className="absolute top-0 left-0 inline-flex text-accent">
        {letters.map((letter, i) => (
          <motion.span
            key={`duplicate-${i}`}
            className="inline-block"
            animate={{
              y: isHovered ? "0%" : "100%",
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.02,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>
    </>
  );
}

// Scatter effect - characters scatter on hover
export function TextHoverScatter({ children, className, href, onClick }: TextHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const letters = children.split("");

  // Generate random scatter values for each letter - memoized to prevent regeneration
  const scatterValues = useMemo(() =>
    letters.map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      rotate: (Math.random() - 0.5) * 30,
    })),
    [letters.length]
  );

  if (prefersReducedMotion) {
    if (href) {
      return (
        <a href={href} className={cn("hover:text-accent transition-colors cursor-pointer", className)}>
          {children}
        </a>
      );
    }
    return (
      <span onClick={onClick} className={cn("hover:text-accent transition-colors", onClick && "cursor-pointer", className)}>
        {children}
      </span>
    );
  }

  const content = (
    <span className="inline-flex">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={{
            x: isHovered ? scatterValues[i].x : 0,
            y: isHovered ? scatterValues[i].y : 0,
            rotate: isHovered ? scatterValues[i].rotate : 0,
            opacity: isHovered ? 0 : 1,
          }}
          transition={{
            duration: 0.4,
            delay: i * 0.02,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn("relative inline-block cursor-pointer", className)}
      >
        {content}
        {/* Reassembled text */}
        <motion.span
          className="absolute inset-0 inline-flex text-accent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, delay: isHovered ? 0.2 : 0 }}
        >
          {children}
        </motion.span>
      </motion.a>
    );
  }

  return (
    <motion.span
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative inline-block", onClick && "cursor-pointer", className)}
    >
      {content}
      {/* Reassembled text */}
      <motion.span
        className="absolute inset-0 inline-flex text-accent"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, delay: isHovered ? 0.2 : 0 }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

// Wave effect - characters wave on hover
export function TextHoverWave({ children, className, href, onClick }: TextHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const letters = children.split("");

  if (prefersReducedMotion) {
    if (href) {
      return (
        <a href={href} className={cn("hover:text-accent transition-colors cursor-pointer", className)}>
          {children}
        </a>
      );
    }
    return (
      <span onClick={onClick} className={cn("hover:text-accent transition-colors", onClick && "cursor-pointer", className)}>
        {children}
      </span>
    );
  }

  const content = (
    <span className="inline-flex">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={{
            y: isHovered ? [0, -8, 0] : 0,
            color: isHovered ? "var(--accent)" : "inherit",
          }}
          transition={{
            y: {
              duration: 0.4,
              delay: i * 0.03,
              ease: "easeInOut",
              repeat: isHovered ? Infinity : 0,
              repeatDelay: letters.length * 0.03,
            },
            color: {
              duration: 0.2,
              delay: i * 0.02,
            },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn("relative inline-block cursor-pointer", className)}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.span
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative inline-block", onClick && "cursor-pointer", className)}
    >
      {content}
    </motion.span>
  );
}

// Simpler underline animation variant
export function TextHoverUnderline({ children, className, href, onClick }: TextHoverProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    if (href) {
      return (
        <a href={href} className={cn("hover:text-accent transition-colors cursor-pointer", className)}>
          {children}
        </a>
      );
    }
    return (
      <span onClick={onClick} className={cn("hover:text-accent transition-colors", onClick && "cursor-pointer", className)}>
        {children}
      </span>
    );
  }

  const content = (
    <>
      <span className="relative z-10 group-hover:text-accent transition-colors duration-300">
        {children}
      </span>
      {/* Animated underline */}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Glow effect */}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-[2px] bg-accent blur-sm origin-left"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={cn(
          "relative inline-block group cursor-pointer",
          className
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.span
      onClick={onClick}
      className={cn(
        "relative inline-block group cursor-pointer",
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.span>
  );
}
