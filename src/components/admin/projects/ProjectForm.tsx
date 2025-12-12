"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  X,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { createProject, updateProject } from "../actions/project-actions";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  imageUrl: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!project;

  // Form state
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [longDescription, setLongDescription] = useState(
    project?.longDescription || ""
  );
  const [imageUrl, setImageUrl] = useState(project?.imageUrl || "");
  const [technologies, setTechnologies] = useState<string[]>(
    project?.technologies || []
  );
  const [techInput, setTechInput] = useState("");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || "");
  const [featured, setFeatured] = useState(project?.featured || false);
  const [status, setStatus] = useState(project?.status || "DRAFT");
  const [seoTitle, setSeoTitle] = useState(project?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(
    project?.seoDescription || ""
  );

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTech();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!imageUrl.trim()) {
      toast.error("Image URL is required");
      return;
    }

    startTransition(async () => {
      const data = {
        title: title.trim(),
        description: description.trim(),
        longDescription: longDescription.trim() || undefined,
        imageUrl: imageUrl.trim(),
        technologies,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        featured,
        status,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
      };

      const result = isEditing
        ? await updateProject(project.id, data)
        : await createProject(data);

      if (result.success) {
        toast.success(isEditing ? "Project updated" : "Project created");
        router.push("/admin/projects");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  const handleSaveAsDraft = () => {
    setStatus("DRAFT");
    // Submit form after state update
    setTimeout(() => {
      document.getElementById("project-form")?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }, 0);
  };

  const handlePublish = () => {
    setStatus("PUBLISHED");
    setTimeout(() => {
      document.getElementById("project-form")?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }, 0);
  };

  return (
    <form id="project-form" onSubmit={handleSubmit}>
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
        <div className="flex items-center gap-3">
          {isEditing && project.status === "PUBLISHED" && (
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "border border-border text-foreground",
                "hover:bg-background-tertiary transition-colors"
              )}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Link>
          )}
          <button
            type="button"
            onClick={handleSaveAsDraft}
            disabled={isPending}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "border border-border text-foreground",
              "hover:bg-background-tertiary transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPending}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-accent text-white font-medium",
              "hover:bg-accent-hover transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>Publish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Project title"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Short Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg resize-none",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Brief description for cards"
                  required
                />
              </div>

              {/* Long Description */}
              <div>
                <label
                  htmlFor="longDescription"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Description
                </label>
                <textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  rows={6}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg resize-none",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Detailed project description (supports markdown)"
                />
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Technologies
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Add technology (press Enter)"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className={cn(
                    "px-4 py-2.5 rounded-lg",
                    "bg-accent text-white",
                    "hover:bg-accent-hover transition-colors"
                  )}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                        "bg-accent/10 text-accent text-sm"
                      )}
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              SEO Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="seoTitle"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  SEO Title
                </label>
                <input
                  id="seoTitle"
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Leave empty to use project title"
                />
              </div>
              <div>
                <label
                  htmlFor="seoDescription"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  SEO Description
                </label>
                <textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg resize-none",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Leave empty to use project description"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Project Image
            </h2>
            <div className="space-y-4">
              {imageUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-background-tertiary">
                  <img
                    src={imageUrl}
                    alt="Project preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-background-tertiary flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-foreground-muted" />
                </div>
              )}
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                )}
                placeholder="Image URL"
              />
            </div>
          </div>

          {/* Links */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Links
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="liveUrl"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Live Demo URL
                </label>
                <input
                  id="liveUrl"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="githubUrl"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  GitHub URL
                </label>
                <input
                  id="githubUrl"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Options
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-sm text-foreground">Featured project</span>
              </label>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
