import Link from "next/link";
import { Card, CardBody } from "@/components/ui";

export function StatTile({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number | string;
  icon: string;
  href?: string;
}) {
  const inner = (
    <Card className={href ? "transition-colors hover:border-primary/50" : undefined}>
      <CardBody className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-xl">
          {icon}
        </span>
        <div>
          <div className="text-2xl font-bold leading-none text-fg">{value}</div>
          <div className="mt-1 text-xs text-muted">{label}</div>
        </div>
      </CardBody>
    </Card>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
