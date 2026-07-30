import type { AiService } from "./service";
import { AI_SERVICES } from "./services";
import { PLATFORMS, type PlatformKey } from "@/lib/domain/platforms";

/**
 * The service registry. The UI is generated from this, so new services appear automatically
 * once added to the catalog — no wiring required.
 */
const byKey = new Map<string, AiService>(AI_SERVICES.map((s) => [s.key, s]));

export function getService(key: string): AiService | undefined {
  return byKey.get(key);
}

export function listServices(): AiService[] {
  return AI_SERVICES;
}

export function listServicesByPlatform(platform: PlatformKey): AiService[] {
  return AI_SERVICES.filter((s) => s.platform === platform);
}

/** Services grouped by platform, in platform display order — drives the Generate UI. */
export function servicesGroupedByPlatform(): { platform: PlatformKey; services: AiService[] }[] {
  return PLATFORMS.map((p) => ({
    platform: p.key,
    services: listServicesByPlatform(p.key),
  })).filter((g) => g.services.length > 0);
}
