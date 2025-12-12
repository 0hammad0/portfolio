"use client";

import { useRef, useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import type { Project } from "@/types/project";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedShowcaseProps {
  projects: Project[];
  className?: string;
}

function FeaturedShowcaseComponent({ projects, className }: FeaturedShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !horizontalRef.current) return;

    let ctx: gsap.Context | null = null;

    // Small delay to ensure page transition is complete and layout is stable
    const initTimeout = setTimeout(() => {
      if (!containerRef.current || !horizontalRef.current) return;

      const container = containerRef.current;
      const horizontal = horizontalRef.current;
      const cards = horizontal.querySelectorAll(".showcase-card");
      const scrollWidth = horizontal.scrollWidth - container.offsetWidth;

      ctx = gsap.context(() => {
        // Horizontal scroll animation
        const scrollTween = gsap.to(horizontal, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const newIndex = Math.min(
                Math.floor(progress * projects.length),
                projects.length - 1
              );
              if (newIndex !== lastIndexRef.current) {
                lastIndexRef.current = newIndex;
                setActiveIndex(newIndex);
              }
            },
          },
        });

        // Card animations
        cards.forEach((card) => {
          const image = card.querySelector(".card-image");
          const content = card.querySelector(".card-content");

          if (image) {
            gsap.to(image, {
              xPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: 2,
              },
            });
          }

          if (content?.children?.length) {
            gsap.from(content.children, {
              y: 40,
              opacity: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left 75%",
                toggleActions: "play none none reverse",
              },
            });
          }
        });

        // Progress indicator
        const progressBar = container.querySelector(".progress-bar-fill");
        if (progressBar) {
          gsap.to(progressBar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: () => `+=${scrollWidth}`,
              scrub: 1.5,
            },
          });
        }
      }, container);
    }, 150); // Delay for page transition

    return () => {
      clearTimeout(initTimeout);
      if (ctx) ctx.revert();
    };
  }, [prefersReducedMotion, projects.length]);

  if (projects.length === 0) return null;

  if (prefersReducedMotion) {
    return (
      <div className={cn("py-20", className)}>
        <div className="flex gap-8 overflow-x-auto pb-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="flex-shrink-0 w-[80vw] max-w-2xl bg-background-secondary rounded-2xl overflow-hidden"
            >
              <div className="aspect-video bg-background-tertiary" />
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-foreground-muted">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative h-screen overflow-hidden", className)}>
      {/* Fixed Header */}
      <div className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-foreground-muted mb-1">
            Featured Work
          </h2>
          <div className="text-6xl font-bold text-gradient">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="text-foreground-muted text-2xl ml-2">
              / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:block w-48">
          <div className="progress-bar h-1 bg-border rounded-full overflow-hidden">
            <div
              className="progress-bar-fill h-full bg-accent origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <p className="text-xs text-foreground-muted mt-2 text-right">Scroll to explore</p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={horizontalRef}
        className="absolute top-0 left-0 h-full flex items-center gap-8 pl-8 will-change-transform"
        style={{ paddingRight: "50vw" }}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="showcase-card relative flex-shrink-0 w-[85vw] max-w-5xl h-[70vh] flex items-center"
          >
            {/* Large Number Background */}
            <div className="card-number absolute -left-4 top-1/2 -translate-y-1/2 text-[20rem] font-black text-accent/5 select-none pointer-events-none leading-none">
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Card */}
            <div className="relative w-full h-full bg-background-secondary rounded-3xl overflow-hidden flex flex-col md:flex-row">
              {/* Image Side */}
              <div className="relative w-full md:w-3/5 h-1/2 md:h-full overflow-hidden">
                <div className="card-image absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent">
                  {project.imageUrl && (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 85vw"
                      priority={index === 0}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-background-secondary/80 via-transparent to-transparent" />
                </div>

                {/* Tech Pills on Image */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Side */}
              <div className="card-content w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-accent text-sm font-medium uppercase tracking-wider mb-4">
                  {project.featured ? "Featured Project" : `Project ${index + 1}`}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h3>
                <p className="text-foreground-muted text-lg mb-8 line-clamp-4">
                  {project.longDescription || project.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors cursor-pointer"
                    >
                      <span>View Live</span>
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-medium hover:border-accent hover:text-accent transition-colors cursor-pointer"
                    >
                      <Github className="h-4 w-4" />
                      <span>Source</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* End Card - CTA */}
        <div className="showcase-card relative flex-shrink-0 w-[60vw] max-w-2xl h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              Want to see more?
            </h3>
            <p className="text-foreground-muted text-lg mb-8 max-w-md mx-auto">
              Explore all my projects and discover the full range of my work.
            </p>
            <button className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors cursor-pointer">
              <span>View All Projects</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-foreground-muted">
        <div className="w-12 h-6 border border-current rounded-full flex items-center justify-start p-1">
          <div className="w-3 h-3 bg-accent rounded-full animate-[scrollHint_2s_ease-in-out_infinite]" />
        </div>
        <span className="text-sm">Scroll horizontally</span>
      </div>

      <style jsx>{`
        @keyframes scrollHint {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
      `}</style>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const FeaturedShowcase = memo(FeaturedShowcaseComponent);
