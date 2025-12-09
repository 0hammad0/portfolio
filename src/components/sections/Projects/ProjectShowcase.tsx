"use client";

import { useState, useEffect, memo } from "react";
import { FeaturedShowcase } from "./FeaturedShowcase";
import type { Project } from "@/types/project";

function ProjectShowcaseComponent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects?featured=true");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        // Get featured projects only, limit to 5
        const featured = data.filter((p: Project) => p.featured).slice(0, 5);
        setProjects(featured.length > 0 ? featured : data.slice(0, 4));
      } catch {
        // Silently fail - the regular Projects section will handle display
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading || projects.length === 0) return null;

  return (
    <section id="showcase" className="relative">
      <FeaturedShowcase projects={projects} />
    </section>
  );
}

// Memoize to prevent unnecessary re-renders
export const ProjectShowcase = memo(ProjectShowcaseComponent);
