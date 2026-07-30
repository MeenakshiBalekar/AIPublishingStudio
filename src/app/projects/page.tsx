import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ButtonLink, EmptyState, PageHeader } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { getProjectCards } from "@/features/projects/queries";
import { PROJECT_STATUSES } from "@/lib/domain/content-types";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status;
  const [projects, brandCount] = await Promise.all([
    getProjectCards({ status }),
    prisma.brand.count(),
  ]);

  const filters = [{ key: undefined, label: "All" }, ...PROJECT_STATUSES.map((s) => ({ key: s.key, label: s.label }))];

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Every piece of content you're publishing."
        action={<ButtonLink href="/projects/new">+ New Project</ButtonLink>}
      />

      {brandCount === 0 ? (
        <EmptyState
          icon="🎨"
          title="Create a brand first"
          description="Projects belong to a brand. Set up your first brand to get started."
          action={<ButtonLink href="/brands/new">Create Brand</ButtonLink>}
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {filters.map((f) => {
              const active = status === f.key || (!status && !f.key);
              return (
                <Link
                  key={f.label}
                  href={f.key ? `/projects?status=${f.key}` : "/projects"}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-fg"
                      : "bg-surface-2 text-muted hover:text-fg",
                  )}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon="🗂️"
              title="No projects here"
              description="Start a new project to generate publishing assets and track progress."
              action={<ButtonLink href="/projects/new">New Project</ButtonLink>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
