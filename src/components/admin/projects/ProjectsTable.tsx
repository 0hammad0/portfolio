"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  GripVertical,
  Star,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteProject, toggleProjectFeatured, updateProjectStatus } from "../actions/project-actions";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  featured: boolean;
  status: string;
  order: number;
  liveUrl: string | null;
  githubUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    startTransition(async () => {
      const result = await deleteProject(id);
      if (result.success) {
        toast.success("Project deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete project");
      }
    });
  };

  const handleToggleFeatured = async (id: string) => {
    startTransition(async () => {
      const result = await toggleProjectFeatured(id);
      if (result.success) {
        toast.success(result.featured ? "Project featured" : "Project unfeatured");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update project");
      }
    });
  };

  const handleStatusChange = async (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateProjectStatus(id, status);
      if (result.success) {
        toast.success(`Project ${status.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update project");
      }
    });
    setOpenMenuId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500/10 text-green-500";
      case "DRAFT":
        return "bg-yellow-500/10 text-yellow-500";
      case "ARCHIVED":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-muted mb-4">No projects yet</p>
        <Link
          href="/admin/projects/new"
          className="text-accent hover:underline"
        >
          Create your first project
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-xl border border-border overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-background-tertiary text-sm font-medium text-foreground-muted border-b border-border">
        <div className="col-span-1"></div>
        <div className="col-span-4">Project</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3">Technologies</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {projects.map((project) => (
          <div
            key={project.id}
            className={cn(
              "grid grid-cols-12 gap-4 px-6 py-4 items-center",
              "hover:bg-background-tertiary/50 transition-colors",
              isPending && "opacity-50"
            )}
          >
            {/* Drag Handle & Featured */}
            <div className="col-span-1 flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-foreground-muted cursor-grab" />
              <button
                onClick={() => handleToggleFeatured(project.id)}
                className={cn(
                  "p-1 rounded transition-colors",
                  project.featured
                    ? "text-yellow-500 hover:text-yellow-400"
                    : "text-foreground-muted hover:text-yellow-500"
                )}
                title={project.featured ? "Remove from featured" : "Add to featured"}
              >
                <Star
                  className="w-4 h-4"
                  fill={project.featured ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Project Info */}
            <div className="col-span-4">
              <Link
                href={`/admin/projects/${project.id}`}
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                {project.title}
              </Link>
              <p className="text-sm text-foreground-muted truncate mt-0.5">
                {project.description}
              </p>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span
                className={cn(
                  "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                  getStatusColor(project.status)
                )}
              >
                {project.status.toLowerCase()}
              </span>
            </div>

            {/* Technologies */}
            <div className="col-span-3">
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs bg-background rounded-md text-foreground-muted"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-0.5 text-xs bg-background rounded-md text-foreground-muted">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center justify-end gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                  title="View live"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Link
                href={`/admin/projects/${project.id}`}
                className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Link>

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === project.id ? null : project.id)
                  }
                  className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {openMenuId === project.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-background-secondary border border-border rounded-lg shadow-lg z-50">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </Link>
                      {project.status !== "PUBLISHED" && (
                        <button
                          onClick={() => handleStatusChange(project.id, "PUBLISHED")}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Publish</span>
                        </button>
                      )}
                      {project.status !== "ARCHIVED" && (
                        <button
                          onClick={() => handleStatusChange(project.id, "ARCHIVED")}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                        >
                          <Archive className="w-4 h-4" />
                          <span>Archive</span>
                        </button>
                      )}
                      <hr className="my-1 border-border" />
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-background-tertiary transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
