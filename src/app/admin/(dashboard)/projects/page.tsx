import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils/cn";
import { Plus, MoreHorizontal, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { ProjectsTable } from "@/components/admin/projects/ProjectsTable";

async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return projects.map((project) => ({
    ...project,
    technologies: JSON.parse(project.technologies) as string[],
  }));
}

function ProjectsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-background-secondary rounded-lg mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-background-secondary rounded-lg mb-2" />
      ))}
    </div>
  );
}

async function ProjectsContent() {
  const projects = await getProjects();

  return <ProjectsTable projects={projects} />;
}

export default function AdminProjectsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-foreground-muted mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-accent text-white font-medium",
            "hover:bg-accent-hover transition-colors"
          )}
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Content */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}
