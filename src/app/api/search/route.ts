import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { contentTypeIcon, contentTypeLabel } from "@/lib/domain/content-types";

/**
 * Lightweight global search across projects and brands, powering the ⌘K command palette.
 * SQLite LIKE is case-insensitive for ASCII, so `contains` is sufficient here.
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (!q) return Response.json({ results: [] });

  const [projects, brands] = await Promise.all([
    prisma.contentProject.findMany({
      where: {
        OR: [{ title: { contains: q } }, { topic: { contains: q } }],
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: { id: true, title: true, contentType: true },
    }),
    prisma.brand.findMany({
      where: { name: { contains: q } },
      orderBy: { name: "asc" },
      take: 4,
      select: { id: true, name: true },
    }),
  ]);

  const results = [
    ...projects.map((p) => ({
      type: "project" as const,
      id: p.id,
      title: p.title,
      subtitle: contentTypeLabel(p.contentType),
      icon: contentTypeIcon(p.contentType),
      href: `/projects/${p.id}`,
    })),
    ...brands.map((b) => ({
      type: "brand" as const,
      id: b.id,
      title: b.name,
      subtitle: "Brand",
      icon: "🎨",
      href: `/brands/${b.id}/edit`,
    })),
  ];

  return Response.json({ results });
}
