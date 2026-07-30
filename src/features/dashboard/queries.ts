import { prisma } from "@/lib/db/prisma";
import { getProjectCards } from "@/features/projects/queries";

/** All the data the dashboard needs, gathered in one place. */
export async function getDashboardData() {
  const [
    brandCount,
    projectCount,
    draftCount,
    inProgressCount,
    completedCount,
    checklistTotals,
    recentProjects,
    inProgressProjects,
    upcomingTasks,
    recentActivity,
    brandStats,
  ] = await Promise.all([
    prisma.brand.count(),
    prisma.contentProject.count(),
    prisma.contentProject.count({ where: { status: "draft" } }),
    prisma.contentProject.count({ where: { status: "in_progress" } }),
    prisma.contentProject.count({ where: { status: "completed" } }),
    prisma.checklistItem.groupBy({ by: ["done"], _count: true }),
    getProjectCards({ take: 6 }),
    getProjectCards({ status: "in_progress", take: 4 }),
    // Upcoming publishing tasks: next incomplete checklist items across projects.
    prisma.checklistItem.findMany({
      where: { done: false, project: { status: { not: "archived" } } },
      orderBy: [{ project: { updatedAt: "desc" } }, { order: "asc" }],
      take: 8,
      include: { project: { select: { id: true, title: true } } },
    }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { projects: true } } },
    }),
  ]);

  const doneItems = checklistTotals.find((t) => t.done)?._count ?? 0;
  const openItems = checklistTotals.find((t) => !t.done)?._count ?? 0;
  const totalItems = doneItems + openItems;

  return {
    brandCount,
    projectCount,
    draftCount,
    inProgressCount,
    completedCount,
    publishingProgress: totalItems ? (doneItems / totalItems) * 100 : 0,
    doneItems,
    totalItems,
    recentProjects,
    inProgressProjects,
    upcomingTasks: upcomingTasks.map((t) => ({
      id: t.id,
      label: t.label,
      projectId: t.project.id,
      projectTitle: t.project.title,
    })),
    recentActivity: recentActivity.map((a) => ({
      id: a.id,
      action: a.action,
      message: a.message,
      createdAt: a.createdAt.toISOString(),
    })),
    brandStats: brandStats.map((b) => ({
      id: b.id,
      name: b.name,
      projectCount: b._count.projects,
    })),
  };
}
