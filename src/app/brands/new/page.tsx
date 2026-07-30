import { PageHeader } from "@/components/ui";
import { BrandForm } from "@/features/brands/components/BrandForm";
import { createBrand } from "@/features/brands/actions";

export default function NewBrandPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New Brand" subtitle="Set up the source of truth for this brand." />
      <BrandForm action={createBrand} submitLabel="Create Brand" />
    </div>
  );
}
