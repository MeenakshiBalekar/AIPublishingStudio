import type { PlatformKey } from "@/lib/domain/platforms";

/**
 * An AI service is a single generation task (a caption, a description, a set of tags…).
 *
 * Services are DATA: each is a config object with a default prompt template. Adding a new
 * generator means adding one object to the registry — no existing code changes (Open/Closed).
 * The heavy lifting (placeholder resolution, model call, persistence, versioning) is shared
 * infrastructure, so a service stays declarative.
 */
export interface AiService {
  /** Stable key, e.g. "instagram.caption". Stored on GeneratedAsset.serviceKey. */
  key: string;
  label: string;
  platform: PlatformKey;
  /** Fine-grained output kind, e.g. "caption", "description", "hashtags". */
  kind: string;
  /** One-line description shown in the UI. */
  description: string;
  /** System prompt establishing the model's role. Supports {{brand.*}} placeholders. */
  system: string;
  /** Prompt body with {{brand.*}} / {{project.*}} placeholders. */
  promptTemplate: string;
  /** Output token cap — these are short marketing artifacts, so intentionally small. */
  maxTokens?: number;
}
