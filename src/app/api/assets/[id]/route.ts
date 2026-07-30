import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { storage } from "@/lib/storage";

/**
 * Streams a stored asset back to the browser. Uploaded files live outside /public (they're
 * user content), so they're served through this authenticated-capable route instead.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const asset = await prisma.asset.findUnique({ where: { id: params.id } });
  if (!asset) return new Response("Not found", { status: 404 });

  try {
    const data = await storage.read(asset.storagePath);
    return new Response(data as unknown as BodyInit, {
      headers: {
        "Content-Type": asset.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(asset.fileName)}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("File unavailable", { status: 410 });
  }
}
