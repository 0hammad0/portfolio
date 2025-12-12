import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils/cn";
import { Plus } from "lucide-react";
import { BlogPostsTable } from "@/components/admin/blog/BlogPostsTable";

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return posts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags) as string[],
  }));
}

function BlogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-background-secondary rounded-lg mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-background-secondary rounded-lg mb-2" />
      ))}
    </div>
  );
}

async function BlogContent() {
  const posts = await getBlogPosts();

  return <BlogPostsTable posts={posts} />;
}

export default function AdminBlogPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-foreground-muted mt-1">
            Manage your blog content
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-accent text-white font-medium",
            "hover:bg-accent-hover transition-colors"
          )}
        >
          <Plus className="w-5 h-5" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Content */}
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent />
      </Suspense>
    </div>
  );
}
