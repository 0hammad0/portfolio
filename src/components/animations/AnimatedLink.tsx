"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

type UnderlineVariant = "slide" | "grow" | "glow" | "gradient";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: UnderlineVariant;
  external?: boolean;
  onClick?: () => void;
}

export function AnimatedLink({
  href,
  children,
  className,
  variant = "slide",
  external = false,
  onClick,
}: AnimatedLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const baseClasses = "relative inline-block group";

  const getUnderlineClasses = () => {
    const base = "absolute bottom-0 left-0 h-[2px] w-full";

    switch (variant) {
      case "slide":
        return cn(base, "bg-accent origin-right group-hover:origin-left");
      case "grow":
        return cn(base, "bg-accent origin-center");
      case "glow":
        return cn(base, "bg-accent shadow-[0_0_10px_var(--accent)] origin-right group-hover:origin-left");
      case "gradient":
        return cn(base, "bg-gradient-to-r from-accent via-accent-light to-accent origin-right group-hover:origin-left");
      default:
        return cn(base, "bg-accent");
    }
  };

  if (prefersReducedMotion) {
    if (external) {
      return (
        <a
          href={href}
          className={cn("hover:text-accent transition-colors", className)}
          onClick={onClick}
          {...linkProps}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={cn("hover:text-accent transition-colors", className)}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  const content = (
    <>
      <span className="relative z-10 group-hover:text-accent transition-colors duration-300">
        {children}
      </span>

      {/* Underline animation */}
      <motion.span
        className={getUnderlineClasses()}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={cn(baseClasses, className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(baseClasses, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {content}
    </Link>
  );
}

// Character-by-character link animation
export function AnimatedLinkChars({
  href,
  children,
  className,
  external = false,
  onClick,
}: Omit<AnimatedLinkProps, "variant">) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const text = typeof children === "string" ? children : "";
  const chars = text.split("");

  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  if (prefersReducedMotion || !text) {
    const Component = external ? "a" : Link;
    return (
      <Component
        href={href}
        className={cn("hover:text-accent transition-colors", className)}
        onClick={onClick}
        {...linkProps}
      >
        {children}
      </Component>
    );
  }

  const Component = external ? "a" : Link;

  return (
    <Component
      href={href}
      className={cn("relative inline-flex overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...linkProps}
    >
      {/* Original text */}
      <span className="inline-flex">
        {chars.map((char, i) => (
          <motion.span
            key={`original-${i}`}
            className="inline-block"
            animate={{
              y: isHovered ? "-100%" : "0%",
            }}
            transition={{
              duration: 0.3,
              delay: i * 0.02,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>

      {/* Duplicate text */}
      <span className="absolute top-0 left-0 inline-flex text-accent">
        {chars.map((char, i) => (
          <motion.span
            key={`duplicate-${i}`}
            className="inline-block"
            animate={{
              y: isHovered ? "0%" : "100%",
            }}
            transition={{
              duration: 0.3,
              delay: i * 0.02,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </Component>
  );
}
