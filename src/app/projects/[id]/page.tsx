import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ButtonLink } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { contentTypeIcon } from "@/lib/domain/content-types";
import { OverviewPanel } from "@/features/projects/components/OverviewPanel";
import { StatusSelect } from "@/features/projects/components/StatusSelect";
import { AssetsPanel } from "@/features/assets/components/AssetsPanel";
import { GeneratePanel } from "@/features/generation/components/GeneratePanel";
import { ChecklistPanel } from "@/features/checklist/components/ChecklistPanel";
import { PublishKitPanel } from "@/features/export/components/PublishKitPanel";
import { getAiClient } from "@/lib/ai/client";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await prisma.contentProject.findUnique({
    where: { id: params.id },
    include: {
      brand: { select: { id: true, name: true } },
      assets: { orderBy: { createdAt: "desc" } },
      generatedAssets: { include: { versions: true }, orderBy: { createdAt: "desc" } },
      checklistItems: { orderBy: { order: "asc" } },
      _count: { select: { assets: true, generatedAssets: true, checklistItems: true } },
    },
  });
  if (!project) notFound();

  const tabs = [
    { key: "overview", label: "Overview", content: <OverviewPanel project={project} /> },
    {
      key: "assets",
      label: "Assets",
      badge: project._count.assets,
      content: <AssetsPanel projectId={project.id} assets={project.assets} />,
    },
    {
      key: "generate",
      label: "Generate",
      badge: project._count.generatedAssets,
      content: (
        <GeneratePanel
          projectId={project.id}
          usingStub={getAiClient().usingStub}
          generated={project.generatedAssets}
        />
      ),
    },
    {
      key: "checklist",
      label: "Checklist",
      badge: project._count.checklistItems,
      content: <ChecklistPanel items={project.checklistItems} />,
    },
    {
      key: "kit",
      label: "Publish Kit",
      content: (
        <PublishKitPanel
          projectId={project.id}
          assets={project.generatedAssets.map((a) => ({
            id: a.id,
            platform: a.platform,
            label: a.label,
            content: a.content,
            status: a.status,
          }))}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Link href="/projects" className="text-xs text-muted hover:text-fg">
          ← Projects
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface-2 text-2xl">
              {contentTypeIcon(project.contentType)}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-fg">{project.title}</h1>
              <p className="mt-1 text-sm text-muted">
                <Link href={`/brands/${project.brand.id}/edit`} className="hover:text-fg">
                  {project.brand.name}
                </Link>
                {project.subtitle ? ` · ${project.subtitle}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusSelect projectId={project.id} status={project.status} />
            <ButtonLink href={`/projects/${project.id}/edit`} variant="outline" size="sm">
              Edit
            </ButtonLink>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
