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
import { createBlogPost, updateBlogPost } from "../actions/blog-actions";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

interface BlogPostFormProps {
  post?: BlogPost;
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!post;

  // Form state
  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState(post?.status || "DRAFT");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(
    post?.seoDescription || ""
  );

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!excerpt.trim()) {
      toast.error("Excerpt is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    startTransition(async () => {
      const data = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: coverImage.trim() || undefined,
        tags,
        status,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
      };

      const result = isEditing
        ? await updateBlogPost(post.id, data)
        : await createBlogPost(data);

      if (result.success) {
        toast.success(isEditing ? "Post updated" : "Post created");
        router.push("/admin/blog");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  const handleSaveAsDraft = () => {
    setStatus("DRAFT");
    setTimeout(() => {
      document.getElementById("blog-form")?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }, 0);
  };

  const handlePublish = () => {
    setStatus("PUBLISHED");
    setTimeout(() => {
      document.getElementById("blog-form")?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }, 0);
  };

  return (
    <form id="blog-form" onSubmit={handleSubmit}>
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/blog"
          className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Posts</span>
        </Link>
        <div className="flex items-center gap-3">
          {isEditing && post.status === "PUBLISHED" && (
            <Link
              href={`/blog/${post.slug}`}
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
              Post Content
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
                  placeholder="Post title"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg resize-none",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Brief description for post cards"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Content * (Markdown supported)
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg font-mono text-sm",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Write your post content in Markdown..."
                  required
                />
              </div>
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
                  placeholder="Leave empty to use post title"
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
                  placeholder="Leave empty to use post excerpt"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Cover Image
            </h2>
            <div className="space-y-4">
              {coverImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-background-tertiary">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
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
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
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

          {/* Tags */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tags</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                  placeholder="Add tag (press Enter)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={cn(
                    "px-4 py-2.5 rounded-lg",
                    "bg-accent text-white",
                    "hover:bg-accent-hover transition-colors"
                  )}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                        "bg-accent/10 text-accent text-sm"
                      )}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
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

          {/* Status */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Status
            </h2>
            <select
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
    </form>
  );
}
