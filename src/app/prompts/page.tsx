import { Card, CardBody, PageHeader } from "@/components/ui";
import { servicesGroupedByPlatform } from "@/lib/ai/registry";
import { platformIcon, platformLabel } from "@/lib/domain/platforms";
import { PromptTemplateView } from "@/features/prompts/components/PromptTemplateView";

/**
 * The Prompt Library. Every AI service is backed by a reusable prompt template that inherits
 * values from the selected Brand Profile automatically via {{brand.*}} placeholders — so the
 * same prompt works across every brand with no rewriting. This page surfaces that library.
 */
export default function PromptsPage() {
  const groups = servicesGroupedByPlatform();

  return (
    <div>
      <PageHeader
        title="Prompt Library"
        subtitle="Reusable prompts that inherit your Brand Profile automatically."
      />

      <Card className="mb-6">
        <CardBody className="text-sm text-muted">
          Every prompt below uses{" "}
          <span className="rounded bg-primary/15 px-1 text-primary">{"{{placeholders}}"}</span>{" "}
          that are filled in from the selected brand and project at generation time. Update a
          Brand Profile once and every prompt adapts — no per-brand rewriting.
        </CardBody>
      </Card>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.platform}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
              <span>{platformIcon(group.platform)}</span>
              {platformLabel(group.platform)}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {group.services.map((service) => (
                <PromptTemplateView key={service.key} service={service} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
