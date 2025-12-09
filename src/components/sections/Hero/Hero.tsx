"use client";

import { useRef, useEffect, useState, useCallback, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/constants/siteConfig";
import { Download, Mail, Sparkles } from "lucide-react";
import { AnimatedGradientText } from "@/components/ui/AnimatedGradientText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

// Lazy load background
const HeroBackground = dynamic(
  () => import("./HeroBackground").then((mod) => ({ default: mod.HeroBackground })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
    ),
  }
);

// Lazy load draggable elements
const DraggableElements = dynamic(
  () => import("./DraggableElements").then((mod) => ({ default: mod.DraggableElements })),
  { ssr: false }
);

const roles = [
  "Full-Stack Developer",
  "React Specialist",
  "TypeScript Enthusiast",
  "Problem Solver",
];

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // GSAP scroll-based parallax
  useEffect(() => {
    if (prefersReducedMotion || !heroContentRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect on scroll
      gsap.to(heroContentRef.current, {
        y: 200,
        opacity: 0,
        scale: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Initial animation timeline
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Badge animation
      tl.from(".hero-badge", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Buttons animation
      tl.from(
        ".hero-buttons > *",
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Bio animation
      tl.from(
        ".hero-bio",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      );

      // Scroll indicator
      tl.from(
        ".scroll-indicator",
        {
          opacity: 0,
          y: -20,
          duration: 0.6,
        },
        "-=0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <HeroBackground />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Content */}
      <div ref={heroContentRef} className="relative z-10 w-full">
        <Container>
          <div className="max-w-5xl mx-auto text-center">
            {/* Greeting Badge */}
            <div className="hero-badge inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-8 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
              <span className="text-accent font-medium text-xs sm:text-sm">Available for work</span>
            </div>

            {/* Name */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
              <AnimatedGradientText
                colors={["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4"]}
                animationSpeed={4}
              >
                {siteConfig.author.name}
              </AnimatedGradientText>
            </h1>

            {/* Animated subtitle */}
            <div className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground-muted mb-6 sm:mb-8 h-[1.5em] overflow-hidden">
              <TypingEffect texts={roles} />
            </div>

            {/* Bio */}
            <p className="hero-bio text-foreground-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
              {siteConfig.author.bio}
            </p>

            {/* CTA Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <MagneticButton
                onClick={() => scrollToSection("contact")}
                data-cursor="Contact"
              >
                <span className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium",
                  "bg-accent text-white rounded-lg sm:rounded-xl",
                  "transition-all duration-300",
                  "shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40",
                  "hover:scale-105 active:scale-95",
                  "min-h-[44px] sm:min-h-[48px]"
                )}>
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  Get In Touch
                </span>
              </MagneticButton>

              <MagneticButton data-cursor="Download">
                <span className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium",
                  "border-2 border-accent/50 text-accent rounded-lg sm:rounded-xl",
                  "transition-all duration-300",
                  "hover:bg-accent/10 hover:border-accent",
                  "backdrop-blur-sm active:scale-95",
                  "min-h-[44px] sm:min-h-[48px]"
                )}>
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  Download CV
                </span>
              </MagneticButton>
            </div>
          </div>
        </Container>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => scrollToSection("about")}
          className="flex flex-col items-center gap-2 text-foreground-muted hover:text-accent transition-colors cursor-pointer group"
          aria-label="Scroll down"
        >
          <span className="text-sm font-medium">Scroll</span>
          <div className="relative w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
            <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
          </div>
        </button>
      </div>

      {/* Floating shapes */}
      <FloatingShapes />

      {/* Draggable floating elements */}
      <DraggableElements />
    </section>
  );
}

// Magnetic Button Component
function MagneticButton({
  children,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  [key: string]: unknown;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !buttonRef.current) return;

    const button = buttonRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <button ref={buttonRef} onClick={onClick} className="cursor-pointer" {...props}>
      {children}
    </button>
  );
}

// Typing Effect Component
function TypingEffect({ texts }: { texts: string[] }) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentText(texts[0]);
      return;
    }

    const text = texts[currentIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(text.substring(0, currentText.length + 1));
          if (currentText.length === text.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setCurrentText(text.substring(0, currentText.length - 1));
          if (currentText.length === 0) {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 30 : 80
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts, prefersReducedMotion]);

  return (
    <span className="inline-flex items-center">
      <span className="text-accent">{currentText}</span>
      <span className="w-[3px] h-[1em] bg-accent ml-1 animate-pulse" />
    </span>
  );
}

// Floating Shapes Component
function FloatingShapes() {
  const prefersReducedMotion = useReducedMotion();
  const shapesRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Pause animations when not in viewport
  useEffect(() => {
    if (!shapesRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(shapesRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !shapesRef.current || !isVisible) return;

    const shapes = shapesRef.current.querySelectorAll(".floating-shape");
    const animations: gsap.core.Tween[] = [];

    shapes.forEach((shape, i) => {
      const tween = gsap.to(shape, {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5,
      });
      animations.push(tween);
    });

    // Cleanup: kill all animations
    return () => {
      animations.forEach(tween => tween.kill());
    };
  }, [prefersReducedMotion, isVisible]);

  if (prefersReducedMotion) return null;

  return (
    <div ref={shapesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="floating-shape absolute top-1/4 left-[10%] w-64 h-64 rounded-full bg-accent/5 blur-3xl" style={{ willChange: isVisible ? "transform" : "auto" }} />
      <div className="floating-shape absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full bg-accent/5 blur-3xl" style={{ willChange: isVisible ? "transform" : "auto" }} />
      <div className="floating-shape absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/3 blur-3xl" style={{ willChange: isVisible ? "transform" : "auto" }} />
    </div>
  );
}
