import { Fragment } from "react";
import { Badge, Card, CardBody } from "@/components/ui";
import { extractPlaceholders } from "@/lib/prompt-engine/render";
import type { AiService } from "@/lib/ai/service";

/** Render a template string with {{placeholders}} visually highlighted. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(\{\{\s*[\w.]+\s*\}\})/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\{\{\s*[\w.]+\s*\}\}$/.test(part) ? (
          <span key={i} className="rounded bg-primary/15 px-1 text-primary">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function PromptTemplateView({ service }: { service: AiService }) {
  const placeholders = extractPlaceholders(service.promptTemplate);
  const brandVars = placeholders.filter((p) => p.startsWith("brand."));

  return (
    <Card>
      <CardBody className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-fg">{service.label}</h4>
          <p className="text-xs text-muted">{service.description}</p>
        </div>

        <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-2 p-3 font-sans text-xs leading-relaxed text-fg">
          <Highlighted text={service.promptTemplate} />
        </pre>

        {brandVars.length > 0 && (
          <div>
            <div className="mb-1 text-xs font-medium text-muted">Inherits from brand</div>
            <div className="flex flex-wrap gap-1">
              {brandVars.map((v) => (
                <Badge key={v} tone="primary">
                  {v.replace("brand.", "")}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
