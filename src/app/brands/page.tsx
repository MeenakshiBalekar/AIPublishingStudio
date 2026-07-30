import { prisma } from "@/lib/db/prisma";
import { ButtonLink, EmptyState, PageHeader } from "@/components/ui";
import { BrandCard } from "@/features/brands/components/BrandCard";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Brands"
        subtitle="Each brand is the source of truth for every AI generation."
        action={<ButtonLink href="/brands/new">+ New Brand</ButtonLink>}
      />

      {brands.length === 0 ? (
        <EmptyState
          icon="🎨"
          title="No brands yet"
          description="Create your first brand profile. Its tone, audience, colors and keywords will power every asset you generate."
          action={<ButtonLink href="/brands/new">Create Brand</ButtonLink>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} projectCount={brand._count.projects} />
          ))}
        </div>
      )}
    </div>
  );
}
