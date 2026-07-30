/** Icons for the recent-activity feed, keyed by action. */
const ICONS: Record<string, string> = {
  project_created: "🗂️",
  project_deleted: "🗑️",
  asset_uploaded: "📎",
  asset_generated: "✨",
  asset_edited: "✏️",
  checklist_completed: "✅",
  brand_created: "🎨",
  brand_updated: "🎨",
  brand_deleted: "🗑️",
};

export function activityIcon(action: string): string {
  return ICONS[action] ?? "•";
}

/** Compact relative time (e.g. "3h ago"). */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
