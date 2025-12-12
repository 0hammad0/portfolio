"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface SiteSettingsInput {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  ogImage?: string;
  favicon?: string;
  keywords: string[];
}

export async function updateSiteSettings(data: SiteSettingsInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.siteSettings.findFirst();

    const settingsData = {
      siteName: data.siteName,
      siteTitle: data.siteTitle,
      siteDescription: data.siteDescription,
      siteUrl: data.siteUrl,
      ogImage: data.ogImage || null,
      favicon: data.favicon || null,
      keywords: JSON.stringify(data.keywords),
    };

    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: settingsData,
      });
    } else {
      await prisma.siteSettings.create({
        data: settingsData,
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating site settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
