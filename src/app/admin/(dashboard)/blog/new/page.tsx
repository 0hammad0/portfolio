import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">New Blog Post</h1>
        <p className="text-foreground-muted mt-1">
          Create a new blog post
        </p>
      </div>

      {/* Form */}
      <BlogPostForm />
    </div>
  );
}
