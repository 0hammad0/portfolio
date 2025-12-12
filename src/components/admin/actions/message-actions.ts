"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateMessageStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updateData: Record<string, unknown> = {
      status: status as "UNREAD" | "READ" | "REPLIED" | "ARCHIVED" | "SPAM",
    };

    if (status === "REPLIED") {
      updateData.repliedAt = new Date();
    }

    await prisma.contactSubmission.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/messages");

    return { success: true };
  } catch (error) {
    console.error("Error updating message status:", error);
    return { success: false, error: "Failed to update message" };
  }
}

export async function addMessageNote(id: string, notes: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { notes },
    });

    revalidatePath("/admin/messages");
    revalidatePath(`/admin/messages/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Error adding note:", error);
    return { success: false, error: "Failed to add note" };
  }
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.contactSubmission.delete({ where: { id } });

    revalidatePath("/admin/messages");

    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}

export async function bulkUpdateMessageStatus(ids: string[], status: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updateData: Record<string, unknown> = {
      status: status as "UNREAD" | "READ" | "REPLIED" | "ARCHIVED" | "SPAM",
    };

    if (status === "REPLIED") {
      updateData.repliedAt = new Date();
    }

    await prisma.contactSubmission.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    revalidatePath("/admin/messages");

    return { success: true };
  } catch (error) {
    console.error("Error bulk updating messages:", error);
    return { success: false, error: "Failed to update messages" };
  }
}

export async function bulkDeleteMessages(ids: string[]) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.contactSubmission.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/messages");

    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting messages:", error);
    return { success: false, error: "Failed to delete messages" };
  }
}
