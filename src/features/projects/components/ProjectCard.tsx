import Link from "next/link";
import { Card, CardBody, ProgressBar } from "@/components/ui";
import { contentTypeIcon, contentTypeLabel } from "@/lib/domain/content-types";
import { StatusBadge } from "./StatusBadge";

export interface ProjectCardData {
  id: string;
  title: string;
  contentType: string;
  status: string;
  brandName: string;
  doneCount: number;
  totalCount: number;
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const pct = project.totalCount ? (project.doneCount / project.totalCount) * 100 : 0;
  return (
    <Link href={`/projects/${project.id}`} className="group">
      <Card className="h-full transition-colors group-hover:border-primary/50">
        <CardBody>
          <div className="flex items-start justify-between gap-2">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-xl">
              {contentTypeIcon(project.contentType)}
            </span>
            <StatusBadge status={project.status} />
          </div>

          <h3 className="mt-3 line-clamp-2 font-semibold text-fg">{project.title}</h3>
          <p className="mt-0.5 text-xs text-muted">
            {project.brandName} · {contentTypeLabel(project.contentType)}
          </p>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-muted">
              <span>Publishing</span>
              <span>
                {project.doneCount}/{project.totalCount}
              </span>
            </div>
            <ProgressBar value={pct} />
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
