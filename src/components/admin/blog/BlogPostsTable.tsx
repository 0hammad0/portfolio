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
  Clock,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteBlogPost, updateBlogPostStatus } from "../actions/blog-actions";
import { formatDistanceToNow } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  status: string;
  views: number;
  readingTime: number | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogPostsTableProps {
  posts: BlogPost[];
}

export function BlogPostsTable({ posts }: BlogPostsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    startTransition(async () => {
      const result = await deleteBlogPost(id);
      if (result.success) {
        toast.success("Post deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete post");
      }
    });
  };

  const handleStatusChange = async (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateBlogPostStatus(id, status);
      if (result.success) {
        toast.success(`Post ${status.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update post");
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
      case "SCHEDULED":
        return "bg-blue-500/10 text-blue-500";
      case "ARCHIVED":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-muted mb-4">No blog posts yet</p>
        <Link href="/admin/blog/new" className="text-accent hover:underline">
          Create your first post
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-xl border border-border overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-background-tertiary text-sm font-medium text-foreground-muted border-b border-border">
        <div className="col-span-5">Post</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Views</div>
        <div className="col-span-1">Time</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <div
            key={post.id}
            className={cn(
              "grid grid-cols-12 gap-4 px-6 py-4 items-center",
              "hover:bg-background-tertiary/50 transition-colors",
              isPending && "opacity-50"
            )}
          >
            {/* Post Info */}
            <div className="col-span-5">
              <Link
                href={`/admin/blog/${post.id}`}
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                {post.title}
              </Link>
              <p className="text-sm text-foreground-muted truncate mt-0.5">
                {post.excerpt}
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-background rounded-md text-foreground-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span
                className={cn(
                  "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                  getStatusColor(post.status)
                )}
              >
                {post.status.toLowerCase()}
              </span>
              {post.publishedAt && (
                <p className="text-xs text-foreground-muted mt-1">
                  {formatDistanceToNow(new Date(post.publishedAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>

            {/* Views */}
            <div className="col-span-2">
              <span className="text-sm text-foreground">{post.views}</span>
              <span className="text-xs text-foreground-muted ml-1">views</span>
            </div>

            {/* Reading Time */}
            <div className="col-span-1">
              {post.readingTime && (
                <div className="flex items-center gap-1 text-sm text-foreground-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readingTime}m</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center justify-end gap-2">
              {post.status === "PUBLISHED" && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                  title="View post"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Link
                href={`/admin/blog/${post.id}`}
                className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Link>

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === post.id ? null : post.id)
                  }
                  className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {openMenuId === post.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-background-secondary border border-border rounded-lg shadow-lg z-50">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </Link>
                      {post.status !== "PUBLISHED" && (
                        <button
                          onClick={() =>
                            handleStatusChange(post.id, "PUBLISHED")
                          }
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Publish</span>
                        </button>
                      )}
                      {post.status === "PUBLISHED" && (
                        <button
                          onClick={() => handleStatusChange(post.id, "DRAFT")}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Unpublish</span>
                        </button>
                      )}
                      {post.status !== "ARCHIVED" && (
                        <button
                          onClick={() =>
                            handleStatusChange(post.id, "ARCHIVED")
                          }
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                        >
                          <Archive className="w-4 h-4" />
                          <span>Archive</span>
                        </button>
                      )}
                      <hr className="my-1 border-border" />
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
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
