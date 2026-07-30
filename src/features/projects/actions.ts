"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { logActivity } from "@/lib/db/activity";
import { buildChecklistForContentType } from "@/lib/domain/checklist-blueprint";
import { projectFormSchema, projectFormToDbData } from "./types";

export interface ActionState {
  error?: string;
}

export async function createProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = projectFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const data = projectFormToDbData(parsed.data);

  // Create the project and auto-seed its publishing checklist in one transaction, so every
  // project tracks publishing progress from the moment it exists (brief requirement).
  const project = await prisma.contentProject.create({
    data: {
      ...data,
      status: "in_progress",
      checklistItems: {
        create: buildChecklistForContentType(data.contentType),
      },
    },
  });

  await logActivity({
    action: "project_created",
    projectId: project.id,
    message: `Created project “${project.title}”`,
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = projectFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  await prisma.contentProject.update({
    where: { id },
    data: projectFormToDbData(parsed.data),
  });

  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function updateProjectStatus(id: string, status: string): Promise<void> {
  await prisma.contentProject.update({ where: { id }, data: { status } });
  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
}

export async function deleteProject(id: string): Promise<void> {
  const project = await prisma.contentProject.findUnique({ where: { id } });
  await prisma.contentProject.delete({ where: { id } });
  if (project) {
    await logActivity({ action: "project_deleted", message: `Deleted project “${project.title}”` });
  }
  revalidatePath("/projects");
  redirect("/projects");
}
