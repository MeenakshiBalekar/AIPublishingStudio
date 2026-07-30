import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/ui";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { updateProject, deleteProject } from "@/features/projects/actions";
import { parseStringArray } from "@/lib/utils/json";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, brands] = await Promise.all([
    prisma.contentProject.findUnique({ where: { id: params.id } }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, project.id);
  const boundDelete = deleteProject.bind(null, project.id);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Edit Project"
        action={
          <DeleteButton
            action={boundDelete}
            label="Delete Project"
            confirmText={`Delete “${project.title}”? This removes its assets and checklist too.`}
          />
        }
      />
      <ProjectForm
        action={boundUpdate}
        brands={brands}
        submitLabel="Save Changes"
        cancelHref={`/projects/${project.id}`}
        defaultValues={{
          brandId: project.brandId,
          contentType: project.contentType,
          title: project.title,
          subtitle: project.subtitle ?? "",
          topic: project.topic ?? "",
          ageGroup: project.ageGroup ?? "",
          description: project.description ?? "",
          keywords: parseStringArray(project.keywords).join(", "),
          language: project.language,
        }}
      />
    </div>
  );
}
