/** Uploadable source asset kinds. Data-driven so new kinds are a one-line change. */
export const ASSET_KINDS = [
  { key: "pdf", label: "PDF", icon: "📄" },
  { key: "cover", label: "Cover", icon: "🖼️" },
  { key: "preview_image", label: "Preview Image", icon: "🌄" },
  { key: "illustration", label: "Illustration", icon: "🎨" },
  { key: "video", label: "Video", icon: "🎬" },
  { key: "audio", label: "Audio", icon: "🎧" },
  { key: "source_text", label: "Source Text", icon: "📝" },
  { key: "other", label: "Other", icon: "📎" },
] as const;

export type AssetKind = (typeof ASSET_KINDS)[number]["key"];

export function assetKindLabel(key: string): string {
  return ASSET_KINDS.find((k) => k.key === key)?.label ?? key;
}
export function assetKindIcon(key: string): string {
  return ASSET_KINDS.find((k) => k.key === key)?.icon ?? "📎";
}

export function formatBytes(bytes?: number | null): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
