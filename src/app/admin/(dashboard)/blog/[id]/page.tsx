import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

async function getBlogPost(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) return null;

  return {
    ...post,
    tags: JSON.parse(post.tags) as string[],
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
        <p className="text-foreground-muted mt-1">
          Update blog post details
        </p>
      </div>

      {/* Form */}
      <BlogPostForm post={post} />
    </div>
  );
}
