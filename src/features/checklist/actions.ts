"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { logActivity } from "@/lib/db/activity";

/** Toggle a checklist item's done state, stamping/clearing the completion time. */
export async function toggleChecklistItem(itemId: string, done: boolean): Promise<void> {
  const item = await prisma.checklistItem.update({
    where: { id: itemId },
    data: { done, completedAt: done ? new Date() : null },
  });

  if (done) {
    await logActivity({
      action: "checklist_completed",
      projectId: item.projectId,
      message: `Completed “${item.label}”`,
    });
  }

  // If every item is done, mark the project completed automatically.
  if (done) {
    const remaining = await prisma.checklistItem.count({
      where: { projectId: item.projectId, done: false },
    });
    if (remaining === 0) {
      await prisma.contentProject.update({
        where: { id: item.projectId },
        data: { status: "completed" },
      });
    }
  }

  revalidatePath(`/projects/${item.projectId}`);
}

/** Save a note against a checklist item. */
export async function updateChecklistNotes(itemId: string, notes: string): Promise<void> {
  const item = await prisma.checklistItem.update({
    where: { id: itemId },
    data: { notes: notes || null },
  });
  revalidatePath(`/projects/${item.projectId}`);
}
