"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function uploadMedia(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";
    const alt = formData.get("alt") as string | null;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // For now, we'll handle URL-based uploads or placeholder logic
    // In production, you would upload to Supabase Storage or similar
    const url = formData.get("url") as string;

    if (!url) {
      return { success: false, error: "No URL provided. File upload not implemented yet." };
    }

    const media = await prisma.media.create({
      data: {
        filename: file.name || url.split("/").pop() || "unknown",
        originalName: file.name || url.split("/").pop() || "unknown",
        mimeType: file.type || "image/jpeg",
        size: file.size || 0,
        url,
        alt,
        folder,
      },
    });

    revalidatePath("/admin/media");
    return { success: true, media };
  } catch (error) {
    console.error("Failed to upload media:", error);
    return { success: false, error: "Failed to upload media" };
  }
}

export async function createMediaFromUrl(data: {
  url: string;
  filename?: string;
  alt?: string;
  folder?: string;
}) {
  try {
    const filename = data.filename || data.url.split("/").pop() || "unknown";

    const media = await prisma.media.create({
      data: {
        filename,
        originalName: filename,
        mimeType: "image/jpeg", // Default, ideally detect from URL
        size: 0,
        url: data.url,
        alt: data.alt || null,
        folder: data.folder || "general",
      },
    });

    revalidatePath("/admin/media");
    return { success: true, media };
  } catch (error) {
    console.error("Failed to create media:", error);
    return { success: false, error: "Failed to create media" };
  }
}

export async function updateMedia(
  id: string,
  data: {
    alt?: string;
    folder?: string;
  }
) {
  try {
    const media = await prisma.media.update({
      where: { id },
      data: {
        alt: data.alt,
        folder: data.folder,
      },
    });

    revalidatePath("/admin/media");
    return { success: true, media };
  } catch (error) {
    console.error("Failed to update media:", error);
    return { success: false, error: "Failed to update media" };
  }
}

export async function deleteMedia(id: string) {
  try {
    // In production, also delete from storage provider
    await prisma.media.delete({
      where: { id },
    });

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media:", error);
    return { success: false, error: "Failed to delete media" };
  }
}

export async function bulkDeleteMedia(ids: string[]) {
  try {
    await prisma.media.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media:", error);
    return { success: false, error: "Failed to delete media" };
  }
}
