import { prisma } from "@/lib/db/prisma";
import { logActivity } from "@/lib/db/activity";
import { resolveBrand } from "@/features/brands/mappers";
import { renderTemplate } from "@/lib/prompt-engine/render";
import { contextVariables } from "./context";
import { getService } from "./registry";
import { getAiClient } from "./client";

/**
 * Run one generation: resolve the prompt from the service template + brand + project, call
 * the model, and persist the result as a GeneratedAsset with its first AssetVersion.
 *
 * Regeneration reuses the same GeneratedAsset row and appends a new version, so nothing is
 * ever lost (brief: "Version history should be maintained. Nothing should be regenerated
 * unless requested.").
 */
export async function runGeneration(projectId: string, serviceKey: string) {
  const service = getService(serviceKey);
  if (!service) throw new Error(`Unknown service: ${serviceKey}`);

  const project = await prisma.contentProject.findUnique({
    where: { id: projectId },
    include: { brand: true },
  });
  if (!project) throw new Error("Project not found");

  const vars = contextVariables({ brand: resolveBrand(project.brand), project });
  const prompt = renderTemplate(service.promptTemplate, vars);
  const system = renderTemplate(service.system, vars);

  const content = await getAiClient().generate({
    system,
    prompt,
    maxTokens: service.maxTokens,
  });

  // Upsert the GeneratedAsset for this (project, service) pair, appending a version.
  const existing = await prisma.generatedAsset.findFirst({
    where: { projectId, serviceKey },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  let generatedAsset;
  if (existing) {
    const nextVersion = (existing.versions[0]?.version ?? 0) + 1;
    generatedAsset = await prisma.generatedAsset.update({
      where: { id: existing.id },
      data: {
        content,
        versions: { create: { version: nextVersion, content, origin: "generated" } },
      },
    });
  } else {
    generatedAsset = await prisma.generatedAsset.create({
      data: {
        projectId,
        serviceKey,
        platform: service.platform,
        kind: service.kind,
        label: service.label,
        content,
        versions: { create: { version: 1, content, origin: "generated" } },
      },
    });
  }

  await logActivity({
    action: "asset_generated",
    projectId,
    message: `Generated ${service.label}`,
  });

  return generatedAsset;
}
