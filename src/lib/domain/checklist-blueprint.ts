/**
 * The publishing checklist blueprint. When a project is created, these items are seeded so
 * every project automatically tracks publishing progress (brief: "Every project should
 * automatically track publishing progress").
 *
 * `appliesTo` lets us tailor the checklist per content type later. `undefined` = always.
 * For now every project gets the full list; refine per content type as needed.
 */
import type { ContentTypeKey } from "./content-types";

export interface ChecklistBlueprintItem {
  key: string;
  label: string;
  category: "production" | "instagram" | "youtube" | "gumroad" | "kdp" | "pinterest" | "marketing";
  appliesTo?: ContentTypeKey[];
}

export const CHECKLIST_BLUEPRINT: ChecklistBlueprintItem[] = [
  // Production
  { key: "book_completed", label: "Content Completed", category: "production" },
  { key: "canva_edited", label: "Canva Edited", category: "production" },
  { key: "pdf_exported", label: "PDF Exported", category: "production" },
  { key: "cover_finalized", label: "Cover Finalized", category: "production" },
  // Instagram
  { key: "instagram_ready", label: "Instagram Ready", category: "instagram" },
  { key: "instagram_posted", label: "Instagram Posted", category: "instagram" },
  // YouTube
  { key: "youtube_uploaded", label: "YouTube Uploaded", category: "youtube" },
  // Gumroad
  { key: "gumroad_published", label: "Gumroad Published", category: "gumroad" },
  // KDP
  { key: "kdp_submitted", label: "KDP Submitted", category: "kdp" },
  // Pinterest
  { key: "pinterest_published", label: "Pinterest Published", category: "pinterest" },
  // Marketing
  { key: "marketing_completed", label: "Marketing Completed", category: "marketing" },
];

/** Build the concrete checklist rows for a given content type. */
export function buildChecklistForContentType(contentType: string) {
  return CHECKLIST_BLUEPRINT.filter(
    (item) => !item.appliesTo || item.appliesTo.includes(contentType as ContentTypeKey),
  ).map((item, index) => ({
    key: item.key,
    label: item.label,
    category: item.category,
    order: index,
  }));
}
