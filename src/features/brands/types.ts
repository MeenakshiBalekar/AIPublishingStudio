import { z } from "zod";
import { splitList } from "@/lib/utils/json";

/**
 * The Brand form shape. This is the "source of truth" profile that every AI generation
 * inherits from. List-like fields are captured as comma/newline text in the UI and split
 * into arrays on save.
 */
export const brandFormSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string().optional().default(""),

  // Audience & voice
  targetAudience: z.string().optional().default(""),
  ageGroup: z.string().optional().default(""),
  writingTone: z.string().optional().default(""),
  voiceStyle: z.string().optional().default(""),
  ctaStyle: z.string().optional().default(""),

  // Visual identity
  colors: z.string().optional().default(""), // comma-separated hex
  fontHeading: z.string().optional().default(""),
  fontBody: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),
  coverStyle: z.string().optional().default(""),
  thumbnailStyle: z.string().optional().default(""),
  instagramStyle: z.string().optional().default(""),
  youtubeStyle: z.string().optional().default(""),

  // Marketing defaults
  preferredHashtags: z.string().optional().default(""),
  preferredKeywords: z.string().optional().default(""),
  emojiUsage: z.string().optional().default("moderate"),
  introText: z.string().optional().default(""),
  outroText: z.string().optional().default(""),
  watermark: z.string().optional().default(""),

  // Links & attribution
  instagramUrl: z.string().optional().default(""),
  youtubeUrl: z.string().optional().default(""),
  facebookUrl: z.string().optional().default(""),
  pinterestUrl: z.string().optional().default(""),
  website: z.string().optional().default(""),
  defaultAuthor: z.string().optional().default(""),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export const EMOJI_USAGE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "heavy", label: "Heavy" },
];

/** Convert validated form values into the Prisma create/update payload. */
export function brandFormToDbData(values: BrandFormValues) {
  const socialLinks = {
    instagram: values.instagramUrl || undefined,
    youtube: values.youtubeUrl || undefined,
    facebook: values.facebookUrl || undefined,
    pinterest: values.pinterestUrl || undefined,
  };
  const hasSocial = Object.values(socialLinks).some(Boolean);

  return {
    name: values.name.trim(),
    slug: slugify(values.name),
    description: values.description || null,
    targetAudience: values.targetAudience || null,
    ageGroup: values.ageGroup || null,
    writingTone: values.writingTone || null,
    voiceStyle: values.voiceStyle || null,
    ctaStyle: values.ctaStyle || null,
    colors: emptyToNull(JSON.stringify(splitList(values.colors))),
    fonts:
      values.fontHeading || values.fontBody
        ? JSON.stringify({ heading: values.fontHeading, body: values.fontBody })
        : null,
    logoUrl: values.logoUrl || null,
    coverStyle: values.coverStyle || null,
    thumbnailStyle: values.thumbnailStyle || null,
    instagramStyle: values.instagramStyle || null,
    youtubeStyle: values.youtubeStyle || null,
    preferredHashtags: emptyToNull(JSON.stringify(splitList(values.preferredHashtags))),
    preferredKeywords: emptyToNull(JSON.stringify(splitList(values.preferredKeywords))),
    emojiUsage: values.emojiUsage || null,
    introText: values.introText || null,
    outroText: values.outroText || null,
    watermark: values.watermark || null,
    socialLinks: hasSocial ? JSON.stringify(socialLinks) : null,
    website: values.website || null,
    defaultAuthor: values.defaultAuthor || null,
  };
}

function emptyToNull(json: string): string | null {
  // JSON.stringify([]) === "[]" — treat an empty list as null
  return json === "[]" ? null : json;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
