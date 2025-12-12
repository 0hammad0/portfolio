"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Reduced tilt angle to prevent text blur
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        style={
          prefersReducedMotion
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        className="group relative h-full"
      >
        {/* Glow effect on hover */}
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-accent via-accent/50 to-accent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

        {/* Card */}
        <div
          className={cn(
            "relative overflow-hidden rounded-xl h-full flex flex-col",
            "bg-background-secondary border border-border",
            "transition-all duration-500",
            "group-hover:border-accent/30"
          )}
        >
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-background-tertiary">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/60 to-transparent flex items-end justify-center pb-8 gap-4"
            >
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-full text-accent cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View on GitHub"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
              )}
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-full text-accent cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View live demo"
                >
                  <ExternalLink className="h-5 w-5" />
                </motion.a>
              )}
            </motion.div>

            {/* Featured badge */}
            {project.featured && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-3 right-3"
              >
                <Badge variant="accent" size="sm" className="shadow-lg">
                  Featured
                </Badge>
              </motion.div>
            )}

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
              <div className="absolute -inset-full top-0 w-3/4 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-shine" />
            </div>

            {/* Fallback gradient if no image */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background-tertiary -z-10" />
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-semibold group-hover:text-accent transition-colors duration-300">
                {project.title}
              </h3>
              <ArrowUpRight className="h-5 w-5 text-foreground-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </div>

            <p className="text-foreground-muted text-sm mb-4 flex-1 line-clamp-2">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Badge variant="outline" size="sm">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="outline" size="sm">
                  +{project.technologies.length - 4}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              {project.liveUrl && (
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  rightIcon={<ExternalLink className="h-4 w-4" />}
                  onClick={() => window.open(project.liveUrl, "_blank")}
                >
                  Live Demo
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  rightIcon={<Github className="h-4 w-4" />}
                  onClick={() => window.open(project.githubUrl, "_blank")}
                >
                  Code
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
