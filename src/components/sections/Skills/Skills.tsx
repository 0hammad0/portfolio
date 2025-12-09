"use client";

import { useRef, useEffect, memo } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { ParallaxText } from "@/components/animations/ParallaxText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

// Skill categories with icons
const skillCategories = [
  {
    title: "Frontend",
    icon: "🎨",
    gradient: "from-cyan-500 to-blue-500",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 80 },
    ],
  },
  {
    title: "Backend",
    icon: "⚙️",
    gradient: "from-green-500 to-emerald-500",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "Prisma", level: 85 },
      { name: "REST APIs", level: 90 },
    ],
  },
  {
    title: "Tools & DevOps",
    icon: "🛠️",
    gradient: "from-orange-500 to-red-500",
    skills: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 75 },
      { name: "AWS", level: 70 },
      { name: "Figma", level: 75 },
      { name: "Testing", level: 80 },
    ],
  },
];

// Technology icons with colors
const techStack = [
  { name: "React", color: "#61DAFB", letter: "R" },
  { name: "Next.js", color: "#ffffff", letter: "N", dark: true },
  { name: "TypeScript", color: "#3178C6", letter: "TS" },
  { name: "Node.js", color: "#339933", letter: "N" },
  { name: "PostgreSQL", color: "#4169E1", letter: "PG" },
  { name: "Tailwind", color: "#06B6D4", letter: "TW" },
  { name: "Prisma", color: "#5A67D8", letter: "P" },
  { name: "Git", color: "#F05032", letter: "G" },
];

// Animated skill bar with progress animation
function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-y-2 group"
    >
      <div className="flex justify-between text-sm">
        <span className="font-medium group-hover:text-accent transition-colors">{name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="text-foreground-muted tabular-nums"
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-2 bg-background-tertiary rounded-full overflow-hidden relative">
        {/* Animated fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full relative"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_2s_ease-in-out_infinite]" />
        </motion.div>
        {/* Glow indicator at end */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/50"
          initial={{ left: "0%", opacity: 0 }}
          animate={isInView ? { left: `${level}%`, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginLeft: "-6px" }}
        />
      </div>
    </motion.div>
  );
}

// Tech icon with hover effects
function TechIcon({ tech, index }: { tech: typeof techStack[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={prefersReducedMotion ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group"
    >
      <div
        className={cn(
          "relative flex flex-col items-center gap-1.5 sm:gap-3 p-2 sm:p-5 rounded-lg sm:rounded-xl cursor-default",
          "bg-background-secondary border border-border",
          "hover:border-accent/50 transition-all duration-300",
          "hover:shadow-lg hover:shadow-accent/10"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Icon background glow */}
        <div
          className="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
          style={{ backgroundColor: tech.color }}
        />

        {/* Icon */}
        <motion.div
          className={cn(
            "relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg",
            tech.dark ? "text-background" : "text-white"
          )}
          style={{
            backgroundColor: tech.color,
            transform: "translateZ(30px)",
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {tech.letter}
        </motion.div>

        {/* Name */}
        <span
          className="text-[10px] sm:text-sm font-medium text-foreground-muted group-hover:text-foreground transition-colors text-center"
          style={{ transform: "translateZ(20px)" }}
        >
          {tech.name}
        </span>
      </div>
    </motion.div>
  );
}

// Skill category card
function SkillCard({ category, index }: { category: typeof skillCategories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        className={cn(
          "relative h-full p-4 sm:p-6 rounded-lg sm:rounded-xl overflow-hidden",
          "bg-background-secondary border border-border",
          "hover:border-accent/30 transition-all duration-500",
          "skill-card"
        )}
      >
        {/* Background gradient on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500",
          `bg-gradient-to-br ${category.gradient}`
        )} />

        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <motion.span
            className="text-2xl sm:text-3xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {category.icon}
          </motion.span>
          <h3 className="text-lg sm:text-xl font-semibold text-accent">
            {category.title}
          </h3>
        </div>

        {/* Skills */}
        <div className="space-y-3 sm:space-y-4">
          {category.skills.map((skill, i) => (
            <SkillBar key={skill.name} name={skill.name} level={skill.level} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SkillsComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const techGridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  // GSAP stagger animation for tech icons
  useEffect(() => {
    if (prefersReducedMotion || !techGridRef.current) return;

    const icons = techGridRef.current.querySelectorAll(".tech-icon");

    const ctx = gsap.context(() => {
      gsap.from(icons, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        stagger: {
          amount: 0.6,
          from: "random",
        },
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: techGridRef.current,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="skills" className="relative overflow-hidden">
      {/* Background parallax text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <ParallaxText baseVelocity={-30} repeat={6}>
          SKILLS • TECHNOLOGIES • EXPERTISE •
        </ParallaxText>
      </div>

      <div className="section relative">
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
              My Expertise
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Skills & <span className="text-gradient">Technologies</span>
            </h2>
          </motion.div>

          {/* Tech Stack Icons */}
          <div ref={techGridRef} className="grid grid-cols-4 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 mb-10 sm:mb-12 md:mb-16">
            {techStack.map((tech, index) => (
              <div key={tech.name} className="tech-icon">
                <TechIcon tech={tech} index={index} />
              </div>
            ))}
          </div>

          {/* Skill Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {skillCategories.map((category, index) => (
              <SkillCard key={category.title} category={category} index={index} />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

// Memoize to prevent unnecessary re-renders
export const Skills = memo(SkillsComponent);
