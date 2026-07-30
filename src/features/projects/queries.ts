import { prisma } from "@/lib/db/prisma";
import type { ProjectCardData } from "./components/ProjectCard";

/** Fetch projects as card-ready data (with brand name + checklist progress). */
export async function getProjectCards(options?: {
  brandId?: string;
  status?: string;
  take?: number;
}): Promise<ProjectCardData[]> {
  const projects = await prisma.contentProject.findMany({
    where: {
      brandId: options?.brandId,
      status: options?.status,
    },
    orderBy: { updatedAt: "desc" },
    take: options?.take,
    include: {
      brand: { select: { name: true } },
      checklistItems: { select: { done: true } },
    },
  });

  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    contentType: p.contentType,
    status: p.status,
    brandName: p.brand.name,
    doneCount: p.checklistItems.filter((c) => c.done).length,
    totalCount: p.checklistItems.length,
  }));
}
