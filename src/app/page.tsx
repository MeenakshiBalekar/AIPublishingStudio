import Link from "next/link";
import {
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
  ProgressBar,
} from "@/components/ui";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { StatTile } from "@/features/dashboard/components/StatTile";
import { getDashboardData } from "@/features/dashboard/queries";
import { activityIcon, timeAgo } from "@/features/dashboard/activity-meta";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const d = await getDashboardData();

  // Empty state for a brand-new install.
  if (d.projectCount === 0 && d.brandCount === 0) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Your publishing operating system." />
        <EmptyState
          icon="✦"
          title="Welcome to AI Publishing Studio"
          description="Upload finished content and generate every asset you need to publish and market it. Start by creating a brand — it becomes the source of truth for every generation."
          action={<ButtonLink href="/brands/new">Create your first Brand</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your publishing operating system."
        action={<ButtonLink href="/projects/new">+ New Project</ButtonLink>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="In Progress" value={d.inProgressCount} icon="⏳" href="/projects?status=in_progress" />
        <StatTile label="Completed" value={d.completedCount} icon="✅" href="/projects?status=completed" />
        <StatTile label="Drafts" value={d.draftCount} icon="📝" href="/projects?status=draft" />
        <StatTile label="Brands" value={d.brandCount} icon="🎨" href="/brands" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overall publishing progress */}
          <Card>
            <CardBody>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-fg">Overall publishing progress</span>
                <span className="text-muted">
                  {d.doneItems} of {d.totalItems} tasks
                </span>
              </div>
              <ProgressBar value={d.publishingProgress} />
            </CardBody>
          </Card>

          {/* Recent projects */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-fg">Recent Projects</h2>
              <Link href="/projects" className="text-xs text-muted hover:text-fg">
                View all
              </Link>
            </div>
            {d.recentProjects.length === 0 ? (
              <EmptyState
                icon="🗂️"
                title="No projects yet"
                description="Start your first project to generate publishing assets."
                action={<ButtonLink href="/projects/new">New Project</ButtonLink>}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {d.recentProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Upcoming publishing tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardBody className="pt-2">
              {d.upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted">All caught up 🎉</p>
              ) : (
                <ul className="space-y-2">
                  {d.upcomingTasks.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/projects/${t.projectId}`}
                        className="flex items-start gap-2 text-sm text-fg hover:text-primary"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          {t.label}
                          <span className="block text-xs text-muted">{t.projectTitle}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* Brand statistics */}
          {d.brandStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Brand Statistics</CardTitle>
              </CardHeader>
              <CardBody className="pt-2">
                <ul className="space-y-2">
                  {d.brandStats.map((b) => (
                    <li key={b.id} className="flex items-center justify-between text-sm">
                      <Link href={`/brands/${b.id}/edit`} className="text-fg hover:text-primary">
                        {b.name}
                      </Link>
                      <span className="text-muted">{b.projectCount}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardBody className="pt-2">
              {d.recentActivity.length === 0 ? (
                <p className="text-sm text-muted">No activity yet.</p>
              ) : (
                <ul className="space-y-2.5">
                  {d.recentActivity.map((a) => (
                    <li key={a.id} className="flex items-start gap-2 text-sm">
                      <span>{activityIcon(a.action)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="text-fg">{a.message}</span>
                        <span className="block text-xs text-muted">{timeAgo(a.createdAt)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
