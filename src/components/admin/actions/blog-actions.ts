"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

interface BlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status?: string;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function createBlogPost(data: BlogPostInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slug = slugify(data.title, { lower: true, strict: true });

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A post with this title already exists" };
    }

    const readingTime = calculateReadingTime(data.content);
    const isPublished = data.status === "PUBLISHED";

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        tags: JSON.stringify(data.tags),
        status: (data.status as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED") ?? "DRAFT",
        published: isPublished,
        publishedAt: isPublished ? new Date() : null,
        readingTime,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: true, post };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { success: false, error: "Failed to create blog post" };
  }
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Post not found" };
    }

    // Generate new slug if title changed
    let slug = existing.slug;
    if (data.title && data.title !== existing.title) {
      slug = slugify(data.title, { lower: true, strict: true });
      const slugExists = await prisma.blogPost.findFirst({
        where: { slug, NOT: { id } },
      });
      if (slugExists) {
        return { success: false, error: "A post with this title already exists" };
      }
    }

    const updateData: Record<string, unknown> = {
      ...data,
      slug,
    };

    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags);
    }

    if (data.content) {
      updateData.readingTime = calculateReadingTime(data.content);
    }

    // Handle publishing
    const isPublished = data.status === "PUBLISHED";
    updateData.published = isPublished;

    if (isPublished && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${id}`);
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return { success: true, post };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { success: false, error: "Failed to update blog post" };
  }
}

export async function deleteBlogPost(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.blogPost.delete({ where: { id } });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

export async function updateBlogPostStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const isPublished = status === "PUBLISHED";
    const updateData: Record<string, unknown> = {
      status: status as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED",
      published: isPublished,
    };

    if (isPublished) {
      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Failed to update post status" };
  }
}

export async function getAllTags() {
  const posts = await prisma.blogPost.findMany({
    select: { tags: true },
  });

  const tagSet = new Set<string>();
  posts.forEach((post) => {
    const tags = JSON.parse(post.tags) as string[];
    tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
