"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { storage } from "@/lib/storage";
import { logActivity } from "@/lib/db/activity";

export interface UploadState {
  error?: string;
  ok?: boolean;
}

const MAX_BYTES = 25 * 1024 * 1024; // keep in sync with next.config serverActions bodySizeLimit

export async function uploadAsset(
  projectId: string,
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const file = formData.get("file");
  const kind = String(formData.get("kind") || "other");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "File exceeds the 25MB limit." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await storage.save({
    projectId,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    data: buffer,
  });

  await prisma.asset.create({
    data: {
      projectId,
      kind,
      fileName: file.name,
      storagePath: stored.path,
      mimeType: stored.mimeType,
      sizeBytes: stored.size,
    },
  });

  await logActivity({
    action: "asset_uploaded",
    projectId,
    message: `Uploaded ${file.name}`,
  });

  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function deleteAsset(assetId: string): Promise<void> {
  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset) return;

  await storage.remove(asset.storagePath);
  await prisma.asset.delete({ where: { id: assetId } });

  revalidatePath(`/projects/${asset.projectId}`);
}
