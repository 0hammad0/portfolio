"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface AuthorProfileInput {
  name: string;
  role: string;
  bio: string;
  shortBio: string;
  location: string;
  email: string;
  avatar?: string;
  resumeUrl?: string;
  availability: string;
  heroRoles: string[];
}

interface SocialLinkInput {
  platform: string;
  url: string;
  label: string;
  icon: string;
  order?: number;
  visible?: boolean;
}

interface AboutStatsInput {
  label: string;
  value: number;
  suffix?: string;
  order?: number;
  visible?: boolean;
}

// Author Profile
export async function updateAuthorProfile(data: AuthorProfileInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Get or create profile
    const existing = await prisma.authorProfile.findFirst();

    const profileData = {
      name: data.name,
      role: data.role,
      bio: data.bio,
      shortBio: data.shortBio,
      location: data.location,
      email: data.email,
      avatar: data.avatar || null,
      resumeUrl: data.resumeUrl || null,
      availability: data.availability,
      heroRoles: JSON.stringify(data.heroRoles),
    };

    if (existing) {
      await prisma.authorProfile.update({
        where: { id: existing.id },
        data: profileData,
      });
    } else {
      await prisma.authorProfile.create({
        data: profileData,
      });
    }

    revalidatePath("/admin/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating author profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

// Social Links
export async function createSocialLink(data: SocialLinkInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const maxOrder = await prisma.socialLink.aggregate({ _max: { order: true } });
    const order = data.order ?? (maxOrder._max.order ?? -1) + 1;

    const link = await prisma.socialLink.create({
      data: {
        platform: data.platform,
        url: data.url,
        label: data.label,
        icon: data.icon,
        order,
        visible: data.visible ?? true,
      },
    });

    revalidatePath("/admin/profile");
    revalidatePath("/");

    return { success: true, link };
  } catch (error) {
    console.error("Error creating social link:", error);
    return { success: false, error: "Failed to create social link" };
  }
}

export async function updateSocialLink(id: string, data: Partial<SocialLinkInput>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const link = await prisma.socialLink.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/profile");
    revalidatePath("/");

    return { success: true, link };
  } catch (error) {
    console.error("Error updating social link:", error);
    return { success: false, error: "Failed to update social link" };
  }
}

export async function deleteSocialLink(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.socialLink.delete({ where: { id } });

    revalidatePath("/admin/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting social link:", error);
    return { success: false, error: "Failed to delete social link" };
  }
}

// About Stats
export async function createAboutStats(data: AboutStatsInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const maxOrder = await prisma.aboutStats.aggregate({ _max: { order: true } });
    const order = data.order ?? (maxOrder._max.order ?? -1) + 1;

    const stat = await prisma.aboutStats.create({
      data: {
        label: data.label,
        value: data.value,
        suffix: data.suffix || null,
        order,
        visible: data.visible ?? true,
      },
    });

    revalidatePath("/admin/profile");
    revalidatePath("/");

    return { success: true, stat };
  } catch (error) {
    console.error("Error creating about stat:", error);
    return { success: false, error: "Failed to create stat" };
  }
}

export async function updateAboutStats(id: string, data: Partial<AboutStatsInput>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const stat = await prisma.aboutStats.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/profile");
    revalidatePath("/");

    return { success: true, stat };
  } catch (error) {
    console.error("Error updating about stat:", error);
    return { success: false, error: "Failed to update stat" };
  }
}

export async function deleteAboutStats(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.aboutStats.delete({ where: { id } });

    revalidatePath("/admin/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting about stat:", error);
    return { success: false, error: "Failed to delete stat" };
  }
}
