import { Card, CardBody, CardHeader, CardTitle, Badge } from "@/components/ui";
import { contentTypeLabel } from "@/lib/domain/content-types";
import { parseStringArray } from "@/lib/utils/json";
import type { ContentProject } from "@prisma/client";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-2.5 last:border-0 sm:flex-row sm:gap-4">
      <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="text-sm text-fg">{value}</span>
    </div>
  );
}

export function OverviewPanel({ project }: { project: ContentProject }) {
  const keywords = parseStringArray(project.keywords);
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardBody className="pt-2">
          <Row label="Content Type" value={contentTypeLabel(project.contentType)} />
          <Row label="Subtitle" value={project.subtitle} />
          <Row label="Topic" value={project.topic} />
          <Row label="Age Group" value={project.ageGroup} />
          <Row label="Language" value={project.language} />
          <Row label="Description" value={project.description} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
        </CardHeader>
        <CardBody>
          {keywords.length ? (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k) => (
                <Badge key={k} tone="accent">
                  {k}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No keywords added.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
