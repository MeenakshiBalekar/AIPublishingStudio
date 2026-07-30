/**
 * Publishing platforms the studio produces assets for. Like content types, these are data
 * so new platforms (and their generation services) plug in without code changes elsewhere.
 */
export const PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: "📸", color: "#E1306C" },
  { key: "youtube", label: "YouTube", icon: "▶️", color: "#FF0000" },
  { key: "kdp", label: "Amazon KDP", icon: "📚", color: "#FF9900" },
  { key: "gumroad", label: "Gumroad", icon: "🛒", color: "#FF90E8" },
  { key: "pinterest", label: "Pinterest", icon: "📌", color: "#E60023" },
  { key: "facebook", label: "Facebook", icon: "👍", color: "#1877F2" },
  { key: "blog", label: "Blog", icon: "✍️", color: "#22C55E" },
  { key: "email", label: "Email", icon: "✉️", color: "#6366F1" },
] as const;

export type PlatformKey = (typeof PLATFORMS)[number]["key"];

export function platformLabel(key: string): string {
  return PLATFORMS.find((p) => p.key === key)?.label ?? key;
}

export function platformIcon(key: string): string {
  return PLATFORMS.find((p) => p.key === key)?.icon ?? "✨";
}

export function platformColor(key: string): string {
  return PLATFORMS.find((p) => p.key === key)?.color ?? "#888888";
}
