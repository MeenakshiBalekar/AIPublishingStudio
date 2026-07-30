"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { logActivity } from "@/lib/db/activity";
import { runGeneration } from "@/lib/ai/generate";

export interface GenerateState {
  error?: string;
}

/** Generate (or regenerate) an asset for a service. */
export async function generateAsset(
  projectId: string,
  serviceKey: string,
): Promise<GenerateState> {
  try {
    await runGeneration(projectId, serviceKey);
    revalidatePath(`/projects/${projectId}`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Generation failed" };
  }
}

/** Save an edited asset, recording a new version. */
export async function editAsset(assetId: string, content: string): Promise<void> {
  const asset = await prisma.generatedAsset.findUnique({
    where: { id: assetId },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });
  if (!asset) return;

  const nextVersion = (asset.versions[0]?.version ?? 0) + 1;
  await prisma.generatedAsset.update({
    where: { id: assetId },
    data: {
      content,
      versions: { create: { version: nextVersion, content, origin: "edited" } },
    },
  });

  await logActivity({
    action: "asset_edited",
    projectId: asset.projectId,
    message: `Edited ${asset.label}`,
  });
  revalidatePath(`/projects/${asset.projectId}`);
}

/** Toggle an asset between draft and final. */
export async function setAssetStatus(assetId: string, status: string): Promise<void> {
  const asset = await prisma.generatedAsset.update({
    where: { id: assetId },
    data: { status },
  });
  revalidatePath(`/projects/${asset.projectId}`);
}

/** Restore a previous version as the current content (recorded as a new version). */
export async function restoreVersion(assetId: string, versionId: string): Promise<void> {
  const version = await prisma.assetVersion.findUnique({ where: { id: versionId } });
  if (!version || version.generatedAssetId !== assetId) return;
  await editAsset(assetId, version.content);
}

export async function deleteGeneratedAsset(assetId: string): Promise<void> {
  const asset = await prisma.generatedAsset.findUnique({ where: { id: assetId } });
  if (!asset) return;
  await prisma.generatedAsset.delete({ where: { id: assetId } });
  revalidatePath(`/projects/${asset.projectId}`);
}
