"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { ParallaxText } from "@/components/animations/ParallaxText";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Rocket } from "lucide-react";
import type { Project } from "@/types/project";

function ProjectsComponent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const displayedProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden">
      {/* Background parallax text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <ParallaxText baseVelocity={40} repeat={6}>
          PROJECTS • PORTFOLIO • WORK •
        </ParallaxText>
      </div>

      <div className="section bg-background-secondary/80 backdrop-blur-sm relative">
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
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-accent bg-accent/10 rounded-full"
            >
              <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              My Recent Work
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-foreground-muted max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0"
            >
              Here are some of the projects I&apos;ve worked on. Each project represents
              unique challenges and creative solutions.
            </motion.p>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <p className="text-error mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {displayedProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>

              {/* Show More Button */}
              {projects.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                  className="text-center mt-12"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowAll(!showAll)}
                    className="group"
                  >
                    <span>{showAll ? "Show Less" : `Show All (${projects.length})`}</span>
                    <motion.span
                      animate={{ rotate: showAll ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-2 inline-block"
                    >
                      ↓
                    </motion.span>
                  </Button>
                </motion.div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-background-tertiary flex items-center justify-center">
                <Rocket className="h-10 w-10 text-foreground-muted" />
              </div>
              <p className="text-foreground-muted text-lg">No projects found yet.</p>
              <p className="text-foreground-muted text-sm mt-2">Check back soon!</p>
            </motion.div>
          )}
        </Container>
      </div>
    </section>
  );
}

// Memoize to prevent unnecessary re-renders
export const Projects = memo(ProjectsComponent);
