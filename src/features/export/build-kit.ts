import type { ContentProject, GeneratedAsset } from "@prisma/client";
import { PLATFORMS, platformLabel } from "@/lib/domain/platforms";
import { contentTypeLabel } from "@/lib/domain/content-types";

/**
 * Assemble a "Publish Kit" from a project and its generated assets. This is the bridge
 * between content generated in the studio and content pasted into each platform — the
 * repetitive step the app exists to eliminate.
 */
export interface KitInput {
  project: ContentProject;
  assets: Pick<GeneratedAsset, "platform" | "label" | "content" | "status">[];
}

/** Group assets by platform in the platform display order. */
export function groupAssetsByPlatform(assets: KitInput["assets"]) {
  return PLATFORMS.map((p) => ({
    platform: p.key,
    label: p.label,
    icon: p.icon,
    assets: assets.filter((a) => a.platform === p.key),
  })).filter((g) => g.assets.length > 0);
}

/** Render the whole kit as a single Markdown document. */
export function buildMarkdown({ project, assets }: KitInput): string {
  const lines: string[] = [];
  lines.push(`# ${project.title}`);
  if (project.subtitle) lines.push(`*${project.subtitle}*`);
  lines.push("");
  lines.push(`- **Type:** ${contentTypeLabel(project.contentType)}`);
  if (project.topic) lines.push(`- **Topic:** ${project.topic}`);
  if (project.ageGroup) lines.push(`- **Age group:** ${project.ageGroup}`);
  lines.push(`- **Language:** ${project.language}`);
  lines.push("");

  const groups = groupAssetsByPlatform(assets);
  if (groups.length === 0) {
    lines.push("_No assets generated yet._");
  }
  for (const group of groups) {
    lines.push(`## ${group.label}`);
    lines.push("");
    for (const asset of group.assets) {
      lines.push(`### ${asset.label}`);
      lines.push("");
      lines.push(asset.content.trim());
      lines.push("");
    }
  }
  return lines.join("\n").trim() + "\n";
}

/** Render the kit as structured JSON. */
export function buildJson({ project, assets }: KitInput) {
  return {
    project: {
      id: project.id,
      title: project.title,
      subtitle: project.subtitle,
      contentType: project.contentType,
      topic: project.topic,
      ageGroup: project.ageGroup,
      language: project.language,
    },
    assets: assets.map((a) => ({
      platform: a.platform,
      platformLabel: platformLabel(a.platform),
      label: a.label,
      status: a.status,
      content: a.content,
    })),
  };
}

/** A filesystem-safe slug for the download filename. */
export function kitFileName(project: ContentProject, ext: string): string {
  const base =
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "publish-kit";
  return `${base}.${ext}`;
}
