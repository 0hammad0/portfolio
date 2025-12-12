"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface SkillCategoryInput {
  name: string;
  icon?: string;
  order?: number;
  visible?: boolean;
}

interface SkillInput {
  name: string;
  proficiency: number;
  icon?: string;
  categoryId: string;
  order?: number;
  visible?: boolean;
}

// Skill Categories
export async function createSkillCategory(data: SkillCategoryInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const maxOrder = await prisma.skillCategory.aggregate({ _max: { order: true } });
    const order = data.order ?? (maxOrder._max.order ?? -1) + 1;

    const category = await prisma.skillCategory.create({
      data: {
        name: data.name,
        icon: data.icon || null,
        order,
        visible: data.visible ?? true,
      },
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true, category };
  } catch (error) {
    console.error("Error creating skill category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateSkillCategory(id: string, data: Partial<SkillCategoryInput>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const category = await prisma.skillCategory.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true, category };
  } catch (error) {
    console.error("Error updating skill category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteSkillCategory(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.skillCategory.delete({ where: { id } });

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting skill category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// Skills
export async function createSkill(data: SkillInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const maxOrder = await prisma.skill.aggregate({
      _max: { order: true },
      where: { categoryId: data.categoryId },
    });
    const order = data.order ?? (maxOrder._max.order ?? -1) + 1;

    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        proficiency: data.proficiency,
        icon: data.icon || null,
        categoryId: data.categoryId,
        order,
        visible: data.visible ?? true,
      },
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true, skill };
  } catch (error) {
    console.error("Error creating skill:", error);
    return { success: false, error: "Failed to create skill" };
  }
}

export async function updateSkill(id: string, data: Partial<SkillInput>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const skill = await prisma.skill.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true, skill };
  } catch (error) {
    console.error("Error updating skill:", error);
    return { success: false, error: "Failed to update skill" };
  }
}

export async function deleteSkill(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.skill.delete({ where: { id } });

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { success: false, error: "Failed to delete skill" };
  }
}

// Reorder
export async function reorderSkillCategories(items: { id: string; order: number }[]) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.skillCategory.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error reordering categories:", error);
    return { success: false, error: "Failed to reorder categories" };
  }
}

export async function reorderSkills(items: { id: string; order: number }[]) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.skill.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error reordering skills:", error);
    return { success: false, error: "Failed to reorder skills" };
  }
}
