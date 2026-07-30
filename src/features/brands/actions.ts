"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { logActivity } from "@/lib/db/activity";
import { brandFormSchema, brandFormToDbData, slugify } from "./types";

export interface ActionState {
  error?: string;
}

/** Ensure the generated slug is unique (append -2, -3, … on collision). */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || "brand";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createBrand(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = brandFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const data = brandFormToDbData(parsed.data);
  data.slug = await uniqueSlug(slugify(parsed.data.name));

  const brand = await prisma.brand.create({ data });
  await logActivity({
    action: "brand_created",
    message: `Created brand “${brand.name}”`,
  });

  revalidatePath("/brands");
  redirect(`/brands`);
}

export async function updateBrand(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = brandFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const data = brandFormToDbData(parsed.data);
  data.slug = await uniqueSlug(slugify(parsed.data.name), id);

  await prisma.brand.update({ where: { id }, data });
  await logActivity({
    action: "brand_updated",
    message: `Updated brand “${data.name}”`,
  });

  revalidatePath("/brands");
  revalidatePath(`/brands/${id}`);
  redirect("/brands");
}

export async function deleteBrand(id: string): Promise<void> {
  const brand = await prisma.brand.findUnique({ where: { id } });
  await prisma.brand.delete({ where: { id } });
  if (brand) {
    await logActivity({ action: "brand_deleted", message: `Deleted brand “${brand.name}”` });
  }
  revalidatePath("/brands");
  redirect("/brands");
}
