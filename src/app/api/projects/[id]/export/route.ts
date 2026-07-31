import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { buildJson, buildMarkdown, kitFileName } from "@/features/export/build-kit";

/**
 * Download a project's Publish Kit as a single file. ?format=md (default) or ?format=json.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const project = await prisma.contentProject.findUnique({
    where: { id: params.id },
    include: { generatedAssets: { orderBy: { createdAt: "asc" } } },
  });
  if (!project) return new Response("Not found", { status: 404 });

  const format = req.nextUrl.searchParams.get("format") === "json" ? "json" : "md";
  const input = { project, assets: project.generatedAssets };

  const body =
    format === "json"
      ? JSON.stringify(buildJson(input), null, 2)
      : buildMarkdown(input);
  const contentType = format === "json" ? "application/json" : "text/markdown";
  const fileName = kitFileName(project, format);

  return new Response(body, {
    headers: {
      "Content-Type": `${contentType}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
