import type { ContentProject } from "@prisma/client";
import type { ResolvedBrand } from "@/features/brands/mappers";
import { parseStringArray } from "@/lib/utils/json";
import { contentTypeLabel } from "@/lib/domain/content-types";

/**
 * Everything a generation needs. The brand is the source of truth; the project supplies the
 * specifics. Prompt templates reference these via {{brand.*}} / {{project.*}} placeholders,
 * so a prompt is written once and reused across brands with no rewriting.
 */
export interface GenerationContext {
  brand: ResolvedBrand;
  project: ContentProject;
}

/** Flatten the context into the variables a prompt template can reference. */
export function contextVariables(ctx: GenerationContext): Record<string, string> {
  const { brand, project } = ctx;
  return {
    // Brand (source of truth)
    "brand.name": brand.name,
    "brand.description": brand.description ?? "",
    "brand.targetAudience": brand.targetAudience ?? "",
    "brand.ageGroup": brand.ageGroup ?? "",
    "brand.writingTone": brand.writingTone ?? "",
    "brand.voiceStyle": brand.voiceStyle ?? "",
    "brand.ctaStyle": brand.ctaStyle ?? "",
    "brand.emojiUsage": brand.emojiUsage ?? "moderate",
    "brand.hashtags": brand.preferredHashtags.join(" "),
    "brand.keywords": brand.preferredKeywords.join(", "),
    "brand.introText": brand.introText ?? "",
    "brand.outroText": brand.outroText ?? "",
    "brand.watermark": brand.watermark ?? "",
    "brand.website": brand.website ?? "",
    "brand.defaultAuthor": brand.defaultAuthor ?? brand.name,

    // Project (the specifics)
    "project.title": project.title,
    "project.subtitle": project.subtitle ?? "",
    "project.topic": project.topic ?? "",
    "project.ageGroup": project.ageGroup ?? brand.ageGroup ?? "",
    "project.description": project.description ?? "",
    "project.keywords": parseStringArray(project.keywords).join(", "),
    "project.language": project.language,
    "project.contentType": contentTypeLabel(project.contentType),
  };
}
