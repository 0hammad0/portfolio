"use client";

import { useRef, useEffect, memo } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { ParallaxText } from "@/components/animations/ParallaxText";
import { siteConfig } from "@/lib/constants/siteConfig";
import { MapPin, Briefcase, Code2, Users } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Years Experience", value: 5, suffix: "+", icon: Briefcase },
  { label: "Projects Completed", value: 50, suffix: "+", icon: Code2 },
  { label: "Happy Clients", value: 30, suffix: "+", icon: Users },
];

function AboutComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  // GSAP parallax effect for image
  useEffect(() => {
    if (prefersReducedMotion || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden">
      {/* Background parallax text - scrolling behind content */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none overflow-hidden z-0">
        <ParallaxText baseVelocity={-80} repeat={8} className="opacity-[0.03]">
          DEVELOPER • CREATIVE • FULL-STACK •
        </ParallaxText>
        <ParallaxText baseVelocity={60} repeat={8} className="opacity-[0.03]">
          ABOUT ME • REACT • NEXT.JS • NODE.JS •
        </ParallaxText>
        <ParallaxText baseVelocity={-40} repeat={8} className="opacity-[0.03]">
          TYPESCRIPT • WEB DEVELOPER • UI/UX •
        </ParallaxText>
      </div>

      <div className="section bg-background-secondary/50 backdrop-blur-sm relative z-10">
        <Container>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-accent bg-accent/10 rounded-full"
            >
              Get To Know
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              About <span className="text-gradient">Me</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Image with 3D effect */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mx-auto lg:mx-0 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-md"
              style={{ perspective: "1000px" }}
            >
              <div ref={imageRef} className="relative aspect-square">
                {/* Animated background decorations */}
                <motion.div
                  className="absolute inset-4 bg-accent/20 rounded-2xl"
                  animate={{
                    rotate: [6, 8, 6],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-4 bg-accent/10 rounded-2xl"
                  animate={{
                    rotate: [-3, -5, -3],
                    scale: [1, 0.98, 1],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Glowing border effect */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-accent via-transparent to-accent rounded-2xl opacity-50 blur-sm" />

                {/* Image container */}
                <div className="relative h-full rounded-2xl overflow-hidden border-2 border-accent/30 bg-background-tertiary">
                  <Image
                    src="/images/profile/placeholder.jpg"
                    alt={siteConfig.author.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-background/90 backdrop-blur-md rounded-xl border border-border"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Available for work</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              ref={contentRef}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="flex items-center gap-2 text-foreground-muted">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{siteConfig.author.location}</span>
              </motion.div>

              <motion.h3 variants={itemVariants} className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
                A passionate developer who loves building{" "}
                <span className="text-accent">things for the web</span>
              </motion.h3>

              <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4 text-foreground-muted leading-relaxed text-sm sm:text-base">
                <p>
                  I&apos;m a full-stack developer with a passion for creating beautiful,
                  functional, and user-centered digital experiences. With years of
                  experience in web development, I bring ideas to life using modern
                  technologies and best practices.
                </p>
                <p>
                  My journey in tech started with curiosity about how things work on the
                  internet. Today, I specialize in building scalable web applications
                  using React, Next.js, Node.js, and various other technologies.
                </p>
              </motion.div>

              {/* Stats with animated counters */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={cn(
                        "relative text-center p-2 sm:p-4 rounded-lg sm:rounded-xl overflow-hidden cursor-default",
                        "bg-background border border-border",
                        "hover:border-accent/50 transition-colors duration-300",
                        "group"
                      )}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-accent mx-auto mb-1 sm:mb-2 relative z-10" />
                      <div className="text-lg sm:text-2xl md:text-3xl font-bold text-accent relative z-10">
                        <AnimatedCounter
                          value={stat.value}
                          suffix={stat.suffix}
                          duration={2 + index * 0.3}
                        />
                      </div>
                      <div className="text-[10px] sm:text-xs text-foreground-muted relative z-10 leading-tight">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}

// Memoize to prevent unnecessary re-renders
export const About = memo(AboutComponent);
