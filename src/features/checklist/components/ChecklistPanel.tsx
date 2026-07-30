import type { ChecklistItem } from "@prisma/client";
import { Card, CardBody, CardHeader, CardTitle, ProgressBar } from "@/components/ui";
import { ChecklistRow } from "./ChecklistRow";

const CATEGORY_LABELS: Record<string, string> = {
  production: "Production",
  instagram: "Instagram",
  youtube: "YouTube",
  gumroad: "Gumroad",
  kdp: "Amazon KDP",
  pinterest: "Pinterest",
  marketing: "Marketing",
};

const CATEGORY_ORDER = [
  "production",
  "instagram",
  "youtube",
  "gumroad",
  "kdp",
  "pinterest",
  "marketing",
];

export function ChecklistPanel({ items }: { items: ChecklistItem[] }) {
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? (done / items.length) * 100 : 0;

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: items
      .filter((i) => i.category === category)
      .sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-5">
      <Card>
        <CardBody>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-fg">Publishing progress</span>
            <span className="text-muted">
              {done} of {items.length} complete
            </span>
          </div>
          <ProgressBar value={pct} />
        </CardBody>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        {grouped.map((group) => (
          <Card key={group.category}>
            <CardHeader>
              <CardTitle>{CATEGORY_LABELS[group.category] ?? group.category}</CardTitle>
            </CardHeader>
            <CardBody className="pt-1">
              {group.items.map((item) => (
                <ChecklistRow
                  key={item.id}
                  item={{
                    id: item.id,
                    label: item.label,
                    done: item.done,
                    completedAt: item.completedAt ? item.completedAt.toISOString() : null,
                    notes: item.notes,
                  }}
                />
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
