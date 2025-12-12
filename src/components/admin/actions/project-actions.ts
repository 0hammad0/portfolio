"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

interface ProjectInput {
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export async function createProject(data: ProjectInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slug = slugify(data.title, { lower: true, strict: true });

    // Check if slug exists
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A project with this title already exists" };
    }

    // Get max order
    const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
    const order = (maxOrder._max.order ?? -1) + 1;

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        longDescription: data.longDescription,
        imageUrl: data.imageUrl,
        technologies: JSON.stringify(data.technologies),
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        featured: data.featured ?? false,
        status: (data.status as "DRAFT" | "PUBLISHED" | "ARCHIVED") ?? "DRAFT",
        order,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");

    return { success: true, project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Project not found" };
    }

    // Generate new slug if title changed
    let slug = existing.slug;
    if (data.title && data.title !== existing.title) {
      slug = slugify(data.title, { lower: true, strict: true });
      const slugExists = await prisma.project.findFirst({
        where: { slug, NOT: { id } },
      });
      if (slugExists) {
        return { success: false, error: "A project with this title already exists" };
      }
    }

    const updateData: Record<string, unknown> = {
      ...data,
      slug,
    };

    if (data.technologies) {
      updateData.technologies = JSON.stringify(data.technologies);
    }

    // Set publishedAt when publishing
    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/");

    return { success: true, project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.project.delete({ where: { id } });

    revalidatePath("/admin/projects");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function toggleProjectFeatured(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return { success: false, error: "Project not found" };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");

    return { success: true, featured: updated.featured };
  } catch (error) {
    console.error("Error toggling featured:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function updateProjectStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updateData: Record<string, unknown> = {
      status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    };

    // Set publishedAt when publishing
    if (status === "PUBLISHED") {
      const existing = await prisma.project.findUnique({ where: { id } });
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    await prisma.project.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Failed to update project status" };
  }
}

export async function reorderProjects(items: { id: string; order: number }[]) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/admin/projects");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error reordering projects:", error);
    return { success: false, error: "Failed to reorder projects" };
  }
}
