import { Badge } from "@/components/ui";
import { statusLabel } from "@/lib/domain/content-types";

const TONE: Record<string, "default" | "primary" | "success" | "warning"> = {
  draft: "default",
  in_progress: "warning",
  completed: "success",
  archived: "default",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={TONE[status] ?? "default"}>{statusLabel(status)}</Badge>;
}
