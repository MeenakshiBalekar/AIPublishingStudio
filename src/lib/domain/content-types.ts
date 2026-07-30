/**
 * Content types are DATA, not code branches. Adding a new one here makes it available
 * across the whole app (project creation, filtering, checklist blueprints) with no other
 * code changes. This is the mechanism that keeps the system from being "hardcoded for books".
 */
export const CONTENT_TYPES = [
  { key: "storybook", label: "Children's Story Book", icon: "📖" },
  { key: "coloring_book", label: "Coloring Book", icon: "🖍️" },
  { key: "activity_book", label: "Activity Book", icon: "🧩" },
  { key: "flash_cards", label: "Flash Cards", icon: "🃏" },
  { key: "rhymes", label: "Rhymes", icon: "🎵" },
  { key: "bedtime_story", label: "Bedtime Story", icon: "🌙" },
  { key: "youtube_video", label: "YouTube Video", icon: "▶️" },
  { key: "educational", label: "Educational Content", icon: "🎓" },
  { key: "printable", label: "Printable", icon: "🖨️" },
  { key: "other", label: "Other", icon: "✨" },
] as const;

export type ContentTypeKey = (typeof CONTENT_TYPES)[number]["key"];

export function contentTypeLabel(key: string): string {
  return CONTENT_TYPES.find((c) => c.key === key)?.label ?? key;
}

export function contentTypeIcon(key: string): string {
  return CONTENT_TYPES.find((c) => c.key === key)?.icon ?? "✨";
}

export const PROJECT_STATUSES = [
  { key: "draft", label: "Draft" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "archived", label: "Archived" },
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]["key"];

export function statusLabel(key: string): string {
  return PROJECT_STATUSES.find((s) => s.key === key)?.label ?? key;
}
