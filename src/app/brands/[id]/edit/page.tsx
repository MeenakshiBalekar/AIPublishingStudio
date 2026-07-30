import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/ui";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { BrandForm } from "@/features/brands/components/BrandForm";
import { brandToFormValues } from "@/features/brands/mappers";
import { updateBrand, deleteBrand } from "@/features/brands/actions";

export const dynamic = "force-dynamic";

export default async function EditBrandPage({ params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({ where: { id: params.id } });
  if (!brand) notFound();

  const boundUpdate = updateBrand.bind(null, brand.id);
  const boundDelete = deleteBrand.bind(null, brand.id);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={`Edit ${brand.name}`}
        subtitle="Changes apply to every future generation for this brand."
        action={
          <DeleteButton
            action={boundDelete}
            label="Delete Brand"
            confirmText={`Delete “${brand.name}” and all its projects? This cannot be undone.`}
          />
        }
      />
      <BrandForm
        action={boundUpdate}
        defaultValues={brandToFormValues(brand)}
        submitLabel="Save Changes"
      />
    </div>
  );
}
