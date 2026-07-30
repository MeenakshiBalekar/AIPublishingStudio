import { prisma } from "@/lib/db/prisma";
import { ButtonLink, EmptyState, PageHeader } from "@/components/ui";
import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { createProject } from "@/features/projects/actions";

export const dynamic = "force-dynamic";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: { brandId?: string };
}) {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (brands.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="New Project" />
        <EmptyState
          icon="🎨"
          title="Create a brand first"
          description="Projects belong to a brand. Set up your first brand to get started."
          action={<ButtonLink href="/brands/new">Create Brand</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New Project" subtitle="Step 1 — tell us about your content." />
      <ProjectForm
        action={createProject}
        brands={brands}
        defaultValues={{ brandId: searchParams.brandId, language: "English" }}
        submitLabel="Create Project"
      />
    </div>
  );
}
