import type { GeneratedAsset, AssetVersion } from "@prisma/client";
import { servicesGroupedByPlatform } from "@/lib/ai/registry";
import { platformIcon, platformLabel } from "@/lib/domain/platforms";
import { ServiceCard, type AssetView } from "./ServiceCard";

type AssetWithVersions = GeneratedAsset & { versions: AssetVersion[] };

/**
 * The Generate tab. Rendered entirely from the AI service registry grouped by platform, so
 * adding a new service to the catalog makes it appear here automatically.
 */
export function GeneratePanel({
  projectId,
  usingStub,
  generated,
}: {
  projectId: string;
  usingStub: boolean;
  generated: AssetWithVersions[];
}) {
  const byServiceKey = new Map<string, AssetView>(
    generated.map((g) => [
      g.serviceKey,
      {
        id: g.id,
        content: g.content,
        status: g.status,
        versions: g.versions
          .slice()
          .sort((a, b) => b.version - a.version)
          .map((v) => ({
            id: v.id,
            version: v.version,
            origin: v.origin,
            createdAt: v.createdAt.toISOString(),
          })),
      },
    ]),
  );

  const groups = servicesGroupedByPlatform();

  return (
    <div className="space-y-8">
      {usingStub && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          Running in sample mode — set <code>ANTHROPIC_API_KEY</code> to generate real,
          brand-aware content. The full workflow (generate, edit, version, mark final) works
          either way.
        </div>
      )}

      {groups.map((group) => (
        <section key={group.platform}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
            <span>{platformIcon(group.platform)}</span>
            {platformLabel(group.platform)}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {group.services.map((service) => (
              <ServiceCard
                key={service.key}
                projectId={projectId}
                service={{
                  key: service.key,
                  label: service.label,
                  description: service.description,
                }}
                asset={byServiceKey.get(service.key)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
