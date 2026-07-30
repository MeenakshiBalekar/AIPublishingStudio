import type { Brand } from "@prisma/client";
import { parseJson, parseStringArray } from "@/lib/utils/json";
import type { BrandFormValues } from "./types";

/**
 * A Brand with its JSON-string fields parsed into real structures. This is the shape the
 * prompt engine and UI consume — the raw DB record is never read directly elsewhere.
 */
export interface ResolvedBrand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  targetAudience: string | null;
  ageGroup: string | null;
  writingTone: string | null;
  voiceStyle: string | null;
  ctaStyle: string | null;
  colors: string[];
  fonts: { heading?: string; body?: string };
  logoUrl: string | null;
  coverStyle: string | null;
  thumbnailStyle: string | null;
  instagramStyle: string | null;
  youtubeStyle: string | null;
  preferredHashtags: string[];
  preferredKeywords: string[];
  emojiUsage: string | null;
  introText: string | null;
  outroText: string | null;
  watermark: string | null;
  socialLinks: Record<string, string | undefined>;
  website: string | null;
  defaultAuthor: string | null;
}

export function resolveBrand(brand: Brand): ResolvedBrand {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    targetAudience: brand.targetAudience,
    ageGroup: brand.ageGroup,
    writingTone: brand.writingTone,
    voiceStyle: brand.voiceStyle,
    ctaStyle: brand.ctaStyle,
    colors: parseStringArray(brand.colors),
    fonts: parseJson(brand.fonts, {} as { heading?: string; body?: string }),
    logoUrl: brand.logoUrl,
    coverStyle: brand.coverStyle,
    thumbnailStyle: brand.thumbnailStyle,
    instagramStyle: brand.instagramStyle,
    youtubeStyle: brand.youtubeStyle,
    preferredHashtags: parseStringArray(brand.preferredHashtags),
    preferredKeywords: parseStringArray(brand.preferredKeywords),
    emojiUsage: brand.emojiUsage,
    introText: brand.introText,
    outroText: brand.outroText,
    watermark: brand.watermark,
    socialLinks: parseJson(brand.socialLinks, {} as Record<string, string | undefined>),
    website: brand.website,
    defaultAuthor: brand.defaultAuthor,
  };
}

/** Populate the edit form from an existing Brand record. */
export function brandToFormValues(brand: Brand): BrandFormValues {
  const r = resolveBrand(brand);
  return {
    name: r.name,
    description: r.description ?? "",
    targetAudience: r.targetAudience ?? "",
    ageGroup: r.ageGroup ?? "",
    writingTone: r.writingTone ?? "",
    voiceStyle: r.voiceStyle ?? "",
    ctaStyle: r.ctaStyle ?? "",
    colors: r.colors.join(", "),
    fontHeading: r.fonts.heading ?? "",
    fontBody: r.fonts.body ?? "",
    logoUrl: r.logoUrl ?? "",
    coverStyle: r.coverStyle ?? "",
    thumbnailStyle: r.thumbnailStyle ?? "",
    instagramStyle: r.instagramStyle ?? "",
    youtubeStyle: r.youtubeStyle ?? "",
    preferredHashtags: r.preferredHashtags.join(", "),
    preferredKeywords: r.preferredKeywords.join(", "),
    emojiUsage: r.emojiUsage ?? "moderate",
    introText: r.introText ?? "",
    outroText: r.outroText ?? "",
    watermark: r.watermark ?? "",
    instagramUrl: r.socialLinks.instagram ?? "",
    youtubeUrl: r.socialLinks.youtube ?? "",
    facebookUrl: r.socialLinks.facebook ?? "",
    pinterestUrl: r.socialLinks.pinterest ?? "",
    website: r.website ?? "",
    defaultAuthor: r.defaultAuthor ?? "",
  };
}
